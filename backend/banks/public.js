const puppeteer = require("puppeteer");
const Bank = require("./bank");
const { bankAccNumber } = require("../credentials");

class Public extends Bank {
  constructor(amount) {
    super({
      amount: amount,
      link:
        "https://www2.pbebank.com/myIBK/apppbb/servlet/BxxxServlet?RDOName=BxxxAuth&MethodName=login",
    });
  }

  async click(context, name, selector) {
    console.log("Clicking");
    try {
      await context.waitFor(200);
      await context.waitForSelector(selector);
      await context.waitFor(200);
      await context.evaluate((selector) => {
        document.querySelector(selector).click();
      }, selector);
      await context.waitFor(500);
    } catch (e) {
      throw Error(`${name}: ${e}`);
    }
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
      this.frame = await this.page.frames().filter((frame) => {
        return frame._url.includes("user_cnpy");
      })[0];

      let usernameInput = await this.frame.waitForSelector(
        "#LoginId > table > tbody > tr:nth-child(3) > td > div > input.form-control.placeholder-no-fix"
      );
      await usernameInput.type(username);

      await this.frame.waitFor(500);

      await this.click(this.frame, "Next Button", "#NextBtn");
      await this.click(this.frame, "Yes Checkbox", "#passcred");
    }

    try {
      await this.checkExists(this.browser);
      return await Promise.race([
        successful.call(this),
        // this.errorAppear("#loginForm > div.textRed > div"),
      ]);
    } catch (e) {
      throw new Error(`BSN FillUsername: ${e.stack}`);
    }
  }

  async login(password) {
    // We wrap all the successful code in a new function so we can pass it in the Promise.race
    async function successful() {
      let passwordInput = await this.frame.waitForSelector("#password", {
        visible: true,
      });
      await passwordInput.type(password);

      await this.click(this.frame, "Submit Button", "#SubmitBtn");

      await this.frame.waitForNavigation();
    }

    // We then race and see which code will run successfully, successful() or errorAppear()
    try {
      await Promise.race([
        successful.call(this),
        // this.errorAppear("#loginForm > div.textRed > div"),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`BSN Login: ${e.stack}`);
    }
  }

  async transfer() {
    this.frame = await this.page.frames().filter((frame) => {
      console.log(frame);
    });

    async function successful() {
      await this.click(
        this.frame,
        "Transfer Page Link",
        "#mainNav > div:nth-child(1) > div.col-lg-8.col-sm-7.hidden-xs > div > ul > li:nth-child(3) > a"
      );
      await this.click(
        "Close Modal Button",
        "body > div:nth-child(17) > div.fade.PromotionalModal---container---1oaNH.AnnouncementModal---announcementModal---3YygH.in.modal > div > div > div.promotional-header > button"
      );
      await this.click(
        "Transfer Tab",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div:nth-child(2) > div > div"
      );
      await this.click(
        "Other Accounts Select Item",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(2) > div.hidden-xs.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > div > ul > li:nth-child(2) > a"
      );
      await this.click(
        "Maybank / Maybank Islamic",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(3) > div.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > ul > li:nth-child(1) > a"
      );
      // Bank Transfer Modal
      await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div",
        { visible: true }
      );
      let accountNumber = await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(1) > div > div.col-sm-7 > input"
      );
      await accountNumber.type("114161093646", { delay: 50 });
      let transferAmount = await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(2) > div > div.col-sm-7 > input"
      );
      await transferAmount.type(this.amount, { delay: 50 });
      let reference = await this.page.waitForSelector(
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(4) > div > div > div.col-sm-7 > input"
      );
      await reference.type(this.id.split("-")[0], { delay: 50 });
      await this.click(
        "Transfer Button",
        "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(7) > div.col-sm-4.col-xs-12 > button"
      );
      await this.click(
        "SMS TAC",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-4.col-xs-12 > div > div.hidden-xs > div > div > ul > li:nth-child(2) > a"
      );
      await this.click(
        "Request TAC",
        "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-3.col-xs-12 > button"
      );
      return {
        phoneNumber: "",
        date: "",
      };
    }
    try {
      return await Promise.race([
        successful.call(this),
        this.errorAppear("#iframe > div > button"),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`Maybank Transfer: ${e.stack}`);
    }
  }

  async resendTac() {
    async function successful() {
      const newPagePromise = new Promise((resolve, reject) =>
        this.browser.once("targetcreated", (target) => resolve(target.page()))
      );
      await this.page.waitForSelector("#requestTac");
      await this.click("Request TAC", "#requestTac");

      const popup = await newPagePromise;

      await popup.waitForSelector("#confirm");
      await popup.evaluate(() => {
        document.querySelector("#confirm").click();
      });
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
      let smsTacInput = await this.page.waitForSelector("#tac");

      await smsTacInput.type(tac);

      await this.click("Submit Button", "#insert");

      await this.page.waitForSelector("#thirdPartyFtForm > div.textRed > div");

      let resultText = await this.page.evaluate(() => {
        return document.querySelector("#thirdPartyFtForm > div.textRed > div")
          .innerText;
      });

      if (resultText.includes("invalid")) {
        return "TRANSACTION UNSUCCESSFUL";
      } else {
        return "SUCCESSFUL";
      }
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

module.exports = Public;
