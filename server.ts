import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const PG_HOST = process.env.PGHOST || "localhost";
const PG_PORT = Number(process.env.PGPORT || 5432);
const PG_USER = process.env.PGUSER || "postgres";
const PG_PASSWORD = process.env.PGPASSWORD || "12345";
const PG_DATABASE = process.env.PGDATABASE || "edu_crm";
const DATABASE_URL = process.env.DATABASE_URL || "";
const PORT = Number(process.env.PORT || 3000);

const poolConfig: any = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: PG_HOST,
      port: PG_PORT,
      user: PG_USER,
      password: PG_PASSWORD,
      database: PG_DATABASE,
    };

// Enable SSL mode for cloud PostgreSQL hosts (Supabase, Neon, etc.)
if (!DATABASE_URL && PG_HOST !== "localhost" && PG_HOST !== "127.0.0.1") {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────
// MIGRATIONS: Create all tables if not exist
// ─────────────────────────────────────────────
async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(
      `INSERT INTO users (username, password, role, name)
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', 'root', 'admin', 'Admin User', 'teacher', 'teacher123', 'teacher', 'Teacher User']
    );

    // Groups table
    await client.query(`
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

    // Students table
    await client.query(`
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

    // Seed demo groups
    await client.query(`
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

    console.log("✅ Database migrations successfully executed!");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────
app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username va parol kiriting" });
  }
  try {
    const result = await pool.query(
      "SELECT username, role, name FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Login yoki parol noto'g'ri" });
    }
    return res.json({ success: true, user: result.rows[0], token: "mock-jwt-token" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

app.post("/api/register", async (req: Request, res: Response) => {
  const { username, name, role } = req.body;
  const password = "12345";
  if (!username || !name || !role) {
    return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring" });
  }
  if (!['admin', 'teacher'].includes(role)) {
    return res.status(400).json({ success: false, message: "Role admin yoki teacher bo'lishi kerak" });
  }
  try {
    await pool.query(
      `INSERT INTO users (username, password, role, name) VALUES ($1, $2, $3, $4)`,
      [username, password, role, name]
    );
    return res.json({ success: true, user: { username, role, name }, token: "mock-jwt-token" });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: "Bu foydalanuvchi allaqachon mavjud" });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// ─────────────────────────────────────────────
// GROUPS ENDPOINTS
// ─────────────────────────────────────────────

// GET /api/groups - get all groups
app.get("/api/groups", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, time_slot, teacher, course, days, max_students, status,
              (SELECT COUNT(*) FROM students WHERE group_id = groups.id) AS student_count
       FROM groups
       ORDER BY created_at ASC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// POST /api/groups - create new group
app.post("/api/groups", async (req: Request, res: Response) => {
  const { name, time_slot, teacher, course, days, max_students } = req.body;
  if (!name || !teacher) {
    return res.status(400).json({ success: false, message: "Guruh nomi va ustozni kiriting" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO groups (name, time_slot, teacher, course, days, max_students)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, time_slot || '', teacher, course || '', days || 'Juft', max_students || 30]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// PUT /api/groups/:id - update group
app.put("/api/groups/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, time_slot, teacher, course, days, max_students, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE groups SET
         name = COALESCE($1, name),
         time_slot = COALESCE($2, time_slot),
         teacher = COALESCE($3, teacher),
         course = COALESCE($4, course),
         days = COALESCE($5, days),
         max_students = COALESCE($6, max_students),
         status = COALESCE($7, status)
       WHERE id = $8 RETURNING *`,
      [name, time_slot, teacher, course, days, max_students, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Guruh topilmadi" });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// DELETE /api/groups/:id
app.delete("/api/groups/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM groups WHERE id = $1", [id]);
    return res.json({ success: true, message: "Guruh o'chirildi" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// ─────────────────────────────────────────────
// STUDENTS ENDPOINTS
// ─────────────────────────────────────────────

// GET /api/students - list with filters
app.get("/api/students", async (req: Request, res: Response) => {
  try {
    const { search, status, group_id, course, teacher } = req.query;

    let query = `
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.phone,
        s.birth_date,
        s.balance,
        s.status,
        s.comment,
        s.points,
        s.next_payment_date,
        s.created_at,
        g.id   AS group_id,
        g.name AS group_name,
        g.time_slot AS group_time,
        g.teacher   AS group_teacher,
        g.course    AS group_course
      FROM students s
      LEFT JOIN groups g ON s.group_id = g.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let idx = 1;

    if (search) {
      query += ` AND (s.first_name ILIKE $${idx} OR s.last_name ILIKE $${idx} OR s.phone ILIKE $${idx} OR s.comment ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    if (status) {
      query += ` AND s.status = $${idx}`;
      params.push(status);
      idx++;
    }
    if (group_id) {
      query += ` AND s.group_id = $${idx}`;
      params.push(group_id);
      idx++;
    }
    if (course) {
      query += ` AND g.course ILIKE $${idx}`;
      params.push(`%${course}%`);
      idx++;
    }
    if (teacher) {
      query += ` AND g.teacher ILIKE $${idx}`;
      params.push(`%${teacher}%`);
      idx++;
    }

    query += ` ORDER BY s.created_at DESC`;

    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// GET /api/students/:id - single student
app.get("/api/students/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.*, g.name AS group_name, g.time_slot AS group_time, g.teacher AS group_teacher, g.course AS group_course
       FROM students s LEFT JOIN groups g ON s.group_id = g.id
       WHERE s.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "O'quvchi topilmadi" });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// POST /api/students - create student
app.post("/api/students", async (req: Request, res: Response) => {
  const { first_name, last_name, phone, birth_date, balance, status, comment, group_id } = req.body;

  if (!first_name || !last_name || !phone) {
    return res.status(400).json({ success: false, message: "Ism, familiya va telefon kiritilishi shart" });
  }

  const phoneRegex = /^\+?998\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: "Telefon raqami noto'g'ri formatda (+998XXXXXXXXX)" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, phone, birth_date, balance, status, comment, group_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, first_name, last_name, phone, birth_date, balance, status, comment, group_id, next_payment_date, points, created_at`,
      [
        first_name,
        last_name,
        phone,
        birth_date || null,
        parseFloat(balance) || 0,
        status || 'Yangi',
        comment || '',
        group_id ? parseInt(group_id) : null
      ]
    );

    // Fetch with group details
    const student = result.rows[0];
    if (student.group_id) {
      const groupResult = await pool.query(
        `SELECT name AS group_name, time_slot AS group_time, teacher AS group_teacher, course AS group_course FROM groups WHERE id = $1`,
        [student.group_id]
      );
      Object.assign(student, groupResult.rows[0] || {});
    }

    return res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi: " + error.message });
  }
});

// PUT /api/students/:id - update student
app.put("/api/students/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, phone, birth_date, balance, status, comment, group_id, points } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students SET
         first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         phone      = COALESCE($3, phone),
         birth_date = COALESCE($4, birth_date),
         balance    = COALESCE($5, balance),
         status     = COALESCE($6, status),
         comment    = COALESCE($7, comment),
         group_id   = $8,
         points     = COALESCE($9, points)
       WHERE id = $10
       RETURNING *`,
      [first_name, last_name, phone, birth_date || null, balance, status, comment, group_id ? parseInt(group_id) : null, points, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "O'quvchi topilmadi" });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// DELETE /api/students/:id
app.delete("/api/students/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM students WHERE id = $1", [id]);
    return res.json({ success: true, message: "O'quvchi o'chirildi" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

// ─────────────────────────────────────────────
// STATIC / DEV SERVER
// ─────────────────────────────────────────────
async function setupViteOrStatic() {
  if (process.env.VERCEL) {
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

if (!process.env.VERCEL) {
  (async () => {
    await runMigrations();
    await setupViteOrStatic();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })().catch((error) => {
    console.error('Server failed to start:', error);
  });
} else {
  runMigrations();
  setupViteOrStatic();
}

export default app;
