/* ---------- NEURAL NETWORK BACKGROUND ---------- */
const canvas=document.getElementById('neural-canvas'),ctx=canvas.getContext('2d');
let W,H,mouse={x:-1e3,y:-1e3},particles=[],clusters=[];
const config={count:150,maxDist:120,mouseRad:200,speed:.8,size:2.5,lineOp:.6,partOp:.8,attraction:.03,pulseSp:.02};
const colors=[{r:100,g:200,b:255},{r:255,g:100,b:200},{r:255,g:200,b:100},{r:100,g:255,b:150},{r:200,g:100,b:255},{r:255,g:255,b:100}];

function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; initParticles(); }
window.addEventListener('resize',resize);
addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
addEventListener('mouseleave',()=>{mouse.x=-1e3;mouse.y=-1e3});
resize();

function initParticles(){
  particles=[]; clusters=[];
  const clusterCount=6, cols=Math.ceil(Math.sqrt(clusterCount)), rows=Math.ceil(clusterCount/cols);
  const hGap=W/(cols+1), vGap=H/(rows+1), centers=[], rad=Math.min(hGap,vGap)/3;
  for(let c=0;c<clusterCount;c++){
    const row=Math.floor(c/cols), col=c%cols;
    centers.push({x:hGap*(col+1),y:vGap*(row+1)}); clusters.push([]);
  }
  for(let i=0;i<config.count;i++){
    const cluster=i%clusterCount, cen=centers[cluster], angle=Math.random()*Math.PI*2, r=Math.random()*rad;
    const p={
      x:cen.x+Math.cos(angle)*r, y:cen.y+Math.sin(angle)*r,
      vx:(Math.random()-.5)*config.speed, vy:(Math.random()-.5)*config.speed,
      ox:(Math.random()-.5)*config.speed, oy:(Math.random()-.5)*config.speed,
      color:colors[Math.floor(Math.random()*colors.length)], size:config.size+Math.random()*1,
      oSize:config.size+Math.random()*1, phase:Math.random()*Math.PI*2, energy:0, cluster
    };
    particles.push(p); clusters[cluster].push(p);
  }
}
let time=0;
function animate(){
  ctx.clearRect(0,0,W,H); time+=config.pulseSp;
  particles.forEach(p=>{
    const dx=mouse.x-p.x, dy=mouse.y-p.y, dist=Math.hypot(dx,dy);
    if(dist<config.mouseRad){
      const f=(config.mouseRad-dist)/config.mouseRad, ang=Math.atan2(dy,dx);
      p.vx+=Math.cos(ang)*f*config.attraction;
      p.vy+=Math.sin(ang)*f*config.attraction;
      p.energy=Math.max(p.energy,f*.5);
    }else{
      p.vx+=(p.ox-p.vx)*.02; p.vy+=(p.oy-p.vy)*.02;
    }
    const orbital=.03;
    p.vx+=Math.cos(time+p.phase)*orbital; p.vy+=Math.sin(time+p.phase)*orbital;
    p.energy*=.96;
    const pulse=1+Math.sin(time*1.5+p.phase)*.1, energy=1+p.energy*.5;
    p.size=p.oSize*pulse*energy;
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W){p.vx*=-.9;p.ox*=-.9;p.x=Math.max(0,Math.min(W,p.x));p.energy+=.2;}
    if(p.y<0||p.y>H){p.vy*=-.9;p.oy*=-.9;p.y=Math.max(0,Math.min(H,p.y));p.energy+=.2;}
    p.vx*=.99; p.vy*=.99;
  });
  /* draw cluster links */
  clusters.forEach(cluster=>{
    for(let i=0;i<cluster.length;i++){
      for(let j=i+1;j<cluster.length;j++){
        const a=cluster[i], b=cluster[j], dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
        if(dist<config.maxDist){
          const op=(config.maxDist-dist)/config.maxDist*config.lineOp*(.8+(a.energy+b.energy)/2*.2);
          const mr=(a.color.r+b.color.r)/2, mg=(a.color.g+b.color.g)/2, mb=(a.color.b+b.color.b)/2;
          ctx.strokeStyle=`rgba(${mr},${mg},${mb},${op})`; ctx.lineWidth=1.5+(a.energy+b.energy)/2*1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
  });
  /* draw particles */
  particles.forEach(p=>{
    const dist=Math.hypot(mouse.x-p.x,mouse.y-p.y);
    let size=p.size, op=config.partOp;
    if(dist<config.mouseRad){ const pr=1-dist/config.mouseRad; size+=pr*1.5; op+=pr*.4; }
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*1.5);
    g.addColorStop(0,`rgba(${p.color.r},${p.color.g},${p.color.b},${Math.min(op,1)})`);
    g.addColorStop(.7,`rgba(${p.color.r},${p.color.g},${p.color.b},${Math.min(op,1)*.5})`);
    g.addColorStop(1,`rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,size,0,Math.PI*2); ctx.fill();
    if(p.energy>.1){ ctx.fillStyle=`rgba(255,255,255,${p.energy*.4})`; ctx.beginPath(); ctx.arc(p.x,p.y,size*.4,0,Math.PI*2); ctx.fill(); }
  });
  requestAnimationFrame(animate);
}
animate();

/* ---------- TYPED ---------- */
new Typed('#typed',{
  strings:['AI & Cloud Enthusiast','Problem Solver'],
  typeSpeed:60, backSpeed:40, backDelay:1500, loop:true, cursorChar:'|', smartBackspace:true
});

/* ---------- SMOOTH SCROLL FOR NAV ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const tgt=document.querySelector(a.getAttribute('href'));
    tgt&&tgt.scrollIntoView({behavior:'smooth',block:'start'});
  });
});
document.getElementById('contactBtn').onclick=()=>document.getElementById('contact').scrollIntoView({behavior:'smooth'});

/* ---------- POPULATE CONTENT ---------- */
const skills={
  "Programming Languages":["Python","JavaScript","SQL","Java"],
  "AI/ML Frameworks":["TensorFlow","PyTorch","Scikit-learn","Pandas","NumPy"],
  "Web Development":["React","Node.js","MongoDB","PostgreSQL"],
  "Cloud Technologies":["GCP","Vercel","Netlify","Render"],
  "Tools & Technologies":["Git","VS Code","Jupyter"]
};
const skillsGrid=document.getElementById('skillsGrid');
Object.entries(skills).forEach(([cat,list])=>{
  const div=document.createElement('div'); div.className='reveal';
  div.innerHTML=`<h3 class="text-3xl font-semibold mb-4 text-blue-400 border-b border-gray-600 pb-2">${cat}</h3><div class="flex flex-wrap gap-2">${list.map(s=>`<span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-base">${s}</span>`).join('')}</div>`;
  skillsGrid.appendChild(div);
});

const projects=[
  {title:"AI-Powered Student Attendance Alert System",desc:" A secure, foolproof attendance tracking system for educational institutions that uses multiple verification methods and AI-driven analysis to improve student attendance.",tech:["Python","JavaScript","Flask","React"],gh:"https://github.com/subbu-1985/AI-Powered-Student-Attendance-Alert-System",demo:"https://github.com/subbu-1985/AI-Powered-Student-Attendance-Alert-System"},
  {title:"QuickDeliver",desc:"A modern Streamlit application for food-delivery customer service with AI chatbot integration.",tech:["Streamlit","Python","OpenRouter-API","PostgreSQL"],gh:"https://github.com/subbu-1985/talentfarm_project",demo:"https://github.com/subbu-1985/talentfarm_project"},
  {title:"Voice Chatbot Application",desc:"This is a Python-based voice chatbot application that supports voice recording, speech-to-text transcription, AI text generation using Google Gemini API, and text-to-speech playback.",tech:["Python","Flask","Cython","Fortran","HTML"],gh:"https://github.com/subbu-1985/chatbot",demo:"https://chatbot-1-1y18.onrender.com/"},
  {title:"Library GenAI",desc:"A modern library management system with AI-powered book recommendations, Google's Gemini LLM for intelligent book suggestions",tech:["Flask","Python","PythonScript","Google Gemini LLM"],gh:"https://github.com/subbu-1985/Library-GenAI",demo:"https://github.com/subbu-1985/Library-GenAI"}
];
const projectsGrid=document.getElementById('projectsGrid');
projects.forEach((p,i)=>{
  const div=document.createElement('div'); div.className='reveal';
  div.innerHTML=`
    <h3 class="text-3xl font-semibold mb-3 text-green-400">${p.title}</h3>
    <p class="text-lg text-gray-300 mb-4">${p.desc}</p>
    <div class="mb-4"><h4 class="text-base font-semibold text-gray-400 mb-2">Technologies:</h4><div class="flex flex-wrap gap-2">${p.tech.map(t=>`<span class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm">${t}</span>`).join('')}</div></div>
    <div class="flex gap-4">
      <a href="${p.gh}" target="_blank" class="social-btn"><i class="fa-brands fa-github"></i> Code</a>
      <a href="${p.demo}" target="_blank" class="social-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>
    </div>`;
  projectsGrid.appendChild(div);
});

const certs=[
  {t:"Google Cloud Associate Engineer",d:"Cloud services"},
  {t:"NPTEL Java Programming",d:"Java Concepts"},
  {t:"Applied AI Lab: Deep Learning for Computer Vision",d:"Computer Vision"},
  {t:"NPTEL Cloud Computing",d:"Cloud Basics"}
];
const certsWrapper=document.getElementById('certsWrapper');
certs.forEach(c=>{
  const div=document.createElement('div'); div.className='card reveal';
  div.innerHTML=`<h3 class="text-2xl font-semibold text-white">${c.t}</h3><p class="text-purple-300">${c.d}</p>`;
  certsWrapper.appendChild(div);
});

const exp=[  
  {role:"ML Virtual Intern",company:"InternshipStudio",dur:"1 month",desc:"learns about machine learning by working on real projects and gaining practical skills"},
  {role:"AI & ML Virtual Intern",company:"APSSDC",dur:"6 weeks (May–June 2024)",desc:"Assisted in AI project gained hands-on experience in artificial intelligence and machine learning using the IBM SkillsBuild platform."}
];
const expWrapper=document.getElementById('expWrapper');
exp.forEach(e=>{
  const div=document.createElement('div'); div.className='card reveal';
  div.innerHTML=`<h3 class="text-3xl font-semibold mb-1 text-green-300">${e.role}</h3><p class="italic text-blue-400 text-lg mb-1">${e.company}</p><p class="text-yellow-400 mb-1">${e.dur}</p><p class="text-orange-400 text-base mb-0">${e.desc}</p>`;
  expWrapper.appendChild(div);
});

/* ---------- REVEAL ON SCROLL ---------- */
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); });
},{threshold:.15});
reveals.forEach(r=>observer.observe(r));