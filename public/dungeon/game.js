const $ = s => document.querySelector(s);
const canvas = $('#world'), ctx = canvas.getContext('2d');
const companionImages = ['camellia', 'mint', 'blue'].map(name => {
  const image = new Image();
  image.src = 'assets/companions/' + name + '.png';
  return image;
});
let companion = null;
let companionFrame = 0;

function drawCompanion() {
  if (!companion?.image.naturalWidth) return;
  const {image, age} = companion;
  const height = 25;
  const width = height * image.naturalWidth / image.naturalHeight;
  const hop = player.moving ? player.frame * 2 : Math.sin(age / 160) * 1.5;
  ctx.save();
  ctx.globalAlpha = Math.min(1, age / 180, (5000 - age) / 800);
  ctx.drawImage(image, Math.round(companion.x - width / 2), Math.round(companion.y - height - hop), width, height);
  ctx.restore();
}

function animateCompanion(time) {
  companionFrame = 0;
  if (!companion || modal.open) return;
  const elapsed = companion.lastFrame ? Math.min(time - companion.lastFrame, 50) : 0;
  companion.lastFrame = time;
  companion.age += elapsed;
  const side = player.x > 445 ? -22 : 22;
  const follow = 1 - Math.exp(-elapsed / 65);
  companion.x += (player.x + side - companion.x) * follow;
  companion.y += (player.y - 2 - companion.y) * follow;
  if (companion.age >= 5000) companion = null;
  drawMap();
  if (companion) companionFrame = requestAnimationFrame(animateCompanion);
}
const colors = {grass:'#859b63',light:'#9db478',dark:'#526b48',path:'#d9c59a',stone:'#888b78',wood:'#77503b',roof:'#a34e4e',pink:'#fa329f',mint:'#91f9ae'};
const stalls = [{x:108,y:140,name:'동백 주막',id:0},{x:350,y:108,name:'꽃바람 마당',id:1},{x:390,y:205,name:'손안의 동백',id:2},{x:287,y:254,name:'돌담길 가판대',id:3},{x:100,y:252,name:'꽃편지 가판대',id:4,key:'postcard_stall'}];
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function flower(x,y,c='#ed6b87'){rect(x-3,y-1,7,3,c);rect(x-1,y-3,3,7,c);rect(x,y,1,1,'#ffe299')}
function tree(x,y){rect(x-4,y+5,8,21,'#705942');rect(x-15,y-10,30,24,'#496d45');rect(x-21,y-5,42,13,'#496d45');rect(x-15,y-17,29,22,'#5e804e');rect(x-10,y-21,18,10,'#6e8c53');rect(x-12,y-11,6,3,'#819d61');flower(x-9,y-6);flower(x+9,y+1);flower(x+2,y-15)}
function wall(x,y,w){for(let i=0;i<w;i+=12){rect(x+i,y,11,8,'#6c7568');rect(x+i+1,y,9,3,'#939b83');rect(x+i+2,y+4,8,3,'#7e8775')}}
function label(text,x,y){ctx.font='6px sans-serif';let w=ctx.measureText(text).width;rect(x-w/2-5,y-7,w+10,12,'#f7edcf');ctx.fillStyle='#495740';ctx.textAlign='center';ctx.fillText(text,x,y+1)}
function stall(s){let {x,y,id}=s;rect(x-18,y+11,40,7,'#60754b');rect(x-19,y-1,4,24,'#77503b');rect(x+16,y-1,4,24,'#77503b');rect(x-22,y-12,45,14,'#f0deae');for(let i=0;i<5;i++)rect(x-22+i*10,y-12,5,15,id%2?'#759487':'#ba6861');rect(x-23,y-14,47,3,'#675343');rect(x-21,y+13,44,9,'#997447');rect(x-21,y+13,44,3,'#d7b77a');if(id===0){rect(x-3,y+2,6,11,'#677447');rect(x-2,y,4,3,'#3d4938')}else if(id===1){flower(x-7,y+3,'#fa329f');flower(x+3,y+2,'#83c9fa');rect(x-3,y+5,1,8,'#fff0ce')}else flower(x,y+7,id===2?'#91f9ae':'#fa329f');rect(x-2,y-27,4,4,'#fff1a8');rect(x-4,y-25,8,1,'#fff1a8');label(s.name,x,y+37)}
function house(){rect(30,52,90,64,'#5f754b');rect(34,45,84,61,'#d8b784');rect(39,47,4,59,'#8b6544');rect(108,47,4,59,'#8b6544');rect(28,34,96,17,'#713f3b');rect(35,23,83,15,'#a8524b');rect(43,16,66,10,'#bc6960');for(let y=27;y<48;y+=7)rect(30,y,92,2,'#85433f');for(let x=41;x<110;x+=12)rect(x,26,2,21,'#cc7c64');rect(68,69,20,37,'#624735');rect(44,63,17,18,'#93623e');rect(47,66,11,12,'#f5d18a');rect(92,63,17,18,'#93623e');rect(95,66,11,12,'#f5d18a');rect(52,43,49,15,'#f8e6bd');ctx.fillStyle='#684b35';ctx.font='bold 8px serif';ctx.textAlign='center';ctx.fillText('동백 주막',77,54);rect(21,62,7,11,'#f4c274');rect(22,64,5,7,'#ffe5a3');rect(21,60,7,2,'#69513a');rect(125,62,7,11,'#f4c274');rect(126,64,5,7,'#ffe5a3')}
function traveler(x,y,dir=0,frame=0){rect(x-6,y+9,14,3,'#617650');rect(x-5,y-5,10,8,'#473f36');rect(x-4,y-2,8,8,'#f3cc9d');rect(x-6,y+4,12,8,'#ede1bd');rect(x-4,y+11,3,5+(frame===1?1:0),'#5e7064');rect(x+2,y+11,3,5+(frame===2?1:0),'#5e7064');rect(x-7,y-6,14,3,'#ad8351');rect(x-4,y-10,9,5,'#d6b574');if(dir!==3){rect(x+(dir===1?-4:dir===2?3:-2),y,1,1,'#4d4133');if(dir===0)rect(x+2,y,1,1,'#4d4133')}if(dir===3)rect(x-4,y-2,8,7,'#473f36');rect(x+4,y+5,4,6,'#ac6950')}
function fairy(x,y,f=0){rect(x-5,y+11,12,2,'#6f8256');rect(x-4,y,9,9,'#bc8a57');rect(x-2,y-3,5,6,'#d7aa6c');rect(x-9,y-1,6,3,'#91f9ae');rect(x+5,y-3,6,3,'#91f9ae');flower(x,y-6,'#fa329f');rect(x,y-7,2,2,'#f5fa47');rect(x-1,y+3,1,1,'#503e33');rect(x+3,y+3,1,1,'#503e33');if(f)rect(x+10,y-8,2,2,'#fff2b0')}
function drawVillage(){canvas.width=960;canvas.height=640;ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;if(pixelScene.draw(ctx, player))return;rect(0,0,480,320,colors.grass);let seed=4321;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}for(let i=0;i<1800;i++){let x=rnd()*480,y=rnd()*320;rect(x,y,2,1,i%2?colors.light:'#78925b')}rect(218,45,45,275,colors.path);rect(74,159,330,34,colors.path);rect(80,177,33,103,colors.path);rect(96,269,213,24,colors.path);rect(286,184,28,99,colors.path);rect(337,128,30,57,colors.path);rect(372,187,32,50,colors.path);for(let i=0;i<240;i++){let x=225+rnd()*30,y=48+rnd()*270;rect(x,y,3,1,'#c5b387')}for(let y of [12,302]){wall(6,y,204);wall(271,y,204)}wall(6,117,22);wall(145,65,60);wall(280,63,70);house();for(let p of [[12,35],[159,29],[194,43],[285,25],[320,25],[420,28],[456,60],[450,120],[450,166],[450,248],[419,285],[346,292],[32,205],[28,268],[160,236],[187,276],[335,221]])tree(...p);rect(230,196,21,22,'#9b9c80');rect(226,198,29,14,'#b7b79b');rect(229,201,23,8,'#85aea0');rect(237,190,7,15,'#a4a98d');flower(240,190,'#ed81a0');stalls.forEach(stall);label('동백꽃 광장',240,144);traveler(player.x,player.y-16,player.direction,player.frame);fairy(260,234);for(let i=0;i<40;i++){let x=rnd()*480,y=rnd()*320;if(x<210&&y>195||x>410)flower(x,y,i%3?'#f0b4a1':'#fff2b0')}rect(272,198,3,20,'#79553c');rect(265,194,18,12,'#f0d9a7');rect(269,198,10,2,'#8c7950');rect(269,202,7,1,'#8c7950')}
function drawMap() {
  drawVillage();
  drawCompanion();
}
drawMap();
window.addEventListener('resize',()=>requestAnimationFrame(drawMap));

