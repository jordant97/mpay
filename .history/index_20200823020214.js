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

    let loginButton1 = await page.waitForSelector(
      "#root > div > div > div.Header---container---kBsDt > div.col-md-12 > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(3) > button"
    );
    await loginButton1.click();

    await page.waitFor(500);

    await page.waitForSelector(
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div",
      { visible: true }
    );

    let modalYesButton = await page.waitForSelector(
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-6.col-md-6.col-sm-6.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
    );
    await modalYesButton.click();

    await page.waitFor(500);

    let passwordInput = await page.waitForSelector("#badge", { visible: true });
    await passwordInput.type("Live1313.", { delay: 50 });

    let loginButton2 = await page.$(
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
    );

    await loginButton2.click();

    await page.waitForNavigation();
    await page.waitFor(500);

    let transferPageLink = await page.waitForSelector(
      "#mainNav > div:nth-child(1) > div.col-lg-8.col-sm-7.hidden-xs > div > ul > li:nth-child(3) > a"
    );

    await transferPageLink.click();
    await page.waitFor(500);

    try {
      await page.evaluate(() => {
        document
          .querySelector(
            "body > div:nth-child(17) > div.fade.PromotionalModal---container---1oaNH.AnnouncementModal---announcementModal---3YygH.in.modal > div > div > div.promotional-header > button"
          )
          .click();
      });
    } catch (e) {
      throw new Error(QuerySelectorError);
    }

    await page.waitFor(500);

    await click(
      page,
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div.PayNavigation---selected---Jva9O.PayNavigation---nav-tabs---pHNAS > div > div"
    );
  } catch (e) {
    console.log(e);
  }
})();

async function click(page, selector) {
  try {
    await page.waitForSelector(selector);
    await page.evaluate(() => {
      document.querySelector(selector).click();
    });
  } catch (e) {
    throw Error("Document Click Error");
  }
}
