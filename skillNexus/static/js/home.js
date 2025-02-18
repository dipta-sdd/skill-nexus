// User Types Carousel Animation
function initUserTypesCarousel() {
    const items = document.querySelectorAll('.user-type-item');
    let currentIndex = 0;

    function showNext() {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }

    // Show first item immediately
    items[0].classList.add('active');

    // Start the carousel
    setInterval(showNext, 3000); // Change every 3 seconds
}

async function fetchStats() {
    console.log('Fetching stats...');
    try {
        // Fetch user statistics
        const userStatsResponse = await fetch('/api/public/user-stats');
        const userStats = await userStatsResponse.json();
        
        // Update user counts
        document.querySelector('.total-students').textContent = userStats.student_count || '0';
        document.querySelector('.total-educators').textContent = userStats.educator_count || '0';
        document.querySelector('.total-universities').textContent = userStats.university_count || '0';
        
        // Fetch course statistics
        const courseStatsResponse = await fetch('/api/public/course-stats');
        const courseStats = await courseStatsResponse.json();
        document.querySelector('.total-courses').textContent = courseStats.total_courses || '0';
        
        // Update popular courses
        const popularCoursesList = document.querySelector('.popular-courses-list');
        if (courseStats.popular_courses && courseStats.popular_courses.length > 0) {
            popularCoursesList.innerHTML = courseStats.popular_courses.map(course => `
                <div class="course-item bg-white p-3 rounded mb-2">
                    <h6>${course.title}</h6>
                    <p class="mb-0 text-muted">${course.course_outcome}</p>
                    <small class="text-primary">$${course.course_fee}</small>
                </div>
            `).join('');
        }
        
        // Fetch internship opportunities
        const internshipResponse = await fetch('/api/public/internship-stats');
        const internshipStats = await internshipResponse.json();
        
        // Update internships list
        const internshipsList = document.querySelector('.internships-list');
        if (internshipStats.recent_internships && internshipStats.recent_internships.length > 0) {
            internshipsList.innerHTML = internshipStats.recent_internships.map(internship => `
                <div class="internship-item bg-white p-3 rounded mb-2">
                    <h6>${internship.title}</h6>
                    <p class="mb-0 text-muted">
                        ${internship.location} • ${internship.duration_months} months
                        ${internship.stipend ? `• $${internship.stipend}/month` : ''}
                    </p>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error fetching statistics:', error);
        // Show fallback content for errors
        document.querySelectorAll('.stat-box h3').forEach(el => {
            if (el.textContent === '0') {
                el.textContent = 'N/A';
            }
        });
    }
}

// Initialize animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for user type items
    const userTypeItems = document.querySelectorAll('.user-type-item');
    userTypeItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('animate__animated', 'animate__fadeInUp');
    });

    // Initialize counter animation for statistics
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const animate = () => {
            const value = +counter.getAttribute('data-target');
            const data = +counter.innerText;
            const time = value / speed;

            if (data < value) {
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 1);
            } else {
                counter.innerText = value;
            }
        }
        animate();
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__fadeIn');
                entry.target.style.opacity = 1;
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Update statistics from API
    async function fetchStats() {
        try {
            const response = await fetch('/api/public/user-stats');
            const data = await response.json();
            
            // Update counters with data
            document.querySelector('.total-students').setAttribute('data-target', data.student_count || 0);
            document.querySelector('.total-educators').setAttribute('data-target', data.educator_count || 0);
            document.querySelector('.total-universities').setAttribute('data-target', data.university_count || 0);
            document.querySelector('.total-courses').setAttribute('data-target', data.course_count || 0);
            
            // Initialize counter animations
            initCounters();
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }

    // Initialize counter animations
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.innerText = '0';
            const target = counter.getAttribute('data-target');
            const increment = target / 100;
            
            const updateCounter = () => {
                const c = +counter.innerText;
                if (c < target) {
                    counter.innerText = Math.ceil(c + increment);
                    setTimeout(updateCounter, 10);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
        });
    }

    // Fetch initial statistics
    fetchStats();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    fetchStats();
    initUserTypesCarousel();
});

// Scroll animations
const sections = document.querySelectorAll('.role-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__fadeIn');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section)); 