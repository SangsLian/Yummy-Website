# Yummy Grill Sushi & Buffet — Website

A static website for Yummy Grill Sushi & Buffet, 4221 W Bethel Ave, Muncie, IN 47304.
It's plain HTML, CSS and JavaScript with no build step.

## Files

- `index.html` holds the page content.
- `styles.css` holds the design.
- `script.js` runs the mobile menu, scroll animations and photo lightbox.
- `assets/img/` holds the buffet photos and the transparent logo (`logo.png`).

## Preview locally

Open `index.html` in a browser, or run:

```
npx http-server -p 5173 .
```

## Host it free on GitHub Pages

1. Push this folder to a GitHub repository.
2. On GitHub, open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Pick `main` and `/ (root)`, then save.
4. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

You can add a custom domain (for example `yummygrillmuncie.com`) on the same Pages settings screen.

## To update

- **Hours:** look for the `TODO` comment in `index.html` and add the real opening hours.
- **Prices:** add them to the "Visit us" section if you want them shown.
