import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multi-purpose Logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Root Route for Health Check
app.get('/', (req, res) => {
  res.send('🚀 Portfolio API is running smoothly.');
});

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Neon Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- DATABASE INITIALIZATION ---
const initDB = async () => {
  let client;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        tech_stack TEXT[],
        image_url TEXT,
        live_link TEXT,
        github_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        period VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        skills TEXT[] NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        socials JSONB,
        availability_status VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        cover_image TEXT,
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Database tables initialized.');
  } catch (err) {
    console.error('⚠ DB init failed (server will still run):', err.message);
  } finally {
    if (client) client.release();
  }
};

initDB();

// 3. Configure Multer (Using memory storage to avoid saving files locally)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- AUTHENTICATION MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const token = req.header('x-admin-token');
  if (token === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
};

// --- LOGIN ROUTE ---
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ token: process.env.ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// --- POST ROUTE: CREATE PROJECT ---
app.post('/api/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, long_description, tech_stack, live_link, github_link } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    // 4. Upload image from memory buffer to Cloudinary
    const imageUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio_projects', transformation: [{ width: 800, crop: "limit" }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const imageUrl = imageUploadResult.secure_url;

    // Parse comma-separated tech string into an array 
    // Example: "React, Node" -> ["React", "Node"]
    const techStackArray = tech_stack ? tech_stack.split(',').map(item => item.trim()) : [];

    // 5. Insert project data and Cloudinary URL into Neon DB
    const insertQuery = `
      INSERT INTO projects (title, description, long_description, tech_stack, image_url, live_link, github_link)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [title, description, long_description, techStackArray, imageUrl, live_link, github_link];
    const dbResult = await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Success', project: dbResult.rows[0] });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload project' });
  }
});

// --- GET ROUTE: FETCH ALL PROJECTS ---
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// --- GET ROUTE: FETCH SINGLE PROJECT ---
app.get('/api/project-item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DB] Fetching project ID: ${id}`);
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('[DB ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// --- DELETE ROUTE: DELETE PROJECT ---
app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// --- PUT ROUTE: UPDATE PROJECT ---
app.put('/api/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, long_description, tech_stack, live_link, github_link } = req.body;
    const techStackArray = tech_stack ? tech_stack.split(',').map(item => item.trim()) : [];
    let imageUrl = req.body.existing_image_url;

    if (req.file) {
      const imageUploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_projects', transformation: [{ width: 800, crop: 'limit' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = imageUploadResult.secure_url;
    }

    const result = await pool.query(
      'UPDATE projects SET title=$1, description=$2, long_description=$3, tech_stack=$4, image_url=$5, live_link=$6, github_link=$7 WHERE id=$8 RETURNING *',
      [title, description, long_description, techStackArray, imageUrl, live_link, github_link, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// --- ABOUT ENDPOINTS ---
app.get('/api/about', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about LIMIT 1');
    res.json(result.rows[0] || { description: '' });
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/about', authMiddleware, async (req, res) => {
  try {
    const { description } = req.body;
    await pool.query('DELETE FROM about'); // Keep only one entry
    const result = await pool.query('INSERT INTO about (description) VALUES ($1) RETURNING *', [description]);
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- EXPERIENCE ENDPOINTS ---
app.get('/api/experience', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/experience', authMiddleware, async (req, res) => {
  try {
    const { type, title, organization, period, description } = req.body;
    const result = await pool.query(
      'INSERT INTO experience (type, title, organization, period, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [type, title, organization, period, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- PUT ROUTE: UPDATE EXPERIENCE ---
app.put('/api/experience/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, organization, period, description } = req.body;
    const result = await pool.query(
      'UPDATE experience SET type=$1, title=$2, organization=$3, period=$4, description=$5 WHERE id=$6 RETURNING *',
      [type, title, organization, period, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- DELETE ROUTE: DELETE EXPERIENCE ---
app.delete('/api/experience/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM experience WHERE id = $1', [id]);
    res.status(200).json({ message: 'Experience deleted' });
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- SKILLS ENDPOINTS ---
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/skills', authMiddleware, async (req, res) => {
  try {
    const { category, skills } = req.body;
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    const result = await pool.query(
      'INSERT INTO skills (category, skills) VALUES ($1, $2) RETURNING *',
      [category, skillsArray]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- PUT ROUTE: UPDATE SKILLS ---
app.put('/api/skills/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, skills } = req.body;
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    const result = await pool.query(
      'UPDATE skills SET category=$1, skills=$2 WHERE id=$3 RETURNING *',
      [category, skillsArray, id]
    );
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- DELETE ROUTE: DELETE SKILLS ---
app.delete('/api/skills/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.status(200).json({ message: 'Skill category deleted' });
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- CONTACT ENDPOINTS ---
app.get('/api/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact LIMIT 1');
    res.json(result.rows[0] || { email: '', socials: [], availability_status: '' });
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/contact', authMiddleware, async (req, res) => {
  try {
    const { email, socials, availability_status } = req.body;
    await pool.query('DELETE FROM contact');
    const result = await pool.query(
      'INSERT INTO contact (email, socials, availability_status) VALUES ($1, $2, $3) RETURNING *',
      [email, JSON.stringify(socials), availability_status]
    );
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- BLOG ENDPOINTS ---
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE published = TRUE ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.get('/api/blogs/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/blogs', authMiddleware, upload.single('cover_image'), async (req, res) => {
  try {
    const { title, excerpt, content, published } = req.body;
    let coverUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_blogs', transformation: [{ width: 1200, crop: 'limit' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });
      coverUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      'INSERT INTO blogs (title, excerpt, content, cover_image, published) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, excerpt, content, coverUrl, published === 'true']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ error: 'DB Error' });
  }
});

app.put('/api/blogs/:id', authMiddleware, upload.single('cover_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, published, existing_cover_image } = req.body;
    let coverUrl = existing_cover_image;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_blogs', transformation: [{ width: 1200, crop: 'limit' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });
      coverUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      'UPDATE blogs SET title=$1, excerpt=$2, content=$3, cover_image=$4, published=$5 WHERE id=$6 RETURNING *',
      [title, excerpt, content, coverUrl, published === 'true', id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Blog update error:', error);
    res.status(500).json({ error: 'DB Error' });
  }
});

app.delete('/api/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) { res.status(500).json({ error: 'DB Error' }); }
});

// --- GITHUB INTEGRATION ENDPOINT ---
let githubCache = {
  data: null,
  timestamp: 0,
};

app.get('/api/github', async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) return res.status(400).json({ error: 'GitHub Username not configured' });

    const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
    const now = Date.now();

    // Return cached data if valid
    if (githubCache.data && (now - githubCache.timestamp < CACHE_DURATION_MS)) {
      return res.json(githubCache.data);
    }

    // Fetch from GitHub REST API (Sort by most recently updated, grab top 6)
    const options = {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'myDynamicPortfolio-App'
      }
    };

    if (process.env.GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, options);

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const repos = await response.json();

    // Format minimum required data to send to frontend
    const formattedData = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at
    }));

    // Update Cache
    githubCache = {
      data: formattedData,
      timestamp: now,
    };

    res.json(formattedData);
  } catch (error) {
    console.error('GitHub API Proxy Error:', error);
    // If rate limited, try to return stale cache instead of breaking the frontend
    if (githubCache.data) {
      return res.json(githubCache.data);
    }
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
