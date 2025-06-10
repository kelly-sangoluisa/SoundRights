document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const alertContainer = document.getElementById('alert-container');

  function showAlert(message, type = 'error') {
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => { alertContainer.innerHTML = ''; }, 5000);
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const loginData = {
      email_user: formData.get('email_user').trim(),
      password_user: formData.get('password_user')
    };

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        window.location.href = '/main';
      } else {
        showAlert(result.message || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      showAlert('Error del servidor');
    }
  });
});