import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT || 3000);
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 50 * 1024 * 1024);
const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || './uploads');

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.jpg',
  '.jpeg',
  '.png',
]);

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fusemint_sgd',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

interface JwtUser {
  id: number;
  email: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: JwtUser;
  file?: Express.Multer.File;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err || !user || typeof user === 'string') {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = {
      id: Number((user as any).id),
      email: String((user as any).email || ''),
      role: String((user as any).role || ''),
    };

    return next();
  });
};

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador puede acceder a este recurso' });
  }

  return next();
};

const sanitizePathSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'general';

const ensureSafePath = (targetPath: string): string | null => {
  const normalizedRoot = path.resolve(UPLOAD_ROOT);
  const normalizedTarget = path.resolve(targetPath);

  if (normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}${path.sep}`)) {
    return normalizedTarget;
  }

  return null;
};

const userCanAccessExpediente = async (
  userId: number,
  role: string,
  expedienteId: number,
  permissionField: 'puede_ver' | 'puede_crear' | 'puede_editar' | 'puede_eliminar' = 'puede_ver'
): Promise<boolean> => {
  if (role === 'admin') {
    return true;
  }

  const [rows]: any = await pool.query(
    'SELECT puede_ver, puede_crear, puede_editar, puede_eliminar FROM permisos_expediente WHERE usuario_id = ? AND expediente_id = ? LIMIT 1',
    [userId, expedienteId]
  );

  if (rows.length === 0) {
    return false;
  }

  return Boolean(rows[0][permissionField]);
};

const uploadStorage = multer.diskStorage({
  destination: (req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const authReq = req as AuthRequest;
    const body = authReq.body as {
      tipo?: string;
      expediente_id?: string;
      seccion?: string;
    };

    const tipo = sanitizePathSegment(body.tipo || 'general');
    const expedienteId = sanitizePathSegment(body.expediente_id || 'sin-expediente');
    const seccion = sanitizePathSegment(body.seccion || 'general');

    if ([body.tipo, body.expediente_id, body.seccion].some((value) => String(value || '').includes('..'))) {
      cb(new Error('Ruta de archivo inválida'), '');
      return;
    }

    const destinationPath = path.resolve(UPLOAD_ROOT, tipo, expedienteId, seccion);
    const safePath = ensureSafePath(destinationPath);
    if (!safePath) {
      cb(new Error('Ruta de archivo inválida'), '');
      return;
    }

    fs.mkdirSync(safePath, { recursive: true });
    cb(null, safePath);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 100);

    cb(null, `${Date.now()}-${baseName}${extension}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return cb(new Error('Tipo de archivo no permitido'));
    }

    return cb(null, true);
  },
});

