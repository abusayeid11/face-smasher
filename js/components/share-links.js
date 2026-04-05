const SHARE_TEXT = 'Smash this face! 👊';

/**
 * Populates social share link hrefs.
 * @param {{ url: string, waEl: Element|null, twEl: Element|null, fbEl: Element|null }} opts
 */
export function buildShareLinks({ url, waEl, twEl, fbEl }) {
    const enc  = encodeURIComponent(url);
    const text = encodeURIComponent(SHARE_TEXT);
    if (waEl) waEl.href = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + url)}`;
    if (twEl) twEl.href = `https://twitter.com/intent/tweet?url=${enc}&text=${text}`;
    if (fbEl) fbEl.href = `https://www.facebook.com/sharer/sharer.php?u=${enc}`;
}
