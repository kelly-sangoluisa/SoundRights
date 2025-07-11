document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const alertContainer = document.getElementById('alert-container');

  function showAlert(message, type = 'error') {
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => { alertContainer.innerHTML = ''; }, 5000);
  }

  function validateEmail(email) {
    // Debe tener @ y .
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    // Mínimo 8 caracteres, una mayúscula, un número y un caracter especial
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const password = formData.get('password_user');
    const confirmPassword = formData.get('confirm_password');
    const email = formData.get('email_user');

    if (!validateEmail(email)) {
      showAlert('El correo debe ser válido e incluir "@" y "."');
      return;
    }

    if (!validatePassword(password)) {
      showAlert('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      name_user: formData.get('name_user'),
      email_user: email,
      password_user: password,
      security_question: formData.get('security_question'),
      security_answer: formData.get('security_answer'),
    };

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await res.json();
      if (res.ok && result.success) {
        showAlert('¡Cuenta creada exitosamente!', 'success');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } else {
        showAlert(result.message || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      showAlert('Error del servidor');
    }
  });
});