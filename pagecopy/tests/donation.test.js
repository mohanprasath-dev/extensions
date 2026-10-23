import test from "node:test";
import assert from "node:assert/strict";
import { validDonationUrl } from "../src/donation.js";
test("accepts only HTTPS Buy Me a Coffee pages",()=>{assert.equal(validDonationUrl(""),"");assert.equal(validDonationUrl("http://buymeacoffee.com/name"),"");assert.equal(validDonationUrl("https://evil.example/"),"");assert.equal(validDonationUrl("https://buymeacoffee.com/page"),"https://buymeacoffee.com/page");});
