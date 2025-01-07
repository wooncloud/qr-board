<script>
    import { cardStore } from '$lib/stores/cardStore';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        cardStore.loadCards();
        // 프린트 다이얼로그 자동 실행
        setTimeout(() => {
            window.print();
            // 프린트 후 이전 페이지로 돌아가기
            window.history.back();
        }, 1000);
    });
</script>

<div class="print-layout">
    {#each $cardStore as card (card.id)}
        <div class="card-wrapper">
            <Card {...card} />
        </div>
    {/each}
</div>

<style>
    @media print {
        .print-layout {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            padding: 1rem;
        }

        .card-wrapper {
            break-inside: avoid;
            page-break-inside: avoid;
        }
    }
</style> 