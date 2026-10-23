import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,".."); const manifest=JSON.parse(fs.readFileSync(path.join(root,"manifest.json"),"utf8"));
function pngDimensions(file){const data=fs.readFileSync(file);assert.deepEqual([...data.subarray(0,8)],[137,80,78,71,13,10,26,10]);return [data.readUInt32BE(16),data.readUInt32BE(20)];}
test("manifest is MV3, minimally permissioned and references existing files",()=>{assert.equal(manifest.manifest_version,3);assert.equal(manifest.name,"PageCopy");assert.match(manifest.version,/^0\.1\.0/);assert.deepEqual(manifest.permissions,["activeTab","scripting","clipboardWrite"]);assert.equal(manifest.host_permissions,undefined);assert.ok(fs.existsSync(path.join(root,manifest.action.default_popup)));for(const icon of Object.values(manifest.icons))assert.ok(fs.existsSync(path.join(root,icon)));});
test("icon assets have their declared dimensions and project documentation exists",()=>{for(const size of [16,32,48,128])assert.deepEqual(pngDimensions(path.join(root,`icons/icon-${size}.png`)),[size,size]);for(const file of["assets/icon.svg","README.md","docs/architecture.md","docs/manual-testing.md","popup.js","src/collect-page.js","src/formatters.js"])assert.ok(fs.existsSync(path.join(root,file)));});
