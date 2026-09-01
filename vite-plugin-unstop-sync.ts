import type { Plugin } from 'vite';
import puppeteer from 'puppeteer-core';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import WebSocket from 'ws';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

let isSyncing = false;
let syncStatus = 'Idle';
let syncInterval: NodeJS.Timeout | null = null;

async function performScrape() {
  if (isSyncing) return;
  isSyncing = true;
  syncStatus = 'Connecting to Unstop...';
  
  let browser;
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version');
    if (!res.ok) throw new Error('Debug port not responding correctly');
    const version = await res.json();
    const webSocketDebuggerUrl = version.webSocketDebuggerUrl;

    browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
      defaultViewport: null
    });

    const pages = await browser.pages();
    let page = await browser.newPage();
    syncStatus = 'Checking registered events...';
    
    let capturedHeaders: any = null;
    page.on('request', request => {
      if (request.url().includes('api/user/registered-opportunities')) {
        capturedHeaders = request.headers();
      }
    });

    let fetchedEvents: any[] = [];
    try {
      await page.goto('https://unstop.com/user/registrations/all/all', { waitUntil: 'networkidle2', timeout: 30000 });
      
      fetchedEvents = await page.evaluate(async (headers) => {
        let results: any[] = [];
        let pageNum = 1;
        
        if (!headers) return results;

        while (pageNum <= 5) {
          try {
            const url = `https://unstop.com/api/user/registered-opportunities?page=${pageNum}&per_page=50&filterName=type,status&filterValue=all,all`;
            const res = await fetch(url, { headers });
            if (!res.ok) break;
            const json = await res.json();
            let items: any[] = [];
            if (json.data && Array.isArray(json.data.data)) items = json.data.data;
            else if (json.data && Array.isArray(json.data)) items = json.data;
            else if (Array.isArray(json)) items = json;
            if (items.length === 0) break;
            results.push(...items);
            if (items.length < 50) break;
            pageNum++;
          } catch(e) { break; }
        }
        return results;
      }, capturedHeaders);
    } catch (e) {
      console.log('Navigation or evaluate failed:', e);
    }

    await page.close();

    const registeredEvents: any[] = [];
    if (fetchedEvents && fetchedEvents.length > 0) {
      registeredEvents.push(...fetchedEvents);
    }

    if (registeredEvents.length > 0) {
      syncStatus = 'New event detected!';
      
      const formattedEvents = registeredEvents.map(evt => {
        let rounds: any[] = [];
        
        return {
          source_event_id: evt.seo_url || evt.sourceEventId || evt.id.toString(),
          title: evt.title || evt.name || 'Unknown Event',
          event_type: evt.type || evt.opportunity_type || 'Hackathon',
          organizer: evt.organizer?.name || evt.organizer || 'Unstop',
          mode: evt.mode || 'Hybrid',
          status: evt.status || 'Pending',
          registration_url: (evt.seo_url && evt.seo_url.startsWith('http')) ? evt.seo_url : (evt.seo_url ? `https://unstop.com/${evt.type || 'hackathons'}/${evt.seo_url}` : (evt.sourceEventId || '')),
          rounds: rounds
        };
      });

      const uniqueEvents = Array.from(new Map(formattedEvents.map(item => [item.source_event_id, item])).values());
      
      syncStatus = 'Saving to Connect Hackathons...';
      for (const evt of uniqueEvents) {
        // Upsert to unstop_events
        await supabase.from('unstop_events').upsert(evt, { onConflict: 'source_event_id' });
      }
    }
    
    syncStatus = 'Sync completed';
  } catch (error) {
    console.error('Scrape error:', error);
    syncStatus = 'Error occurred during sync';
  } finally {
    if (browser) await browser.disconnect();
    isSyncing = false;
    setTimeout(() => { if (syncStatus === 'Sync completed' || syncStatus === 'Error occurred during sync') syncStatus = 'Idle'; }, 5000);
  }
}

export function unstopSyncPlugin(): Plugin {
  return {
    name: 'unstop-sync',
    configureServer(server) {
      // Endpoint to trigger manual sync
      server.middlewares.use('/api/sync-unstop', async (req, res) => {
        if (req.method === 'POST') {
          if (!isSyncing) {
            performScrape();
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Sync started' }));
        } else if (req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: syncStatus, isSyncing }));
        }
      });

      // Start background daemon
      if (!syncInterval) {
        // Trigger immediately on startup
        setTimeout(() => {
          if (!isSyncing) performScrape();
        }, 2000); // 2 second delay to let server start

        syncInterval = setInterval(() => {
          if (!isSyncing) performScrape();
        }, 5 * 60 * 1000);
      }
    }
  };
}
