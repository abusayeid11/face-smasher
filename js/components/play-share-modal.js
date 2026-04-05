import { buildShareLinks } from './share-links.js';

/**
 * Creates and wires the play-page share modal behavior.
 * Keeps all share-related UI logic in one place so play.js stays focused on gameplay.
 *
 * @param {{
 *   modalEl: HTMLElement,
 *   backdropEl: HTMLElement,
 *   openBtnEl: HTMLElement,
 *   closeBtnEl: HTMLElement,
 *   copyBtnEl: HTMLButtonElement,
 *   inputEl: HTMLInputElement,
 *   waEl: HTMLAnchorElement,
 *   twEl: HTMLAnchorElement,
 *   fbEl: HTMLAnchorElement,
 *   getShareUrl: () => string
 * }} refs
 */
export function setupPlayShareModal(refs) {
    const {
        modalEl,
        backdropEl,
        openBtnEl,
        closeBtnEl,
        copyBtnEl,
        inputEl,
        waEl,
        twEl,
        fbEl,
        getShareUrl,
    } = refs;

    function close() {
        modalEl.classList.add('hidden');
    }

    function open() {
        const shareUrl = getShareUrl();
        inputEl.value = shareUrl;

        buildShareLinks({
            url: shareUrl,
            waEl,
            twEl,
            fbEl,
        });

        modalEl.classList.remove('hidden');
    }

    async function copyShareUrl() {
        const shareUrl = getShareUrl();
        await navigator.clipboard.writeText(shareUrl);

        const originalLabel = copyBtnEl.textContent;
        copyBtnEl.textContent = 'Copied!';

        setTimeout(() => {
            copyBtnEl.textContent = originalLabel || 'Copy';
        }, 2000);
    }

    openBtnEl.addEventListener('click', open);
    closeBtnEl.addEventListener('click', close);
    backdropEl.addEventListener('click', close);
    copyBtnEl.addEventListener('click', () => {
        copyShareUrl().catch(() => {
            copyBtnEl.textContent = 'Copy failed';
            setTimeout(() => {
                copyBtnEl.textContent = 'Copy';
            }, 1800);
        });
    });

    return { open, close };
}
