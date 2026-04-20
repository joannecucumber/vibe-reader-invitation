#!/bin/bash
# Bundle JSX components into invitation.js
# Re-run after editing components/*.jsx
set -e
cd "$(dirname "$0")"
cat components/Envelope.jsx components/Ticket.jsx components/HoloChip.jsx components/Terminal.jsx components/App.jsx > /tmp/invitation.jsx
bunx --bun esbuild /tmp/invitation.jsx --loader:.jsx=jsx --jsx=transform --minify --target=es2017 --outfile=invitation.js
echo "built invitation.js ($(wc -c < invitation.js) bytes)"
