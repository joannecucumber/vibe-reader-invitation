// V2 — Holo-Chip access card
// A credit-card-sized pass with a sealed top flap; flap hinges up to reveal codes behind.

function HoloChipV2({ influencer, codes, onReset, isOpen, setIsOpen }) {
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
      <SparkleField />

      <div className={`chip-scene ${isOpen ? 'is-open' : ''}`}>
        <div className="chip-backplate">
          <div className="chip-grid" />

          <div className="chip-back-header">
            <span className="chip-back-label">
              <Sparkle size={12} />
              ACCESS GRANTED
            </span>
            <span className="chip-back-id">ID · 0xVR-{hash(influencer)}</span>
          </div>

          <div className="chip-back-title">
            <div className="chip-back-from">Invitation from</div>
            <div className="chip-back-name">{influencer}</div>
          </div>

          <div className="chip-back-codes">
            {codes.map((c) => (
              <HoloCodeRow
                key={c.code}
                label={c.label}
                code={c.code}
                copied={copied === c.code}
                onCopy={() => copy(c.code)}
              />
            ))}
          </div>

          <div className="chip-back-foot">
            <div className="chip-back-meta">
              <span>PRIORITY</span>·<span>TIER 01</span>·<span>EXP 30D</span>
            </div>
            <div className="chip-back-brand">
              <Sparkle size={10} />
              Vibe Reader
            </div>
          </div>
        </div>

        <div className="chip-card">
          <div className="chip-hero">
            {/* Holographic chip */}
            <div className="chip-holo">
              <div className="chip-holo-core" />
              <div className="chip-holo-lines">
                <span /><span /><span /><span />
              </div>
            </div>

            <div className="chip-hero-text">
              <div className="chip-eyebrow">
                <Sparkle size={11} />
                <span>INVITATION · 001</span>
              </div>
              <div className="chip-hero-title">You've been granted access.</div>
              <div className="chip-hero-sub">{influencer}</div>
            </div>

            <div className="chip-corner">
              <span>VR</span>
              <span>//</span>
              <span>26</span>
            </div>
          </div>

          <div className="chip-strip">
            <div className="chip-strip-lines">
              {Array.from({ length: 48 }).map((_, i) => (
                <i key={i} style={{ opacity: 0.2 + ((i * 13) % 80) / 100 }} />
              ))}
            </div>
          </div>

          {!isOpen && (
            <button className="chip-open-btn" onClick={() => setIsOpen(true)}>
              <span className="chip-open-dot" />
              <span>Tap to Open</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            </button>
          )}

          <div className="chip-foot">
            <span>XXXX · XXXX · XXXX</span>
            <span>SEALED</span>
          </div>
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

function HoloCodeRow({ label, code, copied, onCopy }) {
  return (
    <div className="holo-code">
      <div className="holo-code-label">{label}</div>
      <button className={`holo-code-btn ${copied ? 'is-copied' : ''}`} onClick={onCopy}>
        <span className="holo-code-text">{code}</span>
        <span className="holo-code-action">
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy
            </>
          )}
        </span>
      </button>
    </div>
  );
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(6, '0').slice(0, 6).toUpperCase();
}

window.HoloChipV2 = HoloChipV2;
