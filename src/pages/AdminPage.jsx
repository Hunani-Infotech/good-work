import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { usePageReveal } from '../hooks/usePageReveal';
import '../styles/admin.css';

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

export function ColorField({ label, value, onChange }) {
  return (
    <label className="admin-field admin-field-color">
      <span>{label}</span>
      <div className="admin-color-row">
        <input type="color" value={value || '#510066'} onChange={(e) => onChange(e.target.value)} />
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    </label>
  );
}

export default function AdminPage() {
  usePageReveal();

  const {
    site,
    updateSite,
    updateProject,
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
    const url = createShareUrl('/');
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
    const url = createConfigPreviewUrl(configUrlInput.trim(), '/');
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

  function updateSocialNav(index, field, value) {
    const links = structuredClone(site.site.social.nav);
    links[index][field] = value;
    updateSite('site.social.nav', links);
  }

  function addSocialNav() {
    updateSite('site.social.nav', [
      ...site.site.social.nav,
      { label: 'Link', href: '#', external: true },
    ]);
  }

  function removeSocialNav(index) {
    updateSite(
      'site.social.nav',
      site.site.social.nav.filter((_, i) => i !== index)
    );
  }

  function updateServiceMedia(serviceIndex, mediaIndex, field, value) {
    const items = structuredClone(site.home.services.items);
    items[serviceIndex].media[mediaIndex][field] = value;
    updateSite('home.services.items', items);
  }

  function addServiceMedia(serviceIndex) {
    const items = structuredClone(site.home.services.items);
    items[serviceIndex].media.push({ type: 'image', src: '' });
    updateSite('home.services.items', items);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Site content editor</h1>
        <div className="admin-actions">
          <Link to="/">View home</Link>
          <Link to="/work">View work</Link>
          <button type="button" onClick={downloadJson}>Export JSON</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleImportFile} />
          <button type="button" onClick={copyShareLink}>Copy public preview link</button>
          <button type="button" onClick={copyPublishedLink}>Copy published link</button>
          <button type="button" onClick={resetSite}>Reset to default</button>
        </div>
        {shareMessage ? <p className="admin-share-message">{shareMessage}</p> : null}
        <p className="admin-note">
          Changes save to localStorage instantly. Use <strong>Copy public preview link</strong> to share your current edits with anyone.
          For large sites, export JSON, host it (GitHub Gist, CDN, or your server), then share a config preview link.
        </p>
      </header>

      <section className="admin-section admin-section-share">
        <h2>Shareable public link</h2>
        <Field
          label="Published site URL"
          value={site.site.meta?.publishedUrl || ''}
          hint="Your live Vercel or production URL — used by Share and Copy published link"
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
        <h2>Theme & meta</h2>
        <ColorField label="Brand purple" value={site.site.theme?.purple} onChange={(v) => updateSite('site.theme.purple', v)} />
        <ColorField label="Brand orange" value={site.site.theme?.orange} onChange={(v) => updateSite('site.theme.orange', v)} />
        <ColorField label="Background warm" value={site.site.theme?.bgWarm} onChange={(v) => updateSite('site.theme.bgWarm', v)} />
        <Field label="Home page title" value={site.site.meta.homeTitle} onChange={(v) => updateSite('site.meta.homeTitle', v)} />
        <Field label="Work page title" value={site.site.meta.workTitle} onChange={(v) => updateSite('site.meta.workTitle', v)} />
        <Field label="Meta description" value={site.site.meta.description} multiline onChange={(v) => updateSite('site.meta.description', v)} />
        <ImageField label="Favicon URL" value={site.site.meta.favicon} onChange={(v) => updateSite('site.meta.favicon', v)} />
      </section>

      <section className="admin-section">
        <h2>Brand, logos & assets</h2>
        <Field label="First name" value={site.site.brand.firstName} onChange={(v) => updateSite('site.brand.firstName', v)} />
        <Field label="Last name" value={site.site.brand.lastName} onChange={(v) => updateSite('site.brand.lastName', v)} />
        <Field label="Nav display (logo or text)" value={site.site.brand.navDisplay} hint="Use logo for GoodWork symbol" onChange={(v) => updateSite('site.brand.navDisplay', v)} />
        <ImageField label="Logo full colour" value={site.site.assets.logoFullColour} onChange={(v) => updateSite('site.assets.logoFullColour', v)} />
        <ImageField label="Logo white" value={site.site.assets.logoWhite} onChange={(v) => updateSite('site.assets.logoWhite', v)} />
        <ImageField label="Symbol / nav logo" value={site.site.assets.navLogo} onChange={(v) => updateSite('site.assets.navLogo', v)} />
        <Field label="Hero Lottie JSON path" value={site.site.assets.heroLottie} onChange={(v) => updateSite('site.assets.heroLottie', v)} />
        <Field label="Loader Lottie JSON path" value={site.site.assets.loaderLottie} onChange={(v) => updateSite('site.assets.loaderLottie', v)} />
        <ImageField label="Check / tick icon" value={site.site.assets.checkMark} onChange={(v) => updateSite('site.assets.checkMark', v)} />
        <ImageField label="Work folder — front" value={site.site.assets.folderFront} onChange={(v) => updateSite('site.assets.folderFront', v)} />
        <ImageField label="Work folder — projects" value={site.site.assets.folderProjects} onChange={(v) => updateSite('site.assets.folderProjects', v)} />
        <ImageField label="Work folder — back" value={site.site.assets.folderBack} onChange={(v) => updateSite('site.assets.folderBack', v)} />
      </section>

      <section className="admin-section">
        <h2>Contact</h2>
        <Field label="Email" value={site.site.contact.email} onChange={(v) => updateSite('site.contact.email', v)} />
        <Field label="Email display" value={site.site.contact.emailDisplay} onChange={(v) => updateSite('site.contact.emailDisplay', v)} />
        <Field label="Mailto subject (nav)" value={site.site.contact.mailtoSubjectNav} onChange={(v) => updateSite('site.contact.mailtoSubjectNav', v)} />
        <Field label="Mailto subject (footer)" value={site.site.contact.mailtoSubjectFooter} onChange={(v) => updateSite('site.contact.mailtoSubjectFooter', v)} />
      </section>

      <section className="admin-section">
        <h2>Nav social links</h2>
        {site.site.social.nav.map((link, index) => (
          <div key={index} className="admin-card">
            <Field label="Label" value={link.label} onChange={(v) => updateSocialNav(index, 'label', v)} />
            <Field label="Href" value={link.href} onChange={(v) => updateSocialNav(index, 'href', v)} />
            <Field label="External (true/false)" value={String(link.external)} onChange={(v) => updateSocialNav(index, 'external', v === 'true')} />
            <button type="button" className="admin-btn-danger" onClick={() => removeSocialNav(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addSocialNav}>Add nav link</button>
      </section>

      <section className="admin-section">
        <h2>Home — Hero</h2>
        <Field label="Heading" value={site.home.hero.heading} multiline onChange={(v) => updateSite('home.hero.heading', v)} />
        <Field label="Subtitle / title" value={site.home.hero.subtitle} onChange={(v) => updateSite('home.hero.subtitle', v)} />
        <Field label="Hero statement" value={site.home.hero.heroStatement} multiline onChange={(v) => updateSite('home.hero.heroStatement', v)} />
        <ImageField label="Profile photo" value={site.home.hero.profilePhoto} onChange={(v) => updateSite('home.hero.profilePhoto', v)} />
        <Field label="Lottie path" value={site.home.hero.lottie} onChange={(v) => updateSite('home.hero.lottie', v)} />
        <Field label="Video CV — MP4 URL" value={site.home.hero.videoCv?.src} onChange={(v) => updateSite('home.hero.videoCv.src', v)} />
        <ImageField label="Video CV — poster" value={site.home.hero.videoCv?.poster} onChange={(v) => updateSite('home.hero.videoCv.poster', v)} />
      </section>

      <section className="admin-section">
        <h2>Home — Click scroll</h2>
        <Field label="Line 1" value={site.home.clickScroll.lines[0]} onChange={(v) => { const lines = [...site.home.clickScroll.lines]; lines[0] = v; updateSite('home.clickScroll.lines', lines); }} />
        <Field label="Line 2" value={site.home.clickScroll.lines[1]} onChange={(v) => { const lines = [...site.home.clickScroll.lines]; lines[1] = v; updateSite('home.clickScroll.lines', lines); }} />
        <Field label="Line 3" value={site.home.clickScroll.lines[2]} onChange={(v) => { const lines = [...site.home.clickScroll.lines]; lines[2] = v; updateSite('home.clickScroll.lines', lines); }} />
        <Field label="Lottie path (optional)" value={site.home.clickScroll.lottie} onChange={(v) => updateSite('home.clickScroll.lottie', v)} />
      </section>

      <section className="admin-section">
        <h2>Home — Services / capabilities</h2>
        <Field label="Tag" value={site.home.services.tag} onChange={(v) => updateSite('home.services.tag', v)} />
        <Field label="Headline" value={site.home.services.headline} onChange={(v) => updateSite('home.services.headline', v)} />
        {site.home.services.items.map((service, sIdx) => (
          <div key={service.id} className="admin-card">
            <h3>{service.title || `Item ${sIdx + 1}`}</h3>
            <Field label="Title" value={service.title} onChange={(v) => { const items = structuredClone(site.home.services.items); items[sIdx].title = v; updateSite('home.services.items', items); }} />
            <Field label="Description" value={service.description} multiline onChange={(v) => { const items = structuredClone(site.home.services.items); items[sIdx].description = v; updateSite('home.services.items', items); }} />
            <h4>Media ({service.media?.length || 0})</h4>
            {(service.media || []).map((item, mIdx) => (
              <div key={mIdx} className="admin-subcard">
                <Field label="Type (image/video)" value={item.type} onChange={(v) => updateServiceMedia(sIdx, mIdx, 'type', v)} />
                <ImageField label="Src" value={item.src} onChange={(v) => updateServiceMedia(sIdx, mIdx, 'src', v)} />
              </div>
            ))}
            <button type="button" onClick={() => addServiceMedia(sIdx)}>Add media item</button>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2>Home — Benefits / narrative</h2>
        <Field label="Step 1 — line 1" value={site.home.benefits.step1.line1} multiline onChange={(v) => updateSite('home.benefits.step1.line1', v)} />
        <Field label="Step 1 — line 2" value={site.home.benefits.step1.line2} multiline onChange={(v) => updateSite('home.benefits.step1.line2', v)} />
        <Field label="Step 1 — line 3" value={site.home.benefits.step1.line3} multiline onChange={(v) => updateSite('home.benefits.step1.line3', v)} />
        <ImageField label="Step 1 background (Merdeka 118)" value={site.home.benefits.step1.backgroundImage} onChange={(v) => updateSite('home.benefits.step1.backgroundImage', v)} />
        <ImageField label="Silhouette image (optional)" value={site.home.benefits.step1.silhouette} onChange={(v) => updateSite('home.benefits.step1.silhouette', v)} />
        <Field label="Step 2 — headline 1" value={site.home.benefits.step2.headline1} onChange={(v) => updateSite('home.benefits.step2.headline1', v)} />
        <Field label="Step 2 — headline 2 (HTML ok)" value={site.home.benefits.step2.headline2} onChange={(v) => updateSite('home.benefits.step2.headline2', v)} />
        <ImageField label="Step 2 background (Malaysian youth)" value={site.home.benefits.step2.backgroundImage} onChange={(v) => updateSite('home.benefits.step2.backgroundImage', v)} />
        {site.home.benefits.step2.bullets.map((bullet, index) => (
          <Field
            key={index}
            label={`Capability ${index + 1}`}
            value={bullet}
            multiline
            onChange={(v) => {
              const bullets = [...site.home.benefits.step2.bullets];
              bullets[index] = v;
              updateSite('home.benefits.step2.bullets', bullets);
            }}
          />
        ))}
      </section>

      <section className="admin-section">
        <h2>Home — Main CTA</h2>
        <Field label="Headline" value={site.home.cta.headline} onChange={(v) => updateSite('home.cta.headline', v)} />
        <Field label="Subheadline" value={site.home.cta.subheadline} onChange={(v) => updateSite('home.cta.subheadline', v)} />
        <Field label="Button label" value={site.home.cta.buttonLabel} onChange={(v) => updateSite('home.cta.buttonLabel', v)} />
      </section>

      <section className="admin-section">
        <h2>Footer</h2>
        <Field label="Tagline" value={site.site.footer.tagline} onChange={(v) => updateSite('site.footer.tagline', v)} />
        <Field label="Studio name" value={site.site.footer.studio} onChange={(v) => updateSite('site.footer.studio', v)} />
        <ImageField label="Footer logo" value={site.site.footer.logoSrc} onChange={(v) => updateSite('site.footer.logoSrc', v)} />
        <Field label="Footer video URL" value={site.site.footer.video?.src} onChange={(v) => updateSite('site.footer.video.src', v)} />
        <ImageField label="Footer video poster" value={site.site.footer.video?.poster} onChange={(v) => updateSite('site.footer.video.poster', v)} />
        <ImageField label="Footer background image" value={site.site.footer.backgroundImage} onChange={(v) => updateSite('site.footer.backgroundImage', v)} />
      </section>

      <section className="admin-section">
        <h2>Work page</h2>
        <Field label="Headline prefix" value={site.work.headlinePrefix} onChange={(v) => updateSite('work.headlinePrefix', v)} />
        <Field label="Headline" value={site.work.headline} onChange={(v) => updateSite('work.headline', v)} />
        <ImageField label="Folder image" value={site.work.folderImage} onChange={(v) => updateSite('work.folderImage', v)} />
        <Field label="CTA headline" value={site.work.cta.headline} onChange={(v) => updateSite('work.cta.headline', v)} />
        <Field label="CTA subheadline" value={site.work.cta.subheadline} onChange={(v) => updateSite('work.cta.subheadline', v)} />
      </section>

      <section className="admin-section">
        <h2>Work — Projects ({site.work.projects.length})</h2>
        {site.work.projects.map((project, index) => (
          <div key={project.id} className="admin-card">
            <h3>{project.navLabel} — {project.titleLine1}</h3>
            <Field label="Nav label" value={project.navLabel} onChange={(v) => updateProject(index, 'navLabel', v)} />
            <Field label="Title line 1" value={project.titleLine1} onChange={(v) => updateProject(index, 'titleLine1', v)} />
            <Field label="Title line 2" value={project.titleLine2} onChange={(v) => updateProject(index, 'titleLine2', v)} />
            <Field label="Year" value={project.year} onChange={(v) => updateProject(index, 'year', v)} />
            <Field label="Challenge" value={project.challenge} multiline onChange={(v) => updateProject(index, 'challenge', v)} />
            <Field label="Role" value={project.role} multiline onChange={(v) => updateProject(index, 'role', v)} />
            <Field label="Hero image URL" value={project.heroImage || ''} onChange={(v) => updateProject(index, 'heroImage', v || '')} />
            <Field label="Live URL" value={project.liveUrl || ''} onChange={(v) => updateProject(index, 'liveUrl', v || null)} />
          </div>
        ))}
      </section>
    </div>
  );
}
