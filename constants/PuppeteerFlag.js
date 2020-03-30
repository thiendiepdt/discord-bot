const PuppeteerFlag = {
	common: [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu',
		'--window-size=1920x1080',
		'--single-process',
		'--no-zygote',
	],
};

module.exports = PuppeteerFlag;
