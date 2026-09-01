import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!url.includes('unstop.com')) {
      return new Response(
        JSON.stringify({ error: 'Only unstop.com URLs are supported' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Fetch the public page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Unstop: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Extract basic information using regex since it's a SPA
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i) || html.match(/<meta name="description" content="([^"]+)"/i);

    let name = titleMatch ? titleMatch[1] : '';
    let organizer = '';
    let description = descMatch ? descMatch[1] : '';

    // Unstop titles often look like "Event Name, Organizer - Unstop"
    if (name) {
      // Decode HTML entities
      name = name.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      
      // Try to split organizer
      const parts = name.split(/,\s*|\s*-\s*Unstop/);
      if (parts.length > 1) {
        name = parts[0].trim();
        organizer = parts[1].replace('- Unstop', '').trim();
      }
    }

    // Attempt to parse out some JSON if they injected any initial state
    // Just looking for any schema.org JSON-LD which might have dates
    let startDate = '';
    let deadlineDate = '';
    
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        if (jsonLd.startDate) startDate = jsonLd.startDate.split('T')[0];
        if (jsonLd.endDate) deadlineDate = jsonLd.endDate.split('T')[0];
      } catch (e) {
        // Ignore json parse errors
      }
    }

    const data = {
      title: name || 'Unknown Event',
      organizer: organizer || 'Unstop',
      description: description,
      registrationUrl: url,
      platform: 'Unstop',
      startDate,
      deadlineDate,
    };

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
