-- FUSEMINT SGD - Database Schema
-- Sistema de Gestión Documental

CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grupos_documentales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_operacion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_cliente (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_documentales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'usuario',
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
);

CREATE TABLE IF NOT EXISTS secciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS expedientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  tipo_expediente ENUM('informacion_general', 'operacion', 'cliente') NOT NULL DEFAULT 'informacion_general',
  grupo_documental_id INT,
  descripcion TEXT,
  seccion_id INT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  INDEX idx_numero (numero),
  INDEX idx_estado (estado),
  FOREIGN KEY (seccion_id) REFERENCES secciones(id),
  FOREIGN KEY (grupo_documental_id) REFERENCES grupos_documentales(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS documentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expediente_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50),
  tamaño INT,
  url VARCHAR(500),
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT,
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES usuarios(id),
  INDEX idx_expediente (expediente_id)
);

CREATE TABLE IF NOT EXISTS operaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expediente_id INT NOT NULL UNIQUE,
  tipo_operacion_id INT NOT NULL,
  cliente_entidad VARCHAR(255),
  fecha_inicio DATE,
  fecha_finalizacion DATE,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (tipo_operacion_id) REFERENCES tipos_operacion(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expediente_id INT NOT NULL UNIQUE,
  tipo_cliente_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  identificacion VARCHAR(50) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(255),
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (tipo_cliente_id) REFERENCES tipos_cliente(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS expediente_secciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expediente_id INT NOT NULL,
  seccion_id INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expediente_id) REFERENCES expedientes(id) ON DELETE CASCADE,
  FOREIGN KEY (seccion_id) REFERENCES secciones(id),
  UNIQUE KEY unique_exp_seccion (expediente_id, seccion_id)
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
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);