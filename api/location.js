const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fqxuqnhvzawlhualthii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeHVxbmh2emF3bGh1YWx0aGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk1MjMsImV4cCI6MjA1NzE5NTUyM30._vycNVW7J96Y-Bh_HxiOrpgHl1O6M4U-tEjW2wwy404';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  console.log('Full request:', { body: req.body, query: req.query });
  const latitude = parseFloat(req.body.lat || req.query.lat);
  const longitude = parseFloat(req.body.lon || req.query.lon);
  if (!latitude || !longitude) {
    console.error('Invalid data:', { latitude, longitude });
    return res.status(400).send('Invalid latitude or longitude');
  }
  const { error } = await supabase
    .from('locations')
    .insert([{ latitude, longitude }]);
  if (error) {
    console.error(error);
    return res.status(500).send('Error saving data');
  }
  res.send('Location saved');
};