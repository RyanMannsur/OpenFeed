-- Schema OpenFeed
-- Nota: O banco de dados deve ser criado previamente no provedor (ex: PlanetScale, Aiven).
-- Localmente, o docker-compose já cria o banco via variável MYSQL_DATABASE.
-- Este script usa IF NOT EXISTS em todas as tabelas, sendo seguro para re-execuções.

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `nome`           VARCHAR(255) NOT NULL,
  `email`          VARCHAR(255) NOT NULL UNIQUE,
  `senha`          VARCHAR(255) NOT NULL,
  `bio`            TEXT NULL,
  `avatar_url`     VARCHAR(255) NULL,
  `media_nota`     DECIMAL(3,2) DEFAULT 0.00,
  `nota`           DECIMAL(3,2) DEFAULT 0.00,
  `criado_em`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `artigos` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `titulo`         VARCHAR(255) NOT NULL,
  `conteudo`       TEXT NOT NULL,
  `resumo`         VARCHAR(500) NULL,
  `categoria`      VARCHAR(100) NOT NULL,
  `media_notas`    DECIMAL(3,2) DEFAULT 0.00,
  `nota`           DECIMAL(3,2) DEFAULT 0.00,
  `image_url`      VARCHAR(255) NULL,
  `autor_id`       INT NOT NULL,
  `criado_em`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  INDEX `idx_artigos_categoria` (`categoria`),
  INDEX `idx_artigos_criado_em` (`criado_em`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notas` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id`     INT NOT NULL,
  `artigo_id`      INT NOT NULL,
  `valor`          DECIMAL(3,2) NOT NULL,
  `criado_em`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_usuario_artigo` (`usuario_id`, `artigo_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`artigo_id`)  REFERENCES `artigos`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agendador_notas` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `nota_id`        INT NOT NULL,
  `artigo_id`      INT NOT NULL,
  `processado`     TINYINT(1) DEFAULT 0,
  `criado_em`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `processado_em`  TIMESTAMP NULL,
  FOREIGN KEY (`nota_id`)   REFERENCES `notas`   (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`artigo_id`) REFERENCES `artigos`  (`id`) ON DELETE CASCADE,
  INDEX `idx_agendador_processado` (`processado`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usuário admin inicial (seguro para re-execução)
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `bio`, `avatar_url`)
VALUES (1, 'Admin OpenFeed', 'admin@openfeed.com', '$2a$10$wK1F5Nq0Psh9RphwP3C7UeCenR1KzK6rBexsU07Fw9r6g4Vv9w3O.', 'Administrador da plataforma OpenFeed.', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200')
ON DUPLICATE KEY UPDATE `nome`=`nome`;

-- Artigo de boas-vindas inicial
INSERT INTO `artigos` (`id`, `titulo`, `conteudo`, `resumo`, `categoria`, `media_notas`, `image_url`, `autor_id`)
VALUES (1, 'Bem-vindo ao OpenFeed', 'Este é o primeiro artigo oficial do OpenFeed. Explore a plataforma e crie o seu primeiro post!', 'Saiba mais sobre a nossa plataforma de compartilhamento de artigos.', 'Geral', 5.00, 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', 1)
ON DUPLICATE KEY UPDATE `titulo`=`titulo`;
