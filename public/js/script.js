(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

//review
 function toggleReview(btn) {
    const shortText = btn.previousElementSibling;
    const fullText = btn.nextElementSibling;
    if (fullText.style.display === 'none') {
      fullText.style.display = 'block';
      shortText.style.display = 'none';
      btn.textContent = 'Show less';
    } else {
      fullText.style.display = 'none';
      shortText.style.display = 'block';
      btn.textContent = 'Show more';
    }
  }

