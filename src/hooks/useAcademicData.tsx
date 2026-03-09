import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types matching database schema
export interface Class {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  class_id: string;
  name: string;
  display_name: string;
  description: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  display_name: string;
  description: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  chapter_id: string;
  name: string;
  display_name: string;
  description: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubTopic {
  id: string;
  topic_id: string;
  name: string;
  display_name: string;
  description: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mcq {
  id: string;
  sub_topic_id: string;
  question: string;
  options: { text: string }[];
  correct_answer: number;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  position: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cq {
  id: string;
  sub_topic_id: string;
  context: string;
  question_a: string;
  question_b: string;
  question_c: string;
  question_d: string;
  answer_a: string | null;
  answer_b: string | null;
  answer_c: string | null;
  answer_d: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  position: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Classes
export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('classes').select('*').order('position');
      if (error) throw error;
      return data as Class[];
    },
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: ['classes', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('classes').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as Class | null;
    },
    enabled: !!id,
  });
}

export function useClassMutations() {
  const queryClient = useQueryClient();

  const toastDbError = (error: Error) => {
    const msg = error?.message || 'Request failed';
    if (msg.toLowerCase().includes('row-level security')) {
      toast.error('Permission denied. Please sign in as an admin.');
      return;
    }
    toast.error(msg);
  };

  const create = useMutation({
    mutationFn: async (data: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('classes').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully');
    },
    onError: toastDbError,
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Class> }) => {
      const { data: result, error } = await supabase.from('classes').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('classes').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// Subjects
export function useSubjects(classId?: string) {
  return useQuery({
    queryKey: ['subjects', classId],
    queryFn: async () => {
      let query = supabase.from('subjects').select('*').order('position');
      if (classId) query = query.eq('class_id', classId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Subject[];
    },
  });
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: ['subjects', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('subjects').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as Subject | null;
    },
    enabled: !!id,
  });
}

export function useSubjectMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('subjects').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Subject> }) => {
      const { data: result, error } = await supabase.from('subjects').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('subjects').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// Chapters
export function useChapters(subjectId?: string) {
  return useQuery({
    queryKey: ['chapters', subjectId],
    queryFn: async () => {
      let query = supabase.from('chapters').select('*').order('position');
      if (subjectId) query = query.eq('subject_id', subjectId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Chapter[];
    },
  });
}

export function useChapter(id: string) {
  return useQuery({
    queryKey: ['chapters', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('chapters').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as Chapter | null;
    },
    enabled: !!id,
  });
}

export function useChapterMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('chapters').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Chapter created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Chapter> }) => {
      const { data: result, error } = await supabase.from('chapters').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Chapter updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('chapters').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Chapter deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('chapters').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// Topics
export function useTopics(chapterId?: string) {
  return useQuery({
    queryKey: ['topics', chapterId],
    queryFn: async () => {
      let query = supabase.from('topics').select('*').order('position');
      if (chapterId) query = query.eq('chapter_id', chapterId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Topic[];
    },
  });
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ['topics', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('topics').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as Topic | null;
    },
    enabled: !!id,
  });
}

export function useTopicMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<Topic, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('topics').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Topic> }) => {
      const { data: result, error } = await supabase.from('topics').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('topics').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('topics').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// SubTopics
export function useSubTopics(topicId?: string) {
  return useQuery({
    queryKey: ['sub_topics', topicId],
    queryFn: async () => {
      let query = supabase.from('sub_topics').select('*').order('position');
      if (topicId) query = query.eq('topic_id', topicId);
      const { data, error } = await query;
      if (error) throw error;
      return data as SubTopic[];
    },
  });
}

export function useSubTopic(id: string) {
  return useQuery({
    queryKey: ['sub_topics', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('sub_topics').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as SubTopic | null;
    },
    enabled: !!id,
  });
}

export function useSubTopicMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<SubTopic, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('sub_topics').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub_topics'] });
      toast.success('Sub-topic created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubTopic> }) => {
      const { data: result, error } = await supabase.from('sub_topics').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub_topics'] });
      toast.success('Sub-topic updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sub_topics').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub_topics'] });
      toast.success('Sub-topic deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('sub_topics').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub_topics'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// MCQs
export function useMcqs(subTopicId?: string) {
  return useQuery({
    queryKey: ['mcqs', subTopicId],
    queryFn: async () => {
      let query = supabase.from('mcqs').select('*').order('position');
      if (subTopicId) query = query.eq('sub_topic_id', subTopicId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Mcq[];
    },
  });
}

export function useMcq(id: string) {
  return useQuery({
    queryKey: ['mcqs', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('mcqs').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Mcq;
    },
    enabled: !!id,
  });
}

export function useMcqMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<Mcq, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('mcqs').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
      toast.success('MCQ created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Mcq> }) => {
      const { data: result, error } = await supabase.from('mcqs').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
      toast.success('MCQ updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('mcqs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
      toast.success('MCQ deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('mcqs').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// CQs
export function useCqs(subTopicId?: string) {
  return useQuery({
    queryKey: ['cqs', subTopicId],
    queryFn: async () => {
      let query = supabase.from('cqs').select('*').order('position');
      if (subTopicId) query = query.eq('sub_topic_id', subTopicId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Cq[];
    },
  });
}

export function useCq(id: string) {
  return useQuery({
    queryKey: ['cqs', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('cqs').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Cq;
    },
    enabled: !!id,
  });
}

export function useCqMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<Cq, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('cqs').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cqs'] });
      toast.success('CQ created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cq> }) => {
      const { data: result, error } = await supabase.from('cqs').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cqs'] });
      toast.success('CQ updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cqs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cqs'] });
      toast.success('CQ deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      const updates = items.map(item => 
        supabase.from('cqs').update({ position: item.position }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cqs'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove, reorder };
}

// Question Types
export interface QuestionType {
  id: string;
  name: string;
  display_name: string;
  subject_id: string;
  chapter_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useQuestionTypes(subjectId?: string) {
  return useQuery({
    queryKey: ['question_types', subjectId],
    queryFn: async () => {
      let query = supabase.from('question_types').select('*').order('display_name');
      if (subjectId) query = query.eq('subject_id', subjectId);
      const { data, error } = await query;
      if (error) throw error;
      return data as QuestionType[];
    },
  });
}

export function useQuestionType(id: string) {
  return useQuery({
    queryKey: ['question_types', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('question_types').select('*').eq('id', id).single();
      if (error) throw error;
      return data as QuestionType;
    },
    enabled: !!id,
  });
}

export function useQuestionTypeMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Omit<QuestionType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase.from('question_types').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question_types'] });
      toast.success('Question type created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<QuestionType> }) => {
      const { data: result, error } = await supabase.from('question_types').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question_types'] });
      toast.success('Question type updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('question_types').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question_types'] });
      toast.success('Question type deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { create, update, remove };
}
