-- Заполняет значениями таблицу категорий
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо'),
('Здоровье'),
('Наука'),
('Спорт'),
('Кулинария');

-- Заполняет значениями таблицу пользователей
INSERT INTO users(email, password_hash, first_name, last_name, avatar, is_admin) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar-1.png', true),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar-2.png', false),
('sidorov@example.com', '5f4fcc3b5aa56fd61j832ud6be82cf99', 'Сидор', 'Сидоров', 'avatar-3.png', false);

-- Заполняет значениями таблицу публикаций
INSERT INTO articles(created_at, title, announce, full_text, author_id, picture) VALUES
('2021-12-22T21:49:46.050Z', 'Суши-запеканка и рамен-лазанья', 'Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ.', 'Санкции к иранцу обсуждаются руководством клуба. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.', 1, 'skyscraper@1x.jpg'),
('2022-02-07T22:44:46.051Z', 'Что такое золотое сечение', 'Достичь успеха помогут ежедневные повторения.', 'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Запекайте в духовке 30 минут или пока помидоры черри не станут мягкими и не лопнут. Из под его пера вышло 8 платиновых альбомов. Образец весом 60 килограммов уже прошел испытания на полигоне, и сейчас идет создание более крупномасштабного аппарата.', 1, 'forest@1x.jpg'),
('2021-11-27T08:37:46.051Z', 'Борьба с прокрастинацией', 'Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.', 'Продукты, богатые антиоксидантами, противовоспалительными компонентами, функциональные продукты также положительно влияют на лёгкие. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов.', 1, 'sea@1x.jpg');

-- Заполняет значениями таблицу сочетаний публикация-категория
INSERT INTO articles_categories(article_id, category_id) VALUES
(1, 13),
(2, 7),
(2, 10),
(2, 8),
(2, 13),
(3, 7),
(3, 13),
(3, 8);

-- Заполняет значениями таблицу комментариев
INSERT INTO comments(text, article_id, user_id, created_at) VALUES
('Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 1, 3, '2021-12-26T15:02:46.051Z'),
('Совсем немного... Мне кажется или я уже читал это где-то?', 1, 1, '2022-01-05T11:54:46.051Z'),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Это где ж такие красоты?', 1, 3, '2022-01-14T15:20:46.051Z'),
('Планируете записать видосик на эту тему? Это где ж такие красоты?', 1, 2, '2022-01-10T20:44:46.051Z'),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 1, 2, '2022-01-28T02:24:46.051Z'),
('Согласен с автором! Это где ж такие красоты?', 2, 1, '2022-02-19T09:01:46.051Z'),
('Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 2, 2, '2022-02-14T20:41:46.051Z'),
('Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?', 2, 1, '2022-02-17T20:18:46.052Z'),
('Согласен с автором! Это где ж такие красоты?', 2, 2, '2022-02-22T09:19:46.052Z'),
('Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?', 2, 1, '2022-02-17T01:37:46.052Z'),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)', 3, 3, '2022-02-11T09:50:46.052Z'),
('Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 3, 3, '2021-12-04T18:54:46.052Z'),
('Хочу такую же футболку :-) Плюсую, но слишком много буквы!', 3, 2, '2022-02-15T09:10:46.052Z'),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 3, 2, '2022-02-22T00:43:46.052Z'),
('Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!', 3, 2, '2021-12-03T11:30:46.052Z'),
('Это где ж такие красоты?', 3, 3, '2022-01-30T12:33:46.052Z'),
('Хочу такую же футболку :-) Это где ж такие красоты? Совсем немного...', 3, 2, '2021-12-05T12:49:46.052Z');