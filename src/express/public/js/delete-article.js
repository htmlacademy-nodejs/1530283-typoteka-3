(() => {
  const SUCCESS_STATUS_CODE = 204;

  const commentsList = document.querySelector(`.notes__list`);

  const createError = () => {
     const paragraph = document.createElement('p');

     paragraph.style.color = 'red';

     paragraph.innerHTML = 'Произошла ошибка! Не удалось удалить статью =(';

     return paragraph;
  }

  commentsList.addEventListener('click', async (evt) => {
    const deleteButton = evt.target.closest(`.button--close-item`);

    if (!deleteButton || !evt.currentTarget.contains(deleteButton)) {
      return;
    }

    evt.preventDefault();

    deleteButton.disabled = true;

    const articleContainer = deleteButton.closest(`.notes__list-item`);

    try {

      const {articleId} = deleteButton.dataset;

      const response = await fetch(`/my/articles/${articleId}`, {
        method: 'DELETE'
      });

      if (response.status !== SUCCESS_STATUS_CODE) {
        throw new Error('Unable to delete article')
      }

      articleContainer.remove();
    } catch (error) {
      articleContainer.append(createError(error));
    }

    deleteButton.disabled = false;
  })
})()
