import QRCode from 'qrcode';

/**
 * QR 코드 생성 옵션
 */
const QR_OPTIONS = {
    width: 256,
    margin: 1,
    color: {
        dark: '#000000',
        light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
};

/**
 * URL을 QR 코드 데이터 URL로 변환
 * @param {string} url - 변환할 URL
 * @returns {Promise<string>} QR 코드 데이터 URL
 */
export async function generateQRCode(url) {
    try {
        // URL이 유효한지 확인
        new URL(url);
        
        // QR 코드 생성
        const qrDataUrl = QRCode.toDataURL(url, QR_OPTIONS);
        return qrDataUrl;
    } catch (error) {
        console.error('QR 코드 생성 실패:', error);
        throw new Error('유효하지 않은 URL입니다.');
    }
}

/**
 * URL을 QR 코드 캔버스로 변환
 * @param {string} url - 변환할 URL
 * @param {HTMLCanvasElement} canvas - QR 코드를 그릴 캔버스
 * @returns {Promise<void>}
 */
export async function generateQRCodeToCanvas(url, canvas) {
    try {
        // URL이 유효한지 확인
        new URL(url);
        
        // QR 코드를 캔버스에 그리기
        QRCode.toCanvas(canvas, url, QR_OPTIONS);
    } catch (error) {
        console.error('QR 코드 생성 실패:', error);
        throw new Error('유효하지 않은 URL입니다.');
    }
} 