import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { usePageReveal } from '../hooks/usePageReveal';
import CustomCursor from '../components/ui/CustomCursor.jsx';
import '../styles/admin.css';

import { TIDAL_COPPER_CV_PATH } from '../data/cvTemplatePaths.js';

const CV_PATH = TIDAL_COPPER_CV_PATH;

export function Field({ label, value, onChange, multiline, hint }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {hint ? <small className="admin-hint">{hint}</small> : null}
      {multiline ? (
        <textarea rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function ImageField({ label, value, onChange, hint }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {hint ? <small className="admin-hint">{hint}</small> : null}
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/images/… or https://…" />
      {value ? (
        <div className="admin-image-preview">
          <img src={value} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ) : (
        <p className="admin-empty-preview">No image — leave blank until asset is ready</p>
      )}
    </label>
  );
}

export default function AdminPage() {
  usePageReveal();

  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => document.body.classList.remove('admin-page');
  }, []);

  const {
    site,
    updateSite,
    resetSite,
    exportJson,
    importJson,
    createShareUrl,
    createConfigPreviewUrl,
    isShareUrlTooLong,
    getPublishedUrl,
  } = useSite();
  const fileRef = useRef(null);
  const [shareMessage, setShareMessage] = useState('');
  const [configUrlInput, setConfigUrlInput] = useState(site.site.meta?.configUrl || '');

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage(message);
      window.setTimeout(() => setShareMessage(''), 2500);
    } catch {
      window.prompt('Copy this link:', text);
    }
  }

  function copyShareLink() {
    const url = createShareUrl(CV_PATH);
    if (isShareUrlTooLong(url)) {
      setShareMessage('Link is too long for this browser. Export JSON, host it, then use a config URL below.');
      return;
    }
    copyText(url, 'Public preview link copied.');
  }

  function copyConfigPreviewLink() {
    if (!configUrlInput.trim()) {
      setShareMessage('Paste a hosted site.json URL first.');
      return;
    }
    const url = createConfigPreviewUrl(configUrlInput.trim(), CV_PATH);
    updateSite('site.meta.configUrl', configUrlInput.trim());
    copyText(url, 'Config preview link copied.');
  }

  function copyPublishedLink() {
    const url = getPublishedUrl();
    copyText(url, 'Published site link copied.');
  }

  function downloadJson() {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJson(reader.result);
      } catch {
        window.alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function updateParagraph(index, value) {
    const paragraphs = [...site.home.narrative.paragraphs];
    paragraphs[index] = value;
    updateSite('home.narrative.paragraphs', paragraphs);
  }

  function updateBullet(index, value) {
    const bullets = [...site.home.capabilities.bullets];
    bullets[index] = value;
    updateSite('home.capabilities.bullets', bullets);
  }

  return (
    <>
      <CustomCursor variant="admin" />
      <div className="admin-page">
      <header className="admin-header">
        <h1>Individual landing page editor</h1>
        <div className="admin-actions">
          <Link to="/">Agency home</Link>
          <Link to={CV_PATH}>View CV</Link>
          <button type="button" onClick={downloadJson}>Export JSON</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleImportFile} />
          <button type="button" onClick={copyShareLink}>Copy public preview link</button>
          <button type="button" onClick={copyPublishedLink}>Copy published link</button>
          <button type="button" onClick={resetSite}>Reset to default</button>
        </div>
        {shareMessage ? <p className="admin-share-message">{shareMessage}</p> : null}
        <p className="admin-note">
          Edits match the GoodWork Individual Landing Page content doc: four screens only (profile, video + hero, narrative, capabilities).
        </p>
      </header>

      <section className="admin-section admin-section-share">
        <h2>Shareable public link</h2>
        <Field
          label="Published site URL"
          value={site.site.meta?.publishedUrl || ''}
          hint="Live production URL — used by Share and Copy published link"
          onChange={(v) => updateSite('site.meta.publishedUrl', v)}
        />
        <Field
          label="Hosted site.json URL (optional)"
          value={configUrlInput}
          hint="Paste a public JSON URL, then copy the config preview link"
          onChange={setConfigUrlInput}
        />
        <div className="admin-actions">
          <button type="button" onClick={copyShareLink}>Copy preview link (?share=)</button>
          <button type="button" onClick={copyConfigPreviewLink}>Copy config preview link (?config=)</button>
        </div>
      </section>

      <section className="admin-section">
        <h2>Meta</h2>
        <Field label="Page title" value={site.site.meta.homeTitle} onChange={(v) => updateSite('site.meta.homeTitle', v)} />
        <Field label="Meta description" value={site.site.meta.description} multiline onChange={(v) => updateSite('site.meta.description', v)} />
        <ImageField label="Favicon URL" value={site.site.meta.favicon} onChange={(v) => updateSite('site.meta.favicon', v)} />
      </section>

      <section className="admin-section">
        <h2>Individual</h2>
        <Field label="First name" value={site.site.brand.firstName} onChange={(v) => updateSite('site.brand.firstName', v)} />
        <Field label="Last name" value={site.site.brand.lastName || ''} onChange={(v) => updateSite('site.brand.lastName', v)} hint="Shooote hero line 2 — below the portrait" />
        <Field label="Email" value={site.site.contact.email} onChange={(v) => updateSite('site.contact.email', v)} />
        <Field label="Mailto subject" value={site.site.contact.mailtoSubjectNav} onChange={(v) => updateSite('site.contact.mailtoSubjectNav', v)} />
      </section>

      <section className="admin-section">
        <h2>Social links</h2>
        <p className="admin-note">
          Leave blank to hide the icon — Geroz and Meridian only show it once a URL is set.
        </p>
        <Field label="LinkedIn" value={site.site.contact.socialLinks?.linkedin} onChange={(v) => updateSite('site.contact.socialLinks.linkedin', v)} />
      </section>

      <section className="admin-section">
        <h2>Screen 1 — Profile</h2>
        <ImageField label="Profile photo" value={site.home.hero.profilePhoto} onChange={(v) => updateSite('home.hero.profilePhoto', v)} />
        <Field label="Professional title" value={site.home.hero.subtitle} onChange={(v) => updateSite('home.hero.subtitle', v)} />
      </section>

      <section className="admin-section">
        <h2>Screen 2 — Video &amp; hero</h2>
        <Field label="Video CV — file path (optional, e.g. /videos/video-cv.mp4)" value={site.home.hero.videoCv?.src} onChange={(v) => updateSite('home.hero.videoCv.src', v)} />
        <ImageField label="Video CV — poster (shown when no video file)" value={site.home.hero.videoCv?.poster} onChange={(v) => updateSite('home.hero.videoCv.poster', v)} />
        <Field label="Hero header" value={site.home.hero.heading} multiline onChange={(v) => updateSite('home.hero.heading', v)} />
        <Field label="Hero statement" value={site.home.hero.heroStatement} multiline onChange={(v) => updateSite('home.hero.heroStatement', v)} />
        <Field
          label="Hero CTA button label"
          value={site.home.hero.ctaLabel}
          onChange={(v) => updateSite('home.hero.ctaLabel', v)}
          hint="Used on Screen 2 hero sections only — not the footer CTA block"
        />
      </section>

      <section className="admin-section">
        <h2>Screen 3 — Professional narrative</h2>
        <Field label="Section tag" value={site.home.narrative.tag} onChange={(v) => updateSite('home.narrative.tag', v)} />
        <ImageField
          label="Merdeka 118 skyline background"
          value={site.home.narrative.backgroundImage}
          hint="Optional photo behind the narrative screen"
          onChange={(v) => updateSite('home.narrative.backgroundImage', v)}
        />
        {site.home.narrative.paragraphs.map((para, index) => (
          <Field
            key={index}
            label={`Paragraph ${index + 1}`}
            value={para}
            multiline
            onChange={(v) => updateParagraph(index, v)}
          />
        ))}
      </section>

      <section className="admin-section">
        <h2>Screen 4 — Capabilities &amp; skills</h2>
        <Field label="Section tag" value={site.home.capabilities.tag} onChange={(v) => updateSite('home.capabilities.tag', v)} />
        <ImageField
          label="Multiracial youth / cafe background"
          value={site.home.capabilities.backgroundImage}
          hint="Optional photo behind the capabilities screen"
          onChange={(v) => updateSite('home.capabilities.backgroundImage', v)}
        />
        {site.home.capabilities.bullets.map((bullet, index) => (
          <Field
            key={index}
            label={`Capability ${index + 1}`}
            value={bullet}
            multiline
            onChange={(v) => updateBullet(index, v)}
          />
        ))}
      </section>

      <section className="admin-section">
        <h2>CTA section — Connect (all templates except Meridian)</h2>
        <Field label="Section tag" value={site.home.cta?.tag ?? ''} onChange={(v) => updateSite('home.cta.tag', v)} />
        <Field label="Eyebrow" value={site.home.cta?.eyebrow ?? ''} onChange={(v) => updateSite('home.cta.eyebrow', v)} hint="Short line above the heading" />
        <Field label="Heading" value={site.home.cta?.heading ?? ''} multiline onChange={(v) => updateSite('home.cta.heading', v)} />
        <Field label="Supporting statement" value={site.home.cta?.statement ?? ''} multiline onChange={(v) => updateSite('home.cta.statement', v)} />
        <Field label="CTA button label" value={site.home.cta?.ctaLabel ?? ''} onChange={(v) => updateSite('home.cta.ctaLabel', v)} />
        <Field
          label="Action kicker"
          value={site.home.cta?.actionKicker ?? ''}
          onChange={(v) => updateSite('home.cta.actionKicker', v)}
          hint="Isak action bar only — e.g. Start a conversation"
        />
      </section>
    </div>
    </>
  );
}
