// ========================================
//   NAVBAR – Active Link on Scroll
// ========================================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

function updateActiveLink() {
    let scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionTop    = section.offsetTop - 90;
        const sectionHeight = section.offsetHeight;
        const sectionId     = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#" + sectionId) {
                    link.classList.add("active");
                }
            });
        }
    });
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();


// ========================================
//   NAVBAR – Collapse on Mobile Link Click
// ========================================

const navbarCollapse = document.getElementById("navbarNav");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navbarCollapse.classList.contains("show")) {
            const bsCollapse =
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
        }
    });
});


// ========================================
//   NAVBAR – Shrink on Scroll
// ========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.padding = "8px 0";
        navbar.style.boxShadow = "0 4px 20px rgba(15,23,42,0.12)";
    } else {
        navbar.style.padding = "15px 0";
        navbar.style.boxShadow = "0 4px 25px rgba(15,23,42,0.07)";
    }
});


// ========================================
//   SCROLL ANIMATIONS (Intersection Observer)
// ========================================

const animatedEls = document.querySelectorAll(
    ".skill-card, .project-card, .certificate-card, .timeline-item, .about-card"
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity    = "1";
                entry.target.style.transform  = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

animatedEls.forEach((el) => {
    el.style.opacity   = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});


// ========================================
//   CONTACT FORM – Submit to Backend
// ========================================

const contactForm = document.getElementById("contactForm");
const submitBtn   = contactForm ? contactForm.querySelector("button[type='submit']") : null;

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name    = document.getElementById("name").value.trim();
        const email   = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {
            showAlert("Please fill in all fields.", "danger");
            return;
        }

        // Disable button while sending
        submitBtn.disabled    = true;
        submitBtn.innerHTML   =
            '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending...';

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ name, email, subject, message })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showAlert("Message sent successfully! I'll get back to you soon.", "success");
                contactForm.reset();
            } else {
                showAlert(data.message || "Something went wrong. Please try again.", "danger");
            }

        } catch (err) {
            showAlert(
                "Unable to connect to the server. Please try again later.",
                "danger"
            );
        } finally {
            submitBtn.disabled  = false;
            submitBtn.innerHTML =
                'Send Message <i class="fa-solid fa-paper-plane ms-2"></i>';
        }
    });
}


// ========================================
//   HELPER – Show Alert Message
// ========================================

function showAlert(message, type) {
    // Remove any existing alert
    const existing = document.getElementById("form-alert");
    if (existing) existing.remove();

    const alert = document.createElement("div");
    alert.id          = "form-alert";
    alert.className   = `alert alert-${type} alert-dismissible fade show mt-3`;
    alert.role        = "alert";
    alert.innerHTML   = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"
            aria-label="Close"></button>
    `;

    contactForm.insertAdjacentElement("afterend", alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            bsAlert.close();
        }
    }, 5000);
}
