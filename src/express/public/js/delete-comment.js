(() => {
  const SUCCESS_STATUS_CODE = 204;

  const commentsList = document.querySelector(`.publication__list`);

  const createError = () => {
     const paragraph = document.createElement('p');

     paragraph.style.color = 'red';

     paragraph.innerHTML = 'Произошла ошибка! Не удалось удалить комментарий =(';

     return paragraph;
  }

  commentsList.addEventListener('click', async (evt) => {
    const deleteButton = evt.target.closest(`.button--close-item`);

    if (!deleteButton || !evt.currentTarget.contains(deleteButton)) {
      return;
    }

    evt.preventDefault();

    deleteButton.disabled = true;

    const commentContainer = document.querySelector(`.publication__list-item`);

    try {

      const {commentId} = deleteButton.dataset;

      const response = await fetch(`/my/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (response.status !== SUCCESS_STATUS_CODE) {
        throw new Error('Unable to delete comment')
      }

      commentContainer.remove();
    } catch (error) {
      commentContainer.append(createError(error));
    }

    deleteButton.disabled = false;
  })
})()
