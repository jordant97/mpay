const puppeteer = require("puppeteer");
const Bank = require("./bank");

class Bsn extends Bank {
  constructor(amount) {
    super({
      name: "BSN",
      amount: amount,
      link: "https://www.mybsn.com.my/mybsn/login/login.do",
    });
  }

  async init(id) {
    try {
      super.id = id;

      if (process.env.NODE_ENV == "production") {
        super.browser = await puppeteer.connect({
          // browserWSEndpoint: "ws://139.59.224.25:3000",
          browserWSEndpoint: "ws://localhost:5000",
        });

        let pages = await this.browser.pages();
        super.page = pages[0];
      } else {
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
      }

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
      let usernameInput = await this.page.waitForSelector("#username");
      await usernameInput.type(username);

      await this.page.waitFor(500);

      await this.click("Login Button One", "#confirmImage");
      await this.click("Security Image Yes Button", "#step2");
    }

    try {
      await this.checkExists(this.browser);
      return await Promise.race([
        successful.call(this),
        this.errorAppear("#loginForm > div.textRed > div"),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`BSN FillUsername: ${e.stack}`);
    }
  }

  async login(password) {
    // We wrap all the successful code in a new function so we can pass it in the Promise.race
    async function successful() {
      let passwordInput = await this.page.waitForSelector("#password", {
        visible: true,
      });
      await passwordInput.type(password);

      await this.click("Login Button 2", "#step3");
    }

    // We then race and see which code will run successfully, successful() or errorAppear()
    try {
      await Promise.race([
        successful.call(this),
        this.errorAppear("#loginForm > div.textRed > div"),
      ]);
    } catch (e) {
      console.log(e);
      throw new Error(`BSN Login: ${e.stack}`);
    }
  }

  async transfer() {
    async function successful() {
      /* Get popup */
      const newPagePromise = new Promise((resolve, reject) =>
        this.browser.once("targetcreated", (target) => resolve(target.page()))
      );

      await this.page.waitForSelector("html > frameset");

      this.page = await this.page.frames()[0].childFrames()[0];

      await this.click("Transfer Page Link", "#text2-header > a");

      await this.click(
        "Third Part Transfer",
        "#menu-ThirdPartyFundTransfer > a"
      );

      await this.page.waitForSelector("#fromAccountNo");

      let fromAccount = await this.page.evaluate(() => {
        return document.querySelector("#fromAccountNo").children[1].attributes
          .value.value;
      });

      await this.page.select("#fromAccountNo", fromAccount);
      await this.page.select("#trTypeSelect", "new");

      let accountNumber = await this.page.waitForSelector("#textNonRegistered");
      await accountNumber.type("0116541100016683", { delay: 50 });

      let transferAmount = await this.page.waitForSelector("#amount");
      await transferAmount.type(this.amount, { delay: 50 });

      let reference = await this.page.waitForSelector("#recipientReference");
      await reference.type(this.id.split("-")[0], { delay: 50 });

      await this.click("Submit Button", "#confirm");
      await this.click("Request TAC", "#requestTac");

      const popup = await newPagePromise;

      await popup.waitForSelector("#confirm");
      await popup.evaluate(() => {
        document.querySelector("#confirm").click();
      });

      await popup.waitFor(500);

      await popup.waitForSelector("#container > form > b > font");
      let { phoneNumber, date } = await popup.evaluate(() => {
        let phoneNumber = document
          .querySelector("#container > form > b > font")
          .innerText.split(" ")
          .pop();
        let date = document.querySelector(
          "#container > form > table > tbody > tr:nth-child(2) > td:nth-child(3)"
        ).innerText;

        return { phoneNumber, date };
      });

      console.log(phoneNumber, date);
      await popup.close();

      return {
        phoneNumber,
        date: `(${date})`,
      };
    }
    try {
      return await Promise.race([
        successful.call(this),
        this.errorAppear("#thirdPartyFtForm > div.textRed > div"),
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

module.exports = Bsn;
