<script>
    import { createEventDispatcher } from 'svelte';
    import { generateQRCode } from '$lib/utils/qrcode';
    import { onMount } from 'svelte';

    export let id = '';
    export let title = '';
    export let imageUrl = '';
    export let link = '';

    let qrCodeUrl = '';
    let error = '';
    let isHovered = false;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        if (!link) return;
        try {
            qrCodeUrl = await generateQRCode(link);
            error = '';
        } catch (error) {
            console.error('QR 코드 생성 실패:', error);
            error = error.message;
        }
    });

    function handleDelete(event) {
        event.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        if (confirm('이 카드를 삭제하시겠습니까?')) {
            dispatch('delete', { id });
        }
    }

    function handleCardClick() {
        dispatch('edit', { id, title, imageUrl, link });
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    class="relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer w-[280px] 
           border border-gray-200 hover:border-gray-300 transition-colors duration-200"
    style="aspect-ratio: 1 / 1.56;"
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    on:click={handleCardClick}
>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    {#if isHovered}
        <button
            class="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-50 hover:scale-110 rounded-full 
                   shadow-md transition-all duration-200 z-10"
            on:click={handleDelete}
            title="카드 삭제"
        >
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    {/if}

    <div class="flex flex-col h-full">
        {#if title}
            <h3 class="text-lg font-semibold p-4 border-b truncate">{title}</h3>
        {/if}
        
        {#if imageUrl}
            <div class="w-full" style="height: 35%;">
                <img
                    src={imageUrl}
                    alt={title}
                    class="w-full h-full object-cover"
                    on:error={() => imageUrl = ''}
                />
            </div>
        {/if}
        
        <div class="flex-grow flex flex-col justify-center items-center p-4">
            {#if qrCodeUrl}
                <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    class="w-32 h-32"
                />
            {:else if error}
                <div class="text-red-500 text-sm">{error}</div>
            {/if}
        </div>
    </div>
</div> 