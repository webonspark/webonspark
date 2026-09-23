import { useState } from 'react';

/** Wraps an <img> with a shimmer placeholder shown until it finishes loading. */
export default function SkeletonImage({ src, alt = '', className = '' }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`skel-image-wrap ${className}`}>
      {!loaded && <span className="skel" aria-hidden="true" />}
      <img src={src} alt={alt} onLoad={() => setLoaded(true)} className={loaded ? 'is-loaded' : ''} />
    </span>
  );
}
