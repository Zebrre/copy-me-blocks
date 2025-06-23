
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

      // Transform database result to match Card interface
      const transformedCards: Card[] = (data || []).map(card => ({
        id: card.id,
        title: card.title,
        content: card.content,
        type: card.type as "text" | "link" | "image",
        color: card.color as "blue" | "peach" | "yellow" | "mint" | "lavender",
        size: card.size as "1x1" | "1x2" | "2x1" | "2x2",
        position: card.position,
        user_id: card.user_id,
        created_at: card.created_at,
        updated_at: card.updated_at,
      }));

      setCards(transformedCards);
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

  const addCard = async (cardData: Omit<Card, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{
          ...cardData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      // Transform database result to match Card interface
      const transformedCard: Card = {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type as "text" | "link" | "image",
        color: data.color as "blue" | "peach" | "yellow" | "mint" | "lavender",
        size: data.size as "1x1" | "1x2" | "2x1" | "2x2",
        position: data.position,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setCards(prev => [transformedCard, ...prev]);
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

  const updateCard = async (updatedCard: Card) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .update({
          title: updatedCard.title,
          content: updatedCard.content,
          type: updatedCard.type,
          color: updatedCard.color,
          size: updatedCard.size,
          position: updatedCard.position,
        })
        .eq('id', updatedCard.id)
        .select()
        .single();

      if (error) throw error;

      // Transform database result to match Card interface
      const transformedCard: Card = {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type as "text" | "link" | "image",
        color: data.color as "blue" | "peach" | "yellow" | "mint" | "lavender",
        size: data.size as "1x1" | "1x2" | "2x1" | "2x2",
        position: data.position,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setCards(prev => prev.map(card => card.id === updatedCard.id ? transformedCard : card));
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
