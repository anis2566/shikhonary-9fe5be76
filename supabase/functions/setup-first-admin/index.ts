import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

type SetupBody =
  | {
      mode?: 'create'
      email: string
      password: string
      fullName: string
    }
  | {
      mode: 'promote_self'
    }

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Use service role client to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .in('role', ['super_admin', 'tenant_admin'])
      .limit(1)

    if (checkError) {
      throw new Error(`Failed to check existing admins: ${checkError.message}`)
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ error: 'An admin account already exists' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: SetupBody = await req.json().catch(() => ({ mode: 'create' } as any))
    const mode = (body as any).mode ?? 'create'

    // Mode 1: promote the currently signed-in user to be the first admin
    if (mode === 'promote_self') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Missing Authorization header' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validate JWT and extract user
      const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      })

      const { data, error } = await supabaseAuth.auth.getUser()
      if (error || !data.user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const user = data.user

      const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
        user_id: user.id,
        role: 'super_admin',
      })

      // Duplicate role is fine (idempotent)
      if (roleError && (roleError as any).code !== '23505') {
        throw new Error(`Failed to assign admin role: ${roleError.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'This account is now the first admin', userId: user.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mode 2: create a brand new admin account
    const { email, password, fullName } = body as Extract<SetupBody, { mode?: 'create' }>
    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    if (!userData.user) {
      throw new Error('User creation returned no user')
    }

    // Create profile (non-fatal if it fails)
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      user_id: userData.user.id,
      email,
      full_name: fullName,
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    // Assign super_admin role using service role (bypasses RLS)
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: userData.user.id,
      role: 'super_admin',
    })

    if (roleError) {
      // Rollback: delete the user if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
      throw new Error(`Failed to assign admin role: ${roleError.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Admin account created successfully', userId: userData.user.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Setup error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
