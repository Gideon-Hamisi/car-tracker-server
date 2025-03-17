const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

const supabaseUrl = 'https://fqxuqnhvzawlhualthii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeHVxbmh2emF3bGh1YWx0aGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk1MjMsImV4cCI6MjA1NzE5NTUyM30._vycNVW7J96Y-Bh_HxiOrpgHl1O6M4U-tEjW2wwy404';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.post('/location', async (req, res) => {
  console.log('Full request:', { body: req.body, query: req.query, headers: req.headers });
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
    res.status(500).send('Error saving data');
  } else {
    res.send('Location saved');
  }
});

app.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('locations')
    .select('latitude, longitude')
    .order('timestamp', { ascending: false })
    .limit(1);
  const lat = error || !data[0] ? 40.7128 : data[0].latitude;
  const lon = error || !data[0] ? -74.0060 : data[0].longitude;
  res.send(`
    <html>
      <body>
        <h1>Car Tracker</h1>
        <div id="map" style="height: 400px;"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
        <script>
          var map = L.map('map').setView([${lat}, ${lon}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);
          var marker = L.marker([${lat}, ${lon}]).addTo(map);
          setInterval(() => location.reload(), 10000);
        </script>
      </body>
    </html>
  `);
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || port}`);
});