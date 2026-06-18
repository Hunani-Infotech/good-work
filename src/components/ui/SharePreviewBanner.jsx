import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';

export default function SharePreviewBanner() {
  const { isPreviewMode, shareMode, shareConfigUrl, importSharedPreview } = useSite();

  if (!isPreviewMode) return null;

  return (
    <div className="share-preview-banner" role="status">
      <p>
        {shareMode === 'config'
          ? `Previewing shared content from ${shareConfigUrl}`
          : 'You are viewing a shared preview link.'}
      </p>
      <div className="share-preview-banner__actions">
        <button type="button" onClick={importSharedPreview}>
          Save to my editor
        </button>
        <Link to="/admin">Open editor</Link>
      </div>
    </div>
  );
}
