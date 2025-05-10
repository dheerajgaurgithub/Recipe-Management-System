// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Form validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over forms and prevent submission if they're invalid
  Array.from(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
      
      // Additional custom validation
      if (form.id === 'registerForm') {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Passwords don't match");
        } else {
          confirmPassword.setCustomValidity('');
        }
      }
    }, false);
    
    // Reset custom validation on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        input.setCustomValidity('');
      });
    });
    
    // Special handling for confirmPassword field
    const confirmPassword = form.querySelector('#confirmPassword');
    if (confirmPassword) {
      confirmPassword.addEventListener('input', function() {
        const password = document.getElementById('password');
        if (password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Passwords don't match");
        } else {
          confirmPassword.setCustomValidity('');
        }
      });
    }
  });
  
  // Disable dishName field in edit form
  const editForm = document.getElementById('editRecipeForm');
  if (editForm) {
    const dishNameInput = editForm.querySelector('#dishName');
    if (dishNameInput) {
      dishNameInput.disabled = true;
    }
  }
});