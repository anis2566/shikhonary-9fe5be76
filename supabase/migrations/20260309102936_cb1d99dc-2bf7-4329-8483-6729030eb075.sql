
-- Create question_types table
CREATE TABLE public.question_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_types ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active question_types"
  ON public.question_types FOR SELECT
  USING ((is_active = true) OR is_admin(auth.uid()));

CREATE POLICY "Admins can insert question_types"
  ON public.question_types FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update question_types"
  ON public.question_types FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete question_types"
  ON public.question_types FOR DELETE
  USING (is_admin(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_question_types_updated_at
  BEFORE UPDATE ON public.question_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
