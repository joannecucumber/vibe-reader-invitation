// Main app — orchestrates the three variations

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "variant": "ticket",
    "influencer": "愷文．行銷筆記｜Kevin Wu"
  }/*EDITMODE-END*/;

  const [variant, setVariant] = React.useState(TWEAK_DEFAULTS.variant);
  const [influencer, setInfluencer] = React.useState(TWEAK_DEFAULTS.influencer);
  const [isOpen, setIsOpen] = React.useState(false);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // reset open state when variant changes
  React.useEffect(() => { setIsOpen(false); }, [variant]);

  const codes = [
    { label: "Unlimited · Monthly · First month 50% off", code: "KEVINWUUM50" },
    { label: "Plus · Yearly · First year 50% off",        code: "KEVINWUPY50" },
  ];

  // Tweak mode protocol
  React.useEffect(() => {
    function onMsg(e) {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (d.type === '__deactivate_edit_mode') setTweaksOpen(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const persist = (partial) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: partial }, '*');
  };

  const updateVariant = (v) => { setVariant(v); persist({ variant: v }); };
  const updateInfluencer = (v) => { setInfluencer(v); persist({ influencer: v }); };

  const props = {
    influencer,
    codes,
    isOpen,
    setIsOpen,
    onReset: () => setIsOpen(false),
  };

  return (
    <div className="app">
      <div className="brand-corner">
        <Sparkle size={14} />
        <span>Vibe Reader · Invitation</span>
      </div>

      {variant === 'ticket'   && <TicketV4 {...props} />}
      {variant === 'envelope' && <EnvelopeV1 {...props} />}
      {variant === 'chip'     && <HoloChipV2 {...props} />}
      {variant === 'terminal' && <TerminalV3 {...props} />}

      {tweaksOpen && (
        <Tweaks
          variant={variant}
          onVariant={updateVariant}
          influencer={influencer}
          onInfluencer={updateInfluencer}
          onClose={() => setTweaksOpen(false)}
        />
      )}
    </div>
  );
}

function Tweaks({ variant, onVariant, influencer, onInfluencer, onClose }) {
  return (
    <div className="tweaks">
      <div className="tweaks-header">
        <div className="tweaks-title">
          <Sparkle size={10} />
          TWEAKS
        </div>
        <button className="tweaks-close" onClick={onClose}>×</button>
      </div>

      <div className="tweaks-group">
        <div className="tweaks-label">Variation</div>
        <div className="tweaks-segmented">
          {[
            { id: 'ticket',   label: 'Ticket' },
            { id: 'envelope', label: 'Envlp' },
            { id: 'chip',     label: 'Chip' },
            { id: 'terminal', label: 'Trans' },
          ].map(v => (
            <button
              key={v.id}
              className={`tweaks-seg ${variant === v.id ? 'is-active' : ''}`}
              onClick={() => onVariant(v.id)}
            >{v.label}</button>
          ))}
        </div>
      </div>

      <div className="tweaks-group">
        <div className="tweaks-label">Influencer name</div>
        <input
          className="tweaks-input"
          value={influencer}
          onChange={(e) => onInfluencer(e.target.value)}
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
