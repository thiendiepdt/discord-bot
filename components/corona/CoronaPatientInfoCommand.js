const Command = require('../../commands/Command');
const CommandType = require('../../commands/CommandType');
const rp = require('request-promise');
const parser = require('node-html-parser');
const { MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer');
const PuppeteerFlag = require('../../constants/PuppeteerFlag');

/**
 * Command Lấy danh sách bệnh nhân
 * @example "boss!"
 */
class CoronaPatientInfoCommand extends Command {
	constructor() {
		super();
		this.prefix = 'corona.patient!';
		this.type = CommandType.NO_ARG;
	}

	async execute() {
		try {
			let html = await rp('https://ncov.moh.gov.vn/dong-thoi-gian', {
				rejectUnauthorized: false,
				gzip: true,
			});
			const data = parser.parse(html);
			const timelineDetails = data.querySelectorAll('.timeline-detail');
			const timelines = timelineDetails.slice(0, 2).map((timelineDetail) => {
				let [timelineHead, timelineContent] = timelineDetail.querySelectorAll('div');
				return {
					time: timelineHead.structuredText,
					content: timelineContent.structuredText,
				}
			});

			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Danh sách bệnh nhân')
				.setThumbnail('https://i.imgur.com/24symGa.png')
				.setAuthor('https://ncov.moh.gov.vn/')
				.setURL('https://ncov.moh.gov.vn/dong-thoi-gian')
				.addFields(timelines.map(timeline => {
					return {
						name: timeline.time,
						value: timeline.content,
					};
				}));
			await this.message.channel.send(embed);
		} catch (e) {
			await this.message.channel.send('Đã có lỗi xảy ra!');
		}
	};
}

module.exports = CoronaPatientInfoCommand;
