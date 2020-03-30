const Command = require('../../commands/Command');
const CommandType = require('../../commands/CommandType');
const { MessageEmbed } = require('discord.js');
const Scraper = require('../../lib/google-images-scraper');
const PuppeteerFlag = require('../../constants/PuppeteerFlag');

/**
 * Command search google image
 * @example "ggi {search}"
 */
class GoogleSearchImageCommand extends Command {

	constructor() {
		super();
		this.prefix = 'ggi';
		this.type = CommandType.ONE_ARG;
	}

	async execute() {
		const search = this.args[0];
		try {
			const results = await this.getGoogleImageSearch(search);
			const image = results[Math.floor(Math.random() * results.length)];
			if (image.url && (image.url.startsWith('http') || image.url.startsWith('https'))) {
				const embed = new MessageEmbed()
					.setTitle(search)
					.setImage(image.url);
				await this.message.channel.send(embed);
			}
			else {
				await this.message.channel.send('Đã có lỗi xảy ra!');
			}
		} catch (e) {
			await this.message.channel.send('Đã có lỗi xảy ra!');
		}
	};

	getGoogleImageSearch(search) {
		return new Promise(async (resolve, reject) => {
			try {
				const google = new Scraper({
					keyword: search,
					limit: 20,
					puppeteer: {
						headless: true,
						args: PuppeteerFlag.common,
					},
					tbs: {
						// http://jwebnet.net/advancedgooglesearch.html
						// options: l(arge), m(edium), i(cons), etc.
						isz: 'm',
						// options: clipart, face, lineart, news, photo
						itp: undefined,
						// options: color, gray, trans
						ic: undefined,
						/** options: fmc (commercial reuse with modification),
						 * fc (commercial reuse), fm (noncommercial reuse with modification), f (noncommercial reuse)
						 */
						sur: undefined,
					},
				});
				const results = await google.start();
				resolve(results);
			} catch (e) {
				reject(e);
			}
		});
	};

}

module.exports = GoogleSearchImageCommand;
