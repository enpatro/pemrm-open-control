import { firebaseConfig } from './firebase-config.js';
import { KPI_MASTER } from './kpi-master.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp, query, where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const app = initializeApp(firebaseConfig); const db = getFirestore(app); const msg=document.getElementById('msg');
const DEVICE_USER = localStorage.getItem('kpi_device_user') || ('User-' + Math.random().toString(36).slice(2,7)); localStorage.setItem('kpi_device_user', DEVICE_USER);

const table=document.getElementById('kpiDashTable'); const dashMonth=document.getElementById('dashMonth');
async function load(){try{const m=dashMonth.value; const qs=await getDocs(query(collection(db,'kpis'), where('month','==',m))); const saved={}; qs.forEach(x=>saved[x.data().area+'_'+x.data().parameter]=x.data()); const rows=KPI_MASTER.map(k=>({...k,...(saved[k.area+'_'+k.parameter]||{})})); table.innerHTML='<tr><th>Area</th><th>Parameter</th><th>Target</th><th>Actual</th><th>Judgt</th><th>Trend</th><th>Remarks</th><th>Updated By</th></tr>'+rows.map(r=>`<tr><td>${r.area}</td><td>${r.parameter}</td><td>${r.monthTarget}</td><td>${r.actual??''}</td><td class='big'>${r.judgt??''}</td><td class='big'>${r.trend??''}</td><td>${r.remarks??''}</td><td>${r.updatedBy??''}</td></tr>`).join(''); msg.textContent='Showing '+m}catch(e){msg.textContent='Dashboard error: '+e.message; console.error(e)}}
dashMonth.addEventListener('change',load); document.getElementById('downloadBtn').addEventListener('click',()=>{let csv='Area,Parameter,Target,Actual,Judgt,Trend,Remarks,Updated By
'; for(const tr of table.querySelectorAll('tr:not(:first-child)')) csv += [...tr.children].map(td=>'"'+td.textContent.replaceAll('"','""')+'"').join(',')+'
'; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='PE_3F_KPI_'+dashMonth.value+'.csv'; a.click();}); setTimeout(load,500);
