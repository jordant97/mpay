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
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto("https://maybank2u.com");

    let usernameInput = await page.waitForSelector("#username");
    await usernameInput.type("YSCE1234", { delay: 50 });

    await page.waitFor(500);

    await click(
      page,
      "Login Button One",
      "#root > div > div > div.Header---container---kBsDt > div.col-md-12 > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(3) > button"
    );

    // Wait For Modal
    await page.waitForSelector(
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div",
      { visible: true }
    );

    await click(
      page,
      "Modal Yes Button",
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-6.col-md-6.col-sm-6.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
    );

    let passwordInput = await page.waitForSelector("#badge", { visible: true });
    await passwordInput.type("Live1313.", { delay: 50 });

    await click(
      page,
      "Login Button 2",
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
    );

    await page.waitForNavigation();
    await page.waitFor(500);

    await click(
      page,
      "Transfer Page Link",
      "#mainNav > div:nth-child(1) > div.col-lg-8.col-sm-7.hidden-xs > div > ul > li:nth-child(3) > a"
    );

    await click(
      page,
      "Close Modal Button",
      "body > div:nth-child(17) > div.fade.PromotionalModal---container---1oaNH.AnnouncementModal---announcementModal---3YygH.in.modal > div > div > div.promotional-header > button"
    );

    await click(
      page,
      "Transfer Tab",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div:nth-child(2) > div > div"
    );

    await click(
      page,
      "Other Accounts Select Item",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(2) > div.hidden-xs.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > div > ul > li:nth-child(2) > a"
    );

    await click(
      page,
      "Maybank / Maybank Islamic",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(3) > div.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > ul > li:nth-child(1) > a"
    );
  } catch (e) {
    console.log(e);
  }
})();

async function click(page, name, selector) {
  try {
    await page.waitForSelector(selector);
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, selector);
    await page.waitFor(500);
  } catch (e) {
    throw Error(`${name}: ${e}`);
  }
}