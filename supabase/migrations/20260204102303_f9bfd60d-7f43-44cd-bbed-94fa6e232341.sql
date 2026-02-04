-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM (
  'trial', 'active', 'past_due', 'canceled', 'expired'
);

-- Create subscription event type enum
CREATE TYPE public.subscription_event_type AS ENUM (
  'created', 'upgraded', 'downgraded', 'renewed', 'canceled', 'expired', 'payment_failed', 'payment_succeeded'
);

-- Create subscriptions table (tracks tenant's active subscription)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- Subscription period
  tier TEXT NOT NULL,
  status subscription_status NOT NULL DEFAULT 'trial',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  
  -- Pricing
  price_per_month INTEGER NOT NULL DEFAULT 0,
  price_per_year INTEGER,
  currency TEXT NOT NULL DEFAULT 'BDT',
  
  -- Billing cycle
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  
  -- Payment provider
  payment_provider TEXT,
  external_id TEXT,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription_history table (tracks all subscription changes)
CREATE TABLE public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  
  -- Event type
  event_type subscription_event_type NOT NULL,
  
  -- Previous and new values
  previous_tier TEXT,
  new_tier TEXT,
  previous_status TEXT,
  new_status TEXT,
  previous_billing_cycle TEXT,
  new_billing_cycle TEXT,
  previous_period_end TIMESTAMPTZ,
  new_period_end TIMESTAMPTZ,
  
  -- Event details
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  
  -- Who triggered this event
  triggered_by TEXT,
  triggered_by_ip TEXT
);

-- Create indexes for subscriptions
CREATE INDEX idx_subscriptions_tenant_id ON public.subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_current_period_end ON public.subscriptions(current_period_end);

-- Create indexes for subscription_history
CREATE INDEX idx_subscription_history_subscription_id ON public.subscription_history(subscription_id);
CREATE INDEX idx_subscription_history_tenant_id ON public.subscription_history(tenant_id);
CREATE INDEX idx_subscription_history_event_type ON public.subscription_history(event_type);
CREATE INDEX idx_subscription_history_created_at ON public.subscription_history(created_at);

-- Add updated_at trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (is_admin(auth.uid()));

-- RLS Policies for subscription_history
CREATE POLICY "Admins can view all subscription history"
  ON public.subscription_history FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert subscription history"
  ON public.subscription_history FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- No update/delete for history (immutable audit log)