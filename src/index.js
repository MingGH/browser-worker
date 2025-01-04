import puppeteer from "@cloudflare/puppeteer";

export default {
	async fetch(request, env) {
		/**
		 * @param {string} PRESHARED_AUTH_HEADER_KEY Custom header to check for key
		 * @param {string} PRESHARED_AUTH_HEADER_VALUE Hard coded key value
		 */
		const PRESHARED_AUTH_HEADER_KEY = "API-KEY";
		const PRESHARED_AUTH_HEADER_VALUE = "1574e7b2-9bc8-4204-a2ee-88a88a7f1558";
		const psk = request.headers.get(PRESHARED_AUTH_HEADER_KEY);

		console.info("PRESHARED_AUTH_HEADER_VALUE" , psk);
		if (psk === PRESHARED_AUTH_HEADER_VALUE) {
			return handleRequest(request, env);
		}else {
			// Incorrect key supplied. Reject the request.
			return new Response("Sorry, you have supplied an invalid key.", {
				status: 403,
			});
		}
	},
};


async function handleRequest(request, env){
	const { searchParams } = new URL(request.url);
	let url = searchParams.get("url");

	const browser = await puppeteer.launch(env.MYBROWSER);
	const page = await browser.newPage();
	await page.goto(url);
	const pageHtml = await page.content();
	await browser.close();
	return new Response(pageHtml, {
		headers: {
			'Content-Type': 'text/html',
		},
	});
}