const getCatalogQueries = (type: string) => {
  const queries: Record<
    string,
    {
      list: string;
      create: string;
      update: string;
      getById: string;
      remove: string;
    }
  > = {
    'grupos-documentales': {
      list: 'SELECT id, nombre, descripcion, estado FROM grupos_documentales ORDER BY nombre ASC',
      create: 'INSERT INTO grupos_documentales (nombre, descripcion, estado, created_by) VALUES (?, ?, ?, ?)',
      update:
        'UPDATE grupos_documentales SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), estado = COALESCE(?, estado) WHERE id = ?',
      getById: 'SELECT id, nombre, descripcion, estado FROM grupos_documentales WHERE id = ?',
      remove: 'DELETE FROM grupos_documentales WHERE id = ?',
    },
    'tipos-operacion': {
      list: 'SELECT id, nombre, descripcion, estado FROM tipos_operacion ORDER BY nombre ASC',
      create: 'INSERT INTO tipos_operacion (nombre, descripcion, estado, created_by) VALUES (?, ?, ?, ?)',
      update:
        'UPDATE tipos_operacion SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), estado = COALESCE(?, estado) WHERE id = ?',
      getById: 'SELECT id, nombre, descripcion, estado FROM tipos_operacion WHERE id = ?',
      remove: 'DELETE FROM tipos_operacion WHERE id = ?',
    },
    'tipos-cliente': {
      list: 'SELECT id, nombre, descripcion, estado FROM tipos_cliente ORDER BY nombre ASC',
      create: 'INSERT INTO tipos_cliente (nombre, descripcion, estado, created_by) VALUES (?, ?, ?, ?)',
      update:
        'UPDATE tipos_cliente SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), estado = COALESCE(?, estado) WHERE id = ?',
      getById: 'SELECT id, nombre, descripcion, estado FROM tipos_cliente WHERE id = ?',
      remove: 'DELETE FROM tipos_cliente WHERE id = ?',
    },
    'tipos-documentales': {
      list: 'SELECT id, nombre, descripcion, estado FROM tipos_documentales ORDER BY nombre ASC',
      create: 'INSERT INTO tipos_documentales (nombre, descripcion, estado, created_by) VALUES (?, ?, ?, ?)',
      update:
        'UPDATE tipos_documentales SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), estado = COALESCE(?, estado) WHERE id = ?',
      getById: 'SELECT id, nombre, descripcion, estado FROM tipos_documentales WHERE id = ?',
      remove: 'DELETE FROM tipos_documentales WHERE id = ?',
    },
    secciones: {
      list: 'SELECT id, nombre, descripcion, estado FROM secciones ORDER BY nombre ASC',
      create: 'INSERT INTO secciones (nombre, descripcion, estado, created_by) VALUES (?, ?, ?, ?)',
      update:
        'UPDATE secciones SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), estado = COALESCE(?, estado) WHERE id = ?',
      getById: 'SELECT id, nombre, descripcion, estado FROM secciones WHERE id = ?',
      remove: 'DELETE FROM secciones WHERE id = ?',
    },
  };

  return queries[type];
};

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { usuario, email, password } = req.body;

    if ((!usuario && !email) || !password) {
      return res.status(400).json({ error: 'Debe enviar usuario o email y contraseña' });
    }

    const identity = String(usuario || email);
    const [users]: any = await pool.query(
      'SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ? OR nombre = ? LIMIT 1',
      [identity, identity]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    if (user.estado !== 'activo') {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return res.json({
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
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'nombre, email y contraseña son obligatorios' });
    }

    const [existing]: any = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya se encuentra registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'usuario', 'activo']
    );

    return res.status(201).json({
      id: result.insertId,
      nombre: name,
      email,
      rol: 'usuario',
      estado: 'activo',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Error al registrarse' });
  }
});

app.get('/api/usuarios', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const [users]: any = await pool.query(
      'SELECT id, nombre, email, rol, estado, fecha_creacion, fecha_actualizacion FROM usuarios ORDER BY id DESC'
    );

    return res.json(users);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/api/usuarios', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, email, password, rol = 'usuario', estado = 'activo' } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
    }

    const [existing]: any = await pool.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol, estado, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol, estado, req.user?.id || null]
    );

    return res.status(201).json({ id: result.insertId, nombre, email, rol, estado });
  } catch (error) {
    console.error('Error creating usuario:', error);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.put('/api/usuarios/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, estado, password } = req.body;

    const [existing]: any = await pool.query('SELECT id FROM usuarios WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (rol !== undefined) {
      updates.push('rol = ?');
      values.push(rol);
    }
    if (estado !== undefined) {
      updates.push('estado = ?');
      values.push(estado);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    updates.push('updated_by = ?');
    values.push(req.user?.id || null);
    values.push(id);

    await pool.query(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`, values);

    const [users]: any = await pool.query(
      'SELECT id, nombre, email, rol, estado, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );

    return res.json(users[0]);
  } catch (error) {
    console.error('Error updating usuario:', error);
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/api/usuarios/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [existing]: any = await pool.query('SELECT id FROM usuarios WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await pool.query('UPDATE usuarios SET estado = ?, updated_by = ? WHERE id = ?', [
      'inactivo',
      req.user?.id || null,
      id,
    ]);

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting usuario:', error);
    return res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

app.post('/api/permisos-expediente', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { usuario_id, expediente_id, puede_ver = 1, puede_crear = 0, puede_editar = 0, puede_eliminar = 0 } =
      req.body;

    if (!usuario_id || !expediente_id) {
      return res.status(400).json({ error: 'usuario_id y expediente_id son obligatorios' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO permisos_expediente (usuario_id, expediente_id, puede_ver, puede_crear, puede_editar, puede_eliminar, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         puede_ver = VALUES(puede_ver),
         puede_crear = VALUES(puede_crear),
         puede_editar = VALUES(puede_editar),
         puede_eliminar = VALUES(puede_eliminar),
         updated_by = VALUES(created_by)`,
      [usuario_id, expediente_id, puede_ver, puede_crear, puede_editar, puede_eliminar, req.user?.id || null]
    );

    return res.status(201).json({
      id: result.insertId || null,
      usuario_id,
      expediente_id,
      puede_ver,
      puede_crear,
      puede_editar,
      puede_eliminar,
    });
  } catch (error) {
    console.error('Error creating permiso:', error);
    return res.status(500).json({ error: 'Error al asignar permiso' });
  }
});

