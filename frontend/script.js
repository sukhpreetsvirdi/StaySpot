
document.addEventListener("DOMContentLoaded", () => {
  // ✅ put your entire script here


 // SCRIPTS: dynamic content + 3D + animations 

        // -------------------------
        // DYNAMIC CONTENT (listings, features, reviews)
        // -------------------------
        console.log("✅ script.js is running now!");

        const featureGrid = document.getElementById("featureGrid");
        const features = [
            { title: "Interactive Map", desc: "Explore properties via a live map and location filters." },
            { title: "Instant Chat", desc: "Talk directly with owners — no agents, no hassle." },
            { title: "Secure Payments", desc: "Pay safely with integrated payment gateways." },
            { title: "Smart Filters", desc: "Filter by price, amenities, and more instantly." },
            { title: "Verified Profiles", desc: "Only trusted and verified property owners & tenants." },
            { title: "AI Suggestions", desc: "Smart suggestions based on your preferences." }
        ];
        featureGrid.innerHTML = features.map(f => `
      <div class="glass p-6 rounded-2xl reveal">
        <h4 class="text-lg font-semibold text-white mb-2">${f.title}</h4>
        <p class="text-gray-300">${f.desc}</p>
      </div>
    `).join("");

        const reviewGrid = document.getElementById("reviewGrid");
        const reviews = [
            { name: "Anjali", text: "Found my PG in 2 days! Loved how easy it was.", role: "Student" },
            { name: "Rajesh", text: "Rented my flat instantly — StaySpot is a lifesaver!", role: "Owner" },
            { name: "Aarav", text: "No brokers, no scams — this platform is solid!", role: "Engineer" }
        ];
        reviewGrid.innerHTML = reviews.map(r => `
      <div class="glass p-6 rounded-xl">
        <p class="text-gray-200">“${r.text}”</p>
        <div class="mt-4 font-semibold text-white">— ${r.name}, <span class="text-gray-300">${r.role}</span></div>
      </div>
    `).join("");

        // -------------------------
        // FETCH LISTINGS FROM BACKEND
        // -------------------------
        const listingsGrid = document.getElementById("listingsGrid");
        const searchInput = document.getElementById("searchInput");
        async function loadListings() {
            try {
                const res = await fetch("http://localhost:5000/api/listings");
                const data = await res.json();
                // show count in hero
                document.getElementById("liveCount").textContent = data.length;

                // render grid
                if (!data || data.length === 0) {
                    listingsGrid.innerHTML = `<div class="text-gray-300">No listings yet. Add one!</div>`;
                    return;
                }
                window._STAYSPOT_LISTINGS = data; // keep global for filtering
                renderListings(data);
            } catch (err) {
                console.error("Failed to load listings", err);
                listingsGrid.innerHTML = `<div class="text-red-400">Failed to load listings (is backend running?)</div>`;
            }
        }
        function renderListings(list) {
            listingsGrid.innerHTML = list.map(l => `
        <a href="listing.html?id=${l.id}" class="block bg-white/6 hover:bg-white/8 transition rounded-xl overflow-hidden">
          <img src="http://localhost:5000${l.image_url}" loading="lazy" class="h-48 w-full object-cover" alt="${escapeHtml(l.title)}" />
          <div class="p-4">
            <h4 class="text-lg font-semibold text-white">${escapeHtml(l.title)}</h4>
            <p class="text-gray-300">${escapeHtml(l.address)}</p>
            <div class="mt-2 text-[--accent] font-bold">₹${Number(l.price).toLocaleString()}/month</div>
          </div>
        </a>
      `).join("");
        }
        function escapeHtml(s) { return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }

        // simple live search
        searchInput?.addEventListener('input', () => {
            const q = searchInput.value?.toLowerCase() || '';
            const filtered = (window._STAYSPOT_LISTINGS || []).filter(i => (i.title + i.address).toLowerCase().includes(q));
            renderListings(filtered);
        });

        loadListings();

        // -------------------------
        // COUNT-UP ANIMATION for stats (simple)
        // -------------------------
        function animateCounts() {
            document.querySelectorAll('.count').forEach(el => {
                const end = Number(el.dataset.target || el.textContent || 0);
                gsap.fromTo(el, { innerText: 0 }, {
                    innerText: end,
                    duration: 1.6,
                    snap: { innerText: 1 },
                    onUpdate() { el.textContent = Math.floor(el.innerText).toLocaleString(); }
                });
            });
        }

        // -------------------------
        // ScrollReveal + GSAP registration
        // -------------------------
        gsap.registerPlugin(ScrollTrigger);
        ScrollReveal().reveal('.reveal', { distance: '30px', duration: 900, easing: 'ease-in-out', origin: 'bottom', interval: 80 });

          // Tell editor: Lenis exists globally
// @ts-ignore
        // const lenis = new Lenis({
        //     duration: 1.2,
        //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        // });
        // function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        // requestAnimationFrame(raf);



          // Wire GSAP ScrollTrigger to work well with Lenis
        // (use scrolling proxy so scroll animations remain synced)
        // ScrollTrigger.scrollerProxy(document.body, {
        //     scrollTop(value) { return arguments.length ? lenis.scrollTo(value) : window.pageYOffset; },
        //     getBoundingClientRect() { return { top: 0, left: 0, width: innerWidth, height: innerHeight }; },
        //     pinType: document.body.style.transform ? "transform" : "fixed"
        // });
        // ScrollTrigger.addEventListener("refresh", () => lenis.update());
        // ScrollTrigger.refresh();

        // -------------------------
        // THREE.JS HERO: Ultra-Beast 3D
        // -------------------------
        (function initThree() {
            const canvas = document.getElementById('bg3d');
            // renderer
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            // scene & camera
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x061418, 0.02);
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
            camera.position.set(0, 1.2, 6);

            // lights
            const hemi = new THREE.HemisphereLight(0xbfeeff, 0x080820, 0.9);
            scene.add(hemi);
            const dir = new THREE.DirectionalLight(0xffffff, 0.9);
            dir.position.set(5, 10, 7);
            scene.add(dir);

            // ground plane (subtle)
            const groundMat = new THREE.MeshStandardMaterial({ color: 0x022a1d, roughness: 0.95, metalness: 0.05 });
            const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), groundMat);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -1.6;
            scene.add(ground);

            // low-poly houses group
            const group = new THREE.Group();
            scene.add(group);

            const houseMat = new THREE.MeshStandardMaterial({ color: 0x211716, roughness: 0.6 });
            const roofMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });

            for (let i = 0; i < 18; i++) {
                const w = 0.8 + Math.random() * 1.4;
                const h = 0.7 + Math.random() * 1.2;
                const depth = 0.8 + Math.random() * 1;
                const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), houseMat);
                const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, depth) * 0.6, 0.45, 4), roofMat);
                box.position.set((Math.random() - 0.5) * 20, h / 2 - 1.5, (Math.random() - 0.5) * 20);
                roof.position.set(box.position.x, box.position.y + h / 2 + 0.2, box.position.z);
                roof.rotation.y = Math.PI / 4;
                box.userData.spin = 0.002 + Math.random() * 0.006;
                group.add(box);
                group.add(roof);
            }

            // particles (tiny lights)
            const particleCount = 600;
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
                positions[i * 3 + 1] = Math.random() * 12 - 1;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
            }
            const particlesGeo = new THREE.BufferGeometry();
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.55 });
            const particles = new THREE.Points(particlesGeo, particlesMat);
            scene.add(particles);

            // small gentle camera bob for life
            let time = 0;
            function animate() {
                time += 0.005;
                group.children.forEach(obj => {
                    if (obj.userData.spin) obj.rotation.y += obj.userData.spin;
                });
                particles.rotation.y += 0.0007;
                // small camera subtle floating
                camera.position.y = 1.2 + Math.sin(time) * 0.06;
                camera.lookAt(0, 0, 0);

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();

            // parallax by mouse
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
                gsap.to(camera.rotation, { x: -mouseY * 0.08, y: mouseX * 0.08, duration: 1.5, ease: 'power3.out' });
            });

            // scroll: bring camera forward when scrolling down
            ScrollTrigger.create({
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                onUpdate(self) {
                    // move camera z a bit as user scrolls
                    camera.position.z = 6 - self.progress * 2.2;
                    camera.position.x = (mouseX) * 0.8 * (1 - self.progress);
                }
            });

            // handle resize
            window.addEventListener('resize', () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            });
        })();

        // Run count animation when section in view
        ScrollTrigger.create({
            trigger: '#stats',
            start: 'top 80%',
            onEnter: () => animateCounts()
        });

        // re-run ScrollTrigger refresh after resources
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });



