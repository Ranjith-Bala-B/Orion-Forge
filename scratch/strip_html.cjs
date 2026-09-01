const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/unstop_registered_events.json'));

function stripHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '\"')
    .replace(/&#39;/g, '\'')
    .replace(/&rsquo;/g, '\'')
    .replace(/&lsquo;/g, '\'')
    .trim();
}

data.events.forEach(e => {
  if (e.description) {
    e.description = stripHtml(e.description);
  }
  if (e.rounds) {
    e.rounds.forEach(r => {
      if (r.submissionDetails) {
        r.submissionDetails = stripHtml(r.submissionDetails);
      }
    });
  }
});

fs.writeFileSync('./public/unstop_registered_events.json', JSON.stringify(data, null, 2));
console.log('Successfully stripped HTML tags from all descriptions and submission details.');
