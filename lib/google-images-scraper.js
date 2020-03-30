'use strict';

const puppeteer = require('puppeteer');

function contentScript(limit) {
	return new Promise(async (resolve, reject) => {
		const results = [];
		const elements = document.querySelectorAll('a[jsaction="click:J9iaEb;"]');
		for (const element of elements) {
			try {
				await element.click();
				const href = element.getAttribute('href').slice(15).split('&')[0];
				const height = +element.parentElement.getAttribute('data-oh');
				const width = +element.parentElement.getAttribute('data-ow');
				results.push({
					url: unescape(decodeURI(href)),
					height,
					width,
				});
			} catch (error) {
				results.push({
					url: null,
					error: error.toString(),
				});
			}

			if (results.length > limit) {
				break;
			}
		}
		resolve(results);
	});
}

/**
 * @param {string} keyword search query
 * @param {number} limit amount of results to query for otherwise go on indefinitely
 * @param {string} userAgent user agent
 * @param {object} puppeteer puppeteer options
 * @param {object} tbs extra options for TBS request parameter
 */
class Scraper {

	constructor({ keyword, limit = 10, userAgent = 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0', puppeteer = {}, tbs = {} }) {
		if (keyword === undefined) {
			throw new Error('no keyword provided');
		}

		this.limit = limit;
		this.userAgent = userAgent;
		this.puppeteerOptions = puppeteer;
		const parsedTbs = this.parseRequestParameters(tbs);
		this.query = `https://www.google.com/search?q=${keyword}&source=lnms&tbm=isch&sa=X&tbs=${parsedTbs}`;
	}

	parseRequestParameters(tbs) {
		if (tbs === undefined) {
			return '';
		}

		const options = Object.keys(tbs)
			.filter(key => tbs[key])
			.map(key => `${key}:${tbs[key]}`)
			.join(',');
		return encodeURIComponent(options);
	}

	async start() {
		const browser = await puppeteer.launch(this.puppeteerOptions);
		try {
			const page = await browser.newPage();
			await page.setBypassCSP(true);
			await page.goto(this.query, {
				waitUntil: 'networkidle2',
			});
			await page.addScriptTag({ path: __dirname + '/jquery-3.4.1.min.js' });
			await page.setViewport({ width: 1920, height: 1080 });
			await page.setUserAgent(this.userAgent);

			const results = await page.evaluate(contentScript, this.limit);

			await browser.close();
			return results;
		} catch (e) {
			await browser.close();
			return [{ url: null, error: e.toString() }];
		}
	}
}

module.exports = Scraper;
