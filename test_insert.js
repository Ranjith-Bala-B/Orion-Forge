import dotenv from 'dotenv';

dotenv.config();

const hackathon = {
    "id": "h-1725184518342",
    "name": "Asian Paints Alchemy 2026",
    "type": "competitions",
    "organizer": "Unstop",
    "mode": "Hybrid",
    "platform": "Unstop",
    "websiteUrl": "https://unstop.com/competitions/crp-asian-paints-alchemy-2026-asian-paints-1704498",
    "registrationUrl": "https://unstop.com/competitions/crp-asian-paints-alchemy-2026-asian-paints-1704498",
    "problemStatement": "",
    "description": "test",
    "unstopEventId": "https://unstop.com/competitions/crp-asian-paints-alchemy-2026-asian-paints-1704498",
    "status": "Upcoming",
    "createdAt": "2026-09-01",
    "rounds": [
        {
            "id": "unstop-round-12345",
            "name": "Registration",
            "type": "Custom",
            "mode": "Offline",
            "startDate": "2026-07-02",
            "startTime": "06:30",
            "deadlineDate": "2026-10-01",
            "deadlineTime": "18:29",
            "submissionDetails": "This is the first step...",
            "submissionRequirements": "",
            "resultDate": "",
            "status": "Pending",
            "remarks": "",
            "completed": false
        }
    ],
    "tasks": [],
    "documents": [],
    "links": [],
    "team": [],
    "notes": []
};

async function run() {
    const headers = {
        'apikey': process.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    const hackathonRes = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/hackathons`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          id: hackathon.id, name: hackathon.name, type: hackathon.type, organizer: hackathon.organizer,
          mode: hackathon.mode, website_url: hackathon.websiteUrl, registration_url: hackathon.registrationUrl,
          problem_statement: hackathon.problemStatement, description: hackathon.description,
          status: hackathon.status, created_at: hackathon.createdAt || null, is_game_over: hackathon.isGameOver,
          platform: hackathon.platform || null, unstop_event_id: hackathon.unstopEventId || null
        })
    });
    
    if (!hackathonRes.ok) {
        console.error("Hackathon insert error:", await hackathonRes.text());
        return;
    }
    console.log("Hackathon inserted successfully.");

    const rounds = hackathon.rounds.map(r => ({
        id: r.id, hackathon_id: hackathon.id, name: r.name, type: r.type, mode: r.mode,
        start_date: r.startDate || null, start_time: r.startTime || null, deadline_date: r.deadlineDate || null,
        deadline_time: r.deadlineTime || null, submission_details: r.submissionDetails,
        submission_requirements: r.submissionRequirements, result_date: r.resultDate || null,
        status: r.status, remarks: r.remarks, completed: r.completed
    }));
    
    const roundsRes = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/hackathon_rounds`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(rounds)
    });
    
    if (!roundsRes.ok) {
        console.error("Rounds insert error:", await roundsRes.text());
    } else {
        console.log("Rounds inserted successfully.");
    }
}

run();
