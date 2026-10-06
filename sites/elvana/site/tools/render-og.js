// Render the share image: node tools/render-og.js <in.html> <out.png>
// Called by build.py when src/og/og-default.html or the site CSS is newer than the PNG.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [inp, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, javaScriptEnabled: false });
  await page.route('**/*', r => r.request().url().startsWith('file:') || r.request().url().startsWith('data:') ? r.continue() : r.abort());
  await page.goto('file://' + path.resolve(inp));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log('og image ->', out);
})().catch(e => { console.error(e); process.exit(1); });