const modal=$('#modal'), content=$('#modalContent');
const gameState = { started: false, panel: null, map: 'loading' };

function show(panel, html) {
  stopMovement();
  content.innerHTML = html;
  gameState.panel = panel;
  if (!modal.open) modal.showModal();
  content.querySelectorAll('img[data-product-image]').forEach(image => {
    const status = image.nextElementSibling;
    function update(loaded) {
      image.hidden = !loaded;
      status.hidden = loaded;
  updateInteraction();
      if (!loaded) status.textContent = '이미지를 불러오지 못했어요.';
    }
    image.addEventListener('load', () => update(true), { once: true });
    image.addEventListener('error', () => update(false), { once: true });
    if (image.complete) update(image.naturalWidth > 0);
  });
}

function productImage(imagePath, alt) {
  return '<img data-product-image hidden src="' + encodeURI(imagePath) +
    '" alt="' + alt + '"><span class="image-status" role="status">이미지를 불러오는 중…</span>';
}

modal.addEventListener('close', () => {
  if (modal.open) return;
  if (gameState.panel?.type === 'tavern') {
    content.querySelector('video')?.pause();
    content.replaceChildren();
  }
  gameState.panel = null;
  if (gameState.started) canvas.focus({ preventScroll: true });
  if (companion && !companionFrame) {
    companion.lastFrame = 0;
    companionFrame = requestAnimationFrame(animateCompanion);
  }
});
function detail(index, showPosters) {
  const product = products[index];
  const usePoster = showPosters && product.detailImage;
  show({type: 'detail', productId: product.id}, `
    <div class="detail">
      <div class="product-media">${productImage(usePoster ? product.detailImage : product.image, usePoster ? product.detailAlt : product.name)}</div>
      <div>
        <h2>${product.name}</h2>
        <p>${product.desc}</p>
        ${product.status === 'concept' ? '<div class="pending">시안 · 새 자료로 교체 예정</div>' : ''}
        <h3>디자인 이야기</h3>
        <p>${product.story}</p>
        <p id="saleStatus" class="pending">판매 정보 준비 중</p>
        <button class="text-button" id="backBook">← 굿즈 도감</button>
      </div>
    </div>`);
  const saleStatus = $('#saleStatus');
  let purchaseUrl;
  try { purchaseUrl = new URL(product.purchaseUrl); } catch {}
  if (purchaseUrl && ['https:', 'http:'].includes(purchaseUrl.protocol)) {
    const link = document.createElement('a');
    link.href = purchaseUrl.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '구매처 보기 ↗';
    saleStatus.replaceChildren(link);
  }
  $('#backBook').onclick = () => book(product, undefined, showPosters);
  modal.querySelector('.close').focus();
}
const discoveryKey = 'dongbaek-discoveries-v001';
const discovered = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(discoveryKey));
  if (Array.isArray(saved)) {
    for (const id of saved) {
      if (products.some(product => product.id === id)) discovered.add(id);
    }
  }
} catch { /* The collection remains available for this session. */ }