app.get('/api/usuarios/:id/permisos', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await pool.query(
      `SELECT p.id, p.usuario_id, p.expediente_id, p.puede_ver, p.puede_crear, p.puede_editar, p.puede_eliminar,
              e.numero AS expediente_numero, e.titulo AS expediente_titulo
       FROM permisos_expediente p
       INNER JOIN expedientes e ON e.id = p.expediente_id
       WHERE p.usuario_id = ?
       ORDER BY p.id DESC`,
      [id]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching permisos:', error);
    return res.status(500).json({ error: 'Error al obtener permisos del usuario' });
  }
});

app.put('/api/permisos-expediente/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { puede_ver, puede_crear, puede_editar, puede_eliminar } = req.body;

    const [existing]: any = await pool.query('SELECT id FROM permisos_expediente WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    await pool.query(
      `UPDATE permisos_expediente
       SET puede_ver = COALESCE(?, puede_ver),
           puede_crear = COALESCE(?, puede_crear),
           puede_editar = COALESCE(?, puede_editar),
           puede_eliminar = COALESCE(?, puede_eliminar),
           updated_by = ?
       WHERE id = ?`,
      [puede_ver, puede_crear, puede_editar, puede_eliminar, req.user?.id || null, id]
    );

    const [rows]: any = await pool.query('SELECT * FROM permisos_expediente WHERE id = ? LIMIT 1', [id]);
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error updating permiso:', error);
    return res.status(500).json({ error: 'Error al actualizar permiso' });
  }
});

app.get('/api/catalogos/:tipo', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const queries = getCatalogQueries(req.params.tipo);
    if (!queries) {
      return res.status(404).json({ error: 'Catálogo no encontrado' });
    }

    const [rows]: any = await pool.query(queries.list);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching catalogo:', error);
    return res.status(500).json({ error: 'Error al obtener catálogo' });
  }
});

app.post('/api/catalogos/:tipo', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const queries = getCatalogQueries(req.params.tipo);
    if (!queries) {
      return res.status(404).json({ error: 'Catálogo no encontrado' });
    }

    const { nombre, descripcion = '', estado = 'activo' } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'nombre es obligatorio' });
    }

    const [result]: any = await pool.query(queries.create, [nombre, descripcion, estado, req.user?.id || null]);

    return res.status(201).json({ id: result.insertId, nombre, descripcion, estado });
  } catch (error) {
    console.error('Error creating catalogo:', error);
    return res.status(500).json({ error: 'Error al crear registro del catálogo' });
  }
});

app.put('/api/catalogos/:tipo/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const queries = getCatalogQueries(req.params.tipo);
    if (!queries) {
      return res.status(404).json({ error: 'Catálogo no encontrado' });
    }

    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    await pool.query(queries.update, [nombre, descripcion, estado, id]);

    const [rows]: any = await pool.query(queries.getById, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error updating catalogo:', error);
    return res.status(500).json({ error: 'Error al actualizar registro del catálogo' });
  }
});

app.delete('/api/catalogos/:tipo/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const queries = getCatalogQueries(req.params.tipo);
    if (!queries) {
      return res.status(404).json({ error: 'Catálogo no encontrado' });
    }

    const { id } = req.params;
    await pool.query(queries.remove, [id]);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting catalogo:', error);
    return res.status(500).json({ error: 'Error al eliminar registro del catálogo' });
  }
});

