/* Matte-Portalen: gemensamma ljud för alla övningar.
   Ljuden skapas direkt i webbläsaren, så inga ljudfiler behövs.
   Ljudet slås på och av på startsidan och gäller sedan överallt. */
(function(){
  const KEY='matteportalen-ljud';
  let ctx=null;
  const isOn=()=>{try{return localStorage.getItem(KEY)!=='av'}catch(e){return true}};
  function ac(){
    if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A();}
    if(ctx.state==='suspended')ctx.resume();
    return ctx;
  }
  function tone(freq,start,dur,type,vol,slideTo){
    const c=ac();if(!c)return;
    const t=c.currentTime+start,o=c.createOscillator(),g=c.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(freq,t);
    if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.15,t+.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.05);
  }
  const Ljud={
    get on(){return isOn()},
    set(v){try{localStorage.setItem(KEY,v?'på':'av')}catch(e){}},
    /* Rätt svar: ett glatt litet pling */
    ok(){if(!isOn())return;tone(880,0,.12,'sine',.16);tone(1320,.08,.18,'sine',.14);},
    /* Fel svar: ett mjukt, snällt "boop" */
    bad(){if(!isOn())return;tone(330,0,.22,'triangle',.12,220);},
    /* Rekord, medalj eller alla rätt: en liten fanfar */
    fanfare(){if(!isOn())return;[523,659,784].forEach((f,i)=>tone(f,i*.11,.16,'triangle',.14));tone(1047,.33,.5,'triangle',.16);tone(1319,.33,.5,'sine',.07);},
    /* Nytt klistermärke eller ny sak i garderoben */
    magic(){if(!isOn())return;[1047,1319,1568,2093].forEach((f,i)=>tone(f,i*.07,.25,'sine',.09));}
  };
  window.Ljud=Ljud;
})();
