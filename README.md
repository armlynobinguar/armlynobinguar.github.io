# armlynobinguar.github.io

Personal site of **Armielyn Obinguar** (developer relations at Rise In).

Live: **https://armlynobinguar.github.io**

## What's here

| File | Purpose |
|---|---|
| `index.html` | The page: bio and photo, news, research, projects, talks, experience, quick questions |
| `styles.css` | Classic academic layout adapted from [Jon Barron's website](https://jonbarron.info/) |
| `images/` | Thumbnails for the research and project entries |
| `chat.js` | The "Ask me something" chat; starts when scrolled into view |

No build step and no dependencies: GitHub Pages serves the files as they are.

## Editing

- **Chat answers:** edit `GREETING` and `QUESTIONS` at the top of `chat.js`.
- **Text:** edit `index.html`. The photo is the GitHub avatar, so it updates with your GitHub picture.
- **New paper or project:** copy an existing `<div class="item">` block and add a 160x110 thumbnail to `images/`. Add `highlight` to its class to give it the yellow background.
- **News:** add a `<li>` at the top of the News list with its date.
- **Preview locally:** open `index.html` in a browser, or run `python -m http.server` and visit `http://localhost:8000`.