function updateCount() {
  $('#count').textContent = discovered.size + ' / ' + products.length;
  $('#saved').textContent = '동백 씨앗 ' + discovered.size + ' / ' + products.length;
}

function discover(product) {
  if (discovered.has(product.id)) return false;
  discovered.add(product.id);
  updateCount();
  try { localStorage.setItem(discoveryKey, JSON.stringify([...discovered])); } catch {}
  companion = {
    image: companionImages[Math.floor(Math.random() * companionImages.length)],
    x: player.x + (player.x > 445 ? -22 : 22),
    y: player.y - 2,
    age: 0,
    lastFrame: 0
  };
  return true;
}

function confirmExplorationReset() {
  show({type: 'reset'}, '<h2>탐험을 초기화할까요?</h2><p>이 브라우저의 씨앗 기록과 배지를 지우고 출발 지점으로 돌아가요.</p><button id="cancelReset" class="text-button">취소</button> <button id="confirmReset" class="text-button">초기화하기</button>');
  $('#cancelReset').onclick = () => book();
  $('#cancelReset').focus();
  $('#confirmReset').onclick = () => {
    try {
      localStorage.removeItem(discoveryKey);
    } catch {
      show({type: 'reset'}, '<h2>기록을 지울 수 없어요</h2><p>브라우저에서 저장 공간에 접근할 수 있는지 확인해 주세요.</p>');
      return;
    }
    discovered.clear();
    companion = null;
    cancelAnimationFrame(companionFrame);
    companionFrame = 0;
    Object.assign(player, {x: 238, y: 278, direction: 3});
    updateCount();
    drawMap();
    updateInteraction();
    modal.close();
  };
}

