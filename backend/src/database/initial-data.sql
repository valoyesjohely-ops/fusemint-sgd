-- Initial data for FUSEMINT SGD

INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema'),
('usuario', 'Usuario normal'),
('gestor', 'Gestor de documentos');

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'admin'),
('Juan Pérez', 'juan@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'gestor'),
('María García', 'maria@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'usuario');

INSERT INTO secciones (nombre, descripcion, created_by) VALUES
('Información General', 'Documentos institucionales generales', 1),
('Operaciones Celebradas', 'Proyectos, convenios y contratos', 1),
('Servicios Contables', 'Gestión contable y financiera', 1);