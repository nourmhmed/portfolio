const form = document.getElementById('contact-form');
const messageBox = document.getElementById('message-box');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch('contact.php', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    messageBox.innerText = data.message;
    if (data.success) {
      form.reset();
    }
  })
  .catch(error => {
    messageBox.innerText = 'Error sending message.';
    console.error(error);
  });
});
