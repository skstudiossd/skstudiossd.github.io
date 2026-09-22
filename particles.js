/* Equal constellation density per CSS pixel; independent of screen DPI. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.intro, .hero, .about-hero, .engineering-intro, .project-heading');
  for (const target of targets) {
    const fullPage = target.classList.contains('hero');
    const canvas = document.createElement('canvas');
    canvas.className = fullPage ? 'page-particles' : 'header-particles';
    canvas.setAttribute('aria-hidden', 'true');
    if (fullPage) document.body.prepend(canvas);
    else { target.classList.add('particle-header'); target.prepend(canvas); }
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    let w = 0, h = 0, points = [], request = 0, last = 0, visible = true;
    let mouse = {x: -9999, y: -9999};
    function resize() {
      const rect = fullPage ? {width: innerWidth, height: innerHeight} : target.getBoundingClientRect();
      const oldW = w || 1, oldH = h || 1;
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points.forEach(p => { p.x *= w / oldW; p.y *= h / oldH; });
      const count = Math.max(1, Math.round(w * h / 14000));
      points.length = Math.min(points.length, count);
      while (points.length < count) points.push({x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-.5)*.15, vy: (Math.random()-.5)*.15, r: Math.random()*1.4+.7});
      canvas.dataset.nodeCount = count;
      sync();
    }
    function sync() {
      cancelAnimationFrame(request); request = 0; last = 0;
      if (!reduced.matches && visible && !document.hidden) request = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, w, h);
    }
    function draw(now) {
      const dt = last ? Math.min((now-last)/16.667, 2) : 1; last = now;
      ctx.clearRect(0, 0, w, h);
      // Spatial buckets keep neighbor checks local on large displays.
      const buckets = new Map(), cell = 130;
      for (const p of points) {
        const d = Math.hypot(p.x-mouse.x, p.y-mouse.y);
        if (d < 160) {
          const a = Math.atan2(p.y-mouse.y,p.x-mouse.x), f=(160-d)/160*.004*dt;
          p.vx += Math.cos(a)*f; p.vy += Math.sin(a)*f;
        }
        const speed = Math.hypot(p.vx,p.vy);
        if (speed > .5) { p.vx *= .5/speed; p.vy *= .5/speed; }
        p.x = (p.x+p.vx*dt+w)%w; p.y = (p.y+p.vy*dt+h)%h;
        p.near = d<160; p.distance=d;
        const bx=Math.floor(p.x/cell), by=Math.floor(p.y/cell);
        for (let x=bx-1;x<=bx+1;x++) for (let y=by-1;y<=by+1;y++) {
          for (const q of buckets.get(x+','+y)||[]) {
            const distance=Math.hypot(p.x-q.x,p.y-q.y);
            if(distance>=cell) continue;
            const near=p.near||q.near;
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
            ctx.strokeStyle=`rgba(210,210,210,${(1-distance/cell)*(near?.42:.06)})`;
            ctx.lineWidth=near?.8:.5;ctx.stroke();
          }
        }
        const key=bx+','+by;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(p);
      }
      for(const p of points){
        ctx.beginPath();ctx.arc(p.x,p.y,p.r*(p.near?1.4:1),0,Math.PI*2);
        ctx.fillStyle=`rgba(215,215,210,${p.near?.65+(1-p.distance/160)*.3:.14})`;ctx.fill();
      }
      request=requestAnimationFrame(draw);
    }
    window.addEventListener('pointermove', e => {
      const r=canvas.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top};
    },{passive:true});
    document.documentElement.addEventListener('pointerleave',()=>{mouse={x:-9999,y:-9999};});
    window.addEventListener('scroll',()=>{mouse={x:-9999,y:-9999};},{passive:true});
    reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
    new ResizeObserver(resize).observe(fullPage?document.documentElement:target);
    window.addEventListener('resize',resize,{passive:true});
    if(!fullPage)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(target);
    resize();
  }
})();
