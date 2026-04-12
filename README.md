# Interactive Chord Generator

An interactive music workspace for building chords from note combinations, auditioning them with different instruments, and assembling them into playable progressions.

## Repository Structure

```text
.
├── apps/
│   └── web/                  # Vite + React web interface
└── packages/
    └── chord-core/           # Standalone chord logic + audio engine package
```

## How It Works

The project is split into two layers:

1. `apps/web`
   The visual interface where users select notes, shape chord voicings, audition them with curated instrument presets, and build saved chord progressions.

2. `packages/chord-core`
   The reusable engine layer that contains chord detection, MIDI helpers, preset progression definitions, voicing resolution, progression timing, and Tone.js playback engines.

This keeps the UI decoupled from the harmonic and playback logic so the core can be reused independently from the web app.

## Workspace Commands

```bash
npm install
npm run dev
npm run build
npm run test
```

## NPM Package

The standalone package is prepared under `packages/chord-core` and is intended to be published as `interactive-chord-core`.

## License

This project is licensed under **CC BY 4.0**.

Full license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
