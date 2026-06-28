import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const app=initializeApp(firebaseConfig); const db=getFirestore(app); const msg=document.getElementById('msg');
const DEVICE_USER=localStorage.getItem('kpi_device_user')||('User-'+Math.random().toString(36).slice(2,7)); localStorage.setItem('kpi_device_user',DEVICE_USER);
document.getElementById('saveAbsBtn').addEventListener('click',async()=>{try{await setDoc(doc(db,'absot',month.value+'_'+dept.value),{month:month.value,dept:dept.value,overallAbs:Number(overallAbs.value),overallOt:Number(overallOt.value),remarks:remarks.value,updatedBy:DEVICE_USER,updatedAt:serverTimestamp()},{merge:true});msg.textContent='Saved.'}catch(e){msg.textContent='Save error: '+e.message; console.error(e)}});
