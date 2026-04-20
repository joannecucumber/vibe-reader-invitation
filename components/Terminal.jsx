// V3 — Terminal / Transmission
// A holographic "sealed transmission" envelope. The top flap is a terminal header
// that lifts up to reveal decrypted codes.

function TerminalV3({ influencer, codes, onReset, isOpen, setIsOpen }) {
  const [copied, setCopied] = React.useState(null);
  const [decrypting, setDecrypting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setDecrypting(true);
      const t = setTimeout(() => setDecrypting(false), 1400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

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

      <div className={`term-scene ${isOpen ? 'is-open' : ''}`}>
        {/* Decrypted content behind */}
        <div className="term-content">
          <div className="term-content-bar">
            <span className="term-dot" />
            <span>SECURE · DECRYPTED</span>
            <span className="term-ts">{timestamp()}</span>
          </div>

          <div className="term-lines">
            <div className="term-line">
              <span className="term-prompt">$</span>
              <span className="term-cmd">decrypt --from="{influencer}"</span>
            </div>
            <div className="term-line term-ok">
              <span className="term-prompt">›</span>
              <span>signature verified · 2 payloads</span>
            </div>
          </div>

          <div className="term-payload">
            <div className="term-payload-header">
              <Sparkle size={12} />
              <span>INVITATION PAYLOAD</span>
            </div>

            <div className="term-from">
              <span className="term-k">from</span>
              <span className="term-v">{influencer}</span>
            </div>

            <div className="term-codes">
              {codes.map((c, i) => (
                <TerminalCodeRow
                  key={c.code}
                  index={i}
                  label={c.label}
                  code={c.code}
                  copied={copied === c.code}
                  onCopy={() => copy(c.code)}
                  decrypting={decrypting}
                />
              ))}
            </div>
          </div>

          <div className="term-content-foot">
            <span>
              <Sparkle size={10} /> Vibe Reader · transmission.log
            </span>
            <span className="term-caret">_</span>
          </div>
        </div>

        {/* Top flap acts as the transmission header */}
        <div className="term-flap">
          <div className="term-flap-face">
            <div className="term-flap-top">
              <div className="term-flap-chips">
                <span className="term-chip term-chip-red" />
                <span className="term-chip term-chip-amber" />
                <span className="term-chip term-chip-green" />
              </div>
              <div className="term-flap-title">
                transmission · 001 · sealed
              </div>
              <div className="term-flap-meta">AES-256</div>
            </div>

            <div className="term-flap-body">
              <div className="term-flap-art">
                <Sparkle size={64} />
                <div className="term-flap-rings">
                  <span /><span /><span />
                </div>
              </div>

              <div className="term-flap-text">
                <div className="term-flap-eyebrow">INCOMING MESSAGE</div>
                <div className="term-flap-headline">
                  A sealed invitation for <em>you</em>.
                </div>
                <div className="term-flap-sub">
                  Break the seal to reveal your access codes.
                </div>
              </div>

              {!isOpen && (
                <button className="term-open-btn" onClick={() => setIsOpen(true)}>
                  <span className="term-open-pulse" />
                  <span className="term-open-label">
                    <Sparkle size={14} />
                    Break Seal
                  </span>
                  <span className="term-open-hint">↑ open</span>
                </button>
              )}

              <div className="term-flap-hashline">
                {'0x' + Math.random().toString(16).slice(2, 18)}
              </div>
            </div>

            <div className="term-flap-perf">
              {Array.from({ length: 60 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
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

function TerminalCodeRow({ index, label, code, copied, onCopy, decrypting }) {
  const [display, setDisplay] = React.useState(decrypting ? scramble(code) : code);

  React.useEffect(() => {
    if (!decrypting) {
      setDisplay(code);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i > 20) {
        setDisplay(code);
        clearInterval(iv);
      } else {
        setDisplay(scramble(code, Math.max(0, i - 4)));
      }
    }, 45);
    return () => clearInterval(iv);
  }, [decrypting, code]);

  return (
    <div className="term-code-row" style={{ '--delay': `${index * 120}ms` }}>
      <div className="term-code-head">
        <span className="term-code-idx">0{index + 1}</span>
        <span className="term-code-label">{label}</span>
      </div>
      <button className={`term-code-btn ${copied ? 'is-copied' : ''}`} onClick={onCopy}>
        <span className="term-code-text">{display}</span>
        <span className="term-code-action">
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy
            </>
          )}
        </span>
      </button>
    </div>
  );
}

function scramble(str, revealFrom = 0) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return str
    .split('')
    .map((c, i) => (i < revealFrom ? c : c === ':' || c === '-' ? c : chars[Math.floor(Math.random() * chars.length)]))
    .join('');
}

function timestamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8) + ' UTC';
}

window.TerminalV3 = TerminalV3;
