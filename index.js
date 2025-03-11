const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

// Supabase setup (use your Project URL and Anon Key from Step 4)
const supabaseUrl = 'https://fqxuqnhvzawlhualthii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeHVxbmh2emF3bGh1YWx0aGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk1MjMsImV4cCI6MjA1NzE5NTUyM30._vycNVW7J96Y-Bh_HxiOrpgHl1O6M4U-tEjW2wwy404';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON from phone
app.use(express.json());

// Endpoint to receive GPS data
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
app.get('/', (req, res) => {
    res.send(`
      <html>
        <body>
          <h1>Car Tracker</h1>
          <div id="map" style="height: 400px;"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script>
            var map = L.map('map').setView([40.7128, -74.0060], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap'
            }).addTo(map);
            var marker = L.marker([40.7128, -74.0060]).addTo(map);
          </script>
        </body>
      </html>
    `);
  });
// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
});