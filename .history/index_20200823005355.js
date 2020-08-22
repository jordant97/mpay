const puppeteer = require("puppeteer");

(async function () {
  let browser = await puppeteer.launch({
    headless: false,
  });

  let page = await browser.newPage();
  await page.goto("https://maybank2u.com");
})();
