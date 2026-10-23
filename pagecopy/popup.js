import { collectPage } from "./src/collect-page.js";
import { toMarkdown, toPlainText } from "./src/formatters.js";

const controls = [...document.querySelectorAll(".copy-action")];
const status = document.querySelector("#operation-status");
const pageStatus = document.querySelector(".page-status");
const pageStatusText = document.querySelector("#page-status-text");
const pageStatusIcon = document.querySelector("#page-status-icon");
let activeTab = null;
let isRunning = false;

function supportedNotionUrl(value) {
  try { const url = new URL(value); const host = url.hostname.toLowerCase(); return ["https:", "http:"].includes(url.protocol) && (host === "notion.so" || host.endsWith(".notion.so") || host === "notion.site" || host.endsWith(".notion.site")); } catch { return false; }
}
function setMessage(message, kind = "") { status.textContent = message; status.className = `operation-status ${kind}`; }
function setControls(disabled) { controls.forEach((button) => { button.disabled = disabled; }); }
function setPageSupport(supported) { pageStatus.classList.toggle("supported", supported); pageStatus.classList.toggle("unsupported", !supported); pageStatusIcon.textContent = supported ? "✓" : "!"; pageStatusText.textContent = supported ? "Notion page detected" : "Open a Notion page to get started"; setControls(!supported); }
async function initialise() {
  try { [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true }); } catch { activeTab = null; }
  const supported = Boolean(activeTab?.id && supportedNotionUrl(activeTab.url)); setPageSupport(supported); setMessage(supported ? "Ready when you are." : "PageCopy works on public and private Notion pages you can view.", supported ? "" : "warning");
}
async function copy(format) {
  if (isRunning || !activeTab?.id || !supportedNotionUrl(activeTab.url)) { setMessage("Unsupported page. Open a Notion page to get started.", "error"); return; }
  isRunning = true; setControls(true);
  try {
    setMessage("Reading page content…");
    const injection = await chrome.scripting.executeScript({ target: { tabId: activeTab.id }, func: collectPage });
    const result = injection?.[0]?.result;
    if (!result?.ok) throw new Error(result?.message || "Extraction failed. Try reloading the page and opening PageCopy again.");
    setMessage("Preparing the output…");
    const output = format === "markdown" ? toMarkdown(result) : toPlainText(result);
    if (!output.trim()) throw new Error("No readable content found in the rendered page.");
    setMessage("Copying to clipboard…");
    await navigator.clipboard.writeText(output);
    const warning = result.warnings?.[0];
    setMessage(`Copied ${output.length.toLocaleString()} characters${warning ? `. ${warning}` : "."}`, warning ? "warning" : "success");
  } catch (error) {
    const message = String(error?.message || "");
    const access = /cannot access|cannot inject|permission|restricted/i.test(message);
    setMessage(access ? "Unable to access this page. Reload it, then try again." : message || "Clipboard copy failed. Check clipboard permission and try again.", "error");
  } finally { isRunning = false; setControls(!supportedNotionUrl(activeTab?.url)); }
}
document.querySelector("#copy-markdown").addEventListener("click", () => copy("markdown"));
document.querySelector("#copy-text").addEventListener("click", () => copy("text"));
initialise();
