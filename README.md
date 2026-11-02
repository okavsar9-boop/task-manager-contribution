# Task Manager

**Student:** Harun Burkut  
**Vistula student ID:** 64613  
**Course:** Team Project – IT  

A simple task manager made with HTML, CSS, JavaScript and the Supabase REST API. Users can create, read, update, complete/uncomplete, and delete tasks. Tasks persist in a Supabase PostgreSQL database.

## Links

- **Live app:** https://vistula-team-project-64613.github.io/vistula-task-manager/
- **Repository:** https://github.com/vistula-team-project-64613/vistula-task-manager
- **Contribution page (partner adds via PR):** https://vistula-team-project-64613.github.io/vistula-task-manager/contribution.html
- **Contribution JSON (partner adds via PR):** https://vistula-team-project-64613.github.io/vistula-task-manager/contribution.json

> Links above assume your GitHub username is `vistula-team-project-64613`. Update them if your actual username is different.

## Setup

1. Create a **test-only** Supabase project.
2. In Supabase SQL Editor, run `supabase_setup.sql`.
3. In Supabase, copy your project URL and **publishable (public)** API key.
4. Paste these two values into `config.json` (keep `tableName` as `tasks`). **Never put a service_role, secret, or database password here.**
5. Create a public repository called **`vistula-task-manager`** under your course GitHub account, then upload **only the files in this folder** to its root.
6. In GitHub, go to **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root)** and save.
7. Open the live URL and test add, refresh, edit, completion toggle, and delete.
8. Have your partner create a Pull Request that adds `contribution.html` and `contribution.json` to your repository. Merge their PR. **Do not create those files yourself in your repository.**
9. Fork your partner's repository and send a Pull Request adding the two files in `PARTNER_PR_TEMPLATE` (use your own ID 64613). Have your partner merge it.
10. Add both merged Pull Request links below and submit only your live application link to Platon.

## Pull Request evidence

- **My PR to partner's repository:** TODO - add merged PR URL
- **Partner's PR to my repository:** TODO - add merged PR URL

## Notes

This introductory assignment uses a deliberately public read/write demo table. Anyone visiting the published site can edit or delete demonstration tasks. No private data should be entered. The app is not a production service. `supabase_setup.sql` uses a public RLS policy limited to `public.tasks`.
