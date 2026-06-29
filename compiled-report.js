
const DEPT_PPT_LIST=["UM", "UE", "FA Maint", "FB Maint", "Safety", "Env"];
function cleanDept(d){return d.replace(/[^a-zA-Z0-9]/g,'_')}
async function loadDeptMeta(month){const out=[];for(const d of DEPT_PPT_LIST){out.push(await getDoc('deptPpts',`${month}_${cleanDept(d)}`)||{dept:d})}return out;}
function kpiRowsForMonth(kdocs,month){return KPI_MASTER.map(k=>{const id=`${month}_${safeId(k[0]+'_'+k[1])}`;const r=kdocs[id]||{};return [k[0],k[1],k[2],r.actual??'',r.judgt??'',r.remarks??''];});}
function absSummaryRows(adocs,month){
 const rows=[];
 const P=[['Absenteeism','Overall Absenteeism %','overallAbsPct','avg','<6'],['Overtime','Overall OT Hrs / Person','overallOtPer','avg','<6'],['Overtime','>16 Hrs OT Nos.','otAbove16','sum','0'],['Overtime','>10 Day Continuous Working','continuousAbove10','sum','0']];
 for(const p of P){let vals=DEPTS.map(d=>Number((adocs[`${month}_${d}`]||{})[p[2]])).filter(Number.isFinite);let v='';if(vals.length){let s=vals.reduce((a,b)=>a+b,0);v=p[3]==='avg'?s/vals.length:s;}rows.push([p[0],p[1],p[4],fmt(v)]);}
 return rows;
}
function addTableSlide(pptx,title,headers,rows){
 let chunks=[];for(let i=0;i<rows.length;i+=14)chunks.push(rows.slice(i,i+14));
 if(!chunks.length)chunks=[[]];
 for(const part of chunks){let s=pptx.addSlide();s.addText(title,{x:0.3,y:0.15,w:12.7,h:0.35,fontSize:18,bold:true,color:'0B5CAB'});s.addTable([headers,...part],{x:0.25,y:0.65,w:12.8,h:6.4,fontFace:'Arial',fontSize:7,border:{type:'solid',color:'999999',pt:0.5},margin:0.03,fit:'shrink'});}
}
async function downloadCompiledMMR(){
 try{
  if(!window.pptxgen) throw new Error('PPTX library not loaded. Check internet/CDN.');
  const month=document.getElementById('monthSelect').value;
  setMsg('Preparing MMR '+month+' PPTX...','status');
  const [kdocs,adocs,depts]=await Promise.all([allDocs('kpis'),allDocs('absot'),loadDeptMeta(month)]);
  const pptx=new pptxgen();pptx.layout='LAYOUT_WIDE';pptx.author='PE-3F';pptx.title='MMR - '+month;
  let s=pptx.addSlide();s.background={color:'F3F6FB'};s.addText('MMR - '+month,{x:0.5,y:0.45,w:12,h:0.6,fontSize:30,bold:true,color:'0B5CAB'});s.addText('PE-3F Monthly Management Review',{x:0.5,y:1.15,w:12,h:0.35,fontSize:15,color:'444444'});s.addText(new Date().toLocaleString(),{x:0.5,y:1.55,w:12,h:0.25,fontSize:10,color:'666666'});
  addTableSlide(pptx,'MMR - '+month+' | KPI Summary',['Area','KPI','Target','Actual','Judgt','Remarks'],kpiRowsForMonth(kdocs,month));
  addTableSlide(pptx,'MMR - '+month+' | Abs & OT Summary',['Section','Parameter','Target','Division Value'],absSummaryRows(adocs,month));
  let dslide=pptx.addSlide();dslide.addText('MMR - '+month+' | Department PPT Upload Status',{x:0.3,y:0.15,w:12.7,h:0.35,fontSize:18,bold:true,color:'0B5CAB'});
  let y=0.75;for(const d of depts){dslide.addText(`${d.dept}: ${d.fileName?'Uploaded - '+d.fileName:'Not uploaded'}`,{x:0.5,y,w:11.8,h:0.3,fontSize:12,color:d.fileName?'0F5132':'842029',hyperlink:d.url?{url:d.url}:undefined});y+=0.42;}
  for(const d of depts){let ds=pptx.addSlide();ds.addText('Department Section - '+d.dept,{x:0.4,y:0.35,w:12,h:0.45,fontSize:22,bold:true,color:'0B5CAB'});ds.addText(d.fileName?'Uploaded file: '+d.fileName:'No PPT uploaded for this department',{x:0.4,y:1.0,w:12,h:0.35,fontSize:14,color:d.fileName?'0F5132':'842029'});if(d.url)ds.addText('Click here to open source department PPT',{x:0.4,y:1.45,w:8,h:0.3,fontSize:12,color:'0563C1',underline:true,hyperlink:{url:d.url}});ds.addText('Note: Browser-generated PPTX cannot directly merge uploaded PPT slide objects without backend processing. Source PPT link is included here.',{x:0.4,y:2.0,w:12,h:0.5,fontSize:10,color:'666666'});}
  await pptx.writeFile({fileName:'MMR_'+month+'.pptx'});
  setMsg('MMR '+month+' PPTX downloaded','ok');
 }catch(e){setMsg('Compiled PPTX error: '+e.message,'bad');console.error(e);}
}
async function preview(){const month=document.getElementById('monthSelect').value;const depts=await loadDeptMeta(month);document.getElementById('preview').innerHTML='<h3>Department PPT Status</h3>'+depts.map(d=>`<div class='summary-card'><b>${d.dept}</b><br>${d.fileName||'Not uploaded'}</div>`).join('');}
fillMonths('monthSelect');setTimeout(preview,900);document.getElementById('monthSelect').addEventListener('change',preview);
