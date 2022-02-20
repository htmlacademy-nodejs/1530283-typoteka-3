CREATE TABLE categories(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(30) UNIQUE NOT NULL
);
CREATE TABLE users(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  hash_password varchar(255) NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  avatar varchar(50)
);
CREATE TABLE articles(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date timestamp DEFAULT current_timestamp,
  title varchar(250) NOT NULL,
  announce varchar(250) NOT NULL,
  full_text varchar(100),
  image varchar(50)
);
CREATE TABLE comments(
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date timestamp DEFAULT current_timestamp,
  text varchar(250),
  user_id bigint NOT NULL,
  article_id bigint NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE articles_categories(
  article_id bigint NOT NULL,
  category_id bigint NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE INDEX ON articles(title);
