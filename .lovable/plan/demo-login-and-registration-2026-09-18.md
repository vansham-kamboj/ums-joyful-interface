# Demo login and registration

## Build
- Replace the role switcher with a polished sign-in screen matching Aurora UMS’s frost-glass style.
- Add a registration screen reachable from sign-in, with clear account and school details fields.
- Keep both flows UI-only: provide example credentials, field validation, password visibility controls, loading feedback, and successful entry into the existing dashboard.
- Determine the demo workspace from the example email instead of exposing any role or permission toggle.
- Add sign-out from the sidebar so the demo returns to sign-in.
- Keep the sidebar fixed to the viewport while the main workspace scrolls independently.

## Verification
- Check sign-in, registration switching, validation, demo dashboard entry, sign-out, and mobile layout.
- Confirm the app builds without errors and that page metadata remains complete.

## Technical details
- Keep everything in local React state with no account storage or backend connection.
- Reuse the existing semantic color tokens and Aurora visual language; add only focused authentication styles.
