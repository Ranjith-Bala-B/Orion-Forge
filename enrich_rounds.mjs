
import fs from 'fs';
import path from 'path';

async function enrichRounds() {
    console.log('Enriching rounds for all events...');
    const dataPath = path.resolve('public', 'unstop_registered_events.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    let updated = 0;
    
    for (let i = 0; i < data.events.length; i++) {
        const evt = data.events[i];
        try {
            console.log('[' + (i+1) + '/' + data.events.length + '] Fetching rounds for ' + evt.title + '...');
            const res = await fetch('https://unstop.com/api/public/competition/' + evt.id);
            if (res.ok) {
                const json = await res.json();
                if (json.data && json.data.competition) {
                    const comp = json.data.competition;
                    
                    if (comp.details && comp.details.length > evt.description.length) {
                        evt.description = comp.details;
                    }
                    
                    if (comp.logoUrl) evt.logoUrl = comp.logoUrl;
                    
                    if (comp.rounds && Array.isArray(comp.rounds) && comp.rounds.length > 0) {
                        evt.rounds = comp.rounds.map(r => {
                            let title = 'Unknown Round';
                            if (r.details && r.details[0] && r.details[0].title) title = r.details[0].title;
                            else if (r.title) title = r.title;
                            
                            let start = r.start_date || (r.details && r.details[0] && r.details[0].start_date) || '';
                            let end = r.end_date || (r.details && r.details[0] && r.details[0].end_date) || '';
                            
                            const parseDateStr = (dateStr) => {
                                if (!dateStr) return { date: '', time: '' };
                                try {
                                    const d = new Date(dateStr);
                                    if (isNaN(d.getTime())) return { date: '', time: '' };
                                    return {
                                        date: d.toISOString().split('T')[0],
                                        time: d.toISOString().split('T')[1].substring(0, 5)
                                    };
                                } catch(e) { return { date: '', time: '' }; }
                            };
                            
                            const pStart = parseDateStr(start);
                            const pEnd = parseDateStr(end);
                            
                            return {
                                id: Math.random().toString(36).substr(2, 9),
                                name: title,
                                type: r.entity_type && r.entity_type.includes('Offline') ? 'Offline' : (r.entity_type && r.entity_type.includes('Quiz') ? 'Quiz' : 'Custom'),
                                mode: r.entity_type && r.entity_type.includes('Offline') ? 'Offline' : 'Online',
                                startDate: pStart.date,
                                startTime: pStart.time,
                                deadlineDate: pEnd.date,
                                deadlineTime: pEnd.time,
                                submissionDetails: r.description || (r.details && r.details[0] && r.details[0].display_text) || '',
                                submissionRequirements: '',
                                resultDate: '',
                                status: r.status === 'LIVE' ? 'In Progress' : (r.status === 'COMPLETED' ? 'Completed' : 'Pending'),
                                remarks: '',
                                completed: r.status === 'COMPLETED'
                            };
                        });
                        updated++;
                    }
                }
            }
        } catch(e) {
            console.error('Failed to fetch rounds for ' + evt.id + ':', e.message);
        }
        
        await new Promise(r => setTimeout(r, 200));
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Successfully enriched rounds for ' + updated + ' events.');
}

enrichRounds().catch(console.error);

