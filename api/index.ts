import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// ─── Database Pool ──────────────────────────────────────────────────────
let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) return pool;

  const DATABASE_URL = process.env.DATABASE_URL;
  const PGHOST = process.env.PGHOST;

  if (DATABASE_URL) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  } else if (PGHOST && PGHOST !== 'localhost' && PGHOST !== '127.0.0.1') {
    pool = new Pool({
      host: PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: { rejectUnauthorized: false },
    });
  } else if (PGHOST) {
    pool = new Pool({
      host: PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });
  } else {
    // No DB configured — will use fallback mode
    pool = null as any;
  }

  return pool!;
}

// ─── Ensure Tables Exist ────────────────────────────────────────────────
async function ensureTables(db: Pool) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(`
    INSERT INTO users (username, password, role, name) VALUES
      ('admin', 'root', 'admin', 'Admin User'),
      ('teacher', 'teacher123', 'teacher', 'Teacher User')
    ON CONFLICT (username) DO NOTHING
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      time_slot TEXT NOT NULL DEFAULT '',
      teacher TEXT NOT NULL DEFAULT '',
      course TEXT DEFAULT '',
      days TEXT DEFAULT 'Juft',
      max_students INTEGER DEFAULT 30,
      status TEXT DEFAULT 'Faol' CHECK (status IN ('Faol', 'Muzlatilgan', 'Arxiv')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      birth_date DATE,
      balance DECIMAL DEFAULT 0,
      status TEXT DEFAULT 'Yangi' CHECK (status IN ('Yangi', 'Faol', 'Muzlatilgan')),
      comment TEXT DEFAULT '',
      group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
      next_payment_date DATE DEFAULT (NOW() + INTERVAL '30 days'),
      points INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  // Seed demo groups if empty
  await db.query(`
    INSERT INTO groups (name, time_slot, teacher, course)
    SELECT * FROM (VALUES
      ('IT 2(Shomuhammad)', '16:00-18:00', 'Shonug''monov Shomuhammad', 'IT'),
      ('2ingliz tili Cefr', '16:00-18:00', 'Xolnazarov Ozod', 'Ingliz tili'),
      ('Sena tili yangi guruh', '15:00-17:00', 'Abdurahmonov Muhiddin', 'Sena tili'),
      ('ingliz tili kids 15 00da', '16:00-18:00', 'Usilbekova Meruert', 'Ingliz tili'),
      ('1kids (Jaksibayeva Dilnura)', '09:00-11:00', 'Jaksibayeva Dilnura', 'Ingliz tili'),
      ('Xusniddin matematika ustoz', '14:00-16:00', 'Pardayev Xusniddin', 'Matematika')
    ) AS t(name, time_slot, teacher, course)
    WHERE NOT EXISTS (SELECT 1 FROM groups LIMIT 1)
  `);
}

// ─── Fallback in-memory users (when DB is unavailable) ─────────────────
const FALLBACK_USERS = [
  { username: 'admin', password: 'root', role: 'admin', name: 'Admin User' },
  { username: 'teacher', password: 'teacher123', role: 'teacher', name: 'Teacher User' },
];

// ─── CORS helper ────────────────────────────────────────────────────────
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ─── Main Handler ───────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  // Strip query string for matching
  const path = url.split('?')[0];
  const method = req.method?.toUpperCase() || 'GET';

  // ── GET /api/health ──────────────────────────────────────────────────
  if (path === '/api/health' || path === '/api/') {
    try {
      const db = getPool();
      if (db) {
        await db.query('SELECT 1');
        return res.json({ success: true, db: 'connected', env: !!process.env.PGHOST || !!process.env.DATABASE_URL });
      }
      return res.json({ success: true, db: 'no_env', mode: 'fallback' });
    } catch (err: any) {
      return res.json({ success: false, db: 'error', error: err.message });
    }
  }

  // ── POST /api/login ──────────────────────────────────────────────────
  if (path === '/api/login' && method === 'POST') {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username va parol kiriting" });
    }

    try {
      const db = getPool();
      if (db) {
        await ensureTables(db);
        const result = await db.query(
          "SELECT username, role, name FROM users WHERE username = $1 AND password = $2",
          [username, password]
        );
        if (result.rows.length === 0) {
          return res.status(401).json({ success: false, message: "Login yoki parol noto'g'ri" });
        }
        return res.json({ success: true, user: result.rows[0], token: "jwt-token" });
      }
    } catch (err: any) {
      console.error('DB error, falling back:', err.message);
    }

    // Fallback: in-memory check
    const user = FALLBACK_USERS.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ success: false, message: "Login yoki parol noto'g'ri" });
    }
    return res.json({ success: true, user: { username: user.username, role: user.role, name: user.name }, token: "jwt-token" });
  }

  // ── POST /api/register ───────────────────────────────────────────────
  if (path === '/api/register' && method === 'POST') {
    const { username, name, role } = req.body || {};
    const password = "12345";

    if (!username || !name || !role) {
      return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring" });
    }
    if (!['admin', 'teacher'].includes(role)) {
      return res.status(400).json({ success: false, message: "Role admin yoki teacher bo'lishi kerak" });
    }

    try {
      const db = getPool();
      if (db) {
        await ensureTables(db);
        await db.query(
          `INSERT INTO users (username, password, role, name) VALUES ($1, $2, $3, $4)`,
          [username, password, role, name]
        );
        return res.json({ success: true, user: { username, role, name }, token: "jwt-token" });
      }
    } catch (err: any) {
      if (err.code === '23505') {
        return res.status(409).json({ success: false, message: "Bu foydalanuvchi allaqachon mavjud" });
      }
      console.error('DB error:', err.message);
      return res.status(500).json({ success: false, message: "Server xatosi: " + err.message });
    }

    // Fallback: pretend success (DB not configured)
    return res.json({ success: true, user: { username, role, name }, token: "jwt-token" });
  }

  // ── GET /api/groups ──────────────────────────────────────────────────
  if (path === '/api/groups' && method === 'GET') {
    try {
      const db = getPool();
      if (!db) return res.json({ success: true, data: [] });
      await ensureTables(db);
      const result = await db.query(
        `SELECT id, name, time_slot, teacher, course, days, max_students, status,
                (SELECT COUNT(*) FROM students WHERE group_id = groups.id) AS student_count
         FROM groups ORDER BY created_at ASC`
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── POST /api/groups ─────────────────────────────────────────────────
  if (path === '/api/groups' && method === 'POST') {
    const { name, time_slot, teacher, course, days, max_students } = req.body || {};
    if (!name || !teacher) {
      return res.status(400).json({ success: false, message: "Guruh nomi va ustozni kiriting" });
    }
    try {
      const db = getPool();
      if (!db) return res.status(503).json({ success: false, message: "DB sozlanmagan" });
      await ensureTables(db);
      const result = await db.query(
        `INSERT INTO groups (name, time_slot, teacher, course, days, max_students)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, time_slot || '', teacher, course || '', days || 'Juft', max_students || 30]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── PUT /api/groups/:id ──────────────────────────────────────────────
  const groupPutMatch = path.match(/^\/api\/groups\/(\d+)$/);
  if (groupPutMatch && method === 'PUT') {
    const id = groupPutMatch[1];
    const { name, time_slot, teacher, course, days, max_students, status } = req.body || {};
    try {
      const db = getPool();
      if (!db) return res.status(503).json({ success: false, message: "DB sozlanmagan" });
      const result = await db.query(
        `UPDATE groups SET
           name = COALESCE($1, name), time_slot = COALESCE($2, time_slot),
           teacher = COALESCE($3, teacher), course = COALESCE($4, course),
           days = COALESCE($5, days), max_students = COALESCE($6, max_students),
           status = COALESCE($7, status)
         WHERE id = $8 RETURNING *`,
        [name, time_slot, teacher, course, days, max_students, status, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Guruh topilmadi" });
      return res.json({ success: true, data: result.rows[0] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── DELETE /api/groups/:id ───────────────────────────────────────────
  const groupDelMatch = path.match(/^\/api\/groups\/(\d+)$/);
  if (groupDelMatch && method === 'DELETE') {
    const id = groupDelMatch[1];
    try {
      const db = getPool();
      if (!db) return res.status(503).json({ success: false, message: "DB sozlanmagan" });
      await db.query("DELETE FROM groups WHERE id = $1", [id]);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── GET /api/students ────────────────────────────────────────────────
  if (path === '/api/students' && method === 'GET') {
    try {
      const db = getPool();
      if (!db) return res.json({ success: true, data: [] });
      await ensureTables(db);

      const query_params = req.query as Record<string, string>;
      let query = `
        SELECT s.id, s.first_name, s.last_name, s.phone, s.birth_date,
               s.balance, s.status, s.comment, s.points, s.next_payment_date, s.created_at,
               g.id AS group_id, g.name AS group_name, g.time_slot AS group_time,
               g.teacher AS group_teacher, g.course AS group_course
        FROM students s
        LEFT JOIN groups g ON s.group_id = g.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let idx = 1;

      if (query_params.search) {
        query += ` AND (s.first_name ILIKE $${idx} OR s.last_name ILIKE $${idx} OR s.phone ILIKE $${idx} OR s.comment ILIKE $${idx})`;
        params.push(`%${query_params.search}%`); idx++;
      }
      if (query_params.status) { query += ` AND s.status = $${idx}`; params.push(query_params.status); idx++; }
      if (query_params.group_id) { query += ` AND s.group_id = $${idx}`; params.push(query_params.group_id); idx++; }
      if (query_params.course) { query += ` AND g.course ILIKE $${idx}`; params.push(`%${query_params.course}%`); idx++; }
      if (query_params.teacher) { query += ` AND g.teacher ILIKE $${idx}`; params.push(`%${query_params.teacher}%`); idx++; }

      query += ` ORDER BY s.created_at DESC`;
      const result = await db.query(query, params);
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── POST /api/students ───────────────────────────────────────────────
  if (path === '/api/students' && method === 'POST') {
    const { first_name, last_name, phone, birth_date, balance, status, comment, group_id } = req.body || {};
    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ success: false, message: "Ism, familiya va telefon kiritilishi shart" });
    }
    const phoneRegex = /^\+?998\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Telefon raqami noto'g'ri formatda (+998XXXXXXXXX)" });
    }
    try {
      const db = getPool();
      if (!db) return res.status(503).json({ success: false, message: "DB sozlanmagan" });
      await ensureTables(db);
      const result = await db.query(
        `INSERT INTO students (first_name, last_name, phone, birth_date, balance, status, comment, group_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [first_name, last_name, phone, birth_date || null, parseFloat(balance) || 0, status || 'Yangi', comment || '', group_id ? parseInt(group_id) : null]
      );
      const student = result.rows[0];
      if (student.group_id) {
        const gr = await db.query(`SELECT name AS group_name, time_slot AS group_time, teacher AS group_teacher, course AS group_course FROM groups WHERE id = $1`, [student.group_id]);
        Object.assign(student, gr.rows[0] || {});
      }
      return res.status(201).json({ success: true, data: student });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── PUT /api/students/:id ────────────────────────────────────────────
  const studentPutMatch = path.match(/^\/api\/students\/(\d+)$/);
  if (studentPutMatch && method === 'PUT') {
    const id = studentPutMatch[1];
    const { first_name, last_name, phone, birth_date, balance, status, comment, group_id, points } = req.body || {};
    try {
      const db = getPool();
      if (!db) return res.status(503).json({ success: false, message: "DB sozlanmagan" });
      const result = await db.query(
        `UPDATE students SET
           first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone), birth_date = COALESCE($4, birth_date),
           balance = COALESCE($5, balance), status = COALESCE($6, status),
           comment = COALESCE($7, comment), group_id = $8, points = COALESCE($9, points)
         WHERE id = $10 RETURNING *`,
        [first_name, last_name, phone, birth_date || null, balance, status, comment, group_id ? parseInt(group_id) : null, points, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: "O'quvchi topilmadi" });
      return res.json({ success: true, data: result.rows[0] });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── DELETE /api/students/:id ─────────────────────────────────────────
  const studentDelMatch = path.match(/^\/api\/students\/(\d+)$/);
  if (studentDelMatch && method === 'DELETE') {
    const id = studentDelMatch[1];
    try {
      const db = getPool();
      if (!db) return res.status(503).json({ success: false, message: "DB sozlanmagan" });
      await db.query("DELETE FROM students WHERE id = $1", [id]);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── 404 ──────────────────────────────────────────────────────────────
  return res.status(404).json({ success: false, message: `Route not found: ${method} ${path}` });
}
