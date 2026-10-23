# Repository instructions for AI agents

This repository is a collection of independent browser extensions. Treat the repository root as the shared catalogue, not as an extension project.

## Structure

- Every extension lives in its own top-level directory: `extensions/<extension-name>/`.
- Keep all implementation files, package metadata, assets, tests, and extension-specific documentation inside that directory.
- An extension directory must be loadable, testable, and understandable without relying on files from a sibling extension unless the repository explicitly introduces a shared package.
- Do not create nested duplicate directories such as `extension-name/extension-name/`.
- Preserve root-level shared files such as `README.md`, `LICENSE`, and this file. Never overwrite unrelated extension directories.

## Adding or changing an extension

1. Inspect the root and the target extension before editing; preserve existing work.
2. Use a clear lowercase, hyphenated directory name for a new extension.
3. Put the extension manifest at that extension directory's root when it is a browser extension.
4. Keep permissions minimal and document every requested permission in that extension's README.
5. Keep page data local by default: do not add telemetry, remote code, broad host permissions, or persistent storage unless the task specifically requires and justifies them.
6. Include project-local usage, installation, testing, privacy, and limitations documentation.
7. Add or update the root README with a concise entry for a new extension without removing existing entries.
8. Run the relevant tests and validate manifest-referenced files before reporting completion.

## Shared-project changes

- Changes to root documentation must remain accurate for all extensions.
- Do not add dependencies, build tooling, or configuration at the repository root solely for one extension; keep them project-local unless a deliberate shared workflow is requested.
- Do not modify the repository license, GitHub settings, releases, or remote branches unless explicitly asked.

## Completion notes

Report the extension directory changed, tests actually run, and any browser/manual checks that remain unverified. Do not claim a live browser, store, clipboard, or website integration was tested unless it was actually tested.
