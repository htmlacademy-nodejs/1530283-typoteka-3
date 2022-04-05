(() => {
  const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];

  const fileInputNode = document.querySelector(`input[name="upload"]`);
  const fileNameInputNode = document.querySelector(`input[name="filename"]`);
  const uploadImageNode = document.querySelector(`.avatar img`);

  const getURLfromFile = (file) => new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();
    const isTypeMatch = ALLOWED_FILE_TYPES.some((type) => fileName.endsWith(type));

    if (!isTypeMatch) {
      reject(new Error('File type mismatch'));
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      resolve(reader.result);
    });

    reader.addEventListener('error', () => {
      reject(new Error(reader.error));
    });

    reader.readAsDataURL(file);
  });

  const loadPreview = async (file) => {
    try {
      const url = await getURLfromFile(file);
      uploadImageNode.src = url;
    } catch (error) {
      uploadImageNode.src = null;
    }
  }

  fileInputNode.addEventListener(`change`, () => {
    const file = fileInputNode.files[0];
    fileNameInputNode.value = file.name;
    loadPreview(file);
  })
})();
