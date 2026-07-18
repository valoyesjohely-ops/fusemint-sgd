import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fusemint_sgd',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Auth Middleware
interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

// Authentication Routes
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const connection = await pool.getConnection();

    const [users]: any = await connection.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      connection.release();
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    connection.release();

    res.json({
      token,
      user: {
        id: user.id,
        name: user.nombre,
        email: user.email,
        role: user.rol,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const connection = await pool.getConnection();

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'usuario']
    );

    const [users]: any = await connection.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE email = ?',
      [email]
    );

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    connection.release();

    res.json({
      token,
      user: {
        id: user.id,
        name: user.nombre,
        email: user.email,
        role: user.rol,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error al registrarse' });
  }
});

// Expedientes Routes
app.get('/api/expedientes', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [expedientes]: any = await connection.query(
      'SELECT * FROM expedientes ORDER BY fecha_creacion DESC'
    );

    // Get documentos for each expediente
    for (let exp of expedientes) {
      const [docs]: any = await connection.query(
        'SELECT * FROM documentos WHERE expediente_id = ?',
        [exp.id]
      );
      exp.documentos = docs;
    }

    connection.release();
    res.json(expedientes);
  } catch (error) {
    console.error('Error fetching expedientes:', error);
    res.status(500).json({ error: 'Error al obtener expedientes' });
  }
});

app.get('/api/expedientes/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [expedientes]: any = await connection.query(
      'SELECT * FROM expedientes WHERE id = ?',
      [id]
    );

    if (expedientes.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    const expediente = expedientes[0];
    const [documentos]: any = await connection.query(
      'SELECT * FROM documentos WHERE expediente_id = ?',
      [id]
    );

    expediente.documentos = documentos;
    connection.release();

    res.json(expediente);
  } catch (error) {
    console.error('Error fetching expediente:', error);
    res.status(500).json({ error: 'Error al obtener expediente' });
  }
});

app.post('/api/expedientes', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { numero, titulo, descripcion, seccion_id } = req.body;
    const connection = await pool.getConnection();

    const result: any = await connection.query(
      'INSERT INTO expedientes (numero, titulo, descripcion, seccion_id, estado, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [numero, titulo, descripcion, seccion_id, 'activo', req.user.id]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      numero,
      titulo,
      descripcion,
      estado: 'activo',
    });
  } catch (error) {
    console.error('Error creating expediente:', error);
    res.status(500).json({ error: 'Error al crear expediente' });
  }
});

// Documentos Routes
app.get('/api/expedientes/:expedienteId/documentos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { expedienteId } = req.params;
    const connection = await pool.getConnection();

    const [documentos]: any = await connection.query(
      'SELECT * FROM documentos WHERE expediente_id = ? ORDER BY fecha_carga DESC',
      [expedienteId]
    );

    connection.release();
    res.json(documentos);
  } catch (error) {
    console.error('Error fetching documentos:', error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
});

app.post('/api/expedientes/:expedienteId/documentos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { expedienteId } = req.params;
    const { nombre, tipo, tamaño, url } = req.body;
    const connection = await pool.getConnection();

    const result: any = await connection.query(
      'INSERT INTO documentos (expediente_id, nombre, tipo, tamaño, url, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
      [expedienteId, nombre, tipo, tamaño, url, req.user.id]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      expedienteId,
      nombre,
      tipo,
      tamaño,
      url,
    });
  } catch (error) {
    console.error('Error uploading documento:', error);
    res.status(500).json({ error: 'Error al cargar documento' });
  }
});

// Reportes Routes
app.get('/api/reportes/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();

    const [expedientes]: any = await connection.query('SELECT COUNT(*) as total FROM expedientes');
    const [expedientesActivos]: any = await connection.query('SELECT COUNT(*) as total FROM expedientes WHERE estado = "activo"');
    const [documentos]: any = await connection.query('SELECT COUNT(*) as total FROM documentos');
    const [usuarios]: any = await connection.query('SELECT COUNT(*) as total FROM usuarios');

    connection.release();

    res.json({
      totalExpedientes: expedientes[0].total,
      expedientesActivos: expedientesActivos[0].total,
      documentosCargados: documentos[0].total,
      usuariosActivos: usuarios[0].total,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});

export default app;
