import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const msg = document.getElementById('msg');
document.getElementById('loginBtn').addEventListener('click', async()=>{
  msg.textContent='Checking login...';
  try { await signInWithEmailAndPassword(auth, email.value.trim(), password.value); location.href='dashboard.html'; }
  catch(e){ msg.textContent='Login error: '+e.code+' - '+e.message; }
});
document.getElementById('resetBtn').addEventListener('click', async()=>{
  try { await sendPasswordResetEmail(auth, email.value.trim()); msg.textContent='Reset link sent.'; }
  catch(e){ msg.textContent='Reset error: '+e.message; }
});
