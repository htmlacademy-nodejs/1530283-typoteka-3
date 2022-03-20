(() => {
  const HttpMethod = {
    PUT: `PUT`,
    DELETE: `DELETE`,
  };

  const HttpSuccessCode = {
    OK: 200,
    NO_CONTENT: 204,
  };

  const getApiEndpoint = (id) => `/my/categories/${id}`;

  const categoriesListNode = document.querySelector(`.category__list`);

  const createErrorNode = () => {
    const errorNode = document.createElement(`p`);

    errorNode.classList.add(`category-item-error`);

    errorNode.style.color = `red`;
    errorNode.style.position = `absolute`;
    errorNode.style.bottom = `-20px`;
    errorNode.style.left = `40px`;
    errorNode.style.right = `0`;

    return errorNode;
  };

  categoriesListNode.addEventListener(`submit`, async (evt) => {
    const updateFormNode = evt.target.closest(`form`);

    if (!updateFormNode || !evt.currentTarget.contains(updateFormNode)) {
      return;
    }

    evt.preventDefault();

    const categoryItemNode = updateFormNode.closest(`.category__list-item`);

    let errorNode = document.querySelector(`.category-item-error`);

    if (!errorNode) {
      errorNode = createErrorNode();
      categoryItemNode.append(errorNode);
    }

    const inputNode = updateFormNode.querySelector(`input[name='name']`);
    const submitButtonNode = updateFormNode.querySelector(
      `button[type='submit']`
    );

    const formData = new FormData(updateFormNode);

    inputNode.disabled = true;
    submitButtonNode.disabled = true;

    const apiEndpoint = getApiEndpoint(updateFormNode.dataset.categoryId);

    try {
      const response = await fetch(apiEndpoint, {
        method: HttpMethod.PUT,
        body: formData,
      });

      if (response.status !== HttpSuccessCode.OK) {
        throw new Error(`Category update failed`);
      }

      errorNode.textContent = ``;
    } catch (error) {
      errorNode.textContent = `Произошла ошибка! Не удалось сохранить изменения =(`;
    }

    inputNode.disabled = false;
    submitButtonNode.disabled = false;
  });

  categoriesListNode.addEventListener(`click`, async (evt) => {
    const deleteButtonNode = evt.target.closest(`.button[data-delete]`);

    if (!deleteButtonNode || !evt.currentTarget.contains(deleteButtonNode)) {
      return;
    }

    const categoryItemNode = deleteButtonNode.closest(`.category__list-item`);

    let errorNode = document.querySelector(`.category-item-error`);

    if (!errorNode) {
      errorNode = createErrorNode();
      categoryItemNode.append(errorNode);
    }

    deleteButtonNode.disabled = true;

    const apiEndpoint = getApiEndpoint(deleteButtonNode.dataset.categoryId);

    try {
      const response = await fetch(apiEndpoint, {
        method: HttpMethod.DELETE,
      });

      if (response.status !== HttpSuccessCode.NO_CONTENT) {
        throw new Error(`Category deletion failed`);
      }

      categoryItemNode.remove();
    } catch (error) {
      errorNode.textContent = `Произошла ошибка! Не удалось удалить категорию =(`;
    }

    deleteButtonNode.disabled = false;
  });
})();
