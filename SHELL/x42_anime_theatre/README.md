# X42 — Utopia Now · Quantum Anime Theatre

A no-build anime webapp prototype inspired by the supplied X42 character sheet and the supplied Quantum / Paper Theatre UI references.

## What it does

- Uses the supplied X42 character sheet as the source for local sprite crops.
- Animates the character with lightweight CSS theatre motion.
- Has a playable six-scene anime-web-novel sequence.
- Includes a dedicated Equipment tab using the character-sheet props.
- Includes Sleep / Fight / Learn / Dance scene actions.
- Lets you paste GitHub `blob` URLs or `raw.githubusercontent.com` URLs for your own PNG/JPG/WEBP/GIF assets.
- Saves linked asset URLs in `localStorage`, so they remain after refresh.
- Works as a static site: no Node.js, database, or build system required.

## GitHub / GitHub Pages setup

1. Create a public repository.
2. Upload the contents of this folder.
3. Enable GitHub Pages for the repository.
4. Open the deployed `index.html`.
5. In **GitHub Assets**, paste a file URL such as:
   `https://github.com/YOU/REPO/blob/main/assets/rin-battle.png`
6. The app automatically converts that to a raw file URL and stores it locally.

For the most reliable delivery, use a public raw URL:
`https://raw.githubusercontent.com/YOU/REPO/main/assets/rin-battle.png`

Private GitHub files are not directly supported because a static browser app should not expose repository credentials/tokens.

## Folder structure

```text
x42-anime-theatre/
├── index.html
├── styles.css
├── app.js
├── README.md
└── assets/
    ├── character-sheet.png
    ├── hero-character.png
    ├── outfit-*.png
    ├── jacket.png
    ├── headset.png
    ├── skirt.png
    ├── utility-bag.png
    ├── energy-orb.png
    ├── lantern.png
    └── expression-*.png
```

## Extending it

The `scenes` array in `app.js` controls the novel sequence. Add more scenes with:

```js
{
  title: "Scene title",
  body: "Novel text shown in the scene panel.",
  caption: "Short cinematic caption.",
  outfit: "assets/your-sprite.png"
}
```

The `equipment` array controls the equipment inventory.

For a larger production version, the next step would be a React/Three.js version with:
- sprite-sheet frame animation
- drag/drop stage composition
- camera/keyframe timeline
- dialogue boxes and branching novel choices
- audio/music tracks
- GitHub manifest loading
- exportable scene JSON
- optional 3D/Live2D character layers
