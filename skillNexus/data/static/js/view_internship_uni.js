$(document).ready(function() {
    let currentInternships = [];
    let deleteId = null;

    // Load internships on page load
    loadInternships();

    // Event listeners for filters
    $('#searchInput').on('input', filterInternships);
    $('#statusFilter').on('change', filterInternships);

    // Function to load internships
    function loadInternships() {
        console.log('Loading internships...');
        const token = getCookie('token');
        
        // Convert status filter to numeric value
        let statusValue = null;
        switch($('#statusFilter').val()) {
            case 'active':
                statusValue = 1;
                break;
            case 'closed':
                statusValue = 0;
                break;
            case 'ended':
                statusValue = -1;
                break;
        }
        
        $.ajax({
            url: '/api/university/internships/',
            method: 'GET',
            data: {
                search: $('#searchInput').val(),
                status: statusValue
            },
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                console.log('Internships loaded:', response);
                currentInternships = response.results || [];
                filterInternships();  // Called only once
            },
            error: function(xhr, status, error) {
                console.error('Error loading internships:', {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });
                showToast(xhr.responseText || 'Error loading internships', 'error');
            }
        });
    }

    // Function to get days remaining until deadline
    function getDaysRemaining(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        return Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    }

    // Function to filter and display internships
    function filterInternships() {
        console.log('Filtering internships...');
        const searchTerm = $('#searchInput').val().toLowerCase();
        const statusFilter = $('#statusFilter').val();

        // Filter by search term and status only
        let filtered = currentInternships.filter(internship => {
            const matchesSearch = internship.title.toLowerCase().includes(searchTerm) ||
                                internship.description.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'active' && internship.status === 1) ||
                                (statusFilter === 'closed' && internship.status === 0) ||
                                (statusFilter === 'ended' && internship.status === -1);
            return matchesSearch && matchesStatus;
        });

        // Clear the table body before adding new rows
        const tbody = $('#internshipList');
        tbody.empty();

        if (filtered.length === 0) {
            $('#emptyState').removeClass('d-none');
            $('.table-responsive').addClass('d-none');
            return;
        }

        $('#emptyState').addClass('d-none');
        $('.table-responsive').removeClass('d-none');

        // Create a Map to store application counts
        const applicationCounts = new Map();

        // Create a single promise that resolves when all counts are fetched
        Promise.all(filtered.map(internship => 
            fetch(`/api/internship/application-count/${internship.id}/`, {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                applicationCounts.set(internship.id, data.count || 0);
            })
            .catch(() => {
                applicationCounts.set(internship.id, -1);
            })
        )).then(() => {
            // Render table only once after all counts are fetched
            filtered.forEach(internship => {
                const applicationCount = applicationCounts.get(internship.id);
                const row = $(`
                    <tr>
                        <td class="align-middle">
                            <div class="d-flex align-items-center">
                                <div class="ms-3">
                                    <h6 class="fw-bold mb-1">${internship.title}</h6>
                                    <p class="text-muted mb-0">
                                        <i class="fas fa-calendar-alt me-2"></i>
                                        ${new Date(internship.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="align-middle">
                            <span class="badge bg-info rounded-pill">
                                <i class="fas fa-users me-1"></i>${internship.positions_available}
                            </span>
                        </td>
                        <td class="align-middle">
                            ${applicationCount === -1 ? 
                                `<span class="badge bg-danger rounded-pill">
                                    <i class="fas fa-exclamation-circle me-1"></i>Error
                                </span>` :
                                `<a href="/view_applicant/${internship.id}/" 
                                   class="badge ${applicationCount > 0 ? 'bg-primary' : 'bg-secondary'} rounded-pill text-decoration-none"
                                   title="Click to view applicants">
                                    <i class="fas fa-file-alt me-1"></i>${applicationCount}
                                </a>`
                            }
                        </td>
                        <td class="align-middle">
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${new Date(internship.application_deadline).toLocaleDateString()}</span>
                                <small class="text-muted">
                                    <i class="fas fa-clock me-1"></i>${getDeadlineStatus(internship.application_deadline)}
                                </small>
                            </div>
                        </td>
                        <td class="align-middle">${getStatusBadge(internship)}</td>
                        <td class="align-middle">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${internship.id}">
                                    <i class="fas fa-edit me-1"></i>Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${internship.id}">
                                    <i class="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `);
                tbody.append(row);
            });
        });
    }

    // Helper function to create error row
    function createErrorRow(internship) {
        return $(`
            <tr>
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <div class="ms-3">
                            <h6 class="fw-bold mb-1">${internship.title}</h6>
                            <p class="text-muted mb-0">
                                <i class="fas fa-calendar-alt me-2"></i>
                                ${new Date(internship.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </td>
                <td class="align-middle">
                    <span class="badge bg-info rounded-pill">
                        <i class="fas fa-users me-1"></i>${internship.positions_available}
                    </span>
                </td>
                <td class="align-middle">
                    <span class="badge bg-danger rounded-pill">
                        <i class="fas fa-exclamation-circle me-1"></i>Error
                    </span>
                </td>
                <td class="align-middle">
                    <div class="d-flex flex-column">
                        <span class="fw-bold">${new Date(internship.application_deadline).toLocaleDateString()}</span>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>${getDeadlineStatus(internship.application_deadline)}
                        </small>
                    </div>
                </td>
                <td class="align-middle">${getStatusBadge(internship)}</td>
                <td class="align-middle">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${internship.id}">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${internship.id}">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    // Helper function to get deadline status
    function getDeadlineStatus(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Expires today';
        if (diffDays === 1) return 'Expires tomorrow';
        return `${diffDays} days left`;
    }

    // Helper function to get status badge
    function getStatusBadge(internship) {
        switch(internship.status) {
            case -1:
                return '<span class="badge bg-danger">Ended</span>';
            case 0:
                return '<span class="badge bg-secondary">Closed</span>';
            case 1:
                return '<span class="badge bg-success">Active</span>';
            default:
                return '<span class="badge bg-warning">Unknown</span>';
        }
    }

    // Handle edit button click
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const internship = currentInternships.find(i => i.id === id);
        
        $('#editId').val(id);
        $('#editTitle').val(internship.title);
        $('#editDescription').val(internship.description);
        $('#editRequirements').val(internship.requirements);
        $('#editDuration').val(internship.duration_months);
        $('#editStipend').val(internship.stipend || '');
        $('#editLocation').val(internship.location);
        $('#editPositions').val(internship.positions_available);
        $('#editDeadline').val(internship.application_deadline);
        $('#editStartDate').val(internship.start_date);
        $('#editStatus').val(internship.status.toString());

        $('#editModal').modal('show');
    });

    // Update the select options for sorting
    $('#sortBy').remove();

    // Handle save edit with immediate update
    $('#saveEdit').click(function() {
        const id = $('#editId').val();
        const formData = new FormData();
        
        formData.append('id', id);
        formData.append('title', $('#editTitle').val());
        formData.append('description', $('#editDescription').val());
        formData.append('requirements', $('#editRequirements').val());
        formData.append('duration_months', $('#editDuration').val());
        const stipendValue = $('#editStipend').val();
        formData.append('stipend', stipendValue === '' ? '0' : stipendValue);
        formData.append('location', $('#editLocation').val());
        formData.append('positions_available', $('#editPositions').val());
        formData.append('application_deadline', $('#editDeadline').val());
        formData.append('start_date', $('#editStartDate').val());
        formData.append('status', parseInt($('#editStatus').val()));

        $.ajax({
            url: '/api/internship/update/',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function(response) {
                // Update the internship in currentInternships array
                const index = currentInternships.findIndex(i => i.id === parseInt(id));
                if (index !== -1) {
                    currentInternships[index] = {
                        ...currentInternships[index],
                        title: $('#editTitle').val(),
                        description: $('#editDescription').val(),
                        requirements: $('#editRequirements').val(),
                        duration_months: parseInt($('#editDuration').val()),
                        stipend: stipendValue === '' ? 0 : parseFloat(stipendValue),
                        location: $('#editLocation').val(),
                        positions_available: parseInt($('#editPositions').val()),
                        application_deadline: $('#editDeadline').val(),
                        start_date: $('#editStartDate').val(),
                        status: parseInt($('#editStatus').val())
                    };
                }
                
                // Hide modal and show success message
                $('#editModal').modal('hide');
                showToast('Internship updated successfully', 'success');
                
                // Refresh the display without reloading
                filterInternships();
            },
            error: function(xhr) {
                console.error('Error updating internship:', xhr.responseText);
                showToast(xhr.responseText || 'Error updating internship', 'error');
            }
        });
    });

    // Handle delete button click with direct deletion
    $(document).on('click', '.delete-btn', function() {
        const deleteId = $(this).data('id');
        
        $.ajax({
            url: '/api/internship/delete/',
            method: 'DELETE',
            data: JSON.stringify({ id: deleteId }),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function() {
                // Remove the deleted internship from the array
                currentInternships = currentInternships.filter(internship => internship.id !== deleteId);
                showToast('Internship deleted successfully', 'success');
                // Refresh the display without reloading
                filterInternships();
            },
            error: function(xhr) {
                showToast('Error deleting internship', 'error');
            }
        });
    });

    // Add click handler for view applicants button
    $(document).on('click', '.view-applicants-btn', function(e) {
        e.preventDefault();
        const internshipId = $(this).data('internship-id');
        
        $.ajax({
            url: `/api/view_applicants/${internshipId}/`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function(response) {
                console.log('Applicants data:', response);
                // Here you can either:
                // 1. Show the data in a modal
                showApplicantsModal(response);
                // 2. Navigate to a new page
                // window.location.href = `/view_applicants/${internshipId}`;
            },
            error: function(xhr, status, error) {
                console.error('Error fetching applicants:', xhr.responseText);
                showToast('error', 'Failed to load applicants data');
            }
        });
    });

    // Function to show applicants in a modal
    function showApplicantsModal(data) {
        const modal = $(`
            <div class="modal fade" id="applicantsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Applicants for ${data.internship.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Education</th>
                                            <th>Experience</th>
                                            <th>Documents</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.applicants.map(applicant => `
                                            <tr>
                                                <td>
                                                    <div class="d-flex flex-column">
                                                        <span class="fw-bold">${applicant.student.name}</span>
                                                        <small class="text-muted">${applicant.student.email}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    ${applicant.student.education.map(edu => `
                                                        <div class="mb-1">
                                                            <span class="fw-bold">${edu.level} in ${edu.degree}</span><br>
                                                            <small>${edu.institute} (${edu.passing_year})</small>
                                                        </div>
                                                    `).join('')}
                                                </td>
                                                <td>
                                                    ${applicant.student.experience.map(exp => `
                                                        <div class="mb-1">
                                                            <span class="fw-bold">${exp.position_title}</span><br>
                                                            <small>${exp.company_name}</small>
                                                        </div>
                                                    `).join('')}
                                                </td>
                                                <td>
                                                    ${applicant.student.resume_url ? 
                                                        `<a href="${applicant.student.resume_url}" target="_blank" class="btn btn-sm btn-outline-primary mb-1">
                                                            <i class="fas fa-file-alt me-1"></i>Resume
                                                        </a>` : ''
                                                    }
                                                    ${applicant.student.cv_url ? 
                                                        `<a href="${applicant.student.cv_url}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-file-alt me-1"></i>CV
                                                        </a>` : ''
                                                    }
                                                </td>
                                                <td>
                                                    <span class="badge bg-${getStatusBadgeClass(applicant.status)}">
                                                        ${getStatusText(applicant.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Remove any existing modal
        $('#applicantsModal').remove();
        
        // Add new modal to body
        $('body').append(modal);
        
        // Show the modal
        new bootstrap.Modal(modal[0]).show();
    }

    // Helper function to get status badge class
    function getStatusBadgeClass(status) {
        switch(status) {
            case 0: return 'secondary'; // Pending
            case 1: return 'success';   // Accepted
            case 2: return 'danger';    // Rejected
            default: return 'secondary';
        }
    }

    // Helper function to get status text
    function getStatusText(status) {
        switch(status) {
            case 0: return 'Pending';
            case 1: return 'Accepted';
            case 2: return 'Rejected';
            default: return 'Unknown';
        }
    }

    // Helper function to show toast messages
    function showToast(message, type) {
        const toast = $(`
            <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `);
        $('.toast-container').append(toast);
        const bsToast = new bootstrap.Toast(toast[0], {
            delay: 5000
        });
        bsToast.show();
        
        toast.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // Helper function to get CSRF token
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