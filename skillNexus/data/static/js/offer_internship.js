$(document).ready(function() {
    let allSkills = [];
    let selectedSkills = new Set();

    // Function to get CSRF token
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

    // Load skills for the dropdown
    function loadSkills() {
        $.ajax({
            url: '/api/skills/all',
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function(response) {
                allSkills = response;
                renderSkills(response);
            },
            error: function(xhr) {
                console.error('Error loading skills:', xhr);
                showToast('Error loading skills. Please refresh the page.', 'error');
            }
        });
    }

    // Start loading the page
    loadSkills();

    // Render skills as badges
    function renderSkills(skills) {
        const skillsList = $('#skillsList');
        skillsList.empty();
        
        skills.forEach(skill => {
            const isSelected = selectedSkills.has(skill.id);
            const badge = $(`
                <div class="col-auto mb-2">
                    <span class="skill-badge ${isSelected ? 'selected' : ''}" data-id="${skill.id}">
                        ${skill.name}
                    </span>
                </div>
            `);
            skillsList.append(badge);
        });
        updateSelectedSkillsDisplay();
    }

    // Handle skill search
    $('#skillSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredSkills = allSkills.filter(skill => 
            skill.name.toLowerCase().includes(searchTerm)
        );
        renderSkills(filteredSkills);
    });

    // Handle skill selection
    $(document).on('click', '.skill-badge', function() {
        const skillId = parseInt($(this).data('id'));
        if (selectedSkills.has(skillId)) {
            selectedSkills.delete(skillId);
        } else {
            selectedSkills.add(skillId);
        }
        $(this).toggleClass('selected');
        updateSelectedSkillsDisplay();
    });

    // Update selected skills display
    function updateSelectedSkillsDisplay() {
        const selectedSkillsContainer = $('.selected-skills');
        selectedSkillsContainer.empty();
        
        if (selectedSkills.size === 0) {
            selectedSkillsContainer.append('<span class="text-muted">No skills selected</span>');
            return;
        }
        
        selectedSkills.forEach(skillId => {
            const skill = allSkills.find(s => s.id === skillId);
            if (skill) {
                const badge = $(`
                    <span class="skill-badge" data-id="${skill.id}">
                        ${skill.name}
                        <i class="fas fa-times ms-2"></i>
                    </span>
                `);
                selectedSkillsContainer.append(badge);
            }
        });
    }

    // Date validation and handling
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    $('#deadline, #startDate').attr('min', todayStr);

    // Validate dates when either is changed
    $('#deadline, #startDate').on('change', function() {
        const deadline = new Date($('#deadline').val());
        const startDate = new Date($('#startDate').val());
        
        if (deadline && startDate) {
            if (deadline >= startDate) {
                $('#deadline')[0].setCustomValidity('Application deadline must be before start date');
                showToast('Application deadline must be before start date', 'error');
            } else {
                $('#deadline')[0].setCustomValidity('');
            }
        }
    });

    // Form validation
    function validateForm() {
        const form = $('#internshipForm')[0];
        form.classList.add('was-validated');

        // Validate dates
        const deadline = new Date($('#deadline').val());
        const startDate = new Date($('#startDate').val());
        
        if (deadline && startDate && deadline >= startDate) {
            $('#deadline')[0].setCustomValidity('Application deadline must be before start date');
            return false;
        }

        if (!form.checkValidity()) {
            return false;
        }

        if (selectedSkills.size === 0) {
            showToast('Please select at least one required skill', 'error');
            return false;
        }

        return true;
    }

    // Reset form
    window.resetForm = function() {
        const form = $('#internshipForm')[0];
        form.reset();
        form.classList.remove('was-validated');
        selectedSkills.clear();
        updateSelectedSkillsDisplay();
        renderSkills(allSkills);
        
        // Reset custom validity
        form.querySelectorAll('input').forEach(input => input.setCustomValidity(''));
    }

    // Handle form submission
    $('#internshipForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true)
            .html('<i class="fas fa-spinner fa-spin me-2"></i>Publishing...');

        // Create FormData object
        const formData = new FormData();
        formData.append('title', $('#title').val().trim());
        formData.append('description', $('#description').val().trim());
        formData.append('requirements', $('#requirements').val().trim());
        formData.append('duration_months', $('#duration').val());
        formData.append('stipend', $('#stipend').val() || '');
        formData.append('location', $('#location').val().trim());
        formData.append('positions_available', $('#positions').val());
        formData.append('application_deadline', $('#deadline').val());
        formData.append('start_date', $('#startDate').val());
        
        // Append skills as array
        Array.from(selectedSkills).forEach(skillId => {
            formData.append('skills_ids[]', skillId);
        });

        $.ajax({
            url: '/api/internship/create',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': `Bearer ${getCookie('token')}`
            },
            success: function(response) {
                showToast('Internship opportunity published successfully!', 'success');
                // Add delay before redirect to show the success message
                setTimeout(() => {
                    window.location.href = '/view_internship_uni';
                }, 1500);
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    showToast('Please log in to create an internship offer', 'error');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else if (xhr.status === 403) {
                    showToast('Only universities can create internship offers', 'error');
                } else {
                    const error = xhr.responseJSON?.error || 'Error publishing internship opportunity';
                    showToast(error, 'error');
                }
            },
            complete: function() {
                submitBtn.prop('disabled', false).html(originalText);
            }
        });
    });

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
        
        // Remove toast after it's hidden
        toast.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }
}); 