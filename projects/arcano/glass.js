import * as THREE from './vendor/three.module.min.js';
const host = document.querySelector('#glass-scene');
const hint = document.querySelector('#glass-hint');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
} catch {
  hint.textContent = 'A little mystery. A moment to savour.';
  document.querySelector('#swirl').hidden = true; document.querySelector('#hero-swirl').hidden = true;
}
if(renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.setClearColor(0x000000,0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32,innerWidth/innerHeight,.1,100);
  camera.position.set(0,.1,9);
  // Softbox reflections make the transparent, procedurally modeled glass visible.
  const envCanvas = document.createElement('canvas'); envCanvas.width=1024;envCanvas.height=512;
  const ctx = envCanvas.getContext('2d');ctx.fillStyle='#29101b';ctx.fillRect(0,0,1024,512);
  const glow=ctx.createLinearGradient(0,0,0,512);glow.addColorStop(0,'#41232b');glow.addColorStop(.5,'#966c57');glow.addColorStop(1,'#170710');ctx.fillStyle=glow;ctx.fillRect(0,0,1024,512);
  [[100,48],[360,18],[680,65],[920,12]].forEach(([x,w])=>{ctx.fillStyle='#fff1d9';ctx.fillRect(x,65,w,340);});
  const texture = new THREE.CanvasTexture(envCanvas);texture.mapping=THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);const environment = pmrem.fromEquirectangular(texture);
  scene.environment=environment.texture;texture.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffe6b4,0x270818,3));
  const key=new THREE.DirectionalLight(0xffefcf,5);key.position.set(-3,4,5);scene.add(key);
  const rim=new THREE.PointLight(0xd84d70,25,20);rim.position.set(3,1,2);scene.add(rim);
  const group = new THREE.Group();scene.add(group);
  const glass = new THREE.MeshPhysicalMaterial({color:0xfff0df,metalness:0,roughness:.04,transmission:.25,thickness:.06,ior:1.46,transparent:true,opacity:.23,side:THREE.DoubleSide,envMapIntensity:1.4,depthWrite:false,clearcoat:1});
  const points = [[.04,-.45],[.19,-.43],[.43,-.33],[.67,-.1],[.82,.25],[.86,.65],[.84,1.03],[.77,1.34],[.75,1.4],[.735,1.4],[.755,1.33],[.82,1.02],[.84,.65],[.8,.26],[.65,-.08],[.41,-.31],[.18,-.41],[.04,-.43]].map(([r,y])=>new THREE.Vector2(r,y));
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(points,96),glass);group.add(bowl);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.035,.05,1.7,32),glass);stem.position.y=-1.28;group.add(stem);
  const basePoints=[[0,-2.19],[.52,-2.19],[.68,-2.16],[.68,-2.12],[.45,-2.08],[.07,-2.06],[.04,-2.02]].map(([r,y])=>new THREE.Vector2(r,y));
  group.add(new THREE.Mesh(new THREE.LatheGeometry(basePoints,72),glass));
  const wineMat=new THREE.MeshPhysicalMaterial({color:0x640b27,roughness:.18,metalness:.08,transmission:.25,thickness:.6,transparent:true,opacity:.97,ior:1.34,clearcoat:1,envMapIntensity:1.5});
  const winePoints=[[0,-.415],[.18,-.4],[.4,-.29],[.63,-.06],[.78,.27],[.815,.52]].map(([r,y])=>new THREE.Vector2(r,y));
  const wine=new THREE.Mesh(new THREE.LatheGeometry(winePoints,80),wineMat);group.add(wine);
  const surface = new THREE.Mesh(new THREE.CircleGeometry(.813,80),new THREE.MeshPhysicalMaterial({color:0x7d1235,roughness:.14,metalness:.15,clearcoat:1,side:THREE.DoubleSide}));surface.rotation.x=-Math.PI/2;surface.position.y=.52;group.add(surface);
  const rimRing=new THREE.Mesh(new THREE.TorusGeometry(.745,.009,10,100),new THREE.MeshStandardMaterial({color:0xffdfb7,metalness:.6,roughness:.2}));rimRing.rotation.x=Math.PI/2;rimRing.position.y=1.4;group.add(rimRing);
  const dustGeometry=new THREE.BufferGeometry();const vertices=[];for(let i=0;i<60;i++) vertices.push((Math.random()-.5)*12,(Math.random()-.5)*9,(Math.random()-.5)*4-2);
  dustGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  const dust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:0xc5a374,size:.012,transparent:true,opacity:.55}));scene.add(dust);
  let px=0,py=0,scroll=window.scrollY,spin=0,last=0,frame;
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();if(reduce.matches) render(0);}
  function render(ms){
    const t=ms*.001;const dt=Math.min((ms-last)*.001,.05);last=ms;
    scroll += (window.scrollY-scroll)*.06;
    const mobile=innerWidth<800;
    const stage = document.querySelector('#wine').getBoundingClientRect();
    const hero = document.querySelector('#home').getBoundingClientRect();
    const heroVisible=Math.max(0,Math.min(1,hero.bottom/300));
    const wineVisible=Math.max(0,Math.min(1,(innerHeight-stage.top)/200,stage.bottom/200));
    host.style.opacity=Math.max(heroVisible,wineVisible);
    const inHero = hero.bottom>0;
    const progress=Math.min(scroll/Math.max(innerHeight,1),4);
    const targetX=inHero ? 0 : (mobile?.35:camera.aspect*.95);
    group.position.x += (targetX-group.position.x)*.045;
    const center=inHero? innerHeight*.51 : stage.top+stage.height/2;
    group.position.y=(.5-center/innerHeight)*5.1+(mobile&&!inHero?-.75:0)+Math.sin(t*.7)*.04;
    const scale=inHero?(mobile?.57:.95):(mobile?.42:.95);
    group.scale.setScalar(scale);
    spin*=Math.pow(.13,dt);
    group.rotation.z += ((mobile?.12:-.16)+px*.09+Math.sin(progress)*.16-group.rotation.z)*.04;
    group.rotation.y += ((px*.3+progress*.5+spin)-group.rotation.y)*.04;
    group.rotation.x += ((py*.1)-group.rotation.x)*.04;
    surface.rotation.z=reduce.matches?0:Math.sin(t*2)*.015;
    dust.rotation.y=reduce.matches?0:t*.015;
    renderer.render(scene,camera);
    if(!reduce.matches&&!document.hidden) frame=requestAnimationFrame(render);
  }
  window.addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;},{passive:true});
  document.querySelectorAll('#swirl,#hero-swirl').forEach(button=>button.addEventListener('click',()=>{spin+=Math.PI*2;if(reduce.matches)render(0);}));
  window.addEventListener('arcano-mood',e=>{rim.color.set(e.detail);if(reduce.matches)render(0);});
  window.addEventListener('resize',resize);
  window.addEventListener('scroll',()=>{if(reduce.matches) render(0);},{passive:true});
  function restart(){cancelAnimationFrame(frame);last=performance.now();render(last);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else restart();});
  reduce.addEventListener('change',restart);
  resize();restart();
}
