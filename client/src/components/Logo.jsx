export default function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#2f2065" />
        <path d="M22.5 6 11 22.5h8L16.5 34 29 16.5h-8.2L22.5 6z" fill="#fff" />
        <circle cx="31" cy="9" r="3" fill="#FF1010" />
      </svg>
      <span className="logo-text">
        <strong>
          WebOn<span className="logo-accent">spark</span>
        </strong>
        <small>Technologies</small>
      </span>
    </span>
  );
}
