/* 대한민국 직업강사 파크골프연맹 홈페이지 공통 스크립트 */
/* 이메일 전송 공통 함수: 실패하면 원인을 알려 줍니다 */
async function sendMail(payload) {
  if (location.protocol === "file:") throw new Error("컴퓨터에 저장된 파일로 열어서는 전송되지 않습니다. https://kpkf20.github.io/ 주소로 접속해 주세요.");
  let res, body = {};
  try {
    res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(APPLY_EMAIL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ ...payload, _template: "table", _captcha: "false" })
    });
  } catch (e) {
    throw new Error("전송 서버에 연결하지 못했습니다. 인터넷 연결이나 광고 차단 프로그램을 확인해 주세요.");
  }
  try { body = await res.json(); } catch (e) {}
  const ok = res.ok && String(body.success) !== "false";
  if (ok && /activat/i.test(body.message || "")) return "activation";
  if (!ok) throw new Error((body.message ? "전송 서버 안내: " + body.message : "전송 서버 오류 (" + res.status + ")"));
  return "sent";
}

/* 보도자료 목록 그리기 (data.js의 PRESS 사용) */
document.querySelectorAll("[data-press-list]").forEach(ul => {
  const limit = Number(ul.dataset.pressList) || PRESS.length;
  PRESS.slice(0, limit).forEach(p => {
    const li = document.createElement("li"); li.className = "press-item";
    const a = document.createElement("a"); a.href = p.url; a.target = "_blank"; a.rel = "noopener"; a.textContent = p.title + " ↗";
    const meta = document.createElement("span"); meta.textContent = PRESS_SOURCE + (p.date ? " · " + p.date : "");
    li.append(a, meta); ul.appendChild(li);
  });
});

/* 주소 끝(#notice-1 등)이 접힌 공지를 가리키면 펼치기 */
function openHashDetails() {
  const t = location.hash && document.getElementById(location.hash.slice(1));
  if (t && t.tagName === "DETAILS") { t.open = true; t.scrollIntoView({ block: "start" }); }
}
window.addEventListener("hashchange", openHashDetails);
openHashDetails();

if (document.getElementById("regions")) {
const regionBox = document.getElementById("regions");
const listBox = document.getElementById("branch-list");
const mapFrame = document.getElementById("branch-map");
let currentRegion = "전체", selectedBranch = "서울 본사";
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function selectBranch(reg, b, scroll) {
  selectedBranch = b[0];
  const [name, , addr, , q, exact] = b;
  document.getElementById("branch-map-name").textContent = name;
  document.getElementById("branch-map-addr").textContent = addr !== "추후 안내" ? addr : (q || "위치 준비 중");
  document.getElementById("branch-map-note").textContent = !q ? "위치 정보가 등록되면 지도에 표시됩니다." : (exact ? "" : "대략적인 위치예요. 정확한 주소가 등록되면 바로 바뀝니다.");
  const zoom = exact ? 16 : (/[시구]$/.test(q) ? 12 : 9);
  mapFrame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(q || "대한민국") + "&hl=ko&z=" + (q ? zoom : 7) + "&output=embed";
  listBox.querySelectorAll(".branch-card").forEach(c => c.classList.toggle("on", c.dataset.name === name));
  if (scroll && window.matchMedia("(max-width: 860px)").matches) mapFrame.scrollIntoView({ behavior: "smooth", block: "center" });
}
function showRegion(name) {
  currentRegion = name;
  regionBox.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.textContent === name ? "true" : "false"));
  const regs = name === "전체" ? Object.keys(BRANCHES) : [name];
  listBox.replaceChildren(...regs.flatMap(reg => BRANCHES[reg].map(b => {
    const card = el("div", "branch-card"); card.dataset.name = b[0];
    const head = el("div"); head.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px";
    head.append(el("span", "rg", reg), el("strong", "nm", b[0]));
    const meta = el("div", "mt"); meta.append(el("span", null, b[1]));
    if (/^[0-9-]+$/.test(b[3])) { const a = el("a", null, b[3]); a.href = "tel:" + b[3]; meta.append(a); } else meta.append(el("span", null, b[3]));
    const go = el("button", "go", "📍 지도에서 보기"); go.type = "button";
    go.addEventListener("click", () => selectBranch(reg, b, true));
    card.append(head, meta, el("div", "ad", b[2]), go);
    return card;
  })));
  const first = regs.flatMap(r => BRANCHES[r].map(b => [r, b])).find(([, b]) => b[0] === selectedBranch) || [regs[0], BRANCHES[regs[0]][0]];
  selectBranch(first[0], first[1], false);
}
["전체", ...Object.keys(BRANCHES)].forEach(name => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "region-btn"; b.textContent = name;
  b.addEventListener("click", () => showRegion(name));
  regionBox.appendChild(b);
});
showRegion("전체");
}

