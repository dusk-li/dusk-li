# dusk.li

> **Throwing shade at the web** — rating websites on their dark mode and colour contrast accessibility.

[dusk.li](https://dusk.li) is a Hugo-powered website that catalogues how well websites support **Dark Mode** and meet **WCAG2AA colour contrast** requirements. Site data lives in the [dusk-li-data](https://github.com/dusk-li/dusk-li-data) submodule and is populated automatically by the [a-scanner-duskli](https://github.com/dusk-li/a-scanner-duskli) scanner.

## What is dark mode accessibility?

Dark mode is defined by the [Bureau of Internet Accessibility](https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone) as:

> Instead of displaying dark-colored text over a light background, a dark mode inverts the colour scheme to display light-colored text over a dark background. This can create more contrast between the content and the background, limiting eyestrain and improving content readability.

Dark mode is not a panacea — while it helps with several conditions (e.g. migraines, photosensitivity), it can hinder others if contrast ratios are poor. A truly accessible site must:

1. Support dark mode
2. Recognise the OS-level light/dark preference automatically
3. Allow the user to manually override the theme
4. Pass WCAG2AA colour contrast checks
5. _(Optionally)_ support custom themes without requiring a login

## Repository structure

```
dusk-li/
├── content/
│   └── en/
│       └── docs/
│           ├── a1.overview.md       # "What is dusk.li?" overview page
│           ├── b1.the-list.md       # Full site catalogue page
│           ├── c1.hall-of-fame.md   # Sites scoring 3/3
│           └── c2.hall-of-shame.md  # Sites scoring 0/3
├── data → dusk-li-data              # Git submodule: YAML data files per reviewed site
├── layouts/
│   ├── _default/
│   │   ├── baseof.html              # Base HTML shell
│   │   ├── list.html                # List page template
│   │   └── single.html              # Single page template
│   ├── index.html                   # Homepage (hero + live stats)
│   ├── partials/
│   │   ├── head.html                # <head> metadata
│   │   ├── header.html              # Site header / navigation
│   │   └── footer.html              # Site footer
│   └── shortcodes/
│       ├── sites_table.html         # Full sortable site catalogue table
│       ├── sites_status.html        # Summary count of scanned sites
│       ├── hall_of_fame.html        # 3/3-scoring sites listing
│       └── hall_of_shame.html       # 0/3-scoring sites listing
├── static/                          # Static assets (CSS, images, fonts)
├── hugo.yaml                        # Hugo configuration
├── netlify.toml                     # Netlify build & header configuration
└── .gitmodules                      # Declares the dusk-li-data submodule
```

## Architecture

```
a-scanner-duskli        dusk-li-data            dusk-li             dusk.li
(GitHub Actions)  ───▶  (git repo)       ───▶   (this repo)  ───▶  (Netlify)
 commits YAML           submodule update         Hugo build
```

- **Data flow:** The scanner writes one `<domain>.yaml` per reviewed site to `dusk-li-data`. When `dusk-li-data` pushes to `main`, a workflow updates the `data` submodule pointer here, triggering a Netlify rebuild.
- **Hugo data templates:** The `layouts/shortcodes/sites_table.html` shortcode iterates over `$.Site.Data.websites` (the submodule contents) to render the catalogue table.

## Development setup

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (see `netlify.toml` for the pinned version — currently **0.120.4**)
- Git (with submodule support)

### Clone with submodules

```bash
git clone --recurse-submodules https://github.com/dusk-li/dusk-li.git
cd dusk-li
```

If you have already cloned without submodules:

```bash
git submodule update --init --recursive
```

### Run locally

```bash
hugo server
```

The site will be available at `http://localhost:1313`.

### Update data submodule

To pull the latest site data from `dusk-li-data`:

```bash
git submodule update --remote data
git add data
git commit -m "chore: update data submodule to latest"
```

## Deployment

The site is deployed to [Netlify](https://netlify.com). The `netlify.toml` defines:

- **Production build command:** `hugo`
- **Deploy preview / branch deploy:** `hugo --gc --minify --buildFuture --buildDrafts`
- **Security headers:** `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`

Netlify automatically rebuilds when a push reaches the `main` branch of this repository (typically triggered by the `update-dusk-li.yml` workflow in `dusk-li-data`).

## Hugo configuration highlights (`hugo.yaml`)

| Setting | Value |
|---------|-------|
| Default language | `en` (English) |
| Site title | `dusk.li` |
| Site description | `Throwing shade at the web` |
| `enableGitInfo` | `true` (exposes last-commit dates) |
| Content directory | `content/en` |

## Contributing

- To **add or update a site listing**, see [dusk-li-data](https://github.com/dusk-li/dusk-li-data)
- To **request an automated review**, open an issue at [a-scanner-duskli](https://github.com/dusk-li/a-scanner-duskli/issues/new?template=review-request.yml)
- To **contribute to the website** (layouts, content, styling), fork this repo and open a pull request

## License

GPL-3.0 — see [LICENSE](LICENSE).
