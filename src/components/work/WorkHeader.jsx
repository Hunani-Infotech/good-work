import { useSite } from '../../context/SiteContext';

export default function WorkHeader() {
  const { site } = useSite();
  const { headlinePrefix, headline, folderImage } = site.work;

  return (
    <div className="header-work-copy">
      <h1 className="text-headline-work">
        {headlinePrefix ? <span className="text-span-6">{headlinePrefix}</span> : null}
        {headline}
      </h1>
      {folderImage ? (
        <img src={folderImage} loading="lazy" alt="" className="folder-work" />
      ) : null}
    </div>
  );
}
