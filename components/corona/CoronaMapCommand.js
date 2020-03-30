const Command = require('../../commands/Command');
const CommandType = require('../../commands/CommandType');
const { MessageAttachment } = require('discord.js');
const puppeteer = require('puppeteer');
const PuppeteerFlag = require('../../constants/PuppeteerFlag');

/**
 * Command lấy giờ bản đồ dịch corona từ trang https://ncov.moh.gov.vn/
 * @example "corona.map!"
 */
class CoronaMapCommand extends Command {

	constructor() {
		super();
		this.prefix = 'corona.map!';
		this.type = CommandType.NO_ARG;
	}

	async execute() {
		const browser = await puppeteer.launch({
			args: PuppeteerFlag.common,
		});
		try {
			const page = await browser.newPage();
			// Adjustments particular to this page to ensure we hit desktop breakpoint.
			await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

			await page.goto('https://ncov.moh.gov.vn/', { waitUntil: 'networkidle2' });

			/**
			 * Takes a screenshot of a DOM element on the page, with optional padding.
			 *
			 * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
			 * @return {!Promise<!Buffer>}
			 */
			async function screenshotDOMElement(opts = {}) {
				const padding = 'padding' in opts ? opts.padding : 0;
				const path = 'path' in opts ? opts.path : null;
				const selector = opts.selector;

				if (!selector) {
					throw Error('Please provide a selector.');
				}

				const rect = await page.evaluate(selector => {
					const element = document.querySelector(selector);
					if (!element) {
						return null;
					}
					const { x, y, width, height } = element.getBoundingClientRect();
					return { left: x, top: y, width, height, id: element.id };
				}, selector);

				if (!rect) {
					throw Error(`Could not find element that matches selector: ${selector}.`);
				}

				return await page.screenshot({
					path,
					clip: {
						x: rect.left - padding,
						y: rect.top - padding,
						width: rect.width + padding * 2,
						height: rect.height + padding * 2,
					},
				});
			}

			await screenshotDOMElement({
				path: 'storage/corona/corona-map.png',
				selector: '.bg-trang1a img',
				padding: 0,
			});

			browser.close();
			const file = new MessageAttachment('./storage/corona/corona-map.png');

			const embed = {
				title: 'Corona Map',
				image: {
					url: 'attachment://corona-map.png',
				},
			};

			await this.message.channel.send({ files: [file], embed: embed });
		} catch (e) {
			browser.close();
			await this.message.channel.send('Đã có lỗi xảy ra!');
		}
	};
}

module.exports = CoronaMapCommand;