console.log("Setting up auth modal...");

        // 🔐 AUTH MODAL & LOGIN SYSTEM (Enhanced)
const authModal = document.getElementById("authModal");
const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");
const closeAuth = document.getElementById("closeAuth");
const nameField = document.getElementById("nameField");
const authTitle = document.getElementById("authTitle");
const loginBtn = document.getElementById("loginBtn");

let isLogin = true;
console.log("Auth modal script loaded.");
// 🪄 Open modal with animation
loginBtn?.addEventListener("click", () => {
  authModal.classList.remove("hidden");
  gsap.fromTo(
    authModal.querySelector(".bg-white"),
    { scale: 0.8, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power4.out" }
  );
});
console.log("Login button listener added.");
// 🕳️ Close modal with fade-out
closeAuth?.addEventListener("click", () => {
  gsap.to(authModal.querySelector(".bg-white"), {
    scale: 0.85,
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete: () => authModal.classList.add("hidden"),
  });
});

// 💫 Toggle login/register
toggleAuth?.addEventListener("click", () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? "Login" : "Register";
  authBtn.textContent = isLogin ? "Login" : "Register";
  nameField.classList.toggle("hidden", isLogin);
  toggleAuth.textContent = isLogin
    ? "Create an account"
    : "Already have an account?";
});

