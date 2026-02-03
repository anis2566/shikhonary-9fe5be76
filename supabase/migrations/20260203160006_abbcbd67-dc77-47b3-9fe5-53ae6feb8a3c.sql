-- Create bookmarks table for saving favorite questions
CREATE TABLE public.question_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'cq')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id, question_type)
);

-- Enable RLS
ALTER TABLE public.question_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
ON public.question_bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own bookmarks
CREATE POLICY "Users can create own bookmarks"
ON public.question_bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
ON public.question_bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_bookmarks_user_id ON public.question_bookmarks(user_id);
CREATE INDEX idx_bookmarks_question ON public.question_bookmarks(question_id, question_type);