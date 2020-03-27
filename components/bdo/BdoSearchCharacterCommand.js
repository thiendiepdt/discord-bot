const Command = require('../../commands/Command');
const CommandType = require('../../commands/CommandType');
const Color = require('../../constants/Color');
const rp = require('request-promise');
const parser = require('node-html-parser');
const Character = require('./Character');
const { MessageEmbed } = require('discord.js');

/**
 * Command search character
 * @example "char {name}"
 */
class BdoSearchCharacterCommand extends Command {

	constructor() {
		super();
		this.prefix = 'char';
		this.type = CommandType.ONE_ARG;
	}

	async execute() {
		const search = this.args[0];
		try {
			const characters = await this.getBdoCharacter(search);
			characters.forEach((character) => {
				const embed = new MessageEmbed()
					.setColor(Color.primary)
					.setTitle(`character.name (${character.class.name} Lv.${character.level})`)
					.setThumbnail(character.class.image)
					.setURL(character.profileUrl)
					.setDescription('Guild: ' + character.guild);
				this.message.channel.send(embed);
			});
		} catch (e) {
			await this.message.channel.send('Đã có lỗi xảy ra!');
		}
	};

	async getBdoCharacter(name) {
		return new Promise(async (resolve, reject) => {
			try {
				const html = await rp('https://www.sea.playblackdesert.com/Adventure', {
				    qs: {
                        searchType: 1,
                        searchKeyword: name,
                    }
                });
				const data = parser.parse(html);
				const rows = data.querySelectorAll('.box_list_area li');
				const characters = rows.map((row) => {
					const familyName = row.querySelector('.title a').structuredText;
					const profileUrl = row.querySelector('.title a').getAttribute('href');
					const level = row.querySelector('.user .character_desc .level').structuredText.split('.')[1];
					const name = row.querySelector('.user .character_desc .text').structuredText;
					const className = row.querySelector('.user .character_class .name').structuredText;
					let guild = row.querySelector('.state').querySelector('a');
                    guild = guild ? guild.structuredText : 'Not in a guild';
                    let characterClass = Character.getClassByName(className);
                    if (!characterClass) {
						characterClass = {
							name: className,
							image: undefined,
						}
					}
					return {
						familyName,
						profileUrl,
						level,
						name,
						class: characterClass,
						guild,
					};
				});
				resolve(characters);
			} catch (e) {
				reject(e);
			}
		});
	};
}

module.exports = BdoSearchCharacterCommand;
