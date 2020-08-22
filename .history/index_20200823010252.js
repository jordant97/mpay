const puppeteer = require("puppeteer");

(async function () {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image" ||
        req.resourceType() == "script"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto("https://maybank2u.com");
    await page.waitForSelector("#username");
  } catch (e) {
    console.log(e);
  }
})();