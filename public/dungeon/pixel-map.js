// Destination coordinates are in the existing 480 × 320 logical map.
const pixelScene = (() => {
  const crops = {
    village_background: [14, 1, 1548, 1001], camellia_tree: [288,184,713,801],
    traveler: [464,264,385,665], female_traveler: [492,260,329,713],
    flower_mascot: [472,192,593,601], flower_stall: [372,160,789,705],
    food_stall: [364,148,805,713], fountain: [340,224,629,717],
    postcard_stall: [372,164,789,705], signpost: [580,240,377,541],
    souvenir_stall: [404,168,729,689], tavern: [264,92,1005,841],
    walking_stall: [420,228,693,577]
  };
  const stands = [
    {id:0, key:'food_stall', x:103, y:157, w:53, name:'동백 주막 가판대'},
    {id:1, key:'flower_stall', x:350, y:157, w:54, name:'꽃바람 마당'},
    {id:2, key:'souvenir_stall', x:414, y:157, w:53, name:'손안의 동백'},
    {id:3, key:'walking_stall', x:351, y:272, w:57, name:'돌담길 가판대'},
    {id:4, key:'postcard_stall', x:147, y:272, w:51, name:'꽃편지 가판대'}
  ];
  const fountain = {key:'fountain',x:203,y:268,w:32};
  const trees = [[28,88,38],[153,59,36],[188,58,32],[307,54,34],[453,72,42],
    [453,125,34],[37,242,40],[51,293,38],[183,216,33],[445,254,42],[421,301,36]];
  const images = new Map();
  const ready = Promise.all(Object.keys(crops).map(key => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => { images.set(key, image); resolve(); };
    image.onerror = () => reject(new Error(key));
    image.src = `assets/pixel/${key}.png`;
  }))).then(() => true, error => { console.warn('Pixel preview unavailable:', error.message); return false; });

  function sprite(context, key, x, y, width) {
    const [sx,sy,sw,sh] = crops[key];
    const height = Math.round(width*sh/sw);
    context.drawImage(images.get(key), sx,sy,sw,sh, Math.round(x-width/2),y-height,width,height);
  }
  function tag(context, text, x, y) {
    context.save();
    context.font = 'bold 7px sans-serif';
    context.textAlign = 'center';
    const width = Math.ceil(context.measureText(text).width)+10;
    context.fillStyle = '#38452d'; context.fillRect(Math.round(x-width/2), y-8, width, 13);
    context.fillStyle = '#fff1cc'; context.fillText(text,x,y+1);
    context.restore();
  }
  const obstacles = [
    [6,10,210,21], [282,10,478,21], [6,310,478,320],
    [144,65,204,75], [279,64,352,75], [6,119,29,129],
    [56,69,128,105], [fountain.x-15,fountain.y-18,fountain.x+15,fountain.y], [275,217,283,226],
    ...stands.map(({x,y,w}) => [x-w/2+3,y-19,x+w/2-3,y]),
    ...trees.map(([x,y]) => [x-5,y-12,x+5,y])
  ];

  function draw(context, player) {
    if (images.size !== Object.keys(crops).length) return false;
    context.imageSmoothingEnabled = false;
    context.drawImage(images.get('village_background'), ...crops.village_background,0,0,480,320);
    const props = [
      ...trees.map(([x,y,w])=>({key:'camellia_tree',x,y,w})), ...stands,
      {key:'tavern',x:92,y:105,w:86}, fountain,
      {key:'signpost',x:279,y:226,w:14}, {key:'flower_mascot',x:258,y:253,w:20},
      {key:player.avatar,x:player.x,y:player.y,w:15,controlled:true},
      {key:player.avatar === 'traveler' ? 'female_traveler' : 'traveler',x:273,y:274,w:12}
    ];
    props.sort((a,b)=>a.y-b.y).forEach(({key,x,y,w,controlled}) => {
      if (!controlled) {
        sprite(context,key,x,y,w);
        return;
      }
      context.save();
      context.fillStyle = '#34482b80';
      context.fillRect(Math.round(x)-6,Math.round(y)-2,12,3);
      context.translate(Math.round(x), Math.round(y));
      if (player.direction === 1) context.scale(-1,1);
      sprite(context,key,0,player.frame === 1 ? -2 : 0,w);
      context.restore();
    });
    stands.forEach(({x,y,name})=>tag(context,name,x,y+11));
    tag(context,'동백꽃 광장',240,108);
    tag(context,'씨앗 정원',203,230);
    tag(context,'비밀 동백숲',408,220);
    return true;
  }
  function drawCharacters(canvas) {
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.clearRect(0,0,canvas.width,canvas.height);
    sprite(context,'traveler',160,253,85);
    sprite(context,'female_traveler',480,253,76);
    sprite(context,'flower_mascot',800,253,160);
  }
  return { ready, draw, drawCharacters, obstacles, stands };
})();
