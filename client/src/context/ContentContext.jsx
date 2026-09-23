import { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../config';

const ContentContext = createContext({ services: [], blogs: [], status: 'loading' });

/**
 * Fetches services + blogs once for the whole app (avoids every page/component
 * that needs them — nav, footer, homepage, contact form, listing pages — doing
 * its own duplicate request). Populated client-side only; server-rendered HTML
 * sees the empty/loading state, same as the rest of the dynamic admin content.
 */
export function ContentProvider({ children }) {
  const [state, setState] = useState({ services: [], blogs: [], status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [servicesRes, blogsRes] = await Promise.all([
          fetch(`${API_URL}/services`).then((r) => r.json()),
          fetch(`${API_URL}/blogs`).then((r) => r.json()),
        ]);
        if (cancelled) return;
        setState({
          services: servicesRes.ok ? servicesRes.services : [],
          blogs: blogsRes.ok ? blogsRes.blogs : [],
          status: 'ready',
        });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, status: 'error' }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
