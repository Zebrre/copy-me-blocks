
import { useState, useCallback } from 'react';
import { Card } from '@/types/card';
import { toast } from '@/hooks/use-toast';

interface OptimisticUpdate {
  id: string;
  type: 'add' | 'update' | 'delete';
  card?: Card;
  originalCard?: Card;
}

export const useOptimisticCards = (
  cards: Card[],
  serverActions: {
    addCard: (card: any) => Promise<void>;
    updateCard: (card: Card) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;
  }
) => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([]);
  const [operationLoading, setOperationLoading] = useState<Record<string, boolean>>({});

  const getOptimisticCards = useCallback(() => {
    let result = [...cards];
    
    optimisticUpdates.forEach(update => {
      switch (update.type) {
        case 'add':
          if (update.card && !result.find(c => c.id === update.card!.id)) {
            result.unshift(update.card);
          }
          break;
        case 'update':
          if (update.card) {
            result = result.map(card => 
              card.id === update.card!.id ? update.card! : card
            );
          }
          break;
        case 'delete':
          result = result.filter(card => card.id !== update.id);
          break;
      }
    });
    
    return result;
  }, [cards, optimisticUpdates]);

  const addCardOptimistic = async (cardData: any) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticCard: Card = {
      id: tempId,
      ...cardData,
      user_id: 'temp',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updateId = `add-${tempId}`;
    setOptimisticUpdates(prev => [...prev, { 
      id: updateId, 
      type: 'add', 
      card: optimisticCard 
    }]);
    setOperationLoading(prev => ({ ...prev, [tempId]: true }));

    try {
      await serverActions.addCard(cardData);
      // Remove optimistic update after server confirms
      setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
      toast({
        title: 'Error',
        description: 'Failed to add card',
        variant: 'destructive',
      });
    } finally {
      setOperationLoading(prev => ({ ...prev, [tempId]: false }));
    }
  };

  const updateCardOptimistic = async (updatedCard: Card) => {
    const originalCard = cards.find(c => c.id === updatedCard.id);
    const updateId = `update-${updatedCard.id}`;
    
    setOptimisticUpdates(prev => [...prev, { 
      id: updateId, 
      type: 'update', 
      card: updatedCard,
      originalCard 
    }]);
    setOperationLoading(prev => ({ ...prev, [updatedCard.id]: true }));

    try {
      await serverActions.updateCard(updatedCard);
      setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
    } catch (error) {
      // Revert to original card on error
      setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
      toast({
        title: 'Error',
        description: 'Failed to update card',
        variant: 'destructive',
      });
    } finally {
      setOperationLoading(prev => ({ ...prev, [updatedCard.id]: false }));
    }
  };

  const deleteCardOptimistic = async (cardId: string) => {
    const originalCard = cards.find(c => c.id === cardId);
    const updateId = `delete-${cardId}`;
    
    setOptimisticUpdates(prev => [...prev, { 
      id: updateId, 
      type: 'delete', 
      originalCard 
    }]);
    setOperationLoading(prev => ({ ...prev, [cardId]: true }));

    try {
      await serverActions.deleteCard(cardId);
      setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
    } catch (error) {
      // Revert deletion on error
      setOptimisticUpdates(prev => prev.filter(u => u.id !== updateId));
      toast({
        title: 'Error',
        description: 'Failed to delete card',
        variant: 'destructive',
      });
    } finally {
      setOperationLoading(prev => ({ ...prev, [cardId]: false }));
    }
  };

  return {
    cards: getOptimisticCards(),
    addCard: addCardOptimistic,
    updateCard: updateCardOptimistic,
    deleteCard: deleteCardOptimistic,
    isLoading: (cardId: string) => operationLoading[cardId] || false,
  };
};
