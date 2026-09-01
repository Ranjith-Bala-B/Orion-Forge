const puppeteer = require('puppeteer-core');
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false }, realtime: { transport: ws }});

async function run() {
  console.log('Connecting to browser...');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  const page = await browser.newPage();
  
  let capturedHeaders = null;
  page.on('request', request => {
    if (request.url().includes('api/user/registered-opportunities')) {
      capturedHeaders = request.headers();
    }
  });

  console.log('Navigating...');
  await page.goto('https://unstop.com/user/registrations/all/all', { waitUntil: 'networkidle2' });
  
  console.log('Evaluating...');
  const fetchedEvents = await page.evaluate(async (headers) => {
    let results = [];
    if (!headers) return { error: 'no headers captured' };
    
    let pageNum = 1;
    while (pageNum <= 2) {
      try {
        const url = `https://unstop.com/api/user/registered-opportunities?page=${pageNum}&per_page=50&filterName=type,status&filterValue=all,all`;
        const res = await fetch(url, { headers });
        if (!res.ok) {
          results.push({ error: `HTTP ${res.status}` });
          break;
        }
        const json = await res.json();
        let items = [];
        if (json.data && Array.isArray(json.data.data)) items = json.data.data;
        else if (json.data && Array.isArray(json.data)) items = json.data;
        else if (Array.isArray(json)) items = json;
        else {
          results.push({ error: 'Unexpected JSON', json });
          break;
        }
        if (items.length === 0) break;
        results.push(...items);
        if (items.length < 50) break;
        pageNum++;
      } catch(e) {
        results.push({ error: e.message });
        break; 
      }
    }
    return results;
  }, capturedHeaders);

  const fs = require('fs');
  fs.writeFileSync('unstop_debug.json', JSON.stringify(fetchedEvents, null, 2));

  await page.close();
  console.log('Fetched events:', fetchedEvents.length || fetchedEvents);
  
  if (Array.isArray(fetchedEvents) && fetchedEvents.length > 0) {
    const formatted = fetchedEvents.map(e => ({
      source: 'unstop',
      source_event_id: e.id,
      title: e.title,
      event_type: e.type || e.opportunityType || 'Unknown',
      status: e.status || 'Unknown',
      source_updated_at: new Date().toISOString(),
      raw_data: e,
      rounds: e.rounds || []
    }));
    const { error } = await supabase.from('unstop_events').upsert(formatted, { onConflict: 'source_event_id' });
    if (error) console.error('Supabase error:', error);
    else console.log('Successfully upserted to Supabase!');
  }
  process.exit(0);
}

run().catch(console.error);
