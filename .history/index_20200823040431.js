const puppeteer = require("puppeteer");
const credentials = require("./credentials");
const _puppeteer = require("./helper");

const maybank = async () => {
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

    // Detect when
    await page.evaluate(() => {
      window.respondToVisibility = (element, callback) => {
        var options = {
          root: document.documentElement,
        };

        var observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            callback(entry.intersectionRatio > 0);
          });
        }, options);

        observer.observe(element);
      };
    });

    let usernameInput = await page.waitForSelector("#username");
    await usernameInput.type(credentials.maybank.username, { delay: 50 });

    await page.waitFor(500);

    await _puppeteer.click(
      page,
      "Login Button One",
      "#root > div > div > div.Header---container---kBsDt > div.col-md-12 > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(3) > button"
    );

    // Wait For Modal
    await page.waitForSelector(
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div",
      { visible: true }
    );

    await _puppeteer.click(
      page,
      "Modal Yes Button",
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-6.col-md-6.col-sm-6.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
    );

    let passwordInput = await page.waitForSelector("#badge", { visible: true });
    await passwordInput.type(credentials.maybank.password, { delay: 50 });

    await _puppeteer.click(
      page,
      "Login Button 2",
      "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
    );

    await page.waitForNavigation();
    await page.waitFor(500);

    await _puppeteer.click(
      page,
      "Transfer Page Link",
      "#mainNav > div:nth-child(1) > div.col-lg-8.col-sm-7.hidden-xs > div > ul > li:nth-child(3) > a"
    );

    await _puppeteer.click(
      page,
      "Close Modal Button",
      "body > div:nth-child(17) > div.fade.PromotionalModal---container---1oaNH.AnnouncementModal---announcementModal---3YygH.in.modal > div > div > div.promotional-header > button"
    );

    await _puppeteer.click(
      page,
      "Transfer Tab",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div:nth-child(2) > div > div"
    );

    await _puppeteer.click(
      page,
      "Other Accounts Select Item",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(2) > div.hidden-xs.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > div > ul > li:nth-child(2) > a"
    );

    await _puppeteer.click(
      page,
      "Maybank / Maybank Islamic",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(3) > div.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > ul > li:nth-child(1) > a"
    );

    // Bank Transfer Modal
    await page.waitForSelector(
      "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div",
      { visible: true }
    );

    let accountNumber = await page.waitForSelector(
      "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(1) > div > div.col-sm-7 > input"
    );
    await accountNumber.type("114161093646", { delay: 50 });

    let transferAmount = await page.waitForSelector(
      "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(2) > div > div.col-sm-7 > input"
    );
    await transferAmount.type("0.1", { delay: 50 });

    let reference = await page.waitForSelector(
      "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(4) > div > div > div.col-sm-7 > input"
    );
    await reference.type("ReferenceNumber", { delay: 50 });

    await _puppeteer.click(
      page,
      "Transfer Button",
      "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(7) > div.col-sm-4.col-xs-12 > button"
    );

    await _puppeteer.click(
      page,
      "SMS TAC",
      "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-4.col-xs-12 > div > div.hidden-xs > div > div > ul > li:nth-child(2) > a"
    );
  } catch (e) {
    console.log(e);
  }
};

maybank();
