const n={reviewMode:"Review mode",addNote:"Add note",cancelPick:"Cancel",notes:"Notes",showPins:"Show pins",hidePins:"Hide pins",exit:"Turn off review mode",exitConfirm:"Turn off review mode on this device? Your notes stay saved. To turn it on again, open the presenter sidebar (the thin tab on the page edge, or Shift + P) and press “Start reviewing”.",chooseName:"Choose your name",whoTitle:"Who’s reviewing?",whoText:"Choose your name. Your notes are saved under it, and everyone on the review can see them.",retry:"Try again",notListed:"Not on the list? Add your name",addYourName:"Add your name",nameLabel:"Your name",addAndStart:"Add and start",nameRequired:"Please write your name.",reviewingAs:e=>`Reviewing as ${e}`,changeName:"Change name",unknownReviewer:"This name is no longer on the review list. Please choose your name again.",serviceError:"The review service could not do that. Please try again.",pickHint:"Click any part of the page to comment on it. ↑ larger area · ↓ smaller · Esc cancel",pickHintTouch:"Tap any part of the page to comment on it.",larger:"Larger area",smaller:"Smaller area",verdictQuestion:"What do you think of this part?",verdict:{keep:"Keep as is",change:"Keep with changes",drop:"Don't want",question:"Question"},commentLabel:"Comment",commentPlaceholder:"What should stay, change or go? Mention other concepts if you prefer theirs.",commentRequired:"Choose an option or write a comment.",save:"Save note",saving:"Saving…",cancel:"Cancel",close:"Close",reply:"Reply",replyPlaceholder:"Write a reply…",send:"Send",edit:"Edit",delete:"Delete",deleteConfirm:"Delete this note? Others will no longer see it.",edited:"edited",you:"You",scopePage:"This page",scopeConcept:"This concept",scopeAll:"All concepts",all:"All",empty:"No notes here yet. Use “Add note” to start.",notOnPage:"Not visible right now",notOnPageHint:"This part of the page could not be found. It may be inside a tab, menu or state that is closed.",openPage:"Open page",replies:e=>e===1?"1 reply":`${e} replies`,noteCount:e=>e===1?"1 note":`${e} notes`,welcome:e=>`Reviewing as ${e}. Review mode stays on in all four concepts in this browser.`,notConfigured:"Review mode is not connected yet. Please try again later.",offline:"Could not reach the review service. Check your connection and try again.",saveFailed:"The note was not saved. Your text is kept; please try again.",demo:"Demo — notes are saved only in this browser",homePage:"Home",selectorPage:"Concept selector",english:"English",arabic:"Arabic"},i={reviewMode:"وضع المراجعة",addNote:"إضافة ملاحظة",cancelPick:"إلغاء",notes:"الملاحظات",showPins:"إظهار العلامات",hidePins:"إخفاء العلامات",exit:"إيقاف وضع المراجعة",exitConfirm:"هل تريد إيقاف وضع المراجعة على هذا الجهاز؟ تبقى ملاحظاتك محفوظة. لتفعيله مجددًا، افتح الشريط الجانبي لأدوات العرض (الشريط الرفيع على حافة الصفحة أو Shift + P) واضغط «ابدأ المراجعة».",chooseName:"اختر اسمك",whoTitle:"من يراجع؟",whoText:"اختر اسمك. تُحفظ ملاحظاتك باسمك، ويراها جميع المشاركين في المراجعة.",retry:"إعادة المحاولة",notListed:"اسمك غير موجود؟ أضِفه",addYourName:"أضِف اسمك",nameLabel:"اسمك",addAndStart:"أضِف وابدأ",nameRequired:"يُرجى كتابة اسمك.",reviewingAs:e=>`تراجع باسم ${e}`,changeName:"تغيير الاسم",unknownReviewer:"لم يعد هذا الاسم في قائمة المراجعة. يُرجى اختيار اسمك مرة أخرى.",serviceError:"تعذّر على خدمة المراجعة تنفيذ ذلك. يُرجى المحاولة مرة أخرى.",pickHint:"انقر على أي جزء من الصفحة للتعليق عليه. ↑ مساحة أكبر · ↓ مساحة أصغر · Esc للإلغاء",pickHintTouch:"المس أي جزء من الصفحة للتعليق عليه.",larger:"مساحة أكبر",smaller:"مساحة أصغر",verdictQuestion:"ما رأيك في هذا الجزء؟",verdict:{keep:"نُبقيه كما هو",change:"نُبقيه مع تعديلات",drop:"لا نريده",question:"استفسار"},commentLabel:"التعليق",commentPlaceholder:"ما الذي يجب أن يبقى أو يتغيّر أو يُحذف؟ اذكر المفهوم الآخر إن كنت تفضّل ما فيه.",commentRequired:"اختر أحد الخيارات أو اكتب تعليقًا.",save:"حفظ الملاحظة",saving:"جارٍ الحفظ…",cancel:"إلغاء",close:"إغلاق",reply:"رد",replyPlaceholder:"اكتب ردًا…",send:"إرسال",edit:"تعديل",delete:"حذف",deleteConfirm:"هل تريد حذف هذه الملاحظة؟ لن يتمكن الآخرون من رؤيتها بعد ذلك.",edited:"معدّلة",you:"أنت",scopePage:"هذه الصفحة",scopeConcept:"هذا المفهوم",scopeAll:"كل المفاهيم",all:"الكل",empty:"لا توجد ملاحظات هنا بعد. استخدم «إضافة ملاحظة» للبدء.",notOnPage:"غير ظاهر حاليًا",notOnPageHint:"تعذّر العثور على هذا الجزء من الصفحة. قد يكون داخل تبويب أو قائمة أو حالة مغلقة.",openPage:"فتح الصفحة",replies:e=>e===1?"رد واحد":e===2?"ردّان":e<=10?`${e} ردود`:`${e} ردًا`,noteCount:e=>e===1?"ملاحظة واحدة":e===2?"ملاحظتان":e<=10?`${e} ملاحظات`:`${e} ملاحظة`,welcome:e=>`تراجع باسم ${e}. يبقى وضع المراجعة مفعّلًا في المفاهيم الأربعة على هذا المتصفح.`,notConfigured:"وضع المراجعة غير متصل بعد. يُرجى المحاولة لاحقًا.",offline:"تعذّر الوصول إلى خدمة المراجعة. تحقّق من اتصالك وحاول مرة أخرى.",saveFailed:"لم تُحفظ الملاحظة. نصّك محفوظ؛ يُرجى المحاولة مرة أخرى.",demo:"نسخة تجريبية — تُحفظ الملاحظات في هذا المتصفح فقط",homePage:"الرئيسية",selectorPage:"صفحة اختيار المفاهيم",english:"الإنجليزية",arabic:"العربية"},r={en:n,ar:i},o=e=>`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,t={plus:o('<path d="M12 5v14M5 12h14"/>'),x:o('<path d="M18 6 6 18M6 6l12 12"/>'),list:o('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),eye:o('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),eyeOff:o('<path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),minus:o('<path d="M5 12h14"/>'),power:o('<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>'),note:o('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),expand:o('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),user:o('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),shrink:o('<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>')},a=`
:host { all: initial; }
.layer {
  --ink: #17191c; --ink-2: #3b3f45; --muted: #6b7078; --line: #e3e5e8; --paper: #fff; --soft: #f4f5f7;
  --brand: #2f3bd6; --keep: #18794e; --change: #a35c00; --drop: #c4302b; --question: #2563c9; --none: #5b6170;
  font: 14px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.layer[lang="ar"] { font-family: "Noto Kufi Arabic", "Geeza Pro", "Segoe UI", Tahoma, system-ui, sans-serif; line-height: 1.6; }
*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
button { font: inherit; color: inherit; cursor: pointer; }
button:disabled { cursor: default; opacity: .5; }
button:focus-visible, textarea:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.ico { display: inline-flex; width: 16px; height: 16px; flex: none; }
.ico svg { display: block; }
.muted { color: var(--muted); }
.small { font-size: 12.5px; }

/* Highlight while choosing a section */
.hl {
  position: fixed; z-index: 2147483000; pointer-events: none;
  border: 2px solid var(--brand); border-radius: 4px;
  background: rgb(47 59 214 / .08); box-shadow: 0 0 0 9999px rgb(10 12 20 / .12);
  transition: left .06s, top .06s, width .06s, height .06s;
}
.hl__label {
  position: absolute; inset-inline-start: -2px; bottom: 100%; margin-bottom: 4px; max-width: min(420px, 90vw);
  padding: 3px 8px; border-radius: 4px; background: var(--brand); color: #fff; font-size: 12px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hl__label--inside { bottom: auto; top: 4px; inset-inline-start: 4px; }

/* Pins */
.pins { position: fixed; inset: 0; z-index: 2147483001; pointer-events: none; }
.pin {
  position: absolute; left: 0; top: 0; pointer-events: auto;
  display: inline-grid; place-items: center; width: 26px; height: 26px; padding: 0;
  border: 2px solid #fff; border-radius: 50% 50% 50% 4px; background: var(--none); color: #fff;
  font-size: 12px; font-weight: 700; line-height: 1; box-shadow: 0 2px 8px rgb(0 0 0 / .3);
}
.layer[dir="rtl"] .pin { border-radius: 50% 50% 4px 50%; }
.pin:hover, .pin--open { box-shadow: 0 0 0 3px rgb(47 59 214 / .45), 0 2px 8px rgb(0 0 0 / .3); }
.pin--keep { background: var(--keep); } .pin--change { background: var(--change); }
.pin--drop { background: var(--drop); } .pin--question { background: var(--question); }
.pin--mine { border-color: #ffe27a; }
.pin__count {
  position: absolute; top: -7px; inset-inline-end: -9px; min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 8px; background: var(--ink); color: #fff; font-size: 10px; line-height: 16px;
}
.pin--static { position: static; flex: none; box-shadow: none; border-width: 0; width: 24px; height: 24px; }

/* Tags */
.tag { padding: 1px 6px; border-radius: 4px; background: #f5b83d; color: var(--ink); font-size: 11px; font-weight: 700; }
.tag--light { background: var(--soft); color: var(--muted); font-weight: 600; }
.btn {
  display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 12px;
  border: 0; border-radius: 9px; background: rgb(255 255 255 / .1); color: inherit; white-space: nowrap; font-weight: 600;
}
.btn:hover { background: rgb(255 255 255 / .18); }
.btn--on { background: #fff; color: var(--ink); }
.btn--on:hover { background: #e9ebf0; }
.btn--primary { background: var(--brand); color: #fff; }
.btn--primary:hover { background: #2530b8; }
.btn--primary.btn--on { background: #fff; color: var(--ink); }
.btn--icon { width: 36px; padding: 0; justify-content: center; }
.btn--ghost { background: transparent; color: var(--ink-2); }
.btn--ghost:hover { background: var(--soft); }

/* Who's reviewing? */
.who { position: fixed; inset: 0; z-index: 2147483005; display: grid; place-items: center; padding: 16px; }
.who__backdrop { position: absolute; inset: 0; background: rgb(10 12 20 / .45); }
.who__card {
  position: relative; width: min(420px, 100%); max-height: calc(100vh - 32px); overflow: auto;
  padding: 18px; border-radius: 14px; background: var(--paper); color: var(--ink);
  box-shadow: 0 24px 60px rgb(10 12 20 / .35);
}
.who__title { margin: 0; padding-top: 4px; flex: 1; font-size: 18px; }
.who__text { margin: 0 0 14px; color: var(--ink-2); }
.who__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.who__person {
  display: flex; align-items: center; gap: 12px; width: 100%; min-height: 48px; padding: 6px 12px;
  border: 1px solid var(--line); border-radius: 10px; background: #fff; text-align: start; font-weight: 600; font-size: 15px;
}
.who__person:hover { border-color: var(--brand); background: #f6f7ff; }
.who__person--on { border-color: var(--brand); box-shadow: inset 0 0 0 1px var(--brand); }
.who__initial {
  display: inline-grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 50%;
  background: var(--soft); color: var(--ink-2); font-size: 12.5px; font-weight: 700; letter-spacing: .02em;
}
.who__more { margin-top: 14px; font-size: 14px; }
.who__add { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); }
.who__label { display: block; font-weight: 600; margin-bottom: 6px; }
.who__row { display: flex; gap: 8px; }
.who__row input {
  flex: 1; min-width: 0; min-height: 40px; padding: 0 10px; border: 1px solid #cfd3d9; border-radius: 8px;
  font: inherit; color: var(--ink); background: #fff;
}
.who__row input:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.who__row .btn { min-height: 40px; }

/* Toast */
.toast {
  position: fixed; z-index: 2147483004; bottom: 24px; left: 50%; transform: translateX(-50%);
  max-width: min(560px, calc(100vw - 24px)); padding: 10px 14px; border-radius: 10px;
  background: #2a2d33; color: #fff; box-shadow: 0 8px 24px rgb(0 0 0 / .25); text-align: center;
}

/* Popover */
.pop {
  position: fixed; z-index: 2147483002; width: 360px; max-height: calc(100vh - 100px); overflow: auto;
  padding: 14px; border-radius: 12px; background: var(--paper); color: var(--ink);
  border: 1px solid var(--line); box-shadow: 0 16px 40px rgb(10 12 20 / .22);
}
.pop--sheet { left: 0 !important; right: 0; bottom: 0; top: auto !important; width: auto; max-height: 75vh; border-radius: 14px 14px 0 0; padding-bottom: 84px; }
.pop__head { display: flex; align-items: flex-start; gap: 8px; margin: -4px -6px 8px 0; }
.pop__section { flex: 1; display: flex; align-items: center; gap: 8px; font-weight: 700; min-width: 0; overflow-wrap: anywhere; padding-top: 6px; }
.pop__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
.pop .btn:not(.btn--primary):not(.btn--ghost) { background: var(--soft); }
.sizer { display: flex; gap: 14px; margin-bottom: 10px; }
.link { display: inline-flex; align-items: center; gap: 4px; padding: 2px 0; border: 0; background: none; color: var(--brand); font-weight: 600; font-size: 13px; }
.link:hover:not(:disabled) { text-decoration: underline; }
.link--danger { color: var(--drop); }
.verdicts { border: 0; padding: 0; margin: 0 0 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.verdicts legend { padding: 0; margin-bottom: 6px; font-weight: 600; color: var(--ink-2); }
.verdicts--inline { margin-bottom: 8px; }
.vbtn {
  min-height: 38px; padding: 6px 8px; border: 1.5px solid var(--line); border-radius: 8px; background: #fff;
  font-weight: 600; font-size: 13px; text-align: center;
}
.vbtn:hover { border-color: currentColor; }
.vbtn--keep { color: var(--keep); } .vbtn--change { color: var(--change); }
.vbtn--drop { color: var(--drop); } .vbtn--question { color: var(--question); }
.vbtn--on { background: currentColor; border-color: currentColor; }
.vbtn--on { color: #fff; }
.vbtn--keep.vbtn--on { background: var(--keep); border-color: var(--keep); }
.vbtn--change.vbtn--on { background: var(--change); border-color: var(--change); }
.vbtn--drop.vbtn--on { background: var(--drop); border-color: var(--drop); }
.vbtn--question.vbtn--on { background: var(--question); border-color: var(--question); }
textarea {
  display: block; width: 100%; resize: vertical; padding: 8px 10px; border: 1px solid #cfd3d9; border-radius: 8px;
  font: inherit; color: var(--ink); background: #fff;
}
.error { margin: 8px 0 0; color: var(--drop); font-weight: 600; font-size: 13px; }
.thread { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.msg { padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.msg__meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; font-size: 13px; }
.msg__text { margin: 6px 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.msg__actions { display: flex; gap: 14px; margin-top: 6px; }
.msg > .v { margin-top: 6px; }
.reply { display: grid; gap: 8px; margin-top: 12px; }
.reply .btn { justify-self: end; }
.v { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #fff; background: var(--none); }
.v--keep { background: var(--keep); } .v--change { background: var(--change); }
.v--drop { background: var(--drop); } .v--question { background: var(--question); }

/* Notes panel */
.panel {
  position: fixed; z-index: 2147483002; top: 12px; bottom: 12px; inset-inline-end: 12px; width: 380px; max-width: calc(100vw - 24px);
  display: flex; flex-direction: column; border-radius: 12px; background: var(--paper);
  border: 1px solid var(--line); box-shadow: 0 16px 40px rgb(10 12 20 / .22); overflow: hidden;
}
.panel__head { display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 4px 16px; }
.layer[dir="rtl"] .panel__head { padding: 10px 16px 4px 10px; }
.panel__head h2 { margin: 0; font-size: 16px; }
.tabs { display: flex; gap: 4px; margin: 4px 12px 8px; padding: 3px; border-radius: 9px; background: var(--soft); }
.tab { flex: 1; min-height: 32px; border: 0; border-radius: 7px; background: none; font-weight: 600; font-size: 13px; color: var(--muted); }
.tab--on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgb(0 0 0 / .12); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 12px 10px; border-bottom: 1px solid var(--line); }
.chip { display: inline-flex; align-items: center; gap: 6px; min-height: 30px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; background: #fff; font-size: 12.5px; font-weight: 600; }
.chip__n { color: var(--muted); }
.chip--on { background: var(--ink); border-color: var(--ink); color: #fff; }
.chip--on .chip__n { color: #c9ccd3; }
.list { list-style: none; margin: 0; padding: 6px; overflow: auto; flex: 1; }
.item { display: flex; gap: 10px; width: 100%; padding: 10px; border: 0; border-radius: 8px; background: none; text-align: start; }
.item:hover { background: var(--soft); }
.item__body { display: grid; gap: 3px; min-width: 0; }
.item__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; }
.item__page { font-size: 12.5px; color: var(--brand); font-weight: 600; }
.item__label { font-weight: 700; overflow-wrap: anywhere; }
.item__text { color: var(--ink-2); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-wrap; }
.item__foot { font-size: 12px; }
.empty { padding: 24px 16px; color: var(--muted); text-align: center; }

@media (max-width: 720px) {
  .panel { top: auto; bottom: 0; inset-inline: 0; width: auto; max-width: none; height: 70vh; border-radius: 14px 14px 0 0; padding-bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) { .hl { transition: none; } }
`;export{a as c,t as i,r as s};
