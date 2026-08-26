const scenes = [
  {title:"The Gate That Remembers", body:"Rin opens her eyes. The stage is made of paper, but the stars behind it are real.", caption:"The crystalline web pulses violet across the dimensions.", outfit:"assets/outfit-shadow.png"},
  {title:"A Jacket Full of Doors", body:"The green X42 jacket responds to her touch. Every seam becomes a map.", caption:"A wardrobe becomes a navigation system.", outfit:"assets/outfit-cyber.png"},
  {title:"Signal 42", body:"The energy orb wakes. A quiet voice asks whether Rin is ready to cross the fold.", caption:"The orb answers with a single green heartbeat: 42.", outfit:"assets/outfit-hoodie.png"},
  {title:"Learn the Impossible", body:"Rin reads a book that contains tomorrow's memories.", caption:"Knowledge rearranges the stage beneath her feet.", outfit:"assets/outfit-casual.png"},
  {title:"Battle the Blank Page", body:"A shadow steps out of the unpainted paper. Rin raises the X symbol.", caption:"The blank page finally chooses a side.", outfit:"assets/outfit-cyber.png"},
  {title:"Dance Beyond the Fold", body:"The theatre opens. Rin dances through a sky made of stars and unfinished worlds.", caption:"For one breath, every dimension moves together.", outfit:"assets/outfit-shadow.png"}
];

const equipment = [
  ["X42 Hooded Coat","jacket.png","SIGNAL ARMOR","A modular coat whose green symbols glow when a scene changes."],
  ["Orbit Headset","headset.png","RESONANCE","Lets Rin hear dialogue from scenes that have not happened yet."],
  ["Night Skirt","skirt.png","MOBILITY","Lightweight stagewear designed for fast scene transitions."],
  ["Utility Bag","utility-bag.png","INVENTORY","Carries props, paper keys and folded maps."],
  ["Quantum Orb","energy-orb.png","CORE RELIC","Stores a tiny piece of the Nexus's living light."],
  ["Memory Lantern","lantern.png","WAYFINDER","Projects a path when the stage becomes unreadable."],
  ["Happy Signal","expression-happy.png","EXPRESSION","A warm expression state for dialogue scenes."],
  ["Wink Signal","expression-wink.png","EXPRESSION","Used for playful or confident story beats."],
  ["Soft Smile","expression-smile.png","EXPRESSION","Quiet resolution / friendship state."]
];

let sceneIndex = 0;
let assets = JSON.parse(localStorage.getItem("x42Assets") || "[]");

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function githubToRaw(url){
  url = url.trim();
  if(!url) return "";
  try{
    const u = new URL(url);
    if(u.hostname === "raw.githubusercontent.com") return url;
    if(u.hostname === "github.com"){
      const p = u.pathname.split("/").filter(Boolean);
      const blob = p.indexOf("blob");
      if(blob >= 2){
        const owner=p[0], repo=p[1], branch=p[blob+1], file=p.slice(blob+2).join("/");
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
      }
      if(p[0] && p[1] && p[2]) return `https://raw.githubusercontent.com/${p[0]}/${p[1]}/main/${p.slice(2).join("/")}`;
    }
  }catch(e){}
  return url;
}

function renderEquipment(){
  $("#equipmentGrid").innerHTML = equipment.map(([name,img,tag,desc]) => `
    <article class="equip">
      <div class="pic"><img src="assets/${img}" alt="${name}"></div>
      <div class="rarity">${tag}</div>
      <h3>${name}</h3><p>${desc}</p>
    </article>`).join("");
}

function renderAssets(){
  const list=$("#assetList");
  if(!assets.length){ list.innerHTML='<div class="asset-empty">No linked assets yet.<br>Paste a GitHub file URL to add your first sprite.</div>'; return; }
  list.innerHTML=assets.map((a,i)=>`
    <div class="asset-item">
      <img src="${a.url}" alt="">
      <div><strong>${escapeHtml(a.name)}</strong><small>${a.type} · ${escapeHtml(a.url)}</small></div>
      <button class="remove" onclick="removeAsset(${i})">✕</button>
    </div>`).join("");
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function removeAsset(i){assets.splice(i,1);localStorage.setItem("x42Assets",JSON.stringify(assets));renderAssets();}

function loadScene(i){
  sceneIndex=(i+scenes.length)%scenes.length;
  const s=scenes[sceneIndex];
  $("#sceneTitle").textContent=s.title;
  $("#sceneBody").textContent=s.body;
  $("#captionText").textContent=s.caption;
  $("#frameLabel").textContent=`FRAME ${String(sceneIndex+1).padStart(2,"0")} / ${scenes.length}`;
  $("#timelineFill").style.width=`${((sceneIndex+1)/scenes.length)*100}%`;
  $("#sceneCharacter img").src=s.outfit;
  $("#sceneCharacter").classList.remove("animating");
  requestAnimationFrame(()=>$("#sceneCharacter").classList.add("animating"));
}

function playScene(){
  const char=$("#sceneCharacter");
  char.classList.remove("animating");
  void char.offsetWidth;
  char.classList.add("animating");
  $("#portal").style.boxShadow="0 0 80px rgba(56,231,255,.8),inset 0 0 60px rgba(155,92,255,.8)";
  setTimeout(()=>$("#portal").style.boxShadow="",900);
}

function switchTab(name){
  $$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  $$(".tab-page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));
  if(name==="stage") $("#stage").scrollIntoView({behavior:"smooth",block:"start"});
}
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));

$("#prevScene").onclick=()=>loadScene(sceneIndex-1);
$("#nextScene").onclick=()=>loadScene(sceneIndex+1);
$("#playScene").onclick=playScene;
$("#playTop").onclick=()=>{switchTab("stage");playScene()};
$("#chromaBtn").onclick=()=>document.body.classList.toggle("chroma");
$$(".control-pad button").forEach(btn=>btn.onclick=()=>{
  const action=btn.dataset.action;
  const map={sleep:"assets/outfit-shadow.png",fight:"assets/outfit-cyber.png",learn:"assets/outfit-hoodie.png",dance:"assets/outfit-casual.png"};
  $("#sceneCharacter img").src=map[action];
  $("#captionText").textContent=`Rin selects ${action.toUpperCase()}. The stage reconfigures around her.`;
  playScene();
});
$("#addAsset").onclick=()=>{
  const raw=githubToRaw($("#githubUrl").value);
  const name=$("#assetName").value.trim() || "Untitled X42 asset";
  const type=$("#assetType").value;
  if(!raw){alert("Paste a GitHub file URL first.");return;}
  assets.unshift({name,type,url:raw});
  localStorage.setItem("x42Assets",JSON.stringify(assets));
  $("#githubUrl").value="";$("#assetName").value="";renderAssets();
};

renderEquipment();renderAssets();loadScene(0);
window.removeAsset=removeAsset;
