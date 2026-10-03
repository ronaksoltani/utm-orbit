/* UTM Orbit | dependency-free browser interactions | MIT License */ "use strict";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector)
];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
}
[
  char
]));
const toast = message =>{
   const node = $(".toast");
   if (!node) return;
   node.textContent = message;
   node.classList.add("is-visible");
   clearTimeout(window.toastTimer);
   window.toastTimer = setTimeout(() => node.classList.remove("is-visible"), 2600);
};
const downloadText = (filename, text, type = "text/plain;charset=utf-8") =>{
   const url = URL.createObjectURL(new Blob([
    text
  ],{
    type
  }));
   const link = document.createElement("a");
   link.href = url;
   link.download = filename;
   link.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const copyText = async text =>{
   try{
     await navigator.clipboard.writeText(text);
     return true;
  }
   catch{
     const field = document.createElement("textarea");
     field.value = text;
     field.style.position = "fixed";
     field.style.opacity = "0";
     document.body.append(field);
     field.select();
     const ok = document.execCommand("copy");
     field.remove();
     return ok;
  }
};
const readFileText = file => new Promise((resolve, reject) =>{
   const reader = new FileReader();
   reader.onload = () => resolve(String(reader.result));
   reader.onerror = () => reject(new Error("Could not read this file."));
   reader.readAsText(file);
});
const parseCSV = text =>{
   const rows = [
  ];
   let row = [
  ], cell = "", quoted = false;
   for (let i = 0; i < text.length; i++){
     const c = text[
      i
    ];
     if (quoted){
       if (c === '"' && text[
        i + 1
      ]
       === '"'){
         cell += '"';
         i++;
      }
       else if (c === '"') quoted = false;
       else cell += c;
    }
     else if (c === '"') quoted = true;
     else if (c === ","){
       row.push(cell);
       cell = "";
    }
     else if (c === "\n"){
       row.push(cell.replace(/\r$/, ""));
       if (row.some(value => value.trim())) rows.push(row);
       row = [
      ];
       cell = "";
    }
     else cell += c;
  }
   row.push(cell.replace(/\r$/, ""));
   if (row.some(value => value.trim())) rows.push(row);
   return rows;
};
const saveJSON = (key, value) =>{
   try{
     localStorage.setItem(key, JSON.stringify(value));
     return true;
  }
   catch{
     return false;
  }
};
const loadJSON = (key, fallback) =>{
   try{
     return JSON.parse(localStorage.getItem(key)) ?? fallback;
  }
   catch{
     return fallback;
  }
};
const menuButton = $(".menu-toggle"), nav = $("#main-navigation");
menuButton?.addEventListener("click", () =>{
   const opened = nav.classList.toggle("is-open");
   menuButton.setAttribute("aria-expanded", String(opened));
   menuButton.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
});
nav?.addEventListener("click", event =>{
   if (event.target.closest("a")){
     nav.classList.remove("is-open");
     menuButton?.setAttribute("aria-expanded", "false");
  }
});
$$('[data-toast]').forEach(button => button.addEventListener("click", () => toast(button.dataset.toast)));
$$('[data-scroll]').forEach(button => button.addEventListener("click", () => $(button.dataset.scroll)?.scrollIntoView({
  behavior:"smooth"
})));
let utmBatch=loadJSON("utm-orbit-batch",[
]);
const buildUtm=()=>{
  try{
    const raw=$("#utm-url").value.trim(),url=new URL(raw);
    if(!/^https?:$/.test(url.protocol))throw new Error("Use an http or https destination.");
    const params={
      utm_source:$("#utm-source").value,
      utm_medium:$("#utm-medium").value,
      utm_campaign:$("#utm-campaign").value,
      utm_content:$("#utm-content").value,
      utm_term:$("#utm-term").value
    };
    for(const key of [
      'utm_source',
      'utm_medium',
      'utm_campaign'
    ])if(!params[
      key
    ].trim())throw new Error("Source, medium and campaign are required.");
    for(const [
      key,
      value
    ]
     of Object.entries(params))if(value.trim())url.searchParams.set(key,value.trim().toLowerCase().replace(/\s+/g,"_"));
    $("#utm-output").textContent=url.toString();
    $("#utm-status").textContent="Ready. Existing URL parameters were preserved.";
    return url.toString();
  }
  catch(error){
    $("#utm-status").textContent=error.message;
    return null;
  }
};
const renderUtm=()=>{
  $("#utm-batch").innerHTML=utmBatch.length?utmBatch.map((entry,index)=>'<article class="batch-row"><span>0'+(index+1)+' · '+escapeHTML(entry.source)+' / '+escapeHTML(entry.medium)+' / '+escapeHTML(entry.campaign)+'</span><b>'+escapeHTML(entry.url)+'</b></article>').join(""):'<div class="empty-inline">Build a link and add it to your batch.</div>';
};
$("#build-utm")?.addEventListener("click",buildUtm);
$("#add-utm")?.addEventListener("click",()=>{
  const url=buildUtm();
  if(!url)return;
  utmBatch.push({
    url,
    source:$("#utm-source").value.trim(),
    medium:$("#utm-medium").value.trim(),
    campaign:$("#utm-campaign").value.trim()
  });
  saveJSON("utm-orbit-batch",utmBatch);
  renderUtm();
  toast("Tagged link added to your local batch.");
});
$("#copy-utm")?.addEventListener("click",async()=>{
  const text=$("#utm-output").textContent;
  if(!/^https?:/.test(text)){
    toast("Build a valid URL first.");
    return;
  }
  toast(await copyText(text)?"Campaign URL copied.":"Copy was unavailable in this browser.");
});
$("#download-utm")?.addEventListener("click",()=>downloadText("utm-orbit.csv","url,source,medium,campaign\n"+utmBatch.map(x=>'"'+x.url+'","'+x.source+'","'+x.medium+'","'+x.campaign+'"').join("\n"),"text/csv;charset=utf-8"));
renderUtm();
