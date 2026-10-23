// This function is serialized by chrome.scripting and executed in the page context: keep every helper inside it.
export function collectPage() {
  const visible = (node) => { if (!(node instanceof Element) || node.hidden || node.closest('[aria-hidden="true"],[inert]')) return false; const style = getComputedStyle(node); return style.display !== "none" && style.visibility !== "hidden"; };
  const textOf = (node) => (node?.innerText || node?.textContent || "").replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  const safeLink = (href) => { try { const url = new URL(href, location.href); return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };
  const root = document.querySelector('main[role="main"], main, [data-content-editable-leaf]')?.closest('main,[role="main"],[data-page-content]') || document.querySelector('[data-page-content], [class*="notion-page-content"], [class*="notion-scroller"]');
  if (!root || !visible(root)) return { ok:false, title:"", blocks:[], warnings:[], message:"No identifiable Notion page content was found." };
  const ignored = 'nav,aside,header,footer,menu,[role="navigation"],[role="toolbar"],[role="dialog"],[aria-hidden="true"],[inert],script,style';
  const candidates = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6,pre,blockquote,table,hr,li,p,[data-block-id],[data-content-editable-leaf]')].filter((node) => visible(node) && !node.closest(ignored));
  const blocks=[]; const seen=new Set();
  for (const node of candidates) { if (node.closest('li') && node.tagName !== 'LI') continue; if (node.matches('[data-content-editable-leaf]') && node.parentElement?.closest('[data-block-id]') !== node.parentElement) continue; const text=textOf(node); if (!text || seen.has(node)) continue; if ([...seen].some((parent) => parent.contains?.(node))) continue;
    let block; const tag=node.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) block={type:'heading',level:Number(tag[1]),text};
    else if (tag==='pre') block={type:'code',text:node.querySelector('code')?.textContent ?? node.textContent ?? '',language:node.dataset.language||''};
    else if (tag==='blockquote') block={type:'quote',text};
    else if (tag==='hr') block={type:'divider'};
    else if (tag==='table') block={type:'table',rows:[...node.rows].map((row)=>[...row.cells].map(textOf))};
    else if (tag==='li') { const list=node.closest('ol,ul'); const listItems=[...list.children].filter((item)=>item.tagName==='LI'&&visible(item)).map((item,index)=>{ const own=[...item.childNodes].filter((child)=>child.nodeType===Node.TEXT_NODE||!(child instanceof Element)||!child.matches('ol,ul')).map((child)=>child.textContent||'').join('').trim() || textOf(item); const anchor=item.querySelector('a[href]'); return {text:own,href:anchor?safeLink(anchor.href):'',depth:Math.max(0,[...item.parents].filter((parent)=>parent instanceof HTMLElement&&parent.matches('ol,ul')).length-1),number:index+1}; }); block={type:list.tagName==='OL'?'numberedList':'bulletList',items:listItems}; [...list.querySelectorAll('li')].forEach((item)=>seen.add(item)); }
    else { const anchor=node.querySelector('a[href]'); block={type:'paragraph',text, ...(anchor?{href:safeLink(anchor.href)}:{})}; }
    if (block.type==='paragraph' && block.href) block.text=`${block.text}`; blocks.push(block); seen.add(node);
  }
  const title=textOf(root.querySelector('h1')) || document.title.replace(/\s*[-|]\s*Notion\s*$/i,'').trim();
  const warnings=[]; if (document.querySelector('[aria-expanded="false"]')) warnings.push('Collapsed toggle content may not be available.'); if (root.scrollHeight > root.clientHeight * 3) warnings.push('Long or virtualized content outside the rendered page may be incomplete.');
  if (!blocks.length) return {ok:false,title,blocks:[],warnings,message:'No readable content found in the rendered page.'};
  return {ok:true,title,blocks,warnings,message:''};
}
