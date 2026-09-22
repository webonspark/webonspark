import { useContext, useEffect } from 'react';
import { SeoContext, buildTags } from '../utils/seo';

export default function Seo(props) {
  const { jsonLd } = props;
  const ctx = useContext(SeoContext);
  if (ctx) ctx.data = props; // server-side collection

  useEffect(() => {
    const tags = buildTags(props);
    document.title = tags.title;
    tags.meta.forEach(([attr, key, val]) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', tags.canonical);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title, props.description, props.path]);

  if (!jsonLd) return null;
  const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return list.map((obj, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, '\\u003c') }}
    />
  ));
}

