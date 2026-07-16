export function BodyBackground({ showCloudItem = true, containerClass = '' }) {
  return (
    <div className={`body-background${containerClass ? ` ${containerClass}` : ''}`}>
      {showCloudItem && (
        <div className="bg-item">
          <img
            loading="lazy"
            width={1440}
            height={900}
            src="/assets/isak/images/item/cloud-bg.png"
            alt="background"
          />
        </div>
      )}
    </div>
  );
}
