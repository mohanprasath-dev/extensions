# PageCopy architecture

The MV3 manifest declares only `activeTab`, `scripting`, and `clipboardWrite`. It has no host permissions, background service worker, persistent content script, options page, or storage.

The popup validates the current URL using `URL` and exact/suffix hostname checks. On a copy button press, it injects `collectPage` into the active tab. The collector is self-contained because Chrome serializes it into the page context; it locates a cautious main/page region, filters invisible and UI elements, traverses structural blocks in source order, and returns `{ ok, title, blocks, warnings, message }`. It never changes the page, scrolls it, expands toggles, or calls network APIs.

The formatter module is pure and converts the result into a plain string. Markdown preserves headings, lists, quoted text, fenced code, links, and simple tables; plain text favors readability. The popup rejects empty output, writes with `navigator.clipboard.writeText`, and announces success only when that promise resolves. Errors and warnings are shown without exposing page content.

The privacy boundary is the user’s active, supported tab at click time. Page data is not logged, stored, uploaded, or injected back as HTML. The rendered DOM is the capture boundary, so virtualized or collapsed content can be absent.

## v0.2

`collect-webpage.js` selects a main landmark or the full rendered document and has a links-only mode. It preserves safe absolute HTTP(S)/mail links, lists, tables, code, visible select options, open disclosures, and image labels where available. `src/pdf.js` uses locally bundled PDF.js 5.4.296 and its adjacent worker for imported selectable-text PDFs; pages are represented as `page` blocks. The popup only attempts a direct PDF fetch after an explicit copy action for an obvious PDF URL, otherwise Import PDF is the fallback. Donation configuration is an empty, allowlisted Buy Me a Coffee URL in `src/donation.js`.
