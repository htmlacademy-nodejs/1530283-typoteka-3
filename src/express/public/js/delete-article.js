(() => {
  const NO_CONTENT_STATUS_CODE = 204;
  const DELETE_METHOD = `DELETE`;

  const getApiEndpoint = (id) => `/my/articles/${id}`;

  const commentsListNode = document.querySelector(`.notes__list`);

  const createErrorNode = () => {
    const errorNode = document.createElement("p");

    errorNode.style.color = "red";

    errorNode.textContent = "Произошла ошибка! Не удалось удалить статью =(";

    return errorNode;
  };

  commentsListNode.addEventListener("click", async (evt) => {
    const deleteButtonNode = evt.target.closest(`.button[data-delete]`);

    if (!deleteButtonNode || !evt.currentTarget.contains(deleteButtonNode)) {
      return;
    }

    evt.preventDefault();

    deleteButtonNode.disabled = true;

    const articleItemNode = deleteButtonNode.closest(`.notes__list-item`);

    const { articleId } = deleteButtonNode.dataset;
    const apiEndpoint = getApiEndpoint(articleId);

    try {
      const response = await fetch(apiEndpoint, {
        method: DELETE_METHOD,
      });

      if (response.status !== NO_CONTENT_STATUS_CODE) {
        throw new Error("Unable to delete article");
      }

      articleItemNode.remove();
    } catch (error) {
      articleItemNode.append(createErrorNode(error));
    }

    deleteButtonNode.disabled = false;
  });
})();