app.get('/api/clientes', authenticateToken, async (_req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT c.*, tc.nombre AS tipo_cliente
       FROM clientes c
       LEFT JOIN tipos_cliente tc ON tc.id = c.tipo_cliente_id
       ORDER BY c.id DESC`
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

app.get('/api/clientes/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query(
      `SELECT c.*, tc.nombre AS tipo_cliente
       FROM clientes c
       LEFT JOIN tipos_cliente tc ON tc.id = c.tipo_cliente_id
       WHERE c.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching cliente:', error);
    return res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

app.post('/api/clientes', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, identificacion, tipo_cliente_id, email, telefono, direccion } = req.body;

    if (!nombre || !identificacion || !tipo_cliente_id) {
      return res.status(400).json({ error: 'nombre, identificacion y tipo_cliente_id son obligatorios' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO clientes (nombre, identificacion, tipo_cliente_id, email, telefono, direccion, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, identificacion, tipo_cliente_id, email || null, telefono || null, direccion || null, req.user?.id || null]
    );

    return res.status(201).json({
      id: result.insertId,
      nombre,
      identificacion,
      tipo_cliente_id,
      email: email || null,
      telefono: telefono || null,
      direccion: direccion || null,
    });
  } catch (error) {
    console.error('Error creating cliente:', error);
    return res.status(500).json({ error: 'Error al crear cliente' });
  }
});

app.get('/api/expedientes', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 0;
    const role = req.user?.role || 'usuario';

    const {
      grupo_documental,
      tipo_operacion,
      tipo_cliente,
      tipo_documental,
      seccion,
      estado,
      q,
    } = req.query as Record<string, string>;

    const filters: string[] = [];
    const params: any[] = [];

    if (role !== 'admin') {
      filters.push('p.usuario_id = ? AND p.puede_ver = 1');
      params.push(userId);
    }

    if (estado) {
      filters.push('e.estado = ?');
      params.push(estado);
    }
    if (grupo_documental) {
      filters.push('gd.nombre = ?');
      params.push(grupo_documental);
    }
    if (tipo_operacion) {
      filters.push('tope.nombre = ?');
      params.push(tipo_operacion);
    }
    if (tipo_cliente) {
      filters.push('tc.nombre = ?');
      params.push(tipo_cliente);
    }
    if (tipo_documental) {
      filters.push('td.nombre = ?');
      params.push(tipo_documental);
    }
    if (seccion) {
      filters.push('s.nombre = ?');
      params.push(seccion);
    }
    if (q) {
      filters.push('(e.numero LIKE ? OR e.titulo LIKE ? OR e.descripcion LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const [rows]: any = await pool.query(
      `SELECT DISTINCT
          e.id, e.numero, e.titulo, e.descripcion, e.estado, e.fecha_creacion,
          gd.nombre AS grupo_documental,
          tope.nombre AS tipo_operacion,
          tc.nombre AS tipo_cliente,
          s.nombre AS seccion,
          c.nombre AS cliente
       FROM expedientes e
       LEFT JOIN grupos_documentales gd ON gd.id = e.grupo_documental_id
       LEFT JOIN tipos_operacion tope ON tope.id = e.tipo_operacion_id
       LEFT JOIN tipos_cliente tc ON tc.id = e.tipo_cliente_id
       LEFT JOIN secciones s ON s.id = e.seccion_id
       LEFT JOIN clientes c ON c.id = e.cliente_id
       LEFT JOIN documentos d ON d.expediente_id = e.id
       LEFT JOIN tipos_documentales td ON td.id = d.tipo_documental_id
       LEFT JOIN permisos_expediente p ON p.expediente_id = e.id
       ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
       ORDER BY e.fecha_creacion DESC`,
      params
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching expedientes:', error);
    return res.status(500).json({ error: 'Error al obtener expedientes' });
  }
});

app.get('/api/expedientes/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expedienteId = Number(req.params.id);
    if (!(await userCanAccessExpediente(req.user?.id || 0, req.user?.role || 'usuario', expedienteId, 'puede_ver'))) {
      return res.status(403).json({ error: 'No tiene permisos para ver este expediente' });
    }

    const [expedientes]: any = await pool.query(
      `SELECT e.*, gd.nombre AS grupo_documental, tope.nombre AS tipo_operacion, tc.nombre AS tipo_cliente,
              s.nombre AS seccion, c.nombre AS cliente
       FROM expedientes e
       LEFT JOIN grupos_documentales gd ON gd.id = e.grupo_documental_id
       LEFT JOIN tipos_operacion tope ON tope.id = e.tipo_operacion_id
       LEFT JOIN tipos_cliente tc ON tc.id = e.tipo_cliente_id
       LEFT JOIN secciones s ON s.id = e.seccion_id
       LEFT JOIN clientes c ON c.id = e.cliente_id
       WHERE e.id = ? LIMIT 1`,
      [expedienteId]
    );

    if (expedientes.length === 0) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    const [documentos]: any = await pool.query(
      `SELECT d.*, td.nombre AS tipo_documental
       FROM documentos d
       LEFT JOIN tipos_documentales td ON td.id = d.tipo_documental_id
       WHERE d.expediente_id = ?
       ORDER BY d.fecha_carga DESC`,
      [expedienteId]
    );

    const [secciones]: any = await pool.query(
      `SELECT es.id, es.expediente_id, es.seccion_id, s.nombre AS seccion
       FROM expediente_secciones es
       INNER JOIN secciones s ON s.id = es.seccion_id
       WHERE es.expediente_id = ?
       ORDER BY s.nombre ASC`,
      [expedienteId]
    );

    return res.json({ ...expedientes[0], documentos, secciones });
  } catch (error) {
    console.error('Error fetching expediente:', error);
    return res.status(500).json({ error: 'Error al obtener expediente' });
  }
});

