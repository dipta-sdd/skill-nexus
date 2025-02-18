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
              <li class="breadcrumb-item" aria-current="page">Login</li>
              <li class="breadcrumb-item" aria-current="page">View Internship</li>
            </ol>
          </nav>

          <!-- main body-->
          <div class="row mybg my-row">
            <div class="col-md-12">
              <div class="card shadow-lg">
                <div class="card-header bg-dark text-white py-4">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 class="card-title mb-1 display-6 fw-bold">
                        <i class="fas fa-briefcase me-3"></i>Your Internship Offers
                      </h3>
                      <p class="mb-0 mt-2 text-light opacity-75">
                        <i class="fas fa-info-circle me-2"></i>Manage and track your internship opportunities in one place
                      </p>
                    </div>
                    <a href="/offer_internship" class="btn btn-success btn-lg">
                      <i class="fas fa-plus-circle me-2"></i>Create New Offer
                    </a>
                  </div>
                </div>
                <div class="card-body p-4">
                  <!-- Filters -->
                  <div class="filters-section mb-4" style="background: var(--bg);">
                    <div class="row g-3 align-items-center">
                      <div class="col-md-4">
                        <div class="input-group" style="background: var(--bg);">
                          <span class="input-group-text border-end-0"style="background: var(--bg);">
                            <i class="fas fa-search text-muted"></i>
                          </span>
                          <input type="text" class="form-control border-start-0 ps-0" id="searchInput" placeholder="Search internships...">
                        </div>
                      </div>
                      <div class="col-md-4">
                        <select class="form-select" id="statusFilter">
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                          <option value="ended">Ended</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Internship List -->
                  <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Positions</th>
                          <th>Applications</th>
                          <th>Deadline</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody id="internshipList">
                        <!-- Internships will be loaded here -->
                      </tbody>
                    </table>
                  </div>

                  <!-- Empty State -->
                  <div id="emptyState" class="text-center py-5 d-none">
                    <img src="{% static 'images/empty.svg' %}" alt="No internships" class="mb-4" style="width: 200px; opacity: 0.5;">
                    <h3 class="text-muted mb-3">No Internships Found</h3>
                    <p class="text-muted mb-4">Start by creating your first internship offer</p>
                    <a href="/offer_internship" class="btn btn-primary btn-lg">
                      <i class="fas fa-plus-circle me-2"></i>Create Internship
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Modal -->
          <div class="modal fade" id="editModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title">
                    <i class="fas fa-edit me-2"></i>Edit Internship
                  </h5>
                  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                  <form id="editForm" class="needs-validation" novalidate>
                    <input type="hidden" id="editId">
                    
                    <!-- Title Section -->
                    <div class="mb-4">
                      <label class="form-label fw-bold">
                        <i class="fas fa-briefcase me-2"></i>Position Title
                      </label>
                      <input type="text" class="form-control form-control-lg" id="editTitle" required>
                    </div>

                    <!-- Description and Requirements Section -->
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-info-circle me-2"></i>Description
                        </label>
                        <textarea class="form-control" id="editDescription" rows="4" required></textarea>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-list-check me-2"></i>Requirements
                        </label>
                        <textarea class="form-control" id="editRequirements" rows="4" required></textarea>
                      </div>
                    </div>

                    <!-- Duration and Stipend -->
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-clock me-2"></i>Duration (months)
                        </label>
                        <input type="number" class="form-control" id="editDuration" required min="1">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-money-bill me-2"></i>Stipend
                        </label>
                        <input type="number" class="form-control" id="editStipend" min="0">
                      </div>
                    </div>

                    <!-- Location and Positions -->
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-location-dot me-2"></i>Location
                        </label>
                        <input type="text" class="form-control" id="editLocation" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-users me-2"></i>Positions Available
                        </label>
                        <input type="number" class="form-control" id="editPositions" required min="1">
                      </div>
                    </div>

                    <!-- Dates -->
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-calendar-alt me-2"></i>Application Deadline
                        </label>
                        <input type="date" class="form-control" id="editDeadline" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="fas fa-calendar-check me-2"></i>Start Date
                        </label>
                        <input type="date" class="form-control" id="editStartDate" required>
                      </div>
                    </div>

                    <!-- Status -->
                    <div class="mb-4">
                      <label class="form-label fw-bold">
                        <i class="fas fa-toggle-on me-2"></i>Status
                      </label>
                      <select class="form-select" id="editStatus">
                        <option value="1">Active</option>
                        <option value="0">Closed</option>
                        <option value="-1">Ended</option>
                      </select>
                      <div class="form-text mt-2">
                        <ul class="mb-0 ps-3">
                          <li><strong>Active:</strong> Internship is open for applications</li>
                          <li><strong>Closed:</strong> Manually close applications</li>
                          <li><strong>Ended:</strong> Past deadline/completed</li>
                        </ul>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer bg-light">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-2"></i>Cancel
                  </button>
                  <button type="button" class="btn btn-primary" id="saveEdit">
                    <i class="fas fa-save me-2"></i>Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete Confirmation Modal -->
          <div class="modal fade" id="deleteModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                  <h5 class="modal-title">
                    <i class="fas fa-exclamation-triangle me-2"></i>Confirm Delete
                  </h5>
                  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                  <p class="mb-0">Are you sure you want to delete this internship offer? This action cannot be undone.</p>
                </div>
                <div class="modal-footer bg-light">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-2"></i>Cancel
                  </button>
                  <button type="button" class="btn btn-danger" id="confirmDelete">
                    <i class="fas fa-trash me-2"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Toast Container -->
          <div class="toast-container position-fixed top-0 end-0 p-3">
            <!-- Toasts will be added here -->
          </div>
        </div>
      </div>
    </div>
    
    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/view_internship_uni.js' %}"></script>
    <script>
      $(document).ready(function () {
        on_page_load([]);
      });
    </script>
  </body>
</html>
 