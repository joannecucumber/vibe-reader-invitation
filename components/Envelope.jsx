// V1 — Classic envelope with tech-leaning minimalism
// Flap opens upward; body slides up revealing the invitation card with codes.

function EnvelopeV1({ influencer, codes, onReset, isOpen, setIsOpen }) {
  const [copied, setCopied] = React.useState(null);

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1800);
    } catch (e) {}
  };

  return (
    <div className="stage">
      {/* Ambient sparkle field */}
      <SparkleField />

      <div className={`env-scene ${isOpen ? 'is-open' : ''}`}>
        {/* Revealed card behind the envelope */}
        <div className="env-card" aria-hidden={!isOpen}>
          <div className="env-card-inner">
            <div className="env-card-header">
              <div className="env-eyebrow">
                <Sparkle size={14} />
                <span>You're Invited</span>
              </div>
              <div className="env-from">From</div>
              <div className="env-name">{influencer}</div>
            </div>

            <div className="env-divider" />

            <div className="env-codes">
              {codes.map((c) => (
                <CodeRow
                  key={c.code}
                  label={c.label}
                  code={c.code}
                  copied={copied === c.code}
                  onCopy={() => copy(c.code)}
                />
              ))}
            </div>

            <div className="env-foot">
              <span className="env-foot-brand">
                <Sparkle size={10} />
                Vibe Reader
              </span>
              <span className="env-foot-meta">INV · 2026</span>
            </div>
          </div>
        </div>

        {/* The envelope itself */}
        <div className="env-envelope">
          <div className="env-body">
            <div className="env-body-face">
              <div className="env-stamp">
                <Sparkle size={18} />
              </div>
              <div className="env-address">
                <div className="env-to-label">TO</div>
                <div className="env-to">The Invited Guest</div>
                <div className="env-to-sub">via Vibe Reader · priority delivery</div>
              </div>
              <div className="env-barcode">
                {Array.from({ length: 28 }).map((_, i) => (
                  <i key={i} style={{ height: `${40 + ((i * 7) % 50)}%`, width: `${(i % 3) + 1}px` }} />
                ))}
              </div>
            </div>

            {/* Wax seal / button */}
            {!isOpen && (
              <button
                className="env-seal"
                onClick={() => setIsOpen(true)}
                aria-label="Open invitation"
              >
                <div className="env-seal-ring" />
                <div className="env-seal-core">
                  <Sparkle size={22} />
                </div>
                <div className="env-seal-label">OPEN</div>
              </button>
            )}
          </div>

          {/* Flap — pivots from bottom edge so it swings UP */}
          <div className="env-flap">
            <div className="env-flap-face">
              <div className="env-flap-lines">
                <span /><span /><span />
              </div>
            </div>
          </div>

          {/* Back-side of flap (visible when open) */}
          <div className="env-flap-back" />
        </div>
      </div>

      {isOpen && (
        <button className="env-reset" onClick={onReset} aria-label="Reset">
          ↺ reset
        </button>
      )}
    </div>
  );
}

function CodeRow({ label, code, copied, onCopy }) {
  return (
    <div className="code-row">
      <div className="code-label">{label}</div>
      <button className={`code-pill ${copied ? 'is-copied' : ''}`} onClick={onCopy}>
        <span className="code-pill-text">{code}</span>
        <span className="code-pill-action">
          {copied ? (
            <span className="code-pill-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Copied
            </span>
          ) : (
            <span className="code-pill-copy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

function Sparkle({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M 1.517 17.676 C 8.767 14.669 14.573 8.934 17.63 1.612 C 18.529 -0.537 21.471 -0.537 22.37 1.612 C 25.43 8.934 31.232 14.665 38.483 17.676 C 40.506 18.513 40.506 21.487 38.483 22.324 C 31.232 25.331 25.427 31.066 22.37 38.388 C 21.471 40.537 18.529 40.537 17.63 38.388 C 14.57 31.066 8.767 25.335 1.517 22.324 C -0.506 21.487 -0.506 18.513 1.517 17.676 Z" />
    </svg>
  );
}

function SparkleField() {
  const dots = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);
  return (
    <div className="sparkle-field">
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

window.EnvelopeV1 = EnvelopeV1;
window.Sparkle = Sparkle;
window.SparkleField = SparkleField;
window.CodeRow = CodeRow;
