// ============================================
//   AOS INIT
// ============================================
AOS.init({ once: true, duration: 750, offset: 55 });


// ============================================
//   NAVBAR – shrink + active link on scroll
// ============================================
const nav      = document.getElementById("mainNav");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const topBtn   = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    const y = window.scrollY;

    // shrink
    nav.classList.toggle("scrolled", y > 60);

    // back-to-top visibility
    topBtn?.classList.toggle("visible", y > 420);

    // active nav link
    sections.forEach((sec) => {
        if (y >= sec.offsetTop - 110 && y < sec.offsetTop - 110 + sec.offsetHeight) {
            navLinks.forEach((l) => {
                l.classList.remove("active");
                if (l.getAttribute("href") === "#" + sec.id) l.classList.add("active");
            });
        }
    });
});


// ============================================
//   NAVBAR – close on mobile link click
// ============================================
const navMenu = document.getElementById("navMenu");
navLinks.forEach((l) => {
    l.addEventListener("click", () => {
        if (navMenu?.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
    });
});


// ============================================
//   TYPED TEXT
// ============================================
const words  = ["MCA Student", "Full Stack Developer", "MERN Developer", "Web Designer", "Software Developer"];
const target = document.getElementById("typedText");
let wi = 0, ci = 0, del = false;

function type() {
    if (!target) return;
    const w = words[wi];
    target.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    let speed = del ? 50 : 100;
    if (!del && ci === w.length)   { speed = 1800; del = true; }
    else if (del && ci === 0)       { del = false; wi = (wi + 1) % words.length; speed = 350; }
    setTimeout(type, speed);
}
setTimeout(type, 600);


// ============================================
//   BACK TO TOP
// ============================================
topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


// ============================================
//   PROJECT FILTER
// ============================================
document.querySelectorAll(".pf-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".pf-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        document.querySelectorAll(".project-item").forEach((item) => {
            const cats = item.dataset.category.split(" ");
            const show = filter === "all" || cats.includes(filter);
            item.style.display   = show ? "" : "none";
            if (show) item.style.animation = "fadeInUp .4s ease forwards";
        });
    });
});


// ============================================
//   CONTACT FORM
// ============================================
const form    = document.getElementById("contactForm");
const sendBtn = form?.querySelector("button[type='submit']");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
        showAlert("Please fill in all fields.", "danger"); return;
    }

    sendBtn.disabled  = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending…';

    try {
        const res  = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, subject, message })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            showAlert("✅ Message sent! I'll get back to you soon.", "success");
            form.reset();
        } else {
            showAlert(data.message || "Something went wrong. Try again.", "danger");
        }
    } catch {
        showAlert("Server unreachable. Email me: janavijadhav65@gmail.com", "warning");
    } finally {
        sendBtn.disabled  = false;
        sendBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane ms-2"></i>';
    }
});

function showAlert(msg, type) {
    document.getElementById("form-alert")?.remove();
    const el = document.createElement("div");
    el.id        = "form-alert";
    el.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    el.role      = "alert";
    el.innerHTML = `${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    el.style.cssText = "border-radius:10px;font-size:.88rem;";
    form.insertAdjacentElement("afterend", el);
    setTimeout(() => bootstrap.Alert.getOrCreateInstance(el)?.close(), 5500);
}
