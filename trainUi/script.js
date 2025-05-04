// Sample station data for autocomplete (in a real app, this would come from a backend API)
const stations = [
    { name: "New Delhi", code: "NDLS", city: "Delhi" },
    { name: "Mumbai Central", code: "CST", city: "Mumbai" },
    { name: "Kolkata", code: "KOAA", city: "Kolkata" },
    { name: "Chennai Central", code: "MAS", city: "Chennai" },
    { name: "Bengaluru", code: "SBC", city: "Bengaluru" },
    { name: "Hyderabad", code: "HYD", city: "Hyderabad" },
    { name: "Ahmedabad", code: "ADI", city: "Ahmedabad" },
    { name: "Pune", code: "PUNE", city: "Pune" },
    { name: "Jaipur", code: "JP", city: "Jaipur" },
    { name: "Lucknow", code: "LKO", city: "Lucknow" }
];

document.addEventListener('DOMContentLoaded', function() {
    const sourceInput = document.getElementById('sourceStation');
    const destinationInput = document.getElementById('destinationStation');
    const sourceCodeInput = document.getElementById('sourceCode');
    const destinationCodeInput = document.getElementById('destinationCode');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const trainResults = document.getElementById('trainResults');
    const resultsCount = document.getElementById('resultsCount');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    
    // Setup station autocomplete for source
    setupStationAutocomplete(sourceInput, sourceCodeInput);
    
    // Setup station autocomplete for destination
    setupStationAutocomplete(destinationInput, destinationCodeInput);
    
    // Handle search button click
    searchButton.addEventListener('click', function() {
        const sourceCode = sourceCodeInput.value;
        const destinationCode = destinationCodeInput.value;
        
        // Validate inputs
        if (!sourceCode || !destinationCode) {
            showError('Please select both source and destination stations');
            return;
        }
        
        if (sourceCode === destinationCode) {
            showError('Source and destination stations cannot be the same');
            return;
        }
        
        // Clear previous error if any
        hideError();
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        
        // Hide results if previously shown
        resultsContainer.style.display = 'none';
        
        // Search trains
        searchTrains(sourceCode, destinationCode);
    });
    
    function setupStationAutocomplete(inputElement, codeInputElement) {
        // Create suggestions container
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'station-suggestions';
        inputElement.parentNode.appendChild(suggestionsContainer);
        
        inputElement.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            // Filter stations based on input
            const filteredStations = stations.filter(station => 
                station.name.toLowerCase().includes(query) || 
                station.code.toLowerCase().includes(query)
            );
            
            // Show suggestions
            if (filteredStations.length > 0) {
                renderSuggestions(filteredStations, suggestionsContainer, inputElement, codeInputElement);
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target !== inputElement) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }
    
    function renderSuggestions(stations, container, inputElement, codeInputElement) {
        container.innerHTML = '';
        
        stations.forEach(station => {
            const suggestion = document.createElement('div');
            suggestion.className = 'station-suggestion';
            suggestion.innerHTML = `
                <div class="station-name-code">${station.name} (${station.code})</div>
                <div class="station-city">${station.city}</div>
            `;
            
            suggestion.addEventListener('click', function() {
                inputElement.value = station.name;
                codeInputElement.value = station.code;
                container.style.display = 'none';
            });
            
            container.appendChild(suggestion);
        });
    }
    
    function searchTrains(sourceCode, destinationCode) {
        // Fetch from the API
        fetch(`http://localhost:8086/search/by-code?sourceCode=${sourceCode}&destinationCode=${destinationCode}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                loadingIndicator.style.display = 'none';
                displayResults(data);
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                showError('Failed to fetch train information. Please try again later.');
                console.error('Error fetching data:', error);
            });
    }
    
    function displayResults(trains) {
        resultsContainer.style.display = 'block';
        trainResults.innerHTML = '';
        
        if (trains.length === 0) {
            trainResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No trains found for this route.</p>
                </div>
            `;
            resultsCount.textContent = '0 trains found';
            return;
        }
        
        resultsCount.textContent = `${trains.length} train${trains.length > 1 ? 's' : ''} found`;
        
        trains.forEach(train => {
            // Calculate duration
            const departureTime = train.departureTime;
            const arrivalTime = train.arrivalTime;
            const duration = calculateDuration(departureTime, arrivalTime);
            
            const trainCard = document.createElement('div');
            trainCard.className = 'train-card';
            trainCard.innerHTML = `
                <div class="train-header">
                    <h3 class="train-name">${train.train.trainName}</h3>
                    <div class="train-number">${train.train.trainNumber}</div>
                </div>
                <div class="train-details">
                    <div class="train-route">
                        <div class="route-stations">
                            <div class="station">
                                <div class="station-name">${train.source.stationName}</div>
                                <div class="station-code">${train.source.stationCode}</div>
                            </div>
                            <div class="route-line"></div>
                            <div class="station">
                                <div class="station-name">${train.destination.stationName}</div>
                                <div class="station-code">${train.destination.stationCode}</div>
                            </div>
                        </div>
                    </div>
                    <div class="train-time">
                        <div class="time-details">
                            <div class="departure-time">
                                <div class="time-label">Departure</div>
                                <div class="time-value">${formatTime(train.departureTime)}</div>
                            </div>
                            <div class="journey-duration">
                                <div class="duration-value">${duration}</div>
                            </div>
                            <div class="arrival-time">
                                <div class="time-label">Arrival</div>
                                <div class="time-value">${formatTime(train.arrivalTime)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            trainResults.appendChild(trainCard);
        });
    }
    
    function calculateDuration(departureTime, arrivalTime) {
        // Parse times (assuming HH:MM format)
        const [depHours, depMinutes] = departureTime.split(':').map(Number);
        const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
        
        // Convert to minutes since midnight
        let depTotalMinutes = depHours * 60 + depMinutes;
        let arrTotalMinutes = arrHours * 60 + arrMinutes;
        
        // Handle overnight trains
        if (arrTotalMinutes < depTotalMinutes) {
            arrTotalMinutes += 24 * 60; // Add 24 hours
        }
        
        // Calculate duration in minutes
        const durationMinutes = arrTotalMinutes - depTotalMinutes;
        
        // Format duration
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        return `${hours}h ${minutes}m`;
    }
    
    function formatTime(timeString) {
        // Convert 24-hour format to 12-hour format with AM/PM
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
});