// V4 — Vibe Reader KOL referral ticket
// Full-bleed black. Tap app icon → card flies in from edge-on to camera-facing.

function TicketV4({ influencer, codes, onReset, isOpen, setIsOpen }) {
  const [copied, setCopied] = React.useState(null);
  const [iconLaunched, setIconLaunched] = React.useState(false);

  const launch = () => {
    setIconLaunched(true);
    setTimeout(() => setIsOpen(true), 600);
  };

  const reset = () => {
    setIsOpen(false);
    setTimeout(() => setIconLaunched(false), 300);
  };

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1800);
    } catch (e) {}
  };

  return (
    <div className="stage tkt-stage">
      {!iconLaunched && (
        <button className="tkt-icon-launch" onClick={launch} aria-label="Open your referral pass">
          <img src="assets/app-icon.png" alt="Vibe Reader" />
          <div className="tkt-icon-wordmark">Vibe Reader</div>
          <div className="tkt-icon-hint">
            <span className="tkt-icon-dot" />
            Tap to open your pass
          </div>
        </button>
      )}

      <div className={`tkt-chrome ${iconLaunched ? 'is-visible' : ''}`}>
        <div className="tkt-header">
          <button className="tkt-x" onClick={reset} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div className="tkt-header-title">Your referral pass</div>
          <div style={{ width: 36 }} />
        </div>

        <div className={`tkt-scene ${isOpen ? 'is-open' : ''}`}>
          <div className="tkt-card">
            <div className="tkt-holo-layer" />
            <div className="tkt-dots" />

            <div className="tkt-notch tkt-notch-l" />
            <div className="tkt-notch tkt-notch-r" />
            <div className="tkt-perf" />

            <div className="tkt-card-inner">
              {/* Top row — product + eyebrow */}
              <div className="tkt-top">
                <div className="tkt-top-brand">
                  <div className="tkt-wordmark">Vibe Reader</div>
                  <div className="tkt-eyebrow">Referral Pass · 01</div>
                </div>
                <div className="tkt-top-spark">
                  <Sparkle size={26} />
                </div>
              </div>

              {/* Recommended by */}
              <div className="tkt-hero">
                <div className="tkt-meta-k">Recommended by</div>
                <div className="tkt-user-name">{influencer}</div>
              </div>

              <div className="tkt-divider" />

              {/* Codes */}
              <div className="tkt-codes-block">
                <div className="tkt-meta-k">Your discount codes</div>
                {codes.map((c) => (
                  <TicketCodeRow
                    key={c.code}
                    label={c.label}
                    code={c.code}
                    copied={copied === c.code}
                    onCopy={() => copy(c.code)}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="tkt-bottom">
                <div className="tkt-appmark">
                  <img src="assets/app-icon.png" alt="Vibe Reader" />
                </div>
                <div className="tkt-foot-info">
                  <div className="tkt-handle">vibereader.app</div>
                  <div className="tkt-serial">PASS · {hashSerial(influencer)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tkt-footer">
          <div className="tkt-cta-label">
            <span className="tkt-cta-dot" />
            Copy a code above, then install Vibe Reader
          </div>
          <button className="tkt-primary" onClick={reset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function TicketCodeRow({ label, code, copied, onCopy }) {
  return (
    <div className="tkt-code-row">
      <div className="tkt-code-label">{label}</div>
      <button className={`tkt-code-btn ${copied ? 'is-copied' : ''}`} onClick={onCopy}>
        <span className="tkt-code-text">{code}</span>
        <span className="tkt-code-action">
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </>
          )}
        </span>
      </button>
    </div>
  );
}

function hashSerial(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
}

window.TicketV4 = TicketV4;
