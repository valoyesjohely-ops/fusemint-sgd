-- Initial data for FUSEMINT SGD

INSERT IGNORE INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema'),
('usuario', 'Usuario del sistema');

INSERT IGNORE INTO grupos_documentales (nombre, descripcion) VALUES
('Información General', 'Documentación institucional no asociada a clientes'),
('Operaciones Celebradas', 'Proyectos, convenios y contratos'),
('Servicios Contables', 'Documentación de servicios a personas jurídicas y naturales');

INSERT IGNORE INTO tipos_operacion (nombre, descripcion) VALUES
('Proyecto', 'Operación clasificada como proyecto'),
('Convenio', 'Operación clasificada como convenio'),
('Contrato', 'Operación clasificada como contrato');

INSERT IGNORE INTO tipos_cliente (nombre, descripcion) VALUES
('Persona Jurídica', 'Cliente corporativo o entidad legal'),
('Persona Natural', 'Cliente individual');

INSERT IGNORE INTO tipos_documentales (nombre, descripcion) VALUES
('Contrato', 'Documento contractual'),
('Acta', 'Acta de reunión o comité'),
('Informe', 'Documento de informe'),
('Certificado', 'Documento de certificación'),
('Resolución', 'Documento resolutivo'),
('Plano', 'Plano o esquema técnico'),
('Oficio', 'Documento oficial');

INSERT IGNORE INTO usuarios (username, nombre, email, password, rol) VALUES
('admin', 'Administrador', 'admin@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'admin'),
('usuario', 'Usuario Base', 'usuario@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'usuario');

INSERT IGNORE INTO secciones (nombre, descripcion, created_by) VALUES
('Información General', 'Documentos institucionales generales', 1),
('Operaciones Celebradas', 'Proyectos, convenios y contratos', 1),
('Servicios Contables', 'Gestión contable y financiera', 1),
('Técnica', 'Sección técnica de operaciones', 1),
('Financiera', 'Sección financiera de operaciones', 1),
('Legal', 'Sección legal de operaciones', 1);