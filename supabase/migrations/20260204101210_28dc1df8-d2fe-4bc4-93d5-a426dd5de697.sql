-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Plan details
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing (multi-currency support)
    monthly_price_bdt INTEGER NOT NULL DEFAULT 0,
    yearly_price_bdt INTEGER NOT NULL DEFAULT 0,
    monthly_price_usd INTEGER NOT NULL DEFAULT 0,
    yearly_price_usd INTEGER NOT NULL DEFAULT 0,
    
    -- Limits
    student_limit INTEGER NOT NULL DEFAULT 10,
    teacher_limit INTEGER NOT NULL DEFAULT 2,
    storage_limit INTEGER NOT NULL DEFAULT 100,
    exam_limit INTEGER NOT NULL DEFAULT 20,
    
    -- Features (JSON for flexibility)
    features JSONB NOT NULL DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    
    -- Position for ordering
    position INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active subscription plans"
ON public.subscription_plans
FOR SELECT
USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can insert subscription plans"
ON public.subscription_plans
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update subscription plans"
ON public.subscription_plans
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete subscription plans"
ON public.subscription_plans
FOR DELETE
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.subscription_plans (name, display_name, description, monthly_price_bdt, yearly_price_bdt, monthly_price_usd, yearly_price_usd, student_limit, teacher_limit, storage_limit, exam_limit, features, is_popular, position)
VALUES 
    ('FREE', 'Free Plan', 'Perfect for getting started with basic features', 0, 0, 0, 0, 10, 2, 100, 20, '{"smsNotifications": false, "parentPortal": false, "customBranding": false, "analytics": false}', false, 0),
    ('STARTER', 'Starter Plan', 'Great for small coaching centers', 999, 9990, 12, 120, 50, 5, 500, 50, '{"smsNotifications": true, "parentPortal": false, "customBranding": false, "analytics": true}', false, 1),
    ('PRO', 'Professional Plan', 'Best for growing institutions', 2499, 24990, 30, 300, 200, 20, 2000, 200, '{"smsNotifications": true, "parentPortal": true, "customBranding": true, "analytics": true}', true, 2),
    ('ENTERPRISE', 'Enterprise Plan', 'For large schools and universities', 4999, 49990, 60, 600, 1000, 100, 10000, 1000, '{"smsNotifications": true, "parentPortal": true, "customBranding": true, "analytics": true, "apiAccess": true, "prioritySupport": true}', false, 3);