function book(featured, isNew, showPosters = false) {
  const message = featured && isNew !== undefined
    ? featured.name + (isNew ? ' 발견! 동백 씨앗을 하나 얻었어요.' : '은 이미 발견했어요.')
    : '가판대에서 굿즈를 처음 발견할 때마다 동백 씨앗을 하나 얻어요.';
  const cards = products.map((product, index) => {
    const selected = product === featured ? ' featured' : '';
    const status = discovered.has(product.id) ? '✓ 발견함' : '미발견';
    return '<button class="card' + selected + '" data-product="' + index + '">' +
      productImage(product.image, product.name) + product.name + '<small>' + status + '</small></button>';
  });
  const completion = products.length > 0 && discovered.size === products.length
    ? '<div class="collection-complete"><div class="earned-badge"><span aria-hidden="true">✿</span><div><small>배지 획득</small><br><strong>동백숲 탐험가</strong></div></div><details><summary>씨앗 요정의 이야기 읽기</summary><p>씨앗 요정은 다섯 씨앗을 정원에 심었어요. 첫 꽃이 피던 날, 비밀 동백숲까지 이어지는 길에 분홍 꽃잎이 하나씩 내려앉았어요.</p></details></div>'
    : '';
  show({type: 'collection'}, '<p class="eyebrow">LITTLE TREASURES</p><h2>굿즈 도감</h2>' +
    '<p class="prose">' + message + '</p><p>동백 씨앗 ' + discovered.size + ' / ' + products.length +
    '</p>' + completion + '<div class="grid">' + cards.join('') + '</div><p><button class="text-button" id="resetExploration">탐험 초기화</button></p>');
  $('#resetExploration').onclick = confirmExplorationReset;
  content.querySelectorAll('[data-product]').forEach(button => {
    button.onclick = () => detail(Number(button.dataset.product), showPosters);
  });
  content.querySelector('.featured')?.focus();
}
updateCount();
$('#collection').onclick=()=>book();$('.close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){let r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
const avatarSelect = $('#avatar');
avatarSelect.addEventListener('change', () => {
  if (!gameState.started) return;
  stopMovement();
  player.avatar = avatarSelect.value;
  drawMap();
  canvas.focus({ preventScroll: true });
});

$('#start').onclick = () => {
  player.avatar = avatarSelect.value;
  gameState.started = true;
  drawMap();
  const avatarControls = $('#avatarControls');
  avatarControls.append(avatarSelect.closest('label'));
  $('#avatarLabel').textContent = '캐릭터 변경';
  avatarControls.hidden = false;
  $('#welcome').hidden = true;
  $('#interact').disabled = false;
  updateInteraction();
  canvas.focus({ preventScroll: true });
};
function showVisit() {
  show({type: 'visit'}, `
    <p class="eyebrow">실제 마을 방문 안내</p>
    <h2>제주 신흥2리 동백마을</h2>
    <div class="prose">
      <p>서귀포시 남원읍의 마을이에요. 주민들이 가꾼 제주 토종 동백나무 군락지를 만날 수 있고, 동백오일을 활용한 고사리 파스타 만들기 등 마을 체험도 소개하고 있어요.</p>
      <h3>동백마을 방문자센터</h3>
      <p>제주특별자치도 서귀포시 남원읍 한신로531번길 22-1</p>
      <p><a href="https://map.kakao.com/link/map/%EB%8F%99%EB%B0%B1%EB%A7%88%EC%9D%84%EB%B0%A9%EB%AC%B8%EC%9E%90%EC%84%BC%ED%84%B0,33.3201238,126.7451631" target="_blank" rel="noopener noreferrer">카카오맵에서 방문자센터 보기 ↗</a></p>
      <p>체험 일정과 예약은 출발 전 공식 안내에서 확인해 주세요.</p>
      <p><a href="https://www.visitjeju.net/kareumstay/ko/villages/mig-village-sinheung2" target="_blank" rel="noopener noreferrer">비짓제주 마을·체험 안내 ↗</a> · <a href="https://access.visitkorea.or.kr/ms/detail.do?cotId=fe9f6763-8030-4e39-ad04-87f44a9b6d52" target="_blank" rel="noopener noreferrer">한국관광공사 방문 정보 ↗</a></p>
      <aside><strong>게임 속 동백마을</strong><br>동백주막, 씨앗 정원과 비밀 동백숲은 제주 동백마을에서 영감을 얻은 창작 공간이에요.</aside>
    </div>`);
}
$('#visit').onclick = showVisit;
$('#visitMenu').onclick = showVisit;
$('#lang').textContent='설정';$('#lang').setAttribute('aria-label','설정 미리보기');$('#lang').onclick=()=>show({type: 'settings'}, '<p class="eyebrow">YOUR LITTLE WALK</p><h2>산책 설정</h2><div class="prose"><p>언어 <span class="setting-value">한국어 / English</span></p><p>배경음 <span class="setting-value">기본 꺼짐</span></p><p>이동 <span class="setting-value">WASD · 방향키 / 화면 버튼</span></p><aside>동백마을 미리보기입니다. 언어 전환·사운드·저장은 이후 단계에서 연결합니다.</aside></div>');
$('#sound').onclick=()=>{$('#toast').textContent='소리 기능은 8단계에서 연결해요.';$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2200)};

