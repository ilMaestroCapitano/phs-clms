# Pinagbuhatan High School Computer Laboratory Management System

A responsive Computer Laboratory Management System for Pinagbuhatan High School. The package contains the exact application interface, source files, JSON seed data, browser Local Storage persistence, compiled HTML/CSS/JavaScript, and a GitHub Pages deployment workflow.

## Included technologies

- HTML5 application shell
- CSS3 and Tailwind CSS v4
- JavaScript production bundle
- React 19 and TypeScript source
- JSON seed data
- Browser Local Storage
- Vite production tooling
- Git and GitHub Pages workflow

## System profile

- Five computer laboratories: four JHS and one SHS
- 56 computers per laboratory, or 280 laboratory computers
- 46 JHS laptop-and-tablet sets
- 30 SHS laptops
- Administrator, Teacher, and Student workspaces
- Required request letter for laboratory reservations
- Student equipment reporting with automatic maintenance tagging
- Two-hour Student workstation session and manual lock

## CRUD implementation

The issue and maintenance workflow provides the four required operations:

- **Create:** A Student or inventory user submits an equipment issue.
- **Read:** Administrators view reports on the Dashboard and Maintenance page.
- **Update:** Administrators change a report to In Progress and mark equipment as under maintenance.
- **Delete:** Administrators delete a resolved/unneeded report, returning the equipment to Available.

Equipment and issue changes are stored in Local Storage under:

- `phs-clms-equipment-v1`
- `phs-clms-issues-v1`

Initial school and issue records are stored in `src/data.json`.

## Prototype credentials

Use any password with one of these Employee IDs:

- `admin` — Administrator workspace
- `teacher` — Teacher workspace
- `student` — Restricted Student workstation

## Run in VS Code

Requirements: Node.js 22 and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open the local URL displayed by Vite.

## Production build

```bash
pnpm build
```

The build generates a self-contained `dist/index.html` with its JavaScript, CSS, and images embedded. Open that file directly in a browser, or upload it as a static site. No local web server is required to run the built page.

When opened as a local file, the project-root `index.html` redirects to the standalone build. Run `pnpm build` first if `dist/index.html` is not present or is out of date.

For development, keep using `pnpm dev` and open the local URL displayed by Vite.

## Publish with GitHub Pages

1. Create an empty GitHub repository.
2. Extract this package and open the project folder in VS Code.
3. Initialize and push the repository:

```bash
git init
git add .
git commit -m "Initial PHS CLMS release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Open the **Actions** tab and wait for the deployment workflow to finish.

The Vite configuration uses relative asset paths, allowing deployment to either a user site or a repository subpath.

## Reset local demonstration data

Open browser Developer Tools, go to Application/Storage, and remove the two `phs-clms-*` Local Storage entries. Reloading restores the JSON-backed initial records.
