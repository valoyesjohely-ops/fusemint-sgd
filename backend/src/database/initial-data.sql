-- Initial data for FUSEMINT SGD

INSERT IGNORE INTO roles (id, nombre, descripcion) VALUES
(1, 'admin', 'Administrador del sistema'),
(2, 'usuario', 'Usuario normal');

INSERT IGNORE INTO usuarios (id, nombre, email, password, rol, estado) VALUES
(1, 'Administrador', 'admin@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'admin', 'activo'),
(2, 'Usuario Base', 'usuario@fusemint.org', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tv.', 'usuario', 'activo');

INSERT IGNORE INTO grupos_documentales (id, nombre, descripcion, created_by) VALUES
(1, 'Información General', 'Documentación institucional general', 1),
(2, 'Operaciones Celebradas', 'Proyectos, convenios y contratos', 1),
(3, 'Servicios Contables', 'Información de servicios contables', 1);

INSERT IGNORE INTO tipos_operacion (id, nombre, descripcion, created_by) VALUES
(1, 'Proyecto', 'Operaciones de tipo proyecto', 1),
(2, 'Convenio', 'Operaciones de tipo convenio', 1),
(3, 'Contrato', 'Operaciones de tipo contrato', 1);

INSERT IGNORE INTO tipos_cliente (id, nombre, descripcion, created_by) VALUES
(1, 'Persona Jurídica', 'Cliente tipo persona jurídica', 1),
(2, 'Persona Natural', 'Cliente tipo persona natural', 1);

INSERT IGNORE INTO tipos_documentales (id, nombre, descripcion, created_by) VALUES
(1, 'Contrato', 'Documento contractual', 1),
(2, 'Acta', 'Documento de acta', 1),
(3, 'Informe', 'Documento de informe', 1),
(4, 'Certificado', 'Documento de certificación', 1),
(5, 'Resolución', 'Documento de resolución', 1),
(6, 'Plano', 'Documento técnico tipo plano', 1),
(7, 'Oficio', 'Documento tipo oficio', 1);

INSERT IGNORE INTO secciones (id, nombre, descripcion, created_by) VALUES
(1, 'Información General', 'Documentación general', 1),
(2, 'Técnica', 'Documentación técnica', 1),
(3, 'Financiera', 'Documentación financiera', 1),
(4, 'Legal', 'Documentación legal', 1);
