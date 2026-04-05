export function setupPlayShareModal({ modalEl, backdropEl, openBtnEl, closeBtnEl, copyBtnEl, inputEl, waEl, twEl, fbEl, getShareUrl }) {
    if (!modalEl) return;
    
    function openModal() {
        modalEl.classList.remove('hidden');
        if (inputEl && getShareUrl) {
            inputEl.value = getShareUrl();
        }
    }
    
    function closeModal() {
        modalEl.classList.add('hidden');
    }
    
    openBtnEl?.addEventListener('click', openModal);
    closeBtnEl?.addEventListener('click', closeModal);
    backdropEl?.addEventListener('click', closeModal);
    
    copyBtnEl?.addEventListener('click', () => {
        if (inputEl) {
            navigator.clipboard.writeText(inputEl.value).then(() => {
                copyBtnEl.textContent = 'Copied!';
                setTimeout(() => { copyBtnEl.textContent = 'Copy'; }, 2000);
            });
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    if (waEl || twEl || fbEl) {
        const url = getShareUrl ? getShareUrl() : window.location.href;
        const encodedUrl = encodeURIComponent(url);
        const text = encodeURIComponent('Smash this face! 👊');
        
        if (waEl) waEl.href = `https://wa.me/?text=${text}%20${encodedUrl}`;
        if (twEl) twEl.href = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
        if (fbEl) fbEl.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
}