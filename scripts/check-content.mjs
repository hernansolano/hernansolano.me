import { existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

// Validate editorial JSON before deployment, including links that become hrefs.
const locales = ['es', 'en'];
const read = (name) => JSON.parse(readFileSync(new URL(`../content/${name}.json`, import.meta.url), 'utf8'));
const text = (value, path, allowEmpty = false) => assert(typeof value === 'string' && (allowEmpty || value.trim()), `${path}: expected text`);
const strings = (value, path) => {
  assert(Array.isArray(value), `${path}: expected an array`);
  value.forEach((entry, i) => text(entry, `${path}[${i}]`));
};
const link = (value, path) => {
  text(value, path, true);
  if (!value) return;
  const url = new URL(value);
  assert(url.protocol === 'https:' && !url.username && !url.password, `${path}: use a public HTTPS URL`);
  assert(!['example.com', 'localhost', '127.0.0.1'].includes(url.hostname), `${path}: placeholder URL`);
  assert(!(url.hostname === 'github.com' && url.pathname === '/'), `${path}: link to a specific profile or repository`);
};
const fields = (entry, names, path) => names.forEach((key) => text(entry[key], `${path}.${key}`));
const localImage = (value, path) => {
  text(value, path);
  assert(/^\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif)$/.test(value), `${path}: use a local raster image path`);
  assert(existsSync(new URL(`../public${value}`, import.meta.url)), `${path}: missing image file`);
};

const data = Object.fromEntries(['profile', 'projects', 'experience', 'education', 'skills', 'languages'].map((name) => [name, read(name)]));
for (const locale of locales) {
  for (const [name, value] of Object.entries(data)) assert(value[locale], `${name}.${locale}: missing locale`);
  const profile = data.profile[locale];
  fields(profile, ['name', 'title', 'description', 'about'], `profile.${locale}`);
  text(profile.email, `profile.${locale}.email`, true);
  assert(!profile.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email), 'Invalid public email');
  if (profile.resumePath) {
    assert(/^\/cv\/[a-z0-9-]+\.pdf$/.test(profile.resumePath), 'Use a local CV PDF');
    assert(existsSync(new URL(`../public${profile.resumePath}`, import.meta.url)), `Missing CV: ${profile.resumePath}`);
  }
  for (const key of ['github', 'linkedin']) link(profile.social[key], `profile.${locale}.social.${key}`);
  for (const key of ['frontend', 'backend', 'tools']) strings(data.skills[locale][key], `skills.${locale}.${key}`);
  for (const key of ['projects', 'experience', 'education', 'languages']) assert(Array.isArray(data[key][locale]), `${key}.${locale}: expected array`);
  const ids = new Set();
  for (const project of data.projects[locale]) {
    fields(project, ['id', 'title', 'description'], `projects.${locale}`);
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) && !ids.has(project.id), `Invalid or duplicate project ID: ${project.id}`);
    ids.add(project.id);
    strings(project.techStack, `${project.id}.techStack`);
    for (const key of ['githubLink', 'liveLink']) link(project[key], `${project.id}.${key}`);
    text(project.imagePath, `${project.id}.imagePath`, true);
    assert(!project.imagePath || /^\/(?!\/)/.test(project.imagePath), `${project.id}: use a local image path`);
    if (project.imagePath) localImage(project.imagePath, `${project.id}.imagePath`);
    if (project.screenshots !== undefined) {
      assert(Array.isArray(project.screenshots), `${project.id}.screenshots: expected array`);
      const images = new Set();
      for (const shot of project.screenshots) {
        localImage(shot.src, `${project.id}.screenshots.src`);
        assert(!images.has(shot.src), `${project.id}: duplicate screenshot`);
        images.add(shot.src);
        text(shot.alt, `${project.id}.screenshots.alt`);
        if (shot.caption !== undefined) text(shot.caption, `${project.id}.screenshots.caption`);
      }
    }
    for (const key of ['category', 'year', 'challenge', 'approach', 'outcome', 'status']) if (project[key] !== undefined) text(project[key], `${project.id}.${key}`);
  }
  for (const entry of data.experience[locale]) {
    fields(entry, ['company', 'role', 'duration'], `experience.${locale}`);
    strings(entry.responsibilities, `experience.${locale}.responsibilities`);
  }
  for (const entry of data.education[locale]) fields(entry, ['institution', 'degree', 'duration', 'details'], `education.${locale}`);
  for (const entry of data.languages[locale]) {
    fields(entry, ['language'], `languages.${locale}`);
    text(entry.level, `languages.${locale}.level`, true);
  }
}
assert.deepEqual(data.projects.es.map(({id}) => id).sort(), data.projects.en.map(({id}) => id).sort(), 'Translate every project into both locales');
console.log('Content validated: schemas, locales, project IDs and public links.');
