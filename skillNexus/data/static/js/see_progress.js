$(document).ready(function() {
    const courseId = window.location.href.split('?')[1];
    console.log("Initial load - Course ID:", courseId);

    if (!courseId) {
        console.error("No course ID found in URL");
        showToast("Course ID not found", "danger");
        return;
    }

    // Fetch video progress
    $.ajax({
        url: `${apiLink}/api/progress/video/`,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + getCookie("token")
        },
        data: { course_id: courseId },
        success: function(videoData) {
            console.log("Video progress data:", videoData);
            updateVideoProgress(videoData);
        },
        error: function(err) {
            console.error("Video progress fetch error:", err);
            showToast("Failed to load video progress", "danger");
        }
    });

    // Fetch assignment progress
    $.ajax({
        url: `${apiLink}/api/progress/assignment/`,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + getCookie("token")
        },
        data: { course_id: courseId },
        success: function(assignmentData) {
            console.log("Assignment progress data:", assignmentData);
            updateAssignmentProgress(assignmentData);
        },
        error: function(err) {
            console.error("Assignment progress fetch error:", err);
            showToast("Failed to load assignment progress", "danger");
        }
    });
});

function updateVideoProgress(data) {
    console.log("Updating video progress with data:", data);

    // Update total watch time display
    const totalWatchTime = data.total_watch_time || 0;
    const formattedTime = formatWatchTime(totalWatchTime);
    $('#total-watch-time').html(`
        <div class="time-value">${formattedTime}</div>
        <div class="time-label">Total Watch Time</div>
    `);

    // Calculate completed videos based on watch time
    const completedCount = data.completed_videos || 0;
    const totalLectures = data.total_lectures || 0;
    
    // Update completion percentage
    $('#completed-videos').text(`${completedCount}/${totalLectures}`);
    const completionPercentage = (completedCount / totalLectures) * 100 || 0;
    updateProgressRing(completionPercentage);

    // Update recent activities
    const activityContainer = $('#recent-activities');
    activityContainer.empty();

    if (data.recent_activities && data.recent_activities.length > 0) {
        data.recent_activities.forEach(activity => {
            const watchTimeMinutes = (activity.watched_time / 60).toFixed(1);
            activityContainer.append(`
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">${activity.lecture__title}</div>
                        <div class="activity-meta">
                            Watched: ${watchTimeMinutes} minutes
                            <span class="activity-date">
                                ${new Date(activity.last_updated).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            `);
        });
    } else {
        activityContainer.append('<p class="text-muted">No recent activity found.</p>');
    }
}

// Helper function to format watch time
function formatWatchTime(minutes) {
    if (minutes < 1) {
        return "Less than a minute";
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    
    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    } else {
        return `${remainingMinutes}m`;
    }
}

function updateProgressRing(percentage) {
    const circle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 15.9155;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

function updateAssignmentProgress(data) {
    const submissionsList = $('#assignments-list');
    submissionsList.empty();

    // If we have the submissions array, use it
    if (data.submissions && Array.isArray(data.submissions)) {
        handleSubmissionsData(data.submissions);
    } 
    // If we only have total_submissions but no array, show placeholder
    else if (data.total_submissions > 0) {
        console.log(`Total submissions found: ${data.total_submissions}, but no detailed data`);
        
        submissionsList.append(`
            <div class="submission-item" data-status="pending">
                <div class="submission-info">
                    <div class="submission-title">Assignment Submitted</div>
                    <div class="submission-date">Pending Review</div>
                    <div class="feedback-text">Waiting for educator review</div>
                </div>
                <span class="submission-status status-pending">Pending Review</span>
            </div>
        `);

        // Update counters
        $('#total-submissions').text(`${data.total_submissions} (pending)`);
        $('.filter-btn[data-filter="all"]').text(`All (${data.total_submissions})`);
        $('.filter-btn[data-filter="pending"]').text(`Pending (${data.total_submissions})`);
        $('.filter-btn[data-filter="graded"]').text('Graded (0)');
    } 
    // If no submissions at all
    else {
        submissionsList.append('<p class="text-muted">No submissions found.</p>');
        
        // Reset counters
        $('#total-submissions').text('0');
        $('.filter-btn[data-filter="all"]').text('All (0)');
        $('.filter-btn[data-filter="pending"]').text('Pending (0)');
        $('.filter-btn[data-filter="graded"]').text('Graded (0)');
    }

    // Update performance badge if available
    if (data.performance_level) {
        const badge = $('#performance-badge');
        badge.text(data.performance_level);
        badge.removeClass().addClass(`performance-pill performance-${data.performance_level}`);
    }

    // Update average grade if available
    if (data.avg_grade !== undefined) {
        $('#avg-grade').text(`${data.avg_grade}%`);
    }
}

function handleSubmissionsData(submissions) {
    const submissionsList = $('#assignments-list');
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.status === 1).length;
    const pendingSubmissions = totalSubmissions - gradedSubmissions;

    submissions.forEach(submission => {
        const isGraded = submission.status === 1;
        
        submissionsList.append(`
            <div class="submission-item" data-status="${isGraded ? 'graded' : 'pending'}">
                <div class="submission-info">
                    <div class="submission-title">${submission.lecture_title}</div>
                    <div class="submission-date">Submitted on ${new Date(submission.submission_date).toLocaleDateString()}</div>
                    ${isGraded ? `
                        <div class="feedback-text">
                            <strong>Grade:</strong> <span class="grade-badge">${submission.grade}%</span>
                            <br>
                            <strong>Feedback:</strong> ${submission.feedback || 'No feedback provided'}
                        </div>
                    ` : '<div class="feedback-text">Waiting for educator review</div>'}
                </div>
                <span class="submission-status ${isGraded ? 'status-graded' : 'status-pending'}">
                    ${isGraded ? 'Graded' : 'Pending Review'}
                </span>
            </div>
        `);
    });

    // Update counters
    $('#total-submissions').text(`${totalSubmissions} (${gradedSubmissions} graded)`);
    $('.filter-btn[data-filter="all"]').text(`All (${totalSubmissions})`);
    $('.filter-btn[data-filter="pending"]').text(`Pending (${pendingSubmissions})`);
    $('.filter-btn[data-filter="graded"]').text(`Graded (${gradedSubmissions})`);
}

// Event Handlers
$(document).on('click', '.filter-btn', function() {
    const filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
        $('.submission-item').show();
    } else {
        $('.submission-item').hide();
        $(`.submission-item[data-status="${filter}"]`).show();
    }
});

$(document).on('click', '.submission-item', function() {
    $(this).toggleClass('expanded');
}); 