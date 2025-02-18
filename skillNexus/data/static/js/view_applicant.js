$(document).ready(function() {
    // Extract internship ID from URL path
    const pathParts = window.location.pathname.split('/');
    const internshipId = pathParts[pathParts.length - 2];
    
    // Store applicants data globally within this scope
    let applicantsData = [];
    
    console.log('Extracted Internship ID from URL:', internshipId);

    // Show loading spinner
    $('#loadingSpinner').removeClass('d-none');
    $('#applicantsContainer').addClass('d-none');
    $('#noApplicants').addClass('d-none');

    // Track current filter
    let currentFilter = 'pending'; // 'pending', 'reviewed'

    // Function to update application status
    function updateApplicationStatus(applicationId, newStatus) {
        $.ajax({
            url: '/api/update_application_status/',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`,
                'X-CSRFToken': getCookie('csrftoken')
            },
            data: {
                application_id: applicationId,
                status: newStatus
            },
            success: function(response) {
                // Refresh the applicants list
                loadApplicants();
                // Show success message
                showToast('Success', 'Application status updated successfully', 'success');
            },
            error: function(xhr, status, error) {
                console.error('Error updating status:', error);
                showToast('Error', 'Failed to update application status', 'error');
            }
        });
    }

    // Function to show toast messages
    function showToast(title, message, type = 'info') {
        const toast = `
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
                <div class="toast-header ${type === 'error' ? 'bg-danger text-white' : type === 'success' ? 'bg-success text-white' : 'bg-primary text-white'}">
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        $('.toast-container').append(toast);
        const toastElement = $('.toast').last();
        const bsToast = new bootstrap.Toast(toastElement);
        bsToast.show();
        toastElement.on('hidden.bs.toast', function () {
            $(this).remove();
        });
    }

    // Function to create applicant card
    function createApplicantCard(applicant, isExpanded = false) {
        const getStatusBadge = (status) => {
            switch(status) {
                case 0: return '<span class="badge bg-warning">Pending</span>';
                case 1: return '<span class="badge bg-success">Accepted</span>';
                case 2: return '<span class="badge bg-danger">Rejected</span>';
                default: return '<span class="badge bg-secondary">Unknown</span>';
            }
        };

        // Collapsed view (default)
        const collapsedView = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="square-img-container me-3">
                                ${applicant.student.profile_picture ? 
                                    `<img src="${applicant.student.profile_picture}" alt="Profile Picture" class="square-img">` :
                                    `<div class="square-img-placeholder">
                                        <i class="fas fa-user"></i>
                                    </div>`
                                }
                            </div>
                            <div>
                                <h5 class="mb-0">${applicant.student.first_name} ${applicant.student.last_name}</h5>
                                <small class="text-muted">${applicant.student.email}</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            ${getStatusBadge(applicant.status)}
                            <button class="btn btn-link view-details-btn ms-3" data-id="${applicant.application_id}">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Expanded view (full details)
        const expandedView = `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center" style="background: var(--bg);">
                    <div class="d-flex align-items-center">
                        <div class="square-img-container me-3">
                            ${applicant.student.profile_picture ? 
                                `<img src="${applicant.student.profile_picture}" alt="Profile Picture" class="square-img">` :
                                `<div class="square-img-placeholder">
                                    <i class="fas fa-user"></i>
                                </div>`
                            }
                        </div>
                        <div>
                            <h4 class="mb-0">${applicant.student.first_name} ${applicant.student.last_name}</h4>
                            <small class="text-muted">${applicant.student.email}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        ${getStatusBadge(applicant.status)}
                        <button class="btn btn-link collapse-details-btn ms-3" data-id="${applicant.application_id}">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Personal Information Section -->
                    <section class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">
                            <i class="fas fa-user-circle me-2"></i>Personal Information
                        </h5>
                        <div class="row">
                            <div class="col-md-6">
                                ${applicant.student.mobile ? `<p style="color: var(--bs-secondary-color) !important"><i class="fas fa-phone me-2"></i>${applicant.student.mobile}</p>` : ''}
                                ${applicant.student.country ? `<p style="color: var(--bs-secondary-color) !important"><i class="fas fa-map-marker-alt me-2"></i>${applicant.student.country}</p>` : ''}
                            </div>
                            <div class="col-md-6">
                                ${applicant.student.linkedin ? `<p class="mb-2"><i class="fab fa-linkedin me-2"></i><a href="${applicant.student.linkedin}" target="_blank">LinkedIn Profile</a></p>` : ''}
                                ${applicant.student.github ? `<p class="mb-2"><i class="fab fa-github me-2"></i><a href="${applicant.student.github}" target="_blank">GitHub Profile</a></p>` : ''}
                                ${applicant.student.portfolio ? `<p class="mb-2"><i class="fas fa-globe me-2"></i><a href="${applicant.student.portfolio}" target="_blank">Portfolio</a></p>` : ''}
                            </div>
                        </div>
                        ${applicant.student.bio ? `
                            <div class="mt-3">
                                <p class="text-muted"><i class="fas fa-info-circle me-2"></i>${applicant.student.bio}</p>
                            </div>
                        ` : ''}
                    </section>

                    <!-- Documents Section -->
                    <section class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">
                            <i class="fas fa-file-alt me-2"></i>Documents
                        </h5>
                        <div class="d-flex gap-2">
                            ${applicant.cv ? `
                                <a href="${applicant.cv}" target="_blank" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-file-pdf me-1"></i>View CV
                                </a>
                            ` : ''}
                            ${applicant.resume ? `
                                <a href="${applicant.resume}" target="_blank" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-file-alt me-1"></i>View Resume
                                </a>
                            ` : ''}
                        </div>
                    </section>

                    <!-- Education Section -->
                    <section class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">
                            <i class="fas fa-graduation-cap me-2"></i>Education
                        </h5>
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead class="table-light">
                                    <tr>
                                        <th>Level</th>
                                        <th>Degree</th>
                                        <th>Group/Major</th>
                                        <th>Institute</th>
                                        <th>Passing Year</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${applicant.education.map(edu => `
                                        <tr>
                                            <td>${edu.level.name}</td>
                                            <td>${edu.degree.name}</td>
                                            <td>${edu.group.name}</td>
                                            <td>${edu.institute}</td>
                                            <td>${edu.passing_year}</td>
                                            <td>
                                                ${edu.result_type === 'Grade' ? 
                                                    `GPA: ${edu.gpa}/${edu.gpa_scale}` : 
                                                    edu.result_type === 'Class' ? 
                                                        `Class: ${edu.result}` :
                                                        `Division: ${edu.result}`
                                                }
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    
                    <!-- Skills Section -->
                    <section class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">
                            <i class="fas fa-tools me-2"></i>Skills
                        </h5>
                        <div class="d-flex flex-wrap gap-2">
                            ${applicant.student.skills && applicant.student.skills.length > 0 ? 
                                applicant.student.skills.map(skill => 
                                    `<span class="badge bg-secondary">${skill.name}</span>`
                                ).join('') : 
                                '<p class="text-muted">No skills listed</p>'
                            }
                        </div>
                    </section>

                    <!-- Experience Section -->
                    <section class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">
                            <i class="fas fa-briefcase me-2"></i>Professional Experience
                        </h5>
                        ${applicant.experience.map(exp => `
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h6 class="mb-1">${exp.designation}</h6>
                                            <p class="mb-1" style="color: var(--bs-secondary-color) !important;">
                                                ${exp.organisation_name}
                                                <span class="text-muted">- ${exp.department}</span>
                                            </p>
                                            <small class="text-muted">
                                                <i class="fas fa-map-marker-alt me-1"></i>${exp.location}
                                            </small>
                                        </div>
                                        <div class="text-end">
                                            <p class="mb-1">
                                                ${new Date(exp.start_date).toLocaleDateString()} - 
                                                ${exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                                            </p>
                                            <small class="text-muted">
                                                Duration: ${exp.duration_year > 0 ? `${exp.duration_year} year${exp.duration_year > 1 ? 's' : ''}` : ''} 
                                                ${exp.duration_month > 0 ? `${exp.duration_month} month${exp.duration_month > 1 ? 's' : ''}` : ''}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('') || '<p class="text-muted">No experience details available</p>'}
                    </section>

                    <!-- Application Details -->
                    <section class="mt-4 pt-3 border-top">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>Applied on: ${new Date(applicant.applied_date).toLocaleString()}
                            </small>
                            ${applicant.status === 0 ? `
                                <div class="btn-group">
                                    <button class="btn btn-success btn-sm accept-btn" data-id="${applicant.application_id}">
                                        <i class="fas fa-check me-1"></i>Accept
                                    </button>
                                    <button class="btn btn-danger btn-sm reject-btn" data-id="${applicant.application_id}">
                                        <i class="fas fa-times me-1"></i>Reject
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </section>
                </div>
            </div>
        `;

        return isExpanded ? expandedView : collapsedView;
    }

    // Function to load applicants
    function loadApplicants() {
        $('#loadingSpinner').removeClass('d-none');
        $('#applicantsContainer').addClass('d-none');
        $('#noApplicants').addClass('d-none');

        $.ajax({
            url: `/api/view_applicants/${internshipId}/`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function(response) {
                console.log('Full Response:', response);
                
                if (response.applicants && response.applicants.length > 0) {
                    // Store the applicants data
                    applicantsData = response.applicants;
                    console.log('Applicants:', applicantsData);

                    // Update counters
                    updateCounters();

                    // Filter applicants based on current filter
                    const filteredApplicants = applicantsData.filter(app => {
                        if (currentFilter === 'pending') {
                            return app.status === 0;  // Pending
                        } else {
                            return app.status === 1 || app.status === 2;  // Accepted or Rejected
                        }
                    });
                    
                    if (filteredApplicants.length > 0) {
                        const applicantsHtml = filteredApplicants.map(applicant => 
                            createApplicantCard(applicant, false)
                        ).join('');
                        
                        $('#applicantsContainer').html(applicantsHtml).removeClass('d-none');
                    } else {
                        $('#noApplicants').removeClass('d-none');
                    }
                } else {
                    $('#noApplicants').removeClass('d-none');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching applicants:', error);
                $('#applicantsContainer').html(`
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Failed to load applicants data. Please try again later.
                    </div>
                `).removeClass('d-none');
            },
            complete: function() {
                $('#loadingSpinner').addClass('d-none');
            }
        });
    }

    // Function to update counters
    function updateCounters() {
        const pendingCount = applicantsData.filter(app => app.status === 0).length;
        const reviewedCount = applicantsData.filter(app => app.status === 1 || app.status === 2).length;
        $('#pendingCount').text(pendingCount);
        $('#reviewedCount').text(reviewedCount);
    }

    // Add CSS styles
    $('head').append(`
        <style>
            /* Card and Container Styles */
            .card {
                border-radius: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                border: none;
                transition: all 0.3s ease;
            }
            .card:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(0,0,0,0.1);
            }
            .card-header {
                background: linear-gradient(to right, #f8f9fa, #ffffff);
                border-bottom: 1px solid rgba(0,0,0,0.08);
                border-radius: 15px 15px 0 0 !important;
                padding: 1.25rem;
            }
            .card-header h4 {
                color: black;
                font-weight: 600;
            }
            .card-body {
                padding: 1.5rem;
            }

            /* Profile Image Styles */
            .square-img-container {
                width: 70px;
                height: 70px;
                overflow: hidden;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .square-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .square-img-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(45deg, #f8f9fa, #e9ecef);
                color: #adb5bd;
                font-size: 1.75rem;
            }

            /* Button Styles */
            .view-details-btn, .collapse-details-btn {
                color: #6c757d;
                width: 40px;
                height: 40px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            .view-details-btn:hover, .collapse-details-btn:hover {
                background-color: rgba(108, 117, 125, 0.1);
                color: #495057;
            }
            .view-details-btn i, .collapse-details-btn i {
                font-size: 1.1rem;
            }
            .btn-group .btn {
                border-radius: 10px;
                margin: 0 4px;
                padding: 0.5rem 1.25rem;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .filter-btn {
                padding: 0.75rem 1.5rem !important;
            }
            .btn-outline-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(13, 110, 253, 0.15);
            }

            /* Badge Styles */
            .badge {
                padding: 0.6em 1em;
                font-weight: 500;
                letter-spacing: 0.3px;
                border-radius: 8px;
            }

            /* Section Styles */
            section {
                margin-bottom: 2rem;
            }
            section:last-child {
                margin-bottom: 0;
            }
            .border-bottom {
                border-bottom: 2px solid rgba(0,0,0,0.05) !important;
            }
            h5.border-bottom {
                padding-bottom: 0.75rem;
                margin-bottom: 1.25rem;
            }

            /* Table Styles */
            .table {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .table th {
                background-color: #f8f9fa;
                font-weight: 600;
                padding: 1rem;
                border-bottom: 2px solid rgba(0,0,0,0.05);
            }
            .table td {
                padding: 1rem;
                vertical-align: middle;
            }
            .table-bordered {
                border: 1px solid rgba(0,0,0,0.05);
            }

            /* Skills Badges */
            .badge.bg-secondary {
                font-size: 0.85rem;
                padding: 0.6em 1.2em;
                margin: 0.25rem;
                background-color: #6c757d !important;
                transition: all 0.2s ease;
            }
            .badge.bg-secondary:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }

            /* Experience Cards */
            .experience-card {
                border-radius: 12px;
                border: 1px solid rgba(0,0,0,0.05);
                padding: 1.25rem;
                margin-bottom: 1rem;
                background-color: #fff;
                transition: all 0.2s ease;
            }
            .experience-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.08);
            }

            /* Document Links */
            .btn-outline-primary {
                border-radius: 8px;
                padding: 0.5rem 1.25rem;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .btn-outline-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(13, 110, 253, 0.15);
            }

            /* Loading Spinner */
            .spinner-border {
                width: 3rem;
                height: 3rem;
            }

            /* Toast Styles */
            .toast {
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .toast-header {
                border-radius: 12px 12px 0 0;
                padding: 0.75rem 1rem;
            }
            .toast-body {
                padding: 1rem;
            }

            /* Filter Section */
            .filter-section {
                margin-bottom: 2rem;
                padding: 1rem;
                background-color: var(--bg);
                border-radius: 15px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }

            /* Responsive Adjustments */
            @media (max-width: 768px) {
                .card-body {
                    padding: 1rem;
                }
                .square-img-container {
                    width: 50px;
                    height: 50px;
                }
                .btn-group .btn {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.9rem;
                }
            }
        </style>
    `);

    // Update filter buttons container
    $('#applicantsContainer').before(`
        <div class="filter-section">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Filter Applications</h5>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary filter-btn active" data-filter="pending">
                        <i class="fas fa-clock me-2"></i>Pending Review
                        <span class="badge bg-warning ms-2" id="pendingCount">0</span>
                    </button>
                    <button type="button" class="btn btn-outline-primary filter-btn" data-filter="reviewed">
                        <i class="fas fa-check-double me-2"></i>Reviewed
                        <span class="badge bg-info ms-2" id="reviewedCount">0</span>
                    </button>
                </div>
            </div>
        </div>
    `);

    // Event Handlers
    $(document).on('click', '.view-details-btn', function() {
        const applicationId = $(this).data('id');
        console.log('View Details clicked for application:', applicationId);
        console.log('Available applicants:', applicantsData);
        const applicant = applicantsData.find(a => a.application_id === applicationId);
        console.log('Found applicant:', applicant);
        if (applicant) {
            $(this).closest('.card').replaceWith(createApplicantCard(applicant, true));
        } else {
            console.error('Could not find applicant with ID:', applicationId);
        }
    });

    $(document).on('click', '.collapse-details-btn', function() {
        const applicationId = $(this).data('id');
        console.log('Collapse clicked for application:', applicationId);
        const applicant = applicantsData.find(a => a.application_id === applicationId);
        console.log('Found applicant:', applicant);
        if (applicant) {
            $(this).closest('.card').replaceWith(createApplicantCard(applicant, false));
        } else {
            console.error('Could not find applicant with ID:', applicationId);
        }
    });

    $(document).on('click', '.accept-btn', function() {
        const applicationId = $(this).data('id');
        updateApplicationStatus(applicationId, 1);
    });

    $(document).on('click', '.reject-btn', function() {
        const applicationId = $(this).data('id');
        updateApplicationStatus(applicationId, 2);
    });

    $(document).on('click', '.filter-btn', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        loadApplicants();
    });

    // Initial load
    loadApplicants();

    // Helper function to get cookie value
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
}); 