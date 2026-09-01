require('dotenv').config();
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function scrapeUnstop() {
  let browser;
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version');
    if (!res.ok) {
        throw new Error('Debug port not responding correctly');
    }
    const version = await res.json();
    const webSocketDebuggerUrl = version.webSocketDebuggerUrl;

    console.log('Connecting to existing Chrome session at', webSocketDebuggerUrl);
    
    browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
      defaultViewport: null
    });

    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('unstop.com'));
    if (!page) {
        page = await browser.newPage();
        await page.goto('https://unstop.com', { waitUntil: 'networkidle2' });
    } else {
        await page.bringToFront();
    }

    /*
    console.log('Validating login status...');
    let isLoggedIn = await page.evaluate(() => {
        return !!document.querySelector('.user-avatar') || !!document.querySelector('app-user-menu') || localStorage.getItem('token') !== null;
    });

    if (!isLoggedIn) {
        // ... login automation logic ...
    }
    */
    console.log('Assuming user is already logged in based on instruction. Proceeding directly to dashboard extraction...');

    // Set up network interception to capture API responses
    const registeredEvents = [];
    
    let capturedHeaders = {};
    page.on('request', request => {
        if (request.url().includes('api/user/registered-opportunities')) {
            capturedHeaders = request.headers();
        }
    });

    page.on('response', async (response) => {
        if (response.request().resourceType() === 'fetch' || response.request().resourceType() === 'xhr') {
            try {
                if (response.url().includes('api')) {
                    const json = await response.json();
                    
                    // Search for lists of items in common JSON structures
                    let items = [];
                    if (Array.isArray(json)) items = json;
                    else if (json.data && Array.isArray(json.data)) items = json.data;
                    else if (json.data?.data && Array.isArray(json.data.data)) items = json.data.data;
                    else if (json.items && Array.isArray(json.items)) items = json.items;
                    
                    // Filter for event-like objects
                    const events = items.filter(item => item.title && item.id);
                    if (events.length > 0) {
                        console.log(`Intercepted ${events.length} potential events from API:`, response.url());
                        registeredEvents.push(...events);
                    }
                }
            } catch (e) {
                // Ignore parsing errors for non-JSON responses
            }
        }
    });

    console.log('Navigating to dashboard...');
    // Unstop dashboard path for all registrations
    await page.goto('https://unstop.com/user/registrations/all/all', { waitUntil: 'networkidle2' });
    
    console.log('Fetching all paginated events directly...');
    const fetchedEvents = await page.evaluate(async (headers) => {
        let results = [];
        let pageNum = 1;
        while (pageNum <= 10) { // Limit to 10 pages max
            try {
                const url = `https://unstop.com/api/user/registered-opportunities?page=${pageNum}&per_page=50&filterName=type,status&filterValue=all,all`;
                const res = await fetch(url, { headers });
                if (!res.ok) break;
                
                const json = await res.json();
                let items = [];
                if (json.data && Array.isArray(json.data.data)) items = json.data.data;
                else if (json.data && Array.isArray(json.data)) items = json.data;
                else if (Array.isArray(json)) items = json;
                
                if (items.length === 0) break;
                
                results.push(...items);
                if (items.length < 50) break;
                pageNum++;
            } catch(e) {
                break;
            }
        }
        return results;
    }, capturedHeaders);

    if (fetchedEvents && fetchedEvents.length > 0) {
        registeredEvents.push(...fetchedEvents);
        console.log(`Directly fetched ${fetchedEvents.length} events using intercepted headers.`);
    }

    console.log(`Captured ${registeredEvents.length} events from API interceptions.`);

    // Fallback: If network interception missed them, scrape the DOM
    if (registeredEvents.length === 0) {
        console.log('Attempting to scrape events directly from the DOM...');
        const domEvents = await page.evaluate(() => {
            const eventCards = document.querySelectorAll('.dashboard-card, .competition-card, .event-card, a[href*="/hackathons/"]');
            return Array.from(eventCards).map(card => {
                const titleEl = card.querySelector('h2, h3, .title');
                const orgEl = card.querySelector('.organizer, .company');
                const statusEl = card.querySelector('.status, .badge');
                
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    title: titleEl ? titleEl.innerText.trim() : 'Unknown Event',
                    organizer: orgEl ? orgEl.innerText.trim() : 'Unstop',
                    status: statusEl ? statusEl.innerText.trim() : 'Unknown',
                    type: 'Hackathon',
                    sourceEventId: card.getAttribute('href') || ''
                };
            }).filter(e => e.title !== 'Unknown Event');
        });
        
        registeredEvents.push(...domEvents);
        console.log(`Scraped ${domEvents.length} events from DOM.`);
    }

    const formattedEvents = registeredEvents.map(evt => {
        // Safe date parsing helper
        const parseDateString = (dateStr) => {
            if (!dateStr) return { date: '', time: '' };
            try {
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return { date: '', time: '' };
                return {
                    date: d.toISOString().split('T')[0],
                    time: d.toISOString().split('T')[1].substring(0, 5)
                };
            } catch (e) {
                return { date: '', time: '' };
            }
        };

        const start = parseDateString(evt.start_date || (evt.regnRequirements && evt.regnRequirements.start_regn_dt));
        const end = parseDateString(evt.end_date || (evt.regnRequirements && evt.regnRequirements.end_regn_dt));

        let rounds = [];
        if (start.date || end.date) {
            rounds.push({
                id: Math.random().toString(36).substr(2, 9),
                name: 'Main Event / Registration',
                type: 'Custom',
                mode: evt.mode || 'Hybrid',
                startDate: start.date,
                startTime: start.time,
                deadlineDate: end.date,
                deadlineTime: end.time,
                submissionDetails: '',
                submissionRequirements: '',
                resultDate: '',
                status: 'Pending',
                remarks: '',
                completed: false
            });
        }

        return {
            id: evt.id.toString(),
            sourceEventId: evt.seo_url || evt.sourceEventId || evt.id.toString(),
            title: evt.title || evt.name || 'Unknown Event',
            type: evt.type || evt.opportunity_type || 'Hackathon',
            organizer: evt.organizer?.name || evt.organizer || 'Unstop',
            mode: evt.mode || 'Hybrid',
            status: evt.status || 'Pending',
            registrationUrl: (evt.seo_url && evt.seo_url.startsWith('http')) ? evt.seo_url : (evt.seo_url ? `https://unstop.com/${evt.type || 'hackathons'}/${evt.seo_url}` : (evt.sourceEventId || '')),
            rounds: rounds
        };
    });
    
    // Deduplicate by sourceEventId
    const uniqueEvents = Array.from(new Map(formattedEvents.map(item => [item.sourceEventId, item])).values());

    console.log(`Starting deep scrape for ${uniqueEvents.length} events to fetch full descriptions and details...`);
    for (let i = 0; i < uniqueEvents.length; i++) {
        const evt = uniqueEvents[i];
        if (!evt.registrationUrl || !evt.registrationUrl.includes('unstop.com')) continue;
        
        console.log(`[${i+1}/${uniqueEvents.length}] Deep scraping: ${evt.title}...`);
        try {
            await page.goto(evt.registrationUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            
            const details = await page.evaluate(() => {
                const descMeta = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="description"]');
                const imageMeta = document.querySelector('meta[property="og:image"]');
                
                // Try to find actual problem statement / about text
                const aboutSection = document.querySelector('#about, .about-section, .description, .content-section, .opportunity-details, .competition-details');
                
                return {
                    description: descMeta ? descMeta.getAttribute('content') : '',
                    logoUrl: imageMeta ? imageMeta.getAttribute('content') : '',
                    fullText: aboutSection ? aboutSection.innerText : ''
                };
            });
            
            // Prefer the full text from the DOM over the meta description if it exists
            evt.description = details.fullText ? details.fullText.substring(0, 5000) : (details.description || '');
            evt.logoUrl = details.logoUrl || '';
            
            // Artificial delay to prevent Cloudflare blocks
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.log(`Failed to deep scrape ${evt.title}: ${e.message}`);
        }
    }

    const resultPayload = {
        source: 'Unstop',
        scraped_at: new Date().toISOString(),
        total_registered_events: uniqueEvents.length,
        events: uniqueEvents
    };

    fs.writeFileSync(
        path.join(__dirname, 'public', 'unstop_registered_events.json'), 
        JSON.stringify(resultPayload, null, 2)
    );
    
    console.log(`Success! Saved ${uniqueEvents.length} unique events to public/unstop_registered_events.json.`);
    
    await browser.disconnect();
    console.log('Browser disconnected. Script finished.');

  } catch (error) {
    console.error('Failed to run scrape script:');
    console.error(error.message);
    console.log('\nMake sure you started Chrome with:');
    console.log('chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\chrome_dev_profile"');
    process.exit(1);
  }
}

scrapeUnstop();
