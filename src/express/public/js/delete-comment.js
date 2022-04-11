(() => {
  const NO_CONTENT_STATUS_CODE = 204;
  const DELETE_METHOD = `DELETE`;
  const CSRF_TOKEN_NAME = `_csrf`;

  const getApiEndpoint = (id) => `/my/comments/${id}`;

  const commentsListNode = document.querySelector(`.publication__list`);
  const csrfToken = document.querySelector(`meta[name='csrf-token']`).content;

  commentsListNode.addEventListener("click", async (evt) => {
    const deleteButtonNode = evt.target.closest(`.button[data-delete]`);

    if (!deleteButtonNode || !evt.currentTarget.contains(deleteButtonNode)) {
      return;
    }

    evt.preventDefault();

    const commentItemNode = deleteButtonNode.closest(`.publication__list-item`);
    const errorNode = commentItemNode.querySelector(`.publication__error`);

    errorNode.textContent = ``;
    deleteButtonNode.disabled = true;

    const { commentId } = deleteButtonNode.dataset;
    const apiEndpoint = getApiEndpoint(commentId);

    const formData = new FormData();
    formData.append(CSRF_TOKEN_NAME, csrfToken);

    const formBody = new URLSearchParams(formData);

    try {
      const response = await fetch(apiEndpoint, {
        method: DELETE_METHOD,
        body: formBody,
      });

      if (response.status !== NO_CONTENT_STATUS_CODE) {
        throw new Error(`Не удалось удалить комментарий`);
      }

      commentItemNode.remove();

      const isListEmpty = !commentsListNode.querySelectorAll(`.publication__list-item`).length;

      if (isListEmpty) {
        window.location.reload();
        return;
      }
    } catch (error) {
      errorNode.textContent = error.message;
    }

    deleteButtonNode.disabled = false;
  });
})();
