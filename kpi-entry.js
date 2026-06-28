import { KPI_MASTER } from './master-data.js';
import { fillMonthDropdown,setStatus,saveDocFB,getDocFB,toExcel,toPpt,configOk } from './common.js';
const table=document.getElementById('kpiEntryTable') || document.querySelector('table');
const monthSelect=document.getElementById('monthSelect');
fillMonthDropdown(monthSelect);
function sid(s){return String(s).replace(/[^a-zA-Z0-9]/g,'_')}
function render(){
 if(!table){setStatus('Table element missing in index.html','bad');return;}
 table.innerHTML=`<tr><th>Area</th><th>Parameter</th><th>Target</th><th>${monthSelect.value||'Month'} Actual</th><th>Judgt</th><th>Trend</th><th>Remarks</th></tr>`+
 KPI_MASTER.map(k=>`<tr data-id="${sid(k.area+'_'+k.parameter)}" data-area="${k.area}" data-parameter="${k.parameter}"><td class='area'>${k.area}</td><td class='param'>${k.parameter}</td><td>${k.monthTarget??''}</td><td><input class='actual' type='number' step='any'></td><td><select class='judgt'><option>○</option><option>■</option><option>▲</option><option>◎</option><option>□</option></select></td><td><select class='trend'><option>→</option><option>↗</option><option>↘</option></select></td><td><input class='remarks'></td></tr>`).join('');
}
async function load(){render(); if(!configOk){setStatus('Month fixed. Firebase config missing/wrong.','bad');return;} try{for(const tr of table.querySelectorAll('tr[data-id]')){const d=await getDocFB('kpis',`${monthSelect.value}_${tr.dataset.id}`); if(d){tr.querySelector('.actual').value=d.actual??'';tr.querySelector('.judgt').value=d.judgt??'○';tr.querySelector('.trend').value=d.trend??'→';tr.querySelector('.remarks').value=d.remarks??'';}} setStatus('Loaded','ok');}catch(e){setStatus('Load error: '+e.message,'bad');}}
async function save(){if(!configOk){setStatus('Firebase config missing/wrong. Cannot save to cloud.','bad');return;} try{let c=0;for(const tr of table.querySelectorAll('tr[data-id]')){await saveDocFB('kpis',`${monthSelect.value}_${tr.dataset.id}`,{month:monthSelect.value,area:tr.dataset.area,parameter:tr.dataset.parameter,actual:tr.querySelector('.actual').value===''?'':Number(tr.querySelector('.actual').value),judgt:tr.querySelector('.judgt').value,trend:tr.querySelector('.trend').value,remarks:tr.querySelector('.remarks').value});c++;}setStatus(`Saved ${c} KPI rows`,'ok');}catch(e){setStatus('Save error: '+e.message,'bad');}}
monthSelect?.addEventListener('change',load); document.getElementById('loadMonthBtn')?.addEventListener('click',load); document.getElementById('saveAllBtn')?.addEventListener('click',save); document.getElementById('excelBtn')?.addEventListener('click',()=>toExcel('KPI_Entry.xls','KPI Entry',table.outerHTML)); document.getElementById('pptBtn')?.addEventListener('click',()=>toPpt('KPI_Entry.ppt','KPI Entry',table.outerHTML));
render(); setTimeout(load,300);
