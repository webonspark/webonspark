/** Small shimmer building blocks for page-level loading states (see .skel in global.css). */
export function SkeletonLine({ width = '100%', height = 14, className = '' }) {
  return <span className={`skel skel-text d-block ${className}`} style={{ width, height }} />;
}

export function SkeletonBlock({ width = '100%', height = 100, className = '', style }) {
  return <span className={`skel d-block ${className}`} style={{ width, height, ...style }} />;
}

/** A generic card-shaped skeleton: an image block + a couple of text lines. Used for grids of service/blog/template cards. */
export function SkeletonCard({ imageHeight = 140 }) {
  return (
    <div className="skel-card">
      <SkeletonBlock height={imageHeight} className="mb-3" />
      <SkeletonLine width="70%" height={18} className="mb-2" />
      <SkeletonLine width="90%" />
    </div>
  );
}

/** Shimmer rows for a table body while it loads — pass the real <thead> as children. */
export function SkeletonTableRows({ cols, rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j}><SkeletonLine width={j === 0 ? 16 : '75%'} /></td>
      ))}
    </tr>
  ));
}
