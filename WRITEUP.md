
# AI Proposal Triage Design

## 1. AI vs. Rules

AI extracts proposal details such as price, experience, licence, timeline, warranty, and team qualifications into structured JSON. Each value must include supporting evidence. Missing or unclear information is flagged instead of guessed.

Code handles validation, eligibility checks, scoring, ranking, and audit logs. Proposal text is treated as untrusted input, so embedded instructions cannot change the evaluation rules. A human reviewer makes the final decision.

## 2. Scoring and Explainability

Scoring criteria and weights are stored in a versioned configuration. Each result includes the extracted data, supporting evidence, criterion scores, weighted points, and final score.

Proposals are ranked by total score. Ties are resolved by experience score, lower price, and proposal letter.

The proposed scoring bands are:

- **Experience:** 1–5 projects: 60; 6–8: 80; 9–11: 90; 12+: 100.
- **Price:** Up to $200,000: 100; $200,000.01–$220,000: 90; $220,000.01–$240,000: 80; $240,000.01–$250,000: 70; $250,000.01–$260,000: 60. Over budget: 0 and ineligible.
- **Timeline:** Up to 10 weeks: 100; 11–12: 90; 13–14: 80; 15–16: 70. Over 16 weeks: 0 and ineligible.
- **Warranty:** Panel and workmanship warranties each contribute 50% of the criterion score, based on their respective coverage periods.
- **Team and approach:** Four areas are assessed equally: project lead, qualified crew, safety and roof assessment, and monitoring plan.

These scoring bands are proposed assumptions because the assessment does not specify exact scoring formulas.

## 3. Human Review and Audit

Mandatory checks return `pass`, `fail`, or `unknown`. Failed requirements make a proposal ineligible, while unclear evidence is flagged for clarification.

Reviewers can inspect the evidence and scoring before making the final decision. Any manual changes are recorded with the reviewer, timestamp, reason, and updated values.

The system also records the uploaded file hash, scoring results, criteria version, AI model and prompt versions, and review history.

## 4. Updating Criteria

Existing criteria versions are never overwritten. Changes create a new version with a recorded summary and effective date.

Proposals can be rescored under the new criteria when required. Previous results remain available for auditing, and rankings from different versions are clearly identified.

## 5. Risks and Safeguards

- **Incorrect extraction:** Validate values and show supporting evidence.
- **Missing or fabricated information:** Require evidence and flag uncertain values.
- **Prompt injection:** Treat proposal content as data and ignore embedded instructions.
- **Inconsistent scoring:** Use documented criteria and versioned scoring rules.
- **Missing mandatory evidence:** Request clarification before ranking.
- **Service failures:** Apply file limits, safe retries, caching, and manual review.
- **Security risks:** Use authentication, role-based access, encryption, and upload validation.

## 6. Sample Results

Using the proposed scoring rules:

- **A:** 92.75
- **E:** 83.5
- **C:** 78.25
- **B:** Ineligible because the bidder's own licence is not confirmed.
- **D:** Flagged because its completion timeline is unknown.

Proposal C's embedded instruction to rank it first is ignored. The scores are based on the supplied proposal summaries and do not independently verify credentials.

