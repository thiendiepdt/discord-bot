const Command = require('../../commands/Command');
const CommandType = require('../../commands/CommandType');
const rp = require('request-promise');
const parser = require('node-html-parser');
const { MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer');

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
			const browser = await puppeteer.launch({
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-accelerated-2d-canvas',
					'--disable-gpu',
					'--window-size=1920x1080',
				],
			});
			const page = await browser.newPage();
			// Adjustments particular to this page to ensure we hit desktop breakpoint.
			await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

			await page.goto('https://ncov.moh.gov.vn/', { waitUntil: 'networkidle2' });

			const patients = await page.evaluate(() => {
				const elements = document.querySelectorAll('#yui_patched_v3_11_0_1_1582618410030_3628>div')[1]
					.lastElementChild.querySelectorAll('p');
				const p = [];
				elements.forEach((element) => {
					const text = element.textContent.split(':');
					const number = text[0].trim().replace(/^-+|-+$/g, '')
						.replace(/^\*+|\*+$/g, '');
					text.shift();
					const info = text.join();
					p.push({number, info});
				});
				return p;
			});
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Danh sách bệnh nhân')
				.setThumbnail('https://i.imgur.com/24symGa.png')
				.setAuthor('https://ncov.moh.gov.vn/')
				.setURL('https://ncov.moh.gov.vn/')
				.addFields(patients.slice(0, 5).map((patient) => {
					return {
						name: patient.number,
						value: patient.info,
					}
				}));
			await this.message.channel.send(embed);
		} catch (e) {
			console.log(e);
			await this.message.channel.send('Đã có lỗi xảy ra!');
		}
	};
}

module.exports = CoronaPatientInfoCommand;
