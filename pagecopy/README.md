# PageCopy

Copy the page. Keep the structure. PageCopy is a local-first Chrome extension for copying currently rendered web content as Markdown or plain text, with local PDF and text-file import.

## Features

- Main Content, Entire Page, and Links Only web extraction modes
- Local PDF, TXT, MD, CSV, JSON, and XML import; PDFs use bundled PDF.js 5.4.296 (Apache-2.0, notice in `vendor/pdfjs/LICENSE`)
- Structured headings, lists, quotes, code blocks, links, and tables where available in the rendered DOM
- Local-only extraction, formatting, and clipboard writing
- Dark-mode, reduced-motion, keyboard, and screen-reader support
- No account, backend, analytics, storage, content script, or background worker

## Supported pages and limitations

PageCopy supports ordinary HTTP(S) pages, including Notion. It only accesses the active page after a user clicks the extension. It does not scroll, expand controls, call private APIs, or access cookies. Long virtualized pages, closed shadow roots, collapsed disclosures, complex layouts, and scanned PDFs can be incomplete; the popup warns where it can detect that condition. PDF tab retrieval is attempted only for obvious PDF URLs; use Import PDF if it fails.

## Install and use

1. Open Google Chrome and visit `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this `pagecopy/` directory (the folder containing `manifest.json`).
4. Pin PageCopy if desired, open a Notion page, and click its toolbar icon.
5. Choose **Copy as Markdown** or **Copy as Plain Text**, then paste and verify the result.

After source changes, click Reload for PageCopy in `chrome://extensions`, then reopen its popup. To remove it, use Remove on the same page. Chrome Web Store publishing requires a separate review and submission; this project has not been published.

## Development and tests

No package installation or build step is required. With Node.js installed:

```sh
cd pagecopy
npm test
```

The dependency-free tests cover formatter behavior, manifest references, icon dimensions, permissions, and docs. See [manual-testing.md](docs/manual-testing.md) for required real-browser acceptance checks.

## Permissions and privacy

- `activeTab`: temporary access to the active page after the toolbar interaction.
- `scripting`: runs the collector only after a copy action.
- `clipboardWrite`: writes the final text only after collection and formatting succeed.

There are no broad host permissions, network requests, telemetry, persistent page storage, or remote code. Extraction and formatting happen in the browser, and page content is retained only during the copy operation. These are implementation properties, not an independent security audit.

## Donations

Donations are optional. Set a real public `https://buymeacoffee.com/...` page in `src/donation.js`; otherwise the Support PageCopy button is hidden. Create a Buy Me a Coffee creator account, configure payouts there, and copy its public page URL. No payment or supporter data is handled by PageCopy.

## Architecture

`popup.js` validates the active tab, calls the self-contained collector through `chrome.scripting.executeScript`, formats structured results from `src/formatters.js`, and writes the nonempty result to the Clipboard API. `src/collect-page.js` runs in the page context and returns only serializable structured data. Details are in [architecture.md](docs/architecture.md).

## Repository structure

`popup.*` holds the interface, `src/` holds collection and formatting, `icons/` and `assets/` hold local branding, `tests/` holds Node tests, and `docs/` holds design and QA notes.

## Troubleshooting and roadmap

Reload the extension after edits; reload Notion if Chrome reports access failure. Make sure the tab is a supported Notion URL and the popup is newly opened. Future work could improve Notion DOM coverage and add carefully tested site support, while preserving least-privilege access.
