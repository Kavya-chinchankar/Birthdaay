/* shared helpers for page 7 and its gift pages */
(function(){
  var cv=document.getElementById("sparks"),cx=cv.getContext("2d"),W,H,P=[];
  function size(){W=cv.width=innerWidth;H=cv.height=innerHeight}addEventListener("resize",size);size();
  function spark(y){return{x:Math.random()*W,y:y===undefined?H+20:y,r:1.5+Math.random()*5,v:.25+Math.random()*.7,sw:Math.random()*6.28,sp:.01+Math.random()*.02,a:.15+Math.random()*.5,t:Math.random()*6.28}}
  for(var i=0;i<45;i++)P.push(spark(Math.random()*H));
  (function draw(){cx.clearRect(0,0,W,H);
    P.forEach(function(p,i){p.y-=p.v;p.sw+=p.sp;p.x+=Math.sin(p.sw)*.4;p.t+=.03;if(p.y<-20){P[i]=spark();return}
      var al=p.a*(.6+.4*Math.sin(p.t)),g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
      g.addColorStop(0,"rgba(255,225,160,"+al+")");g.addColorStop(1,"rgba(255,225,160,0)");
      cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r*3,0,6.28);cx.fill()});
    requestAnimationFrame(draw)})();
  var last=0,root=document.documentElement;
  function move(x,y){root.style.setProperty("--mx",x+"px");root.style.setProperty("--my",y+"px")}
  addEventListener("pointermove",function(e){last=Date.now();move(e.clientX,e.clientY)});
  setInterval(function(){if(Date.now()-last<2500)return;var t=Date.now()/1600;move(innerWidth*(.5+.25*Math.sin(t)),innerHeight*(.45+.12*Math.cos(t*.8)))},40);

  var KEY="bd_gifts_v1";
  window.G={
    hearts:function(from,n,ch){var r=from.getBoundingClientRect();
      for(var i=0;i<n;i++)(function(i){setTimeout(function(){var el=document.createElement("div");el.className="fh";el.textContent=ch||"♥";
        el.style.left=(r.left+Math.random()*r.width)+"px";el.style.top=(r.top+r.height/2)+"px";
        el.style.setProperty("--dx",((Math.random()-.5)*200)+"px");el.style.setProperty("--dy",(-(80+Math.random()*240))+"px");
        el.style.fontSize=(14+Math.random()*18)+"px";document.body.appendChild(el);setTimeout(function(){el.remove()},2700)},i*60)})(i)},
    seen:function(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}},
    mark:function(k){try{var s=G.seen();s[k]=1;localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
  };
  /* smooth fade between pages */
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("a[data-nav]");if(!a)return;
    e.preventDefault();document.body.classList.add("leave");setTimeout(function(){location.href=a.href},450);
  });
})();
