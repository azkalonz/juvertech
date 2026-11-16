const menuButton=document.querySelector('.menu-button');
const mobileNav=document.querySelector('.mobile-nav');
function closeMenu(){mobileNav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Open navigation');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');mobileNav.classList.toggle('open',open);});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
window.addEventListener('resize',()=>{if(window.innerWidth>600)closeMenu();});

const tabs=[...document.querySelectorAll('.solution-tab')];
function activateTab(tab,focus=false){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});if(focus)tab.focus();}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{activateTab(tab);history.replaceState(null,'','#'+tab.dataset.solution);});tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activateTab(tabs[next],true);history.replaceState(null,'','#'+tabs[next].dataset.solution);}});});
if(tabs.length){const requested=tabs.find(t=>'#'+t.dataset.solution===location.hash);if(requested)activateTab(requested);}
const productSearch=document.querySelector('#product-search');const productFilter=document.querySelector('#product-filter');
function filterProducts(){const query=(productSearch?.value||'').trim().toLowerCase();const status=productFilter?.value||'all';let count=0;document.querySelectorAll('[data-product]').forEach(row=>{const matches=row.textContent.toLowerCase().includes(query)&&(status==='all'||row.dataset.status===status);row.hidden=!matches;if(matches)count++;});const countNode=document.querySelector('#product-count');if(countNode)countNode.textContent=count+' of 4 sample products';const empty=document.querySelector('#product-empty');if(empty)empty.hidden=count!==0;}
productSearch?.addEventListener('input',filterProducts);productFilter?.addEventListener('change',filterProducts);
const simulateButton=document.querySelector('#simulate-order');let orderStep=1;
const statuses=['Received','Validated','Label generated','Shipped','Delivered'];
const statusNotes=['Order received from the sample store.','Customer, address and order items validated.','Sample shipping label generated. Print confirmation would be handled separately.','Sample carrier event received. Tracking and shipment status updated.','Delivery confirmed in this example. Customer notification queued.'];
simulateButton?.addEventListener('click',()=>{orderStep=orderStep>=5?1:orderStep+1;document.querySelectorAll('.order-step').forEach((el,i)=>el.classList.toggle('active',i<orderStep));document.querySelector('#order-status').textContent=statuses[orderStep-1];document.querySelector('#order-event').textContent=statusNotes[orderStep-1];simulateButton.querySelector('span').textContent=orderStep===5?'Restart example':'Advance sample order';});
