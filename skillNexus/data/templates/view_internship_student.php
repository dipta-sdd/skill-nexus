{% load static %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkillNexus</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      /* Base font styles */
      body {
        font-family: 'Inter', sans-serif;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      /* Make text more visible in both modes */
      .card-title, .stats-info h3 {
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      .text-muted {
        opacity: 0.85 !important;
      }

      /* Search and filter container */
      .search-filter-container {
        background: var(--mybg);
        border: 2px solid var(--my-color);
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 10px;
        box-shadow: 0 5px 15px rgba(var(--my-color-rgb), 0.1);
      }

      .search-wrapper {
        position: relative;
        padding: 0;
        border-radius: 30px;
        margin-bottom: 8px;
        background: var(--mybg);
        border: 2px solid var(--my-color);
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(var(--my-color-rgb), 0.1);
      }

      .search-wrapper:focus-within {
        box-shadow: 0 0 0 3px rgba(var(--my-color-rgb), 0.2);
      }

      .search-input {
        width: 100%;
        border: none;
        background: transparent;
        padding: 10px 20px 10px 50px;
        font-size: 1.1em;
        font-weight: 500;
        color: var(--my-color);
        border-radius: 30px;
      }

      .search-input:focus {
        outline: none;
      }

      .search-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--my-color);
        font-size: 1.2em;
        pointer-events: none;
      }

      /* Filter section below search */
      .filter-section {
        margin: 0;
        padding: 8px 0 0 0;
        border-top: 2px solid var(--my-color);
      }

      .filter-chip {
        display: inline-flex;
        align-items: center;
        padding: 8px 15px;
        border-radius: 30px;
        margin: 3px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid var(--my-color);
        color: var(--my-color);
        font-weight: 500;
        background: var(--mybg);
      }

      .filter-chip i {
        margin-right: 8px;
        font-size: 1em;
      }

      .filter-chip:hover {
        background: rgba(var(--my-color-rgb), 0.1);
        transform: translateY(-2px);
      }

      .filter-chip.active {
        background: var(--my-color);
        color: var(--mybg);
      }

      /* Stats card with modern design */
      .stats-card {
        min-height: 160px;
        padding: 25px;
        border-radius: 20px;
        margin-bottom: 30px;
        background: var(--mybg);
        border: 2px solid var(--my-color);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: flex-start;
        gap: 20px;
      }

      .stats-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, 
          rgba(var(--my-color-rgb), 0.1) 0%, 
          rgba(var(--my-color-rgb), 0) 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .stats-card:hover::before {
        opacity: 1;
      }

      .stats-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--my-color);
        color: var(--mybg);
        font-size: 1.5em;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(var(--my-color-rgb), 0.2);
        flex-shrink: 0;
      }

      .stats-info {
        flex-grow: 1;
        text-align: left;
      }

      .stats-info p {
        margin: 0;
        font-size: 1.1em;
        font-weight: 500;
        color: var(--my-color);
        margin-bottom: 10px;
      }

      .stats-info h3 {
        font-size: 2.5em;
        font-weight: 700;
        margin: 0;
        color: var(--my-color);
        text-shadow: 2px 2px 4px rgba(var(--my-color-rgb), 0.1);
      }

      .stats-card:hover .stats-icon {
        transform: scale(1.1) rotate(10deg);
      }

      /* Internship card redesign */
      .internship-card {
        margin-bottom: 25px;
      }

      .card {
        border-radius: 15px;
        border: 2px solid var(--my-color);
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(var(--my-color-rgb), 0.15);
      }

      .card-header {
        background: rgba(var(--my-color-rgb), 0.05);
        border-bottom: 2px solid var(--my-color);
        padding: 20px;
        border-radius: 13px 13px 0 0;
      }

      .card-body {
        padding: 20px;
      }

      .card-title {
        font-size: 1.3em;
        font-weight: 600;
        margin-bottom: 5px;
      }

      /* Status badges */
      .status-pending {
        background: var(--my-color);
        color: var(--mybg);
        font-weight: 500;
        padding: 8px 15px;
        border-radius: 20px;
        box-shadow: 3px 3px 8px rgba(var(--my-color-rgb), 0.2);
      }

      .status-accepted {
        background: #28a745;
        color: var(--mybg);
        font-weight: 500;
        padding: 8px 15px;
        border-radius: 20px;
        box-shadow: 3px 3px 8px rgba(40, 167, 69, 0.2);
      }

      .status-rejected {
        background: #dc3545;
        color: var(--mybg);
        font-weight: 500;
        padding: 8px 15px;
        border-radius: 20px;
        box-shadow: 3px 3px 8px rgba(220, 53, 69, 0.2);
      }

      .card {
        border-radius: 25px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        background: var(--mybg);
        border: 2px solid var(--my-color);
        margin-bottom: 20px;
      }

      .card-header {
        padding: 25px;
        border-radius: 25px 25px 0 0;
        border-bottom: 2px solid var(--my-color);
        background: var(--mybg);
        color: var(--my-color);
      }

      .expanded-content {
        display: none;
        padding: 25px;
        border-top: 2px solid var(--my-color);
        color: var(--my-color);
      }

      .toggle-details {
        width: 100%;
        text-align: center;
        padding: 15px;
        margin-top: 10px;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--my-color);
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .toggle-details:hover {
        letter-spacing: 2px;
      }

      .skills-badge {
        padding: 10px 20px;
        border-radius: 50px;
        margin: 5px;
        background: var(--mybg);
        border: 1px solid var(--my-color);
        color: var(--my-color);
        transition: all 0.3s ease;
      }

      .skills-badge:hover {
        background: var(--my-color);
        color: var(--mybg);
      }

      .modal-content {
        border-radius: 20px;
        background: #ffffff !important;
        border: 2px solid var(--my-color);
      }

      .modal-header {
        background: var(--my-color);
        color: #ffffff;
        border-radius: 18px 18px 0 0;
        padding: 20px;
      }

      .modal-body {
        background: whitesmoke;
        color: var(--my-color);
        padding: 25px;
      }

      .modal-footer {
        background: #ffffff;
        border-top: 2px solid var(--my-color);
        border-radius: 0 0 18px 18px;
        padding: 20px;
      }

      .empty-state {
        padding: 80px 20px;
        text-align: center;
        background: var(--mybg);
        border-radius: 25px;
        border: 2px solid var(--my-color);
        margin-top: 30px;
        color: var(--my-color);
      }

      .empty-state i {
        font-size: 4em;
        margin-bottom: 20px;
        color: var(--my-color);
      }

      .btn-custom {
        border-radius: 50px;
        padding: 12px 30px;
        font-weight: 500;
        transition: all 0.3s ease;
        background: var(--bg);
        color: var(--mybg);
        border: none;
      }

      .btn-custom:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(var(--my-color-rgb), 0.2);
        color: var(--mybg);
      }

      .btn-outline-custom {
        border-radius: 50px;
        padding: 12px 30px;
        font-weight: 500;
        transition: all 0.3s ease;
        background: var(--bg);
        color: var(--mybg);
        border: 2px solid var(--my-color);
      }

      .btn-outline-custom:hover {
        background: var(--my-color);
        color: var(--mybg);
      }

      

      /* Form styling */
      .form-control {
        background: var(--mybg);
        border: 2px solid;
        color: var(--my-color);
      }

      .form-control:focus {
        background: var(--mybg);
        border-color: var(--my-color);
        color: var(--my-color);
        box-shadow: 0 0 0 0.25rem rgba(var(--my-color-rgb), 0.25);
      }

      .form-text {
        color: var(--my-color);
      }

      .alert-info {
        background: var(--mybg);
        border: 2px solid var(--my-color);
        color: var(--my-color);
      }

      /* Badge styling */
      .badge {
        background: var(--my-color);
        color: var(--mybg);
      }

      /* Links */
      a {
        color: var(--my-color);
        text-decoration: none;
      }

      a:hover {
        color: var(--my-color);
        opacity: 0.8;
      }

      /* New Stats Banner Design */
      .stats-banner {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 15px;
        background: linear-gradient(135deg, var(--my-color) 0%, rgba(var(--my-color-rgb), 0.8) 100%);
        border-radius: 20px;
        color: var(--mybg);
        margin-bottom: 10px;
      }

      .stats-item {
        min-height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        transition: transform 0.3s ease;
        text-align: center;
      }

      .stats-item:hover {
        transform: translateY(-5px);
      }

      .stats-icon-wrapper {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 1.5em;
        margin-bottom: 10px;
      }

      .stats-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }

      .stats-content p {
        font-size: 1.1em;
        font-weight: 600;
        margin: 0;
        opacity: 0.9;
      }

      .stats-content h3 {
        font-size: 2.5em;
        font-weight: 700;
        margin: 0;
        line-height: 1;
      }

      /* Internship list scrollbar */
      #internshipsList {
        max-height: calc(100vh - 250px);
        overflow-y: auto;
        padding-right: 10px;
        margin-top: 10px;
      }

      #internshipsList::-webkit-scrollbar {
        width: 8px;
      }

      #internshipsList::-webkit-scrollbar-track {
        background: rgba(var(--my-color-rgb), 0.1);
        border-radius: 10px;
      }

      #internshipsList::-webkit-scrollbar-thumb {
        background: var(--my-color);
        border-radius: 10px;
      }

      #internshipsList::-webkit-scrollbar-thumb:hover {
        background: rgba(var(--my-color-rgb), 0.8);
      }

      /* University name styling */
      .university-name {
        color: var(--my-color);
        font-weight: 500;
        font-size: 1.1em;
        font-family: 'Inter', sans-serif;
      }

      .university-name i {
        color: var(--my-color);
        opacity: 0.8;
      }

      /* Description and requirements styling */
      .description-title {
        color: var(--my-color);
        font-weight: 600;
        font-size: 1.1em;
        margin-bottom: 10px;
        font-family: 'Inter', sans-serif;
      }

      .description-text {
        color: var(--my-color);
        font-size: 1em;
        line-height: 1.6;
        opacity: 0.9;
      }

      /* Update card header university name */
      .card-header p.mb-0 {
        font-size: 1.1em;
        font-weight: 500;
        color: var(--my-color);
      }

      .card-header p.mb-0 i {
        color: var(--my-color);
        opacity: 0.8;
      }

      /* Internship details layout */
      .internship-details {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 10px 0;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        background: rgba(var(--my-color-rgb), 0.05);
        border-radius: 15px;
        font-size: 0.9em;
        color: var(--my-color);
      }

      .detail-item i {
        font-size: 1em;
        color: var(--my-color);
        opacity: 0.8;
      }

      /* Make details container flex and wrap */
      .card-body .row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 0;
      }

      .card-body .col-md-3,
      .card-body .col-6 {
        flex: 1;
        min-width: 150px;
        padding: 0;
      }

      /* Content Box Styling */
      .content-box {
        background: var(--bs-body-bg);
        border: 3px solid var(--my-color);
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.2);
      }

      /* Search Input Styling */
      .search-wrapper {
        position: relative;
        margin-bottom: 20px;
        border: 3px solid var(--my-color);
        border-radius: 15px;
        background: var(--bs-body-bg);
        box-shadow: 0 2px 8px rgba(var(--my-color-rgb), 0.15);
      }

      .search-input {
        width: 100%;
        padding: 12px 45px;
        border: 2px solid black;
        border-radius: 15px;
        background: transparent;
        color: var(--bs-emphasis-color);
        font-size: 1rem;
      }

      .search-input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--my-color-rgb), 0.2);
      }

      .search-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--my-color);
        font-size: 1.2em;
      }

      /* Filter Section */
      .filter-section {
        padding-top: 10px;
        border-top: 3px solid var(--my-color);
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .filter-chip {
        padding: 8px 16px;
        border-radius: 20px;
        border: 2px solid black;
        background: var(--bs-body-bg);
        color: var(--bs-emphasis-color);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        box-shadow: 0 2px 6px rgba(var(--my-color-rgb), 0.15);
      }

      .filter-chip:hover {
        background: var(--my-color);
        color: blue;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(var(--my-color-rgb), 0.2);
      }

      .filter-chip.active {
        background: var(--my-color);
        color: blue;
        font-weight: 600;
        box-shadow: 0 4px 8px rgba(var(--my-color-rgb), 0.8);
      }

      /* Stats Banner */
      .stats-banner {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 20px;
        padding: 10px;
      }

      .stats-item {
        text-align: center;
        flex: 1;
        min-width: 200px;
        padding: 20px;
        border-radius: 15px;
        background: var(--bs-body-bg);
        border: 1px solid black;
        box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.15);
        position: relative;
        overflow: hidden;
      }

      .stats-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px solid var(--my-color);
        border-radius: 15px;
        pointer-events: none;
      }

      .stats-icon-wrapper {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: var(--my-color);
        color: blue;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
        font-size: 28px;
        box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.3);
        border: 3px solid var(--my-color);
        position: relative;
      }

      .stats-icon-wrapper::after {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        border: 3px solid var(--my-color);
        border-radius: 50%;
      }

      .stats-content h3 {
        color: var(--bs-emphasis-color);
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .stats-content p {
        color: var(--bs-emphasis-color);
        font-weight: 500;
        margin: 0;
      }

      /* Dark Mode Adjustments */
      [data-bs-theme="dark"] .content-box,
      [data-bs-theme="dark"] .search-wrapper,
      [data-bs-theme="dark"] .filter-chip,
      [data-bs-theme="dark"] .stats-item {
        background: var(--bs-tertiary-bg);
        border-color: var(--my-color);
      }

      [data-bs-theme="dark"] .stats-icon-wrapper,
      [data-bs-theme="dark"] .stats-item::before,
      [data-bs-theme="dark"] .stats-icon-wrapper::after {
        border-color: var(--my-color);
      }

      [data-bs-theme="dark"] .search-input,
      [data-bs-theme="dark"] .filter-chip,
      [data-bs-theme="dark"] .stats-content h3,
      [data-bs-theme="dark"] .stats-content p {
        color: var(--bs-body-color);
      }

      /* Additional visibility improvements */
      .search-input::placeholder {
        color: var(--bs-emphasis-color);
        opacity: 0.7;
      }

      [data-bs-theme="dark"] .search-input::placeholder {
        color: var(--bs-body-color);
        opacity: 0.7;
      }

      /* Ensure internship cards are visible */
      .internship-card {
        border: 2px solid var(--my-color);
        background: var(--bs-body-bg);
        box-shadow: 0 4px 12px rgba(var(--my-color-rgb), 0.1);
      }

      [data-bs-theme="dark"] .internship-card {
        background: var(--bs-tertiary-bg);
      }
    </style>
  </head>
  <body>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
      <div class="toast-container top-0 end-0 p-3">
        <!-- Toast notifications will appear here -->
      </div>
    </div>
    
    {% include "sidebar.php" %}
  
    <div class="my-round" id="body">
      <nav aria-label="breadcrumb" class="mybg-t breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">Internship Opportunities</li>
        </ol>
      </nav>

      <div class="container py-4">
        <!-- Search and Filter Box -->
        <div class="content-box">
            <div class="search-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id="searchInput" 
                       placeholder="Search internships by title, skills, or description...">
            </div>
            <div class="filter-section">
                <span class="filter-chip active" data-filter="all">
                    <i class="fas fa-globe"></i>All Internships
                </span>
                <span class="filter-chip" data-filter="applied">
                    <i class="fas fa-check-circle"></i>My Applications
                </span>
                <span class="filter-chip" data-filter="recent">
                    <i class="fas fa-clock"></i>Most Recent
                </span>
                <span class="filter-chip" data-filter="stipend">
                    <i class="fas fa-money-bill"></i>Highest Stipend
                </span>
                <span class="filter-chip" data-filter="deadline">
                    <i class="fas fa-hourglass-end"></i>Deadline Soon
                </span>
                <span class="filter-chip" data-filter="expired">
                    <i class="fas fa-calendar-times"></i>Deadline Exceeded
                </span>
                <button class="filter-chip" id="clearFilters">
                    <i class="fas fa-times-circle"></i>Clear All
                </button>
            </div>
        </div>

        <!-- Stats Box -->
        <div class="content-box">
            <div class="stats-banner">
                <div class="stats-item">
                    <div class="stats-icon-wrapper">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="totalInternships">0</h3>
                        <p>Active Offers</p>
                    </div>
                </div>
                <div class="stats-item">
                    <div class="stats-icon-wrapper">
                        <i class="fas fa-university"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="totalCompanies">0</h3>
                        <p>Universities</p>
                    </div>
                </div>
                <div class="stats-item">
                    <div class="stats-icon-wrapper">
                        <i class="fas fa-hourglass-end"></i>
                    </div>
                    <div class="stats-content">
                        <h3 id="closingToday">0</h3>
                        <p>Closing Today</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Internships List Box -->
        <div class="content-box">
            <div class="row" id="internshipsList">
                <!-- Internships will be dynamically loaded here -->
            </div>
            <div class="empty-state d-none" id="emptyState">
                <div class="text-center">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h3>No Internships Found</h3>
                    <p class="text-muted">Try adjusting your search criteria</p>
                </div>
            </div>
        </div>

        <div class="modal fade" id="applicationModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header mybg-t text-white">
                <h5 class="modal-title" style="color: black;">
                  <i class="fas fa-paper-plane me-2"></i>Apply for Internship
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="applicationForm">
                  <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Resume and CV are optional. You can apply directly or include them if you wish.
                  </div>
                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-file-pdf me-2"></i>Resume (Optional)
                    </label>
                    <input type="file" class="form-control" id="resume" accept=".pdf,.doc,.docx">
                    <div class="form-text">Max file size: 5MB</div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">
                      <i class="fas fa-file-alt me-2"></i>CV (Optional)
                    </label>
                    <input type="file" class="form-control" id="cv" accept=".pdf,.doc,.docx">
                    <div class="form-text">Max file size: 5MB</div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-custom" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-custom" id="submitApplication">
                  <i class="fas fa-paper-plane me-2"></i>Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/view_internship_student.js' %}"></script>
    <script>
        $(document).ready(function() {
            on_page_load(["Student"]);
        });
    </script>
  </body>
</html>
 