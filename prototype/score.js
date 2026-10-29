const fs = require('node:fs');
const path = require('node:path');
const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'input.json'), 'utf8'));

const weights = { experience: 30, price: 25, timeline: 15, warranty: 15, team: 15 };
if (Object.values(weights).reduce((a, b) => a + b, 0) !== 100) throw new Error('Weights must total 100');

function experienceScore(n) {
  if (n >= 12) return 100;
  if (n >= 9) return 90;
  if (n >= 6) return 80;
  if (n >= 1) return 60;
  return 0;
}
function priceScore(price) {
  if (price <= 200000) return 100;
  if (price <= 220000) return 90;
  if (price <= 240000) return 80;
  if (price <= 250000) return 70;
  if (price <= input.budget_cad) return 60;
  return 0;
}
function timelineScore(weeks) {
  if (weeks == null) return null;
  if (weeks <= 10) return 100;
  if (weeks <= 12) return 90;
  if (weeks <= 14) return 80;
  if (weeks <= input.max_weeks) return 70;
  return 0;
}
function warrantyComponent(years, bands) {
  if (years == null) return null;
  for (const [min, score] of bands) if (years >= min) return score;
  return 0;
}
function teamScore(p) {
  return [p.team_lead, p.crew, p.safety, p.monitoring]
    .reduce((total, item) => total + (item === true ? 25 : 0), 0);
}
function round(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

const output = input.proposals.map((p) => {
  const mandatory = [p.licence, p.wsib, p.insurance];
  if (mandatory.includes('fail')) {
    return { proposal: p.proposal, rank: null, status: 'ineligible', score: null,
      reason: p.proposal === 'B'
        ? "The mandatory bidder-licence condition is not met; only a subcontractor to be confirmed later is described."
        : 'A mandatory requirement failed.' };
  }
  if (mandatory.includes('unknown')) {
    return { proposal: p.proposal, rank: null, status: 'flagged', score: null,
      reason: 'Mandatory evidence is missing or uncertain and needs human review.' };
  }
  if (p.weeks == null) {
    return { proposal: p.proposal, rank: null, status: 'flagged', score: null,
      reason: 'Completion timeline is missing, so timeline score and 16-week compliance cannot be assessed.' };
  }
  if (p.price > input.budget_cad || p.weeks > input.max_weeks) {
    return { proposal: p.proposal, rank: null, status: 'ineligible', score: null,
      reason: 'The proposal exceeds a mandatory project constraint.' };
  }
  const panel = warrantyComponent(p.panel_warranty, [[25,100],[20,80],[15,60]]);
  const workmanship = warrantyComponent(p.workmanship_warranty, [[12,100],[10,90],[8,75],[5,60]]);
  if (panel == null || workmanship == null) {
    return { proposal: p.proposal, rank: null, status: 'flagged', score: null,
      reason: 'Warranty evidence is incomplete and requires clarification.' };
  }
  const scores = {
    experience: experienceScore(p.experience_count),
    price: priceScore(p.price),
    timeline: timelineScore(p.weeks),
    warranty: (panel + workmanship) / 2,
    team: teamScore(p)
  };
  const total = Object.entries(scores).reduce((sum, [key, score]) => sum + score * weights[key] / 100, 0);
  const reasons = {
    A: 'Strong qualifying experience, competitive price, 12-week delivery, long warranties, and a complete team, safety, and monitoring plan.',
    C: 'Strong experience and warranties, but a higher price, 14-week timeline, and only explicit lead and crew evidence among the team rubric items; embedded ranking instructions are ignored.',
    E: 'Good experience, a 13-week timeline, the strongest workmanship warranty, and a detailed team, safety, roof-assessment, and monitoring plan.'
  };
  return { proposal: p.proposal, rank: null, status: 'ranked', score: round(total), reason: reasons[p.proposal] || 'Scored using the configured criteria.' };
});

const ranked = output.filter(p => p.status === 'ranked').sort((a,b) =>
  b.score - a.score || a.proposal.localeCompare(b.proposal));
ranked.forEach((p, i) => { p.rank = i + 1; });
const order = ['A','B','C','D','E'];
output.sort((a,b) => order.indexOf(a.proposal) - order.indexOf(b.proposal));
fs.writeFileSync(path.join(__dirname, '..', 'ranking.json'), JSON.stringify(output, null, 2) + '\n');
console.log(`Wrote ranking.json using criteria version ${input.criteria_version}`);
