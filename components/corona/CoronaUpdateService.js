const client = require('../../client/DiscordClient');
const { MessageEmbed } = require('discord.js');
const config = require('../../config');
const CoronaInfo = require('../../models/CoronaInfo');
const rp = require('request-promise');
const parser = require('node-html-parser');

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
			console.log(e);
		}
	}

	static async checkCoronaStatus(channel) {
		try {
			let html = await rp('https://ncov.moh.gov.vn/', {
				rejectUnauthorized: false,
				gzip: true,
			});
			const data = parser.parse(html);
			const boxTke = data.querySelector('.box-tke');
			const [boxVn] = boxTke.querySelectorAll('div');
			let [country, total, treatment, cure, death] = boxVn.querySelectorAll('div');
			total = parseInt(total.querySelector('span').structuredText, 10);
			cure = parseInt(cure.querySelector('span').structuredText, 10);
			death = parseInt(death.querySelector('span').structuredText, 10);
			let coronaInfo = await CoronaInfo.findOne().exec();
			let firstCrawl = false;
			if (!coronaInfo) {
				coronaInfo = new CoronaInfo();
				firstCrawl = true;
			}
			const diffTotal = total - coronaInfo.total;
			const diffDeath = death - coronaInfo.death;
			const diffCure = cure - coronaInfo.cure;
			if (total && (diffTotal || diffDeath || diffCure)) {
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
							value: total,
							inline: true,
						},
						{
							name: 'Số người chết',
							value: death,
							inline: true,
						},
						{
							name: 'Hồi phục',
							value: cure,
							inline: true,
						},
					])
					.setAuthor('https://ncov.moh.gov.vn/')
					.setURL('https://ncov.moh.gov.vn/');
				if (!firstCrawl) {
					channel.send(embed);
				}
				coronaInfo.total = total;
				coronaInfo.death = death;
				coronaInfo.cure = cure;
				coronaInfo.date = Date.now();
				await coronaInfo.save();
				return coronaInfo;
			}
		} catch (e) {
			console.log(e);
			throw e;
		}
		throw new Error('Something went wrong!');
	};
}

module.exports = CoronaUpdateService;
