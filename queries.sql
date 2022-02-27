-- Получить список всех категорий (идентификатор, наименование категории)
SELECT
  categories.id,
  categories.name
FROM categories;


-- Получить список категорий, для которых создана минимум одна публикация (идентификатор, наименование категории)
SELECT
  categories.id,
  categories.name
FROM categories
  JOIN articles_categories
    ON categories.id = articles_categories.category_id
GROUP BY categories.id;


-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории)
SELECT
  categories.id,
  categories.name,
  COUNT(articles_categories.article_id) AS articles_count
FROM categories
  LEFT JOIN articles_categories
    ON categories.id = articles_categories.category_id
GROUP BY categories.id;


-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации.
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.created_at,
  users.first_name AS author_first_name,
  users.last_name  AS author_last_name,
  users.email AS contact_email,
  COUNT(DISTINCT comments.id) AS comments_count,
  ARRAY_AGG(DISTINCT categories.name) AS categories
FROM articles
  JOIN users
    ON articles.author_id = users.id
  LEFT JOIN comments
    ON articles.id = comments.article_id
  JOIN articles_categories
    ON articles.id = articles_categories.article_id
  JOIN categories
    ON articles_categories.category_id = categories.id
GROUP BY articles.id, users.id
ORDER BY articles.created_at DESC;


-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий)
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.full_text,
  articles.created_at,
  articles.picture,
  users.first_name AS author_first_name,
  users.last_name  AS author_last_name,
  users.email AS contact_email,
  COUNT(DISTINCT comments.id) AS comments_count,
  ARRAY_AGG(DISTINCT categories.name) AS categories
FROM articles
  JOIN users
    ON articles.author_id = users.id
  LEFT JOIN comments
    ON articles.id = comments.article_id
  JOIN articles_categories
    ON articles.id = articles_categories.article_id
  JOIN categories
    ON articles_categories.category_id = categories.id
WHERE articles.id = 1
GROUP BY articles.id, users.id;


-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария)
SELECT
  comments.id,
  comments.article_id,
  users.first_name AS author_first_name,
  users.last_name AS author_last_name,
  comments.text
FROM comments
  JOIN users
    ON comments.user_id = users.id
ORDER BY comments.created_at DESC
LIMIT 5;


-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии.
SELECT
  comments.id,
  comments.article_id,
  users.first_name AS author_first_name,
  users.last_name AS author_last_name,
  comments.text
FROM comments
  JOIN users
    ON comments.user_id = users.id
WHERE article_id = 1
ORDER BY comments.created_at DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»
UPDATE articles
  SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
