/**
 * URL의 메타데이터를 가져오는 함수
 * @param {string} url - 메타데이터를 가져올 URL
 * @returns {Promise<{title: string, imageUrl: string}>} 메타데이터 객체
 */
export async function scrapeMetadata(url) {
    try {
        // CORS 우회를 위한 프록시 서버 사용
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // HTML 파싱을 위한 임시 DOM 생성
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        // Open Graph 태그에서 이미지 URL 찾기
        let imageUrl = doc.querySelector('meta[property="og:image"]')?.content ||
                      doc.querySelector('meta[name="twitter:image"]')?.content;

        // 대체 이미지 검색 (og 태그가 없는 경우)
        if (!imageUrl) {
            const firstImage = doc.querySelector('img[src^="http"]');
            imageUrl = firstImage?.src;
        }

        // 제목 찾기
        let title = doc.querySelector('meta[property="og:title"]')?.content ||
                   doc.querySelector('meta[name="twitter:title"]')?.content ||
                   doc.querySelector('title')?.textContent;

        return {
            title: title?.trim() || '',
            imageUrl: imageUrl || ''
        };
    } catch (error) {
        console.error('메타데이터 스크랩 실패:', error);
        return {
            title: '',
            imageUrl: ''
        };
    }
} 