export function initShareModal(shareBtn, shareModal, shareBackdrop, shareInput, shareCopyBtn) {
    if (!shareBtn || !shareModal) return;
    
    const closeModal = () => shareModal.classList.add('hidden');
    
    shareBtn.addEventListener('click', () => {
        shareModal.classList.remove('hidden');
        shareInput?.select();
    });
    
    shareBackdrop?.addEventListener('click', closeModal);
    
    shareCopyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(shareInput.value).then(() => {
            shareCopyBtn.textContent = 'Copied!';
            setTimeout(() => { shareCopyBtn.textContent = 'Copy'; }, 2000);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !shareModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}