let moment = require("moment");

class Bank {
  constructor({ name, link, amount }) {
    this.name;
    this.id;
    this.browser;
    this.page;
    this.starts = [Date.now()];
    this.link = link;
    this.amount = amount;
  }

  async goTo() {
    try {
      await this.page.goto(this.link);
    } catch (e) {
      throw e;
    }
  }

  async click(name, selector) {
    try {
      await this.page.waitFor(200);
      await this.page.waitForSelector(selector);
      await this.page.waitFor(200);
      await this.page.evaluate((selector) => {
        document.querySelector(selector).click();
      }, selector);
      await this.page.waitFor(500);
    } catch (e) {
      throw Error(`${name}: ${e}`);
    }
  }

  async retry(promiseFactory, retryCount) {
    try {
      return await promiseFactory();
    } catch (error) {
      if (retryCount <= 0) {
        throw error;
      }
      return await retry(promiseFactory, retryCount - 1);
    }
  }

  async errorAppear(selector) {
    return new Promise((resolve, reject) => {
      this.page
        .waitFor(selector, {
          timeout: 0,
          visible: true,
        })
        .then(async (element) => {
          reject(new Error("Error Appear"));
        })
        .catch((e) => {
          resolve("No error");
        });
    });
  }

  async checkExists(obj) {
    return new Promise((resolve) => {
      setInterval(() => {
        if (obj) {
          resolve(true);
        }
      }, 1000);
    });
  }

  getDateStringNow() {
    return moment().format("DD MMM YYYY, hh:mm:ss");
  }

  async addStart() {
    this.starts.push(Date.now());
  }

  async waitForFrame(nameOrId) {
    return new Promise(async (resolve) => {
      const pollingInterval = 1000;
      const poll = setInterval(async () => {
        const iFrame = this.page
          .frames()
          .find((frame) => frame.name() === nameOrId);
        if (iFrame) {
          clearInterval(poll);
          resolve(iFrame);
        }
      }, pollingInterval);
    });
  }

  async close() {
    try {
      await this.waitForBrowser();
      if (process.env.NODE_ENV == "production") {
        await this.browser.disconnect();
      } else {
        await this.browser.close();
      }
    } catch (e) {
      throw e;
    }
  }

  waitForBrowser() {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        if (this.browser) {
          resolve(clearInterval(timer));
        }
      }, 100);
    });
  }

  get start() {
    return this.starts[this.starts.length - 1];
  }
}

module.exports = Bank;
