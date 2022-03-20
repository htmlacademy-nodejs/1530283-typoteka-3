(() => {
  const backButton = document.querySelector('.button[data-back]')

  if (!backButton) {
    return;
  }

  backButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    history.back();
  })
})()
