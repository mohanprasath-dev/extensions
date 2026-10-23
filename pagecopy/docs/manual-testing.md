# Manual Chrome acceptance checklist

Automated tests do not exercise a live Notion DOM or clipboard. Run and record these checks after loading PageCopy unpacked in real Chrome; none are marked complete by this repository.

## Content coverage

- Short and long pages; multiple headings; paragraphs and line breaks.
- Bulleted, numbered, and nested lists; links; code blocks; tables; quotes and callouts.
- Expanded and collapsed toggles; image captions/alt descriptions; Unicode; large/dynamically loaded pages; content outside the rendered DOM.

For each representative page, copy both formats, paste plain text into a text editor and Markdown into a Markdown editor, then compare headings, links, lists, tables, code, omissions, duplicates, and accidental navigation text.

## Errors and compatibility

- An unrelated website and a `chrome://` URL show unsupported status without injection.
- A tab without a usable URL, an inaccessible page, an unidentified content root, and an empty result report actionable errors.
- Safely simulate clipboard denial and interrupted injection; confirm no success message appears.
- Confirm a visibly incomplete long or collapsed result shows a limitation warning.

## Popup QA

- Check light and dark system themes, compact dimensions, long error wrapping, keyboard tab order, focus visibility, disabled controls, and status announcements with a screen reader.

## v0.2 outstanding checks

- Main Content, Entire Page, and Links Only on a static article, documentation site, modern app, and Notion page.
- Native selects, visible custom menu options, open and closed disclosures, images with alt text, nested lists, tables, and code.
- Direct PDF URL, imported selectable-text PDF, scanned PDF, corrupt PDF, password-protected PDF, and each supported text import type.
- Confirm the donation button remains hidden for the default empty configuration and opens only an allowlisted configured URL.
