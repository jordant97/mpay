const puppeteer = require("puppeteer");
const _puppeteer = require("../helper");

class Bsn {

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

            await this.page.goto("https://www.mybsn.com.my/mybsn/login/login.do");
            this.start = Date.now();
        } catch (e) {
            throw new Error(`BSN Init: ${e.stack}`);
        }
    }

    async login(username, password) {

        try {
            let usernameInput = await this.page.waitForSelector("#username");
            await usernameInput.type(username, { delay: 50 });

            await this.page.waitFor(500);

            await _puppeteer.click(
                this.page,
                "Login Button One",
                "#confirmImage"
            );

            await _puppeteer.click(
                this.page,
                "Security Image Yes Button",
                "#step2"
            );

            let passwordInput = await this.page.waitForSelector("#password", { visible: true });
            await passwordInput.type(password, { delay: 50 });

            await _puppeteer.click(
                this.page,
                "Login Button 2",
                "#step3"
            );

        } catch (e) {
            throw new Error(`BSN Login: ${e.stack}`);
        }

    }

    async transfer() {

        try {

            await this.page.waitForSelector('html > frameset');
            this.page = await this.page.frames()[0].childFrames()[0];

            await _puppeteer.click(
                this.page,
                "Transfer Page Link",
                "#text2-header > a"
            );

            await _puppeteer.click(
                this.page,
                "Third Part Transfer",
                "#menu-ThirdPartyFundTransfer > a"
            );

            let fromAccount = await this.page.evaluate(() => {
                return document.querySelector('#fromAccountNo').children[1].attributes.value.value;
            });

            await this.page.select('#fromAccountNo', fromAccount);
            await this.page.select('#trTypeSelect', 'new');


            let accountNumber = await this.page.waitForSelector(
                "#textNonRegistered"
            );
            await accountNumber.type("0116541100016683", { delay: 50 });

            let transferAmount = await this.page.waitForSelector(
                "#amount"
            );
            await transferAmount.type(this.amount, { delay: 50 });

            let reference = await this.page.waitForSelector(
                "#recipientReference"
            );
            await reference.type("ReferenceNumber", { delay: 50 });

            let otherDetail = await this.page.waitForSelector(
                "#othPaymentDetail"
            );
            await otherDetail.type("ReferenceNumber", { delay: 50 });

            await _puppeteer.click(
                this.page,
                "Submit Button",
                "#confirm"
            );

            await _puppeteer.click(
                this.page,
                "Request TAC",
                "#requestTac"
            );

            // const newPagePromise = new Promise(x => this.browser.once('targetcreated', target => x(target.page())));

            // const newPage = await newPagePromise;


            console.log(await this.browser.pages());
            // console.log(newPage);


        } catch (e) {
            throw new Error(`BSN Transfer: ${e.stack}`);
        }
    }

    async resendTac() {
        // smsTacInput

        try {
            await this.page.waitForSelector('#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input');

            await _puppeteer.click(this.page,
                'Resend TAC',
                '#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---text_confirm---1Uo-m > p > a > span'
            );
        } catch (e) {
            throw new Error(`BSN ResendTAC: ${e.stack}`);
        }

    }

    async fillTac(tac) {

        try {
            let smsTacInput = await this.page.waitForSelector('#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input');

            await smsTacInput.type(tac, { delay: 50 });
        } catch (e) {
            throw new Error(`BSN FillTAC: ${e.stack}`);
        }

    }
}

module.exports = Bsn;
