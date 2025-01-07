<script>
    import Navbar from '$lib/components/Navbar.svelte';
    import CardGrid from '$lib/components/CardGrid.svelte';
    import AddCardModal from '$lib/components/AddCardModal.svelte';
    import { onMount } from 'svelte';
    import { cardStore } from '$lib/stores/cardStore';

    let showAddModal = false;

    onMount(() => {
        cardStore.loadCards();
    });
</script>

<div class="min-h-screen bg-gray-50">
    <Navbar on:add={() => showAddModal = true} />
    <main class="container mx-auto px-4 py-8 bg-gray-50">
        <CardGrid />
    </main>
</div>

{#if showAddModal}
    <AddCardModal 
        on:close={() => showAddModal = false}
        on:add={async (event) => {
            await cardStore.addCard(event?.detail);
            showAddModal = false;
        }}
    />
{/if}
