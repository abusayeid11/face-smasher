export function buildShareLinks({ url, waEl, twEl, fbEl }) {
    const encodedUrl = encodeURIComponent(url);
    const text = encodeURIComponent('Smash this face! 👊');
    
    if (waEl) {
        waEl.href = `https://wa.me/?text=${text}%20${encodedUrl}`;
    }
    
    if (twEl) {
        twEl.href = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
    }
    
    if (fbEl) {
        fbEl.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
}