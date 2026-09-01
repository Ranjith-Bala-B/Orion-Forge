const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://127.0.0.1:9222'
        });
        const page = await browser.newPage();
        page.on('response', async res => {
            if (res.url().includes('api/public/competition/') && !res.url().includes('related') && !res.url().includes('other-opportunities')) {
                try {
                    const json = await res.json();
                    if (json && json.data && json.data.rounds) {
                        const rounds = json.data.rounds.map(r => ({
                            title: r.title,
                            startDate: r.start_date,
                            endDate: r.end_date,
                            description: r.desc || r.description || ''
                        }));
                        console.log(JSON.stringify(rounds, null, 2));
                    }
                } catch(e) {}
            }
        });
        
        await page.goto('https://unstop.com/competitions/crp-asian-paints-alchemy-2026-asian-paints-1704498', { waitUntil: 'networkidle2' });
        
        await new Promise(r => setTimeout(r, 2000));
        
        await page.close();
        browser.disconnect();
    } catch(e) {
        console.error(e);
    }
})();
