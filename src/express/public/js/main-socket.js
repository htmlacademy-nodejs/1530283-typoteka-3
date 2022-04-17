(() => {
  console.log('Main page socket');

  const SOCKET_URL = `http://localhost:3000`;

  const socket = io(SOCKET_URL);

  console.log(socket);

  socket.on(`article:delete`, (article) => {
    console.log(`Article delete, `, article);
  })
})();
