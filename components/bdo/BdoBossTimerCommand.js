const Command = require('../../commands/Command');
const CommandType = require('../../commands/CommandType');
const Color = require('../../constants/Color');
const rp = require('request-promise');
const parser = require('node-html-parser');
const Character = require('./Character');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const parentPath = 'https://mmotimer.com/';
const mainPageSea = 'https://mmotimer.com/bdo/?server=sea';

/**
 * Command Lấy giờ boss BDO ra
 * @example "boss!"
 */
class BdoBossTimerCommand extends Command {

	constructor() {
		super();
		this.prefix = 'boss!';
		this.type = CommandType.NO_ARG;
	}

	async execute() {
		try {
			const { currentBoss, followedBoss, today, nextDay } = await this.getWeekBoss();
			const fields = [];
			fields.push({
				name: followedBoss.boss.name,
				value: this.getLocalTime(followedBoss.spawnTime.time),
				inline: true,
			});
			today.forEach((value) => {
				fields.push({
					name: value.boss.name,
					value: this.getLocalTime(value.spawnTime.time),
					inline: true,
				});
			});
			fields.push({ name: '\u200B', value: '\u200B' });
			fields.push({ name: 'Ngày tiếp theo:', value: '-----------------' });
			nextDay.forEach((value) => {
				fields.push({
					name: value.boss.name,
					value: this.getLocalTime(value.spawnTime.time),
					inline: true,
				});
			});
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(currentBoss.boss.name)
				.setThumbnail(currentBoss.boss.image)
				.setDescription('Hồi sinh: ' + this.getLocalTime(currentBoss.spawnTime.time))
				.addFields(fields);
			await this.message.channel.send(embed);
		}
		catch (e) {
			await this.message.channel.send('Đã có lỗi xảy ra!');
		}
	};

	async getWeekBoss() {
		return new Promise(async (resolve, reject) => {
			try {
				const html = await rp(mainPageSea);
				const data = parser.parse(html);
				const currentBossElement = data.querySelectorAll('.next-boss')[1];
				const followedBossElement = data.querySelectorAll('.next-boss')[2];
				const currentBoss = this.getBossInHeader(currentBossElement);
				const followedBoss = this.getBossInHeader(followedBossElement);

				let days = data.querySelectorAll('#ltab tbody tr');
				days = days.map((value) => {
					let [boss, spawnTime, spawnsIn] = value.querySelectorAll('td');
					const name = boss.querySelector('span').structuredText;
					const image = parentPath + boss.querySelector('img').getAttribute('src')
						.substring(3).replace('small', 'big');
					boss = { name, image };
					const [time, day] = spawnTime.querySelector('span').structuredText.split(' ');

					spawnsIn = spawnsIn.querySelector('.countdown').structuredText;
					return {
						boss,
						spawnTime: { time, day },
						spawnsIn,
					};
				});
				const today = [];
				const nextDay = [];
				let count = 0;
				let spawnDay = null;
				days.some((value) => {
					const spawnDayCurrent = value.spawnTime.day;
					if (spawnDayCurrent !== spawnDay) {
						spawnDay = spawnDayCurrent;
						count++;
					}
					if (count === 1) {
						today.push(value);
					}
					if (count === 2) {
						nextDay.push(value);
					}
					return count > 2;
				});
				resolve({ currentBoss, followedBoss, today, nextDay });
			}
			catch (e) {
				reject(e);
			}
		});
	};

	/**
	 * @param body
	 */
	getBossInHeader(body) {
		const currentBossName = body.querySelectorAll('.next-boss-title').map((v) => {
			return v.structuredText;
		}).join(' , ');
		const currentBossImage = parentPath + body.querySelector('.next-boss-inner img')
			.getAttribute('src')
			.substring(3)
			.replace('small', 'big');
		const [currentBossTime, currentBossDay] = body.querySelector('.next-boss-inner .spawntime')
			.structuredText.split(' ');
		const currentBossSpawnsIn = body.querySelector('.next-boss-inner .countdown').structuredText;
		return {
			boss: {
				name: currentBossName,
				image: currentBossImage,
			},
			spawnTime: {
				time: currentBossTime,
				day: currentBossDay,
			},
			spawnsIn: currentBossSpawnsIn,
		};
	};

	getLocalTime(time) {
		return moment(time, 'HH:mm').subtract(1, 'h').format('HH:mm');
	};
}

module.exports = BdoBossTimerCommand;
