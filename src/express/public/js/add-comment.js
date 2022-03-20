"use strict";

(() => {
  const POST_METHOD = `POST`;
  const CREATED_STATUS_CODE = 201;

  const commentsSectionNode = document.querySelector(`#comments`);
  const commentsListNode = commentsSectionNode.querySelector(`.comments__list`);
  const formNode = commentsSectionNode.querySelector(`form`);
  const errorNode = commentsSectionNode.querySelector(`.comments__error`);

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

    avatarNode.src = `/img/${author.avatar}`;
    authorNameNode.textContent = `${author.firstName} ${author.lastName} •`;
    dateNode.dateTime = createdAt;
    dateNode.textContent = dayjs(createdAt).format(`DD.MM.YYYY, HH:mm`);
    textNode.textContent = text;

    return commentItemNode;
  };

  const apiEndpoint = formNode.action;

  const textAreaNode = formNode.querySelector(`textarea`);
  const submitButtonNode = formNode.querySelector(`.button[type="submit"]`);

  formNode.addEventListener(`submit`, async (evt) => {
    evt.preventDefault();

    const formData = new FormData(formNode);

    textAreaNode.disabled = true;
    submitButtonNode.disabled = true;

    try {
      const response = await fetch(apiEndpoint, {
        method: POST_METHOD,
        body: formData,
      });

      if (response.status !== CREATED_STATUS_CODE) {
        throw new Error(`Comment creation failed`);
      }

      const createdComment = await response.json();

      const commentItemNode = createCommentItemNode(createdComment);

      commentsListNode.prepend(commentItemNode);

      commentsSectionNode.scrollIntoView();
      formNode.reset();

      errorNode.textContent = ``;
    } catch (error) {
      errorNode.textContent = `Произошла ошибка! Не удалось отправить комментарий =(`;
    }

    textAreaNode.disabled = false;
    submitButtonNode.disabled = false;
  });
})();
