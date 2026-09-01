const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://127.0.0.1:9222'
        });
        const page = await browser.newPage();
        
        await page.goto('https://unstop.com/competitions/crp-asian-paints-alchemy-2026-asian-paints-1704498', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));
        
        const pageState = await page.evaluate(() => {
            // Unstop uses Angular, check if they have a state script
            const scripts = Array.from(document.querySelectorAll('script'));
            for (let s of scripts) {
                if (s.innerText.includes('"rounds"')) {
                    return s.innerText;
                }
            }
            return null;
        });
        
        if (pageState) {
            fs.writeFileSync('C:\\Users\\ranji\\.gemini\\antigravity-ide\\brain\\5caf8852-5735-405c-a97b-c67057c4bcf1\\scratch\\test_state.txt', pageState);
            console.log('Saved state script to test_state.txt');
        } else {
            console.log('No script containing "rounds" found.');
        }
        
        await page.close();
        browser.disconnect();
    } catch(e) {
        console.error(e);
    }
})();
