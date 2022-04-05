-- Удаляет все существующие таблицы при их наличии
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS articles_categories CASCADE;

-- Создает таблицу категорий
CREATE TABLE categories(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(30) UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

-- Создает таблицу пользователей
CREATE TABLE users(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  avatar varchar(50),
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

-- Создает таблицу публикаций
CREATE TABLE articles(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(250) NOT NULL,
  announce varchar(250) NOT NULL,
  full_text varchar(1000),
  picture varchar(50),
  author_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- Создает таблицу сочетаний публикация-категория
CREATE TABLE articles_categories(
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  article_id bigint NOT NULL,
  category_id bigint NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Создает таблицу комментариев
CREATE TABLE comments(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text varchar(255),
  author_id bigint NOT NULL,
  article_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- Создает индекс по заголовкам публикаций
CREATE INDEX ON articles(title);
