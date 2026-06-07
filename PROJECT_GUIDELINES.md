# Project Guidelines

## Branching Rules

1. The `main` branch is only for final stable versions.
2. The `development` branch is where all completed features are merged first.
3. Every new page or major feature must be developed on its own feature branch.
4. Feature branch naming format:
   - `feature/home-page`
   - `feature/programs-page`
   - `feature/about-page`
   - `feature/program-detail-pages`
   - `feature/admin-edit-content`
   - `feature/responsive-polish`
5. Do not push directly to `main`.
6. After each feature:
   - Run `npm run build`
   - Commit changes
   - Push the feature branch
   - Open a pull request from the feature branch to `development`
7. Only after all features are complete should `development` be merged into `main`.

## Site Rules

1. Public navigation must only include About Us and Programs.
2. Do not add Schedule anywhere.
3. Admin page should not appear in public navigation.
