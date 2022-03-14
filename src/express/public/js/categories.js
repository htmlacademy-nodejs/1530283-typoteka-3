(() => {
  const categoriesContainer = document.querySelector(`.category__list`);

  const createErrorContainer = () => {
    const errorContainer = document.createElement(`p`);

    errorContainer.classList.add(`category-item-error`);

    errorContainer.style.color = `red`;
    errorContainer.style.position = `absolute`;
    errorContainer.style.bottom = `-20px`;
    errorContainer.style.left = `40px`;
    errorContainer.style.right = `0`;

    return errorContainer;
  };

  categoriesContainer.addEventListener(`submit`, async (evt) => {
    const updateForm = evt.target.closest(`form`);

    if (!updateForm || !evt.currentTarget.contains(updateForm)) {
      return;
    }

    evt.preventDefault();

    let errorContainer = document.querySelector(`.category-item-error`);

    if (!errorContainer) {
      errorContainer = createErrorContainer();
      updateForm.append(errorContainer);
    }

    const input = updateForm.querySelector(`input[name='name']`);
    const submitButton = updateForm.querySelector(`button[type='submit']`);

    const formData = new FormData(updateForm);

    input.disabled = true;
    submitButton.disabled = true;

    try {
      const response = await fetch(`/my/categories/${updateForm.dataset.categoryId}`, {
        method: `PUT`,
        body: formData
      })

      if (response.status !== 200) {
        throw new Error(`Category update failed`)
      }

      errorContainer.textContent = ``;
    } catch (error) {
      errorContainer.textContent = `Произошла ошибка! Не удалось сохранить изменения =(`;
    }

    input.disabled = false;
    submitButton.disabled = false;
  })

  categoriesContainer.addEventListener(`click`, async (evt) => {
    const deleteButton = evt.target.closest(`.button--category[type='button']`);

    if (!deleteButton || !evt.currentTarget.contains(deleteButton)) {
      return;
    }

    const categoryContainer = deleteButton.closest(`.category__list-item`);

    let errorContainer = document.querySelector(`.category-item-error`);

    if (!errorContainer) {
      errorContainer = createErrorContainer();
      categoryContainer.append(errorContainer);
    }

    deleteButton.disabled = true;

    try {
      const response = await fetch(`/my/categories/${deleteButton.dataset.categoryId}`, {
        method: `DELETE`,
      })

      if (response.status !== 204) {
        throw new Error(`Category deletion failed`)
      }

      categoryContainer.remove();
    } catch (error) {
      errorContainer.textContent = `Произошла ошибка! Не удалось удалить категорию =(`;
    }

    deleteButton.disabled = false;
  })
})();
