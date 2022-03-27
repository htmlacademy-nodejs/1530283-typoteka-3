(() => {
  const NO_CONTENT_STATUS_CODE = 204;
  const DELETE_METHOD = `DELETE`;

  const getApiEndpoint = (id) => `/my/comments/${id}`;

  const commentsListNode = document.querySelector(`.publication__list`);

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

    try {
      const response = await fetch(apiEndpoint, {
        method: DELETE_METHOD,
      });

      if (response.status !== NO_CONTENT_STATUS_CODE) {
        throw new Error(`Не удалось удалить комментарий`);
      }

      commentItemNode.remove();
    } catch (error) {
      errorNode.textContent = error.message;
    }

    deleteButtonNode.disabled = false;
  });
})();
