
let db=null; let firebaseReady=false;
function initFirebase(){try{ if(typeof firebaseConfig==='undefined' || String(firebaseConfig.apiKey||'').includes('PASTE_')){setMsg('Firebase config missing. Tables show, but cloud save/load will not work.','bad');return;} firebase.initializeApp(firebaseConfig); db=firebase.firestore(); firebaseReady=true; setMsg('Firebase ready','ok'); }catch(e){setMsg('Firebase init error: '+e.message,'bad');}}
function cm(){return new Date().toLocaleString('en-US',{month:'short'});}function monthClass(m){return m===cm()?'month-current':'month-other'}function tdClass(m){return m===cm()?' month-current-cell':''}
function fillMonths(id){let s=document.getElementById(id); if(!s)return; s.innerHTML=MONTHS.map(m=>`<option value="${m}">${m}</option>`).join(''); if(MONTHS.includes(cm()))s.value=cm();}
function setMsg(t,c='status'){let m=document.getElementById('msg'); if(m){m.className=c;m.textContent=t;}}
function safeId(s){return String(s).replace(/[^a-zA-Z0-9]/g,'_')}
async function saveDoc(col,id,data){if(!firebaseReady)throw new Error('Firebase not ready'); await db.collection(col).doc(id).set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}
async function getDoc(col,id){if(!firebaseReady)return null; let d=await db.collection(col).doc(id).get(); return d.exists?d.data():null;}
async function allDocs(col){if(!firebaseReady)return {}; let out={}; let q=await db.collection(col).get(); q.forEach(d=>out[d.id]=d.data()); return out;}
function n(x){let v=Number(x); return Number.isFinite(v)?v:0}function isNum(x){return x!==''&&x!=null&&x!==undefined&&Number.isFinite(Number(x))}function fmt(x){if(x===''||x==null||x===undefined)return'';let v=Number(x);return Number.isFinite(v)?Math.round(v*100)/100:x}function pct(leaves,days,assoc){return days&&assoc?(leaves/(days*assoc))*100:''}function per(hrs,assoc){return assoc?hrs/assoc:''}
function parseTarget(t){ if(t===''||t==null||t===undefined) return null; let s=String(t).trim(); let op='='; if(s.startsWith('<=')){op='<=';s=s.slice(2)} else if(s.startsWith('>=')){op='>=';s=s.slice(2)} else if(s.startsWith('<')){op='<';s=s.slice(1)} else if(s.startsWith('>')){op='>';s=s.slice(1)} s=s.replace('%',''); let v=Number(s); if(!Number.isFinite(v)) return null; return {op,v}; }
function judge(value,target){ if(!isNum(value)) return ['','blankcell',true]; let t=parseTarget(target); if(!t) return ['','blankcell',true]; let v=Number(value); let ok=true; if(t.op==='<') ok=v<t.v; else if(t.op==='<=') ok=v<=t.v; else if(t.op==='>') ok=v>t.v; else if(t.op==='>=') ok=v>=t.v; else ok=(t.v===0? v===0 : (v>=t.v*0.8 && v<=t.v*1.2)); return [ok?'':'',''+(ok?'okcell':'redcell'),ok]; }
function download(name,html,type){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type}));a.download=name;a.click()}
function excel(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h2>${title}</h2>${html}</body></html>`,'application/vnd.ms-excel')}
function ppt(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h1>${title}</h1>${html}</body></html>`,'application/vnd.ms-powerpoint')}
window.addEventListener('DOMContentLoaded', initFirebase);