const spriteCanvas=document.createElement('canvas');spriteCanvas.width=960;spriteCanvas.height=320;spriteCanvas.setAttribute('aria-label','여행자 네 방향과 걷기 프레임, 씨앗 요정 픽셀 시안');
const spriteCtx=spriteCanvas.getContext('2d');
for(let d=0;d<4;d++)for(let f=0;f<3;f++){
  ctx.clearRect(0,0,480,320);traveler(20,20,d,f);
  spriteCtx.imageSmoothingEnabled=false;spriteCtx.drawImage(canvas,12,12,56,72,20+(d*3+f)*78,35,56,72);
}
for(let f=0;f<3;f++){ctx.clearRect(0,0,480,320);fairy(20,20-f,f);spriteCtx.drawImage(canvas,12,12,56,72,34+f*100,180,56,72)}
drawMap();
const assetSection=document.createElement('section');assetSection.className='asset-section';assetSection.innerHTML='<p class="eyebrow">PIXEL CHARACTER STUDY</p><h2>여행자와 작은 길잡이</h2><p>여행자: 정면 · 왼쪽 · 오른쪽 · 뒷모습, 각 3프레임 / 씨앗 요정: 기본 · 떠오르기 · 반짝이기</p>';assetSection.append(spriteCanvas);document.querySelector('main').append(assetSection);
$('#welcomeText').textContent = '어서 와요, 여행자님! 가판대에서 굿즈를 발견하고 동백 씨앗을 모아 보세요.';
$('#controls').textContent='방향키 / WASD로 이동 · E로 가판대와 요정 살펴보기';
$('#start').textContent='산책 시작하기 →';
canvas.setAttribute('aria-label','동백마을 맵. 방향키 또는 WASD로 이동하세요.');

const fallbackObstacles = [
  [30,56,120,116], [226,199,255,218], [270,206,277,218],
  [6,12,210,20], [271,12,475,20], [6,302,210,310], [271,302,475,310],
  [6,117,28,125], [145,65,205,73], [280,63,350,71],
  ...stalls.map(({x,y}) => [x-20,y+9,x+21,y+22]),
  ...[[12,35],[159,29],[194,43],[285,25],[320,25],[420,28],[456,60],[450,120],[450,166],[450,248],[419,285],[346,292],[32,205],[28,268],[160,236],[187,276],[335,221]]
    .map(([x,y]) => [x-4,y+10,x+4,y+26])
];
function nearFairy() {
  const fallback = gameState.map !== 'ready';
  return Math.hypot(player.x- (fallback ? 260 : 258),player.y- (fallback ? 245 : 253)) <= 34;
}
function nearTavern() {
  const fallback = gameState.map === 'fallback';
  return Math.hypot(player.x - (fallback ? 78 : 92), player.y - (fallback ? 118 : 108)) <= 27;
}

