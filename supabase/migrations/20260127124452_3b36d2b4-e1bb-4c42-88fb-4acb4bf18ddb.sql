-- Remove foreign key and board_id column from classes
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_board_id_fkey;
ALTER TABLE public.classes DROP COLUMN IF EXISTS board_id;

-- Drop RLS policies for boards
DROP POLICY IF EXISTS "Admins can delete boards" ON public.boards;
DROP POLICY IF EXISTS "Admins can insert boards" ON public.boards;
DROP POLICY IF EXISTS "Admins can update boards" ON public.boards;
DROP POLICY IF EXISTS "Anyone can view active boards" ON public.boards;

-- Drop the boards table
DROP TABLE IF EXISTS public.boards;