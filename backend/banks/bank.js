class Bank {
  constructor({ link, amount }) {
    this.id;
    this.browser;
    this.page;
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
        })
        .then(async (element) => {
          reject(new Error("Error Appear"));
        })
        .catch((e) => {
          console.log(e);
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

  async close() {
    try {
      await this.browser.close();
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Bank;