app.post('/api/expedientes', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      numero,
      titulo,
      descripcion,
      grupo_documental_id,
      tipo_operacion_id,
      tipo_cliente_id,
      seccion_id,
      cliente_id,
    } = req.body;

    if (!numero || !titulo) {
      return res.status(400).json({ error: 'numero y titulo son obligatorios' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO expedientes
       (numero, titulo, descripcion, grupo_documental_id, tipo_operacion_id, tipo_cliente_id, seccion_id, cliente_id, estado, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numero,
        titulo,
        descripcion || null,
        grupo_documental_id || null,
        tipo_operacion_id || null,
        tipo_cliente_id || null,
        seccion_id || null,
        cliente_id || null,
        'activo',
        req.user?.id || null,
      ]
    );

    const expedienteId = Number(result.insertId);

    if (tipo_operacion_id) {
      const [defaultSections]: any = await pool.query(
        `SELECT id FROM secciones WHERE LOWER(nombre) IN ('tecnica', 'financiera', 'legal')`
      );

      for (const section of defaultSections) {
        await pool.query('INSERT INTO expediente_secciones (expediente_id, seccion_id) VALUES (?, ?)', [
          expedienteId,
          section.id,
        ]);
      }
    }

    return res.status(201).json({ id: expedienteId, numero, titulo, estado: 'activo' });
  } catch (error) {
    console.error('Error creating expediente:', error);
    return res.status(500).json({ error: 'Error al crear expediente' });
  }
});

app.put('/api/expedientes/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expedienteId = Number(req.params.id);

    if (!(await userCanAccessExpediente(req.user?.id || 0, req.user?.role || 'usuario', expedienteId, 'puede_editar'))) {
      return res.status(403).json({ error: 'No tiene permisos para editar este expediente' });
    }

    const { numero, titulo, descripcion, estado, grupo_documental_id, tipo_operacion_id, tipo_cliente_id, seccion_id, cliente_id } =
      req.body;

    await pool.query(
      `UPDATE expedientes
       SET numero = COALESCE(?, numero),
           titulo = COALESCE(?, titulo),
           descripcion = COALESCE(?, descripcion),
           estado = COALESCE(?, estado),
           grupo_documental_id = COALESCE(?, grupo_documental_id),
           tipo_operacion_id = COALESCE(?, tipo_operacion_id),
           tipo_cliente_id = COALESCE(?, tipo_cliente_id),
           seccion_id = COALESCE(?, seccion_id),
           cliente_id = COALESCE(?, cliente_id),
           updated_by = ?
       WHERE id = ?`,
      [
        numero,
        titulo,
        descripcion,
        estado,
        grupo_documental_id,
        tipo_operacion_id,
        tipo_cliente_id,
        seccion_id,
        cliente_id,
        req.user?.id || null,
        expedienteId,
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM expedientes WHERE id = ? LIMIT 1', [expedienteId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error updating expediente:', error);
    return res.status(500).json({ error: 'Error al actualizar expediente' });
  }
});

app.delete('/api/expedientes/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expedienteId = Number(req.params.id);

    if (!(await userCanAccessExpediente(req.user?.id || 0, req.user?.role || 'usuario', expedienteId, 'puede_eliminar'))) {
      return res.status(403).json({ error: 'No tiene permisos para eliminar este expediente' });
    }

    await pool.query('DELETE FROM expedientes WHERE id = ?', [expedienteId]);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting expediente:', error);
    return res.status(500).json({ error: 'Error al eliminar expediente' });
  }
});

