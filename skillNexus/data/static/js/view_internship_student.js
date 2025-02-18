$(document).ready(function () {
    let currentInternshipId = null;
    let isLoading = false;
    let appliedInternships = new Set(); // Track applied internships

    // Function to get cookie by name
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Add loading spinner
    function showLoading() {
        isLoading = true;
        $('#internshipsList').html(`
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading internships...</p>
            </div>
        `);
    }

    // Show error message
    function showError(message) {
        $('#internshipsList').html(`
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-circle text-danger fa-3x mb-3"></i>
                <h4>Error Loading Internships</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary mt-3" onclick="window.location.reload()">
                    <i class="fas fa-sync-alt me-2"></i>Try Again
                </button>
            </div>
        `);
    }

    // Real-time search with debounce
    let searchTimeout;
    $('#searchInput').on('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = $(this).val();
        searchTimeout = setTimeout(() => loadInternships(searchTerm), 300);
    });

    // Clear filters
    $('#clearFilters').click(function() {
        $('#searchInput').val('');
        $('.filter-chip').removeClass('active');
        $('.filter-chip[data-filter="all"]').addClass('active');
        loadInternships();
    });

    // Filter functionality
    $('.filter-chip').click(function() {
        if (isLoading) return;
        $('.filter-chip').removeClass('active');
        $(this).addClass('active');
        const filter = $(this).data('filter');
        loadInternships($('#searchInput').val(), filter);
    });

    // Load applied internships
    function loadAppliedInternships() {
        const token = getCookie('token');
        if (!token) {
            showError('Authentication required. Please log in.');
            return;
        }

        return $.ajax({
            url: '/api/student/applications/',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            success: function(applications) {
                // Clear the set
                appliedInternships.clear();
                
                // Add all internship IDs to the set
                applications.forEach(app => {
                    appliedInternships.add(app.internship.id);
                });
                
                // Display applications in the Applied Internships section
                const appliedList = $('#appliedInternshipsList');
                appliedList.empty();
                
                if (applications.length === 0) {
                    $('#noApplications').removeClass('d-none');
                    return;
                }
                
                $('#noApplications').addClass('d-none');
                applications.forEach(app => {
                    const statusBadgeClass = getStatusBadgeClass(app.status);
                    const card = `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${app.internship.title}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">
                                        <i class="fas fa-university me-2"></i>${app.internship.university_name}
                                    </h6>
                                    <p class="card-text">
                                        <i class="fas fa-map-marker-alt me-2"></i>${app.internship.location}
                                    </p>
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <span>
                                            <i class="fas fa-money-bill me-2"></i>
                                            ${app.internship.stipend ? '₹' + app.internship.stipend + '/month' : 'Unpaid'}
                                        </span>
                                        <span>
                                            <i class="fas fa-clock me-2"></i>
                                            ${app.internship.duration_months} months
                                        </span>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge ${statusBadgeClass}">
                                            <i class="fas fa-circle me-2"></i>${app.status}
                                        </span>
                                        <small class="text-muted">
                                            Applied on ${new Date(app.applied_date).toLocaleDateString()}
                                        </small>
                                    </div>
                                    ${app.resume_url || app.cv_url ? `
                                        <div class="mt-3 pt-3 border-top">
                                            <h6 class="mb-2">Submitted Documents:</h6>
                                            ${app.resume_url ? `
                                                <a href="${app.resume_url}" class="btn btn-sm btn-outline-primary me-2" target="_blank">
                                                    <i class="fas fa-file-pdf me-2"></i>View Resume
                                                </a>
                                            ` : ''}
                                            ${app.cv_url ? `
                                                <a href="${app.cv_url}" class="btn btn-sm btn-outline-primary" target="_blank">
                                                    <i class="fas fa-file-alt me-2"></i>View CV
                                                </a>
                                            ` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                    appliedList.append(card);
                });
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    showError('Your session has expired. Please log in again.');
                } else {
                    const errorMessage = xhr.responseJSON?.error || 'Failed to load your applications. Please try again later.';
                    showError(errorMessage);
                }
                console.error('Error loading applications:', xhr);
            }
        });
    }

    function getStatusBadgeClass(status) {
        const statusStr = String(status || '0');
        switch(statusStr) {
            case '0':
                return 'status-pending';
            case '1':
                return 'status-accepted';
            case '2':
                return 'status-rejected';
            default:
                return 'status-pending';
        }
    }

    function getStatusText(status) {
        const statusStr = String(status || '0');
        switch(statusStr) {
            case '0':
                return '<i class="fas fa-hourglass-half me-2"></i>Pending Review';
            case '1':
                return '<i class="fas fa-check-circle me-2"></i>Application Accepted';
            case '2':
                return '<i class="fas fa-times-circle me-2"></i>Application Rejected';
            default:
                return '<i class="fas fa-hourglass-half me-2"></i>Pending Review';
        }
    }

    function getApplicationStatusText(status) {
        switch(String(status)) {
            case '1': return '<i class="fas fa-check me-2"></i>Accepted';
            case '2': return '<i class="fas fa-times me-2"></i>Rejected';
            default: return '<i class="fas fa-hourglass-half me-2"></i>Pending Review';
        }
    }

    function getStatusButtonClass(status) {
        switch(String(status)) {
            case '1': return 'btn-success';
            case '2': return 'btn-danger';
            default: return 'btn-warning';
        }
    }

    // Remove the duplicate ended filter chip append
    $('.filter-section div').find('[data-filter="ended"]').remove();

    // Update createInternshipCard to show all internship details
    function createInternshipCard(internship, hasApplied = false, applicationStatus = null) {
        const stipend = internship.stipend ? `₹${internship.stipend}/month` : 'Unpaid';
        const deadline = new Date(internship.application_deadline);
        const now = new Date();
        const isExpired = deadline < now;
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        const universityName = internship.university_name || internship.university?.Name || 'Unknown University';
        const skills = Array.isArray(internship.skills_required) 
            ? internship.skills_required 
            : (typeof internship.skills_required === 'string' 
                ? JSON.parse(internship.skills_required) 
                : []);

        return `
            <div class="col-12 internship-card mb-4">
                <div class="card border-0 shadow-sm hover-shadow" style="background-color: var(--bg)">
                    <div class="card-header border-0 py-4" style="background-color: var(--bg)">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="position-relative border-start border-4 border-primary">
                                <div class="ps-3">
                                <h5 class="mb-3 fw-bold" style="font-size: 1.25rem;">${internship.title}</h5>
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-university me-2 text-primary"></i>
                                        <span>${universityName}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column align-items-end gap-3">
                                ${hasApplied ? `
                                    <button class="btn ${getStatusButtonClass(applicationStatus)} rounded-pill px-4 py-2" disabled>
                                        ${getApplicationStatusText(applicationStatus)}
                                    </button>
                                ` : !isExpired ? `
                                    <button class="btn btn-primary rounded-pill px-4 py-2 apply-btn" data-id="${internship.id}">
                                        <i class="fas fa-paper-plane me-2"></i>Apply Now
                                    </button>
                                ` : ''}
                                ${!isExpired ? 
                                    `<span class="badge rounded-pill bg-${getStatusBadgeColor(daysLeft)} bg-opacity-10 text-${getStatusBadgeColor(daysLeft)} px-3 py-2">
                                        <i class="fas fa-clock me-1"></i>${daysLeft} days left
                                    </span>` : 
                                    `<span class="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                                        <i class="fas fa-calendar-times me-1"></i>Deadline Exceeded
                                    </span>`
                                }
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-3" style="background-color: var(--bg)">
                        <!-- Key Details Section -->
                        <div class="row g-3 mb-3">
                            <div class="col-md-3 col-6">
                                <div class="p-3 rounded-3" style="background-color: var(--bg)">
                                    <div class="d-flex align-items-center p-3 rounded-3" style="background-color: rgba(13, 110, 253, 0.1)">
                                        <div class="rounded-circle bg-white p-2 me-3">
                                            <i class="fas fa-map-marker-alt text-primary"></i>
                                        </div>
                                        <div>
                                            <small class="text-muted d-block">Location</small>
                                            <span class="fw-medium">${internship.location || 'Remote'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="p-3 rounded-3" style="background-color: var(--bg)">
                                    <div class="d-flex align-items-center p-3 rounded-3" style="background-color: rgba(25, 135, 84, 0.1)">
                                        <div class="rounded-circle bg-white p-2 me-3">
                                            <i class="fas fa-money-bill text-success"></i>
                                        </div>
                                        <div>
                                            <small class="text-muted d-block">Stipend</small>
                                            <span class="fw-medium">${stipend}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="p-3 rounded-3" style="background-color: var(--bg)">
                                    <div class="d-flex align-items-center p-3 rounded-3" style="background-color: rgba(255, 193, 7, 0.1)">
                                        <div class="rounded-circle bg-white p-2 me-3">
                                            <i class="fas fa-calendar-alt text-warning"></i>
                                        </div>
                                        <div>
                                            <small class="text-muted d-block">Duration</small>
                                            <span class="fw-medium">${internship.duration_months} months</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-6">
                                <div class="p-3 rounded-3" style="background-color: var(--bg)">
                                    <div class="d-flex align-items-center p-3 rounded-3" style="background-color: rgba(13, 202, 240, 0.1)">
                                        <div class="rounded-circle bg-white p-2 me-3">
                                            <i class="fas fa-users text-info"></i>
                                        </div>
                                        <div>
                                            <small class="text-muted d-block">Positions</small>
                                            <span class="fw-medium">${internship.positions_available}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end mb-3">
                            <button class="btn btn-link text-decoration-none toggle-details" type="button" data-bs-toggle="collapse" data-bs-target="#details-${internship.id}">
                                See More Details<i class="fas fa-chevron-down ms-2"></i>
                            </button>
                        </div>

                        <div class="collapse" id="details-${internship.id}">
                            <!-- Description Section -->
                            <div class="mb-3 p-3 rounded-3" style="background-color: var(--bg)">
                                <h6 class="description-title d-flex align-items-center mb-2">
                                    <span class="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                                        <i class="fas fa-info-circle text-primary"></i>
                                    </span>
                                    Description
                                </h6>
                                <p class="description-text mb-0">${internship.description || 'No description available'}</p>
                            </div>

                            <!-- Requirements Section -->
                            <div class="mb-3 p-3 rounded-3" style="background-color: var(--bg)">
                                <h6 class="description-title d-flex align-items-center mb-2">
                                    <span class="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                                        <i class="fas fa-list-check text-warning"></i>
                                    </span>
                                    Requirements
                                </h6>
                                <p class="description-text mb-0">${internship.requirements || 'No specific requirements listed'}</p>
                            </div>

                            <!-- Skills Section -->
                            <div class="mb-3 p-3 rounded-3" style="background-color: var(--bg)">
                                <h6 class="description-title d-flex align-items-center mb-2">
                                    <span class="rounded-circle bg-success bg-opacity-10 p-2 me-2">
                                        <i class="fas fa-tools text-success"></i>
                                    </span>
                                    Required Skills
                                </h6>
                                <div class="d-flex flex-wrap gap-2">
                                    ${skills.length > 0 ? 
                                        skills.map(skill => 
                                            `<span class="badge rounded-pill bg-light border border-success text-success px-3 py-2">
                                                ${typeof skill === 'string' ? skill : skill.name}
                                            </span>`
                                        ).join('') : 
                                        '<span class="text-muted">No specific skills required</span>'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add handleAjaxError function at the beginning
    function handleAjaxError(xhr) {
        isLoading = false;
        if (xhr.status === 401) {
            showError('Your session has expired. Please log in again.');
        } else {
            const errorMessage = xhr.responseJSON?.error || 'Failed to load data. Please try again later.';
            showError(errorMessage);
        }
        console.error('Error:', xhr);
    }

    // Update loadInternships to handle expired filter
    function loadInternships(search = '', filter = 'all') {
        if (isLoading) return;
        showLoading();

        const token = getCookie('token');
        if (!token) {
            showError('Authentication required. Please log in.');
            return;
        }

        // For My Applications filter
        if (filter === 'applied') {
            $.ajax({
                url: '/api/student/applications/',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRFToken': getCookie('csrftoken')
                },
                success: function(applications) {
                    isLoading = false;
                    const internshipsList = $('#internshipsList');
                    internshipsList.empty();

                    if (!applications || applications.length === 0) {
                        $('#emptyState').removeClass('d-none');
                        return;
                    }

                    $('#emptyState').addClass('d-none');
                    
                    // Create a promise array for all API calls
                    const promises = applications.map(app => {
                        return new Promise((resolve, reject) => {
                            // First get the complete internship details
                            $.ajax({
                                url: `/api/internship/details/${app.internship.id}/`,
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'X-CSRFToken': getCookie('csrftoken')
                                },
                                success: function(internship) {
                                    // Then get the university details
                                    $.ajax({
                                        url: `/api/university/details/${internship.university}/`,
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'X-CSRFToken': getCookie('csrftoken')
                                        },
                                        success: function(university) {
                                            // Merge all data
                                            const fullInternship = {
                                                ...internship,
                                                university: university,
                                                university_name: university.Name, // Use the Name field from university model
                                                application_status: app.status,
                                                skills_required: internship.skills_required || [],
                                                requirements: internship.requirements || '',
                                                description: internship.description || '',
                                                positions_available: internship.positions_available || 0,
                                                duration_months: internship.duration_months || 0,
                                                location: internship.location || 'Remote',
                                                stipend: internship.stipend || 0
                                            };
                                            resolve(fullInternship);
                                        },
                                        error: function(xhr) {
                                            console.error('Error fetching university details:', xhr);
                                            resolve({
                                                ...internship,
                                                university: { Name: 'Unknown University' },
                                                university_name: 'Unknown University',
                                                application_status: app.status
                                            });
                                        }
                                    });
                                },
                                error: function(xhr) {
                                    console.error('Error fetching internship details:', xhr);
                                    reject(xhr);
                                }
                            });
                        });
                    });

                    // Wait for all API calls to complete
                    Promise.all(promises)
                        .then(internships => {
                            internships.forEach(internship => {
                                const card = createInternshipCard(internship, true, internship.application_status);
                                internshipsList.append(card);
                            });
                        })
                        .catch(error => {
                            console.error('Error loading applications:', error);
                            showError('Failed to load some application details');
                        });
                },
                error: function(xhr) {
                    handleAjaxError(xhr);
                }
            });
            return;
        }

        // For all other filters
        $.ajax({
            url: '/api/student/internships/',
            method: 'GET',
            data: { 
                search: search,
                sort_by: getSortBy(filter)
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            success: function(response) {
                isLoading = false;
                const internshipsList = $('#internshipsList');
                internshipsList.empty();

                if (!response.results || response.results.length === 0) {
                    $('#emptyState').removeClass('d-none');
                    updateStats({ results: [] });
                    return;
                }

                const now = new Date();
                let filteredInternships = response.results;

                // Filter based on deadline
                if (filter === 'expired') {
                    filteredInternships = response.results.filter(internship => {
                        const deadline = new Date(internship.application_deadline);
                        return deadline < now;
                    });
                } else if (filter !== 'all') {
                    filteredInternships = response.results.filter(internship => {
                        const deadline = new Date(internship.application_deadline);
                        return deadline >= now;
                    });
                }

                if (filteredInternships.length === 0) {
                    $('#emptyState').removeClass('d-none');
                    updateStats({ results: [] });
                    return;
                }

                $('#emptyState').addClass('d-none');

                // Create a promise array for fetching university details and application status
                const promises = filteredInternships.map(internship => {
                    return new Promise((resolve, reject) => {
                        // First get university details
                        $.ajax({
                            url: `/api/university/details/${internship.university}/`,
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            success: function(university) {
                                // Then get application status if user has applied
                                if (appliedInternships.has(internship.id)) {
                                    $.ajax({
                                        url: '/api/student/applications/',
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'X-CSRFToken': getCookie('csrftoken')
                                        },
                                        success: function(applications) {
                                            const application = applications.find(app => app.internship.id === internship.id);
                                            resolve({
                                                ...internship,
                                                university: university,
                                                university_name: university.Name,
                                                application_status: application ? application.status : null
                                            });
                                        },
                                        error: function(xhr) {
                                            console.error('Error fetching application status:', xhr);
                                            resolve({
                                                ...internship,
                                                university: university,
                                                university_name: university.Name
                                            });
                                        }
                                    });
                                } else {
                                    resolve({
                                        ...internship,
                                        university: university,
                                        university_name: university.Name
                                    });
                                }
                            },
                            error: function(xhr) {
                                console.error('Error fetching university details:', xhr);
                                resolve(internship);
                            }
                        });
                    });
                });

                // Wait for all details to be fetched
                Promise.all(promises)
                    .then(internships => {
                        internships.forEach(internship => {
                            const hasApplied = Array.from(appliedInternships).some(id => 
                                id.toString() === internship.id.toString()
                            );
                            const card = createInternshipCard(internship, hasApplied, internship.application_status);
                            internshipsList.append(card);
                        });
                        updateStats({ results: filter === 'expired' ? [] : internships });
                    })
                    .catch(error => {
                        console.error('Error loading internships:', error);
                        showError('Failed to load some internship details');
                    });
            },
            error: function(xhr) {
                handleAjaxError(xhr);
            }
        });
    }

    // Handle collapse events for see more/less buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-details')) {
            const button = e.target.closest('.toggle-details');
            const collapse = document.querySelector(button.dataset.bsTarget);
            
            if (collapse.classList.contains('show')) {
                button.innerHTML = 'See More Details<i class="fas fa-chevron-down ms-2"></i>';
            } else {
                button.innerHTML = 'See Less<i class="fas fa-chevron-up ms-2"></i>';
            }
        }
    });

    // Handle application submission
    $('#submitApplication').click(function() {
        const token = getCookie('token');
        if (!token) {
            showError('Authentication required. Please log in.');
            return;
        }

        const internshipId = $('#applicationModal').data('internship-id');
        const formData = new FormData();
        formData.append('internship_id', internshipId);
        
        // Add optional files if provided
        const resumeFile = $('#resume')[0].files[0];
        const cvFile = $('#cv')[0].files[0];
        
        if (resumeFile) {
            if (resumeFile.size > 5 * 1024 * 1024) {
                showError('Resume file size must be less than 5MB');
                return;
            }
            formData.append('resume', resumeFile);
        }
        
        if (cvFile) {
            if (cvFile.size > 5 * 1024 * 1024) {
                showError('CV file size must be less than 5MB');
                return;
            }
            formData.append('cv', cvFile);
        }
        
        // Disable submit button and show loading state
        const submitBtn = $(this);
        submitBtn.prop('disabled', true);
        submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...');
        
        $.ajax({
            url: '/api/internship/apply/',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            success: function(response) {
                // Show success message
                showToast('Application submitted successfully!', 'primary');
                
                // Close the modal and reset form
                $('#applicationModal').modal('hide');
                $('#applicationForm')[0].reset();
                
                // Update the UI immediately
                appliedInternships.add(internshipId);

                // Get the current internship details and update the card
                $.ajax({
                    url: `/api/internship/details/${internshipId}/`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    success: function(internship) {
                        // Get university details
                        $.ajax({
                            url: `/api/university/details/${internship.university}/`,
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            success: function(university) {
                                const updatedInternship = {
                                    ...internship,
                                    university: university,
                                    university_name: university.Name,
                                    application_status: '0' // Initial status is pending
                                };

                                // Create new card with updated data
                                const newCard = createInternshipCard(updatedInternship, true, '0');
                                
                                // Replace the old card with the new one
                                const oldCard = $(`.apply-btn[data-id="${internshipId}"]`).closest('.internship-card');
                                oldCard.replaceWith(newCard);
                            },
                            error: function(xhr) {
                                console.error('Error fetching university details:', xhr);
                            }
                        });
                    },
                    error: function(xhr) {
                        console.error('Error fetching internship details:', xhr);
                    }
                });
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    showError('Your session has expired. Please log in again.');
                } else {
                    const errorMessage = xhr.responseJSON?.error || 'Failed to submit application. Please try again.';
                    showError(errorMessage);
                }
            },
            complete: function() {
                // Reset button state
                submitBtn.prop('disabled', false);
                submitBtn.html('<i class="fas fa-paper-plane me-2"></i>Submit Application');
            }
        });
    });

    // Handle clicking Apply Now button
    $(document).on('click', '.apply-btn', function() {
        const internshipId = $(this).data('id');
        $('#applicationModal').data('internship-id', internshipId).modal('show');
    });

    // Reset form when application modal is closed
    $('#applicationModal').on('hidden.bs.modal', function() {
        $('#applicationForm')[0].reset();
    });

    // Helper function to show success message
    function showSuccess(message) {
        const toast = `
            <div class="toast align-items-center text-white border-0" style="background: green" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-check-circle me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        const toastContainer = $('.toast-container');
        toastContainer.append(toast);
        const toastElement = toastContainer.children().last();
        const bsToast = new bootstrap.Toast(toastElement);
        bsToast.show();
        
        // Remove toast after it's hidden
        toastElement.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // Helper functions
    function getStatusBadgeColor(daysLeft) {
        if (daysLeft <= 3) return 'danger';
        if (daysLeft <= 7) return 'warning';
        return 'success';
    }

    function getSortBy(filter) {
        switch(filter) {
            case 'recent': return '-created_at';
            case 'stipend': return '-stipend';
            case 'deadline': return 'application_deadline';
            case 'ended': return '-application_deadline';
            case 'applied': return '-created_at';
            default: return '-created_at';
        }
    }

    // Add counter animation for stats
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Update stats with animation
    function updateStats(response) {
        if (response.results) {
            const internships = response.results;
            const now = new Date();
            
            const activeInternships = internships.filter(i => {
                const deadline = new Date(i.application_deadline);
                return deadline >= now;
            });
            
            const totalInternships = document.getElementById('totalInternships');
            const totalCompanies = document.getElementById('totalCompanies');
            const closingToday = document.getElementById('closingToday');

            animateValue(totalInternships, 0, activeInternships.length, 1000);
            
            const universities = new Set(activeInternships.map(i => i.university?.name || i.university_name || 'Unknown'));
            animateValue(totalCompanies, 0, universities.size, 1000);
            
            const today = now.toDateString();
            const closingTodayCount = activeInternships.filter(i => {
                const deadline = new Date(i.application_deadline);
                return deadline.toDateString() === today;
            }).length;
            animateValue(closingToday, 0, closingTodayCount, 1000);
        } else {
            ['totalInternships', 'totalCompanies', 'closingToday'].forEach(id => {
                document.getElementById(id).innerHTML = '0';
            });
        }
    }

    // Add CSS styles for the days left badge to match Apply Now button
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .card-header .badge {
            padding: 12px 30px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 50px;
            background-color: var(--bg);
        }
        .card-header .d-flex.align-items-center.gap-3 {
            gap: 15px !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Initialize page
    loadAppliedInternships().then(() => {
        loadInternships();  // Load internships after applied internships are loaded
    });
}); 