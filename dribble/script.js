document.addEventListener('DOMContentLoaded', function() {
    // Swap button functionality
    const swapBtn = document.getElementById('swapBtn');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    swapBtn.addEventListener('click', function() {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
    });

    // Passenger counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const minusBtn = counter.querySelector('.minus');
        const plusBtn = counter.querySelector('.plus');
        const countSpan = counter.querySelector('.count');

        minusBtn.addEventListener('click', function() {
            let count = parseInt(countSpan.textContent);
            if (count > 0) {
                countSpan.textContent = count - 1;
            }
        });

        plusBtn.addEventListener('click', function() {
            let count = parseInt(countSpan.textContent);
            countSpan.textContent = count + 1;
        });
    });

    // Seat selection
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            if (!seat.classList.contains('selected') && !seat.classList.contains('highlighted')) {
                // Remove previous selections
                seats.forEach(s => s.classList.remove('selected'));
                // Add selection to clicked seat
                seat.classList.add('selected');
            }
        });
    });

    // Baggage selection
    const baggageOptions = document.querySelectorAll('.baggage-option');
    baggageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            baggageOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            option.classList.add('selected');
            // Check the radio button
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // Price range sliders
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');
    const priceLabels = document.querySelectorAll('.price-labels span');

    function updatePriceLabels() {
        priceLabels[0].innerHTML = `Minimum Price<br>$${minPriceSlider.value}`;
        priceLabels[1].innerHTML = `Maximum Price<br>$${maxPriceSlider.value}`;
    }

    minPriceSlider.addEventListener('input', updatePriceLabels);
    maxPriceSlider.addEventListener('input', updatePriceLabels);

    // Search flights button
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        alert('Searching for flights...');
    });

    // Apply filter button
    const applyFilterBtn = document.querySelector('.apply-filter');
    applyFilterBtn.addEventListener('click', function() {
        alert('Filter applied!');
    });

    // Select seat button
    const selectSeatBtn = document.querySelector('.select-seat-btn');
    selectSeatBtn.addEventListener('click', function() {
        const selectedSeat = document.querySelector('.seat.selected');
        if (selectedSeat) {
            alert(`Seat ${selectedSeat.textContent} selected!`);
        } else {
            alert('Please select a seat first.');
        }
    });

    // Process payment button
    const processPaymentBtn = document.querySelector('.process-payment');
    processPaymentBtn.addEventListener('click', function() {
        alert('Processing payment...');
    });

    // Okay button in notification
    const okayBtn = document.querySelector('.okay-btn');
    okayBtn.addEventListener('click', function() {
        const notification = document.querySelector('.notification');
        notification.style.display = 'none';
    });

    // Remove return date button
    const removeBtn = document.querySelector('.remove-btn');
    const returnDateInput = removeBtn.parentElement.querySelector('input[type="date"]');
    
    removeBtn.addEventListener('click', function() {
        returnDateInput.style.display = 'none';
        removeBtn.style.display = 'none';
    });

    // Destination dropdown
    const destinationSelect = document.querySelector('.destination select');
    destinationSelect.addEventListener('change', function() {
        console.log('Destination changed to:', this.value);
    });

    // Facilities checkboxes
    const facilityCheckboxes = document.querySelectorAll('.facilities-grid input[type="checkbox"]');
    facilityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`${this.nextSibling.textContent.trim()} is now ${this.checked ? 'enabled' : 'disabled'}`);
        });
    });
});