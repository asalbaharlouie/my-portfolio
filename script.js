const cursorGlow = document.querySelector(".cursor-glow");
if (window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

const typing = document.querySelector(".typing");
const words = typing.dataset.words.split("|");
let wordIndex = 0, charIndex = words[0].length, deleting = false;
function typeLoop() {
  const word = words[wordIndex];
  if (!deleting) {
    charIndex++;
    typing.textContent = word.slice(0, charIndex);
    if (charIndex >= word.length) {
      deleting = true;
      setTimeout(typeLoop, 1450);
      return;
    }
  } else {
    charIndex--;
    typing.textContent = word.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 38 : 75);
}
setTimeout(typeLoop, 1800);
document.querySelector("#year").textContent = new Date().getFullYear();

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

// Safe, local-only terminal: predefined commands, no shell or remote execution.
(() => {
  const form = document.getElementById('terminal-form');
  if (!form) return;
  const input = document.getElementById('terminal-command');
  const output = document.getElementById('terminal-output');
  const commands = {
    help: 'Commands: help, whoami, skills, projects, contact, clear',
    whoami: 'Asal Baharlouie — aspiring cybersecurity professional. Networking • Linux • Python • DevOps.',
    skills: 'Networking | Network Security (learning) | Wireshark | Linux / LPIC-1 studies | Python | Flask | Docker | Docker Compose | GitHub Actions | Nginx | SSH',
    projects: 'UserCraft: github.com/asalbaharlouie/UserCraft | SlotSentry: github.com/asalbaharlouie/SlotSentry | Scrapezilla: github.com/asalbaharlouie/Scrapezilla',
    contact: 'Email: asalbaharlouie@gmail.com | LinkedIn: linkedin.com/in/asal-baharlouie-70854834b/ | X: x.com/AsalBaharlouie'
  };
  function line(value, cls) { const el=document.createElement('div');el.className='terminal-line '+(cls||'');el.textContent=value;output.appendChild(el);output.scrollTop=output.scrollHeight; }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const command=input.value.trim().toLowerCase(); input.value='';
    if (!command) return;
    if (command==='clear') {output.replaceChildren();return;}
    line('asal@portfolio:~$ '+command,'terminal-prompt');
    line(Object.hasOwn(commands,command) ? commands[command] : 'Unknown command. Type help to see available commands.');
  });
})();
