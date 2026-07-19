-- FUSEMINT SGD - Database Schema

CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'usuario',
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_by INT NULL,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
);

CREATE TABLE IF NOT EXISTS grupos_documentales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tipos_operacion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tipos_cliente (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tipos_documentales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS secciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  identificacion VARCHAR(50) UNIQUE NOT NULL,
  tipo_cliente_id INT NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(30),
  direccion VARCHAR(255),
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (tipo_cliente_id) REFERENCES tipos_cliente(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_cliente_tipo (tipo_cliente_id)
);

CREATE TABLE IF NOT EXISTS expedientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  grupo_documental_id INT NULL,
  tipo_operacion_id INT NULL,
  tipo_cliente_id INT NULL,
  seccion_id INT NULL,
  cliente_id INT NULL,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_by INT NULL,
  FOREIGN KEY (grupo_documental_id) REFERENCES grupos_documentales(id),
  FOREIGN KEY (tipo_operacion_id) REFERENCES tipos_operacion(id),
  FOREIGN KEY (tipo_cliente_id) REFERENCES tipos_cliente(id),
  FOREIGN KEY (seccion_id) REFERENCES secciones(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_numero (numero),
  INDEX idx_estado (estado)
);

CREATE TABLE IF NOT EXISTS expediente_secciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expediente_id INT NOT NULL,
  seccion_id INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_expediente_seccion (expediente_id, seccion_id),
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (seccion_id) REFERENCES secciones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expediente_id INT NOT NULL,
  tipo_documental_id INT NULL,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50),
  tamaño BIGINT,
  url VARCHAR(500) NOT NULL,
  descripcion TEXT,
  seccion VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT NULL,
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (tipo_documental_id) REFERENCES tipos_documentales(id),
  FOREIGN KEY (uploaded_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_expediente (expediente_id)
);

CREATE TABLE IF NOT EXISTS permisos_expediente (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  expediente_id INT NOT NULL,
  puede_ver TINYINT(1) DEFAULT 1,
  puede_crear TINYINT(1) DEFAULT 0,
  puede_editar TINYINT(1) DEFAULT 0,
  puede_eliminar TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_by INT NULL,
  UNIQUE KEY uq_permiso_usuario_expediente (usuario_id, expediente_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS operaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  tipo_operacion_id INT NOT NULL,
  expediente_id INT NOT NULL,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  FOREIGN KEY (tipo_operacion_id) REFERENCES tipos_operacion(id),
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS auditoria (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tabla VARCHAR(100),
  operacion VARCHAR(20),
  registro_id INT,
  usuario_id INT,
  datos_anteriores JSON,
  datos_nuevos JSON,
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
