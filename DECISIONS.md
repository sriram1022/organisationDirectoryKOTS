# Technical Decisions — Organisation Directory

## 1. Conflict: Display all organisations vs. API limit of 25 records per request

- **Chosen:** For this prototype, load the expanded local JSON fixture once and filter the normalized records in the browser. This matches the available simulated data source and does not claim to implement the external API.
- **Rejected:** Implementing paginated API requests in the prototype, because no live paginated backend is connected and the local fixture is loaded as a single response.
- **Trade-off:** The prototype does not enforce the API's 25-record request limit or five-requests-per-minute rate limit. A production implementation using that API should request no more than 25 records at a time, respect rate limits, handle retries, and consider incremental loading or server-side filtering.
- **Current implementation:** This assessment prototype loads the expanded local JSON fixture and filters it in the browser. It simulates API delay and failures but does not yet implement a real paginated backend.

## 2. Conflict: Status dot only vs. accessible status information

- **Chosen:** Show a status indicator together with a visible text label, such as “Active”, “Inactive”, “Suspended”, or “Unknown”.
- **Rejected:** Using colour alone to communicate status, because colour differences may not be distinguishable for every user.
- **Trade-off:** The table uses slightly more space, but status remains understandable without relying on colour alone.

## 3. Messy fixture data and normalization

- **Chosen:** Normalize records into new objects before displaying them. Trim names, normalize recognized statuses, validate member counts, safely handle missing owners, and convert valid dates to a consistent format.
- **Rejected:** Modifying the original fixture records or silently correcting uncertain values such as the misspelled status `actve`.
- **Trade-off:** Some invalid values are displayed as “Unknown” or a dash instead of their original raw value. This makes the directory safer to render but does not replace backend data validation.
- **Duplicate IDs:** Use a separate row key for React rendering so duplicate source IDs do not create duplicate React keys.

## 4. Search, filtering, and sorting

- **Chosen:** Debounced name search and status filtering, with search and status values reflected in URL query parameters. Sort by name and creation date on the client.
- **Rejected:** Updating the search result on every keystroke and making a request for each character.
- **Trade-off:** Search updates after a short delay, and filtering/sorting operate on the records loaded in the client.

## 5. Simulated API

- **Chosen:** Load the local fixture with a 400–900 ms delay and approximately 15% simulated failure probability. Provide loading, error, retry, and empty states.
- **Rejected:** Depending on a live backend for this prototype.
- **Trade-off:** This demonstrates expected UI behavior but does not test real network, authentication, or server-side failure handling.

## 6. Create organisation form

- **Chosen:** Validate the required name, 3–80 character length, case-insensitive duplicate names, status, owner email, and optional non-negative integer member count. Show field errors on blur and validate all fields on submit.
- **Rejected:** Showing validation errors on every keystroke.
- **Trade-off:** Newly created records are added to local React state only and are not persisted after refresh. Duplicate checking is limited to the records available to the client.

## 7. Styling and text

- **Chosen:** Centralize user-facing strings in `src/locales/en.json` and use CSS design tokens for colours, spacing, and other shared design values.
- **Rejected:** Scattering repeated text and arbitrary styling values throughout components.
- **Trade-off:** Adding a new visible message requires updating the translation file; this improves consistency and makes future localization easier.

## 8. AI-tool declaration

- **AI assistance:** ChatGPT was used to help plan the implementation, explain React concepts, and draft/refine code and documentation.
- **My responsibility:** I reviewed and adapted the suggestions, ran the application, and am responsible for verifying the final implementation and explaining the design decisions.
