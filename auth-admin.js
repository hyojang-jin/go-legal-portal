/**
 * Gowid Legal Portal — Admin 전용 비밀번호 잠금
 * 일반 auth-gate.js와 별도 비밀번호 사용
 */
(function () {
  const HASH = 'e6cebf1c3cd352fa2b426d883613dcc385eabe2605239a1e5e8be95186badcfc';
  const KEY = 'go_legal_admin_auth';

  if (sessionStorage.getItem(KEY) === 'ok') return;

  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function createGate() {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <style>
        html.auth-locked{overflow:hidden!important}
        #auth-overlay{position:fixed;inset:0;z-index:99999;background:#0f0f14;display:flex;align-items:center;justify-content:center;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
        #auth-box{text-align:center;padding:40px;max-width:360px;width:100%}
        #auth-box .logo{font-size:28px;font-weight:800;letter-spacing:-1px;margin-bottom:6px;color:rgba(255,255,255,.92)}
        #auth-box .logo .go{color:#6ec8a0}
        #auth-box .logo .admin{color:#ff6b6b;font-size:22px;font-weight:400;margin-left:4px}
        #auth-box .sub{font-size:13px;color:rgba(255,255,255,.4);margin-bottom:32px}
        #auth-box input{width:100%;padding:14px 16px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.12);border-radius:10px;color:rgba(255,255,255,.92);font-size:15px;font-family:inherit;text-align:center;outline:none;transition:border-color .2s}
        #auth-box input:focus{border-color:#ff6b6b}
        #auth-box input::placeholder{color:rgba(255,255,255,.25)}
        #auth-box button{margin-top:12px;width:100%;padding:12px;background:#ff6b6b;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity .2s}
        #auth-box button:hover{opacity:.85}
        #auth-box .err{color:#ff6b6b;font-size:12px;margin-top:10px;min-height:18px}
      </style>
      <div id="auth-box">
        <div class="logo"><span class="go">Gowid</span> Legal<span class="admin">Admin</span></div>
        <p class="sub">관리자 전용 — 비밀번호를 입력하세요</p>
        <input type="password" id="auth-pw" placeholder="관리자 비밀번호" autofocus>
        <button id="auth-btn">확인</button>
        <div class="err" id="auth-err"></div>
      </div>`;
    document.documentElement.classList.add('auth-locked');
    document.body.appendChild(overlay);

    const pwInput = document.getElementById('auth-pw');
    const btn = document.getElementById('auth-btn');
    const err = document.getElementById('auth-err');

    async function attempt() {
      const val = pwInput.value;
      if (!val) { err.textContent = '비밀번호를 입력해 주세요'; return; }
      const h = await sha256(val);
      if (h === HASH) {
        sessionStorage.setItem(KEY, 'ok');
        document.documentElement.classList.remove('auth-locked');
        overlay.remove();
      } else {
        err.textContent = '비밀번호가 틀렸습니다';
        pwInput.value = '';
        pwInput.focus();
      }
    }

    btn.addEventListener('click', attempt);
    pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createGate);
  } else {
    createGate();
  }
})();
