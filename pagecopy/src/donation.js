export const donationUrl = "";
export function validDonationUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" && (url.hostname === "buymeacoffee.com" || url.hostname.endsWith(".buymeacoffee.com")) ? url.href : ""; } catch { return ""; }
}
