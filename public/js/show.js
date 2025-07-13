  const showBtn = document.getElementById('show-availability-btn');
  const reservationSection = document.getElementById('reservation-section');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const modal = document.getElementById('calendar-modal');
  const calendarContainer = document.getElementById('calendar-container');
  const closeBtn = document.getElementById('close-calendar');

  // Step 1: Show reservation box
  showBtn.addEventListener('click', () => {
    reservationSection.style.display = 'flex';
    showBtn.style.display = 'none';
    
  });

  // Step 2: Open modal on input click
  checkinInput.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
  checkoutInput.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Step 3: Initialize calendar with 3-step date logic
  let hasSelectedStart = false;

  

  // Close calendar manually
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Prevent closing when clicking inside
  document.querySelector('.calendar-content').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close calendar when clicking outside
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });


  const picker = new Litepicker({
  element: calendarContainer,
  inlineMode: true,
  singleMode: false,
  numberOfMonths: 2,
  numberOfColumns: 2,
  format: 'MMM D, YYYY',
  minDate: new Date(),

  setup: (picker) => {
    picker.on('selected', (start, end) => {
      if (start && end) {
        // Both dates selected — update inputs and close modal
        checkinInput.value = start.format('MMM D, YYYY');
        checkoutInput.value = end.format('MMM D, YYYY');
        modal.style.display = 'none';
      } else if (start) {
        // Only start selected — update checkin and clear checkout
        checkinInput.value = start.format('MMM D, YYYY');
        checkoutInput.value = '';
      }
    });
  }
});
 
  const reserveBtn = document.querySelector('.reserve-btn');

  showBtn.addEventListener('click', () => {
    reservationSection.style.display = 'flex'; // or block, depending on your styling
    showBtn.style.display = 'none';
  });

  reserveBtn.addEventListener('click', () => {
    reservationSection.style.display = 'none';  // Hide reservation box on Reserve click
    showBtn.style.display = 'inline-block'; 
  });



  //cross btn

  const closeReserveBtn = document.getElementById('close-reserve-box');

  // When "Show Availability" is clicked
  showBtn.addEventListener('click', () => {
    reservationSection.style.display = 'flex';
    showBtn.style.display = 'none';
  });

  // When "Reserve" is clicked
  reserveBtn.addEventListener('click', () => {
    reservationSection.style.display = 'none';
    showBtn.style.display = 'inline-block'; // Show button again
  });

  // When "×" close icon is clicked
  closeReserveBtn.addEventListener('click', () => {
    reservationSection.style.display = 'none';
    showBtn.style.display = 'inline-block'; // Show button again
  });


  // Set guests on change
document.getElementById('guests').addEventListener('change', function () {
  const selected = this.value.split(' ')[0]; // extract the number
  document.getElementById('guests-hidden').value = selected;
});

// Update hidden fields when date is selected
picker.on('selected', (start, end) => {
  document.getElementById('checkin').value = start.format('MMM D, YYYY');
  document.getElementById('checkout').value = end.format('MMM D, YYYY');

  document.getElementById('checkin-hidden').value = start.format('YYYY-MM-DD');
  document.getElementById('checkout-hidden').value = end.format('YYYY-MM-DD');

  modal.style.display = 'none';
});


// Update hidden inputs when dates are selected
picker.on('selected', (start, end) => {
  document.getElementById('checkin-hidden').value = start.format('YYYY-MM-DD');
  document.getElementById('checkout-hidden').value = end.format('YYYY-MM-DD');
});

// Update guests selection
document.getElementById('guests').addEventListener('change', () => {
  document.getElementById('guests-hidden').value = document.getElementById('guests').value.split(' ')[0]; // Only the number
});


  


const listingDeleteModal = document.getElementById('listing-delete-modal');
const listingDeleteForm = document.getElementById('listing-delete-form');

function openListingDeleteModal(listingId) {
  // Set form action dynamically with listingId
  listingDeleteForm.action = `/listings/${listingId}?_method=DELETE`;

  // Show modal by removing hidden class
  listingDeleteModal.classList.remove('custom-modal-hidden');
}

function closeListingDeleteModal() {
  // Hide modal by adding hidden class
  listingDeleteModal.classList.add('custom-modal-hidden');
}

// Close modal if clicking outside the modal content
listingDeleteModal.addEventListener('click', (e) => {
  if (e.target === listingDeleteModal) {
    closeListingDeleteModal();
  }
});
