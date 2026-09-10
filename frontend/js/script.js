// ========================================
//   NAVBAR – Shrink on Scroll
// ========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.padding = "8px 0";
        navbar.style.boxShadow = "0 4px 22px rgba(15,23,42,0.12)";
    } else {
        navbar.style.padding = "15px 0";
        navbar.style.boxShadow = "0 2px 20px rgba(15,23,42,0.07)";
    }
});


// ========================================
//   NAVBAR – Active Link on Scroll
// ========================================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionTop    = section.offsetTop - 100;
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
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bsCollapse =
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
        }
    });
});


// ========================================
//   TYPED TEXT ANIMATION – Hero h2
// ========================================

const typedTexts   = ["MCA Student", "Full Stack Developer", "MERN Developer", "Web Designer"];
const typedTarget  = document.querySelector(".hero-section h2");
let   textIndex    = 0;
let   charIndex    = 0;
let   isDeleting   = false;

function typeEffect() {
    if (!typedTarget) return;

    const current = typedTexts[textIndex];

    if (isDeleting) {
        typedTarget.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTarget.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === current.length) {
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex  = (textIndex + 1) % typedTexts.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

// Start typed animation after 800ms
setTimeout(typeEffect, 800);


// ========================================
//   SCROLL ANIMATIONS (Intersection Observer)
// ========================================

const animatedEls = document.querySelectorAll(
    ".skill-card, .project-card, .certificate-card, .timeline-item, .about-card, .highlight-item"
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

animatedEls.forEach((el, i) => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(28px)";
    el.style.transition = `opacity 0.55s ease ${i * 0.05}s, transform 0.55s ease ${i * 0.05}s`;
    observer.observe(el);
});


// ========================================
//   CONTACT FORM – Submit to Backend
// ========================================

const contactForm = document.getElementById("contactForm");
const submitBtn   = contactForm
    ? contactForm.querySelector("button[type='submit']")
    : null;

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

        // Disable button + spinner
        submitBtn.disabled   = true;
        submitBtn.innerHTML  =
            '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending…';

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ name, email, subject, message })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showAlert(
                    "✅ Message sent successfully! I'll get back to you soon.",
                    "success"
                );
                contactForm.reset();
            } else {
                showAlert(
                    data.message || "Something went wrong. Please try again.",
                    "danger"
                );
            }

        } catch (err) {
            showAlert(
                "Unable to reach the server. Please email me directly at janavijadhav65@gmail.com",
                "warning"
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
    const existing = document.getElementById("form-alert");
    if (existing) existing.remove();

    const alertEl = document.createElement("div");
    alertEl.id        = "form-alert";
    alertEl.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertEl.role      = "alert";
    alertEl.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"
            aria-label="Close"></button>
    `;

    contactForm.insertAdjacentElement("afterend", alertEl);

    setTimeout(() => {
        if (alertEl && alertEl.parentNode) {
            bootstrap.Alert.getOrCreateInstance(alertEl).close();
        }
    }, 5500);
}


// ========================================
//   BACK TO TOP (optional smooth UX)
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});
