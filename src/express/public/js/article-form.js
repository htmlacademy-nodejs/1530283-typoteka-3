(() => {
  const PUBLICATION_DATE_INPUT_ID = `#publication-date`;

  const publicationDateInputNode = document.querySelector(
    PUBLICATION_DATE_INPUT_ID
  );

  const { defaultValue } = publicationDateInputNode.dataset;

  flatpickr(PUBLICATION_DATE_INPUT_ID, {
    defaultDate: defaultValue,
    dateFormat: `d-m-Y`,
  });
})();

(() => {
  const fileInputNode = document.querySelector(`input[name="upload"]`);
  const fileNameInputNode = document.querySelector(`input[name="filename"]`);
  const clearFileButtonNode = document.querySelector(`.button[data-delete]`);

  clearFileButtonNode.addEventListener(`click`, () => {
    fileInputNode.value = ``;
    fileNameInputNode.value = ``;
  });
})();
