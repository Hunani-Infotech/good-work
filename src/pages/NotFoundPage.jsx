import { usePageReveal } from '../hooks/usePageReveal';

export default function NotFoundPage() {
  usePageReveal();

  return (
    <main className="main">
      <div className="blur not-found">
        <div className="blur-content">
          <h1>404</h1>
        </div>
      </div>
    </main>
  );
}
