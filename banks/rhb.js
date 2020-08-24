const puppeteer = require("puppeteer");
const _puppeteer = require("../helper");

class Rhb {

    constructor(amount) {
        this.amount = amount;
    }

    async init() {

        try {
            this.browser = await puppeteer.launch({
                headless: false,
            });

            this.page = await this.browser.newPage();

            const headlessUserAgent = await this.page.evaluate(() => navigator.userAgent);
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

            await this.page.goto("https://maybank2u.com.my");
            this.start = Date.now();

            // try {
            //   let timer = setInterval(() => {
            //     let end = Date.now();
            //     if (end - this.start >= 10000) {
            //       console.log("Timeout Error");
            //       // throw new Error("Timeout Error");
            //       clearInterval(timer);
            //     };
            //   }, 1000);
            // } catch (e) {
            //   console.log(e);
            //   throw e;
            // }
        } catch (e) {
            throw e;
        }
    }

    async login(username, password) {
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

        let passwordInput = await this.page.waitForSelector("#badge", { visible: true });
        await passwordInput.type(password, { delay: 50 });

        await _puppeteer.click(
            this.page,
            "Login Button 2",
            "#root > div > div > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button"
        );

        await this.page.waitForNavigation();
        await this.page.waitFor(500);
    }

    async transfer() {

        await _puppeteer.click(
            this.page,
            "Transfer Page Link",
            "#mainNav > div:nth-child(1) > div.col-lg-8.col-sm-7.hidden-xs > div > ul > li:nth-child(3) > a"
        );

        await _puppeteer.click(
            this.page,
            "Close Modal Button",
            "body > div:nth-child(17) > div.fade.PromotionalModal---container---1oaNH.AnnouncementModal---announcementModal---3YygH.in.modal > div > div > div.promotional-header > button"
        );

        await _puppeteer.click(
            this.page,
            "Transfer Tab",
            "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div:nth-child(2) > div > div"
        );

        await _puppeteer.click(
            this.page,
            "Other Accounts Select Item",
            "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(2) > div.hidden-xs.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > div > ul > li:nth-child(2) > a"
        );

        await _puppeteer.click(
            this.page,
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
        await reference.type("ReferenceNumber", { delay: 50 });

        await _puppeteer.click(
            this.page,
            "Transfer Button",
            "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(7) > div.col-sm-4.col-xs-12 > button"
        );

        await _puppeteer.click(
            this.page,
            "SMS TAC",
            "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-4.col-xs-12 > div > div.hidden-xs > div > div > ul > li:nth-child(2) > a"
        );

        await _puppeteer.click(this.page,
            'Request TAC',
            '#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-3.col-xs-12 > button');
    }

    async resendTac() {
        // smsTacInput
        await this.page.waitForSelector('#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input');

        await _puppeteer.click(this.page,
            'Resend TAC',
            '#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---text_confirm---1Uo-m > p > a > span'
        );
    }

    async fillTac(tac) {
        let smsTacInput = await this.page.waitForSelector('#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input');

        await smsTacInput.type(tac, { delay: 50 });
    }
}

module.exports = Rhb;
