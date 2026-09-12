# Bhumi Kapoor — Portfolio

A responsive, static portfolio with local images, an image carousel, project filters and detail dialogs, expandable experience, a draggable achievement photo board, certification links, research cards, an editorial testimonial collage, a split contact form, Spotify embed and an animated footer.

## Vercel deployment

Import this repository into Vercel. The included `vercel.json` selects **Other**, skips dependency installation and building, and serves **dist**. No environment variables or backend are needed.

Alternatively, extract `Bhumi-Kapoor-Vercel.zip`, then import its contents into your Git repository or run `vercel` from the extracted folder with the Vercel CLI installed and authenticated. Deployment is not performed by this project automatically.

Vercel documentation: https://vercel.com/docs/builds and https://vercel.com/docs/project-configuration/vercel-json

## Local preview

Run `npm run dev` with Node.js installed, then open http://127.0.0.1:4173/. Run `npm run check` to check JavaScript syntax. There are no npm dependencies to install.

## Editing

- `dist/index.html`: page content; the original hero and skills markup is preserved.
- `dist/style.css`: original hero and skills styles.
- `dist/portfolio.css`: all new sections and responsive styles.
- `dist/portfolio.js`: image gallery, project filters/dialogs, photo board, contact form and entrance animation.
- `dist/project-data.json`: descriptions shown in project dialogs. Keep card titles in `index.html` synchronized with changes here.
- `dist/assets/`: local photos and downloadable résumé. No LinkedIn image URLs are needed at runtime.
- `tools/build-portfolio.py`: optional Python authoring helper that regenerates the expanded HTML and project data. Edit its content instead of editing generated HTML if you plan to rerun it.

## Important content notes

Testimonials are explicitly **draft wording**, not approved endorsements. Names/roles for Prabhmannat Singh and Arnav were supplied by the owner. Riya Mehta is a clearly labeled fictional example. Replace the avatar placeholders, obtain approval for the quotes, and update those labels before treating them as genuine testimonials.

The contact form opens the visitor's email application with a draft. It does not send or store submissions. The page explains this, and a direct email link is available as fallback.

The contact layout keeps the form and a simple laptop illustration, without a separate greeting banner or decorative badge. Footer navigation follows the large portfolio name.

Project cards include editorial imagery and actual LinkedIn photos. Editorial images are labeled in project details; they are not presented as product screenshots. No fabricated project performance results, publication DOIs or live demos are included.

Virtual Simulation Labs is presented as a **featured concept** added at the owner’s request. Its original interface illustration was created specifically for this portfolio and the copy asks the owner to confirm implementation status before presenting it as shipped work.

See `CONTENT-SOURCES.md` for factual sources, date differences and asset credits.
