const formats={website:[1340,240],compact:[600,110],landscape:[1920,1080],portrait:[1080,1350],square:[1080,1080],symbol:[480,300]};
const params=new URLSearchParams(location.hash.slice(1));
let layout=Object.hasOwn(formats,params.get('layout'))?params.get('layout'):'website';
const inks=['green','black','white','two-tone-dark','two-tone-light'];
let ink=inks.includes(params.get('ink'))?params.get('ink'):'two-tone-dark';
const $=s=>document.querySelector(s);
function render(){
 const [w,h]=formats[layout],stem=`kit/logo-${layout}-${ink}`,label=layout[0].toUpperCase()+layout.slice(1);
 $('#main-logo').src=stem+'.svg';$('#main-logo').width=w;$('#main-logo').height=h;
 $('#main-logo').alt=`JuverTech IT Solutions ${layout} logo, ${ink.replaceAll('-',' ')}`;
 $('#artboard').classList.toggle('light-ground',['black','two-tone-light'].includes(ink));
 $('#artboard').classList.toggle('wide',['website','compact','landscape'].includes(layout));
 $('#ink').value=ink;$('#svg-download').href=stem+'.svg';$('#png-download').href=stem+'.png';
 $('#format-label').textContent=label+' · transparent artwork';$('#asset-note').textContent=`${label} / ${w} × ${h} vector canvas`;
 document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.format===layout)));
}
function remember(){history.replaceState(null,'',`#layout=${layout}&ink=${ink}`);}
document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>{layout=b.dataset.format;render();remember();}));
$('#ink').addEventListener('change',e=>{ink=e.target.value;render();remember();});
render();
