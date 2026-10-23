# PageCopy architecture

The MV3 manifest declares only `activeTab`, `scripting`, and `clipboardWrite`. It has no host permissions, background service worker, persistent content script, options page, or storage.

The popup validates the current URL using `URL` and exact/suffix hostname checks. On a copy button press, it injects `collectPage` into the active tab. The collector is self-contained because Chrome serializes it into the page context; it locates a cautious main/page region, filters invisible and UI elements, traverses structural blocks in source order, and returns `{ ok, title, blocks, warnings, message }`. It never changes the page, scrolls it, expands toggles, or calls network APIs.

The formatter module is pure and converts the result into a plain string. Markdown preserves headings, lists, quoted text, fenced code, links, and simple tables; plain text favors readability. The popup rejects empty output, writes with `navigator.clipboard.writeText`, and announces success only when that promise resolves. Errors and warnings are shown without exposing page content.

The privacy boundary is the user’s active, supported tab at click time. Page data is not logged, stored, uploaded, or injected back as HTML. The rendered DOM is the capture boundary, so virtualized or collapsed content can be absent.
