import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type QuestionType = 'mcq' | 'cq';

interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  question_type: QuestionType;
  created_at: string;
}

export function useQuestionBookmarks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all bookmarks for the current user
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['question-bookmarks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('question_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Bookmark[];
    },
    enabled: !!user?.id,
  });

  // Check if a question is bookmarked
  const isBookmarked = (questionId: string, questionType: QuestionType): boolean => {
    return bookmarks.some(
      (b) => b.question_id === questionId && b.question_type === questionType
    );
  };

  // Get bookmarked question IDs by type
  const getBookmarkedIds = (questionType: QuestionType): string[] => {
    return bookmarks
      .filter((b) => b.question_type === questionType)
      .map((b) => b.question_id);
  };

  // Add bookmark mutation
  const addBookmark = useMutation({
    mutationFn: async ({ questionId, questionType }: { questionId: string; questionType: QuestionType }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('question_bookmarks')
        .insert({
          user_id: user.id,
          question_id: questionId,
          question_type: questionType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bookmarks'] });
      toast.success('Question bookmarked');
    },
    onError: (error) => {
      console.error('Failed to bookmark:', error);
      toast.error('Failed to bookmark question');
    },
  });

  // Remove bookmark mutation
  const removeBookmark = useMutation({
    mutationFn: async ({ questionId, questionType }: { questionId: string; questionType: QuestionType }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('question_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .eq('question_type', questionType);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bookmarks'] });
      toast.success('Bookmark removed');
    },
    onError: (error) => {
      console.error('Failed to remove bookmark:', error);
      toast.error('Failed to remove bookmark');
    },
  });

  // Toggle bookmark
  const toggleBookmark = (questionId: string, questionType: QuestionType) => {
    if (isBookmarked(questionId, questionType)) {
      removeBookmark.mutate({ questionId, questionType });
    } else {
      addBookmark.mutate({ questionId, questionType });
    }
  };

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    getBookmarkedIds,
    toggleBookmark,
    addBookmark: addBookmark.mutate,
    removeBookmark: removeBookmark.mutate,
    isToggling: addBookmark.isPending || removeBookmark.isPending,
  };
}
