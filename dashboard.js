import { firebaseConfig } from './firebase-config.js';
import { KPI_MASTER } from './kpi-master.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp, query, where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app); const msg=document.getElementById('msg');
document.getElementById('logoutBtn')?.addEventListener('click',()=>signOut(auth).then(()=>location.href='index.html'));
onAuthStateChanged(auth,u=>{ if(!u) location.href='index.html'; });

const table=document.getElementById('kpiDashTable'); const dashMonth=document.getElementById('dashMonth');
async function load(){ const m=dashMonth.value; const qs=await getDocs(query(collection(db,'kpis'), where('month','==',m))); const saved={}; qs.forEach(x=>saved[x.data().area+'_'+x.data().parameter]=x.data()); const rows=KPI_MASTER.map(k=>({...k,...(saved[k.area+'_'+k.parameter]||{})})); table.innerHTML='<tr><th>Area</th><th>Parameter</th><th>Target</th><th>Actual</th><th>Judgt</th><th>Trend</th><th>Remarks</th><th>Updated By</th></tr>'+rows.map(r=>`<tr><td>${r.area}</td><td>${r.parameter}</td><td>${r.monthTarget}</td><td>${r.actual??''}</td><td class="big">${r.judgt??''}</td><td class="big">${r.trend??''}</td><td>${r.remarks??''}</td><td>${r.updatedBy??''}</td></tr>`).join(''); msg.textContent='Showing '+m; }
dashMonth.addEventListener('change',load); document.getElementById('downloadBtn').addEventListener('click',()=>{let csv='Area,Parameter,Target,Actual,Judgt,Trend,Remarks
'; for(const tr of table.querySelectorAll('tr:not(:first-child)')) csv += [...tr.children].slice(0,7).map(td=>'"'+td.textContent.replaceAll('"','""')+'"').join(',')+'
'; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='PE_3F_KPI_'+dashMonth.value+'.csv'; a.click();}); setTimeout(load,800);
