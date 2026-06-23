# XiYe20.github.io

Personal homepage and paper project pages, served as static HTML via GitHub Pages.

## Structure

```
.
├── index.html              # Personal homepage (bio, news, publications)
├── css/style.css           # Homepage styles
├── assets/                 # Homepage assets (profile photo, etc.)
├── projects/
│   └── SHIFT/              # One folder per paper -> /projects/SHIFT/
│       ├── index.html
│       └── static/         # css / js / images for this paper
├── .nojekyll               # serve files as-is (no Jekyll build)
└── README.md
```

## Add a new paper

1. Copy `projects/SHIFT/` to `projects/<NAME>/`.
2. Edit `projects/<NAME>/index.html` and replace the `TODO` placeholders.
3. Add a publication entry on the homepage (`index.html`, copy a `.pub` block).
4. It will be live at `https://xiye20.github.io/projects/<NAME>/`.

## Preview locally

```
python3 -m http.server 8000
# then open http://localhost:8000/
```
