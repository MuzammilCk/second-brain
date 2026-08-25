import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WIKI_ROOT = path.resolve(__dirname, '../../wiki');
const VAULT_ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.resolve(__dirname, '../src/data/generated');

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true });

/* ── helpers ─────────────────────────────────── */

function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const { data: frontmatter, content } = matter(raw);
    const html = marked.parse(content);
    return { frontmatter, content, html };
  } catch (e) {
    // Fallback: strip frontmatter manually if YAML fails (e.g. due to [[wiki-links]])
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    let frontmatter = {};
    let body = raw;
    if (fmMatch) {
      body = raw.slice(fmMatch[0].length);
      // Try to parse sanitized YAML (quote problematic values)
      const sanitized = fmMatch[1].replace(/: (.*)(\[\[.*?\]\])(.*)/g, ': "$1$2$3"');
      try {
        const { data } = matter(`---\n${sanitized}\n---\n`);
        frontmatter = data;
      } catch {
        // Extract basic fields with regex
        const titleMatch = fmMatch[1].match(/title:\s*(.+)/);
        const statusMatch = fmMatch[1].match(/status:\s*(.+)/);
        const stackMatch = fmMatch[1].match(/stack:\s*(.+)/);
        const createdMatch = fmMatch[1].match(/created:\s*(.+)/);
        const updatedMatch = fmMatch[1].match(/last-updated:\s*(.+)/);
        if (titleMatch) frontmatter.title = titleMatch[1].trim();
        if (statusMatch) frontmatter.status = statusMatch[1].trim();
        if (stackMatch) frontmatter.stack = stackMatch[1].trim();
        if (createdMatch) frontmatter.created = createdMatch[1].trim();
        if (updatedMatch) frontmatter['last-updated'] = updatedMatch[1].trim();
      }
    }
    const html = marked.parse(body);
    return { frontmatter, content: body, html };
  }
}

function safeSlug(filename) {
  return path.basename(filename, '.md');
}

