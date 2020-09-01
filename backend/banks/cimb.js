const puppeteer = require("puppeteer");
const Bank = require("./bank");
const { bankAccNumber } = require("../credentials");

class Cimb extends Bank {
  constructor(amount) {
    super({
      amount: amount,
      link: "https://www.cimbclicks.com.my/clicks/#/",
    });
  }

  async init(id) {
    try {
      super.id = id;
      super.browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: [
          "--no-sandbox",
          "--disabled-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
          "--window-size=1920x1080",
        ],
      });

      super.page = await this.browser.newPage({ context: id });

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

      // await this.page.setRequestInterception(true);

      // this.page.on("request", (req) => {
      //   if (
      //     req.resourceType() == "stylesheet" ||
      //     req.resourceType() == "font" ||
      //     req.resourceType() == "image"
      //   ) {
      //     req.abort();
      //   } else {
      //     req.continue();
      //   }
      // });

      try {
        await this.goTo();
        await this.page.select("#quickstart-real", "CA");
      } catch (e) {
        console.log(`Session: ${id} closed`);
      }
    } catch (e) {
      throw e;
    }
  }

  async fillUsername(username) {
    async function successful() {
      let usernameInput = await this.page.waitForSelector("#user-id");
      await this.page.waitFor(500);
      await this.page.focus("#user-id");
      await usernameInput.type(username, { delay: 50 });

      await this.page.waitFor(500);

      await this.click(
        "Login Button",
        "#form-login-step1 > div.input-field.input-field-btn > button"
      );

      await this.click("Keyword Checkbox", "#loginCheckBox");
    }

    try {
      await this.checkExists(this.browser);
      return await Promise.race([
        successful.call(this),
        // this.errorAppear(
        //   "#root > div > div > div.notifications-wrapper > div > div"
        // ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank FillUsername: ${e.stack}`);
    }
  }

  async login(password) {
    // We wrap all the successful code in a new function so we can pass it in the Promise.race
    async function successful() {
      let passwordInput = await this.page.waitForSelector("#password", {
        visible: true,
      });
      await this.page.focus("#password");
      await passwordInput.type(password, { delay: 50 });

      await this.click(
        "Login Button 2",
        "#form-login_step2 > div:nth-child(4) > div > button"
      );
    }

    // We then race and see which code will run successfully, successful() or errorAppear()
    try {
      await Promise.race([
        successful.call(this),
        // this.errorAppear(
        //   "#root > div > div > div.notifications-wrapper > div > div"
        // ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank Login: ${e.stack}`);
    }
  }

  async clickToAccInput(retry) {
    try {
      await this.page.click(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > select2optdropdown > div > div > input"
      );

      await this.page.waitForSelector(".select2-dropdown", {
        visible: true,
        timeout: (4 - retry) * 1000,
      });
    } catch (e) {
      if (retry > 0) {
        this.clickToAccInput(retry - 1);
      } else {
        throw e;
      }
    }
  }

  async transfer() {
    async function successful() {
      await this.page.waitForSelector(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > select2optdropdown > div > div > input"
      );

      await this.clickToAccInput(3);

      await this.page.waitFor(500);

      await this.page.focus(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > select2optdropdown > div > div > input"
      );

      await this.page.waitFor(500);

      let toAccInput = await this.page.waitForSelector(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > select2optdropdown > div > div > input"
      );

      await this.page.waitFor(1000);
      await toAccInput.type(bankAccNumber, { delay: 50 });

      await this.page.waitForSelector(".select2-dropdown", {
        visible: true,
      });
      await this.click("Proceed Button", ".send-money-account");

      await this.page.waitForSelector(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div.new-account-info > new-acc-fund-transfer > div > div.row.hidden-xs > div > ul > li:nth-child(3) > a"
      );

      await this.page.click(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div.new-account-info > new-acc-fund-transfer > div > div.row.hidden-xs > div > ul > li:nth-child(3) > a"
      );

      // Bank Name
      await this.page.click(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div.new-account-info > new-acc-fund-transfer > div > div.tab-fundtransfer > div > div:nth-child(1) > div > div > span > span.selection.needsclick > span"
      );

      await this.page.waitForSelector(".select2-dropdown", {
        visible: true,
      });

      let bankNameInput = await this.page.waitForSelector(
        "body > span > span > span.select2-search.select2-search--dropdown > input"
      );

      await bankNameInput.type("MAYBANK");

      await this.page.keyboard.press("Enter");

      await this.click(
        "Instant Transfer",
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div.new-account-info > new-acc-fund-transfer > div > div.tab-fundtransfer > div > div:nth-child(3) > div > div > div > label:nth-child(2)"
      );

      await this.page.click(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div.new-account-info > new-acc-fund-transfer > div > div.tab-fundtransfer > div > div:nth-child(7) > div > div > span > span.selection.needsclick > span"
      );

      await this.page.waitForSelector(".select2-dropdown", {
        visible: true,
      });

      await this.page.waitForSelector("#select2-payment-type-results");

      await this.page.click("#select2-payment-type-results > li:first-child");

      await this.page.waitFor(200);

      let amount = await this.page.waitForSelector("input.currency");

      await amount.type(this.amount);

      let reference = await this.page.waitForSelector(
        "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(3) > ext-fields-fund-transfer > div > div > div > div.col-xs-12.form-section.tran-in.js-header-transaction-instruction > div.js-single-bill-collapse-instruction > div > div:nth-child(1) > div > div > div > input-cmp > div > div > input"
      );

      await reference.type(this.id.split("-")[0]);

      await this.page.click('button[type="submit"]');

      await this.page.waitForSelector("#secureTaccontainer > div");

      let isSecureNotification = await this.page.evaluate(() => {
        return document
          .querySelector(
            "#secureTaccontainer > div > div.media-content.tac-content > span:nth-child(1) > div > p"
          )
          .innerText.toUpperCase()
          .includes("SECURETAC");
      });

      console.log(isSecureNotification);

      return {
        phoneNumber: "",
        date: `(${this.getDateStringNow()})`,
      };
    }
    try {
      return await Promise.race([
        successful.call(this),
        this.errorAppear("body > cimb-app > common-error-modal > div"),
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
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---text_confirm---1Uo-m > p > a > span"
      );
    }

    try {
      await Promise.race([
        successful.call(this),
        this.errorAppear(
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

      await smsTacInput.type(tac);

      await this.page.waitForSelector(
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > button"
      );

      await this.page.click(
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > button"
      );

      await this.page.waitForSelector(
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div:nth-child(1) > div > div > h6:nth-child(1)"
      );

      let resultText = await this.page.evaluate(() => {
        return document.querySelector(
          "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div:nth-child(1) > div > div > h6:nth-child(1)"
        ).innerText;
      });

      return resultText;
    }

    try {
      return await Promise.race([
        successful.call(this),
        this.errorAppear(
          "#root > div > div > div.notifications-wrapper > div > div"
        ),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank FillTAC: ${e.stack}`);
    }
  }
}

module.exports = Cimb;