function showTavern() {
  show({type: 'tavern'}, '<h2>동백주막</h2><video class="tavern-video" controls playsinline preload="metadata" src="assets/video/full.mp4" aria-label="동백주막 영상"></video><p class="pending" id="videoError" hidden>영상을 불러오지 못했어요.</p>');
  const video = content.querySelector('video');
  video.addEventListener('error', () => { $('#videoError').hidden = false; });
  video.play().catch(() => {});
}

function showGuide() {
  show({type: 'help'}, '<p class="eyebrow">CAMELLIA SEED FAIRY</p><h2>동백꽃 씨앗 요정</h2><div class="prose"><p>어서 와요, 여행자님! 꽃길을 천천히 걸어 보세요. 가판대마다 작은 이야기가 있어요.</p><aside>PC에서는 방향키나 WASD, 휴대폰에서는 화면 방향 버튼을 눌러 이동해요. 가판대에 다가가 E 또는 살펴보기 버튼을 누르면 굿즈 도감이 열려요.</aside></div>');
}
function nearbyStand() {
  const points = gameState.map === 'ready' ? pixelScene.stands : stalls;
  let closest = null;
  let distance = 26;
  for (const stand of points) {
    const approachY = stand.y + (gameState.map === 'ready' ? 8 : 29);
    const current = Math.hypot(player.x - stand.x, player.y - approachY);
    if (current < distance) {
      distance = current;
      closest = stand;
    }
  }
  return closest;
}

function interact() {
  if (!gameState.started || modal.open || gameState.map === 'loading') return;
  const stand = nearbyStand();
  if (stand) {
    const product = products[stand.id];
    book(product, discover(product), stand.key === 'postcard_stall');
  } else if (nearTavern()) {
    showTavern();
  } else if (nearFairy()) {
    showGuide();
  } else {
    book();
  }
}

function updateInteraction() {
  if (!gameState.started) return;
  const stand = nearbyStand();
  const product = stand && products[stand.id];
  $('#interact').textContent = product ? product.name + ' 살펴보기'
    : nearTavern() ? '동백주막 영상 보기'
    : nearFairy() ? '요정과 이야기하기' : '굿즈 도감 ↗';
}
const stopMovement = bindMovement({
  canMove: () => gameState.started && !modal.open && gameState.map !== 'loading',
  getObstacles: () => gameState.map === 'ready' ? pixelScene.obstacles : fallbackObstacles,
  render: () => { drawMap(); updateInteraction(); }
});
$('#interact').onclick = interact;
$('#help').onclick = showGuide;
window.addEventListener('keydown', event => {
  const spaceOnMap = event.code === 'Space' && event.target === canvas;
  if ((event.code === 'KeyE' || spaceOnMap) && !event.repeat && !event.ctrlKey && !event.altKey &&
      !event.metaKey && gameState.started && !modal.open && (nearbyStand() || nearTavern() || nearFairy())) {
    event.preventDefault();
    interact();
  }
});
pixelScene.ready.then(loaded => {
  gameState.map = loaded ? 'ready' : 'fallback';
  const status = $('#mapStatus');
  status.hidden = loaded;
  if (!loaded) {
    status.textContent = '픽셀 에셋을 불러오지 못했어요. 기본 마을을 표시합니다.';
    return;
  }
  drawMap();
  pixelScene.drawCharacters(spriteCanvas);
  spriteCanvas.setAttribute('aria-label','여행자 두 시안과 동백꽃 씨앗 요정의 새 픽셀 에셋');
  assetSection.querySelector('h2').textContent = '여행자와 동백꽃 씨앗 요정';
  assetSection.querySelector('p:not(.eyebrow)').textContent = '남자 여행자 · 여자 여행자 · 동백꽃 씨앗 요정';
});