if (document.getElementById("apply-modal")) {
const modal = document.getElementById("apply-modal");
const form = document.getElementById("apply-form");
const done = document.getElementById("apply-done");
const statusEl = document.getElementById("apply-status");
const submitBtn = document.getElementById("apply-submit");
let lastTrigger = null;
function openApply(course, trigger) {
  lastTrigger = trigger;
  form.reset();
  statusEl.textContent = "";
  document.getElementById("apply-course").value = course;
  document.getElementById("apply-title").textContent = course;
  form.hidden = false; done.hidden = true;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  form.querySelector('input[name="이름"]').focus();
}
function closeApply() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastTrigger) lastTrigger.focus();
}
document.querySelectorAll(".apply-btn").forEach(b => b.addEventListener("click", () => openApply(b.dataset.course, b)));
modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeApply(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeApply(); });
form.addEventListener("submit", async e => {
  e.preventDefault();
  statusEl.textContent = "";
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (!APPLY_EMAIL) { statusEl.textContent = "온라인 신청 준비 중입니다. 협회(1577-2495)로 전화 문의해 주세요."; return; }
  const data = Object.fromEntries(new FormData(form));
  submitBtn.disabled = true; submitBtn.textContent = "보내는 중…";
  try {
    const r = await sendMail({ ...data, _subject: "[자격과정 신청] " + data["과정"] + " - " + data["이름"] });
    if (r === "activation") {
      statusEl.textContent = "처음 한 번은 협회 Gmail로 온 FormSubmit 확인 메일의 Activate Form 버튼을 눌러야 합니다. 누른 뒤 다시 신청해 주세요.";
      return;
    }
    form.hidden = true; done.hidden = false;
    done.querySelector("button").focus();
  } catch (err) {
    statusEl.textContent = "전송하지 못했습니다. " + err.message + " 급하시면 협회(1577-2495)로 전화 주세요.";
  } finally {
    submitBtn.disabled = false; submitBtn.textContent = "신청하기";
  }
});

}

if (document.getElementById("cancel-modal")) {
/* 신청 취소서 ─ 신청서와 같은 이메일(APPLY_EMAIL)로 전송됩니다 */
const cModal = document.getElementById("cancel-modal");
const cForm = document.getElementById("cancel-form");
const cDone = document.getElementById("cancel-done");
const cStatus = document.getElementById("cancel-status");
const cSubmit = document.getElementById("cancel-submit");
const cOpenBtn = document.getElementById("cancel-open");
function openCancel() {
  cForm.reset(); cStatus.textContent = "";
  cForm.hidden = false; cDone.hidden = true;
  cModal.hidden = false; document.body.style.overflow = "hidden";
  cForm.querySelector("select").focus();
}
function closeCancel() { cModal.hidden = true; document.body.style.overflow = ""; cOpenBtn.focus(); }
cOpenBtn.addEventListener("click", openCancel);
cModal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeCancel(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !cModal.hidden) closeCancel(); });
cForm.addEventListener("submit", async e => {
  e.preventDefault();
  cStatus.textContent = "";
  if (!cForm.checkValidity()) { cForm.reportValidity(); return; }
  if (!APPLY_EMAIL) { cStatus.textContent = "온라인 접수 준비 중입니다. 협회(1577-2495)로 전화 문의해 주세요."; return; }
  const data = Object.fromEntries(new FormData(cForm));
  cSubmit.disabled = true; cSubmit.textContent = "보내는 중…";
  try {
    const r = await sendMail({ ...data, _subject: "[신청 취소] " + data["취소 과정"] + " - " + data["이름"] });
    if (r === "activation") {
      cStatus.textContent = "처음 한 번은 협회 Gmail로 온 FormSubmit 확인 메일의 Activate Form 버튼을 눌러야 합니다. 누른 뒤 다시 신청해 주세요.";
      return;
    }
    cForm.hidden = true; cDone.hidden = false;
    cDone.querySelector("button").focus();
  } catch (err) {
    cStatus.textContent = "전송하지 못했습니다. " + err.message + " 급하시면 협회(1577-2495)로 전화 주세요.";
  } finally {
    cSubmit.disabled = false; cSubmit.textContent = "신청 취소하기";
  }
});

}

