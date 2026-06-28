import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp, enableNetwork } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
let db=null; const configOk=firebaseConfig&&firebaseConfig.apiKey&&!String(firebaseConfig.apiKey).includes('PASTE_');
try{const app=initializeApp(firebaseConfig);db=getFirestore(app);enableNetwork(db).catch(()=>{});}catch(e){console.warn('Firebase init',e)}
function curMonth(){return new Date().toLocaleString('en-US',{month:'short'});} function fillMonths(sel,MONTHS){sel.innerHTML=MONTHS.map(m=>`<option>${m}</option>`).join('');sel.value=curMonth();}
function setStatus(t,c='status'){const m=document.getElementById('msg');if(m){m.className=c;m.textContent=t}}
function req(){if(!configOk||!db)throw new Error('Firebase config missing/wrong. Paste real config in firebase-config.js')}
async function saveDocFB(col,id,data){req();await setDoc(doc(db,col,id),{...data,updatedAt:serverTimestamp()},{merge:true})}
async function getDocFB(col,id){req();const s=await getDoc(doc(db,col,id));return s.exists()?s.data():null}
async function getAllDocsFB(col){req();const out={};const qs=await getDocs(collection(db,col));qs.forEach(d=>out[d.id]=d.data());return out}
function download(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click()}
function toExcel(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h2>${title}</h2>${html}</body></html>`,'application/vnd.ms-excel')}
function toPpt(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h1>${title}</h1>${html}</body></html>`,'application/vnd.ms-powerpoint')}
export{curMonth,fillMonths,setStatus,saveDocFB,getDocFB,getAllDocsFB,toExcel,toPpt,configOk};
