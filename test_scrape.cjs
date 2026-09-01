const puppeteer = require('puppeteer-core');

async function testScrape() {
  console.log('Connecting to browser...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const targets = browser.targets();
  console.log('Targets:', targets.map(t => t.url()));
  
  process.exit(0);

  const fetchedEvents = await page.evaluate(async () => {
    let headers = {
      'Accept': 'application/json, text/plain, */*'
    };
    try {
      const url = `https://unstop.com/api/user/registered-opportunities?page=1&per_page=50&filterName=type,status&filterValue=all,all`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        return { error: `HTTP error ${res.status}`, status: res.status };
      }
      const json = await res.json();
      return { success: true, data: json };
    } catch(e) {
      return { error: e.message };
    }
  });

  console.log('Result:', fetchedEvents);
  process.exit(0);
}

testScrape().catch(e => {
  console.error(e);
  process.exit(1);
});
