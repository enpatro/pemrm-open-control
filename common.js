import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, getDocs, enableNetwork } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const MONTHS=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];let db=null;
const configOk=firebaseConfig&&firebaseConfig.apiKey&&!String(firebaseConfig.apiKey).includes('PASTE_');
try{const app=initializeApp(firebaseConfig);db=getFirestore(app);enableNetwork(db).catch(()=>{});}catch(e){console.warn(e)}
function curMonth(){return new Date().toLocaleString('en-US',{month:'short'});}function status(t,c='status'){let m=document.getElementById('msg');if(m){m.className=c;m.textContent=t}}
async function allDocs(col){if(!configOk||!db) return {}; const out={}; const qs=await getDocs(collection(db,col)); qs.forEach(d=>out[d.id]=d.data()); return out;}
function download(name,html,type){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type}));a.download=name;a.click()}
function toExcel(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h2>${title}</h2>${html}</body></html>`,'application/vnd.ms-excel')}
function toPpt(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h1>${title}</h1>${html}</body></html>`,'application/vnd.ms-powerpoint')}
export{MONTHS,curMonth,status,allDocs,toExcel,toPpt,configOk};
