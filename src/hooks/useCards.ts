
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/types/card';
import { toast } from '@/hooks/use-toast';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCards = async () => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('position', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Omit<Card, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{
          ...cardData,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      setCards(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Card created successfully',
      });
    } catch (error) {
      console.error('Error creating card:', error);
      toast({
        title: 'Error',
        description: 'Failed to create card',
        variant: 'destructive',
      });
    }
  };

  const updateCard = async (id: string, cardData: Partial<Card>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .update({
          ...cardData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCards(prev => prev.map(card => card.id === id ? data : card));
      toast({
        title: 'Success',
        description: 'Card updated successfully',
      });
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        title: 'Error',
        description: 'Failed to update card',
        variant: 'destructive',
      });
    }
  };

  const deleteCard = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCards(prev => prev.filter(card => card.id !== id));
      toast({
        title: 'Success',
        description: 'Card deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete card',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  return {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    refetch: fetchCards,
  };
};
