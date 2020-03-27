const characters = [
	{
		id: 0,
		name: 'Warrior',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character0.jpg',
	},
	{
		id: 4,
		name: 'Ranger',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character4.jpg',
	},
	{
		id: 8,
		name: 'Sorceress',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character8.jpg',
	},
	{
		id: 12,
		name: 'Berserker',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character12.jpg',
	},
	{
		id: 16,
		name: 'Tamer',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character16.jpg',
	},
	{
		id: 20,
		name: 'Musa',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character20.jpg',
	},
	{
		id: 21,
		name: 'Maehwa',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character21.jpg',
	},
	{
		id: 24,
		name: 'Valkyrie',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character24.jpg',
	},
	{
		id: 25,
		name: 'Kunoichi',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character25.jpg',
	},
	{
		id: 26,
		name: 'Ninja',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character26.jpg',
	},
	{
		id: 28,
		name: 'Wizard',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character28.jpg',
	},
	{
		id: 31,
		name: 'Witch',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character31.jpg',
	},
	{
		id: 27,
		name: 'Dark Knight',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character27.jpg',
	},
	{
		id: 19,
		name: 'Striker',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character19.jpg',
	},
	{
		id: 23,
		name: 'Mystic',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character23.jpg',
	},
	{
		id: 29,
		name: 'Archer',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character29.jpg',
	},
	{
		id: 11,
		name: 'Lahn',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character11.jpg',
	},
	{
		id: 17,
		name: 'Shai',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character17.jpg',
	},
	{
		id: 5,
		name: 'Guardian',
		image: 'https://s1.pearlcdn.com/SEA/contents/img/common/character/character5.jpg',
	},
];

class Character {
	/**
	 *
	 * @param {string} name
	 * @returns {{image: string, name: string, id: number} | undefined}
	 */
	static getClassByName(name) {
		return characters.find(character => {
			return character.name === name;
		});
	}
}

module.exports = Character;
