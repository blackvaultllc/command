// Fresh Sand Code sandbox for the static preview. Original point formulas written for this page.
(function(){
"use strict";
var canvas=document.getElementById("sandCanvas");
if(!canvas) return;
var ctx=canvas.getContext("2d");
var W=canvas.width,H=canvas.height;
var shapes=["Infinity Loop","Serpent Wave","Guardian Shield","Spiral Galaxy","Orb and Ring","Boat","Yacht","Map","Star","The Eternal Heart","Tree","House","Dog","Cat","Fish","Bird","Butterfly","Crown","Anchor","Key","Falcon Strike Aircraft"];
var shapeKeys={ "infinity loop":"Infinity Loop","serpent wave":"Serpent Wave","guardian shield":"Guardian Shield","spiral galaxy":"Spiral Galaxy","orb and ring":"Orb and Ring","orb":"Orb and Ring","boat":"Boat","yacht":"Yacht","map":"Map","star":"Star","heart":"The Eternal Heart","the eternal heart":"The Eternal Heart","tree":"Tree","house":"House","dog":"Dog","cat":"Cat","fish":"Fish","bird":"Bird","butterfly":"Butterfly","crown":"Crown","anchor":"Anchor","key":"Key","falcon strike aircraft":"Falcon Strike Aircraft","jet":"Falcon Strike Aircraft","fighter":"Falcon Strike Aircraft","plane":"Falcon Strike Aircraft" };
var select=document.getElementById("shapeSelect");
shapes.forEach(function(s){var o=document.createElement("option");o.value=s;o.textContent=s;select.appendChild(o);});
function pts(){var a=[];return a;}
function add(a,x,y){a.push([x,y]);}
function ellipse(a,cx,cy,rx,ry,n,ph){for(var i=0;i<n;i++){var t=ph+i/n*Math.PI*2;add(a,cx+rx*Math.cos(t),cy+ry*Math.sin(t));}}
function line(a,x1,y1,x2,y2,n){for(var i=0;i<n;i++){var t=i/Math.max(1,n-1);add(a,x1+(x2-x1)*t,y1+(y2-y1)*t);}}
function poly(a,verts,n){for(var i=0;i<verts.length;i++){var p=verts[i],q=verts[(i+1)%verts.length];var seg=Math.floor(n/verts.length);line(a,p[0],p[1],q[0],q[1],seg);}}
function fillRect(a,x,y,w,h,n){for(var i=0;i<n;i++){add(a,x+Math.random()*w,y+Math.random()*h);}}
function starPts(a,cx,cy,r1,r2,n){for(var i=0;i<5;i++){var a1=-Math.PI/2+i*2*Math.PI/5,a2=a1+Math.PI/5;line(a,cx+r1*Math.cos(a1),cy+r1*Math.sin(a1),cx+r2*Math.cos(a2),cy+r2*Math.sin(a2),Math.floor(n/10));line(a,cx+r2*Math.cos(a2),cy+r2*Math.sin(a2),cx+r1*Math.cos(a1+2*Math.PI/5),cy+r1*Math.sin(a1+2*Math.PI/5),Math.floor(n/10));}}
function shapePoints(name){
  var a=pts(),cx=W/2,cy=H/2;
  if(name==="Infinity Loop"){for(var i=0;i<800;i++){var t=i/800*Math.PI*2;var d=1+Math.pow(Math.sin(t),2);add(a,cx+170*Math.cos(t)/d,cy+110*Math.sin(t)*Math.cos(t)/d);}}
  else if(name==="Serpent Wave"){for(var i=0;i<800;i++){var x=80+i/800*740;add(a,x,cy+90*Math.sin(i/800*Math.PI*4)+20*Math.sin(i/800*Math.PI*12));}}
  else if(name==="Guardian Shield"){ellipse(a,cx,cy-20,130,110,300,0);poly(a,[[cx-130,cy-20],[cx+130,cy-20],[cx+100,cy+130],[cx,cy+180],[cx-100,cy+130]],250);fillRect(a,cx-60,cy-60,120,80,250);}
  else if(name==="Spiral Galaxy"){for(var i=0;i<800;i++){var r=10+i/800*190;var th=i/800*Math.PI*6;add(a,cx+r*Math.cos(th),cy+r*0.55*Math.sin(th));}}
  else if(name==="Orb and Ring"){ellipse(a,cx,cy,110,110,400,0);ellipse(a,cx,cy,190,55,400,0.5);}
  else if(name==="Boat"){poly(a,[[cx-160,cy+40],[cx+160,cy+40],[cx+110,cy+130],[cx-110,cy+130]],250);line(a,cx,cy-130,cx,cy+40,120);poly(a,[[cx,cy-130],[cx+130,cy-10],[cx,cy-10]],180);line(a,cx-170,cy+150,cx+170,cy+150,120);}
  else if(name==="Yacht"){poly(a,[[cx-180,cy+60],[cx+180,cy+60],[cx+120,cy+140],[cx-120,cy+140]],250);poly(a,[[cx-60,cy-140],[cx+80,cy-140],[cx+80,cy+50],[cx-60,cy+50]],200);line(a,cx+80,cy-160,cx+80,cy+50,100);}
  else if(name==="Map"){fillRect(a,cx-190,cy-130,260,240,450);fillRect(a,cx+40,cy-80,150,170,300);add(a,cx+20,cy-20);ellipse(a,cx+20,cy-20,14,14,50,0);line(a,cx+20,cy-20,cx+20,cy-60,30);}
  else if(name==="Star"){starPts(a,cx,cy,170,70,800);}
  else if(name==="The Eternal Heart"){for(var i=0;i<800;i++){var t=i/800*Math.PI*2;var x=16*Math.pow(Math.sin(t),3);var y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);add(a,cx+x*11,cy-y*11);}}
  else if(name==="Tree"){fillRect(a,cx-20,cy+20,40,130,150);ellipse(a,cx,cy-60,130,110,500,0);ellipse(a,cx,cy-130,90,80,150,0);}
  else if(name==="House"){poly(a,[[cx-150,cy+20],[cx,cy-150],[cx+150,cy+20],[cx+150,cy+150],[cx-150,cy+150]],500);fillRect(a,cx-35,cy+40,70,110,150);fillRect(a,cx-110,cy+40,50,50,80);fillRect(a,cx+60,cy+40,50,50,80);}
  else if(name==="Dog"){ellipse(a,cx,cy+30,170,70,300,0);ellipse(a,cx-150,cy-60,55,70,180,0);ellipse(a,cx+150,cy-60,55,70,180,0);line(a,cx-120,cy+90,cx-120,cy+170,60);line(a,cx+120,cy+90,cx+120,cy+170,60);line(a,cx+190,cy+20,cx+250,cy-40,80);}
  else if(name==="Cat"){ellipse(a,cx,cy+40,150,70,300,0);poly(a,[[cx-110,cy-20],[cx-90,cy-130],[cx-40,cy-40]],120);poly(a,[[cx+110,cy-20],[cx+90,cy-130],[cx+40,cy-40]],120);line(a,cx-140,cy+90,cx-140,cy+170,60);line(a,cx+140,cy+90,cx+140,cy+170,60);}
  else if(name==="Fish"){ellipse(a,cx,cy,160,70,400,0);poly(a,[[cx+150,cy],[cx+230,cy-70],[cx+230,cy+70]],150);ellipse(a,cx-60,cy-10,12,12,50,0);}
  else if(name==="Bird"){ellipse(a,cx,cy,110,55,250,0);poly(a,[[cx-100,cy-10],[cx-200,cy-80],[cx-90,cy+20]],150);poly(a,[[cx+100,cy-10],[cx+200,cy-80],[cx+90,cy+20]],150);line(a,cx+110,cy-20,cx+140,cy-20,60);}
  else if(name==="Butterfly"){ellipse(a,cx-80,cy-40,80,90,250,0.6);ellipse(a,cx+80,cy-40,80,90,250,-0.6);ellipse(a,cx-70,cy+70,60,70,150,0);ellipse(a,cx+70,cy+70,60,70,150,0);line(a,cx,cy-90,cx,cy+90,100);}
  else if(name==="Crown"){poly(a,[[cx-160,cy+100],[cx-160,cy-80],[cx-80,cy+10],[cx,cy-120],[cx+80,cy+10],[cx+160,cy-80],[cx+160,cy+100]],500);fillRect(a,cx-160,cy+110,320,30,150);}
  else if(name==="Anchor"){line(a,cx,cy-160,cx,cy+120,250);ellipse(a,cx,cy-150,25,25,100,0);line(a,cx-140,cy+40,cx+140,cy+40,200);ellipse(a,cx,cy+90,120,70,250,Math.PI);}
  else if(name==="Key"){line(a,cx-150,cy,cx+150,cy,300);ellipse(a,cx-150,cy,55,55,200,0);line(a,cx+110,cy,cx+110,cy+70,80);line(a,cx+150,cy,cx+150,cy+50,60);}
  else if(name==="Falcon Strike Aircraft"){poly(a,[[cx-200,cy],[cx,cy-70],[cx+200,cy],[cx+60,cy+20],[cx,cy+60],[cx-60,cy+20]],350);poly(a,[[cx-40,cy-20],[cx+40,cy-20],[cx+40,cy+50],[cx-40,cy+50]],200);line(a,cx,cy+50,cx,cy+110,100);}
  return a;
}
var current="Infinity Loop", scattered=false, auraOn=true, moveStyle="smooth";
var count=800, dotSize=2, speed=3;
var points=[];
function build(){
  var targets=shapePoints(current);
  points=[];
  var n=Math.min(count,targets.length);
  for(var i=0;i<count;i++){var t=targets[i%targets.length];points.push({x:Math.random()*W,y:Math.random()*H,tx:t[0],ty:t[1],ph:Math.random()*Math.PI*2});}
  document.getElementById("sandStatus").textContent="NOW: "+current.toUpperCase()+(scattered?" — SCATTERED":"");
}
function scatterTargets(){points.forEach(function(p){p.tx=Math.random()*W;p.ty=Math.random()*H;});}
function gatherTargets(){var t=shapePoints(current);points.forEach(function(p,i){p.tx=t[i%t.length][0];p.ty=t[i%t.length][1];});}
function setShape(name){current=name;select.value=name;scattered=false;gatherTargets();document.getElementById("sandStatus").textContent="NOW: "+current.toUpperCase();}
function tick(){
  ctx.clearRect(0,0,W,H);ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
  var step=0.02+speed*0.015;
  points.forEach(function(p,i){
    var wob=moveStyle==="floaty"?Math.sin(Date.now()/900+p.ph)*6:moveStyle==="wild"?Math.sin(Date.now()/300+p.ph)*14:moveStyle==="drift"?Math.sin(Date.now()/2000+p.ph)*3:0;
    var snap=moveStyle==="snappy"?0.12:step;
    p.x+=(p.tx+wob-p.x)*snap;p.y+=(p.ty-p.y)*snap;
    ctx.fillStyle=auraOn?"#ffd27a":"#e8c15a";
    ctx.beginPath();ctx.arc(p.x,p.y,dotSize,0,Math.PI*2);ctx.fill();
    if(auraOn){ctx.fillStyle="rgba(232,193,90,0.25)";ctx.beginPath();ctx.arc(p.x,p.y,dotSize+3,0,Math.PI*2);ctx.fill();}
  });
  requestAnimationFrame(tick);
}
build();tick();
select.addEventListener("change",function(){setShape(select.value);});
document.getElementById("moveSelect").addEventListener("change",function(e){moveStyle=e.target.value;});
document.getElementById("sizeRange").addEventListener("input",function(e){dotSize=Number(e.target.value);});
document.getElementById("densityRange").addEventListener("input",function(e){count=Number(e.target.value);build();});
document.getElementById("speedRange").addEventListener("input",function(e){speed=Number(e.target.value);});
document.getElementById("scatterBtn").addEventListener("click",function(){scattered=true;scatterTargets();document.getElementById("sandStatus").textContent="NOW: "+current.toUpperCase()+" — SCATTERED";});
document.getElementById("gatherBtn").addEventListener("click",function(){scattered=false;gatherTargets();document.getElementById("sandStatus").textContent="NOW: "+current.toUpperCase();});
document.getElementById("nextBtn").addEventListener("click",function(){var i=shapes.indexOf(current);setShape(shapes[(i+1)%shapes.length]);});
document.getElementById("auraBtn").addEventListener("click",function(e){auraOn=!auraOn;e.target.textContent="Aura: "+(auraOn?"On":"Off");});
function runCmd(raw){
  var reply=document.getElementById("termReply");
  var s=raw.trim().toLowerCase().replace(/^\//,"");
  if(!s){reply.textContent="Type a slash command, for example /dog.";return;}
  if(s==="help"){reply.textContent="Help — Shapes: /dog /cat /boat /yacht /map /star /heart /tree /house /fish /bird /butterfly /crown /anchor /key /jet /shield /infinity /serpent /galaxy /orb. Sand: /scatter /gather /reform. Look and motion: /smaller /bigger /faster /slower, and movement styles smooth, floaty, snappy, wild, drift. Toggles: aura on or off.";return;}
  if(s==="scatter"){document.getElementById("scatterBtn").click();reply.textContent="NOW: "+current.toUpperCase()+" — SCATTERED";return;}
  if(s==="gather"||s==="reform"){document.getElementById("gatherBtn").click();reply.textContent="NOW: "+current.toUpperCase();return;}
  if(s==="smaller"){dotSize=Math.max(1,dotSize-1);reply.textContent="Dots smaller.";return;}
  if(s==="bigger"){dotSize=Math.min(5,dotSize+1);reply.textContent="Dots bigger.";return;}
  if(s==="faster"){speed=Math.min(5,speed+1);reply.textContent="Faster.";return;}
  if(s==="slower"){speed=Math.max(1,speed-1);reply.textContent="Slower.";return;}
  var alias={"shield":"Guardian Shield","infinity":"Infinity Loop","serpent":"Serpent Wave","galaxy":"Spiral Galaxy","orb":"Orb and Ring"};
  var key=alias[s]||shapeKeys[s];
  if(key){setShape(key);reply.textContent="NOW: "+key.toUpperCase();return;}
  reply.textContent="Unknown command. Try /dog, /boat, /map, /scatter, or /help.";
}
document.getElementById("runBtn").addEventListener("click",function(){runCmd(document.getElementById("sandTerminal").value);});
document.getElementById("sandTerminal").addEventListener("keydown",function(e){if(e.key==="Enter"){runCmd(e.target.value);}});
document.getElementById("galleryBtn").addEventListener("click",function(){
  var q=document.getElementById("gallerySearch").value.trim().toLowerCase();
  var r=document.getElementById("galleryResult");
  if(["jet","fighter","plane"].indexOf(q)>=0){r.textContent="Found: Falcon Strike Aircraft. Tap the shape picker to view it.";setShape("Falcon Strike Aircraft");}
  else if(shapeKeys[q]){r.textContent="Found: "+shapeKeys[q]+".";setShape(shapeKeys[q]);}
  else if(!q){r.textContent="Type a gallery search, for example jet or heart.";}
  else{r.textContent="NOT FOUND in this preview gallery. Only shapes actually built here are listed.";}
});
document.getElementById("lawBtn").addEventListener("click",function(){
  var q=document.getElementById("lawSearch").value.trim().toLowerCase();
  var r=document.getElementById("lawResult");
  if(q.indexOf("computer")>=0){r.textContent="Found: 18 U.S.C. § 1030 — Fraud and related activity in connection with computers (federal).";}
  else if(q.indexOf("first")>=0||q.indexOf("amendment")>=0||q.indexOf("speech")>=0){r.textContent="Found: U.S. Constitution, First Amendment — Fundamental Freedoms (federal).";}
  else if(!q){r.textContent="Type a law search.";}
  else{r.textContent="NOT FOUND in this preview library. Other states are NOT COVERED here, and this preview does not guess at entries.";}
});
})();
