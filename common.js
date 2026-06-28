import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp, enableNetwork } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const MONTHS=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
let app, db;
const configOk = firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).includes('PASTE_') && firebaseConfig.projectId && !String(firebaseConfig.projectId).includes('PASTE_');
try { app=initializeApp(firebaseConfig); db=getFirestore(app); enableNetwork(db).catch(()=>{}); } catch(e){ console.error('Firebase init error', e); }
function fillMonths(sel){ sel.innerHTML=MONTHS.map(m=>`<option>${m}</option>`).join(''); sel.value=getCurrentFiscalMonth(); }
function getCurrentFiscalMonth(){ return new Date().toLocaleString('en-US',{month:'short'}); }
function setStatus(text,cls='status'){ const m=document.getElementById('msg'); if(m){m.className=cls; m.textContent=text;} }
function requireFirebase(){ if(!configOk || !db) throw new Error('Firebase config is not set correctly. Update firebase-config.js with exact Web App config.'); }
async function saveDocFB(col,id,data){ requireFirebase(); await setDoc(doc(db,col,id), {...data, updatedAt:serverTimestamp()}, {merge:true}); }
async function getDocFB(col,id){ requireFirebase(); const s=await getDoc(doc(db,col,id)); return s.exists()?s.data():null; }
async function getAllDocsFB(col){ requireFirebase(); const out={}; const qs=await getDocs(collection(db,col)); qs.forEach(x=>out[x.id]=x.data()); return out; }
function downloadFile(name,content,type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
function tableToExcel(filename,title,html){ downloadFile(filename,`<html><head><meta charset="utf-8"></head><body><h2>${title}</h2>${html}</body></html>`,'application/vnd.ms-excel'); }
function tableToPpt(filename,title,html){ downloadFile(filename,`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:p="urn:schemas-microsoft-com:office:powerpoint"><head><meta charset="utf-8"><style>body{font-family:Arial}table{border-collapse:collapse;width:100%}td,th{border:1px solid #555;padding:5px;font-size:11px}th{background:#2f2f2f;color:white}.month-current{background:#003b7a!important;color:white!important}.month-other{background:#2f2f2f!important;color:white!important}.month-current-cell{background:#eaf3ff!important}.division-row{background:#fff7d6!important;font-weight:bold}</style></head><body><h1>${title}</h1>${html}</body></html>`,'application/vnd.ms-powerpoint'); }
export { MONTHS, fillMonths, getCurrentFiscalMonth, setStatus, saveDocFB, getDocFB, getAllDocsFB, tableToExcel, tableToPpt, configOk };
