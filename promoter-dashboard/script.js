// Promoter Dashboard Script

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createEventForm = document.getElementById('create-event-form');
    const eventsContainer = document.getElementById('events-container');
    const editEventForm = document.getElementById('edit-event-form');
    const updateEventForm = document.getElementById('update-event-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const loadingSpinner = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const eventFilter = document.getElementById('event-filter');
    const eventSearch = document.getElementById('event-search');
    const addTicketTypeBtn = document.getElementById('add-ticket-type');
    const editAddTicketTypeBtn = document.getElementById('edit-add-ticket-type');
    const logoutBtn = document.getElementById('logout-btn');
    const promoterNameSpan = document.getElementById('promoter-name');

    // Demo mode - no authentication required
    promoterNameSpan.textContent = 'Demo Promoter';
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/login.html';
        });
    }

    // Event Listeners
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }
    if (updateEventForm) {
        updateEventForm.addEventListener('submit', handleUpdateEvent);
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', hideEditForm);
    }
    if (eventFilter) {
        eventFilter.addEventListener('change', filterEvents);
    }
    if (eventSearch) {
        eventSearch.addEventListener('input', filterEvents);
    }
    if (addTicketTypeBtn) {
        addTicketTypeBtn.addEventListener('click', () => addTicketType('ticket-types'));
    }
    if (editAddTicketTypeBtn) {
        editAddTicketTypeBtn.addEventListener('click', () => addTicketType('edit-ticket-types'));
    }

    // Initial fetch of events
    fetchEvents();

    // Loading and Error States
    function showLoading() {
        loadingSpinner.style.display = 'flex';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Event Management Functions
    async function fetchEvents() {
        showLoading();
        try {
            const response = await fetch('/api/promoter/events');
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const events = await response.json();
            displayEvents(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            showError('Error loading events. Please try again.');
        } finally {
            hideLoading();
        }
    }

    function displayEvents(events) {
        eventsContainer.innerHTML = '';
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>No events found. Create your first event!</p>';
            return;
        }

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');
            eventElement.innerHTML = `
                <h4>${event.title}</h4>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Capacity:</strong> ${event.capacity}</p>
                <p><strong>Base Price:</strong> $${event.price}</p>
                <p>${event.description}</p>
                <button class="edit-event-btn" data-id="${event._id}">Edit</button>
                <button class="delete-event-btn" data-id="${event._id}">Delete</button>
            `;
            eventsContainer.appendChild(eventElement);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-event-btn').forEach(button => {
            button.addEventListener('click', handleEditEvent);
        });
        document.querySelectorAll('.delete-event-btn').forEach(button => {
            button.addEventListener('click', handleDeleteEvent);
        });
    }

    async function handleCreateEvent(e) {
        e.preventDefault();
        showLoading();

        const ticketTypes = getTicketTypes('ticket-types');
        const imageFile = document.getElementById('event-imageUrl').files[0];

        // Create FormData object for multipart/form-data
        const formData = new FormData();
        formData.append('title', document.getElementById('event-title').value);
        formData.append('description', document.getElementById('event-description').value);
        formData.append('date', document.getElementById('event-date').value);
        formData.append('time', document.getElementById('event-time').value);
        formData.append('location', document.getElementById('event-location').value);
        formData.append('category', document.getElementById('event-category').value);
        formData.append('price', document.getElementById('event-price').value);
        formData.append('capacity', document.getElementById('event-capacity').value);
        formData.append('ticketTypes', JSON.stringify(ticketTypes));
        formData.append('organizer', '60f0b7b3a1b9c80015d8a9c1'); // Placeholder ID for demo

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch('/api/promoter/events', {
                method: 'POST',
                body: formData, // Send FormData instead of JSON
            });

            if (response.ok) {
                alert('Event created successfully!');
                createEventForm.reset();
                document.getElementById('ticket-types').innerHTML = '';
                addTicketType('ticket-types'); // Add one empty ticket type
                fetchEvents();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            showError(error.message || 'Error creating event. Please try again.');
        } finally {
            hideLoading();
        }
    }

    async function handleEditEvent(event) {
        const eventId = event.target.dataset.id;
        showLoading();
        try {
            const response = await fetch(`/api/promoter/events/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event data');
            }
            const eventData = await response.json();
            
            // Populate the edit form
            document.getElementById('edit-event-id').value = eventData._id;
            document.getElementById('edit-event-title').value = eventData.title;
            document.getElementById('edit-event-description').value = eventData.description;
            document.getElementById('edit-event-date').value = eventData.date.split('T')[0];
            document.getElementById('edit-event-time').value = eventData.time;
            document.getElementById('edit-event-location').value = eventData.location;
            document.getElementById('edit-event-category').value = eventData.category;
            document.getElementById('edit-event-imageUrl').value = eventData.imageUrl || '';
            document.getElementById('edit-event-price').value = eventData.price;
            document.getElementById('edit-event-capacity').value = eventData.capacity;

            // Populate ticket types
            const ticketTypesContainer = document.getElementById('edit-ticket-types');
            ticketTypesContainer.innerHTML = '';
            if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
                eventData.ticketTypes.forEach(type => {
                    addTicketType('edit-ticket-types', type);
                });
            } else {
                addTicketType('edit-ticket-types');
            }

            // Show the edit form
            editEventForm.style.display = 'block';
            editEventForm.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error fetching event data:', error);
            showError('Error loading event data for editing.');
        } finally {
            hideLoading();
        }
    }

    async function handleUpdateEvent(e) {
        e.preventDefault();
        showLoading();

        const eventId = document.getElementById('edit-event-id').value;
        const ticketTypes = getTicketTypes('edit-ticket-types');
        const imageFile = document.getElementById('edit-event-imageUrl').files[0];

        const updatedEvent = {
            title: document.getElementById('edit-event-title').value,
            description: document.getElementById('edit-event-description').value,
            date: document.getElementById('edit-event-date').value,
            time: document.getElementById('edit-event-time').value,
            location: document.getElementById('edit-event-location').value,
            category: document.getElementById('edit-event-category').value,
            imageUrl: document.getElementById('edit-event-imageUrl').value,
            price: parseFloat(document.getElementById('edit-event-price').value),
            capacity: parseInt(document.getElementById('edit-event-capacity').value, 10),
            ticketTypes: ticketTypes,
            organizer: '60f0b7b3a1b9c80015d8a9c1' // Placeholder ID for demo
        };

        if (imageFile) {
            console.log('Selected Image File:', imageFile);
        }

        try {
            const response = await fetch(`/api/promoter/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            if (response.ok) {
                alert('Event updated successfully!');
                hideEditForm();
                fetchEvents();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            showError(error.message || 'Error updating event. Please try again.');
        } finally {
            hideLoading();
        }
    }

    async function handleDeleteEvent(event) {
        const eventId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this event?')) {
            showLoading();
            try {
                const response = await fetch(`/api/promoter/events/${eventId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Event deleted successfully!');
                    fetchEvents();
                } else {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                showError(error.message || 'Error deleting event. Please try again.');
            } finally {
                hideLoading();
            }
        }
    }

    // Helper Functions
    function hideEditForm() {
        editEventForm.style.display = 'none';
        updateEventForm.reset();
    }

    function addTicketType(containerId, ticketType = null) {
        const container = document.getElementById(containerId);
        const ticketDiv = document.createElement('div');
        ticketDiv.classList.add('ticket-type');
        ticketDiv.innerHTML = `
            <input type="text" placeholder="Type name" class="ticket-name" value="${ticketType?.name || ''}">
            <input type="number" placeholder="Price" class="ticket-price" step="0.01" min="0" value="${ticketType?.price || ''}">
            <input type="number" placeholder="Quantity" class="ticket-quantity" min="1" value="${ticketType?.quantity || ''}">
            <button type="button" class="remove-ticket">×</button>
        `;
        container.appendChild(ticketDiv);

        // Add event listener to remove button
        ticketDiv.querySelector('.remove-ticket').addEventListener('click', () => {
            if (container.children.length > 1) {
                ticketDiv.remove();
            } else {
                showError('At least one ticket type is required.');
            }
        });
    }

    function getTicketTypes(containerId) {
        const container = document.getElementById(containerId);
        const ticketTypes = [];
        container.querySelectorAll('.ticket-type').forEach(div => {
            const name = div.querySelector('.ticket-name').value;
            const price = parseFloat(div.querySelector('.ticket-price').value);
            const quantity = parseInt(div.querySelector('.ticket-quantity').value, 10);
            if (name && !isNaN(price) && !isNaN(quantity)) {
                ticketTypes.push({ name, price, quantity });
            }
        });
        return ticketTypes;
    }

    function filterEvents() {
        const filter = eventFilter.value;
        const search = eventSearch.value.toLowerCase();
        const events = Array.from(eventsContainer.children);

        events.forEach(event => {
            const title = event.querySelector('h4').textContent.toLowerCase();
            const date = new Date(event.querySelector('p:nth-child(2)').textContent.split(': ')[1]);
            const matchesSearch = title.includes(search);
            const matchesFilter = filter === 'all' ||
                (filter === 'upcoming' && date >= new Date()) ||
                (filter === 'past' && date < new Date());

            event.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });
    }
}); 