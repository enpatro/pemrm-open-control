import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const app=initializeApp(firebaseConfig); const auth=getAuth(app); const db=getFirestore(app); const msg=document.getElementById('msg');
document.getElementById('logoutBtn')?.addEventListener('click',()=>signOut(auth).then(()=>location.href='index.html'));
onAuthStateChanged(auth,u=>{if(!u)location.href='index.html'});
document.getElementById('saveAbsBtn').addEventListener('click',async()=>{try{await setDoc(doc(db,'absot',month.value+'_'+dept.value),{month:month.value,dept:dept.value,overallAbs:Number(overallAbs.value),overallOt:Number(overallOt.value),remarks:remarks.value,updatedBy:auth.currentUser.email,updatedAt:serverTimestamp()},{merge:true});msg.textContent='Saved.'}catch(e){msg.textContent='Save error: '+e.message}});
