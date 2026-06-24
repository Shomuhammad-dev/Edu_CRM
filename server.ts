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
const PORT = Number(process.env.PORT || 3000);

const poolConfig: any = {
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
};

// Enable SSL mode for cloud PostgreSQL hosts (Supabase, Neon, etc.)
if (PG_HOST !== "localhost" && PG_HOST !== "127.0.0.1") {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

const app = express();
app.use(express.json());

async function runMigrations() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(
      `INSERT INTO users (username, password, role, name)
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', 'root', 'admin', 'Admin User', 'teacher', 'teacher123', 'teacher', 'Teacher User']
    );
    console.log("Database migrations successfully executed!");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

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

async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    // Development: Vite dev server middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production / Vercel: statik dist papkasini serve qilish
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

if (!process.env.VERCEL) {
  // Lokalda to'liq server sifatida ishga tushirish
  (async () => {
    await runMigrations();
    await setupViteOrStatic();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })().catch((error) => {
    console.error('Server failed to start:', error);
  });
} else {
  // Vercel Serverless Function: await bilan chaqirish
  (async () => {
    await runMigrations();
    await setupViteOrStatic();
  })().catch((error) => {
    console.error('Vercel init error:', error);
  });
}

export default app;
