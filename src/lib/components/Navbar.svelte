<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<nav class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
            <div class="text-xl font-bold">QR Board</div>
            <div class="flex space-x-4">
                <button
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    on:click={() => dispatch('add')}
                >
                    카드 추가
                </button>
                <button
                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    on:click={() => window.location.href = '/print'}
                >
                    인쇄
                </button>
            </div>
        </div>
    </div>
</nav> 