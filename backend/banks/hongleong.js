const puppeteer = require("puppeteer");
const Bank = require("./bank");
const { bankAccNumber } = require("../credentials");
const credentials = require("../credentials");

class HongLeong extends Bank {
  constructor(amount) {
    super({
      amount: amount,
      link: "https://s.hongleongconnect.my/rib/app/fo/login?locale=en",
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

      await this.page.setRequestInterception(true);

      this.page.on("request", (req) => {
        if (req.resourceType() == "font") {
          req.abort();
        } else {
          req.continue();
        }
      });

      try {
        await this.goTo();
      } catch (e) {
        console.log(`Session: ${id} closed`);
      }
    } catch (e) {
      throw e;
    }
  }

  async fillUsername(username) {
    async function successful() {
      let usernameInput = await this.page.waitForSelector("#idLoginId");

      await usernameInput.focus();
      await usernameInput.type(` ${username}`);

      await this.page.waitFor(500);

      await this.click("Login Button One", "#idBtnSubmit1");

      await this.click("Secure Image Checkbox", "#idSBCBConfirmPic");
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
      throw new Error(`HongLeong FillUsername: ${e.stack}`);
    }
  }

  async login(password) {
    // We wrap all the successful code in a new function so we can pass it in the Promise.race
    async function successful() {
      let passwordInput = await this.page.waitForSelector("#idPswd", {
        visible: true,
      });
      await passwordInput.focus();
      await passwordInput.type(password);

      await this.click("Login Button 2", "#idBtnSubmit2");
      await this.page.waitFor(500);
    }

    // We then race and see which code will run successfully, successful() or errorAppear()
    try {
      await Promise.race([
        successful.call(this),
        this.errorAppear("#idSampleForm:idEntryMessages > div > span"),
      ]);
    } catch (e) {
      throw new Error(`Maybank Login: ${e.stack}`);
    }
  }

  async transfer() {
    async function successful() {
      await this.page.waitForSelector("#idMainFrame");
      this.page = await this.page.frames()[1];

      await this.click("Pay & Transact", "#mega-menu > li:nth-child(2) > a");

      await this.click(
        "Current/Saving Transfer",
        "#mega-menu > li.nomach.dc-mega-li.mega-hover > div > ul > div:nth-child(1) > li:nth-child(1) > ul > li:nth-child(2) > a"
      );

      await this.click(
        "Transfer Option Select",
        "#navi01 > div.ui-selectonemenu-trigger.ui-state-default.ui-corner-right"
      );

      await this.click(
        "Transfer Option Select To 3rd Party",
        "#navi01_panel > div > ul > li:nth-child(3)"
      );

      await this.click(
        "Recipient Bank",
        "#idBnk > div.ui-selectonemenu-trigger.ui-state-default.ui-corner-right"
      );

      await this.click(
        "Maybank Option",
        "#idBnk_panel > div > ul > li:nth-child(23)"
      );

      await this.click(
        "Account Type",
        "#idAcctTyp > div.ui-selectonemenu-trigger.ui-state-default.ui-corner-right"
      );

      await this.click(
        "Current/Savings",
        "#idAcctTyp_panel > div > ul > li.ui-selectonemenu-item.ui-selectonemenu-list-item.ui-corner-all.ui-state-highlight"
      );

      let accNumber = await this.page.waitForSelector("#idAcctNo");

      await accNumber.focus();
      await accNumber.type("123123", { delay: 50 });

      // return {
      //   phoneNumber: phoneNumber,
      //   date: date.replace("..", ""),
      // };

      return {
        phoneNumber: "",
        date: "",
      };
    }
    try {
      return await Promise.race([
        successful.call(this),
        this.errorAppear(
          "#root > div > div > div.notifications-wrap4per > div > div"
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

module.exports = HongLeong;