app.post('/api/operaciones', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { numero, titulo, descripcion, tipo_operacion_id, grupo_documental_id, tipo_cliente_id, cliente_id } = req.body;

    if (!numero || !titulo || !tipo_operacion_id) {
      return res.status(400).json({ error: 'numero, titulo y tipo_operacion_id son obligatorios' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO expedientes
       (numero, titulo, descripcion, grupo_documental_id, tipo_operacion_id, tipo_cliente_id, seccion_id, cliente_id, estado, created_by)
       VALUES (?, ?, ?, ?, ?, ?, NULL, ?, 'activo', ?)`,
      [
        numero,
        titulo,
        descripcion || null,
        grupo_documental_id || null,
        tipo_operacion_id,
        tipo_cliente_id || null,
        cliente_id || null,
        req.user?.id || null,
      ]
    );

    const expedienteId = Number(result.insertId);

    await pool.query(
      `INSERT INTO operaciones (numero, descripcion, tipo_operacion_id, expediente_id, estado, created_by)
       VALUES (?, ?, ?, ?, 'activo', ?)`,
      [numero, descripcion || null, tipo_operacion_id, expedienteId, req.user?.id || null]
    );

    const [defaultSections]: any = await pool.query(
      `SELECT id FROM secciones WHERE LOWER(nombre) IN ('tecnica', 'financiera', 'legal')`
    );

    for (const section of defaultSections) {
      await pool.query('INSERT INTO expediente_secciones (expediente_id, seccion_id) VALUES (?, ?)', [
        expedienteId,
        section.id,
      ]);
    }

    return res.status(201).json({ id: expedienteId, numero, titulo, tipo_operacion_id });
  } catch (error) {
    console.error('Error creating operacion:', error);
    return res.status(500).json({ error: 'Error al crear operación' });
  }
});

const getOperacionesByTipo = async (nombreTipo: string, req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 0;
  const role = req.user?.role || 'usuario';

  const filters: string[] = ['LOWER(tope.nombre) = ?'];
  const params: any[] = [nombreTipo.toLowerCase()];

  if (role !== 'admin') {
    filters.push('p.usuario_id = ? AND p.puede_ver = 1');
    params.push(userId);
  }

  const [rows]: any = await pool.query(
    `SELECT DISTINCT e.*, tope.nombre AS tipo_operacion
     FROM expedientes e
     INNER JOIN tipos_operacion tope ON tope.id = e.tipo_operacion_id
     LEFT JOIN permisos_expediente p ON p.expediente_id = e.id
     WHERE ${filters.join(' AND ')}
     ORDER BY e.fecha_creacion DESC`,
    params
  );

  res.json(rows);
};

app.get('/api/operaciones/proyectos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    return await getOperacionesByTipo('proyecto', req, res);
  } catch (error) {
    console.error('Error fetching proyectos:', error);
    return res.status(500).json({ error: 'Error al obtener operaciones de tipo proyecto' });
  }
});

app.get('/api/operaciones/convenios', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    return await getOperacionesByTipo('convenio', req, res);
  } catch (error) {
    console.error('Error fetching convenios:', error);
    return res.status(500).json({ error: 'Error al obtener operaciones de tipo convenio' });
  }
});

app.get('/api/operaciones/contratos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    return await getOperacionesByTipo('contrato', req, res);
  } catch (error) {
    console.error('Error fetching contratos:', error);
    return res.status(500).json({ error: 'Error al obtener operaciones de tipo contrato' });
  }
});

app.post('/api/documentos', authenticateToken, upload.single('archivo'), async (req: AuthRequest, res: Response) => {
  try {
    const { expediente_id, tipo_documental_id, seccion = 'general', descripcion = '' } = req.body;

    if (!expediente_id) {
      return res.status(400).json({ error: 'expediente_id es obligatorio' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Debe adjuntar un archivo' });
    }

    const expedienteId = Number(expediente_id);
    if (!(await userCanAccessExpediente(req.user?.id || 0, req.user?.role || 'usuario', expedienteId, 'puede_editar'))) {
      return res.status(403).json({ error: 'No tiene permisos para cargar documentos en este expediente' });
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Tipo de archivo no permitido' });
    }

    const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');

    const [result]: any = await pool.query(
      `INSERT INTO documentos
       (expediente_id, nombre, tipo, tamaño, url, descripcion, seccion, tipo_documental_id, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expedienteId,
        req.file.originalname,
        extension.replace('.', ''),
        req.file.size,
        relativePath,
        descripcion || null,
        seccion,
        tipo_documental_id || null,
        req.user?.id || null,
      ]
    );

    return res.status(201).json({
      id: result.insertId,
      expediente_id: expedienteId,
      nombre: req.file.originalname,
      tipo: extension.replace('.', ''),
      tamaño: req.file.size,
      url: relativePath,
      seccion,
    });
  } catch (error) {
    console.error('Error uploading documento:', error);
    return res.status(500).json({ error: 'Error al cargar documento' });
  }
});

