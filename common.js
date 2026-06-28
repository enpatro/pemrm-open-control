import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp, query, where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const MONTHS=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
let db=null; let firebaseReady=false;
try{ const app=initializeApp(firebaseConfig); db=getFirestore(app); firebaseReady=!String(firebaseConfig.apiKey||'').includes('PASTE_'); }catch(e){ console.warn('Firebase init skipped',e); }
const DEVICE_USER=localStorage.getItem('kpi_device_user')||('User-'+Math.random().toString(36).slice(2,7)); localStorage.setItem('kpi_device_user',DEVICE_USER);
function fillMonths(sel){ sel.innerHTML=MONTHS.map(m=>`<option>${m}</option>`).join(''); }
function setMsg(t){ const m=document.getElementById('msg'); if(m)m.textContent=t; }
function lsKey(col,id){ return `PEMRM1_${col}_${id}`; }
async function saveDoc(col,id,data){ localStorage.setItem(lsKey(col,id), JSON.stringify({...data, localSavedAt:new Date().toISOString()})); if(firebaseReady && db){ try{ await setDoc(doc(db,col,id), {...data, updatedAt:serverTimestamp()}, {merge:true}); return 'Firebase + local'; }catch(e){ console.warn('Firebase save failed, local saved',e); return 'Local only: '+e.message; }} return 'Local only'; }
async function getDocSafe(col,id){ let local=null; try{ local=JSON.parse(localStorage.getItem(lsKey(col,id))||'null'); }catch(e){} if(firebaseReady && db){ try{ const s=await getDoc(doc(db,col,id)); if(s.exists()) return {...(local||{}),...s.data()}; }catch(e){ console.warn('Firebase load failed, using local',e); }} return local; }
async function getCollectionMonth(col,month){ const out={}; Object.keys(localStorage).filter(k=>k.startsWith(`PEMRM1_${col}_`)).forEach(k=>{try{const v=JSON.parse(localStorage.getItem(k)); if(v.month===month) out[k.replace(`PEMRM1_${col}_`,'')]=v;}catch(e){}}); if(firebaseReady && db){ try{ const qs=await getDocs(query(collection(db,col), where('month','==',month))); qs.forEach(x=>out[x.id]=x.data()); }catch(e){ console.warn('Firebase collection failed, using local',e); }} return out; }
function downloadFile(name, content, type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
function tableToExcel(filename, title, html){ const content=`<html><head><meta charset="utf-8"></head><body><h2>${title}</h2>${html}</body></html>`; downloadFile(filename, content, 'application/vnd.ms-excel'); }
function tableToPpt(filename, title, html){ const content=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:p="urn:schemas-microsoft-com:office:powerpoint"><head><meta charset="utf-8"><style>body{font-family:Arial} table{border-collapse:collapse;width:100%}td,th{border:1px solid #555;padding:5px;font-size:12px}th{background:#0b5cab;color:#fff}h1{color:#0b5cab}</style></head><body><h1>${title}</h1>${html}</body></html>`; downloadFile(filename, content, 'application/vnd.ms-powerpoint'); }
export { MONTHS, DEVICE_USER, fillMonths, setMsg, saveDoc, getDocSafe, getCollectionMonth, tableToExcel, tableToPpt };
