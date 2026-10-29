# MATACS AI Proposal Triage Design

**Candidate:** Usman Aslam  
**Assessment Reference:** MATACS-TH-2026-02  
**Time Spent:** 5 Hours

## Deliverables

- [Process Flow Diagram](diagram/process-flow.png)
- [Design Write-up](WRITEUP.md)
- [AI Prompts](PROMPTS.md)
- [Expected Ranking](ranking.json)
- [JavaScript Prototype](prototype/score.js)

## Overview

This project presents a design for using AI to extract information from proposals and evaluate them against predefined criteria.

The system uses rule-based validation, eligibility checks, weighted scoring, and ranking. Missing or unclear information is flagged for review rather than assumed. Final award decisions remain with the human reviewer.

## AI Usage

ChatGPT was used to help structure the design, draft the extraction prompt, and review the sample ranking. The final decisions were reviewed against the assessment criteria, including bidder eligibility and instructions embedded in proposal content.

## Assumptions

The assessment provides criterion weights but does not define exact scoring bands. The scoring bands and team rubric in `WRITEUP.md` are proposed assumptions designed to make evaluations consistent and repeatable.

