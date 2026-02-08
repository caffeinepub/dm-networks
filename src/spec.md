# Specification

## Summary
**Goal:** Add a manual, admin-assigned “Verified” badge for users and display it across the app.

**Planned changes:**
- Backend: store a per-Principal Verified state (default off) and expose read access for verified status.
- Backend: add an admin-only method to set/unset a user’s Verified status, rejecting non-admin callers.
- Backend: include verified status in existing members directory and user-profile read responses without changing existing profile privacy/visibility behavior (badge always visible).
- Frontend: add React Query hooks to read verified status and to admin-toggle it, with appropriate cache invalidation.
- Frontend: show a “Verified” badge next to user names in Members Directory and Live Chat; add an admin-only toggle control on member cards with loading/disabled states and English error messaging.

**User-visible outcome:** Verified users are clearly labeled “Verified” wherever their identity appears (directory and chat), and admins can manually turn the badge on/off for any user from the Members Directory.
