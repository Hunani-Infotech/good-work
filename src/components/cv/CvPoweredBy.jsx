export default function CvPoweredBy({ dark = false }) {
  return (
    <p
      className={`cv-powered-by${dark ? ' cv-powered-by--dark' : ''}`}
      aria-label="Powered by GoodWork"
    >
      Powered by GoodWork
    </p>
  );
}
