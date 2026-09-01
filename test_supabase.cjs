require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const hId = `h-${Date.now()}`;
  
  const hackathon = {
    id: hId,
    name: "Test Hackathon",
    type: "Hackathon",
    organizer: "Test Organizer",
    mode: "Hybrid",
    website_url: "",
    registration_url: "",
    problem_statement: "",
    description: "test",
    status: "Upcoming",
    created_at: new Date().toISOString(),
    is_game_over: false,
    platform: "Unstop",
    unstop_event_id: "test-unstop-id-" + Date.now()
  };

  const { data, error } = await supabase.from('hackathons').upsert(hackathon);
  if (error) {
    console.error("Hackathon Insert Error:", error);
    return;
  }
  console.log("Hackathon Insert Success:", data);

  const round = {
    id: `r-${Date.now()}`,
    hackathon_id: hId,
    name: "Round 1",
    type: "Custom",
    mode: "Online",
    start_date: null,
    start_time: null,
    deadline_date: null,
    deadline_time: null,
    submission_details: "",
    submission_requirements: "",
    result_date: null,
    status: "Pending",
    remarks: "",
    completed: false
  };

  const { data: rData, error: rError } = await supabase.from('hackathon_rounds').insert([round]);
  if (rError) {
    console.error("Round Insert Error:", rError);
  } else {
    console.log("Round Insert Success", rData);
  }
}

testInsert();
