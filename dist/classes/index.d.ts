import { IConstructor, IPost } from './types';
/**
 * @description FacebookAutomation class.
 */
export declare class FacebookAutomation {
    private config;
    private static WAIT_IN_MS;
    /**
     * @description Constructor.
     * @param {IConstructor} config
     */
    constructor(config: IConstructor);
    /**
     * @description Post on the Facebook page.
     * @param {IPost} data
     * @returns {Promise<void>}
     */
    post(data: IPost): Promise<void>;
    /**
     * @description Creates a browser and a page instance.
     * @returns {Promise<IBrowserAndPage>}
     */
    private createBrowserAndPage;
    /**
     * @description Authenticate user from given credentials.
     * @returns {Promise<IBrowserAndPage>}
     */
    private authenticate;
    /**
     * @description Close browser.
     * @param {Browser} browser
     * @returns {Promise<void>}
     */
    private close;
}
