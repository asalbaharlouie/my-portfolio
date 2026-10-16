const cursorGlow = document.querySelector(".cursor-glow");
if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
 let pending = false, x = 0, y = 0;
 window.addEventListener('pointermove', event => {
  x = event.clientX; y = event.clientY;
  if (!pending) { pending = true; requestAnimationFrame(() => {
   cursorGlow.style.left = `${x}px`; cursorGlow.style.top = `${y}px`; pending = false;
  }); }
 }, {passive:true});
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => { element.classList.add("reveal-pending"); revealObserver.observe(element); });

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
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) { setTimeout(typeLoop, 1000); return; }
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
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setTimeout(typeLoop, 1800);
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

// Flight lifecycle: one animation loop, stopped on close or a hidden tab.
(() => {
 const dialog = document.querySelector('.space-intro');
 const enter = document.querySelector('#enter-universe');
 const replay = document.querySelector('.replay-intro');
 const skip = document.querySelector('.flight-skip');
 const status = document.querySelector('.flight-status');
 const canvas = document.querySelector('#flight-stars');
 const ctx = canvas.getContext('2d');
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let frame = 0, last = 0, phase = 'idle', started = 0, timer = 0, finishTimer = 0;
 let w = 0, h = 0, stars = [], fromReplay = false;
 const randomStar = () => ({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random()*1.9+.1});
 function resize() {
  w = innerWidth; h = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = w*ratio; canvas.height = h*ratio;
  if(ctx) ctx.setTransform(ratio,0,0,ratio,0,0);
  stars = Array.from({length:w<600?75:140},randomStar);
  if(motion.matches) draw(performance.now());
 }
 function draw(now) {
  frame = 0;
  if(!dialog.open || document.hidden || !ctx) return;
  const dt = Math.min((now-last)/1000 || .016,.04); last=now;
  const speed = phase==='flying' ? .5+Math.min((now-started)/1300,1)*2.4 : .018;
  ctx.fillStyle='#080812'; ctx.fillRect(0,0,w,h);
  const size=Math.max(w,h)*.6;
  for(const s of stars) {
   const old=s.z;
   if(!motion.matches) s.z-=dt*speed;
   if(s.z<.08){Object.assign(s,randomStar(),{z:2});continue;}
   const x=w/2+s.x*size/s.z, y=h*.43+s.y*size/s.z;
   ctx.strokeStyle=`rgba(190,170,255,${Math.min(.8,1/s.z*.5)})`;
   ctx.fillStyle='#c7c5f1';
   if(phase==='flying'){
    const tail=old+speed*.045;
    ctx.lineWidth=Math.min(2,1/s.z);ctx.beginPath();ctx.moveTo(w/2+s.x*size/tail,h*.43+s.y*size/tail);ctx.lineTo(x,y);ctx.stroke();
   }else{ctx.fillRect(x,y,1.3,1.3);}
  }
  if(!motion.matches) frame=requestAnimationFrame(draw);
 }
 function run(){if(!frame && dialog.open && !document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}}
 function stop(){cancelAnimationFrame(frame);frame=0;}
 function close(){clearTimeout(timer);clearTimeout(finishTimer);stop();dialog.close();}
 function arrive(){
  if(phase!=='flying')return;
  phase='arriving';stop();
  document.body.classList.add('home-arrival');
  dialog.classList.add('is-arriving');
  status.textContent='Welcome aboard. You have arrived.';
  finishTimer=setTimeout(close,500);
 }
 function open(){
  if(typeof dialog.showModal!=='function')return;
  phase='idle'; dialog.classList.remove('is-flying','is-arriving');
  document.body.classList.remove('home-arrival');
  document.querySelector('.intro-panel').inert=false;
  enter.disabled=false;status.textContent='';
  dialog.showModal();document.body.classList.add('intro-open');resize();run();
 }
 enter.addEventListener('click',()=>{
  if(phase!=='idle')return;
  if(motion.matches){close();return;}
  phase='flying';started=performance.now();enter.disabled=true;
  document.querySelector('.intro-panel').inert=true;
  dialog.classList.add('is-flying');status.textContent='Launching flight 0x01…';
  skip.focus();window.scrollTo({top:0,behavior:'instant'});
  timer=setTimeout(arrive,2600);
 });
 document.querySelector('#skip-intro').addEventListener('click',close);
 skip.addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('close',()=>{
  stop();clearTimeout(timer);clearTimeout(finishTimer);phase='idle';
  document.body.classList.remove('intro-open');
  try{sessionStorage.setItem('asal-space-intro','seen');}catch{}
  if(fromReplay)replay.focus({preventScroll:true});
  else{const title=document.querySelector('.hero h1');title.tabIndex=-1;title.focus({preventScroll:true});}
 });
 replay.addEventListener('click',()=>{fromReplay=true;open();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else run();});
 window.addEventListener('resize',resize,{passive:true});
 motion.addEventListener('change',()=>{stop();if(motion.matches&&phase==='flying')close();else run();});
 let seen=false;try{seen=sessionStorage.getItem('asal-space-intro')==='seen';}catch{}
 if(!seen&&!location.hash)open();
})();
