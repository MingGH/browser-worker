import { AutoRouter } from 'itty-router'
import puppeteer from "@cloudflare/puppeteer";

const router = AutoRouter()

router.get('/fetchHtml', (request, env) => {
	return fetchHtml(request, env)
})

// 处理根路径请求
router.get('/', () => {
	const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Home</title></head>
      <body><h1>Welcome to the Home Page</h1></body>
    </html>
  `
	return new Response(html, { headers: { 'Content-Type': 'text/html' } })
})


// 处理未匹配的请求 (404)
router.all('*', () => {
	const html = `
    <!DOCTYPE html>
    <html>
      <head><title>404 Not Found</title></head>
      <body><h1>404 - Page Not Found</h1></body>
    </html>
  `
	return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 404 })
})


export default { ...router } // this looks pointless, but trust us




async function fetchHtml(request, env) {
	/**
	 * @param {string} PRESHARED_AUTH_HEADER_KEY Custom header to check for key
	 * @param {string} PRESHARED_AUTH_HEADER_VALUE Hard coded key value
	 */
	const PRESHARED_AUTH_HEADER_KEY = "API-KEY";
	const PRESHARED_AUTH_HEADER_VALUE = "1574e7b2-9bc8-4204-a2ee-88a88a7f1558";
	const psk = request.headers.get(PRESHARED_AUTH_HEADER_KEY);

	console.info("PRESHARED_AUTH_HEADER_VALUE" , psk);
	if (psk === PRESHARED_AUTH_HEADER_VALUE) {
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
	}else {
		// Incorrect key supplied. Reject the request.
		return new Response("Sorry, you have supplied an invalid key.", {
			status: 403,
		});
	}
}



