(()=>{const KEY="zamyad-phonebook-v1";const HISTORY="zamyad-phonebook-history-v1";let data=load();let $=id=>document.getElementById(id);
function load(){try{const x=localStorage.getItem(KEY);return x?JSON.parse(x):structuredClone(window.ZAMYAD_PHONEBOOK_DATA)}catch{return structuredClone(window.ZAMYAD_PHONEBOOK_DATA)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function history(){try{return JSON.parse(localStorage.getItem(HISTORY)||"[]")}catch{return []}}
function log(action,count,detail=""){const h=history();h.unshift({time:new Date().toLocaleString("fa-IR"),action,count,detail});localStorage.setItem(HISTORY,JSON.stringify(h.slice(0,100)))}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function render(){const q=$("searchInput").value.trim().toLowerCase(),dep=$("departmentFilter").value;
 const rows=data.filter(x=>(!dep||x.department===dep)&&Object.values(x).some(v=>String(v).toLowerCase().includes(q)));
 $("resultCount").textContent=rows.length+" رکورد"; $("phonebookBody").innerHTML=rows.map((x,i)=>`<tr data-id="${x.id}"><td>${i+1}</td><td><b>${esc(x.name)}</b></td><td>${esc(x.personnel)}</td><td>${esc(x.department)}</td><td>${esc(x.position)}</td><td><b>${esc(x.extension)}</b></td><td><span class="status ${x.active?"":"off"}">${x.active?"فعال":"غیرفعال"}</span></td></tr>`).join("");
 document.querySelectorAll("#phonebookBody tr").forEach(r=>r.onclick=()=>showPerson(+r.dataset.id))}
function departments(){const ds=[...new Set(data.map(x=>x.department))].sort();$("departmentFilter").innerHTML='<option value="">همه واحدها</option>'+ds.map(d=>`<option>${esc(d)}</option>`).join("")}
function showPerson(id){const x=data.find(a=>a.id===id);if(!x)return;$("personTitle").textContent=x.name;$("personDetails").innerHTML=[["شماره پرسنلی",x.personnel],["واحد",x.department],["سمت",x.position],["شماره داخلی",x.extension],["وضعیت",x.active?"فعال":"غیرفعال"]].map(a=>`<div class="detail"><b>${a[0]}</b>${esc(a[1])}</div>`).join("");$("personModal").classList.remove("hidden")}
function admin(){ $("adminList").innerHTML=data.map(x=>`<div class="admin-row"><input class="bulk-check" type="checkbox" value="${x.id}"><b>${esc(x.name)}</b><span>${esc(x.personnel)}</span><span>${esc(x.department)}</span><span>${esc(x.extension)}</span><div class="actions"><button class="btn edit" data-id="${x.id}">ویرایش</button><button class="btn btn-danger del" data-id="${x.id}">حذف</button></div></div>`).join("");
 document.querySelectorAll(".edit").forEach(b=>b.onclick=()=>edit(+b.dataset.id));document.querySelectorAll(".del").forEach(b=>b.onclick=()=>del(+b.dataset.id))}
function edit(id=0){const x=data.find(a=>a.id===id)||{id:0,name:"",personnel:"",department:"",position:"",extension:"",active:true};$("editId").value=x.id;$("name").value=x.name;$("personnel").value=x.personnel;$("department").value=x.department;$("position").value=x.position;$("extension").value=x.extension;$("active").checked=x.active;$("editTitle").textContent=id?"ویرایش رکورد":"افزودن رکورد";$("editModal").classList.remove("hidden")}
function del(id){if(confirm("این رکورد حذف شود؟")){data=data.filter(x=>x.id!==id);save();log("حذف رکورد",1,"شناسه: "+id);departments();render();admin()}}
$("searchInput").oninput=render;$("departmentFilter").onchange=render;$("clearBtn").onclick=()=>{$("searchInput").value="";$("departmentFilter").value="";render()};
$("adminBtn").onclick=()=>{$("adminModal").classList.remove("hidden");admin()};
$("historyBtn").onclick=()=>{
 const h=history();$("historyList").innerHTML=h.length?h.map(x=>`<div class="admin-row"><b>${esc(x.action)}</b><span>${esc(x.count)} رکورد</span><span>${esc(x.time)}</span><span>${esc(x.detail)}</span></div>`).join(""):"<p>تاریخچه‌ای ثبت نشده است.";
 $("historyModal").classList.remove("hidden");
};
$("clearHistoryBtn").onclick=()=>{if(confirm("تاریخچه پاک شود؟")){localStorage.removeItem(HISTORY);$("historyBtn").click()}};
$("selectAllBtn").onclick=()=>{document.querySelectorAll("#adminList .bulk-check").forEach(x=>x.checked=true)};
$("bulkDeactivateBtn").onclick=()=>{const ids=[...document.querySelectorAll("#adminList .bulk-check:checked")].map(x=>+x.value);if(!ids.length){alert("رکوردی انتخاب نشده است.");return} data=data.map(x=>ids.includes(x.id)?{...x,active:false}:x);save();log("غیرفعال‌سازی گروهی",ids.length);departments();render();admin();};$("addBtn").onclick=()=>edit();
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
$("editForm").onsubmit=e=>{e.preventDefault();const id=+$("editId").value,x={id:id||Date.now(),name:$("name").value.trim(),personnel:$("personnel").value.trim(),department:$("department").value.trim(),position:$("position").value.trim(),extension:$("extension").value.trim(),active:$("active").checked};if(id)data=data.map(a=>a.id===id?x:a);else data.push(x);save();log(id?"ویرایش رکورد":"افزودن رکورد",1,x.name);departments();render();admin();$("editModal").classList.add("hidden")};
$("resetBtn").onclick=()=>{if(confirm("داده‌های دمو بازنشانی شود؟")){data=structuredClone(window.ZAMYAD_PHONEBOOK_DATA);save();departments();render();admin()}};
$("exportBtn").onclick=()=>{const head=["نام","پرسنلی","واحد","سمت","داخلی","وضعیت"],body=data.map(x=>[x.name,x.personnel,x.department,x.position,x.extension,x.active?"فعال":"غیرفعال"]);const csv="\uFEFF"+[head,...body].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="zamyad-phonebook.csv";a.click()};
let pendingExcel=[];
function openExcelPreview(rows){
 const norm=v=>String(v??"").trim();
 const pick=(r,names)=>{for(const n of names)if(r[n]!==undefined)return norm(r[n]);return ""};
 const existingByPersonnel=new Set(data.map(x=>norm(x.personnel)).filter(Boolean));
 const seen=new Set(), parsed=[];
 rows.forEach((r,i)=>{
  const x={row:i+2,id:Date.now()+i,name:pick(r,["نام","نام و نام خانوادگی","name","Name"]),personnel:pick(r,["شماره پرسنلی","پرسنلی","personnel","Personnel"]),department:pick(r,["واحد","دپارتمان","department","Department"]),position:pick(r,["سمت","position","Position"]),extension:pick(r,["شماره داخلی","داخلی","extension","Extension"]),active:!["غیرفعال","inactive","0","false"].includes(pick(r,["وضعیت","active","Active"]).toLowerCase())};
  const errors=[]; if(!x.name)errors.push("نام خالی"); if(!x.personnel)errors.push("پرسنلی خالی"); if(!x.extension)errors.push("داخلی خالی");
  const key=x.personnel||x.extension||x.name;
  if(seen.has(key))errors.push("تکراری در فایل"); else seen.add(key);
  if(x.personnel&&existingByPersonnel.has(x.personnel))errors.push("پرسنلی موجود است");
  if(x.extension&&!/^[-+()0-9\s]{2,15}$/.test(x.extension))errors.push("شماره داخلی نامعتبر");
  x.errors=errors; parsed.push(x);
 });
 pendingExcel=parsed;
 const valid=parsed.filter(x=>!x.errors.length).length, invalid=parsed.length-valid, duplicate=parsed.filter(x=>x.errors.some(e=>e.includes("تکراری")||e.includes("موجود"))).length;
 $("excelSummary").innerHTML=`<span>کل: <b>${parsed.length}</b></span><span class="ok">معتبر: <b>${valid}</b></span><span class="bad">دارای خطا: <b>${invalid}</b></span><span>تکراری/موجود: <b>${duplicate}</b></span>`;
 $("excelPreviewBody").innerHTML=parsed.map(x=>`<tr class="${x.errors.length?"excel-error":""}"><td>${x.row}</td><td>${esc(x.name)}</td><td>${esc(x.personnel)}</td><td>${esc(x.department)}</td><td>${esc(x.position)}</td><td>${esc(x.extension)}</td><td>${x.active?"فعال":"غیرفعال"}</td><td>${x.errors.length?'<span class="status off">'+esc(x.errors.join("، "))+'</span>':'<span class="status">معتبر</span>'}</td></tr>`).join("");
 $("excelConfirmBtn").disabled=valid===0;
 $("excelPreviewModal").classList.remove("hidden");
}
$("importExcelBtn").onclick=()=>$("excelFile").click();
$("excelFile").onchange=async e=>{
 const f=e.target.files[0]; if(!f)return;
 if(typeof XLSX==="undefined"){alert("کتابخانه Excel بارگذاری نشده است.");return}
 try{
  const wb=XLSX.read(await f.arrayBuffer(),{type:"array"});
  const ws=wb.Sheets[wb.SheetNames[0]], rows=XLSX.utils.sheet_to_json(ws,{defval:""});
  if(!rows.length){alert("فایل Excel خالی است.");return}
  openExcelPreview(rows);
 }catch(err){console.error(err);alert("خطا در خواندن فایل Excel.");}
 e.target.value="";
};
$("excelConfirmBtn").onclick=()=>{
 const valid=pendingExcel.filter(x=>!x.errors.length).map(({row,errors,...x})=>x);
 if(!valid.length)return;
 const replace=confirm("تأیید کنید تا اطلاعات معتبر جایگزین اطلاعات فعلی شود. برای افزودن/به‌روزرسانی، «لغو» را بزنید.");
 if(replace)data=valid; else {
  const map=new Map(data.map(x=>[x.personnel||x.extension||x.name,x]));
  valid.forEach(x=>map.set(x.personnel||x.extension||x.name,x)); data=[...map.values()];
 }
 save();departments();render();admin();$("excelPreviewModal").classList.add("hidden");
 alert(valid.length+" رکورد معتبر ثبت شد. رکوردهای دارای خطا ثبت نشدند.");
};
$("exportExcelBtn").onclick=()=>{
 if(typeof XLSX==="undefined"){alert("کتابخانه Excel بارگذاری نشده است.");return}
 const rows=data.map((x,i)=>({"ردیف":i+1,"نام و نام خانوادگی":x.name,"شماره پرسنلی":x.personnel,"واحد":x.department,"سمت":x.position,"شماره داخلی":x.extension,"وضعیت":x.active?"فعال":"غیرفعال"}));
 const ws=XLSX.utils.json_to_sheet(rows); ws["!cols"]=[{wch:8},{wch:24},{wch:16},{wch:22},{wch:26},{wch:14},{wch:12}];
 const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"دفترچه تلفن");
 XLSX.writeFile(wb,"zamyad-phonebook.xlsx");
};
departments();render();$("updateDate").textContent="آخرین بروزرسانی: "+new Date().toLocaleDateString("fa-IR");
})();