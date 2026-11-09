(function(){
  // mobile menu
  var mb=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
  if(mb&&nav){
    mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}});
  }

  // industry tabs
  var tabs=document.querySelectorAll('.ind-tabs [role="tab"]');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected','false');var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=true});
      t.setAttribute('aria-selected','true');
      var p=document.getElementById(t.getAttribute('aria-controls'));if(p)p.hidden=false;
    });
  });

  // reveal on scroll
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){io.observe(el)});
  }else{rv.forEach(function(el){el.classList.add('in')})}

  // self check
  var sc=document.querySelector('[data-selfcheck]');
  if(sc){
    var boxes=sc.querySelectorAll('input[type=checkbox]');
    var cnt=sc.querySelector('[data-sc-count]'),txt=sc.querySelector('[data-sc-text]');
    var hidden=document.querySelector('[data-sc-hidden]');
    var upd=function(){
      var miss=[];boxes.forEach(function(b){if(!b.checked)miss.push(b.parentNode.textContent.trim())});
      cnt.textContent=miss.length;
      txt.textContent=miss.length>=5?txt.dataset.tAll:(miss.length>0?txt.dataset.tSome:txt.dataset.tNone);
      if(hidden)hidden.value=miss.length+'/'+boxes.length+(miss.length?'：'+miss.join(' / '):'');
    };
    boxes.forEach(function(b){b.addEventListener('change',upd)});upd();
  }

  // price update demo (見本・保存しない)
  var dm=document.querySelector('[data-demo]');
  if(dm){
    var unit=dm.dataset.unit||'円/kg';
    dm.querySelector('[data-demo-save]').addEventListener('click',function(){
      dm.querySelectorAll('input[data-target]').forEach(function(inp){
        var v=inp.value.replace(/[,，円\s]/g,'').replace(/[０-９]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-65248)});
        var out=dm.querySelector('[data-demo-p="'+inp.dataset.target+'"]');
        var html=v===''||isNaN(+v)?(dm.dataset.ask||'お問い合わせ'):Number(v).toLocaleString('ja-JP')+'<small>'+unit+'</small>';
        if(out.innerHTML!==html){out.innerHTML=html;var row=out.parentNode;row.classList.remove('flash');void row.offsetWidth;row.classList.add('flash')}
      });
      var d=new Date(),p=function(n){return String(n).padStart(2,'0')};
      var t=dm.querySelector('[data-demo-time]');
      t.textContent=(dm.dataset.upd||'更新')+' '+p(d.getMonth()+1)+'/'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
      t.parentNode.classList.remove('flash');void t.parentNode.offsetWidth;t.parentNode.classList.add('flash');
    });
  }

  // contact form
  // data-endpoint に Formspree の URL（https://formspree.io/f/xxxx）を入れると送信されます。
  // 空のままならメールソフトを開く方式で動きます。
  var f=document.querySelector('form.contact');
  if(f){
    var msg=f.querySelector('.form-msg');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(f.querySelector('.hp input').value)return;
      var ep=f.getAttribute('data-endpoint')||'';
      var to=f.getAttribute('data-mail');
      var data=new FormData(f);
      var t=f.dataset;
      if(!ep){
        var body='';
        data.forEach(function(v,k){if(k!=='_gotcha'&&k!=='agree')body+=k+': '+v+'\n'});
        location.href='mailto:'+to+'?subject='+encodeURIComponent(t.subject||'Web制作のご相談')+'&body='+encodeURIComponent(body);
        return;
      }
      var b=f.querySelector('button[type="submit"]');b.disabled=true;
      fetch(ep,{method:'POST',body:data,headers:{'Accept':'application/json'}})
        .then(function(r){
          if(r.ok){f.reset();msg.className='form-msg ok';msg.textContent=t.ok}
          else{throw 0}
        })
        .catch(function(){msg.className='form-msg err';msg.textContent=t.err})
        .finally(function(){b.disabled=false});
    });
  }
})();
