const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

// Supabase setup (your specific URL and Anon Key)
const supabaseUrl = 'https://fqxuqnhvzawlhualthii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeHVxbmh2emF3bGh1YWx0aGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk1MjMsImV4cCI6MjA1NzE5NTUyM30._vycNVW7J96Y-Bh_HxiOrpgHl1O6M4U-tEjW2wwy404';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON from Traccar Client
app.use(express.json());

// Endpoint to receive GPS data from Traccar Client
app.post('/location', async (req, res) => {
  const { latitude, longitude } = req.body;
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

// Dynamic map display fetching latest location from Supabase
app.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('locations')
    .select('latitude, longitude')
    .order('timestamp', { ascending: false })
    .limit(1);
  const lat = error || !data[0] ? 40.7128 : data[0].latitude; // Default to NYC if no data
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
          setInterval(() => location.reload(), 10000); // Refresh every 10s
        </script>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});