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

//for role suggestion
const locationInput = document.getElementById('locationInput');
const suggestionsBoxLocation = document.getElementById('location-suggestions');

locationInput.addEventListener('input', async () => {
  const query = locationInput.value.trim();
  if (query.length < 2) {
    suggestionsBoxLocation.innerHTML = '';
    return;
  }

  const res = await fetch(`/listings/suggestions/locations?q=${encodeURIComponent(query)}`);
  const suggestions = await res.json();

  if (suggestions.length === 0) {
    suggestionsBoxLocation.innerHTML = '';
    return;
  }

  suggestionsBoxLocation.innerHTML = suggestions.map(role => `
    <button type="button" class="list-group-item list-group-item-action bg-dark text-light border-secondary">${role}</button>
  `).join('');

  suggestionsBoxLocation.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      locationInput.value = btn.textContent;
      suggestionsBoxLocation.innerHTML = '';
    });
  });
});

document.addEventListener('click', (e) => {
  if (!suggestionsBoxLocation.contains(e.target) && e.target !== locationInput) {
    suggestionsBoxLocation.innerHTML = '';
  }
});
