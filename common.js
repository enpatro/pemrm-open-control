
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

async function loadPptxGen(){
  if(window.pptxgen || window.PptxGenJS) return window.pptxgen || window.PptxGenJS;
  const urls=[
    'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js',
    'https://unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'
  ];
  for(const url of urls){
    try{
      await new Promise((resolve,reject)=>{
        const s=document.createElement('script');
        s.src=url;
        s.onload=resolve;
        s.onerror=reject;
        document.head.appendChild(s);
      });
      if(window.pptxgen || window.PptxGenJS) return window.pptxgen || window.PptxGenJS;
    }catch(e){ console.warn('PPTX library load failed:', url, e); }
  }
  throw new Error('PptxGenJS library not loaded. CDN/network blocked.');
}
function tableToMatrix(table){
  const rows=[];
  if(!table) return rows;
  table.querySelectorAll('tr').forEach(tr=>{
    const row=[];
    tr.querySelectorAll('th,td').forEach(cell=>row.push((cell.innerText||cell.textContent||'').replace(/\s+/g,' ').trim()));
    if(row.length) rows.push(row);
  });
  return rows;
}
function chunks(arr,size){const out=[];for(let i=0;i<arr.length;i+=size)out.push(arr.slice(i,i+size));return out;}
async function ppt(name,title,html){
  try{
    setMsg('Preparing PPTX...','status');
    const PptxGen = await loadPptxGen();
    const pptx = new PptxGen();
    pptx.layout='LAYOUT_WIDE';
    pptx.author='PE-3F Dashboard';
    pptx.subject=title||'Dashboard';
    pptx.title=title||'Dashboard';
    const temp=document.createElement('div');
    temp.innerHTML=html;
    let tables=[...temp.querySelectorAll('table')];
    if(!tables.length){ tables=[...document.querySelectorAll('table')]; }
    let slide=pptx.addSlide();
    slide.background={color:'F3F6FB'};
    slide.addText(title||'PE-3F Dashboard',{x:0.4,y:0.35,w:12.5,h:0.5,fontFace:'Arial',fontSize:24,bold:true,color:'0B5CAB'});
    slide.addText(new Date().toLocaleString(),{x:0.4,y:0.95,w:12,h:0.3,fontSize:10,color:'666666'});
    let page=1;
    for(const tbl of tables){
      const rows=tableToMatrix(tbl); if(!rows.length) continue;
      const header=rows[0]; const body=rows.slice(1);
      for(const part of chunks(body,15)){
        page++;
        const sld=pptx.addSlide();
        sld.addText(title||'PE-3F Dashboard',{x:0.2,y:0.12,w:12.8,h:0.28,fontFace:'Arial',fontSize:14,bold:true,color:'0B5CAB'});
        const data=[header,...part];
        const colCount=Math.max(...data.map(r=>r.length));
        const colW=[];
        for(let c=0;c<colCount;c++) colW.push(c===0?0.75:(c===1?2.2:Math.max(0.6,Math.min(1.05,9.7/(colCount-2||1)))));
        sld.addTable(data,{x:0.15,y:0.5,w:13.0,h:6.55,border:{type:'solid',color:'888888',pt:0.5},fontFace:'Arial',fontSize:colCount>10?5.8:7,margin:0.03,valign:'mid',align:'center',fit:'shrink',colW:colW,rowH:data.map((_,i)=>i===0?0.32:0.35),autoFit:false});
        sld.addText('Page '+(page-1),{x:12.2,y:7.15,w:0.8,h:0.2,fontSize:7,color:'777777'});
      }
    }
    let fileName=(name||'PE_3F_Dashboard.pptx').replace(/\.ppt$/i,'.pptx').replace(/\.html$/i,'.pptx');
    if(!fileName.toLowerCase().endsWith('.pptx')) fileName += '.pptx';
    await pptx.writeFile({ fileName });
    setMsg('PPTX downloaded successfully.','ok');
  }catch(e){
    setMsg('PPTX export error: '+e.message,'bad');
    console.error(e);
  }
}
window.addEventListener('DOMContentLoaded', initFirebase);
