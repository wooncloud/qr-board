<script>
    import { cardStore } from '$lib/stores/cardStore';
    import Card from './Card.svelte';
    import AddCardModal from './AddCardModal.svelte';
    import { onMount } from 'svelte';

    let page = 1;
    let loading = false;
    let showEditModal = false;
    let editingCard = null;
    const ITEMS_PER_PAGE = 12;

    $: visibleCards = $cardStore.slice(0, page * ITEMS_PER_PAGE);

    function handleScroll(event) {
        const element = event.target;
        if (
            element.scrollHeight - element.scrollTop === element.clientHeight &&
            !loading &&
            visibleCards.length < $cardStore.length
        ) {
            loading = true;
            setTimeout(() => {
                page += 1;
                loading = false;
            }, 500);
        }
    }

    function handleCardDelete(event) {
        const { id } = event.detail;
        cardStore.deleteCard(id);
    }

    function handleCardEdit(event) {
        editingCard = event.detail;
        showEditModal = true;
    }

    function handleEditSubmit(event) {
        cardStore.updateCard(editingCard.id, event.detail);
        showEditModal = false;
        editingCard = null;
    }

    onMount(() => {
        cardStore.loadCards();
    });
</script>

<div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 justify-items-center"
    on:scroll={handleScroll}
>
    {#each visibleCards as card (card.id)}
        <Card 
            {...card}
            on:delete={handleCardDelete}
            on:edit={handleCardEdit}
        />
    {/each}
</div>

{#if showEditModal}
    <AddCardModal 
        on:close={() => {
            showEditModal = false;
            editingCard = null;
        }}
        on:add={handleEditSubmit}
        editMode={true}
        initialData={editingCard}
    />
{/if}

{#if loading}
    <div class="text-center py-4">
        <span class="text-gray-500">로딩 중...</span>
    </div>
{/if}