"use strict";

(() => {
  const NO_CONTENT_STATUS_CODE = 204;
  const DELETE_METHOD = `DELETE`;

  const getApiEndpoint = (id) => `/my/comments/${id}`;

  const commentsListNode = document.querySelector(`.publication__list`);

  const createErrorNode = () => {
    const errorNode = document.createElement("p");

    errorNode.style.color = "red";

    errorNode.textContent =
      "Произошла ошибка! Не удалось удалить комментарий =(";

    return errorNode;
  };

  commentsListNode.addEventListener("click", async (evt) => {
    const deleteButtonNode = evt.target.closest(`.button[data-delete]`);

    if (!deleteButtonNode || !evt.currentTarget.contains(deleteButtonNode)) {
      return;
    }

    evt.preventDefault();

    deleteButtonNode.disabled = true;

    const commentItemNode = deleteButtonNode.closest(`.publication__list-item`);

    const { commentId } = deleteButtonNode.dataset;
    const apiEndpoint = getApiEndpoint(commentId);

    try {
      const response = await fetch(apiEndpoint, {
        method: DELETE_METHOD,
      });

      if (response.status !== NO_CONTENT_STATUS_CODE) {
        throw new Error("Unable to delete comment");
      }

      commentItemNode.remove();
    } catch (error) {
      commentItemNode.append(createErrorNode(error));
    }

    deleteButtonNode.disabled = false;
  });
})();
