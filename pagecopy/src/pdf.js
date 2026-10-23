import * as pdfjs from "../vendor/pdfjs/pdf.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("vendor/pdfjs/pdf.worker.min.mjs");
export async function extractPdf(data) {
  const loading = pdfjs.getDocument({ data: new Uint8Array(data) });
  const document = await loading.promise; const pages = []; const warnings = [];
  for (let number = 1; number <= document.numPages; number += 1) {
    try { const page = await document.getPage(number); const content = await page.getTextContent(); const text = content.items.map((item) => item.str || "").join(" ").replace(/\s{2,}/g, " ").trim(); pages.push({ type:"page", number, text }); if (!text) warnings.push(`Page ${number} has no selectable text and may be scanned.`); } catch { warnings.push(`Page ${number} could not be read.`); }
  }
  await document.destroy(); if (!pages.some((page) => page.text)) throw new Error("No selectable text found. This PDF may be scanned or image-based and needs OCR.");
  return { ok:true, title:"Imported PDF", blocks:pages, warnings, message:"" };
}
export function parseTextFile(file, text) {
  const name = file.name || "Imported file"; const lower = name.toLowerCase();
  if (lower.endsWith(".json")) { try { return {ok:true,title:name,blocks:[{type:"code",language:"json",text:JSON.stringify(JSON.parse(text),null,2)}],warnings:[],message:""}; } catch { throw new Error("The JSON file is malformed."); } }
  if (lower.endsWith(".csv")) return {ok:true,title:name,blocks:[{type:"table",rows:text.split(/\r?\n/).filter(Boolean).map((row)=>row.split(","))}],warnings:["CSV quoting is preserved as text; complex CSV may need review."],message:""};
  if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".xml")) return {ok:true,title:name,blocks:[{type:"paragraph",text}],warnings:[],message:""};
  throw new Error("Unsupported file type. Choose PDF, TXT, MD, CSV, JSON, or XML.");
}
