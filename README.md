# Hassan Fareed | AI Solutions Analyst Portfolio

A single-page portfolio that positions Hassan Fareed as an AI solutions analyst who maps, redesigns and automates organisation workflows end to end. It is plain HTML, CSS and JavaScript with no build step, so it runs on GitHub Pages or any static host.

## What the page shows

| Section | Content |
| --- | --- |
| Hero | Positioning statement, two calls to action, and an animated workflow map across six business functions, with the human approval step in amber. Each lane is selectable. A proof strip sits below. |
| About | Portrait, analyst positioning, resume download and LinkedIn. |
| Results | Six results: three time-saving estimates, labelled as estimates, and three by-design controls. |
| Services | Eight capabilities, including data analysis and KPIs, end-to-end automation, AI agents, governance, product ownership and solution consulting. |
| Approach | The Agile mindset and data-first approach, then a six-step engagement playbook. |
| Business functions | Seven expandable automation suites: sales, sales development, presales, delivery, finance, talent and operations. |
| Domains | Six industries (healthcare, supply chain and procurement, BFSI, construction and EPC, IT services, media), each with work done and automations designed. |
| Work | Two featured case studies, four shorter ones, and a case study request. |
| Rivox | The AI learning app on Google Play, with the three-question Automation IQ challenge. |
| Experience | Timeline, toolkit, education and certifications. |
| Contact | Email, copy-email button, optional LinkedIn button, and location. |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Structure and all written content, including the operating map SVG. |
| `styles.css` | Design tokens, layout, responsive rules and reduced-motion support. |
| `scripts.js` | Config, navigation, the game layer, suites, domains, the challenge, and copy email. |
| `hassan-fareed.webp`, `hassan-fareed.png` | Portrait, cut to a transparent circle. The page uses the WebP with the PNG as fallback. |
| `Hassan-Fareed-Resume.pdf` | The resume behind every "Download resume" button. |
| `Hassan-Fareed-Resume.docx` | Editable Word version of the resume. Keep it out of the public repository unless you want it downloadable. |
| `og-image.png` | 1200 x 630 preview card shown when the link is shared on LinkedIn. |
| `404.html` | Page shown for broken links, with a way back to the portfolio. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are, without Jekyll processing. |
| `README.md` | This file. |

## Before you publish

1. Open `scripts.js` and edit `CONFIG`:
   - `linkedin`: paste your LinkedIn profile URL. The LinkedIn button stays hidden until you do.
   - `caseStudyUrl`: paste a shared link to the case study PDF. While empty, the button opens an email request.
   - `email` is set to hassanfareed5522@gmail.com.
2. Read through the Experience section and adjust role titles, dates and client names to match your resume exactly.
3. To change colours, edit the variables at the top of `styles.css`. Amber is kept for human approval only, so use it nowhere else.

## Preview locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a public repository. Name it `YOUR-USERNAME.github.io` to publish at `https://YOUR-USERNAME.github.io`, or use any other name to publish at `https://YOUR-USERNAME.github.io/REPO-NAME/`.
2. Upload every file in this folder to the root of the repository, including the hidden `.nojekyll` file. On the web uploader, drag the files in; if `.nojekyll` does not show, create a new empty file with that name.
3. Go to Settings, then Pages. Under Build and deployment, choose Deploy from a branch, select `main` and `/ (root)`, and save.
4. Wait a minute or two, then open the URL GitHub shows on the Pages screen.
5. Edit `index.html` and change the `og:image` value to the full URL of `og-image.png` on your site. LinkedIn only shows the preview card when this is a full URL.
6. Paste your site URL into the LinkedIn Post Inspector (linkedin.com/post-inspector) to refresh the preview.

GitHub Pages file names are case-sensitive, so keep every name exactly as it is. The site uses only relative paths, so it works both as a user site and as a project site.

**Optional custom domain:** add the domain under Settings, then Pages, and GitHub creates a `CNAME` file for you.

## Add it to LinkedIn

- **Featured:** Add featured, then Link, paste the URL, and title it "AI solutions consulting portfolio".
- **Headline idea:** AI Solutions Consultant | Workflow automation across sales, delivery, finance and operations | Business Analyst and Product Owner
- **Post starter:**

  > Most AI projects automate one task. I work on the whole flow: a lead gets scored, a person approves the outreach, the won deal sets up the delivery project, and finance gets the invoice and the board deck. Seven business functions now run automation suites I designed and built. My portfolio walks through how, and it doubles as a game. Link in the comments.

## Updating the resume

Edit `Hassan-Fareed-Resume.docx` in Word, export it as PDF with the same file name, and commit the new PDF to the repository. If you rename it, update `resume` in `CONFIG`.

## The game layer

- **Game mode switch:** the switch in the header turns the game on or off. When off, the level button, XP bar, counters and pop-ups disappear, and no XP is earned. The choice is remembered in the visitor's browser.

- **XP and levels:** visitors earn XP for exploring, from Visitor to Transformation partner at 550 XP. A thin bar under the header shows progress.
- **Achievements:** thirteen, listed in the panel behind the level button at the bottom right. Each one names how to unlock it.
- **Unlocks:** scrolling into key sections, selecting a map lane, opening suites and domains, finishing the challenge, a perfect score, and copying or opening the email.
- **Storage:** progress is saved in the visitor's browser with localStorage, and a reset button clears it. If storage is blocked, progress lasts for the visit.
- **Editing:** change achievements in `QUESTS` and level names in `LEVELS` at the top of the game section in `scripts.js`.

## Notes

- **Fonts:** Unbounded and Manrope load from Google Fonts, with system fonts as fallback.
- **Accessibility:** skip link, keyboard navigation, visible focus, labelled landmarks, a text description for the operating map, and `prefers-reduced-motion` support, which hides the moving dots.
- **Without JavaScript:** all content and links still work. The game layer, the domain cards, the challenge and the copy button need JavaScript.
- **Facts:** every claim on the page comes from your own work history. There are no invented clients or percentages. Add measured results, such as hours saved per workflow, when you have them, because they are the strongest proof a consultant can show.

## Copyright

Copyright 2026 Hassan Fareed. All rights reserved.
