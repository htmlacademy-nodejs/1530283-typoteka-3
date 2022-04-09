(() => {
  const NO_CONTENT_STATUS_CODE = 204;
  const DELETE_METHOD = `DELETE`;
  const CSRF_TOKEN_NAME = `_csrf`;

  const getApiEndpoint = (id) => `/my/articles/${id}`;

  const articlesListNode = document.querySelector(`.notes__list`);
  const csrfToken = document.querySelector(`meta[name='csrf-token']`).content;

  articlesListNode.addEventListener("click", async (evt) => {
    const deleteButtonNode = evt.target.closest(`.button[data-delete]`);

    if (!deleteButtonNode || !evt.currentTarget.contains(deleteButtonNode)) {
      return;
    }

    evt.preventDefault();

    deleteButtonNode.disabled = true;

    const articleItemNode = deleteButtonNode.closest(`.notes__list-item`);
    const errorNode = articleItemNode.querySelector(`.notes__error`);

    const { articleId } = deleteButtonNode.dataset;
    const apiEndpoint = getApiEndpoint(articleId);

    errorNode.textContent = ``;

    const formData = new FormData();
    formData.append(CSRF_TOKEN_NAME, csrfToken);

    try {
      const response = await fetch(apiEndpoint, {
        method: DELETE_METHOD,
        body: formData,
      });

      if (response.status !== NO_CONTENT_STATUS_CODE) {
        throw new Error("Не удалось удалить публикацию");
      }

      articleItemNode.remove();

      const isListEmpty = !articlesListNode.querySelectorAll(`.notes__list-item`).length;

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
