#!/usr/bin/env node
/**
 * Checks this site against the Hark web standards. Changes nothing; exits 1
 * on any problem, so it can run before every commit.
 *
 *   node tools/check.mjs
 *
 * 1. Pages      every page links the shared stylesheet and script, carries links to
 *               every site in the family in its running head and its
 *               colophon, and links the standards.
 * 2. Links      every link, image and stylesheet within this site resolves to
 *               a file, and every same-page #anchor to an id.
 * 3. Published  a static site's folder holds only web files — no PDFs, notes,
 *               models or Markdown — and no copy of the shared stylesheet
 *               exists anywhere but the one generated file a Next app needs.
 *
 * The rules are the standard's, in hark_web: web/standards/docs/.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILY, SCRIPT, SITE, STANDARDS, STYLESHEET, resolveUrl, siteLinkHref } from './site.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules', '.next']);
const WEB_FILES = new Set(['.html', '.css', '.svg', '.jpg', '.jpeg', '.png', '.webp', '.ico']);
const GENERATED = 'web/src/app/hark.css';
const problems = [];
const problem = (where, what) => problems.push(`${where}: ${what}`);
const rel = (p) => relative(ROOT, p).split(sep).join('/');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP.has(name)) walk(p, out); } else out.push(p);
  }
  return out;
}

const dir = join(ROOT, SITE.dir);

// -- 1 and 2. Every page -------------------------------------------------------

console.log('Pages and links\n');

if (!existsSync(dir)) {
  console.log(`  ${SITE.name}: skipped — ${SITE.dir} is not built (npm run build in web/)`);
} else {
  const pages = walk(dir).filter((f) => f.endsWith('.html') && !/(^|[\\/])(404|_not-found)\.html$/.test(f));
  let broken = 0;
  let inBrowser = 0;

  for (const file of pages) {
    // Comments hold instructions with placeholder paths; they are not links.
    const html = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    const where = rel(file);
    const pageUrl = '/' + relative(dir, file).split(sep).join('/');

    // A Next page that renders its body in the browser ships only a loading
    // fallback; its links exist once it runs, so only its assets are checked.
    const clientRendered = html.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING');
    if (clientRendered) inBrowser++;

    if (SITE.kind === 'static' && !html.includes(`href="${STYLESHEET}"`)) problem(where, `does not link ${STYLESHEET}`);
    if (!html.includes(`src="${SCRIPT}"`)) problem(where, `does not link ${SCRIPT}`);
    const nav = html.match(/<nav class="site-links"[\s\S]*?<\/nav>/);
    const head = html.match(/<nav class="runhead-links"[\s\S]*?<\/nav>/);
    if (!clientRendered) {
      if (!nav) problem(where, 'has no site links');
      else for (const s of FAMILY) if (!nav[0].includes(`href="${siteLinkHref(s)}"`)) problem(where, `site links miss ${s.name} (${siteLinkHref(s)})`);
      if (!head) problem(where, 'has no running head');
      else for (const s of FAMILY) if (!head[0].includes(`href="${siteLinkHref(s)}"`)) problem(where, `running head misses ${s.name} (${siteLinkHref(s)})`);
      if (!html.includes(`href="${STANDARDS}"`)) problem(where, `does not link ${STANDARDS}`);
    }

    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, attr] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(attr)) continue;
      const [pathPart, hash] = attr.split('#');
      if (!pathPart) {
        if (hash && !ids.has(hash)) { problem(where, `#${hash} has no target`); broken++; }
        continue;
      }
      const target = new URL(pathPart, `http://x${pageUrl}`).pathname;
      if (!resolveUrl(dir, target)) { problem(where, `${attr} does not resolve`); broken++; }
    }
  }
  const note = inBrowser ? ` (${inBrowser} rendered in the browser: links not checked)` : '';
  console.log(`  ${SITE.name.padEnd(10)} ${String(pages.length).padStart(4)} pages, ${broken} broken links${note}`);
}

// -- 3. Published folder and stray copies --------------------------------------

console.log('\nPublished folder\n');

if (SITE.kind === 'static') {
  const files = walk(dir);
  const odd = files.filter((f) => !WEB_FILES.has(extname(f).toLowerCase()));
  for (const f of odd) problem(rel(f), `is not a web file, and everything in ${SITE.dir}/ is published`);
  console.log(`  ${SITE.name.padEnd(10)} ${String(files.length).padStart(4)} files, ${odd.length} that should not be published`);
}

for (const f of walk(ROOT)) {
  const name = f.split(sep).pop();
  const r = rel(f);
  if (r.startsWith(`${SITE.dir}/`) && SITE.kind === 'next') continue;
  if ((name === 'hark.css' && r !== GENERATED) || name === 'hark-styles.css') {
    problem(r, `is a copy of the shared stylesheet; link ${STYLESHEET} instead`);
  }
}

// -- Result --------------------------------------------------------------------

if (problems.length) {
  console.log(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems.slice(0, 60)) console.log(`  - ${p}`);
  if (problems.length > 60) console.log(`  … and ${problems.length - 60} more`);
  process.exit(1);
}
console.log('\nEverything is in step.');
