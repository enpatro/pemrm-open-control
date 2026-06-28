
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
function judge(value,target){ if(!isNum(value)) return {cell:'blankcell', ok:true, symbol:'', band:'blank'}; let t=parseTarget(target); if(!t) return {cell:'blankcell', ok:true, symbol:'', band:'info'}; let v=Number(value), ok=true, ratio=null; if(t.op==='<') {ok=v<t.v; ratio=t.v? v/t.v: null;} else if(t.op==='<=') {ok=v<=t.v; ratio=t.v? v/t.v: null;} else if(t.op==='>') {ok=v>t.v; ratio=t.v? v/t.v: null;} else if(t.op==='>=') {ok=v>=t.v; ratio=t.v? v/t.v: null;} else {ratio=t.v===0? (v===0?1:999) : v/t.v; ok=(t.v===0? v===0 : (ratio>=0.8 && ratio<=1.2));} let symbol='○'; if(ratio!==null){ if(ratio>=0.8 && ratio<=1.2) symbol='○'; else if(ratio<0.8) symbol='▲'; else symbol='■'; } if(t.v===0 && v!==0) symbol='■'; return {cell:ok?'okcell':'redcell', ok, symbol, band:ok?'ok':'ng'}; }
function trend(cur, prev){ if(!isNum(cur)||!isNum(prev)) return ''; cur=Number(cur); prev=Number(prev); if(cur>prev)return '↗'; if(cur<prev)return '↘'; return '→'; }
function download(name,html,type){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000)}
function excel(name,title,html){download(name,`<html><head><meta charset='utf-8'></head><body><h2>${title}</h2>${html}</body></html>`,'application/vnd.ms-excel')}

// REAL PPTX EXPORT - creates .pptx, not HTML .ppt
async function loadPptxGen(){
  if(window.pptxgen) return true;
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
    s.onload=()=>resolve(true);
    s.onerror=()=>reject(new Error('PptxGenJS library not loaded. Internet/CDN blocked.'));
    document.head.appendChild(s);
  });
}
function tableToMatrix(table){
  const rows=[];
  if(!table) return rows;
  table.querySelectorAll('tr').forEach(tr=>{
    const row=[];
    tr.querySelectorAll('th,td').forEach(cell=>{
      let text=(cell.innerText||cell.textContent||'').replace(/\s+/g,' ').trim();
      row.push(text);
    });
    if(row.length) rows.push(row);
  });
  return rows;
}
function chunkRows(rows, chunkSize){
  const chunks=[];
  for(let i=0;i<rows.length;i+=chunkSize) chunks.push(rows.slice(i,i+chunkSize));
  return chunks;
}
async function ppt(name,title,html){
  try{
    setMsg('Preparing PPTX...','status');
    await loadPptxGen();
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'PE-3F Dashboard';
    pptx.subject = title;
    pptx.title = title;
    pptx.company = 'PE-3F';
    pptx.lang = 'en-US';
    pptx.theme = {
      headFontFace: 'Arial',
      bodyFontFace: 'Arial',
      lang: 'en-US'
    };

    const temp=document.createElement('div');
    temp.innerHTML=html;
    const tables=[...temp.querySelectorAll('table')];
    if(!tables.length){
      const currentTable=document.querySelector('table');
      if(currentTable) tables.push(currentTable.cloneNode(true));
    }
    if(!tables.length) throw new Error('No table found for PPT export');

    // Title slide
    let slide=pptx.addSlide();
    slide.background = { color: 'F3F6FB' };
    slide.addText(title || 'PE-3F Dashboard', {x:0.4,y:0.35,w:12.5,h:0.5,fontFace:'Arial',fontSize:24,bold:true,color:'0B5CAB'});
    slide.addText('Auto generated dashboard export', {x:0.4,y:0.92,w:12.2,h:0.3,fontSize:11,color:'444444'});
    slide.addText(new Date().toLocaleString(), {x:0.4,y:1.25,w:12.2,h:0.3,fontSize:10,color:'666666'});

    let slideNo=1;
    for(const table of tables){
      const rows=tableToMatrix(table);
      if(!rows.length) continue;
      const header=rows[0];
      const body=rows.slice(1);
      const chunks=chunkRows(body, 16); // readable director review slides
      for(const chunk of chunks){
        slideNo++;
        let sld=pptx.addSlide();
        sld.background = { color: 'FFFFFF' };
        sld.addText(title || 'PE-3F Dashboard', {x:0.25,y:0.15,w:12.8,h:0.3,fontFace:'Arial',fontSize:15,bold:true,color:'0B5CAB'});
        const tableData=[header,...chunk];
        const colCount=Math.max(...tableData.map(r=>r.length));
        const colW=[];
        for(let c=0;c<colCount;c++){
          if(c===0) colW.push(0.75);
          else if(c===1) colW.push(2.25);
          else colW.push(Math.max(0.65, Math.min(1.05, 9.6/(colCount-2 || 1))));
        }
        sld.addTable(tableData, {
          x:0.15, y:0.55, w:13.0, h:6.55,
          border:{type:'solid', color:'999999', pt:0.5},
          margin:0.03,
          fontFace:'Arial',
          fontSize: colCount>10 ? 6.1 : 7.2,
          color:'111111',
          valign:'mid',
          align:'center',
          fit:'shrink',
          colW: colW,
          rowH: tableData.map((_,i)=> i===0 ? 0.32 : 0.34),
          fill:'FFFFFF',
          autoFit:false
        });
        // header overlay styles are limited in addTable; add small slide footer
        sld.addText(`Page ${slideNo-1}`, {x:12.2,y:7.15,w:0.8,h:0.2,fontSize:7,color:'777777'});
      }
    }
    const outName = (name || 'PE_3F_Dashboard.pptx').replace(/\.ppt$/i,'.pptx').replace(/\.html$/i,'.pptx');
    await pptx.writeFile({ fileName: outName.toLowerCase().endsWith('.pptx') ? outName : outName + '.pptx' });
    setMsg('PPTX downloaded. Open the .pptx file in PowerPoint.','ok');
  }catch(e){
    setMsg('PPTX export error: '+e.message,'bad');
    console.error(e);
  }
}
window.addEventListener('DOMContentLoaded', initFirebase);
