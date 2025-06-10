document.addEventListener('DOMContentLoaded', () => {
  const requestForm = document.getElementById('requestForm');
  const resetForm = document.getElementById('resetForm');
  const alertContainer = document.getElementById('alert-container');
  const questionInput = document.getElementById('security_question_display');

  let currentEmail = '';

  function showAlert(message, type = 'error') {
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => { alertContainer.innerHTML = ''; }, 5000);
  }

  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) {
      showAlert('Ingresa tu correo');
      return;
    }

    try {
      const res = await fetch(`/forgot-password/question?email_user=${encodeURIComponent(email)}`);
      const result = await res.json();

      if (res.ok && result.success) {
        currentEmail = email;
        questionInput.value = result.question;
        resetForm.style.display = '';
        requestForm.style.display = 'none';
      } else {
        showAlert(result.message || 'No se encontró el correo');
      }
    } catch (err) {
      showAlert('Error del servidor');
    }
  });

  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const answer = document.getElementById('security_answer').value.trim();
    const password = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_new_password').value;

    if (!answer || !password || !confirmPassword) {
      showAlert('Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      email_user: currentEmail,
      security_answer: answer,
      new_password: password
    };

    try {
      const res = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showAlert('¡Contraseña cambiada exitosamente!', 'success');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } else {
        showAlert(result.message || 'No se pudo cambiar la contraseña');
      }
    } catch (err) {
      showAlert('Error del servidor');
    }
  });
});