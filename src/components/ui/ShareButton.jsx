import { useState } from 'react';
import { useSite } from '../../context/SiteContext';

export default function ShareButton({ className = 'nav-social-link share-button' }) {
  const { createShareUrl, getPublishedUrl, isShareUrlTooLong } = useSite();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const params = new URLSearchParams(window.location.search);
    let urlToShare = window.location.href;

    if (!params.get('share') && !params.get('config')) {
      const shareUrl = createShareUrl(window.location.pathname);
      urlToShare = isShareUrlTooLong(shareUrl) ? getPublishedUrl() : shareUrl;
    }

    const title = document.title || 'Portfolio';
    const text = 'View this portfolio';

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: urlToShare });
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }

    try {
      await navigator.clipboard.writeText(urlToShare);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', urlToShare);
    }
  }

  return (
    <button type="button" className={className} onClick={handleShare} aria-label="Share this page">
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}
