# hark_resume

The resume of Felipe E. Harker, served at **https://hark-resume.onrender.com/**:
one static page that also prints as a clean sheet. Linked from the
portfolio, [felipeharker.org](https://felipeharker.org/).

One of four sites built to the same standard, each in its own repository:

| Site | Address | Repository |
|---|---|---|
| Portfolio, and the standards | https://felipeharker.org/ | [`hark_web`](https://github.com/felipeharker/hark_web) |
| Academic | https://hark-academic.onrender.com/ | [`hark_academic`](https://github.com/felipeharker/hark_academic) |
| Birding | https://hark-birding.onrender.com/ | [`hark_birding`](https://github.com/felipeharker/hark_birding) |
| Resume | https://hark-resume.onrender.com/ | `hark_resume`, this one |

The design standard — the one shared stylesheet, its docs and its specimen
page — lives in `hark_web` and is served at
https://felipeharker.org/standards/. The page links
`https://felipeharker.org/standards/hark.css`, then its own
`assets/site.css`; there is no copy of the standard here.

## Layout

```
hark_resume/
  README.md
  AGENTS.md                   rules for coding agents (CLAUDE.md points here)
  render.yaml                 the Render service, recorded
  resume.md                   a reference copy of the text; not published, not read by anything
  tools/
    site.mjs                  this site's address, and the family's
    serve.mjs                 serve site/ locally
    check.mjs                 check the page, its links and the published files
  site/                       published, and nothing else
    index.html                the resume: the source of truth for its text
    assets/site.css           its print sheet
```

## Editing

| Want to change | Edit |
|---|---|
| Any text: contact line, education, experience, skills, references | `site/index.html` |
| A section | its `<section>` in `site/index.html`, and its entry in the contents list near the top |
| The print layout | `site/assets/site.css`, which holds only the print sheet |
| Anything shared — type, colour, entries, the footer | the standard, in `hark_web` |

Each job or school is one `<div class="entry">`: title, organisation, a line
with place and dates, then a list of what was done. A new section is a
`<section class="section" id="sec-<name>">` and its entry in the contents
list near the top, with the same name.

When `site/index.html` and `resume.md` disagree, the page is right.

## Running and checking

Node 20.9 or newer, nothing else.

```bash
node tools/serve.mjs
node tools/check.mjs
```

The first serves the page at http://localhost:8000/; the second runs before
every commit. Use the browser's print preview to check the printed sheet
(Letter, default margins, headers and footers off). The print sheet hides
the running head, the contents list, the rule under the masthead and the
footer, darkens the text, and keeps each entry on one page.

## Privacy

The repository is public. Never add a street address, a phone number or a
referee's email address. The address `resume.md` used to carry, the phone
number and the referees' email addresses were taken out on 2026-10-19; the
references are names and roles only. The employer's name is a decision still
open (`hark_web`, `planning/roadmap.md`) — leave it as it is unless you are
deciding it.

## Deploying

A Render static site, `hark-resume`, deployed from `main` on every push: no
build step, publish directory `site`. The settings are recorded in
[`render.yaml`](render.yaml).

The old addresses redirect here: felipeharker.org/resume/ from `hark-site`,
the portfolio's Render service; resume-site-0rfl.onrender.com from
`hark-resume-redirect`, the resume's first Render service, kept only for
that; and resume.felipeharker.org through Porkbun's URL forwarding.
