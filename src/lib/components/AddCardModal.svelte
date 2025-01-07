<script>
    import { createEventDispatcher } from 'svelte';
    import { generateQRCode } from '$lib/utils/qrcode';
    import { scrapeMetadata } from '$lib/utils/metaScraper';
    const dispatch = createEventDispatcher();

    export let editMode = false;
    export let initialData = null;

    let title = initialData?.title || '';
    let imageUrl = initialData?.imageUrl || '';
    let link = initialData?.link || '';
    let linkError = '';
    let isSubmitting = false;
    let isScrapingMetadata = false;

    $: isValid = link.trim() !== '';

    async function validateUrl(url) {
        if (!url || typeof url !== 'string') return false;

        let processedUrl = url.trim();
        if (!processedUrl) return false;

        // URL에 프로토콜이 없으면 http:// 추가
        if (!/^https?:\/\//i.test(processedUrl)) {
            processedUrl = 'http://' + processedUrl;
        }

        try {
            const parsedUrl = new URL(processedUrl);
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
                return processedUrl; // 유효한 URL 반환
            }
            return false;
        } catch {
            return false;
        }
    }

    async function handleLinkChange() {
        if (!link || !isValid) return;
        
        try {
            const validatedLink = await validateUrl(link);
            if (validatedLink && !imageUrl.trim()) {
                isScrapingMetadata = true;
                const metadata = await scrapeMetadata(validatedLink);
                if (!title.trim()) {
                    title = metadata.title;
                }
                if (!imageUrl.trim()) {
                    imageUrl = metadata.imageUrl;
                }
            }
        } catch (error) {
            console.error('메타데이터 스크랩 실패:', error);
        } finally {
            isScrapingMetadata = false;
        }
    }

    async function handleSubmit() {
        if (!isValid || isSubmitting || !link.trim()) return;
        
        isSubmitting = true;
        linkError = '';

        try {
            // 1. URL 유효성 검사
            const validatedLink = await validateUrl(link);
            if (!validatedLink) {
                throw new Error('유효한 http 또는 https URL을 입력해주세요.');
            }

            // 2. 이미지 URL 유효성 검사 (있는 경우에만)
            let validatedImageUrl = '';
            if (imageUrl) {
                const tempValidatedImageUrl = await validateUrl(imageUrl);
                if (!tempValidatedImageUrl) {
                    throw new Error('유효한 이미지 URL을 입력해주세요.');
                }
                validatedImageUrl = tempValidatedImageUrl;
            }

            // 3. QR 코드 생성 테스트
            const qrTest = await generateQRCode(validatedLink);
            if (!qrTest) {
                throw new Error('QR 코드 생성에 실패했습니다.');
            }

            // 4. 데이터 정제
            const cardData = {
                title: title.trim(),
                imageUrl: validatedImageUrl,
                link: validatedLink,
                createdAt: new Date().toISOString()
            };

            // 5. 카드 추가 이벤트 발생
            dispatch('add', cardData);
            
            // 6. 입력 필드 초기화
            title = '';
            imageUrl = '';
            link = '';
            
            // 7. 모달 닫기
            dispatch('close');
        } catch (error) {
            console.error('카드 추가 실패:', error);
            linkError = error.message;
        } finally {
            isSubmitting = false;
        }
    }

    function validateImageUrl() {
        if (imageUrl.trim()) {
            validateUrl(imageUrl).then(isValid => {
                if (!isValid) {
                    imageUrl = '';
                }
            });
        }
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div 
        class="bg-white rounded-lg w-full max-w-md"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
    >
        <div class="p-6">
            <h2 id="modal-title" class="text-xl font-semibold mb-4">
                {editMode ? '카드 수정' : '새 카드 추가'}
            </h2>
            
            <form 
                class="space-y-4" 
                on:submit|preventDefault={handleSubmit}
                novalidate
            >
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">제목</label>
                    <input
                        id="title"
                        type="text"
                        bind:value={title}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="제목 (선택사항)"
                        maxlength="100"
                    />
                </div>

                <div>
                    <label for="imageUrl" class="block text-sm font-medium text-gray-700">이미지 URL</label>
                    <input
                        id="imageUrl"
                        type="url"
                        bind:value={imageUrl}
                        on:blur={validateImageUrl}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="이미지 주소 (선택사항)"
                    />
                </div>

                <div>
                    <label for="link" class="block text-sm font-medium text-gray-700">
                        링크 * <span class="text-xs text-gray-500">(http:// 또는 https://로 시작)</span>
                    </label>
                    <input
                        id="link"
                        type="url"
                        bind:value={link}
                        on:blur={handleLinkChange}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://example.com"
                        required
                        pattern="https?://.+"
                    />
                    {#if isScrapingMetadata}
                        <p class="mt-1 text-sm text-gray-500">메타데이터를 가져오는 중...</p>
                    {/if}
                    {#if linkError}
                        <p class="mt-1 text-sm text-red-500" role="alert">{linkError}</p>
                    {/if}
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        on:click={() => dispatch('close')}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 
                               rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? '처리 중...' : editMode ? '수정' : '추가'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div> 