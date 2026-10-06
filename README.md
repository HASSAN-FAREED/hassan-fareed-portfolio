# Hassan Fareed | AI Solutions Portfolio

A single-page portfolio for custom MCP connectors and the Rivox learning app. It runs as plain HTML, CSS, and JavaScript, so it works on W3Schools Spaces and any static host with no build step.

## What the page shows

- **Hero constellation.** An interactive diagram of Claude at the centre and seven custom MCP connectors around it. Node size shows tool count. Hover or focus a node for details, click it to open the matching row below.
- **Connector index.** Seven connectors and 516 tools, ranked by size, with an expandable row for what each one does and how it is controlled.
- **Human approval.** The five-step flow (draft, review, approve or edit, run, log) with the human step highlighted in amber, plus the rules for reads, drafts, and writes.
- **Workflows.** Eight workflows built on the connectors, with the connectors each one calls.
- **Rivox.** The Android learning app on Google Play, with a playable sample quiz question.
- **What comes next.** The build list (Asana first) and three deployment options: local installer, hosted API, and customer infrastructure.
- **Contact.** Email, case study request, and an optional LinkedIn button.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and all written content. The connector rows hold the names and tool counts. |
| `styles.css` | Design tokens, layout, responsive rules, and reduced-motion support. |
| `scripts.js` | Config, the constellation, the tool-count bars, the sample quiz, and navigation. |
| `README.md` | This file. |

## Set it up

1. Open `scripts.js` and edit `CONFIG` at the top.
   - `linkedin`: paste your LinkedIn profile URL. The button stays hidden until you do.
   - `caseStudyUrl`: paste a shared link to the case study PDF. While it is empty, the button opens an email request instead.
   - `email` and `playStore`: already filled in. Change them if they move.
2. To change a connector name, tool count, or description, edit its `.connector` block in `index.html`. The hero diagram reads those values, so nothing else needs to change. If you add or remove a connector, update the headline counts (7 connectors, 516 tools) in the hero, section heading, and meta tags.
3. To change colours, edit the variables at the top of `styles.css`. Cyan and violet mark the machine side. Amber is kept for the human approval step.

## Preview locally

Open `index.html` in a browser. For a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on W3Schools Spaces

1. Sign in at w3schools.com and open Spaces.
2. Create a new space and choose the plain HTML template.
3. Add or replace `index.html`, `styles.css`, and `scripts.js` with the files from this folder. Keep the three file names exactly as they are, because `index.html` links to the other two by name.
4. Save and run the space, then copy its public URL.

The menu labels in Spaces can change over time, so follow the current on-screen steps if they differ from the list above.

## Add it to LinkedIn

- **Featured section.** On your profile, choose Add featured, then Link, and paste the public URL. Title it "AI solutions portfolio".
- **Experience or Projects.** Add the same URL to the project entry for the connectors and for Rivox.
- **Post.** A starting point:

  > I built seven custom MCP connectors that give Claude live access to Zoho CRM, LinkedIn, Azure DevOps, TallyPrime and more. 516 tools in total, and a person approves every action that sends or changes data. The portfolio also has Rivox, my AI learning app on Google Play. Link in the comments.

## Notes

- **Fonts.** Sora and Source Sans 3 load from Google Fonts. If they are blocked, the page falls back to system fonts and stays readable.
- **Accessibility.** Keyboard navigation, visible focus, a skip link, semantic landmarks, and `prefers-reduced-motion` are supported. The diagram also works without a mouse: tab to a node and press Enter.
- **Without JavaScript.** The text content, connector list, and links still work. The hero diagram and the sample quiz need JavaScript.
- **Figures.** Tool counts come from the connectors as loaded on October 6, 2026. The Rivox facts (version 1.0.5, Education category, rated 3+, contains ads) come from its Google Play listing. Update both if they change.
- **Sample quiz.** The question in the Rivox section is an illustration, not a screenshot of the app.

## Copyright

Copyright 2026 Hassan Fareed. All rights reserved.
