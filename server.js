const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db, initDb } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Database
initDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Session for Admin
app.use(session({
  secret: 'mssc-super-secret-key', // Change in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Configure Multer for Image Uploads
const uploadDir = path.join(__dirname, 'images', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname)));

// Admin Authentication Middleware
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// API Routes
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    req.session.isAuthenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
  res.json({ isAuthenticated: !!req.session.isAuthenticated });
});

// Products API
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', isAuthenticated, upload.single('image'), (req, res) => {
  const { title, type, description, price, colour, material } = req.body;
  const image_url = req.file ? `images/uploads/${req.file.filename}` : null;
  
  const stmt = db.prepare('INSERT INTO products (title, type, description, price, colour, material, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt.run([title, type || 'Other', description, price, colour, material, image_url], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, title, type: type || 'Other', description, price, colour, material, image_url });
  });
});

app.put('/api/products/:id', isAuthenticated, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, type, description, price, colour, material } = req.body;
  
  if (req.file) {
    const image_url = `images/uploads/${req.file.filename}`;
    db.run(
      'UPDATE products SET title = ?, type = ?, description = ?, price = ?, colour = ?, material = ?, image_url = ? WHERE id = ?',
      [title, type || 'Other', description, price, colour, material, image_url, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id, image_url });
      }
    );
  } else {
    db.run(
      'UPDATE products SET title = ?, type = ?, description = ?, price = ?, colour = ?, material = ? WHERE id = ?',
      [title, type || 'Other', description, price, colour, material, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id });
      }
    );
  }
});

app.delete('/api/products/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Messages API
app.get('/api/messages', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
  stmt.run([name, email, message], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Analytics API
app.post('/api/track', (req, res) => {
  const { event_type, page, element_id } = req.body;
  const session_id = req.sessionID;
  const stmt = db.prepare('INSERT INTO analytics_events (event_type, page, element_id, session_id) VALUES (?, ?, ?, ?)');
  stmt.run([event_type, page, element_id, session_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.get('/api/analytics', isAuthenticated, (req, res) => {
  db.all(`
    SELECT event_type, page, COUNT(*) as count 
    FROM analytics_events 
    GROUP BY event_type, page
    ORDER BY count DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
