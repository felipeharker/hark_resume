# hark_resume — agent guide

The resume, https://resume.felipeharker.org/. Read [`README.md`](README.md)
first. It is one of four sites built to one standard; the standard, the
decision log and the roadmap for all four live in
[`hark_web`](https://github.com/felipeharker/hark_web) (`web/standards/`,
`planning/`).

## Rules

1. **`main` is live.** Render deploys every push to `main`. Work on a branch;
   push or merge to `main` only when the user asks. Never change Render
   settings unless asked.
2. **The repository is public.** Every file here can be read by anyone, not
   only what is served. No secrets, no `.env`, no private notes.
3. **Privacy.** No street address, no phone number, no referees' email
   addresses, no one else's contact details, no client named and no work done
   for one shown. The employer's name is an open decision (`hark_web`,
   `planning/roadmap.md`): never add, change or remove it unless asked.
4. **No links to private `github.com/felipeharker/…` repositories.** A
   visitor gets GitHub's 404. The four public ones — `hark_web`,
   `hark_academic`, `hark_birding`, `hark_resume` — may be linked.
5. **One stylesheet, and it is not here.** The page links
   `https://felipeharker.org/standards/hark.css`, served by `hark_web`, then
   `assets/site.css`, which holds only the print sheet, commented. Never copy the standard; a change to a shared component
   is a change to it, in `hark_web`. No inline `style` attributes, no CSS
   framework, no build step, no JavaScript of its own. The one script is the standard's too:
   every page links `https://felipeharker.org/standards/hark.js` straight
   after its stylesheets, so it is set in the design — sans or serif — the
   reader chose on felipeharker.org's front page. There is no switch here;
   the front page is the only place to choose.
6. **Only `site/` is published.** `resume.md` is a reference copy; the page is
   the source of truth. PDFs are out of the repository for now.
7. **Links.** Within this site: relative. To another site in the family:
   absolute (`tools/site.mjs`), same tab. To anyone else: absolute,
   `target="_blank" rel="noopener noreferrer"`.
8. **Text.** Plain language; headings in Title Case, never numbered. The page
   opens with the running head and ends with the colophon's site links, both
   Portfolio · Resume (`tools/site.mjs`, `NAV`) — this site's own link is `/`,
   with `aria-current="page"`; the standards link is
   `https://felipeharker.org/standards/`.
9. **Keep the docs true.** A change to how something works updates the
   README in the same commit. A decision goes in `hark_web`'s
   `planning/decisions.md`. The family's addresses are in `tools/site.mjs`
   here and in every other `hark_` repository: change them in all four.

## Before a commit

1. `node tools/check.mjs` passes.
2. `node tools/serve.mjs`, and open the page at desktop width, at 390 px and
   in print preview.

Commit messages end with the attribution line the session gives, for example
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