// 🚀 Handle Auth Submission
authBtn?.addEventListener("click", async () => {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password || (!isLogin && !name)) {
    alert("Please fill all fields!");
    return;
  }

  const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
  const body = isLogin ? { email, password } : { name, email, password };

  try {
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        localStorage.setItem("stayspot_user", JSON.stringify(data.user));
        localStorage.setItem("stayspot_token", data.token);
        gsap.to(authModal, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            authModal.classList.add("hidden");
            location.reload();
          },
        });
      } else {
        alert("✅ Registered successfully! Please login.");
        toggleAuth.click();
      }
    } else {
      alert(data.message || "Something went wrong.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to connect to server.");
  }
});



// 🧭 Keep user logged in & show name
const user = JSON.parse(localStorage.getItem("stayspot_user") || "null");
const loginButton = document.getElementById("loginBtn");
const nav = document.querySelector("nav div.hidden.md\\:flex");

if (user) {
  const welcomeEl = document.createElement("span");
  welcomeEl.className = "ml-3 text-sm text-green-300 font-semibold";
  welcomeEl.textContent = `Hi, ${user.name}`;

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.className = "text-red-400 ml-2 text-sm hover:underline";
  logoutBtn.onclick = () => {
    localStorage.removeItem("stayspot_user");
    localStorage.removeItem("stayspot_token");
    alert("👋 Logged out!");
    location.reload();
  };

  nav.appendChild(welcomeEl);
  nav.appendChild(logoutBtn);
  loginButton?.classList.add("hidden");
}




});




// hero sectionn text Dynamic animation

// 🌄 Hero Parallax Scroll
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY * 0.2;
  const heroImg = document.querySelector('#hero-bg img');
  if (heroImg) heroImg.style.transform = `translateY(${scrollPos}px) scale(1.05)`;
});

// ✨ Dynamic text animation
document.addEventListener('DOMContentLoaded', () => {
  const dynamicText = document.getElementById('heroDynamic');
  const phrases = [
    "Perfect Stay",
    "Dream Apartment",
    "Cozy Room",
    "Luxury Villa",
    "Smart Space",
    "Your Next Home"
  ];

  let i = 0;
  setInterval(() => {
    dynamicText.style.opacity = 0;
    dynamicText.style.transform = "translateY(-15px)";
    setTimeout(() => {
      i = (i + 1) % phrases.length;
      dynamicText.textContent = phrases[i];
      dynamicText.style.opacity = 1;
      dynamicText.style.transform = "translateY(0)";
    }, 600);
  }, 3000);
});
