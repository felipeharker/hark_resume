/**
 * This site, and the family of sites it belongs to. tools/check.mjs and
 * tools/serve.mjs read this file.
 *
 *   SITE       this repository's site: its address, and the folder Render
 *              publishes
 *   FAMILY     every site in felipeharker.org's family, in the order of the
 *              site links at the foot of every page. The same list is in every
 *              hark_ repository (hark_web's is tools/sites.mjs); change it in
 *              all of them at once.
 *   STYLESHEET the one shared stylesheet, served by hark_web. Every page links
 *              it by this address; nothing copies it.
 *   SCRIPT     the one shared script, served by hark_web beside the stylesheet.
 *              Every page links it, so it is set in the design the reader
 *              chose on felipeharker.org's front page.
 */

import { existsSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';

export const SITE = { name: 'Resume', url: 'https://resume.felipeharker.org/', dir: 'site', kind: 'static' };

export const FAMILY = [
  { name: 'Portfolio', url: 'https://felipeharker.org/', repo: 'hark_web' },
  { name: 'Academic', url: 'https://academic.felipeharker.org/', repo: 'hark_academic' },
  { name: 'Birding', url: 'https://birds.felipeharker.org/', repo: 'hark_birding' },
  { name: 'Resume', url: 'https://resume.felipeharker.org/', repo: 'hark_resume' },
];

export const STYLESHEET = 'https://felipeharker.org/standards/hark.css';
export const SCRIPT = 'https://felipeharker.org/standards/hark.js';
export const STANDARDS = 'https://felipeharker.org/standards/';

/** The href a site link carries: root-relative to this site, absolute to the others. */
export const siteLinkHref = (site) => (site.url === SITE.url ? '/' : site.url);

/**
 * The file a URL path is served from, or null. Like Render: the path as a
 * file, then with .html, then as a folder's index.html.
 */
export function resolveUrl(root, urlPath) {
  const rest = normalize(decodeURIComponent(urlPath || '/'));
  const base = join(root, rest);
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, `${base}.html`, join(base, 'index.html')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}
