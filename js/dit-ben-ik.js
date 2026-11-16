/*
 * De "Dit ben ik"-kaart: invullen, als A4-kaart bekijken en bewaren.
 * Wat je invult blijft alleen op dit apparaat staan.
 */
(function(){
'use strict';
var KLEUR={
  paars:'#7c3fc0',paarsDiep:'#3b2570',paarsLicht:'#c9b7eb',paarsZacht:'#efe3f7',navy:'#1e2a5a',creme:'#faf7fe',wit:'#ffffff',wang:'#f2a7c8',
  lila:['#9a6bc9','#ebe1f7','#5a3591'],blauw:['#5b9bd5','#dcebf8','#2a5a8c'],groen:['#5bb85d','#d5f0df','#2b6e30'],
  oranje:['#e9622a','#fbdccb','#a8401a'],geel:['#f6cf5a','#fcf1cd','#7a5c00'],roze:['#d63384','#fbe3ee','#a3205f']
};
var ACCENTEN=[['geel','geel'],['roze','roze'],['blauw','blauw'],['groen','groen'],['oranje','oranje'],['lila','paars']];
var BLOKKEN=[
  {id:'blij',acc:'geel',titel:'Hier word ik blij van',hulp:'Tik aan wat past en schrijf er zelf iets bij.',
   chips:['buiten spelen','muziek','knuffelen','dieren','bouwen','tekenen','water','voorlezen']},
  {id:'goed',acc:'roze',titel:'Dit kan ik goed',hulp:'Waar is je kind trots op?',
   chips:['puzzelen','dingen onthouden','verhalen verzinnen','helpen','zingen','rennen en klimmen','kleine dingen zien','tellen']},
  {id:'moeilijk',acc:'blauw',titel:'Dit vind ik moeilijk',hulp:'Moeilijk mag. Zo weet de ander waar hij op kan letten.',
   chips:['harde geluiden','wachten','stoppen met spelen','drukke plekken','nieuwe dingen','kriebelende kleren','stilzitten','afscheid nemen']},
  {id:'teveel',acc:'oranje',titel:'Zo zie je dat het te veel wordt',hulp:'Wat doet je kind als zijn hoofd vol zit?',
   chips:['ik word stil','ik ga rennen','handen op mijn oren','ik word boos','ik ga huilen','ik kruip weg','ik word heel druk']},
  {id:'helpt',acc:'groen',titel:'Dit helpt mij',hulp:'Het belangrijkste vak voor de juf of oppas.',
   chips:['een rustig plekje','weten wat er komt','"nog 5 minuten" zeggen','een knuffel','even alleen zijn','een koptelefoon','één ding tegelijk','plaatjes van de dag']},
  {id:'weten',acc:'lila',titel:'Dit wil ik je nog vertellen',hulp:'Laat je kind het in eigen woorden zeggen.',
   chips:['ik doe echt mijn best','vraag het me rustig','soms heb ik even tijd nodig','ik vind grapjes leuk']}
];
var FASES=[
  {n:1,naam:'Mijn lijf moet eerst rustig worden',leeftijd:'fase 1, past bij 0 tot 6 maanden',zie:'Geluid, licht of aanraking komt heel hard binnen. Zichzelf troosten lukt dan niet.',
   nodig:['weinig geluid en licht','een vast ritme','iets zwaars of warms om me heen','weinig woorden']},
  {n:2,naam:'Blijf bij me',leeftijd:'fase 2, past bij 6 tot 18 maanden',zie:'Wil je heel dichtbij hebben en raakt in paniek als je wegloopt.',
   nodig:['blijf dicht bij me','één vast persoon','zeg dat je terugkomt','eerst troosten, dan praten']},
  {n:3,naam:'Ik wil het zelf',leeftijd:'fase 3, past bij 1,5 tot 3 jaar',zie:'Zegt nee, gaat de strijd aan en wordt boos als het anders loopt.',
   nodig:['laat me kiezen uit twee dingen','zeg rustig wat de regel is','blijf in de buurt','ga niet met me in discussie']},
  {n:4,naam:'Doe het me voor',leeftijd:'fase 4, past bij 3 tot 7 jaar',zie:'Wil het graag goed doen, kijkt veel naar anderen en is bang om te falen.',
   nodig:['doe het me voor','zeg dat proberen knap is','leg het uit in kleine stapjes','help me woorden vinden voor mijn gevoel']},
  {n:5,naam:'Leg het me eerlijk uit',leeftijd:'fase 5, past bij 7 tot 12 jaar',zie:'Vindt regels en eerlijkheid belangrijk en wil het zelf oplossen.',
   nodig:['leg eerlijk uit waarom','maak samen met mij een plan','geef me tijd om na te denken','neem me serieus']}
];
var SLEUTEL='ditbenik-v1';
function leeg(){var s={naam:'',over:'',kleur:'geel',foto:'',voorbeeld:false,fase:0,nodig:[],b:{}};BLOKKEN.forEach(function(b){s.b[b.id]={k:[],t:''};});return s;}
function voorbeeld(){
  var s=leeg();s.voorbeeld=true;s.naam='Sam';s.over='5 jaar, groep 2';s.kleur='groen';
  s.b.blij={k:['buiten spelen','dieren','bouwen'],t:'mijn knuffel Beer'};
  s.b.goed={k:['puzzelen','dingen onthouden'],t:'alle dino-namen'};
  s.b.moeilijk={k:['harde geluiden','stoppen met spelen','wachten'],t:''};
  s.b.teveel={k:['handen op mijn oren','ik kruip weg'],t:''};
  s.b.helpt={k:['een rustig plekje','weten wat er komt','"nog 5 minuten" zeggen'],t:''};
  s.b.weten={k:['ik doe echt mijn best'],t:'Ik vind het fijn als je naast me komt zitten.'};
  s.fase=2;s.nodig=FASES[1].nodig.slice(0,3);
  return s;
}
var S;
try{var raw=localStorage.getItem(SLEUTEL);if(raw){var p=JSON.parse(raw);if(p&&p.b){S=leeg();Object.assign(S,p);BLOKKEN.forEach(function(b){if(!S.b[b.id])S.b[b.id]={k:[],t:''};});}}}catch(e){}
if(!S)S=voorbeeld();
function bewaar(){try{localStorage.setItem(SLEUTEL,JSON.stringify(S));}catch(e){try{var z=Object.assign({},S,{foto:''});localStorage.setItem(SLEUTEL,JSON.stringify(z));}catch(e2){}}}
var $=function(id){return document.getElementById(id);};

/* ---------- formulier ---------- */
var fotoImg=null;
function laadFoto(cb){if(!S.foto){fotoImg=null;cb&&cb();return;}var im=new Image();im.onload=function(){fotoImg=im;cb&&cb();};im.onerror=function(){fotoImg=null;cb&&cb();};im.src=S.foto;}

function bouw(){
  var kl=$('kleuren');kl.textContent='';
  ACCENTEN.forEach(function(a){
    var b=document.createElement('button');b.type='button';b.className='kleur';b.dataset.acc=a[0];b.setAttribute('aria-label',a[1]);
    b.setAttribute('aria-pressed',S.kleur===a[0]?'true':'false');
    b.addEventListener('click',function(){S.kleur=a[0];Array.prototype.forEach.call(kl.children,function(c){c.setAttribute('aria-pressed',c===b?'true':'false');});wijzig();});
    kl.appendChild(b);
  });
  var wrap=$('blokken');wrap.textContent='';
  BLOKKEN.forEach(function(blok){
    var d=S.b[blok.id];
    var sec=document.createElement('div');sec.className='blok';sec.dataset.acc=blok.acc;
    var h=document.createElement('h2');h.textContent=blok.titel;h.id='h-'+blok.id;sec.appendChild(h);
    var hp=document.createElement('p');hp.className='hulp';hp.textContent=blok.hulp;sec.appendChild(hp);
    var ch=document.createElement('div');ch.className='chips';ch.setAttribute('role','group');ch.setAttribute('aria-labelledby',h.id);
    blok.chips.forEach(function(c){
      var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=c;
      b.setAttribute('aria-pressed',d.k.indexOf(c)>=0?'true':'false');
      b.addEventListener('click',function(){var i=d.k.indexOf(c);if(i>=0)d.k.splice(i,1);else d.k.push(c);b.setAttribute('aria-pressed',i>=0?'false':'true');wijzig();});
      ch.appendChild(b);
    });
    sec.appendChild(ch);
    var lb=document.createElement('label');lb.className='veld';lb.htmlFor='t-'+blok.id;lb.textContent='Of in eigen woorden';sec.appendChild(lb);
    var ta=document.createElement('textarea');ta.id='t-'+blok.id;ta.maxLength=160;ta.value=d.t;
    ta.addEventListener('input',function(){d.t=ta.value;wijzig();});
    sec.appendChild(ta);
    wrap.appendChild(sec);
  });
  bouwFase(wrap);
  $('naam').value=S.naam;$('over').value=S.over;
  $('voorbeeld').hidden=!S.voorbeeld;
  fotoStatus();
}
function bouwFase(wrap){
  var sec=document.createElement('div');sec.className='blok';sec.dataset.acc='paars';
  var h=document.createElement('h2');h.textContent='Als het te veel wordt, heb ik dit nodig';h.id='h-fase';sec.appendChild(h);
  var hp=document.createElement('p');hp.className='hulp';hp.textContent='Voor ouders: hoe is je kind als zijn hoofd echt vol zit? Kinderen vallen dan vaak terug naar een jongere fase. Kies wat je het meest herkent.';sec.appendChild(hp);
  var lijst=document.createElement('div');lijst.className='fases';lijst.setAttribute('role','group');lijst.setAttribute('aria-labelledby','h-fase');
  var nodigWrap=document.createElement('div');
  function toonNodig(){
    nodigWrap.textContent='';
    var f=FASES[S.fase-1];if(!f)return;
    var lb=document.createElement('span');lb.className='veld';lb.style.cssText='display:block;font-weight:600;margin:4px 0 6px';lb.textContent='Dit komt op de kaart. Tik weg wat niet past.';nodigWrap.appendChild(lb);
    var ch=document.createElement('div');ch.className='chips';
    f.nodig.forEach(function(c){
      var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=c;
      b.setAttribute('aria-pressed',S.nodig.indexOf(c)>=0?'true':'false');
      b.addEventListener('click',function(){var i=S.nodig.indexOf(c);if(i>=0)S.nodig.splice(i,1);else S.nodig.push(c);b.setAttribute('aria-pressed',i>=0?'false':'true');wijzig();});
      ch.appendChild(b);
    });
    nodigWrap.appendChild(ch);
  }
  FASES.forEach(function(f){
    var b=document.createElement('button');b.type='button';b.className='fasekeus';
    var t=document.createElement('b');t.textContent=f.naam;var z=document.createElement('span');z.textContent=f.zie;var l=document.createElement('small');l.textContent=f.leeftijd;
    b.appendChild(t);b.appendChild(z);b.appendChild(l);
    b.setAttribute('aria-pressed',S.fase===f.n?'true':'false');
    b.addEventListener('click',function(){
      if(S.fase===f.n){S.fase=0;S.nodig=[];}else{S.fase=f.n;S.nodig=f.nodig.slice();}
      Array.prototype.forEach.call(lijst.children,function(c,i){c.setAttribute('aria-pressed',S.fase===i+1?'true':'false');});
      toonNodig();wijzig();
    });
    lijst.appendChild(b);
  });
  sec.appendChild(lijst);sec.appendChild(nodigWrap);
  var kl=document.createElement('p');kl.className='klein';kl.textContent='Dit is geen test. De fasen komen uit de Schaal voor Emotionele Ontwikkeling (SEO) uit de zorg. Een echte inschaling doet een gedragsdeskundige. Op de kaart staat alleen wat je kind nodig heeft, niet de fase.';sec.appendChild(kl);
  wrap.appendChild(sec);toonNodig();
}
function fotoStatus(){$('foto-weg').hidden=!S.foto;$('foto-knop').textContent=S.foto?'Kies een andere foto':'Kies een foto';$('foto-tip').hidden=!!S.foto;}
$('naam').addEventListener('input',function(e){S.naam=e.target.value;wijzig();});
$('over').addEventListener('input',function(e){S.over=e.target.value;wijzig();});
$('foto').addEventListener('change',function(e){
  var f=e.target.files&&e.target.files[0];if(!f)return;
  var url=URL.createObjectURL(f);var im=new Image();
  im.onload=function(){
    var n=420,c=document.createElement('canvas');c.width=n;c.height=n;var x=c.getContext('2d');
    var m=Math.min(im.width,im.height);x.drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,n,n);
    try{S.foto=c.toDataURL('image/jpeg',.85);}catch(err){S.foto='';}
    URL.revokeObjectURL(url);e.target.value='';fotoStatus();laadFoto(wijzig);
  };
  im.onerror=function(){URL.revokeObjectURL(url);zeg('Deze foto kan ik niet openen. Probeer een jpg of png.');};
  im.src=url;
});
$('foto-weg').addEventListener('click',function(){S.foto='';fotoImg=null;fotoStatus();wijzig();});
$('begin-leeg').addEventListener('click',function(){S=leeg();fotoImg=null;bouw();wijzig();$('naam').focus();});
var wisKlaar=false;
$('wis').addEventListener('click',function(){
  if(!wisKlaar){wisKlaar=true;this.textContent='Zeker weten? Tik nog een keer om alles te wissen';var k=this;setTimeout(function(){wisKlaar=false;k.textContent='Alles wissen en opnieuw beginnen';},4000);return;}
  wisKlaar=false;this.textContent='Alles wissen en opnieuw beginnen';S=leeg();fotoImg=null;bouw();wijzig();toon('invullen');
});

/* ---------- tabbladen ---------- */
function toon(welk){
  var k=welk==='kaart';
  $('tab-invullen').setAttribute('aria-selected',k?'false':'true');$('tab-kaart').setAttribute('aria-selected',k?'true':'false');
  $('paneel-invullen').hidden=k;$('paneel-kaart').hidden=!k;
  try{var p=document.getElementById('dit-ben-ik');if(p&&!p.hidden)window.scrollTo(0,0);}catch(e){}
}
$('tab-invullen').addEventListener('click',function(){toon('invullen');});
$('tab-kaart').addEventListener('click',function(){toon('kaart');});
$('naar-kaart').addEventListener('click',function(){toon('kaart');});

/* ---------- de kaart tekenen (A4, 150 dpi) ---------- */
var W=1240,H=1754,cv=document.createElement('canvas');cv.width=W;cv.height=H;var g=cv.getContext('2d');
function rr(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function font(gew,px,fam){g.font=gew+' '+px+'px '+(fam||'Fredoka, Nunito, system-ui, sans-serif');}
function breek(tekst,maxW){
  var woorden=tekst.split(/\s+/),regels=[],r='';
  woorden.forEach(function(w){
    var t=r?r+' '+w:w;
    if(g.measureText(t).width<=maxW||!r){r=t;}else{regels.push(r);r=w;}
  });
  if(r)regels.push(r);return regels;
}
function punten(d){
  var uit=d.k.slice();
  (d.t||'').split(/\n+/).forEach(function(s){s=s.trim();if(s)uit.push(s);});
  return uit;
}
/* Krijtstijl (huisstijl 3): een stip die met krijt is ingekleurd. */
function krijtStip(x,y,r,kleur,nr){
  g.save();g.beginPath();
  for(var i=0;i<=36;i++){var h=i/36*Math.PI*2,rr2=r*(1+.06*Math.sin(2*h+nr)+.04*Math.sin(3*h+nr*1.7));g.lineTo(x+Math.cos(h)*rr2,y+Math.sin(h)*rr2);}
  g.closePath();g.fillStyle=kleur;g.fill();g.clip();
  g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=Math.max(1.5,r/7);g.lineCap='round';g.beginPath();
  for(var sx=-r*2;sx<r*2;sx+=Math.max(4,r/2.4)){g.moveTo(x+sx+r*.6,y-r*1.2);g.lineTo(x+sx-r*.6,y+r*1.2);}
  g.stroke();g.restore();
}
/* Het hoofdbreintje onderaan de kaart. Tot het plaatje geladen is, tekenen we het eenvoudige breintje. */
var hoofdImg=null;
(function(){var im=new Image();im.onload=function(){hoofdImg=im;try{ververs();}catch(e){}};im.src='beeld/hoofdbreintje.webp';})();
function breintje(cx,cy,s){
  if(hoofdImg){var bh=178*s,bw2=bh*hoofdImg.width/hoofdImg.height;g.drawImage(hoofdImg,cx-bw2/2-22,cy-bh*.6,bw2,bh);return;}
  g.save();g.translate(cx,cy);g.scale(s,s);
  g.fillStyle=KLEUR.wang;g.strokeStyle=KLEUR.navy;g.lineWidth=5;g.lineJoin='round';g.lineCap='round';
  g.beginPath();
  [[-34,-10,30],[0,-26,34],[34,-10,30],[-22,18,30],[22,18,30]].forEach(function(c){g.moveTo(c[0]+c[2],c[1]);g.arc(c[0],c[1],c[2],0,Math.PI*2);});
  g.stroke();g.fill();
  g.beginPath();g.moveTo(-30,-22);g.quadraticCurveTo(-18,-34,-6,-22);g.moveTo(8,-30);g.quadraticCurveTo(22,-40,34,-26);g.lineWidth=3.5;g.stroke();
  g.fillStyle=KLEUR.navy;g.beginPath();g.arc(-14,4,4.5,0,Math.PI*2);g.arc(14,4,4.5,0,Math.PI*2);g.fill();
  g.lineWidth=4;g.beginPath();g.moveTo(-9,16);g.quadraticCurveTo(0,25,9,16);g.stroke();
  g.fillStyle='#e77fb0';g.globalAlpha=.75;g.beginPath();g.ellipse(-30,14,9,6,0,0,Math.PI*2);g.ellipse(30,14,9,6,0,0,Math.PI*2);g.fill();
  g.restore();
}
function teken(){
  var acc=KLEUR[S.kleur]||KLEUR.geel;
  g.fillStyle=KLEUR.wit;g.fillRect(0,0,W,H);
  /* stippenrand: groot = lievelingskleur, klein = paars */
  for(var i=0,y=40;y<H+30;i++,y+=64){
    var groot=i%2===0;
    [46,W-46].forEach(function(x,z){krijtStip(x,y,groot?21:10,groot?acc[0]:KLEUR.paars,i+z*5);});
  }
  g.fillStyle=KLEUR.wit;rr(92,46,W-184,H-92,64);g.fill();

  /* kop */
  var L=150,fx=955,fy=250,fr=150;
  g.textBaseline='alphabetic';g.textAlign='left';
  g.fillStyle=KLEUR.paars;font(700,104,"'Amatic SC', 'Comic Sans MS', cursive");
  try{g.letterSpacing='4px';}catch(e){}
  g.fillText('DIT BEN IK',L,190);
  try{g.letterSpacing='0px';}catch(e){}
  var naam=(S.naam||'').trim().toUpperCase(),maxN=fx-fr-40-L,px=132;
  if(naam){
    do{font(700,px);px-=4;}while(g.measureText(naam).width>maxN&&px>44);
    g.fillStyle=KLEUR.paarsDiep;g.fillText(naam,L,320);
  }else{
    g.strokeStyle=KLEUR.paarsLicht;g.lineWidth=5;g.setLineDash([4,16]);g.lineCap='round';g.beginPath();g.moveTo(L,318);g.lineTo(L+maxN-20,318);g.stroke();g.setLineDash([]);
  }
  if((S.over||'').trim()){
    font(600,40);var ov=S.over.trim();var pw=Math.min(g.measureText(ov).width+48,maxN);
    g.fillStyle=acc[1];rr(L,352,pw,64,32);g.fill();
    g.fillStyle=acc[2];g.save();g.beginPath();g.rect(L,352,pw-20,64);g.clip();g.fillText(ov,L+24,398);g.restore();
  }
  /* foto of tekenrondje */
    g.fillStyle=KLEUR.wit;g.beginPath();g.arc(fx,fy,fr,0,Math.PI*2);g.fill();
  if(fotoImg){g.save();g.beginPath();g.arc(fx,fy,fr-6,0,Math.PI*2);g.clip();g.drawImage(fotoImg,fx-fr,fy-fr,fr*2,fr*2);g.restore();}
  else{g.fillStyle=KLEUR.paarsLicht;g.textAlign='center';font(700,46,"'Amatic SC', 'Comic Sans MS', cursive");g.fillText('teken jezelf',fx,fy+16,fr*1.5);g.textAlign='left';}
  g.strokeStyle=acc[0];g.lineWidth=12;g.beginPath();g.arc(fx,fy,fr-6,0,Math.PI*2);g.stroke();

  /* zes vakken */
  var band=S.fase>0&&S.nodig&&S.nodig.length>0;
  var gx=140,gy=468,bw=456,bh=band?286:352,kx=48,ky=band?32:38;
  BLOKKEN.forEach(function(blok,n){
    var c=KLEUR[blok.acc],x=gx+(n%2)*(bw+kx),y0=gy+Math.floor(n/2)*(bh+ky);
    g.fillStyle=KLEUR.wit;rr(x,y0,bw,bh,28);g.fill();
    g.strokeStyle=c[0];g.lineWidth=8;rr(x+4,y0+4,bw-8,bh-8,24);g.stroke();
    /* kwastlabel */
    var tp=31;font(600,tp);while(g.measureText(blok.titel).width>bw-88&&tp>22){tp--;font(600,tp);}
    var lw=g.measureText(blok.titel).width+32;
    g.fillStyle=c[1];rr(x+26,y0+26,lw,54,10);g.fill();
    g.fillStyle=c[2];g.fillText(blok.titel,x+42,y0+26+38);
    /* inhoud */
    var items=punten(S.b[blok.id]),tx=x+34,tw=bw-68,top=y0+104,ruimte=bh-104-26;
    if(!items.length){
      g.strokeStyle=KLEUR.paarsLicht;g.lineWidth=4;g.setLineDash([3,14]);g.lineCap='round';
      for(var q=1;q<=3;q++){g.beginPath();g.moveTo(tx,top+q*62-8);g.lineTo(tx+tw,top+q*62-8);g.stroke();}
      g.setLineDash([]);return;
    }
    var fs=36,regels,lh;
    for(;;){
      font(500,fs);lh=Math.round(fs*1.28);regels=[];
      items.forEach(function(it){breek(it,tw-fs).forEach(function(r,j){regels.push({t:r,b:j===0});});});
      if(regels.length*lh<=ruimte||fs<=22)break;fs-=2;
    }
    var maxR=Math.floor(ruimte/lh);
    if(regels.length>maxR){regels=regels.slice(0,maxR);var l=regels[maxR-1];while(g.measureText(l.t+'…').width>tw-fs&&l.t.length>1)l.t=l.t.slice(0,-1);l.t+='…';}
    regels.forEach(function(r,j){
      var by=top+j*lh+fs*.82;
      if(r.b){g.fillStyle=c[0];g.beginPath();g.arc(tx+fs*.24,by-fs*.3,fs*.2,0,Math.PI*2);g.fill();}
      g.fillStyle=KLEUR.navy;g.fillText(r.t,tx+fs,by);
    });
  });

  if(band){
    var bx=gx,byy=1424,bbw=bw*2+kx,bbh=188;
    g.fillStyle=KLEUR.wit;rr(bx,byy,bbw,bbh,28);g.fill();
    g.strokeStyle=KLEUR.paars;g.lineWidth=8;rr(bx+4,byy+4,bbw-8,bbh-8,24);g.stroke();
    var bt='Als het te veel wordt, heb ik dit nodig';font(600,31);
    g.fillStyle=KLEUR.paarsZacht;rr(bx+26,byy+24,g.measureText(bt).width+32,54,10);g.fill();
    g.fillStyle=KLEUR.paarsDiep;g.fillText(bt,bx+42,byy+24+38);
    var zin=S.nodig.join('  •  '),zw=bbw-68,zf=32,zr,zl;
    for(;;){font(500,zf);zl=Math.round(zf*1.25);zr=breek(zin,zw);if(zr.length*zl<=84||zf<=22)break;zf-=2;}
    var zm=Math.max(1,Math.floor(84/zl));if(zr.length>zm){zr=zr.slice(0,zm);zr[zm-1]=zr[zm-1].replace(/\s*•?\s*$/,'')+'…';}
    g.fillStyle=KLEUR.navy;zr.forEach(function(r,j){g.fillText(r.replace(/^•\s*/,''),bx+34,byy+92+j*zl+zf*.82);});
  }

  /* voet */
  breintje(196,1668,.62);
  g.fillStyle=KLEUR.paars;font(700,44,"'Amatic SC', 'Comic Sans MS', cursive");
  g.fillText('Bijzondere Breintjes',246,1683);
  g.textAlign='right';g.fillStyle=KLEUR.paarsDiep;font(500,24);g.fillText('www.bijzonderebreintjes.nl',W-150,1680);g.textAlign='left';
}
var timer=null;
function ververs(){teken();try{$('kaartbeeld').src=cv.toDataURL('image/jpeg',.9);}catch(e){}}
function wijzig(){
  if(S.voorbeeld&&arguments.length===0){/* blijft voorbeeld tot er iets verandert */}
  bewaar();clearTimeout(timer);timer=setTimeout(ververs,180);
}
/* zodra iemand iets aanpast is het geen voorbeeld meer */
document.addEventListener('input',function(){if(S.voorbeeld){S.voorbeeld=false;$('voorbeeld').hidden=true;bewaar();}});
$('paneel-invullen').addEventListener('click',function(e){if(S.voorbeeld&&e.target.closest('.chip,.kleur,.fasekeus')){S.voorbeeld=false;$('voorbeeld').hidden=true;bewaar();}});

/* ---------- bewaren ---------- */
var mTimer=null;
function zeg(t){$('melding').textContent=t;clearTimeout(mTimer);mTimer=setTimeout(function(){$('melding').textContent='';},6000);}
function bestandsnaam(ext){var n=(S.naam||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');return 'dit-ben-ik'+(n?'-'+n:'')+'.'+ext;}
function alsBlob(type,q){return new Promise(function(ok,nee){try{cv.toBlob(function(b){b?ok(b):nee(new Error('leeg'));},type,q);}catch(e){nee(e);}});}
var downloads=null;
function laadPdf(){
  if(window.jspdf&&window.jspdf.jsPDF)return Promise.resolve();
  return new Promise(function(ok,nee){var s=document.createElement('script');s.src='js/vendor/jspdf.umd.min.js';s.onload=function(){ok();};s.onerror=function(){nee(new Error('pdf'));};document.head.appendChild(s);});
}
function geef(naam,blob){
  if(downloads)return downloads.save({filename:naam,data:blob});
  var a=document.createElement('a'),url=URL.createObjectURL(blob);
  a.href=url;a.download=naam;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},2000);
}
function sla(ext,maak){
  teken();
  Promise.resolve().then(maak).then(function(data){return geef(bestandsnaam(ext),data);})
  .then(function(){zeg('Bewaard. Veel plezier met de kaart!');})
  .catch(function(err){
    var c=err&&err.code;
    if(c==='declined')zeg('Niet bewaard. Tik opnieuw als je hem toch wilt bewaren.');
    else if(c==='rate_limited')zeg('Er staat nog een venster open. Wacht even en probeer het opnieuw.');
    else zeg('Bewaren lukt hier niet. Houd de kaart ingedrukt en bewaar hem als plaatje.');
  });
}
$('bewaar-png').addEventListener('click',function(){sla('png',function(){return alsBlob('image/png');});});
$('bewaar-pdf').addEventListener('click',function(){sla('pdf',function(){
  return laadPdf().then(function(){
    var doc=new window.jspdf.jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
    doc.addImage(cv.toDataURL('image/jpeg',.94),'JPEG',0,0,210,297);
    return doc.output('blob');
  });
});});
if(window.claude&&typeof window.claude.use==='function'){
  /* In een Claude-artefact mag bewaren alleen via de downloads-functie. */
  window.claude.use('downloads').then(function(d){
    if(!d)return;downloads=d;
    $('bewaar-png').hidden=false;$('bewaar-pdf').hidden=false;
  }).catch(function(){});
}else{
  $('bewaar-png').hidden=false;$('bewaar-pdf').hidden=false;
}

/* ---------- start ---------- */
bouw();
laadFoto(ververs);
if(document.fonts&&document.fonts.load){
  Promise.all([document.fonts.load('700 40px Fredoka'),document.fonts.load('600 40px Fredoka'),document.fonts.load('500 40px Fredoka'),document.fonts.load("700 40px 'Amatic SC'")]).then(ververs).catch(function(){});
}
})();
