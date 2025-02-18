{% load static %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkilNexus</title>
    <link
      href="{% static 'css/bootstrap.min.css' %}"
      rel="stylesheet"
       
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <style>
      body{
        font-family: 'Cursive', cursive;
      }
        .progress-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 20px;
            overflow: hidden;
        }
        .progress-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .icon-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(0,0,0,0.05);
        }
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
        }
        .circular-chart {
            display: block;
            margin: 0 auto;
            max-width: 100%;
        }
        .circle-bg {
            fill: none;
            stroke: #eee;
            stroke-width: 3;
        }
        .circle {
            fill: none;
            stroke: #3498db;
            stroke-width: 3;
            stroke-linecap: round;
            transition: stroke-dasharray 0.3s ease;
        }
        .percentage {
            fill: #2c3e50;
            font-family: sans-serif;
            font-size: 0.5em;
            text-anchor: middle;
            font-weight: bold;
        }
        .performance-badge {
            padding: 8px 16px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .performance-Excellent {
            background-color: #d4edda;
            color: #155724;
        }
        .performance-Good {
            background-color: #cce5ff;
            color: #004085;
        }
        .performance-Average {
            background-color: #fff3cd;
            color: #856404;
        }
        .performance-Bad {
            background-color: #f8d7da;
            color: #721c24;
        }
        /* Add smooth animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .progress-card {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        .progress-card:nth-child(1) { animation-delay: 0.1s; }
        .progress-card:nth-child(2) { animation-delay: 0.2s; }
        .progress-card:nth-child(3) { animation-delay: 0.3s; }

        .metrics-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            padding: 20px;
        }

        .metric-card {
            position: relative;
            background: var(--bg);
            border-radius: 20px;
            padding: 25px;
            min-height: 200px; /* Set minimum height */
            height: 100%;
            transition: all 0.3s ease;
            border: 1px solid rgba(226, 232, 240, 0.8);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }

        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }

        /* Video Progress Card */
        .video-progress {
            position: relative;
        }

        .progress-ring {
            width: 160px;
            height: 160px;
            margin: 0 auto 20px;
            position: relative;
        }

        .progress-ring svg {
            transform: rotate(-90deg);
            filter: drop-shadow(0 4px 6px rgba(59, 130, 246, 0.1));
        }

        .progress-value {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }

        .progress-percentage {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
        }

        .progress-label {
            font-size: 0.9rem;
            color: #64748b;
            margin-top: 5px;
        }

        /* Watch Time Card */
        .watch-time {
            position: relative;
        }

        .time-display {
            text-align: center;
            padding: 20px 0;
        }

        .time-value {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(90deg, #06b6d4, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2;
        }

        .time-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
        }

        .time-icon i {
            font-size: 1.8rem;
            background: linear-gradient(90deg, #06b6d4, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Assignment Card */
        .assignment-card {
            position: relative;
        }

        .grade-display {
            text-align: center;
            padding: 20px 0;
        }

        .grade-value {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(90deg, #8b5cf6, #d946ef);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2;
            margin-bottom: 10px;
        }

        .performance-pill {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 100px;
            font-weight: 600;
            font-size: 0.9rem;
            margin: 10px 0;
            background: linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1));
        }

        .performance-Excellent {
            background: linear-gradient(90deg, #22c55e, #16a34a);
            color: white;
        }

        .performance-Good {
            background: linear-gradient(90deg, #3b82f6, #2563eb);
            color: white;
        }

        .performance-Average {
            background: linear-gradient(90deg, #f59e0b, #d97706);
            color: white;
        }

        .performance-Bad {
            background: linear-gradient(90deg, #ef4444, #dc2626);
            color: white;
        }

        .metric-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
            color:black;
            text-align: center;
        }

        .metric-subtitle {
            font-size: 0.9rem;
            color: #64748b;
            text-align: center;
            margin-top: 10px;
        }

        .submissions-count {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.9rem;
            color: #64748b;
            padding: 6px 12px;
            border-radius: 100px;
            background: rgba(226, 232, 240, 0.5);
            margin-top: 10px;
        }

        .assignment-submissions {
            grid-column: 1 / -1; /* Make it full width */
        }

        .submissions-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .filter-buttons {
            display: flex;
            gap: 10px;
        }

        .filter-btn {
            padding: 8px 16px;
            border-radius: 100px;
            border: none;
            background: #f1f5f9;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .filter-btn.active {
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            color: white;
        }

        .submissions-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 10px;
        }

        .submission-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: var(--bg);
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .submission-item:hover {
            transform: translateX(5px);
            background: var(--bg);
        }

        .submission-info {
            flex: 1;
        }

        .submission-title {
            font-weight: 600;
            color: black;
            margin-bottom: 4px;
        }

        .submission-date {
            font-size: 0.85rem;
            color: #64748b;
        }

        .submission-status {
            padding: 6px 12px;
            border-radius: 100px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .status-graded {
            background: #dcfce7;
            color: #166534;
        }

        .grade-badge {
            padding: 4px 12px;
            border-radius: 100px;
            background: #e0e7ff;
            color: #4f46e5;
            font-weight: 600;
        }

        .feedback-text {
            font-size: 0.9rem;
            color: #64748b;
            margin-top: 8px;
            display: none;
        }

        .submission-item.expanded .feedback-text {
            display: block;
        }

        /* Add styles for recent activity card */
        .recent-activity {
            grid-column: 1 / -1;  /* Make it full width */
        }

        .recent-activity .timeline {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 10px;
        }

        .activity-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            transition: all 0.3s ease;
        }

        .activity-item:last-child {
            border-bottom: none;
        }

        .activity-item:hover {
            background: rgba(226, 232, 240, 0.2);
            transform: translateX(5px);
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3b82f6;
        }

        .activity-details {
            flex: 1;
        }

        .activity-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: var(--bs-body-color);
        }

        .activity-meta {
            font-size: 0.875rem;
            color: #64748b;
        }

        .activity-date {
            margin-left: 1rem;
            padding-left: 1rem;
            border-left: 2px solid rgba(226, 232, 240, 0.8);
        }

        /* Update existing styles */
        .watch-time {
            min-height: 180px;
        }

        .assignment-card {
            min-height: 180px;
        }

        .progress-card {
            min-height: 180px;
        }

        .metric-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
            color:black;
        }

        .time-value {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin: 15px 0;
        }

        .time-label {
            font-size: 14px;
            color: #64748b;
        }

        /* Add some spacing between cards */
        .metrics-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            padding: 20px;
        }

        /* Make cards responsive */
        @media (max-width: 768px) {
            .metric-card {
                min-height: 160px;
            }
        }
    </style>
  </head>
  <body>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
      <div class="toast-container top-0 end-0 p-3">
        <!-- Then put toasts within -->
      </div>
    </div>
    {% include "sidebar.php" %}
  
        <div class="my-round" id="body">
          <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item"><a href="/courses">Courses</a></li>
              <li class="breadcrumb-item active">Course Progress</li>
            </ol>
          </nav>

          <div class="container py-4">
            {% if debug %}
            <div class="alert alert-info">
                <h5>Debug Information:</h5>
                <pre>
                Course ID: {{ course_id }}
                Total Lectures: {{ total_lectures }}
                Completed Videos: {{ completed_videos }}
                Total Watch Time: {{ total_watch_time }}
                Total Submissions: {{ total_submissions }}
                Average Grade: {{ avg_grade }}
                Performance Level: {{ performance_level }}
                </pre>
            </div>
            {% endif %}
            
            <!-- <h2 class="mb-4" style="color: #007bff; text-align: center;">Course Progress Overview</h2> -->
            
            <div class="metrics-container">
                <!-- Video Progress Card -->
                <div class="metric-card video-progress">
                    <h3 class="metric-title">Video Progress</h3>
                    <div class="progress-ring">
                        <svg viewBox="0 0 36 36" width="160" height="160">
                            <path class="circle-bg"
                                d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e2e8f0"
                                stroke-width="3"
                            />
                            <path id="progress-circle"
                                class="circle"
                                stroke-dasharray="0, 100"
                                d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="url(#progressGradient)"
                                stroke-width="3"
                                stroke-linecap="round"
                            />
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color: #3b82f6" />
                                    <stop offset="100%" style="stop-color: #8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="progress-value">
                            <div class="progress-percentage" id="completed-videos">0%</div>
                            <div class="progress-label">Completed</div>
                        </div>
                    </div>
                </div>

                <!-- Watch Time Card -->
                <div class="metric-card watch-time">
                    <h3 class="metric-title">Total Watch Time</h3>
                    <div class="time-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="time-display">
                        <div class="time-value" id="total-watch-time">0</div>
                        <div class="metric-subtitle">Minutes Spent Learning</div>
                    </div>
                </div>

                <!-- Assignment Card -->
                <div class="metric-card assignment-card">
                    <h3 class="metric-title">Assignment Score</h3>
                    <div class="grade-display">
                        <div class="grade-value" id="avg-grade">0%</div>
                        <div class="performance-pill" id="performance-badge">Not Rated</div>
                        <div class="submissions-count">
                            <i class="fas fa-file-alt"></i>
                            <span id="total-submissions">0</span> Submissions
                        </div>
                    </div>
                </div>

                <!-- Assignment Submissions Card -->
                <div class="metric-card assignment-submissions">
                    <h3 class="metric-title">Assignment Submissions</h3>
                    <div class="submissions-header">
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="pending">Pending</button>
                            <button class="filter-btn" data-filter="graded">Graded</button>
                        </div>
                    </div>
                    <div class="submissions-list" id="assignments-list">
                        <!-- Submissions will be populated here -->
                    </div>
                </div>

                <!-- Recent Activity Card -->
                <div class="metric-card recent-activity">
                    <h3 class="metric-title">Recent Activity</h3>
                    <div class="timeline" id="recent-activities">
                        <!-- Activities will be populated here -->
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>

    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    
    <script src="{% static 'js/see_progress.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
  </body>
</html>
 