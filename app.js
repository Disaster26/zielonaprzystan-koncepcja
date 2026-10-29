(function(){
  var b=document.getElementById('burger'),n=document.getElementById('nav');
  function zamknij(){n.classList.remove('otwarte');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu');}
  b.addEventListener('click',function(){var o=n.classList.toggle('otwarte');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');});
  n.addEventListener('click',function(e){if(e.target.tagName==='A')zamknij();});

  // dolny pasek na telefonie dopiero po przewinieciu za glowny przycisk
  var mob=document.getElementById('mob'),cta=document.querySelector('.hero-cta, .pod-hero .btn');
  if('IntersectionObserver' in window&&mob&&cta){
    new IntersectionObserver(function(w){var e=w[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);}).observe(cta);
  }

  // galeria realizacji
  var dane=window.REALIZACJE||[];
  document.querySelectorAll('.galeria[data-ile]').forEach(function(g){
    var ile=parseInt(g.getAttribute('data-ile'),10)||dane.length;
    dane.slice(0,ile).forEach(function(p,i){
      var bt=document.createElement('button');bt.type='button';bt.className='real';
      bt.innerHTML='<span class="real-foto"><img src="img/g/'+p.s+'-m.webp" alt="'+p.t+'" loading="lazy" width="600" height="450"></span><span class="real-t"><b>'+p.t+'</b><span>Zobacz zdjęcia</span></span>';
      bt.addEventListener('click',function(){otworz(p.t,p.i.map(function(x){return x[0];}),0,bt);});
      g.appendChild(bt);
    });
  });

  // lightbox
  var lb=document.getElementById('lb'),li=document.getElementById('lb-img'),lt=document.getElementById('lb-tyt'),ld=document.getElementById('lb-dol');
  var lista=[],nr=0,tyt='',wroc=null;
  function pokaz(){
    li.src=lista[nr];li.alt=tyt+' - zdjęcie '+(nr+1);
    ld.textContent=lista.length>1?('Zdjęcie '+(nr+1)+' z '+lista.length):'';
    document.getElementById('lb-p').style.display=document.getElementById('lb-d').style.display=lista.length>1?'':'none';
    if(lista.length>1){var nx=new Image();nx.src=lista[(nr+1)%lista.length];}
  }
  function otworz(t,l,i,z){tyt=t;lista=l;nr=i||0;wroc=z;lt.textContent=t;pokaz();lb.classList.add('otwarty');document.body.classList.add('zablok');document.getElementById('lb-x').focus();}
  function zamk(){lb.classList.remove('otwarty');document.body.classList.remove('zablok');li.removeAttribute('src');if(wroc)wroc.focus();}
  function krok(d){nr=(nr+d+lista.length)%lista.length;pokaz();}
  if(lb){
    document.getElementById('lb-x').addEventListener('click',zamk);
    document.getElementById('lb-p').addEventListener('click',function(){krok(-1);});
    document.getElementById('lb-d').addEventListener('click',function(){krok(1);});
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-scena'))zamk();});
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){zamknij();if(lb.classList.contains('otwarty'))zamk();}
      if(!lb.classList.contains('otwarty'))return;
      if(e.key==='ArrowRight')krok(1);if(e.key==='ArrowLeft')krok(-1);
    });
    var x0=null;
    lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50&&lista.length>1)krok(dx<0?1:-1);x0=null;});
  }
  document.querySelectorAll('[data-list]').forEach(function(el){
    el.addEventListener('click',function(){otworz(el.getAttribute('data-tyt'),[el.getAttribute('data-list')],0,el);});
  });

  // formularz: bez serwera, przygotowuje wiadomosc e-mail
  var f=document.getElementById('form'),info=document.getElementById('form-info');
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    ['imie','kontakt','tresc'].forEach(function(k){var el=f.elements[k];var pusty=!el.value.trim();el.classList.toggle('zle',pusty);if(pusty)ok=false;});
    if(!ok){info.textContent='Uzupełnij imię, kontakt i treść wiadomości.';return;}
    var temat='Zapytanie: '+f.elements.temat.value;
    var tresc=f.elements.tresc.value.trim()+'\n\nMiejsce / powierzchnia: '+(f.elements.miejsce.value.trim()||'-')+'\n\n'+f.elements.imie.value.trim()+'\nKontakt: '+f.elements.kontakt.value.trim();
    info.textContent='Dziękujemy. Otwieramy program pocztowy z gotową wiadomością do info@zielonaprzystan.com.';
    location.href='mailto:info@zielonaprzystan.com?subject='+encodeURIComponent(temat)+'&body='+encodeURIComponent(tresc);
  });
})();
