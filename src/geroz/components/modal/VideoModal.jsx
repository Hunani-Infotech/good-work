import { useCustomContext } from '../../context/GerozContext.jsx';
import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';

export default function VideoModal() {
  const { isVideoModalOpen, toggleVideoModal } = useCustomContext();
  const { video } = useGerozContent();

  const handleCloseModal = () => {
    toggleVideoModal();
  };

  return (
    <>
      <div
        className={`ar-modal-overlay ${isVideoModalOpen ? 'active' : ''}`}
        role="button"
        onClick={handleCloseModal}
        onKeyDown={(e) => e.key === 'Escape' && handleCloseModal()}
        tabIndex={-1}
        aria-hidden={!isVideoModalOpen}
      />
      <div
        className={`video-modal-container ${isVideoModalOpen ? 'active' : ''}`}
      >
        <div className="ar-modal-body">
          <button type="button" onClick={handleCloseModal} aria-label="Close video">
            <i className="fas fa-times"></i>
          </button>
          {isVideoModalOpen && video.src ? (
            <video
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%' }}
            >
              <track kind="captions" />
            </video>
          ) : null}
        </div>
      </div>
    </>
  );
}
