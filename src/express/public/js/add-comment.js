(() => {
  const POST_METHOD = `POST`;
  const HttpStatusCode = {
    CREATED: 201,
    BAD_REQUEST: 400
  };
  const AVATAR_PLACEHOLDER = `icons/smile.svg`;
  const NOT_EMPTY_TITLE = `Комментарии`;

  const commentsSectionNode = document.querySelector(`#comments`);
  const commentsTitle = commentsSectionNode.querySelector(`.comments__title`);
  const formNode = commentsSectionNode.querySelector(`form`);
  const errorNode = commentsSectionNode.querySelector(`.comments__error`);

  const createCommentsListNode = () => {
    const listNode = document.createElement(`ul`);

    listNode.classList.add(`comments__list`);

    return listNode;
  }

  const createCommentItemNode = ({ createdAt, text, author }) => {
    const commentItemNode = document.createElement(`li`);

    commentItemNode.classList.add(`comments__comment`);

    commentItemNode.innerHTML = `
    <div class="comments__avatar avatar">
    <img src="" alt="аватар пользователя" />
    </div>
    <div class="comments__text">
      <div class="comments__head">
      <p>Author Name</p>
      <time class="comments__date" datetime="">Time</time>
      </div>
      <p class="comments__message">Text</p>
      </div>
      `;

      const avatarNode = commentItemNode.querySelector(`img`);
      const authorNameNode = commentItemNode.querySelector(`.comments__head p`);
      const dateNode = commentItemNode.querySelector(`.comments__date`);
      const textNode = commentItemNode.querySelector(`.comments__message`);

      avatarNode.src = `/img/${author.avatar || AVATAR_PLACEHOLDER}`;
      authorNameNode.textContent = `${author.firstName} ${author.lastName} •`;
      dateNode.dateTime = createdAt;
      dateNode.textContent = dayjs(createdAt).format(`DD.MM.YYYY, HH:mm`);
      textNode.textContent = text;

      return commentItemNode;
    };

  const apiEndpoint = formNode.action;

  const textAreaNode = formNode.querySelector(`textarea`);
  const submitButtonNode = formNode.querySelector(`.button[type="submit"]`);

  let commentsListNode = commentsSectionNode.querySelector(`.comments__list`);

  formNode.addEventListener(`submit`, async (evt) => {
    evt.preventDefault();

    const formData = new FormData(formNode);

    textAreaNode.disabled = true;
    submitButtonNode.disabled = true;
    errorNode.textContent = ``;

    try {
      const response = await fetch(apiEndpoint, {
        method: POST_METHOD,
        body: formData,
      });

      if (response.status === HttpStatusCode.BAD_REQUEST) {
        const errorMessage = (await response.json()).text;

        if (errorMessage) {
          throw new Error(errorMessage);
        }
      }

      if (response.status !== HttpStatusCode.CREATED) {
        throw new Error(`Произошла ошибка! Не удалось отправить комментарий =(`);
      }

      const createdComment = await response.json();

      const commentItemNode = createCommentItemNode(createdComment);

      if (!commentsListNode) {
        commentsTitle.textContent = NOT_EMPTY_TITLE;
        commentsListNode = createCommentsListNode();
        commentsTitle.after(commentsListNode);
      }

      commentsListNode.prepend(commentItemNode);

      commentsSectionNode.scrollIntoView();
      formNode.reset();
    } catch (error) {
      errorNode.textContent = error.message;
    }

    textAreaNode.disabled = false;
    submitButtonNode.disabled = false;
  });
})();
