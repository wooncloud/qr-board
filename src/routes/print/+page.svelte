<script>
    import { cardStore } from '$lib/stores/cardStore';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        cardStore.loadCards();
        setTimeout(() => {
            window.print();
            window.history.back();
        }, 1000);
    });
</script>

<div class="print-container">
    <div class="print-layout">
        {#each $cardStore as card (card.id)}
            <div class="card-wrapper">
                <Card {...card} />
            </div>
        {/each}
    </div>
</div>

<style>
    /* 일반 화면에서는 보기 좋게 표시 */
    .print-container {
        padding: 2rem;
    }

    .print-layout {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }

    /* 프린트 시 A4 최적화 */
    @media print {
        @page {
            size: A4;
            margin: 0;
        }

        .print-container {
            padding: 0;
            width: 210mm;
            height: 297mm;
            display: flex;
            justify-content: center;
        }

        .print-layout {
            display: grid;
            grid-template-columns: repeat(2, 105mm); /* A4 가로를 2등분 */
            grid-template-rows: repeat(4, 66mm);     /* 4행, 각 행의 높이를 66mm로 고정 */
            gap: 2mm;
            width: 210mm;
            padding-top: 0;
            grid-auto-flow: row dense; /* 빈 공간 없이 촘촘하게 배치 */
        }

        .card-wrapper {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 0;
            height: 66mm;
            width: 105mm;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            overflow: hidden;
        }

        /* 프린트 시 불필요한 요소 숨기기 */
        :global(nav),
        :global(button),
        :global(.hover-only) {
            display: none !important;
        }

        /* 프린트 시 카드 스타일 최적화 */
        :global(.card-wrapper > *) {
            transform: rotate(90deg);
            width: 66mm !important;
            aspect-ratio: 1 / 1.56 !important;
            transform-origin: center;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0.5rem !important;
        }

        /* QR 코드 크기 최적화 */
        :global(.card-wrapper img[alt="QR Code"]) {
            width: 128px !important;
            height: 128px !important;
        }

        /* 텍스트 크기 유지 */
        :global(.card-wrapper h3) {
            font-size: 1.125rem !important;
        }

        :global(.card-wrapper a) {
            font-size: 0.875rem !important;
        }
    }
</style> 