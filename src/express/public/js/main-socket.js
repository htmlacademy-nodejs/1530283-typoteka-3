(() => {
  const SOCKET_URL = `http://localhost:3000`;

  const EMPTY_CONTENT = `Здесь пока ничего нет...`;

  const AVATAR_PLACEHOLDER = `icons/smile.svg`;

  const Section = {
    HOT: 'hot',
    LAST: 'last',
  };

  const SocketEvent = {
    HOT_ARTICLES_UPDATE: `hot-articles:update`,
    LAST_COMMENTS_UPDATE: `last-comments:update`,
  };

  const querySectionNode = (type) => document.querySelector(`.${type}`);

  const clearSectionNode = (section, type) => {
    const sectionListNode = section.querySelector(`.${type}__list`);
    const sectionEmptyNode = section.querySelector(`.${type}__empty`);

    if (sectionListNode) {
      sectionListNode.remove();
    }

    if (sectionEmptyNode) {
      sectionEmptyNode.remove();
    }
  };

  const createSectionListNode = (type) => {
    const list = document.createElement(`ul`);

    list.classList.add(`${type}__list`);

    return list;
  };

  const createSectionEmptyNode = (type) => {
    const emptyNode = document.createElement(`p`);

    emptyNode.classList.add(`${type}__list`);

    emptyNode.textContent = EMPTY_CONTENT;

    return emptyNode;
  };

  const createLastCommentNode = (comment) => {
    const commentNode = document.createElement(`li`);

    commentNode.classList.add(`last__list-item`);

    commentNode.innerHTML = `
      <img src="" alt="аватар пользователя">
      <b class="last__list-name"></b>
      <a class="last__list-link" href=""></a>
    `;

    const avatarNode = commentNode.querySelector(`img`);
    const userNameNode = commentNode.querySelector(`.last__list-name`);
    const linkNode = commentNode.querySelector(`.last__list-link`);

    avatarNode.src = `/img/${comment.author.avatar || AVATAR_PLACEHOLDER}`;
    userNameNode.textContent = `${comment.author.firstName} ${comment.author.lastName}`;
    linkNode.textContent = comment.text;
    linkNode.href = `/articles/${comment.articleId}#comments`;

    return commentNode;
  };

  const createHotArticleNode = (article) => {
    const articleNode = document.createElement(`li`);

    articleNode.classList.add(`hot__list-item`);

    articleNode.innerHTML = `
      <a class="hot__list-link" href=""><sup class="hot__link-sup"></sup></a>
    `;

    const linkNode = articleNode.querySelector(`.hot__list-link`);
    const commentsCountNode = articleNode.querySelector(`.hot__link-sup`);
    const textNode = document.createTextNode(article.announce);

    linkNode.href = `/articles/${article.id}`;
    commentsCountNode.textContent = article.commentsCount;
    linkNode.prepend(textNode);

    return articleNode;
  }

  const ListItemNodeConstructor = {
    [Section.HOT]: createHotArticleNode,
    [Section.LAST]: createLastCommentNode,
  };

  const updateSection = (items, type) => {
    const sectionNode = querySectionNode(type);

    if (!sectionNode) {
      return;
    }

    clearSectionNode(sectionNode, type);

    if (!items.length) {
      const emptyNode = createSectionEmptyNode(type);
      sectionNode.append(emptyNode);
      return;
    }

    const listNode = createSectionListNode(type);

    const itemNodes = items.map((item) =>
      ListItemNodeConstructor[type](item)
    );

    listNode.append(...itemNodes);

    sectionNode.append(listNode);
  }

  const socket = io(SOCKET_URL);

  socket.on(`connect`, () => {
    console.log(`Socket connected successfully`);
  })

  socket.on(SocketEvent.LAST_COMMENTS_UPDATE, (lastComments = []) => {
    console.log(`${SocketEvent.LAST_COMMENTS_UPDATE}, `, lastComments);
    updateSection(lastComments, Section.LAST);
  });

  socket.on(SocketEvent.HOT_ARTICLES_UPDATE, (hotArticles = []) => {
    console.log(`${SocketEvent.HOT_ARTICLES_UPDATE}, `, hotArticles);
    updateSection(hotArticles, Section.HOT);
  });
})();
