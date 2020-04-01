const client = require('../../client/DiscordClient');
const { MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer');
const config = require('../../config');
const CoronaInfo = require('../../models/CoronaInfo');
const ProcessFlag = require('../../constants/PuppeteerFlag');

class CoronaUpdateService {
	static async run() {
		try {
			const channel = await client.channels.fetch(config.channel.corona);
			this.checkCoronaStatus(channel).catch(() => {
			});
			const minuteMillisecond = 1000 * 60;
			setInterval(() => {
				this.checkCoronaStatus(channel).catch(() => {
				});
			}, minuteMillisecond);
		} catch (e) {

		}
	}

	static async checkCoronaStatus(channel) {
		return new Promise(async (resolve, reject) => {
			const browser = await puppeteer.launch({
				args: ProcessFlag.common,
			});
			try {
				const page = await browser.newPage();
				// Adjustments particular to this page to ensure we hit desktop breakpoint.
				await page.setViewport({ width: 1920, height: 4000, deviceScaleFactor: 2 });

				await page.goto('https://ncov.moh.gov.vn/', { waitUntil: 'networkidle2' });

				const data = await page.evaluate(() => {
					const total = parseInt(document.getElementById('VN-01').textContent, 10);
					const death = parseInt(document.getElementById('VN-02').textContent, 10);
					const cure = parseInt(document.getElementById('VN-04').textContent, 10);
					return { total, death, cure };
				});
				let coronaInfo = await CoronaInfo.findOne();
				let firstCrawl = false;
				if (!coronaInfo) {
					coronaInfo = new CoronaInfo();
					firstCrawl = true;
				}
				const diffTotal = data.total - coronaInfo.total;
				const diffDeath = data.death - coronaInfo.death;
				const diffCure = data.cure - coronaInfo.cure;
				if (data.total && (diffTotal || diffDeath || diffCure)) {
					let message = [];
					if (diffTotal) {
						message.push(`Có ${diffTotal} ca nhiễm mới`);
					}
					if (diffDeath) {
						message.push(`Có thêm ${diffDeath} người chết`);
					}
					if (diffCure) {
						message.push(`Có thêm ${diffCure} người hồi phục`);
					}
					message = message.join('. ');
					const embed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle('Cập nhật tình hình Corona!')
						.setThumbnail('https://i.imgur.com/24symGa.png')
						.setDescription(message)
						.addFields([
							{
								name: 'Tổng số',
								value: data.total,
								inline: true,
							},
							{
								name: 'Số người chết',
								value: data.death,
								inline: true,
							},
							{
								name: 'Hồi phục',
								value: data.cure,
								inline: true,
							},
						])
						.setAuthor('https://ncov.moh.gov.vn/')
						.setURL('https://ncov.moh.gov.vn/');
					if (!firstCrawl) {
						channel.send(embed);
					}
					coronaInfo.total = data.total;
					coronaInfo.death = data.death;
					coronaInfo.cure = data.cure;
					coronaInfo.date = Date.now();
					await coronaInfo.save();
				}
				await browser.close();
				resolve();
			} catch (e) {
				await browser.close();
				reject(e);
			}
		});
	};
}

module.exports = CoronaUpdateService;
