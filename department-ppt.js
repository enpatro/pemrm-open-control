
const DEPT_PPT_LIST=["UM", "UE", "FA Maint", "FB Maint", "Safety", "Env"];
let storage=null;
function initStorageLater(){try{if(firebaseReady) storage=firebase.storage();}catch(e){setMsg('Storage init error: '+e.message,'bad')}}
function renderUploadTable(){
  const t=document.getElementById('uploadTable');
  t.innerHTML='<tr><th>Department</th><th>Upload PPT/PPTX &lt;10MB</th><th>Status</th><th>Download</th></tr>'+DEPT_PPT_LIST.map(d=>`<tr data-dept="${d}"><td class='param'>${d}</td><td><input type='file' accept='.ppt,.pptx' onchange="uploadDeptPpt('${d}',this.files[0])"></td><td class='st'>Not uploaded</td><td class='lnk'></td></tr>`).join('');
}
function cleanDept(d){return d.replace(/[^a-zA-Z0-9]/g,'_')}
async function uploadDeptPpt(dept,file){
  try{
    if(!file) return;
    if(!firebaseReady) throw new Error('Firebase not ready. Test Firebase first.');
    if(!storage) storage=firebase.storage();
    const ext=file.name.toLowerCase().endsWith('.ppt')?'.ppt':'.pptx';
    if(!['.ppt','.pptx'].includes(ext)) throw new Error('Only PPT/PPTX allowed.');
    if(file.size>10*1024*1024) throw new Error('File must be less than 10 MB. Current: '+(file.size/1024/1024).toFixed(2)+' MB');
    const month=document.getElementById('monthSelect').value;
    const path=`deptPPT/${month}/${cleanDept(dept)}${ext}`;
    setMsg('Uploading '+dept+'...','status');
    const snap=await storage.ref(path).put(file,{contentType:file.type||'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
    const url=await snap.ref.getDownloadURL();
    await saveDoc('deptPpts',`${month}_${cleanDept(dept)}`,{month,dept,fileName:file.name,size:file.size,url,path,updatedAt:new Date().toISOString()});
    setMsg(dept+' PPT uploaded successfully','ok');
    await loadDeptUploads();
  }catch(e){setMsg('Upload error: '+e.message,'bad');}
}
async function loadDeptUploads(){
  const month=document.getElementById('monthSelect').value;
  for(const dept of DEPT_PPT_LIST){
    const row=document.querySelector(`tr[data-dept="${dept}"]`); if(!row) continue;
    const doc=await getDoc('deptPpts',`${month}_${cleanDept(dept)}`);
    row.querySelector('.st').textContent=doc?`Uploaded: ${doc.fileName} (${(doc.size/1024/1024).toFixed(2)} MB)`:'Not uploaded';
    row.querySelector('.lnk').innerHTML=doc?`<a href="${doc.url}" target="_blank">Open file</a>`:'';
  }
}
fillMonths('monthSelect');renderUploadTable();setTimeout(()=>{initStorageLater();loadDeptUploads();},900);document.getElementById('monthSelect').addEventListener('change',loadDeptUploads);