app.get('/api/documentos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query('SELECT * FROM documentos WHERE id = ? LIMIT 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const documento = rows[0];

    if (
      !(await userCanAccessExpediente(
        req.user?.id || 0,
        req.user?.role || 'usuario',
        Number(documento.expediente_id),
        'puede_ver'
      ))
    ) {
      return res.status(403).json({ error: 'No tiene permisos para descargar este documento' });
    }

    const absolutePath = path.resolve(process.cwd(), documento.url);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado en almacenamiento' });
    }

    return res.download(absolutePath, documento.nombre);
  } catch (error) {
    console.error('Error downloading documento:', error);
    return res.status(500).json({ error: 'Error al descargar documento' });
  }
});

app.delete('/api/documentos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await pool.query('SELECT * FROM documentos WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const documento = rows[0];

    if (
      !(await userCanAccessExpediente(
        req.user?.id || 0,
        req.user?.role || 'usuario',
        Number(documento.expediente_id),
        'puede_eliminar'
      ))
    ) {
      return res.status(403).json({ error: 'No tiene permisos para eliminar este documento' });
    }

    await pool.query('DELETE FROM documentos WHERE id = ?', [id]);

    const absolutePath = path.resolve(process.cwd(), documento.url);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting documento:', error);
    return res.status(500).json({ error: 'Error al eliminar documento' });
  }
});

app.get('/api/expedientes/:id/documentos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expedienteId = Number(req.params.id);

    if (!(await userCanAccessExpediente(req.user?.id || 0, req.user?.role || 'usuario', expedienteId, 'puede_ver'))) {
      return res.status(403).json({ error: 'No tiene permisos para ver documentos de este expediente' });
    }

    const [rows]: any = await pool.query(
      `SELECT d.*, td.nombre AS tipo_documental
       FROM documentos d
       LEFT JOIN tipos_documentales td ON td.id = d.tipo_documental_id
       WHERE d.expediente_id = ?
       ORDER BY d.fecha_carga DESC`,
      [expedienteId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching documentos:', error);
    return res.status(500).json({ error: 'Error al obtener documentos del expediente' });
  }
});

app.get('/api/busqueda', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Debe enviar el parámetro q' });
    }

    const userId = req.user?.id || 0;
    const role = req.user?.role || 'usuario';

    const accessWhere = role === 'admin' ? '' : 'AND p.usuario_id = ? AND p.puede_ver = 1';
    const accessParams = role === 'admin' ? [] : [userId];

    const [rows]: any = await pool.query(
      `SELECT DISTINCT
          e.id, e.numero, e.titulo, e.descripcion, e.fecha_creacion,
          gd.nombre AS grupo_documental,
          tope.nombre AS tipo_operacion,
          tc.nombre AS tipo_cliente,
          d.nombre AS documento,
          c.nombre AS cliente
       FROM expedientes e
       LEFT JOIN grupos_documentales gd ON gd.id = e.grupo_documental_id
       LEFT JOIN tipos_operacion tope ON tope.id = e.tipo_operacion_id
       LEFT JOIN tipos_cliente tc ON tc.id = e.tipo_cliente_id
       LEFT JOIN clientes c ON c.id = e.cliente_id
       LEFT JOIN documentos d ON d.expediente_id = e.id
       LEFT JOIN permisos_expediente p ON p.expediente_id = e.id
       WHERE (
         e.numero LIKE ? OR
         e.titulo LIKE ? OR
         e.descripcion LIKE ? OR
         COALESCE(c.nombre, '') LIKE ? OR
         COALESCE(d.nombre, '') LIKE ?
       )
       ${accessWhere}
       ORDER BY e.fecha_creacion DESC`,
      [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, ...accessParams]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error searching:', error);
    return res.status(500).json({ error: 'Error en búsqueda general' });
  }
});

