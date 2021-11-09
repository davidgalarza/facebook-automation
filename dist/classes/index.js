"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAutomation = void 0;
const playwright_1 = require("playwright");
const lodash_1 = require("lodash");
const config_1 = require("../config");
/**
 * @description FacebookAutomation class.
 */
class FacebookAutomation {
    /**
     * @description Constructor.
     * @param {IConstructor} config
     */
    constructor(config) {
        this.config = config;
    }
    /**
     * @description Post on the Facebook page.
     * @param {IPost} data
     * @returns {Promise<string>}
     */
    async post(data) {
        const { page, browser } = await this.authenticate();
        await page.goto(this.config.pageUrl);
        await page.addStyleTag({content: '.mkhogb32 {display: block !important;}'})
        const createPostSelector = '[aria-label="Create post"]';
        await page.waitForSelector(createPostSelector);
        await page.click(createPostSelector);
        // Wait on the create post modal"
        await page.waitForSelector('[aria-label="Post"]');
        // Insert directly the text because the focus is already on the input text
        await page.keyboard.insertText(data.text);
        if (data.imagePath) {
            let modal = await page.$('div[role="dialog"] form[method="POST"]');
            

            await modal.waitForSelector('input[type="file"]');
            // Select an input file
            const input = await modal.$('input[type="file"]');
            await input.setInputFiles(data.imagePath);
            await page.waitForTimeout(5000);
            await page.waitForSelector('[aria-label="Post"]:not([aria-disabled="true"])', {timeout:60000*3});
        }
        // Submit the post
        await page.click('[aria-label="Post"]');

        await page.waitForResponse('https://www.facebook.com/api/graphql/');
        const secondResponse = await page.waitForResponse('https://www.facebook.com/api/graphql/');
        const postRes = await secondResponse.json();

        const id = postRes.data.story_create.post_id;
        await page.waitForTimeout(5000);
        try{
            page.click('[aria-label="Post"]');
        } catch(e) { }
        await page.waitForTimeout(5000);
        await this.close(browser);
        return id;
    }
    /**
     * @description Creates a browser and a page instance.
     * @returns {Promise<IBrowserAndPage>}
     */
    async createBrowserAndPage() {
        const launchConfiguration = lodash_1.merge(config_1.defaultConfig.defaultBrowserConfiguration, this.config.browserConfiguration);
        const browser = await playwright_1.chromium.launch(launchConfiguration);
        const context = await browser.newContext({ permissions: ['camera', 'microphone'] });
        const page = await context.newPage();
        return {
            browser,
            page,
        };
    }
    /**
     * @description Authenticate user from given credentials.
     * @returns {Promise<IBrowserAndPage>}
     */
    async authenticate() {
        const { page, browser } = await this.createBrowserAndPage();
        await page.goto(config_1.defaultConfig.urls.authentication);
        await page.setViewportSize({ width: 2389, height: 880 });
        // const cookieBanner = '[data-cookiebanner="accept_button"]';
        // await page.waitForSelector(cookieBanner);
        // await page.click(cookieBanner, { delay: 4000 });
        await page.waitForSelector('#email');
        await page.fill('#email', this.config.credentials.login);
        await page.fill('#pass', this.config.credentials.password);
        await page.keyboard.press('Enter', { delay: 1000 });
        await page.waitForTimeout(FacebookAutomation.WAIT_IN_MS);
        return { page, browser };
    }
    /**
     * @description Close browser.
     * @param {Browser} browser
     * @returns {Promise<void>}
     */
    async close(browser) {
        return browser.close();
    }
}
exports.FacebookAutomation = FacebookAutomation;
FacebookAutomation.WAIT_IN_MS = 15000;
//# sourceMappingURL=index.js.map