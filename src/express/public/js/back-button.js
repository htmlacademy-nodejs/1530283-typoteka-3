(() => {
  const backButton = document.querySelector('.post__backwards')

  if (!backButton) {
    return;
  }

  backButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    history.back();
  })
})()
