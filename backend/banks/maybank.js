const puppeteer = require("puppeteer");
const _puppeteer = require("../helper");
const e = require("express");

class Maybank {
  constructor(amount) {
    this.amount = amount;
    this.link = "https://maybank2u.com.my";
  }

  async click(name, selector) {
    return await Promise.race([_puppeteer.click(this.page, name, selector)]);
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
      });

      this.page = await this.browser.newPage();

      const headlessUserAgent = await this.page.evaluate(
        () => navigator.userAgent
      );
      const chromeUserAgent = headlessUserAgent.replace(
        "HeadlessChrome",
        "Chrome"
      );
      await this.page.setUserAgent(chromeUserAgent);
      await this.page.setExtraHTTPHeaders({
        "accept-language": "en-US,en;q=0.8",
      });

      await this.page.setRequestInterception(true);

      this.page.on("request", (req) => {
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

      this.start = Date.now();

      await this.goTo();
    } catch (e) {
      throw `Maybank Init: ${e.stack}`;
    }
  }

  async goTo() {
    try {
      await this.page.goto(this.link);
    } catch (e) {
      throw `Maybank GoTo: ${e.stack}`;
    }
  }

  async login(username, password) {
    // We wrap all the successful code in a new function so we can pass it in the Promise.race
    async function successful() {
      let usernameInput = await this.page.waitForSelector("#username");
      await usernameInput.type(username, { delay: 50 });

      await this.page.waitFor(500);

      await _puppeteer.click(
        this.page,
        "Login Button One",
        "#root > div > div > div.Header---container---kBsDt > div.col-md-12 > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(3) > button"
      );

      // Wait For Modal
      await this.page.waitForSelector(
        "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div",
        { visible: true }
      );

      await _puppeteer.click(
        this.page,
        "Modal Yes Button",
        "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-6.col-md-6.col-sm-6.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
      );

      let passwordInput = await this.page.waitForSelector("#badge", {
        visible: true,
      });
      await passwordInput.type(password, { delay: 50 });

      await _puppeteer.click(
        this.page,
        "Login Button 2",
        "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
      );
      await this.page.waitFor(500);
    }

    // We then race and see which code will run successfully, successful() or errorAppear()
    try {
      await Promise.race([
        successful.call(this),
        _puppeteer.errorAppear(
          this.page,
          "#root > div > div > div.notifications-wrapper > div > div"
        ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank Login: ${e.stack}`);
    }
  }

  async transfer() {
    async function successful() {
      await this.click(
        "Transfer Page Link",
        "#mainNav > div:nth-child(1) > div.col-lg-8.col-sm-7.hidden-xs > div > ul > li:nth-child(3) > a"
      ).catch((e) => console.log(e));

      await this.click(
        "Close Modal Button",
        "body > div:nth-child(17) > div.fade.PromotionalModal---container---1oaNH.AnnouncementModal---announcementModal---3YygH.in.modal > div > div > div.promotional-header > button"
      ).catch((e) => console.log(e));

      await this.click(
        "Transfer Tab",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div:nth-child(2) > div > div"
      ).catch((e) => console.log(e));

      await this.click(
        "Other Accounts Select Item",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(2) > div.hidden-xs.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > div > ul > li:nth-child(2) > a"
      ).catch((e) => console.log(e));

      await this.click(
        "Maybank / Maybank Islamic",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(3) > div.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > ul > li:nth-child(1) > a"
      ).catch((e) => console.log(e));

      // Bank Transfer Modal
      await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div",
        { visible: true }
      );

      let accountNumber = await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(1) > div > div.col-sm-7 > input"
      );
      await accountNumber.type("11416109364", { delay: 50 });

      let transferAmount = await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(2) > div > div.col-sm-7 > input"
      );
      await transferAmount.type(this.amount, { delay: 50 });

      let reference = await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(4) > div > div > div.col-sm-7 > input"
      );
      await reference.type("ReferenceNumber", { delay: 50 });

      await this.click(
        "Transfer Button",
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(7) > div.col-sm-4.col-xs-12 > button"
      );

      await this.click(
        "SMS TAC",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-4.col-xs-12 > div > div.hidden-xs > div > div > ul > li:nth-child(2) > a"
      ).catch((e) => console.log(e));

      await this.click(
        "Request TAC",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-3.col-xs-12 > button"
      ).catch((e) => console.log(e));
    }
    try {
      await Promise.race([
        successful.call(this),
        _puppeteer.errorAppear(
          this.page,
          "#root > div > div > div.notifications-wrapper > div > div"
        ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank Transfer: ${e.stack}`);
    }
  }

  async resendTac() {
    async function successful() {
      // smsTacInput
      await this.page.waitForSelector(
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input"
      );

      await this.click(
        this.page,
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---text_confirm---1Uo-m > p > a > span"
      ).catch((e) => console.log(e));
    }

    try {
      await Promise.race([
        successful.call(this),
        _puppeteer.errorAppear(
          this.page,
          "#root > div > div > div.notifications-wrapper > div > div"
        ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank ResendTAC: ${e.stack}`);
    }
  }

  async fillTac(tac) {
    async function successful() {
      let smsTacInput = await this.page.waitForSelector(
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input"
      );

      await smsTacInput.type(tac, { delay: 50 });

      await _puppeteer.click(
        this.page,
        "Confirm TAC Button",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > button"
      );
    }
    try {
      await Promise.race([
        successful.call(this),
        _puppeteer.errorAppear(
          this.page,
          "#root > div > div > div.notifications-wrapper > div > div"
        ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank FillTAC: ${e.stack}`);
    }
  }
}

module.exports = Maybank;
