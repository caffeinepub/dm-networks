# Specification

## Summary
**Goal:** Update public profile wording to business-oriented labels and add a public-only “Number” field that is saved, validated, and privacy-filtered consistently across Profile and Members Directory.

**Planned changes:**
- Update Profile page public profile field labels to: “Business name”, “Slogan”, “Business Description”, and “Location”, including any related helper/placeholder text that references the old meanings.
- Add a new “Number” field to the user profile model, editable from the Profile page only when Profile Visibility is Public, and cleared when switching to Private and saving.
- Extend Profile form validation to validate “Number” only for Public profiles and show an English error message when invalid.
- Update Members Directory UI to display the renamed labels for public profile fields (when values are present and allowed by existing visibility rules).
- Update backend privacy filtering (getUserProfile and getMemberDirectory) so “Number” is treated as public-only: always visible to owner/admin, visible to others only when Public, and blanked for Private profiles returned to non-owners.

**User-visible outcome:** Users can present a business-oriented public profile with updated labels and an optional public “Number” field; the Members Directory reflects the new labels, and the number is only visible according to profile visibility and viewer permissions.
