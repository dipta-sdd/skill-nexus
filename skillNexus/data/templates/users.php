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
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="{%  static 'css/style.css' %}" />
    <link rel="stylesheet" href="{%  static 'css/users.css' %}" />
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
                <li class="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                <li class="breadcrumb-item" aria-current="page">User</li>
            </ol>
        </nav>

        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <div class="row mybg my-row">

            <div class="col-lg-8">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">

                            <strong class="my-color pe-2">Status:</strong>
                            <input value="Active" type="checkbox" class="mx-2 sta" autocomplete="off" /> <label
                                class="my-color"> Active
                            </label>
                            <input value="Suspended" type="checkbox" class="mx-2 sta" autocomplete="off" /> <label
                                class="my-color">
                                Suspended </label>
                            <input value="Banned" type="checkbox" class="mx-2 sta" autocomplete="off" /> <label
                                class="my-color"> Banned
                            </label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                            <strong class="my-color pe-2">Role:</strong>
                            <input value="Student" type="checkbox" class="mx-2 role" autocomplete="off" /> <label
                                class="my-color">
                                Student </label>
                            <input value="Freelancer" type="checkbox" class="mx-2 role" autocomplete="off" /> <label
                                class="my-color">
                                Freelancer </label>
                            <input value="Educator" type="checkbox" class="mx-2 role" autocomplete="off" /> <label
                                class="my-color">
                                Educator </label>
                            <input value="Employer" type="checkbox" class="mx-2 role" autocomplete="off" /> <label
                                class="my-color">
                                Employer </label>
                            <input value="University" type="checkbox" class="mx-2 role" autocomplete="off" /> <label
                                class="my-color">
                                University </label>
                            <input value="Admin" type="checkbox" class="mx-2 role" autocomplete="off" /> <label
                                class="my-color"> Admin
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="row p-0 m-0">
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Search"
                                aria-describedby="button-addon2">
                            <button class="btn btn-outline-primary px-3" type="button"><i
                                    class="fa-solid fa-magnifying-glass"></i></button>
                        </div>

                    </div>
                    <div class="col-12">
                        <div class="input-group">
                            <span class="input-group-text">Sort By</span>
                            <select class="form-control sort-by" name="sort_by">
                                <option value="username">Username: A-Z</option>
                                <option value="-username">Username: Z-A</option>
                                <option value="-last_login">Last Login: New-Old</option>
                                <option value="last_login">Last Login: Old-New</option>
                                <option value="-date_joined">Join Date: Old-New</option>
                                <option value="date_joined">Join Date: Old-New</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>

        </div>
        <div class="row mybg my-row">
            <div class=" table-responsive">
                <table class="table table-striped table-bordered align-middle">
                    <thead class="">
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Last Login</th>
                            <th style="min-width:11em">Status</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                    </tbody>
                </table>

            </div>

        </div>
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
        <!-- main body-->
    </div>
    </div>
    </div>




    <script src="{% static 'js/popper.min.js' %}"></script>
   
<script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/jquery-3.7.1.min.js' %}"></script>
    <script src="{% static 'js/script.js' %}"></script>
    <script src="{% static 'js/users.js' %}"></script>
    <script>
    $(document).ready(function() {
        on_page_load(['Admin']);
    });
    </script>
</body>

</html>