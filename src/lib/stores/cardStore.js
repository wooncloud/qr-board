import { writable } from 'svelte/store';
import localforage from 'localforage';

const STORAGE_KEY = 'qr-cards';

function createCardStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        loadCards: async () => {
            try {
                const cards = await localforage.getItem(STORAGE_KEY) || [];
                set(cards);
            } catch (error) {
                console.error('카드 로드 실패:', error);
                set([]);
            }
        },
        addCard: async (cardData) => {
            if (!cardData?.link) {
                throw new Error('유효하지 않은 카드 데이터입니다.');
            }
            
            const card = {
                id: crypto.randomUUID(),
                title: cardData.title?.trim() || '',
                imageUrl: cardData.imageUrl?.trim() || '',
                link: cardData.link.trim(),
                createdAt: new Date().toISOString()
            };

            update(cards => {
                const newCards = [...cards, card];
                try {
                    localforage.setItem(STORAGE_KEY, newCards);
                } catch (error) {
                    console.error('카드 저장 실패:', error);
                }
                return newCards;
            });

            return card;
        },
        updateCard: async (id, cardData) => {
            if (!cardData?.link) {
                throw new Error('유효하지 않은 카드 데이터입니다.');
            }

            return update(cards => {
                const updatedCards = cards.map(card => 
                    card.id === id 
                        ? { 
                            ...card,
                            title: cardData.title?.trim() || '',
                            imageUrl: cardData.imageUrl?.trim() || '',
                            link: cardData.link.trim(),
                            updatedAt: new Date().toISOString()
                        }
                        : card
                );
                try {
                    localforage.setItem(STORAGE_KEY, updatedCards);
                } catch (error) {
                    console.error('카드 업데이트 실패:', error);
                }
                return updatedCards;
            });
        },
        deleteCard: async (cardId) => {
            if (!cardId) return;
            
            return update(cards => {
                const newCards = cards.filter(card => card.id !== cardId);
                try {
                    localforage.setItem(STORAGE_KEY, newCards);
                } catch (error) {
                    console.error('카드 삭제 실패:', error);
                }
                return newCards;
            });
        }
    };
}

export const cardStore = createCardStore();