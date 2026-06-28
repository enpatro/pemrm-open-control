import { KPI_MASTER, DEPTS, ABS_PARAMS } from './master-data.js';
import { MONTHS,getCurrentFiscalMonth,setStatus,getAllDocsFB,tableToExcel,tableToPpt,configOk } from './common.js';
const pendingTable=document.getElementById('pendingTable');
const kpiPendingTable=document.getElementById('kpiPendingTable');
const cards=document.getElementById('pendingCards');
function safeId(s){return s.replace(/[^a-zA-Z0-9]/g,'_')}
function monthWindow(){ const cur=getCurrentFiscalMonth(); const idx=MONTHS.indexOf(cur); return idx>=0?MONTHS.slice(0,idx+1):MONTHS; }
function isBlank(v){ return v===undefined || v===null || String(v).trim()==='' || Number.isNaN(v); }
function tdMonthClass(m){ return m===getCurrentFiscalMonth()?' class="month-current-cell"':''; }
function latestCommentForDept(asaved, dept, paramKey, uptoMonth){ const uptoIdx=MONTHS.indexOf(uptoMonth); for(let i=uptoIdx;i>=0;i--){ const m=MONTHS[i]; const doc=asaved[`${m}_${dept}`]||{}; const direct=doc.remarks; if(!isBlank(direct)) return `${m}: ${direct}`; } return ''; }
function latestKpiComment(ksaved, k, uptoMonth){ const uptoIdx=MONTHS.indexOf(uptoMonth); const id=safeId(k.area+'_'+k.parameter); for(let i=uptoIdx;i>=0;i--){ const m=MONTHS[i]; const doc=ksaved[`${m}_${id}`]||{}; if(!isBlank(doc.remarks)) return `${m}: ${doc.remarks}`; } return ''; }
async function load(){
  if(!configOk){setStatus('Firebase config missing. Pending report cannot check other PC data.','bad'); return;}
  setStatus('Loading pending report from Firebase...');
  try{
    const months=monthWindow();
    const cur=getCurrentFiscalMonth();
    const asaved=await getAllDocsFB('absot');
    const ksaved=await getAllDocsFB('kpis');
    let pendingCount=0, deptPending={}; DEPTS.forEach(d=>deptPending[d]=0);
    let rows=`<tr><th>Dept</th><th>Month</th><th>Section</th><th>Pending Parameter</th><th>Last Comment / Remarks</th><th>Action Required</th></tr>`;
    for(const d of DEPTS){
      for(const m of months){
        const doc=asaved[`${m}_${d}`]||{};
        for(const p of ABS_PARAMS){
          if(p.type==='text') continue;
          if(isBlank(doc[p.key])){
            pendingCount++; deptPending[d]++;
            const lastComment=latestCommentForDept(asaved,d,p.key,m);
            rows += `<tr><td><b>${d}</b></td><td${tdMonthClass(m)}>${m}</td><td>${p.section}</td><td>${p.param}</td><td>${lastComment}</td><td>Please update ${p.param} for ${m}</td></tr>`;
          }
        }
      }
    }
    if(pendingCount===0) rows += `<tr><td colspan="6" style="text-align:center;color:green;font-weight:bold">No Abs & OT pending up to ${cur}</td></tr>`;
    pendingTable.innerHTML=rows;
    let kpiPending=0;
    let krows=`<tr><th>Month</th><th>Area</th><th>Pending KPI Parameter</th><th>Target</th><th>Last Comment / Remarks</th><th>Action Required</th></tr>`;
    for(const m of months){
      for(const k of KPI_MASTER){
        const id=safeId(k.area+'_'+k.parameter); const doc=ksaved[`${m}_${id}`]||{};
        if(isBlank(doc.actual)){
          kpiPending++;
          krows += `<tr><td${tdMonthClass(m)}>${m}</td><td>${k.area}</td><td>${k.parameter}</td><td>${k.monthTarget}</td><td>${latestKpiComment(ksaved,k,m)}</td><td>Please update actual for ${m}</td></tr>`;
        }
      }
    }
    if(kpiPending===0) krows += `<tr><td colspan="6" style="text-align:center;color:green;font-weight:bold">No KPI pending up to ${cur}</td></tr>`;
    kpiPendingTable.innerHTML=krows;
    cards.innerHTML=`<div class="summary-card"><b>Current Month:</b> <span style="color:#003b7a;font-weight:bold">${cur}</span></div><div class="summary-card"><b>Checked Months:</b> ${months.join(', ')}</div><div class="summary-card"><b>Abs & OT Pending:</b> ${pendingCount}</div><div class="summary-card"><b>KPI Pending:</b> ${kpiPending}</div>` + DEPTS.map(d=>`<div class="summary-card"><b>${d} Pending:</b> ${deptPending[d]}</div>`).join('');
    setStatus(`Pending report loaded. Abs & OT pending: ${pendingCount}, KPI pending: ${kpiPending}`,'ok');
  }catch(e){ setStatus('Pending report error: '+e.message,'bad'); console.error(e); }
}
document.getElementById('refreshBtn').onclick=load;
document.getElementById('excelBtn').onclick=()=>tableToExcel('PE_3F_Pending_Report.xls','PE-3F Pending Report',`<h3>Department-wise Pending</h3>${pendingTable.outerHTML}<h3>KPI Pending</h3>${kpiPendingTable.outerHTML}`);
document.getElementById('pptBtn').onclick=()=>tableToPpt('PE_3F_Pending_Report.ppt','PE-3F Pending Report',`<h3>Department-wise Pending</h3>${pendingTable.outerHTML}<h3>KPI Pending</h3>${kpiPendingTable.outerHTML}`);
setTimeout(load,500);
