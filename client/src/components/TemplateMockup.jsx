import SkeletonImage from './SkeletonImage';

/**
 * Pure-CSS template preview (no images → very lightweight).
 * kind: 'web' shows a browser frame, 'app' shows a phone frame.
 */
const Lines = ({ n = 2, w = [90, 70, 80] }) => (
  <div className="mk-lines">
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} style={{ width: `${w[i % w.length]}%` }} />
    ))}
  </div>
);

function Body({ layout, tpl, mock }) {
  const hero = <strong className="mk-h">{mock.hero}</strong>;
  const cta = <span className="mk-cta">{mock.cta}</span>;
  switch (layout) {
    case 0:
      return (
        <div className="mk-split">
          <div className="mk-split-text">{hero}<Lines n={3} />{cta}</div>
          <div className="mk-img mk-img-tall" />
        </div>
      );
    case 1:
      return (
        <>
          <div className="mk-center">{hero}<Lines n={2} w={[80, 60]} />{cta}</div>
          <div className="mk-cards">
            {[0, 1, 2].map((i) => <div key={i} className="mk-card"><div className="mk-img" /><Lines n={2} w={[80, 50]} /></div>)}
          </div>
        </>
      );
    case 2:
      return (
        <div className="mk-side">
          <div className="mk-sidebar">{[0, 1, 2, 3].map((i) => <span key={i} />)}</div>
          <div className="mk-side-main">
            <div className="mk-stats">{[0, 1, 2].map((i) => <div key={i} className="mk-stat"><b /><Lines n={1} w={[60]} /></div>)}</div>
            {hero}
            <div className="mk-img mk-img-wide" />
          </div>
        </div>
      );
    case 3:
      return (
        <>
          <div className="mk-banner"><div>{hero}{cta}</div></div>
          <div className="mk-cards two">
            {[0, 1].map((i) => <div key={i} className="mk-card"><Lines n={3} w={[90, 70, 50]} /></div>)}
          </div>
        </>
      );
    case 4:
      return (
        <>
          <div className="mk-row-head">{hero}{cta}</div>
          <div className="mk-grid">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="mk-img" />)}</div>
        </>
      );
    default:
      return (
        <>
          <div className="mk-feature"><div className="mk-img" /><div>{hero}<Lines n={2} />{cta}</div></div>
          <div className="mk-list">
            {[0, 1, 2].map((i) => <div key={i} className="mk-list-row"><i /><Lines n={1} w={[70]} /><b /></div>)}
          </div>
        </>
      );
  }
}

// Shortens a real URL down to the "domain/path" text a browser address bar would show.
const shortUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export default function TemplateMockup({ tpl, mock, kind = 'web', size = 'sm', useImage = true }) {
  const [p, a, bg] = tpl.palette || [];
  const style = { '--p': p, '--a': a, '--bg': bg };
  const urlText = tpl.url ? shortUrl(tpl.url) : `${tpl.name.toLowerCase().replace(/[^a-z]/g, '')}.in`;
  const showImage = useImage && !!tpl.image;

  // Real templates (added with an image) reuse the same frame chrome, but the
  // screen shows the actual screenshot instead of a procedurally-built layout.
  const screen = showImage
    ? <SkeletonImage src={tpl.image} alt={tpl.name} className="mk-real-img" />
    : <div className="mk-body"><Body layout={tpl.layout} tpl={tpl} mock={mock} /></div>;

  if (kind === 'app') {
    return (
      <div className={`mk mk-phone mk-${size}`} style={style} aria-hidden="true">
        <div className="mk-notch" />
        <div className="mk-screen">
          {showImage ? screen : (
            <>
              <div className="mk-appbar"><span className="mk-brand">{tpl.name}</span><i className="mk-avatar" /></div>
              {screen}
              <div className="mk-tabbar">
                {mock.nav.map((n) => <span key={n}>{n}</span>)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={`mk mk-browser mk-${size}`} style={style} aria-hidden="true">
      <div className="mk-chrome"><i /><i /><i /><span className="mk-url">{urlText}</span></div>
      <div className="mk-screen">
        {showImage ? screen : (
          <>
            <div className="mk-nav">
              <span className="mk-brand">{tpl.name}</span>
              <span className="mk-links">{mock.nav.map((n) => <span key={n}>{n}</span>)}</span>
            </div>
            {screen}
          </>
        )}
      </div>
    </div>
  );
}