if (document.getElementById("verify-modal")) {
const vModal = document.getElementById("verify-modal");
const vForm = document.getElementById("verify-form");
const vResult = document.getElementById("verify-result");
const vSubmit = document.getElementById("verify-submit");
const rForm = document.getElementById("vreq-form");
const rStatus = document.getElementById("vreq-status");
const rSubmit = document.getElementById("vreq-submit");
const rDone = document.getElementById("vreq-done");
const vOpenBtn = document.getElementById("verify-open");
const norm = {
  name: v => v.replace(/\s+/g, ""),
  birth: v => v.replace(/[^0-9]/g, ""),
  cert: v => v.replace(/[\s-]+/g, "").toUpperCase()
};
async function certHash(name, birth, cert) {
  const text = CERT_SALT + "|" + norm.name(name) + "|" + norm.birth(birth) + "|" + norm.cert(cert);
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function showVerifyView(view) {
  vForm.hidden = view !== "verify"; rForm.hidden = view !== "request"; rDone.hidden = view !== "done";
}
function openVerify() {
  vForm.reset(); rForm.reset(); vResult.hidden = true; rStatus.textContent = "";
  showVerifyView("verify");
  vModal.hidden = false; document.body.style.overflow = "hidden";
  vForm.querySelector("input").focus();
}
function closeVerify() { vModal.hidden = true; document.body.style.overflow = ""; vOpenBtn.focus(); }
vOpenBtn.addEventListener("click", openVerify);
vModal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeVerify(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !vModal.hidden) closeVerify(); });
document.getElementById("verify-to-request").addEventListener("click", () => {
  const d = new FormData(vForm);
  showVerifyView("request");
  rForm.elements["이름"].value = d.get("이름") || "";
  rForm.elements["생년월일"].value = d.get("생년월일") || "";
  rForm.elements["자격증번호"].value = d.get("자격증번호") || "";
  rForm.elements["전화번호"].focus();
});
document.getElementById("vreq-back").addEventListener("click", () => { showVerifyView("verify"); vForm.querySelector("input").focus(); });
vForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!vForm.checkValidity()) { vForm.reportValidity(); return; }
  const d = new FormData(vForm);
  vSubmit.disabled = true; vSubmit.textContent = "조회 중…";
  try {
    const h = await certHash(d.get("이름"), d.get("생년월일"), d.get("자격증번호"));
    const hit = CERT_HOLDERS[h];
    vResult.hidden = false;
    if (hit) {
      vResult.className = "verify-result verify-ok";
      vResult.innerHTML = "";
      const t = document.createElement("strong"); t.textContent = "✓ 자격 취득이 확인되었습니다";
      const line = document.createElement("div"); line.textContent = norm.name(d.get("이름")) + " · " + hit[0] + " · 취득일 " + hit[1];
      vResult.append(t, line);
    } else {
      vResult.className = "verify-result verify-no";
      vResult.textContent = "입력하신 정보와 일치하는 자격이 없습니다. 입력 내용을 다시 확인하시거나, 아래 '협회에 확인 요청하기'를 눌러 주세요.";
    }
  } catch (err) {
    vResult.hidden = false; vResult.className = "verify-result verify-no";
    vResult.textContent = "이 브라우저에서는 바로 조회가 되지 않습니다. 아래 '협회에 확인 요청하기'를 이용해 주세요.";
  } finally {
    vSubmit.disabled = false; vSubmit.textContent = "조회하기";
  }
});
rForm.addEventListener("submit", async e => {
  e.preventDefault();
  rStatus.textContent = "";
  if (!rForm.checkValidity()) { rForm.reportValidity(); return; }
  const data = Object.fromEntries(new FormData(rForm));
  rSubmit.disabled = true; rSubmit.textContent = "보내는 중…";
  try {
    await sendMail({ ...data, _subject: "[자격증 조회 요청] " + data["이름"] });
    showVerifyView("done");
    rDone.querySelector("button").focus();
  } catch (err) {
    rStatus.textContent = "전송하지 못했습니다. " + err.message + " 급하시면 협회(1577-2495)로 전화 주세요.";
  } finally {
    rSubmit.disabled = false; rSubmit.textContent = "확인 요청 보내기";
  }
});

}