function writeJSON(name, data) {
  const outPath = path.join(OUT_DIR, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ ${name}.json (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
}

/* ── projects ────────────────────────────────── */

function buildProjects() {
  const projectsDir = path.join(WIKI_ROOT, 'projects');
  const files = fs.readdirSync(projectsDir).filter(f =>
    f.endsWith('.md') && !f.endsWith('-decisions.md') && f !== 'index.md'
  );

  const projects = files.map(f => {
    const { frontmatter, content, html } = parseMarkdownFile(path.join(projectsDir, f));
    const slug = safeSlug(f);

    // Try to load corresponding decisions file
    const decisionsPath = path.join(projectsDir, `${slug}-decisions.md`);
    let decisions = [];
    if (fs.existsSync(decisionsPath)) {
      decisions = parseDecisions(decisionsPath);
    }

    return {
      slug,
      title: frontmatter.title || slug,
      status: frontmatter.status || 'unknown',
      stack: frontmatter.stack ? frontmatter.stack.split(',').map(s => s.trim()) : [],
      created: frontmatter.created || null,
      lastUpdated: frontmatter['last-updated'] || null,
      related: frontmatter.related || [],
      contentMd: content,
      contentHtml: html,
      decisions,
      decisionCount: decisions.length
    };
  });

  writeJSON('projects', projects);
  return projects;
}

/* ── decisions parser ────────────────────────── */

function parseDecisions(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');
  const decisions = [];
  let current = null;

  for (const line of lines) {
    // Match decision headers like: ## 2026-02-28 — DR-V2-01: Title
    const headerMatch = line.match(/^## (\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)/);
    if (headerMatch) {
      if (current) decisions.push(current);
      current = {
        date: headerMatch[1],
        title: headerMatch[2].trim(),
        context: '',
        decision: '',
        alternatives: '',
        status: 'active'
      };
      continue;
    }

    if (!current) continue;

    if (line.startsWith('**Context:**')) {
      current.context = line.replace('**Context:**', '').trim();
    } else if (line.startsWith('**Decision:**')) {
      current.decision = line.replace('**Decision:**', '').trim();
    } else if (line.startsWith('**Alternatives considered:**')) {
      current.alternatives = line.replace('**Alternatives considered:**', '').trim();
    } else if (line.startsWith('**Status:**')) {
      current.status = line.replace('**Status:**', '').trim();
    }
  }
  if (current) decisions.push(current);
  return decisions;
}

/* ── concepts ────────────────────────────────── */

function buildConcepts() {
  const conceptsDir = path.join(WIKI_ROOT, 'concepts');
  const files = fs.readdirSync(conceptsDir).filter(f =>
    f.endsWith('.md') && f !== 'index.md'
  );

  const concepts = files.map(f => {
    const { frontmatter, content, html } = parseMarkdownFile(path.join(conceptsDir, f));
    return {
      slug: safeSlug(f),
      title: frontmatter.title || safeSlug(f),
      created: frontmatter.created || null,
      lastUpdated: frontmatter['last-updated'] || null,
      related: frontmatter.related || [],
      contentMd: content,
      contentHtml: html
    };
  });

  writeJSON('concepts', concepts);
  return concepts;
}

/* ── log ─────────────────────────────────────── */

function buildLog() {
  const logPath = path.join(WIKI_ROOT, 'log.md');
  if (!fs.existsSync(logPath)) {
    writeJSON('log', []);
    return [];
  }

  const raw = fs.readFileSync(logPath, 'utf-8');
  const lines = raw.split('\n');
  const entries = [];

  for (const line of lines) {
    const match = line.match(/^- \*\*(\d{4}-\d{2}-\d{2})\s*-\s*(.+?)\*\*:\s*(.+)/);
    if (match) {
      entries.push({
        date: match[1],
        label: match[2].trim(),
        description: match[3].trim()
      });
    }
  }

  writeJSON('log', entries);
  return entries;
}

/* ── priorities ──────────────────────────────── */

function buildPriorities() {
  const priPath = path.join(VAULT_ROOT, 'priorities.md');
  if (!fs.existsSync(priPath)) {
    writeJSON('priorities', {});
    return {};
  }

  const { content } = parseMarkdownFile(priPath);
  const sections = {};
  let currentSection = null;

  for (const line of content.split('\n')) {
    const sectionMatch = line.match(/^## (.+)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim().toLowerCase();
      sections[currentSection] = [];
      continue;
    }
    if (currentSection && line.startsWith('- ')) {
      sections[currentSection].push(line.replace(/^- /, '').trim());
    }
  }

  writeJSON('priorities', sections);
  return sections;
}

/* ── placements (gated) ──────────────────────── */

function buildPlacements() {
  // Import site config to check gate
  const configPath = path.resolve(__dirname, '../site.config.js');
  // We check for a simple flag — default off
  // For build-time, we read the config as text and check
  let showPlacements = false;
  try {
    const configText = fs.readFileSync(configPath, 'utf-8');
    showPlacements = configText.includes('showPlacements: true') || configText.includes('showPlacements:true');
  } catch {
    // config doesn't exist, skip
  }

  if (!showPlacements) {
    console.log('  ⊘ placements.json (gated — showPlacements is false)');
    writeJSON('placements', { gated: true });
    return;
  }

  const placementsDir = path.join(WIKI_ROOT, 'placements');
  if (!fs.existsSync(placementsDir)) {
    writeJSON('placements', { gated: false, dsa: null, mockInterviews: [] });
    return;
  }

  // Parse DSA tracker
  let dsa = null;
  const dsaPath = path.join(placementsDir, 'dsa-tracker.md');
  if (fs.existsSync(dsaPath)) {
    const { frontmatter, content, html } = parseMarkdownFile(dsaPath);
    dsa = { frontmatter, contentHtml: html };
  }

  // Parse mock interviews
  let mockInterviews = [];
  const mockPath = path.join(placementsDir, 'mock-interviews.md');
  if (fs.existsSync(mockPath)) {
    const raw = fs.readFileSync(mockPath, 'utf-8');
    const lines = raw.split('\n');
    let current = null;
    for (const line of lines) {
      const headerMatch = line.match(/^## (\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)/);
      if (headerMatch) {
        if (current) mockInterviews.push(current);
        current = { date: headerMatch[1], title: headerMatch[2].trim(), format: '', good: '', fix: '' };
        continue;
      }
      if (!current) continue;
      if (line.startsWith('**Format:**')) current.format = line.replace('**Format:**', '').trim();
      if (line.startsWith('**What went well:**')) current.good = line.replace('**What went well:**', '').trim();
      if (line.startsWith('**What to fix next time:**')) current.fix = line.replace('**What to fix next time:**', '').trim();
    }
    if (current) mockInterviews.push(current);
  }

  writeJSON('placements', { gated: false, dsa, mockInterviews });
}

/* ── stats summary ───────────────────────────── */

function buildStats(projects, concepts, logEntries) {
  const totalDecisions = projects.reduce((sum, p) => sum + p.decisionCount, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const shippedProjects = projects.filter(p => p.status === 'shipped' || p.status === 'done').length;

  // Collect all unique stack items
  const allStacks = new Set();
  projects.forEach(p => p.stack.forEach(s => allStacks.add(s)));

  const stats = {
    totalProjects: projects.length,
    activeProjects,
    shippedProjects,
    totalConcepts: concepts.length,
    totalDecisions,
    totalLogEntries: logEntries.length,
    totalTechnologies: allStacks.size
  };

  writeJSON('stats', stats);
}

/* ── main ────────────────────────────────────── */

console.log('\n🔨 Building vault content...\n');

const projects = buildProjects();
const concepts = buildConcepts();
const logEntries = buildLog();
buildPriorities();
buildPlacements();
buildStats(projects, concepts, logEntries);

console.log('\n✅ Content build complete.\n');
