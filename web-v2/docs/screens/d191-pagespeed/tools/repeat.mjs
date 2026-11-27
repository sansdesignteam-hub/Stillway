// frames > 50 ms that occur at the same place (section, u within 0.1) in every run of a build = systematic
import fs from 'fs'; const dir = process.argv[2];
for (const tag of ['before', 'after']) { const runs = fs.readdirSync(dir).filter((f) => f.startsWith(`${tag}-run`) && f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(`${dir}/${f}`)));
  for (const label of ['desktop', 'mobile']) for (const pass of [0, 1]) { const sets = runs.map((r) => new Set(r[label].passes[pass].slice(1).filter((x) => x[2] > 50).map((x) => `${x[0]}@${(Math.round(x[1] * 5) / 5).toFixed(1)}`)));
    const common = [...sets[0]].filter((k) => sets.every((s) => s.has(k))); console.log(tag, label, 'pass', pass + 1, 'runs', runs.length, 'slow frames per run', runs.map((r) => r[label].passes[pass].slice(1).filter((x) => x[2] > 50).length).join('/'), 'same place in every run:', common.join(' ') || 'none'); } }
