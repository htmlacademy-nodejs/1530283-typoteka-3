(() => {
  const CSRF_TOKEN_NAME = `_csrf`;

  const HttpMethod = {
    PUT: `PUT`,
    DELETE: `DELETE`,
  };

  const HttpSuccessCode = {
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
  };

  const getApiEndpoint = (id) => `/my/categories/${id}`;

  const categoriesListNode = document.querySelector(`.category__list`);
  const csrfToken = document.querySelector(`meta[name='csrf-token']`).content;

  console.log(csrfToken);

  categoriesListNode.addEventListener(`submit`, async (evt) => {
    const updateFormNode = evt.target.closest(`form`);

    if (!updateFormNode || !evt.currentTarget.contains(updateFormNode)) {
      return;
    }

    evt.preventDefault();

    const categoryItemNode = updateFormNode.closest(`.category__list-item`);
    const errorNode = categoryItemNode.querySelector(`.category__error`);
    const inputNode = updateFormNode.querySelector(`input[name='name']`);
    const submitButtonNode = updateFormNode.querySelector(
      `button[type='submit']`
    );

    if (inputNode.value === inputNode.dataset.value) {
      return;
    }

    const formData = new FormData(updateFormNode);
    formData.append(CSRF_TOKEN_NAME, csrfToken);

    inputNode.disabled = true;
    submitButtonNode.disabled = true;
    errorNode.textContent = ``;

    const apiEndpoint = getApiEndpoint(updateFormNode.dataset.categoryId);

    try {
      const response = await fetch(apiEndpoint, {
        method: HttpMethod.PUT,
        body: formData,
      });

      if (response.status === HttpSuccessCode.BAD_REQUEST) {
        const errorMessage = (await response.json()).name;

        if (errorMessage) {
          throw new Error(errorMessage);
        }
      }

      if (response.status !== HttpSuccessCode.OK) {
        throw new Error(`Произошла ошибка! Не удалось сохранить изменения =(`);
      }

      const {name: updatedName} = await response.json();
      inputNode.value = updatedName;
      inputNode.dataset.value = updatedName;
    } catch (error) {
      errorNode.textContent = error.message;
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
    const errorNode = categoryItemNode.querySelector(`.category__error`);

    deleteButtonNode.disabled = true;
    errorNode.textContent = ``;

    const apiEndpoint = getApiEndpoint(deleteButtonNode.dataset.categoryId);

    const formData = new FormData();
    formData.append(CSRF_TOKEN_NAME, csrfToken);

    try {
      const response = await fetch(apiEndpoint, {
        method: HttpMethod.DELETE,
        body:formData,
      });

      if (response.status !== HttpSuccessCode.NO_CONTENT) {
        throw new Error(`Произошла ошибка! Не удалось удалить категорию =(`);
      }

      categoryItemNode.remove();

      const isListEmpty = !categoriesListNode.querySelectorAll(`.category__list-item`).length;

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