app.post('/api/busqueda/avanzada', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { grupo_documental, tipo_operacion, tipo_cliente, tipo_documental, seccion, fecha_cargue } = req.body;

    const userId = req.user?.id || 0;
    const role = req.user?.role || 'usuario';

    const filters: string[] = [];
    const params: any[] = [];

    if (grupo_documental) {
      filters.push('gd.nombre = ?');
      params.push(grupo_documental);
    }
    if (tipo_operacion) {
      filters.push('tope.nombre = ?');
      params.push(tipo_operacion);
    }
    if (tipo_cliente) {
      filters.push('tc.nombre = ?');
      params.push(tipo_cliente);
    }
    if (tipo_documental) {
      filters.push('td.nombre = ?');
      params.push(tipo_documental);
    }
    if (seccion) {
      filters.push('d.seccion = ?');
      params.push(seccion);
    }
    if (fecha_cargue) {
      filters.push('DATE(d.fecha_carga) = DATE(?)');
      params.push(fecha_cargue);
    }

    if (role !== 'admin') {
      filters.push('p.usuario_id = ? AND p.puede_ver = 1');
      params.push(userId);
    }

    const [rows]: any = await pool.query(
      `SELECT DISTINCT
          e.id, e.numero, e.titulo, e.descripcion, e.fecha_creacion,
          gd.nombre AS grupo_documental,
          tope.nombre AS tipo_operacion,
          tc.nombre AS tipo_cliente,
          td.nombre AS tipo_documental,
          d.seccion,
          d.fecha_carga
       FROM expedientes e
       LEFT JOIN grupos_documentales gd ON gd.id = e.grupo_documental_id
       LEFT JOIN tipos_operacion tope ON tope.id = e.tipo_operacion_id
       LEFT JOIN tipos_cliente tc ON tc.id = e.tipo_cliente_id
       LEFT JOIN documentos d ON d.expediente_id = e.id
       LEFT JOIN tipos_documentales td ON td.id = d.tipo_documental_id
       LEFT JOIN permisos_expediente p ON p.expediente_id = e.id
       ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
       ORDER BY e.fecha_creacion DESC`,
      params
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error advanced searching:', error);
    return res.status(500).json({ error: 'Error en búsqueda avanzada' });
  }
});

app.get('/api/dashboard/totales', authenticateToken, async (_req: AuthRequest, res: Response) => {
  try {
    const [expedientes]: any = await pool.query('SELECT COUNT(*) AS total FROM expedientes');
    const [documentos]: any = await pool.query('SELECT COUNT(*) AS total FROM documentos');
    const [clientes]: any = await pool.query('SELECT COUNT(*) AS total FROM clientes');

    return res.json({
      expedientes: expedientes[0].total,
      documentos: documentos[0].total,
      clientes: clientes[0].total,
    });
  } catch (error) {
    console.error('Error fetching dashboard totals:', error);
    return res.status(500).json({ error: 'Error al obtener totales del dashboard' });
  }
});

app.get('/api/dashboard/ultimos-documentos', authenticateToken, async (_req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT d.id, d.nombre, d.tipo, d.tamaño, d.seccion, d.fecha_carga, d.url,
              e.id AS expediente_id, e.numero AS expediente_numero, e.titulo AS expediente_titulo
       FROM documentos d
       INNER JOIN expedientes e ON e.id = d.expediente_id
       ORDER BY d.fecha_carga DESC
       LIMIT 5`
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching latest documentos:', error);
    return res.status(500).json({ error: 'Error al obtener últimos documentos' });
  }
});

app.get('/api/reportes/dashboard', authenticateToken, async (_req: AuthRequest, res: Response) => {
  try {
    const [expedientes]: any = await pool.query('SELECT COUNT(*) AS total FROM expedientes');
    const [expedientesActivos]: any = await pool.query('SELECT COUNT(*) AS total FROM expedientes WHERE estado = "activo"');
    const [documentos]: any = await pool.query('SELECT COUNT(*) AS total FROM documentos');
    const [usuarios]: any = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE estado = 'activo'");

    return res.json({
      totalExpedientes: expedientes[0].total,
      expedientesActivos: expedientesActivos[0].total,
      documentosCargados: documentos[0].total,
      usuariosActivos: usuarios[0].total,
    });
  } catch (error) {
    console.error('Error fetching report dashboard:', error);
    return res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Archivo excede el tamaño máximo de 50MB' });
    }

    return res.status(400).json({ error: err.message });
  }

  if (err?.message === 'Tipo de archivo no permitido') {
    return res.status(400).json({ error: err.message });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});

export default app;
