const puppeteer = require("puppeteer");
const _puppeteer = require("../helper");

class Cimb {

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
                    req.resourceType() == "font"
                ) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await this.page.goto("https://www.cimbclicks.com.my/clicks/#/");

            await this.page.select('#quickstart-real', 'CA');
            this.start = Date.now();

        } catch (e) {
            throw e;
        }
    }

    async login(username, password) {

        let usernameInput = await this.page.waitForSelector("#user-id");
        await usernameInput.type(username, { delay: 50 });

        await this.page.waitFor(500);

        await _puppeteer.click(
            this.page,
            "Login Button",
            "#form-login-step1 > div.input-field.input-field-btn > button"
        );

        await _puppeteer.click(
            this.page,
            "Keyword Checkbox",
            '#loginCheckBox'
        );

        let passwordInput = await this.page.waitForSelector("#password", { visible: true });
        await passwordInput.type(password, { delay: 50 });

        await _puppeteer.click(
            this.page,
            "Login Button 2",
            "#form-login_step2 > div:nth-child(4) > div > button"
        );

        await this.page.waitForNavigation();
        await this.page.waitFor(500);
    }

    async transfer() {

        let toAccount = await puppeteer.waitForSelector('#elSelect2InputId__0044290cf51d-4c276-e0382055-d767d8b2');
        await toAccount.type('507152617896');

        await _puppeteer.click(
            this.page,
            "To Account",
            "#elSelect2InputId__0044290cf51d-4c276-e0382055-d767d8b2"
        );

        //     await _puppeteer.click(
        //         this.page,
        //         'Proceed Button', '#select2-elSelect2SelectId__0044290cf51d-4c276-e0382055-d767d8b2-results > li > span'
        //     );

        //     await _puppeteer.click(
        //         this.page,
        //         "To Other Bank",
        //         "#collapse0 > div > fund-transfer-single > form > div.open-expanded.bill-form.has-accepting.border-style-none.margin-zero.bottom > div:nth-child(1) > div > div:nth-child(2) > div > div.new-account-info > new-acc-fund-transfer > div > div.row.hidden-xs > div > ul > li:nth-child(3) > a"
        //     );

        //     await _puppeteer.click(
        //         this.page,
        //         "Transfer Tab",
        //         "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.container-fluid.PayNavigation---container---3nMJB > div > div.PayNavigation---navigationContent---2M_93.col-lg-8.col-md-10.col-xs-12 > div > div:nth-child(2) > div > div"
        //     );

        //     await _puppeteer.click(
        //         this.page,
        //         "Other Accounts Select Item",
        //         "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(2) > div.hidden-xs.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > div > ul > li:nth-child(2) > a"
        //     );

        //     await _puppeteer.click(
        //         this.page,
        //         "Maybank / Maybank Islamic",
        //         "#scrollToTransactions > div.Transactions---container---3sqaa > div:nth-child(1) > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj > div > div > div:nth-child(2) > div.Transactions---backgroundTile---JsrKN > div > div > div.col-xs-12.col-lg-8.col-md-10 > div:nth-child(3) > div.col-sm-10.col-xs-12.PayFromToContainer---dropdownHolder---1fWw2 > div > ul > li:nth-child(1) > a"
        //     );

        //     // Bank Transfer Modal
        //     await this.page.waitForSelector(
        //         "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div",
        //         { visible: true }
        //     );

        //     let accountNumber = await this.page.waitForSelector(
        //         "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(1) > div > div.col-sm-7 > input"
        //     );
        //     await accountNumber.type("114161093646", { delay: 50 });

        //     let transferAmount = await this.page.waitForSelector(
        //         "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(1) > div:nth-child(2) > div > div.col-sm-7 > input"
        //     );
        //     await transferAmount.type(this.amount, { delay: 50 });

        //     let reference = await this.page.waitForSelector(
        //         "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(4) > div > div > div.col-sm-7 > input"
        //     );
        //     await reference.type("ReferenceNumber", { delay: 50 });

        //     await _puppeteer.click(
        //         this.page,
        //         "Transfer Button",
        //         "#scrollToTransactions > div:nth-child(1) > div > div > div > div > div.undefined.modal-body > div > div:nth-child(7) > div.col-sm-4.col-xs-12 > button"
        //     );

        //     await _puppeteer.click(
        //         this.page,
        //         "SMS TAC",
        //         "#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-4.col-xs-12 > div > div.hidden-xs > div > div > ul > li:nth-child(2) > a"
        //     );

        //     await _puppeteer.click(this.page,
        //         'Request TAC',
        //         '#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-8.col-xs-12 > div > div > div.col-sm-3.col-xs-12 > button');
        // }

        // async resendTac() {
        //     // smsTacInput
        //     await this.page.waitForSelector('#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input');

        //     await _puppeteer.click(this.page,
        //         'Resend TAC',
        //         '#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---text_confirm---1Uo-m > p > a > span'
        //     );
    }

    async fillTac(tac) {
        let smsTacInput = await this.page.waitForSelector('#scrollToTransactions > div.Transactions---container---3sqaa > div.Transactions---content---2P7lC > div.Transactions---withSide---2taIP.container-fluid.Transactions---summaryContainer---1rNvj.undefined > div > div > div.Transactions---stickyConfirmation---2aISx > div > div > div > div > div.col-md-10.col-xs-12 > div > div > div.col-lg-8.col-md-9.col-sm-8.col-xs-12.confirm-area.OneTimePassword---alignOTPContent---3Gxqm > div.OneTimePassword---input-wrapper---3ddmb > input');

        await smsTacInput.type(tac, { delay: 50 });
    }
}

module.exports = Cimb;
