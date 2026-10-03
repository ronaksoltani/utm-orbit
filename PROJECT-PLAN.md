# Project plan: UTM Orbit

## Brief

**Type:** Marketing and SEO tool

**Problem:** Inconsistent campaign tags make reporting harder to interpret.

**Audience:** A campaign manager building tagged links for multiple channels.

## Experience flow

1. Arrive at a direct, descriptive introduction.
2. Review the sample interface and its scope before interacting.
3. Try the core control: Normalize and export consistent campaign URLs.
4. See a local result or demonstration state without sending a request to a service.

## Interaction

URL parameters are normalized, previewed and batch-exported; existing query parameters are preserved.

## Key design decision

Use lowercase naming conventions and make the final URL visible before copying.

## Boundaries

Naming consistency cannot fix downstream attribution or consent configuration.

The tool is intentionally transparent about its input, assumptions and limits. It is a front-end educational prototype, not a substitute for platform data, professional review or controlled measurement.

## Next iteration

Add team-specific dictionaries and validation rules in an importable config.

## Learning goals

- Structure a complete page with meaningful headings, landmarks and labelled controls.
- Separate visual rules in CSS from interaction logic in JavaScript.
- Make states understandable with keyboard controls and live status text.
- Document assumptions and the boundary between a helpful prototype and a production service.
