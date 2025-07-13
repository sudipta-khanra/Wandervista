  const modal = document.getElementById('booking-delete-modal');
  const deleteForm = document.getElementById('delete-form');
  function openDeleteModal(bookingId) {
    console.log("openDeleteModal called with id:", bookingId);
    deleteForm.action = `/bookings/${bookingId}?_method=DELETE`;
    modal.classList.remove('hidden');
  }
  function closeModal() {
    modal.classList.add('hidden');
  }
  modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});