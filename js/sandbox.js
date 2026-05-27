// JS extraido de sandbox_teste.html. Separacao inicial sem mudanca de comportamento.

document.addEventListener("DOMContentLoaded",()=>{
const tabEscala=document.getElementById("tabEscala");
const tabServidores=document.getElementById("tabServidores");
const ativarEscala=()=>{document.body.classList.add("aba-escala-ativa");document.body.classList.remove("aba-cadastro-ativa");tabEscala?.classList.add("active");tabServidores?.classList.remove("active");};
const ativarCadastro=()=>{document.body.classList.add("aba-cadastro-ativa");document.body.classList.remove("aba-escala-ativa");tabServidores?.classList.add("active");tabEscala?.classList.remove("active");};
tabEscala?.addEventListener("click",ativarEscala);
tabServidores?.addEventListener("click",ativarCadastro);
document.addEventListener("click",(event)=>{
  const btn=event.target.closest?.("#btnS02Toggle");
  if(!btn)return;
  const sec=btn.closest(".secao02");
  if(!sec)return;
  const recolhida=sec.classList.toggle("is-recolhida");
  btn.textContent=recolhida?"▶":"◀";
  btn.setAttribute("aria-expanded",String(!recolhida));
});
document.getElementById("btnFullscreenEscala")?.addEventListener("click",async()=>{
try{
if(!document.fullscreenElement){
  await document.documentElement.requestFullscreen();
}else{
  await document.exitFullscreen();
}
}catch(err){
  console.warn("Fullscreen indisponível",err);
}
});
const aplicarTurnoEscala=(modo)=>{
  const turno=modo==="day"?"diurno":modo==="all"?"todos":"noturno";
  document.body.classList.toggle("turno-diurno",turno==="diurno");
  document.body.classList.toggle("turno-noturno",turno==="noturno");
  document.body.classList.toggle("turno-todos",turno==="todos");
  document.querySelectorAll(".s03-tool-turnos .s03-btn.turno").forEach((btn)=>{
    btn.classList.toggle("active",btn.classList.contains(modo));
  });
};
document.querySelectorAll(".s03-tool-turnos .s03-btn.turno").forEach((btn)=>{
  btn.addEventListener("click",()=>{
    aplicarTurnoEscala(btn.classList.contains("day")?"day":btn.classList.contains("all")?"all":"night");
  });
});
aplicarTurnoEscala(document.body.classList.contains("turno-noturno")?"night":document.body.classList.contains("turno-todos")?"all":"day");
const btnConfigEscalas=document.getElementById("btnConfigEscalas");
const popoverConfigEscalas=document.getElementById("popoverConfigEscalas");
const makeOptions=(start,end,value)=>Array.from({length:end-start+1},(_,index)=>{const n=String(start+index);return `<option${n===String(value)?" selected":""}>${n}</option>`;}).join("");
document.querySelectorAll(".js-options-1-12").forEach((select)=>{select.innerHTML=makeOptions(1,12,select.dataset.value||1);});
const postoRows=[
["1","CHEFE DE PLANTAO","ATIVO","SIM","SIM","1","1","1","1"],
["2","CHEFE ADJUNTO","ATIVO","SIM","SIM","1","1","0","0"],
["3","ARMARIA","ATIVO","SIM","SIM","1","1","0","0"],
["4","P0","INATIVO","NAO","NAO","2","2","0","0"],
["5","P1","ATIVO","SIM","SIM","5","5","0","0"],
["6","P2","ATIVO","SIM","SIM","3","3","0","0"],
["7","T1","ATIVO","NAO","SIM","0","1","1","0"],
["8","T2","ATIVO","NAO","SIM","0","0","1","1"],
["9","T3","ATIVO","NAO","SIM","0","1","1","0"],
["10","T4","ATIVO","NAO","SIM","0","0","1","1"],
["11","VIV. ALFA","INATIVO","SIM","SIM","10","2","0","0"],
["12","VIV. BRAVO","ATIVO","SIM","SIM","10","2","0","0"],
["13","VIV. CHARLIE","ATIVO","SIM","SIM","10","2","0","0"],
["14","VIV. DELTA","ATIVO","SIM","SIM","10","2","0","0"],
["15","IN/TR/SAU","ATIVO","SIM","SIM","10","2","0","0"]
].map((row)=>[...row,row[5]==="0"?"NAO":"SIM",row[6]==="0"?"NAO":"SIM",row[7]==="0"?"NAO":"SIM",row[8]==="0"?"NAO":"SIM"]);
const makeSelect=(options,value)=>`<select>${options.map((option)=>`<option${option===value?" selected":""}>${option}</option>`).join("")}</select>`;
const makeNumberSelect=(value,permitido="SIM")=>`<select class="cfg-vagas"${permitido==="NAO"?" disabled":""}>${makeOptions(0,12,permitido==="NAO"?0:value)}</select>`;
const makePermSelect=(value)=>makeSelect(["SIM","NAO"],value==="NAO"?"NAO":"SIM").replace("<select>","<select class=\"cfg-permitido\">");
const renderConfigPostos=()=>{
  document.getElementById("configPostosBody").innerHTML=postoRows.map((row)=>`<tr data-id="${row[0]}" class="${row[2]==="INATIVO"?"is-inativo":""} ${row[4]==="NAO"?"is-nao-visivel":""}"><td>${row[0].padStart(2,"0")}</td><td>${row[1]}</td><td>${makeSelect(["ATIVO","INATIVO"],row[2])}</td><td>${makeSelect(["SIM","NAO"],row[3])}</td><td>${makeSelect(["SIM","NAO"],row[4])}</td><td class="posto-gap-cell"></td><td>${makePermSelect(row[9])}</td><td>${makeNumberSelect(row[5],row[9])}</td><td>${makePermSelect(row[10])}</td><td>${makeNumberSelect(row[6],row[10])}</td><td class="posto-gap-cell"></td><td>${makePermSelect(row[11])}</td><td>${makeNumberSelect(row[7],row[11])}</td><td>${makePermSelect(row[12])}</td><td>${makeNumberSelect(row[8],row[12])}</td></tr>`).join("");
};
renderConfigPostos();
const syncPermissaoPostosRow=(tr)=>{
  const selects=Array.from(tr.querySelectorAll("select"));
  [[4,3],[6,5],[8,7],[10,9]].forEach(([vagasIndex,permIndex])=>{
    const vagas=selects[vagasIndex];
    const perm=selects[permIndex];
    if(!vagas||!perm)return;
    if(perm.value==="NAO"){
      vagas.value="0";
      vagas.disabled=true;
    }else{
      vagas.disabled=false;
    }
  });
};
document.getElementById("configPostosBody")?.addEventListener("change",(event)=>{
  const tr=event.target.closest("tr");
  if(!tr)return;
  if(event.target.classList.contains("cfg-permitido"))syncPermissaoPostosRow(tr);
});
const aplicarConfigPostos=()=>{
  document.querySelectorAll("#configPostosBody tr").forEach((tr)=>{
    const row=postoRows.find((item)=>item[0]===tr.dataset.id);
    const selects=Array.from(tr.querySelectorAll("select"));
    if(!row||selects.length<11)return;
    row[2]=selects[0].value;
    row[3]=selects[1].value;
    row[4]=selects[2].value;
    row[5]=selects[3].value==="NAO"?"0":selects[4].value;
    row[9]=selects[3].value;
    row[6]=selects[5].value==="NAO"?"0":selects[6].value;
    row[10]=selects[5].value;
    row[7]=selects[7].value==="NAO"?"0":selects[8].value;
    row[11]=selects[7].value;
    row[8]=selects[9].value==="NAO"?"0":selects[10].value;
    row[12]=selects[9].value;
  });
  renderConfigPostos();
  aplicarHorariosAtuais();
  renderResponsaveisViews();
  renderResponsaveisPostos();
  atualizarDisponibilidadeColuna();
};
btnConfigEscalas?.addEventListener("click",()=>{popoverConfigEscalas.classList.add("is-open");popoverConfigEscalas.setAttribute("aria-hidden","false");});
popoverConfigEscalas?.querySelectorAll(".config-pop-sair,.config-cancel").forEach((btn)=>btn.addEventListener("click",()=>{popoverConfigEscalas.classList.remove("is-open");popoverConfigEscalas.setAttribute("aria-hidden","true");}));
popoverConfigEscalas?.querySelectorAll(".config-tab").forEach((tab)=>tab.addEventListener("click",()=>{const target=tab.dataset.configTab;popoverConfigEscalas.querySelectorAll(".config-tab").forEach((item)=>item.classList.toggle("active",item===tab));popoverConfigEscalas.querySelectorAll(".config-tab-panel").forEach((panel)=>panel.classList.toggle("active",panel.dataset.configPanel===target));}));
const cfgEsc=(value)=>String(value??"").replace(/[&<>"]/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
const configHorarioDefs={
  "postos-diurno":{titulo:"HORÁRIOS - POSTOS EXTERNOS - DIURNO",tableId:"tbl-T2",inicio:"08:00",fim:"20:00",colunas:6,grupos:6,intervalos:["08:00-10:00","10:00-12:00","12:00-14:00","14:00-16:00","16:00-18:00","18:00-20:00"]},
  "postos-noturno":{titulo:"HORÁRIOS - POSTOS EXTERNOS - NOTURNO",tableId:"tbl-T4",inicio:"20:00",fim:"08:00",colunas:8,grupos:4,intervalos:["20:00-21:30","21:30-23:00","23:00-00:30","00:30-02:00","02:00-03:30","03:30-05:00","05:00-06:30","06:30-08:00"]},
  "vivencias-diurno":{titulo:"HORÁRIOS - VIVÊNCIAS - DIURNO",tableId:"tbl-T3",inicio:"08:00",fim:"18:00",colunas:1,grupos:1,intervalos:["08:00-18:00"]},
  "vivencias-noturno":{titulo:"HORÁRIOS - VIVÊNCIAS - NOTURNO",tableId:"tbl-T5",inicio:"07:00",fim:"08:00",colunas:1,grupos:1,intervalos:["07:00-08:00"]}
};
let configHorarioAtivo="postos-diurno";
const horarioPanel=()=>popoverConfigEscalas?.querySelector("[data-config-panel='horarios']");
const horContexto=()=>configHorarioDefs[configHorarioAtivo];
let horariosRegistros=[];
let horariosSeq=1;
const minHora=(value)=>{const [h,m]=String(value||"").split(":").map(Number);return ((h||0)*60)+(m||0);};
const horaMin=(value)=>`${String(Math.floor((value%(24*60))/(60))).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`;
const duracaoTurno=(ini,fim)=>{const a=minHora(ini);let b=minHora(fim);if(b<=a)b+=24*60;return b-a;};
const maskHora=(value)=>{
  const digits=String(value||"").replace(/\D/g,"").slice(0,4);
  const raw=digits.length>2?`${digits.slice(0,2)}:${digits.slice(2)}`:digits;
  if(digits.length<4)return raw;
  const h=Math.min(23,Number(digits.slice(0,2))||0);
  const m=Math.min(59,Number(digits.slice(2,4))||0);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};
const aplicarMascaraHora=(input)=>{
  if(!input)return;
  input.value=maskHora(input.value);
};
const horaValida=(value)=>/^\d{2}:\d{2}$/.test(String(value||""))&&Number(value.slice(0,2))<24&&Number(value.slice(3,5))<60;
const horDefault=(key)=>{
  const def=configHorarioDefs[key];
  return {id:"",setor:def.titulo.includes("POSTOS")?"POSTOS EXTERNOS":"VIVENCIAS",turno:def.titulo.includes("NOTURNO")?"NOTURNO":"DIURNO",inicio:def.inicio,fim:def.fim,colunas:def.colunas,grupos:def.grupos,filhos:[]};
};
const horDefaultComFilhos=(key)=>{
  const base=horDefault(key);
  return {...base,filhos:gerarFilhosCalculados(base)};
};
const setHorFormEnabled=(enabled)=>{
  horarioPanel()?.querySelectorAll("#horInicio,#horFim,#horColunas,#horGrupos,#horFilhosBody input,#horFilhosBody select").forEach((el)=>{el.disabled=!enabled;});
  document.getElementById("horGravar").disabled=!enabled;
};
const popularHorSelects=()=>{
  const ctx=horContexto();
  const max=ctx.titulo.includes("VIVÊNCIAS - DIURNO")?2:ctx.titulo.includes("VIVÊNCIAS - NOTURNO")?1:12;
  ["horColunas","horGrupos"].forEach((id)=>{
    const el=document.getElementById(id);
    if(el)el.innerHTML=Array.from({length:max},(_,i)=>`<option>${i+1}</option>`).join("");
  });
};
const lerHorForm=()=>{
  const filhos=Array.from(document.querySelectorAll("#horFilhosBody tr")).map((tr,index)=>({
    id:String(index+1).padStart(2,"0"),
    idMae:document.getElementById("horId")?.value||"",
    grupo:tr.querySelector("select")?.value||"",
    inicio:tr.querySelectorAll("input")[0]?.value||"",
    fim:tr.querySelectorAll("input")[1]?.value||""
  }));
  const base=horDefault(configHorarioAtivo);
  return {...base,id:document.getElementById("horId")?.value||"",inicio:document.getElementById("horInicio")?.value||"",fim:document.getElementById("horFim")?.value||"",colunas:Number(document.getElementById("horColunas")?.value||0),grupos:Number(document.getElementById("horGrupos")?.value||0),filhos};
};
const gerarFilhosCalculados=(registro)=>{
  const total=Number(registro.colunas)||0;
  const grupos=Number(registro.grupos)||1;
  const intervalo=Math.round(duracaoTurno(registro.inicio,registro.fim)/(total||1));
  let inicio=minHora(registro.inicio);
  return Array.from({length:total},(_,index)=>{
    const ini=horaMin(inicio%(24*60));
    const fim=horaMin((inicio+intervalo)%(24*60));
    inicio+=intervalo;
    return {id:String(index+1).padStart(2,"0"),idMae:registro.id||"",grupo:String(Math.min(grupos,Math.floor(index/(Math.ceil(total/grupos)||1))+1)),inicio:ini,fim};
  });
};
const renderHorFilhos=(registro,enabled=false,usarFilhosExistentes=false)=>{
  const tbody=document.getElementById("horFilhosBody");
  if(!tbody)return;
  const total=Number(registro.colunas)||0;
  const grupos=Number(registro.grupos)||1;
  const intervalo=Math.round(duracaoTurno(registro.inicio,registro.fim)/(total||1));
  document.getElementById("horRendicao").textContent=`Intervalo de rendição: ${horaMin(intervalo)}`;
  const calculados=gerarFilhosCalculados(registro);
  tbody.innerHTML=Array.from({length:total},(_,index)=>{
    const filho=usarFilhosExistentes&&registro.filhos?.[index]?registro.filhos[index]:calculados[index];
    const ini=filho.inicio;
    const fim=filho.fim;
    const grupoDefault=filho.grupo;
    const options=Array.from({length:grupos},(_,i)=>`<option${String(filho.grupo||grupoDefault)===String(i+1)?" selected":""}>${i+1}</option>`).join("");
    return `<tr><td>${String(index+1).padStart(2,"0")}</td><td><select ${enabled?"":"disabled"}>${options}</select></td><td><input class="hor-time-input" type="text" maxlength="5" inputmode="numeric" value="${cfgEsc(ini)}" ${enabled?"":"disabled"}></td><td><input class="hor-time-input" type="text" maxlength="5" inputmode="numeric" value="${cfgEsc(fim)}" ${enabled?"":"disabled"}></td></tr>`;
  }).join("");
};
const preencherHorForm=(registro,enabled=false)=>{
  popularHorSelects();
  document.getElementById("horId").value=registro.id||"";
  document.getElementById("horInicio").value=registro.inicio||"";
  document.getElementById("horFim").value=registro.fim||"";
  document.getElementById("horColunas").value=String(registro.colunas||1);
  document.getElementById("horGrupos").value=String(registro.grupos||1);
  renderHorFilhos(registro,enabled,Boolean(registro.id));
  setHorFormEnabled(enabled);
  document.getElementById("horRemover").disabled=!(enabled&&registro.id);
};
const limparHorForm=()=>{
  preencherHorForm({...horDefault(configHorarioAtivo),inicio:"",fim:"",colunas:0,grupos:0,filhos:[]},false);
  const base=horDefault(configHorarioAtivo);
  document.getElementById("horInicio").placeholder="";
  document.getElementById("horFim").placeholder="";
  document.getElementById("horColunas").innerHTML=`<option>${base.colunas}</option>`;
  document.getElementById("horGrupos").innerHTML=`<option>${base.grupos}</option>`;
  document.getElementById("horRendicao").textContent="Intervalo de rendição: -";
  document.getElementById("horFilhosBody").innerHTML="";
};
const registrosContexto=()=>{const base=horDefault(configHorarioAtivo);return horariosRegistros.filter((r)=>r.setor===base.setor&&r.turno===base.turno);};
const renderHorMae=()=>{
  const tbody=document.getElementById("horMaeBody");
  if(!tbody)return;
  tbody.innerHTML=registrosContexto().map((r)=>`<tr data-id="${r.id}"><td><input type="radio" name="horAtual-${r.setor}-${r.turno}" ${r.atual?"checked":""}></td><td>${r.id}</td><td>${r.setor}</td><td>${r.turno}</td><td>${r.grupos}</td><td>${r.inicio}</td><td>${r.fim}</td></tr>`).join("");
};
const aplicarHorariosAtuais=()=>{
  ["postos-diurno","postos-noturno","vivencias-diurno","vivencias-noturno"].forEach((key)=>{
    const base=horDefault(key);
    const atual=horariosRegistros.find((r)=>r.atual&&r.setor===base.setor&&r.turno===base.turno);
    aplicarHorarioAtual(atual||horDefaultComFilhos(key));
  });
};
const keyHorarioRegistro=(registro)=>{
  const setor=normResp(registro.setor);
  const turno=normResp(registro.turno);
  if(setor==="POSTOS EXTERNOS"&&turno==="DIURNO")return "postos-diurno";
  if(setor==="POSTOS EXTERNOS"&&turno==="NOTURNO")return "postos-noturno";
  if(setor==="VIVENCIAS"&&turno==="DIURNO")return "vivencias-diurno";
  if(setor==="VIVENCIAS"&&turno==="NOTURNO")return "vivencias-noturno";
  return configHorarioAtivo;
};
const labelsHorarioRegistro=(registro)=>registro.filhos.map((f)=>f.fim?`${f.inicio}-${f.fim}`:f.inicio);
const horarioVivenciaPadrao=(tableId)=>tableId==="tbl-T5"?"07:00-08:00":"08:00-18:00";
const garantirLinhaHorariosVivencias=(tableId,labels=[])=>{
  const table=document.getElementById(tableId);
  if(!table?.tHead)return;
  const postos=Array.from(table.tHead.rows[0]?.children||[]);
  if(!postos.length)return;
  const total=Array.from(postos).reduce((sum,th)=>sum+Math.max(1,Number(th.colSpan||1)),0);
  const valores=Array.from({length:total},(_,index)=>labels[index]||labels[index%Math.max(1,labels.length)]||horarioVivenciaPadrao(tableId));
  let row=table.tHead.rows[1];
  if(!row)row=table.tHead.insertRow(1);
  if(row.children.length!==total){
    row.innerHTML=valores.map((label,index)=>`<th class="${index%2===0?"s03-zebra-a":"s03-zebra-b"}">${cfgEsc(label)}</th>`).join("");
  }else{
    Array.from(row.children).forEach((th,index)=>{th.textContent=valores[index]||"";});
  }
};
const garantirHorariosVivencias=()=>{
  garantirLinhaHorariosVivencias("tbl-T3");
  garantirLinhaHorariosVivencias("tbl-T5");
};
const gruposHorarioRegistro=(registro)=>{
  const grupos=[];
  registro.filhos.forEach((filho,index)=>{
    const grupo=String(filho.grupo||"1");
    const label=filho.fim?`${filho.inicio}-${filho.fim}`:filho.inicio;
    let atual=grupos[grupos.length-1];
    if(!atual||atual.grupo!==grupo){
      atual={grupo,indices:[],inicio:filho.inicio,fim:filho.fim,label};
      grupos.push(atual);
    }
    atual.indices.push(index);
    atual.fim=filho.fim;
    atual.label=`${atual.inicio}-${atual.fim}`;
  });
  return grupos;
};
const limparTabelaHtml=(table)=>{
  table.querySelectorAll("tbody td:not(.posto-cell)").forEach((td)=>{
    td.className=td.className.replace(/\bs03-\S+/g,"").trim();
    limparCelulaEscala(td);
  });
};
const snapshotVivencias=(table)=>{
  const map=new Map();
  if(!table)return map;
  table.querySelectorAll("tbody td").forEach((td)=>{
    const local=localAlocacao(td);
    if(!local)return;
    const row=td.parentElement.sectionRowIndex;
    if(!map.has(local))map.set(local,new Map());
    const rowMap=map.get(local);
    const nome=nomeCelulaEscala(td);
    if(td.dataset.s03AutoChefe==="1")return;
    if(nome&&!rowMap.has(row))rowMap.set(row,{nome,forca:td.dataset.forca||forcaCelulaEscala(td),html:td.innerHTML});
  });
  return map;
};
const restaurarSnapshotVivencias=(table,snapshot)=>{
  table.querySelectorAll("tbody td").forEach((td)=>{
    const local=localAlocacao(td);
    const row=td.parentElement.sectionRowIndex;
    const item=snapshot.get(local)?.get(row);
    if(item){
      td.innerHTML=item.html||htmlAlocado(item.nome);
      td.dataset.nomeAlocado=item.nome;
      td.dataset.forca=item.forca;
    }
  });
};
const rebuildPostosExternos=(registro,noturno=false)=>{
  const table=document.getElementById(noturno?"tbl-T4":"tbl-T2");
  if(!table)return;
  const labels=labelsHorarioRegistro(registro);
  const colCount=labels.length;
  const grupos=gruposHorarioRegistro(registro);
  const zebraByCol=[];
  grupos.forEach((grupo,groupIndex)=>grupo.indices.forEach((index)=>{zebraByCol[index]=groupIndex%2===0?"s03-zebra-a":"s03-zebra-b";}));
  table.querySelector("colgroup").innerHTML=`<col class="${noturno?"t4":"t2"}-col-posto"/>${Array.from({length:colCount},(_,i)=>`<col class="${noturno?`t4-zebra-${zebraByCol[i]==="s03-zebra-b"?"b":"a"}`:"t2-col-slot"} ${zebraByCol[i]||"s03-zebra-a"}"/>`).join("")}`;
  if(noturno){
    table.querySelector("thead").innerHTML=`<tr class="t4-head-grupos"><th class="t4-th-posto" rowspan="2">POSTO</th>${grupos.map((g,index)=>`<th class="${index%2===0?"s03-zebra-a":"s03-zebra-b"}" colspan="${g.indices.length}">${cfgEsc(g.label)}</th>`).join("")}</tr><tr class="t4-head-slots">${labels.map((label,index)=>`<th class="${zebraByCol[index]||"s03-zebra-a"}">${cfgEsc(label)}</th>`).join("")}</tr>`;
  }else{
    table.querySelector("thead").innerHTML=`<tr><th>POSTO</th>${labels.map((label,index)=>`<th class="${zebraByCol[index]||"s03-zebra-a"}">${cfgEsc(label)}</th>`).join("")}</tr>`;
  }
  const rowCells=()=>Array.from({length:colCount},(_,index)=>`<td class="${zebraByCol[index]||"s03-zebra-a"}"></td>`).join("");
  const groups=[
    {label:"P1",rows:vagasPosto("P1",noturno),chefe:!noturno},
    {label:"P2",rows:vagasPosto("P2",noturno),chefe:!noturno},
    {label:"T1",rows:vagasPosto("T1",noturno)},
    {label:"T2",rows:vagasPosto("T2",noturno)},
    {label:"T3",rows:vagasPosto("T3",noturno)},
    {label:"T4",rows:vagasPosto("T4",noturno)}
  ];
  table.querySelector("tbody").innerHTML=groups.map((group)=>{
    const first=`<tr class="grupo-start${group.chefe?" destaque-linha":""}"><td class="posto-cell"${group.rows>1?` rowspan="${group.rows}"`:""}>${group.label}</td>${rowCells()}</tr>`;
    return first+Array.from({length:group.rows-1},()=>`<tr>${rowCells()}</tr>`).join("");
  }).join("");
};
const rebuildVivencias=(registro,noturno=false)=>{
  const table=document.getElementById(noturno?"tbl-T5":"tbl-T3");
  if(!table)return;
  const snapshot=snapshotVivencias(table);
  const postos=["VIV. ALFA","VIV. BRAVO","VIV. CHARLIE","VIV. DELTA","IN/TR/SAU"];
  const labels=labelsHorarioRegistro(registro);
  const perPosto=Math.max(1,Math.min(2,Number(registro.colunas)||1));
  const total=postos.length*perPosto;
  const zebraByCol=Array.from({length:total},(_,index)=>Math.floor(index/perPosto)%2===0?"s03-zebra-a":"s03-zebra-b");
  table.querySelector("colgroup").innerHTML=Array.from({length:total},(_,index)=>`<col class="${zebraByCol[index]}"/>`).join("");
  table.querySelector("thead").innerHTML=`<tr>${postos.map((posto,index)=>`<th class="${index%2===0?"s03-zebra-a":"s03-zebra-b"}" colspan="${perPosto}">${cfgEsc(posto)}</th>`).join("")}</tr><tr>${postos.map((_,postoIndex)=>labels.slice(0,perPosto).map((label,offset)=>`<th class="${zebraByCol[(postoIndex*perPosto)+offset]}">${cfgEsc(label||"")}</th>`).join("")).join("")}</tr>`;
  const row=()=>`<tr>${Array.from({length:total},()=>"<td></td>").join("")}</tr>`;
  const rows=Math.max(...postos.map((posto)=>vagasPosto(posto,noturno)));
  table.querySelector("tbody").innerHTML=Array.from({length:rows},(_,index)=>`<tr${index===0?' class="destaque-linha"':""}>${Array.from({length:total},(_,col)=>`<td class="${zebraByCol[col]}"></td>`).join("")}</tr>`).join("");
  garantirLinhaHorariosVivencias(table.id,postos.flatMap(()=>labels.slice(0,perPosto)));
  restaurarSnapshotVivencias(table,snapshot);
};
const renderConfigHorario=(key=configHorarioAtivo)=>{
  const panel=horarioPanel();
  const def=configHorarioDefs[key];
  if(!panel||!def)return;
  configHorarioAtivo=key;
  panel.querySelectorAll(".config-menu-link").forEach((btn)=>btn.classList.toggle("active",btn.dataset.horarioConfig===key));
  panel.querySelector(".config-content-banner").textContent=def.titulo;
  limparHorForm();
  renderHorMae();
};
const aplicarHorarioAtual=(registro)=>{
  const def=configHorarioDefs[keyHorarioRegistro(registro)];
  if(def.tableId==="tbl-T2")rebuildPostosExternos(registro,false);
  else if(def.tableId==="tbl-T4")rebuildPostosExternos(registro,true);
  else if(def.tableId==="tbl-T3")rebuildVivencias(registro,false);
  else if(def.tableId==="tbl-T5")rebuildVivencias(registro,true);
  def.inicio=registro.inicio;
  def.fim=registro.fim;
  def.colunas=Number(registro.colunas)||def.colunas;
  def.grupos=Number(registro.grupos)||def.grupos;
  def.intervalos=labelsHorarioRegistro(registro);
  renderResponsaveisViews();
  if(modoColunaEscala)atualizarMarcacoesColunaEscala();
  if(typeof setupAlocacaoEscalas==="function")setupAlocacaoEscalas();
  observarTabelasEscala();
  if(typeof atualizarDisponibilidadeColuna==="function")atualizarDisponibilidadeColuna();
};
const popMsg=(msg)=>{const p=abrirPopArquivo(`<div class="s03-clear-title">AVISO</div><div class="s03-clear-msg">${cfgEsc(msg)}</div><div class="s03-clear-actions"><button class="s03-clear-exit" type="button">SAIR</button></div>`);p.querySelector("button").addEventListener("click",()=>p.remove());};
const pedirCodigoPopover=(onOk)=>{
  const p=abrirPopArquivo(`<div class="s03-clear-title">CÓDIGO DE SEGURANÇA</div><div class="s03-clear-msg"><input id="horCodigoSeg" type="password" maxlength="10" style="width:160px;height:24px;text-align:center"></div><div class="s03-clear-actions"><button class="s03-clear-confirm" type="button">CONFIRMAR</button><button class="s03-clear-exit" type="button">SAIR</button></div>`);
  const input=p.querySelector("#horCodigoSeg");
  const confirmar=()=>{if(input.value==="2009"){p.remove();onOk();}else{input.value="";input.placeholder="CODIGO INCORRETO";}};
  p.querySelector(".s03-clear-confirm").addEventListener("click",confirmar);
  p.querySelector(".s03-clear-exit").addEventListener("click",()=>p.remove());
  input.addEventListener("keydown",(event)=>{if(event.key==="Enter")confirmar();});
  setTimeout(()=>input.focus(),30);
};
const gravarHorario=()=>{
  const r=lerHorForm();
  for(const [campo,valor] of [["Inicio do turno",r.inicio],["Fim do turno",r.fim],["Nº de colunas",r.colunas],["Nº de grupos",r.grupos]]){
    if(!valor){popMsg(`O campo ${campo} está vazio, preencha para prosseguir.`);return;}
  }
  if(!horaValida(r.inicio)){popMsg("O campo Inicio do turno está vazio, preencha para prosseguir.");return;}
  if(!horaValida(r.fim)){popMsg("O campo Fim do turno está vazio, preencha para prosseguir.");return;}
  for(const [index,filho] of r.filhos.entries()){
    if(!filho.grupo){popMsg(`O campo GRUPO linha ${String(index+1).padStart(2,"0")} está vazio, preencha para prosseguir.`);return;}
    if(!horaValida(filho.inicio)){popMsg(`O campo H. INICIO linha ${String(index+1).padStart(2,"0")} está vazio, preencha para prosseguir.`);return;}
    if(!horaValida(filho.fim)){popMsg(`O campo H.FIM linha ${String(index+1).padStart(2,"0")} está vazio, preencha para prosseguir.`);return;}
  }
  if(horariosRegistros.some((item)=>item.id!==r.id&&item.setor===r.setor&&item.turno===r.turno&&item.inicio===r.inicio&&item.fim===r.fim&&item.colunas===r.colunas&&item.grupos===r.grupos&&JSON.stringify(item.filhos)===JSON.stringify(r.filhos))){
    popMsg("Esse horario já existe!");
    return;
  }
  const novo=!r.id;
  if(novo)r.id=String(horariosSeq++).padStart(3,"0");
  const index=horariosRegistros.findIndex((item)=>item.id===r.id);
  if(index>=0)r.atual=Boolean(horariosRegistros[index].atual);
  else r.atual=!registrosContexto().some((item)=>item.atual);
  if(index>=0)horariosRegistros[index]=r;else horariosRegistros.push(r);
  if(r.atual)aplicarHorarioAtual(r);
  aplicarHorariosAtuais();
  popMsg(`Horario ${novo?"criado":"alterado"} com sucesso`);
  limparHorForm();
  renderHorMae();
};
const removerHorario=()=>{
  const id=document.getElementById("horId")?.value;
  if(!id)return;
  const p=abrirPopArquivo(`<div class="s03-clear-title">REMOVER</div><div class="s03-clear-msg">Confirma a exclusao desse horário?</div><div class="s03-clear-actions"><button class="s03-clear-confirm" type="button">CONFIRMAR</button><button class="s03-clear-exit" type="button">SAIR</button></div>`);
  p.querySelector(".s03-clear-confirm").addEventListener("click",()=>{
    p.remove();
    pedirCodigoPopover(()=>{
      horariosRegistros=horariosRegistros.filter((item)=>item.id!==id);
      aplicarHorariosAtuais();
      popMsg("Horario excluído com sucesso");
      limparHorForm();
      renderHorMae();
    });
  });
  p.querySelector(".s03-clear-exit").addEventListener("click",()=>p.remove());
};
popoverConfigEscalas?.querySelectorAll("[data-horario-config]").forEach((btn)=>btn.addEventListener("click",()=>renderConfigHorario(btn.dataset.horarioConfig)));
document.getElementById("horNovo")?.addEventListener("click",()=>preencherHorForm(horDefault(configHorarioAtivo),true));
document.getElementById("horGravar")?.addEventListener("click",gravarHorario);
document.getElementById("horRemover")?.addEventListener("click",removerHorario);
popoverConfigEscalas?.querySelector("[data-config-panel='postos'] .config-save")?.addEventListener("click",aplicarConfigPostos);
["horInicio","horFim","horColunas","horGrupos"].forEach((id)=>{
  const el=document.getElementById(id);
  el?.addEventListener("input",()=>{
    if(id==="horInicio"||id==="horFim")aplicarMascaraHora(el);
    renderHorFilhos({...lerHorForm(),filhos:[]},true,false);
  });
  el?.addEventListener("change",()=>{
    if(id==="horInicio"||id==="horFim")aplicarMascaraHora(el);
    renderHorFilhos({...lerHorForm(),filhos:[]},true,false);
  });
});
document.getElementById("horFilhosBody")?.addEventListener("input",(event)=>{
  if(event.target.matches(".hor-time-input"))aplicarMascaraHora(event.target);
});
document.getElementById("horFilhosBody")?.addEventListener("change",(event)=>{
  if(event.target.matches(".hor-time-input"))aplicarMascaraHora(event.target);
});
document.getElementById("horMaeBody")?.addEventListener("click",(event)=>{
  const tr=event.target.closest("tr");
  if(!tr)return;
  const r=horariosRegistros.find((item)=>item.id===tr.dataset.id);
  if(!r)return;
  if(event.target.type==="radio"){
    registrosContexto().forEach((item)=>{item.atual=item.id===r.id;});
    aplicarHorarioAtual(r);
    renderHorMae();
    return;
  }
  document.querySelectorAll("#horMaeBody tr").forEach((row)=>row.classList.toggle("is-selected",row===tr));
  preencherHorForm(r,true);
});
renderConfigHorario();
const popoverResponsaveisPosto=document.getElementById("popoverResponsaveisPosto");
const respFiltroForca=document.getElementById("respFiltroForca");
const respFiltroPlantao=document.getElementById("respFiltroPlantao");
const respBusca=document.getElementById("respBusca");
const respPostosBody=document.getElementById("respPostosBody");
const plantoesResp=["ALFA","BRAVO","CHARLIE","DELTA"];
const txtResp=(value)=>String(value||"").replace(/\s+/g," ").trim();
const normResp=(value)=>txtResp(value).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const STORAGE_RESP_KEY="escalaAgent:responsaveisPosto:v2";
let _plantaoRespFallback="";
let _dataRespFallback="";
const respRows=[];
postoRows.forEach((posto)=>{
  if(posto[2]!=="ATIVO"||posto[3]!=="SIM")return;
  [["PPF",Number(posto[5]),posto[9]],["FPN",Number(posto[7]),posto[11]]].forEach(([forca,vagas,permitido])=>{
    if(permitido!=="SIM")return;
    if(!vagas)return;
    plantoesResp.forEach((plantao)=>{
      respRows.push({id:String(respRows.length+1).padStart(3,"0"),forca,plantao,posto:posto[1],responsavel:"",status:"ATIVO"});
    });
  });
});
const plantaoRespAtual=()=>{
  const plantaoNavbar=normResp(document.getElementById("topoPlantaoDia")?.textContent);
  return plantoesResp.includes(plantaoNavbar)?plantaoNavbar:_plantaoRespFallback;
};
const dataRespValida=()=>/^\d{4}-\d{2}-\d{2}$/.test(document.getElementById("topoDatePicker")?.value||_dataRespFallback||"");
const nomeVazioResp=(value)=>!txtResp(value)||["-","—","⊘"].includes(txtResp(value));
const chaveResp=(row)=>`${normResp(row.forca)}|${normResp(row.plantao)}|${normResp(row.posto)}`;
const snapshotResponsaveis=()=>respRows.map((row)=>({...row}));
const listaResponsaveisTemNomes=(lista)=>Array.isArray(lista)&&lista.some((row)=>txtResp(row?.responsavel));
const payloadResponsaveis=(rows=snapshotResponsaveis())=>({versao:2,salvoEm:new Date().toISOString(),rows});
const aplicarResponsaveisSalvos=(lista)=>{
  if(!Array.isArray(lista))return false;
  if(!listaResponsaveisTemNomes(lista))return false;
  const savedMap=new Map();
  lista.forEach((item)=>{
    const key=chaveResp(item);
    if(key)savedMap.set(key,item);
  });
  if(!savedMap.size)return false;
  respRows.forEach((row)=>{
    const saved=savedMap.get(chaveResp(row));
    if(saved)row.responsavel=saved.responsavel||"";
  });
  return true;
};
const salvarResponsaveisDados=({permitirVazio=false}={})=>{
  try{
    const snapshot=snapshotResponsaveis();
    if(!permitirVazio&&!listaResponsaveisTemNomes(snapshot)){
      const atual=JSON.parse(localStorage.getItem(STORAGE_RESP_KEY)||"null");
      if(listaResponsaveisTemNomes(atual?.rows))return;
    }
    localStorage.setItem(STORAGE_RESP_KEY,JSON.stringify(payloadResponsaveis(snapshot)));
  }catch(err){
    console.warn("Nao foi possivel salvar responsaveis de posto",err);
  }
};
const carregarResponsaveisDados=()=>{
  try{
    const payload=JSON.parse(localStorage.getItem(STORAGE_RESP_KEY)||"null");
    if(payload?.versao!==2)return false;
    return aplicarResponsaveisSalvos(payload.rows);
  }catch(err){
    console.warn("Responsaveis de posto salvos invalidos",err);
    return false;
  }
};
const importarResponsaveisDaView=()=>{
  if(carregarResponsaveisDados())return;
};
const servidoresResp=()=>typeof window._getServidoresArray==="function"?window._getServidoresArray():[];
const nomesPresentesResponsaveis=(forca,plantao)=>{
  const nomes=[];
  servidoresResp().forEach((s)=>{
    if(normResp(s.status||"ATIVO")!=="ATIVO")return;
    if(normResp(s.forca)!==forca)return;
    if(normResp(s.motivoausencia))return;
    const nome=txtResp(s.nomecurto||s.nome);
    if(!nome)return;
    const plantaoServidor=normResp(s.plantao);
    const presenteFixo=plantaoServidor===plantao;
    const presentePermutante=plantaoServidor!==plantao&&txtResp(s.id_pgto_permuta)&&normResp(s.plantao_pgto_permuta)===plantao&&normResp(s.status_pgto||"PRESENTE")==="PRESENTE";
    const presenteExtra=plantaoServidor!==plantao&&txtResp(s.motivoapoio);
    if(presenteFixo||presentePermutante||presenteExtra)nomes.push(nome);
  });
  return [...new Set(nomes)].sort((a,b)=>a.localeCompare(b));
};
const responsavelAusenteNoPlantaoAtual=(row)=>{
  if(!row?.responsavel||typeof window._getServidoresArray!=="function")return false;
  const plantao=plantaoRespAtual();
  if(!servidoresResp().length||!dataRespValida()||!plantao)return false;
  if(row.plantao!==plantao)return false;
  return !nomesPresentesResponsaveis(row.forca,row.plantao).map(normResp).includes(normResp(row.responsavel));
};
const removerResponsaveisAusentesPlantaoAtual=()=>{
  let alterou=false;
  respRows.forEach((row)=>{
    if(!responsavelAusenteNoPlantaoAtual(row))return;
    row.responsavel="";
    alterou=true;
  });
  if(alterou)queueMicrotask(()=>{try{salvarResponsaveisDados({permitirVazio:true});salvarLocalEmergencial();}catch(err){}});
  return alterou;
};
const validarResponsaveisAusentesPlantaoAtual=()=>{
  return removerResponsaveisAusentesPlantaoAtual();
};
const respSelect=(valor,row)=>{
  const nomes=nomesPresentesResponsaveis(row.forca,row.plantao);
  const opcoes=valor&&!nomes.map(normResp).includes(normResp(valor))?[valor,...nomes]:nomes;
  return `<select class="resp-responsavel-select"><option value="">-</option>${opcoes.map((nome)=>`<option value="${cfgEsc(nome)}"${normResp(nome)===normResp(valor)?" selected":""}>${cfgEsc(nome)}</option>`).join("")}</select>`;
};
const renderResponsaveisPostos=()=>{
  if(!respPostosBody)return;
  const filtroForca=normResp(respFiltroForca?.value||"PPF");
  const filtroPlantao=normResp(respFiltroPlantao?.value||"TODOS");
  const busca=normResp(respBusca?.value||"");
  const rows=respRows.filter((row)=>{
    if(filtroForca!=="TODOS"&&row.forca!==filtroForca)return false;
    if(filtroPlantao!=="TODOS"&&row.plantao!==filtroPlantao)return false;
    if(busca&&!normResp(`${row.id} ${row.forca} ${row.plantao} ${row.posto} ${row.responsavel} ${row.status}`).includes(busca))return false;
    return true;
  });
  respPostosBody.innerHTML=rows.map((row)=>`<tr data-id="${row.id}"><td>${row.id}</td><td>${row.forca}</td><td>${row.plantao}</td><td>${row.posto}</td><td>${respSelect(row.responsavel,row)}</td><td>${row.status}</td></tr>`).join("");
  respPostosBody.querySelectorAll(".resp-responsavel-select").forEach((select)=>{
    select.addEventListener("change",()=>{
      const row=respRows.find((item)=>item.id===select.closest("tr")?.dataset.id);
      if(row)row.responsavel=select.value;
      salvarResponsaveisDados();
      salvarLocalEmergencial();
      renderResponsaveisViews();
    });
  });
  renderResponsaveisViews();
};
let respAcaoPendente=null;
const respActionHtml=(hasName)=>hasName?'<button class="resp-action-btn" data-resp-action="remove" type="button">×</button><button class="resp-action-btn" data-resp-action="move" type="button">↔</button><button class="resp-action-btn" data-resp-action="copy" type="button">⇆</button>':"";
const aplicarResponsavelNaLinha=(targetRow,nome,forca,sourceId,move,{validarPresenca=true}={})=>{
  if(!targetRow||!nome)return;
  if(targetRow.forca!==forca)return;
  if(validarPresenca&&!nomesPresentesResponsaveis(targetRow.forca,targetRow.plantao).map(normResp).includes(normResp(nome)))return;
  targetRow.responsavel=nome;
  if(move&&sourceId&&sourceId!==targetRow.id){
    const source=respRows.find((row)=>row.id===sourceId);
    if(source)source.responsavel="";
  }
  respAcaoPendente=null;
  salvarResponsaveisDados();
  salvarLocalEmergencial();
  renderResponsaveisViews();
  renderResponsaveisPostos();
};
const postoConfigPorNome=(posto)=>postoRows.find((row)=>normResp(row[1])===normResp(posto));
const vagasPosto=(posto,noturno=false)=>{
  const row=postoConfigPorNome(posto);
  if(!row||row[2]!=="ATIVO"||row[4]!=="SIM")return 1;
  const ppfPerm=row[noturno?10:9]==="SIM";
  const fpnPerm=row[noturno?12:11]==="SIM";
  const ppf=ppfPerm?Number(row[noturno?6:5]||0):0;
  const fpn=fpnPerm?Number(row[noturno?8:7]||0):0;
  return Math.max(1,ppf,fpn);
};
const turnoTabela=(tableId)=>(tableId==="tbl-T4"||tableId==="tbl-T5")?"noturno":"diurno";
const localAlocacao=(td)=>{
  const table=td?.closest("table");
  if(!table)return "";
  if(table.id==="tbl-T2"||table.id==="tbl-T4"){
    let row=td.closest("tr");
    while(row&&!row.querySelector(".posto-cell"))row=row.previousElementSibling;
    return txtResp(row?.querySelector(".posto-cell")?.textContent);
  }
  if(table.id==="tbl-T3"||table.id==="tbl-T5"){
    const index=td.cellIndex;
    let acc=0;
    const topHeaders=Array.from(table.querySelectorAll("thead tr:first-child th"));
    for(const th of topHeaders){
      const span=Number(th.colSpan||1);
      if(index>=acc&&index<acc+span)return txtResp(th.textContent);
      acc+=span;
    }
  }
  const index=td.cellIndex;
  return txtResp(table.querySelectorAll("thead tr:last-child th")[index]?.textContent||table.querySelectorAll("thead th")[index]?.textContent);
};
const forcaCelulaEscala=(td)=>{
  const forca=normResp(td?.dataset?.forca);
  if(forca)return forca;
  const local=localAlocacao(td);
  const forcaLocal=forcaDoLocal(td?.closest("table")?.id,local);
  if(forcaLocal==="PPF"||forcaLocal==="FPN")return forcaLocal;
  return forcaAtivaEscala();
};
const colunaAlocacao=(td)=>{
  const table=td?.closest("table");
  if(!table)return -1;
  if(table.id==="tbl-T2"||table.id==="tbl-T4")return td.closest("tr")?.querySelector(".posto-cell")?td.cellIndex:td.cellIndex+1;
  return td.cellIndex;
};
const forcaPermitidaNoLocal=(tableId,local,forca)=>{
  const config=postoConfigPorNome(local);
  if(!config)return true;
  const noturno=turnoTabela(tableId)==="noturno";
  const index=forca==="FPN"?(noturno?12:11):(noturno?10:9);
  return config[index]==="SIM";
};
const forcaDoLocal=(tableId,local)=>{
  const config=postoConfigPorNome(local);
  if(!config)return "";
  const noturno=turnoTabela(tableId)==="noturno";
  const ppf=config[noturno?10:9]==="SIM";
  const fpn=config[noturno?12:11]==="SIM";
  if(ppf&&fpn)return "PPF/FPN";
  if(ppf)return "PPF";
  if(fpn)return "FPN";
  return "";
};
const textoCelulaSemControlesEscala=(td)=>{
  if(!td)return "";
  const clone=td.cloneNode(true);
  clone.querySelectorAll(".s03-cell-select").forEach((el)=>el.remove());
  return clone.textContent;
};
const nomeCelulaEscala=(td)=>txtResp(td?.querySelector(".s03-alocado-nome")?.textContent||td?.dataset?.nomeAlocado||textoCelulaSemControlesEscala(td));
const celulaChefePosto=(td)=>{
  const tr=td?.closest("tr");
  const table=td?.closest("table");
  if(!tr||!table)return false;
  if(table.id==="tbl-T2")return tr.classList.contains("destaque-linha");
  if(table.id==="tbl-T3"){
    if(tr.parentElement?.tagName!=="TBODY"||tr.sectionRowIndex!==0)return false;
    let start=0;
    for(const th of Array.from(table.querySelectorAll("thead tr:first-child th"))){
      if(td.cellIndex===start)return true;
      start+=Number(th.colSpan||1);
    }
  }
  return false;
};
const celulaOcupadaEscala=(td)=>Boolean(nomeCelulaEscala(td));
const escResp=(value)=>txtResp(value).replace(/[&<>"]/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
const htmlAlocado=(nome)=>`<div class="s03-alocado"><span class="s03-alocado-nome">${escResp(nome)}</span><span class="s03-alocado-actions"><button type="button" data-s03-cell-action="clear" title="Limpar">⌫</button><button type="button" data-s03-cell-action="move" title="Mover">✥</button><button type="button" data-s03-cell-action="copy" title="Copiar">⧉</button></span></div>`;
const forcaAtivaEscala=()=>document.body.classList.contains("force-fpn")?"FPN":"PPF";
const bloquearDrop=(td)=>{
  td.classList.add("s03-drop-blocked");
  setTimeout(()=>td.classList.remove("s03-drop-blocked"),700);
};
const avisarForcaRestrita=(td,forca)=>{
  if(tdAvisoForca&&tdAvisoForca!==td)limparAvisoForcaRestrita(tdAvisoForca);
  tdAvisoForca=td;
  // Só captura o original se ainda não estiver em modo aviso,
  // evitando sobrescrever _s03WarnOriginal com o próprio texto de aviso
  // nas re-entradas rápidas do dragover sobre a mesma célula.
  if(!td.classList.contains("s03-force-warning")){
    td._s03WarnOriginal=td.innerHTML;
  }
  td.classList.add("s03-drop-blocked","s03-force-warning");
  td.textContent=forca?`AQUI ${forca}`:"FORCA RESTRITA";
  clearTimeout(td._s03WarnTimer);
  td._s03WarnTimer=setTimeout(()=>{
    if(tdAvisoForca===td)tdAvisoForca=null;
    limparAvisoForcaRestrita(td);
  },900);
};
const estadoDragEscala=(event)=>{
  const nome=txtResp(event.dataTransfer?.getData("text/plain"));
  const forca=normResp(event.dataTransfer?.getData("application/x-forca"));
  return {nome:nome||dragAtualEscala?.nome||"",forca:forca||dragAtualEscala?.forca||""};
};
const tdEventoEscala=(event)=>{
  const current=event.currentTarget;
  if(current?.tagName==="TD")return current;
  return event.target?.closest?.("td");
};
const nomeDuplicadoNaColuna=(table,td,nome,ignorar=null)=>{
  const coluna=colunaAlocacao(td);
  return Array.from(table.querySelectorAll("tbody td")).some((cell)=>{
    if(cell===td||cell===ignorar||cell.classList.contains("posto-cell"))return false;
    return colunaAlocacao(cell)===coluna&&normResp(nomeCelulaEscala(cell))===normResp(nome);
  });
};
let acaoCelulaEscala=null;
let dragAtualEscala=null;
let tdAvisoForca=null;
let ponteiroAcaoEscala=null;
let ignorarClickAcaoEscala=false;
let modoAlocarAtivo=false;
let selecaoAlocar=null;
let modoDropdownEscala=false;
let modoColunaEscala=null;
let colunaOrigemEscala=null;
let ponteiroColunaEscala=null;
let ignorarClickColunaEscala=false;
let tabelaLimparPendente=null;
const S03_TABLE_IDS=["tbl-T2","tbl-T3","tbl-T4","tbl-T5"];
const limparAvisoForcaRestrita=(td)=>{
  if(!td||!td.classList.contains("s03-force-warning"))return;
  if(td._s03WarnTimer)clearTimeout(td._s03WarnTimer);
  td.innerHTML=td._s03WarnOriginal||"";
  td.classList.remove("s03-drop-blocked","s03-force-warning");
  td._s03WarnOriginal=undefined;
  td._s03WarnTimer=undefined;
  if(tdAvisoForca===td)tdAvisoForca=null;
};
const limparMarcacoesDropEscala=()=>document.querySelectorAll(".s03-drop-hover,.s03-drop-blocked").forEach((td)=>td.classList.remove("s03-drop-hover","s03-drop-blocked"));
const limparAcaoCelulaEscala=()=>{
  document.querySelectorAll(".s03-cell-selected").forEach((cell)=>{
    cell.classList.remove("s03-cell-selected");
  });
  acaoCelulaEscala=null;
};
const setDropOk=(event)=>{
  const td=tdEventoEscala(event);
  if(!td||!td.closest(".s03-table")||td.classList.contains("posto-cell")||td.classList.contains("s03-posto-inativo"))return;
  event.preventDefault();
  document.querySelectorAll(".s03-drop-hover").forEach((cell)=>{if(cell!==td)cell.classList.remove("s03-drop-hover");});
  const table=td.closest("table");
  const {forca}=estadoDragEscala(event);
  if(table&&forca&&!forcaPermitidaNoLocal(table.id,localAlocacao(td),forca)){
    avisarForcaRestrita(td,forcaDoLocal(table.id,localAlocacao(td)));
    event.dataTransfer.dropEffect="none";
    return;
  }
  td.classList.add("s03-drop-hover");
  if(event.dataTransfer)event.dataTransfer.dropEffect="copy";
};
const setDropOkDocumento=(event)=>{
  if(!event.target?.closest?.(".s03-table"))return;
  setDropOk(event);
};
const limparDrop=(event)=>{
  const td=tdEventoEscala(event);
  if(!td)return;
  td.classList.remove("s03-drop-hover","s03-drop-blocked");
  // Cancela o timer sempre, mesmo que a classe já tenha sido removida,
  // evitando que um timer residual reexiba a mensagem após o dragleave.
  if(td._s03WarnTimer){clearTimeout(td._s03WarnTimer);td._s03WarnTimer=undefined;}
  limparAvisoForcaRestrita(td);
};
const alocarCelulaEscala=(td,nome,forca,origem=null,mover=false)=>{
  const table=td.closest("table");
  if(!table||!nome||!forca||td.classList.contains("posto-cell")||td.classList.contains("s03-posto-inativo"))return false;
  const local=localAlocacao(td);
  const ignorarDuplicado=origem&&mover?origem:null;
  if(!forcaPermitidaNoLocal(table.id,local,forca)){
    avisarForcaRestrita(td,forcaDoLocal(table.id,local));
    return false;
  }
  if(celulaChefePosto(td)||celulaOcupadaEscala(td)||nomeDuplicadoNaColuna(table,td,nome,ignorarDuplicado)){
    bloquearDrop(td);
    return false;
  }
  td.innerHTML=htmlAlocado(nome);
  td.dataset.nomeAlocado=nome;
  td.dataset.forca=forca;
  if(mover&&origem){
    origem.innerHTML="";
    delete origem.dataset.nomeAlocado;
    delete origem.dataset.forca;
  }
  if(modoColunaEscala)atualizarMarcacoesColunaEscala();
  atualizarDisponibilidadeColuna();
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  limparMarcacoesDropEscala();
  salvarTabelasEscalaDados();
  salvarLocalEmergencial();
  return true;
};
const turnoPermitidoTabela=(tableId,turno)=>{
  const t=normResp(turno);
  if(tableId==="tbl-T2"||tableId==="tbl-T3")return t==="24H"||t==="DIURNO";
  if(tableId==="tbl-T4"||tableId==="tbl-T5")return t==="24H"||t==="NOTURNO";
  return true;
};
const nomesDropdownEscala=(tableId,forca)=>{
  const rows=Array.isArray(window._efetivoAllRows)?window._efetivoAllRows:(Array.isArray(window._efetivoRows)?window._efetivoRows:[]);
  return rows.filter((row)=>row?.sit==="pres"&&normResp(row.forca)===normResp(forca)&&turnoPermitidoTabela(tableId,row.turno))
    .map((row)=>txtResp(row.nome))
    .filter(Boolean)
    .filter((nome,index,lista)=>lista.findIndex((item)=>normResp(item)===normResp(nome))===index)
    .sort((a,b)=>a.localeCompare(b));
};
const vagasForcaNoLocal=(tableId,local,forca)=>{
  const config=postoConfigPorNome(local);
  if(!config)return 0;
  const noturno=turnoTabela(tableId)==="noturno";
  if(forca==="PPF")return config[noturno?10:9]==="SIM"?Number(config[noturno?6:5]||0):0;
  if(forca==="FPN")return config[noturno?12:11]==="SIM"?Number(config[noturno?8:7]||0):0;
  return 0;
};
const forcasDropdownCelulaEscala=(td)=>{
  const table=td?.closest("table");
  const local=localAlocacao(td);
  const salva=normResp(td?.dataset?.forca);
  if(salva==="PPF"||salva==="FPN")return [salva];
  const localForca=forcaDoLocal(table?.id,local);
  if(localForca==="PPF"||localForca==="FPN")return [localForca];
  if(localForca!=="PPF/FPN")return [];
  const idx=indiceVagaCelulaEscala(td);
  const ppf=vagasForcaNoLocal(table.id,local,"PPF");
  const fpn=vagasForcaNoLocal(table.id,local,"FPN");
  const forcas=[];
  if(idx<ppf)forcas.push("PPF");
  if(idx<fpn)forcas.push("FPN");
  if(!forcas.length){
    if(ppf)forcas.push("PPF");
    if(fpn)forcas.push("FPN");
  }
  return forcas;
};
const opcoesDropdownEscala=(table,td)=>{
  const forcas=forcasDropdownCelulaEscala(td);
  const multi=forcas.length>1;
  return forcas.flatMap((forca)=>nomesDropdownEscala(table.id,forca)
    .filter((nome)=>!nomeDuplicadoNaColuna(table,td,nome))
    .map((nome)=>({forca,nome,label:multi?`${forca} - ${nome}`:nome})));
};
const removerAlocacoesSemPresenca=({salvar=true}={})=>{
  const rows=Array.isArray(window._efetivoAllRows)?window._efetivoAllRows:(Array.isArray(window._efetivoRows)?window._efetivoRows:[]);
  if(!rows.length)return 0;
  const presentes=new Set(rows.filter((row)=>row?.sit==="pres").map((row)=>normResp(row.nome)));
  let removidos=0;
  S03_TABLE_IDS.forEach((id)=>{
    document.querySelectorAll(`#${id} tbody td:not(.posto-cell)`).forEach((td)=>{
      if(celulaChefePosto(td))return;
      const nome=nomeCelulaEscala(td);
      if(!nome||(!td.querySelector(".s03-alocado")&&!td.dataset.nomeAlocado))return;
      if(presentes.has(normResp(nome)))return;
      limparCelulaEscala(td);
      removidos+=1;
    });
  });
  if(removidos&&salvar){
    if(modoColunaEscala)atualizarMarcacoesColunaEscala();
    atualizarDisponibilidadeColuna();
    salvarTabelasEscalaDados();
    salvarLocalEmergencial();
  }
  return removidos;
};
window.removerAlocacoesSemPresenca=removerAlocacoesSemPresenca;
const removerDropdownsEscala=(exceto=null)=>{
  document.querySelectorAll(".s03-cell-select").forEach((select)=>{
    if(select!==exceto){
      select.closest("td")?.classList.remove("s03-dropdown-open");
      select.remove();
    }
  });
};
const ocultarDropdownCelulaEscala=(td)=>{
  td?.classList.remove("s03-dropdown-open");
  td?.querySelector(".s03-cell-select")?.remove();
};
const mostrarDropdownCelulaEscala=(td,{substituir=false}={})=>{
  if(!td||td.querySelector(".s03-cell-select")||td.classList.contains("posto-cell")||td.classList.contains("s03-posto-inativo")||celulaChefePosto(td))return;
  const table=td.closest("table");
  const opcoes=opcoesDropdownEscala(table,td);
  if(!opcoes.length)return;
  removerDropdownsEscala();
  const select=document.createElement("select");
  select.className="s03-cell-select";
  select.innerHTML=`<option value=""></option>${opcoes.map((opcao,index)=>`<option value="${index}">${cfgEsc(opcao.label)}</option>`).join("")}`;
  select.addEventListener("click",(event)=>event.stopPropagation());
  select.addEventListener("pointerdown",(event)=>event.stopPropagation());
  select.addEventListener("change",()=>{
    const opcao=opcoes[Number(select.value)];
    select.remove();
    td.classList.remove("s03-dropdown-open");
    if(!opcao?.nome||!opcao?.forca)return;
    if(substituir&&celulaOcupadaEscala(td)){
      const anterior={html:td.innerHTML,nome:td.dataset.nomeAlocado,forca:td.dataset.forca,autoChefe:td.dataset.s03AutoChefe};
      limparCelulaEscala(td);
      const ok=alocarCelulaEscala(td,opcao.nome,opcao.forca);
      if(!ok){
        td.innerHTML=anterior.html;
        if(anterior.nome)td.dataset.nomeAlocado=anterior.nome;else delete td.dataset.nomeAlocado;
        if(anterior.forca)td.dataset.forca=anterior.forca;else delete td.dataset.forca;
        if(anterior.autoChefe)td.dataset.s03AutoChefe=anterior.autoChefe;else delete td.dataset.s03AutoChefe;
      }
      return;
    }
    alocarCelulaEscala(td,opcao.nome,opcao.forca);
  });
  td.classList.add("s03-dropdown-open");
  td.appendChild(select);
  select.focus();
};
const abrirDropdownModoLista=(event)=>{
  if(!modoDropdownEscala)return;
  const td=event.currentTarget?.tagName==="TD"?event.currentTarget:event.target?.closest?.(".s03-table tbody td");
  if(!td){
    if(acaoCelulaEscala)limparAcaoCelulaEscala();
    return;
  }
  mostrarDropdownCelulaEscala(td,{substituir:celulaOcupadaEscala(td)});
};
const aplicarDropEscala=(event)=>{
  const td=tdEventoEscala(event);
  if(!td||!td.closest(".s03-table")||td.classList.contains("posto-cell")||td.classList.contains("s03-posto-inativo"))return;
  event.preventDefault();
  event.stopPropagation();
  limparDrop(event);
  const estado=estadoDragEscala(event);
  const nome=estado.nome;
  const forca=estado.forca;
  const origemDrag=event.dataTransfer.getData("application/x-s03-origin");
  const moverDrag=event.dataTransfer.getData("application/x-s03-action")==="move";
  const origem=acaoCelulaEscala&&origemDrag==="escala"?acaoCelulaEscala.origem:null;
  const ok=alocarCelulaEscala(td,nome,forca,origem,moverDrag);
  if(ok&&origemDrag==="escala")limparAcaoCelulaEscala();
  limparMarcacoesDropEscala();
};
const aplicarDropEscalaDocumento=(event)=>{
  if(!event.target?.closest?.(".s03-table"))return;
  aplicarDropEscala(event);
};
const prepararAcaoCelulaEscala=(td,action)=>{
  if(!td||(action!=="move"&&action!=="copy"))return false;
  const nome=nomeCelulaEscala(td);
  const forca=forcaCelulaEscala(td);
  if(!nome||!forca)return false;
  td.dataset.nomeAlocado=nome;
  td.dataset.forca=forca;
  limparAcaoCelulaEscala();
  acaoCelulaEscala={nome,forca,origem:td,mover:action==="move"};
  td.classList.add("s03-cell-selected");
  return true;
};
const iniciarDragCelulaEscala=(event)=>{
  const td=event.target.closest?.("td")||event.currentTarget;
  const action=event.target.closest("[data-s03-cell-action]")?.dataset.s03CellAction;
  if((action==="move"||action==="copy")&&acaoCelulaEscala?.origem!==td)prepararAcaoCelulaEscala(td,action);
  if(!acaoCelulaEscala||acaoCelulaEscala.origem!==td){
    event.preventDefault();
    return;
  }
  event.dataTransfer.setData("text/plain",acaoCelulaEscala.nome);
  event.dataTransfer.setData("application/x-forca",acaoCelulaEscala.forca);
  event.dataTransfer.setData("application/x-s03-origin","escala");
  event.dataTransfer.setData("application/x-s03-action",acaoCelulaEscala.mover?"move":"copy");
  event.dataTransfer.effectAllowed=acaoCelulaEscala.mover?"move":"copy";
  dragAtualEscala={nome:acaoCelulaEscala.nome,forca:acaoCelulaEscala.forca};
  const ghost=document.createElement("div");
  ghost.className="drag-nome-ghost";
  ghost.textContent=acaoCelulaEscala.nome;
  document.body.appendChild(ghost);
  event.dataTransfer.setDragImage(ghost,10,10);
  setTimeout(()=>ghost.remove(),0);
};
const finalizarDragCelulaEscala=()=>{dragAtualEscala=null;};
const criarGhostAcaoEscala=()=>{
  const ghost=document.createElement("div");
  ghost.className="drag-nome-ghost";
  ghost.textContent=acaoCelulaEscala?.nome||"";
  document.body.appendChild(ghost);
  return ghost;
};
const moverGhostAcaoEscala=(event)=>{
  if(!ponteiroAcaoEscala?.ghost)return;
  ponteiroAcaoEscala.ghost.style.left=`${event.clientX+10}px`;
  ponteiroAcaoEscala.ghost.style.top=`${event.clientY+10}px`;
};
const iniciarPonteiroAcaoEscala=(event)=>{
  const action=event.target.closest("[data-s03-cell-action]")?.dataset.s03CellAction;
  if(action!=="move"&&action!=="copy")return;
  const td=event.target.closest("td");
  if(!prepararAcaoCelulaEscala(td,action))return;
  event.preventDefault();
  event.stopPropagation();
  event.target.setPointerCapture?.(event.pointerId);
  ponteiroAcaoEscala={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,dragging:false,ghost:null};
};
const atualizarPonteiroAcaoEscala=(event)=>{
  if(!ponteiroAcaoEscala||ponteiroAcaoEscala.pointerId!==event.pointerId)return;
  const dx=Math.abs(event.clientX-ponteiroAcaoEscala.startX);
  const dy=Math.abs(event.clientY-ponteiroAcaoEscala.startY);
  if(!ponteiroAcaoEscala.dragging&&(dx>4||dy>4)){
    ponteiroAcaoEscala.dragging=true;
    ponteiroAcaoEscala.ghost=criarGhostAcaoEscala();
    ignorarClickAcaoEscala=true;
  }
  if(!ponteiroAcaoEscala.dragging)return;
  event.preventDefault();
  moverGhostAcaoEscala(event);
  const td=document.elementFromPoint(event.clientX,event.clientY)?.closest?.("td");
  document.querySelectorAll(".s03-drop-hover").forEach((cell)=>{if(cell!==td)cell.classList.remove("s03-drop-hover");});
  if(td&&td.closest(".s03-table")&&td!==acaoCelulaEscala?.origem&&!td.classList.contains("posto-cell")&&!td.classList.contains("s03-posto-inativo")){
    td.classList.add("s03-drop-hover");
  }
};
const finalizarPonteiroAcaoEscala=(event)=>{
  if(!ponteiroAcaoEscala||ponteiroAcaoEscala.pointerId!==event.pointerId)return;
  const estavaArrastando=ponteiroAcaoEscala.dragging;
  ponteiroAcaoEscala.ghost?.remove();
  ponteiroAcaoEscala=null;
  document.querySelectorAll(".s03-drop-hover").forEach((cell)=>cell.classList.remove("s03-drop-hover"));
  if(!estavaArrastando)return;
  event.preventDefault();
  const td=document.elementFromPoint(event.clientX,event.clientY)?.closest?.("td");
  if(td&&acaoCelulaEscala&&td!==acaoCelulaEscala.origem){
    const ok=alocarCelulaEscala(td,acaoCelulaEscala.nome,acaoCelulaEscala.forca,acaoCelulaEscala.origem,acaoCelulaEscala.mover);
    if(ok)limparAcaoCelulaEscala();
  }
  setTimeout(()=>{ignorarClickAcaoEscala=false;},0);
};
const limparSelecaoAlocar=()=>{
  document.querySelectorAll(".s03-alocar-cell-selected").forEach((td)=>td.classList.remove("s03-alocar-cell-selected"));
  selecaoAlocar=null;
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
};
const vagasAlocar=()=>selecaoAlocar?.cells?.filter((td)=>!celulaOcupadaEscala(td))||[];
const nomeJaNoPostoAlocar=(nome)=>Boolean(selecaoAlocar?.cells?.some((td)=>normResp(nomeCelulaEscala(td))===normResp(nome)));
const podeNomeAlocar=(nome,forca)=>{
  if(!modoAlocarAtivo||!selecaoAlocar||!nome||normResp(forca)!==selecaoAlocar.forca)return false;
  if(nomeJaNoPostoAlocar(nome))return false;
  return vagasAlocar().some((td)=>{
    const table=td.closest("table");
    return !nomeDuplicadoNaColuna(table,td,nome);
  });
};
const estadoAlocarEfetivo=(nome,forca)=>{
  if(!modoAlocarAtivo||!selecaoAlocar)return {ativo:false,disabled:false,selected:false};
  if(normResp(forca)!==selecaoAlocar.forca)return {ativo:true,disabled:true,selected:false};
  const jaNoPosto=nomeJaNoPostoAlocar(nome);
  const pode=podeNomeAlocar(nome,forca);
  return {ativo:true,disabled:!pode,selected:pode||jaNoPosto};
};
const aplicarAlocarNome=(nome,forca)=>{
  if(!podeNomeAlocar(nome,forca)){
    selecaoAlocar?.cells?.[0]&&bloquearDrop(selecaoAlocar.cells[0]);
    return false;
  }
  const vaga=vagasAlocar().find((td)=>!nomeDuplicadoNaColuna(td.closest("table"),td,nome));
  if(!vaga){
    selecaoAlocar?.cells?.[0]&&bloquearDrop(selecaoAlocar.cells[0]);
    return false;
  }
  const ok=alocarCelulaEscala(vaga,nome,normResp(forca));
  if(ok){
    if(!vagasAlocar().length)limparSelecaoAlocar();
    else if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  }
  return ok;
};
const selecionarPostoAlocar=(td)=>{
  if(!modoAlocarAtivo||!td||td.classList.contains("posto-cell")||td.classList.contains("s03-posto-inativo"))return false;
  const table=td.closest("table");
  const local=localAlocacao(td);
  const coluna=colunaAlocacao(td);
  const forca=forcaAtivaEscala();
  if(!table||!local||coluna<0||!forcaPermitidaNoLocal(table.id,local,forca)){
    bloquearDrop(td);
    return false;
  }
  document.querySelectorAll(".s03-alocar-cell-selected").forEach((cell)=>cell.classList.remove("s03-alocar-cell-selected"));
  const cells=Array.from(table.querySelectorAll("tbody td:not(.posto-cell)")).filter((cell)=>{
    if(cell.classList.contains("s03-posto-inativo")||celulaChefePosto(cell))return false;
    return normResp(localAlocacao(cell))===normResp(local)&&colunaAlocacao(cell)===coluna&&forcaPermitidaNoLocal(table.id,local,forca);
  });
  if(!cells.length){
    limparSelecaoAlocar();
    bloquearDrop(td);
    return false;
  }
  cells.forEach((cell)=>cell.classList.add("s03-alocar-cell-selected"));
  selecaoAlocar={tableId:table.id,local,coluna,forca,cells};
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  return true;
};
const selecionarPostoAlocarEvento=(event)=>{
  if(!modoAlocarAtivo)return false;
  if(event.target?.closest?.("[data-s03-cell-action]"))return false;
  const td=event.target?.closest?.(".s03-table tbody td");
  if(!td)return false;
  event.preventDefault();
  event.stopPropagation();
  return selecionarPostoAlocar(td);
};
const limparMarcacoesColunaEscala=()=>{
  document.querySelectorAll(".s03-col-source,.s03-col-dest,.s03-col-blocked,.s03-col-active,.s03-col-hover").forEach((el)=>{
    el.classList.remove("s03-col-source","s03-col-dest","s03-col-blocked","s03-col-active","s03-col-hover");
  });
};
const colunaDeHeaderEscala=(th)=>{
  const table=th?.closest("table");
  if(!table)return -1;
  if((table.id==="tbl-T2"||table.id==="tbl-T4")&&th.closest("tr")!==table.querySelector("thead tr:last-child"))return -1;
  if(table.id==="tbl-T2")return th.cellIndex>0?th.cellIndex:-1;
  if(table.id==="tbl-T4")return th.cellIndex+1;
  return th.cellIndex;
};
const alvoColunaEscala=(target)=>{
  const cell=target?.closest?.("td,th");
  const table=cell?.closest?.("table");
  if(!cell||!table||!S03_TABLE_IDS.includes(table.id))return null;
  const coluna=cell.tagName==="TH"?colunaDeHeaderEscala(cell):colunaAlocacao(cell);
  if(coluna<0)return null;
  return {table,coluna,cell};
};
const cellsColunaEscala=(table,coluna,{editaveis=false}={})=>Array.from(table.querySelectorAll("tbody td:not(.posto-cell)")).filter((td)=>{
  if(td.classList.contains("s03-posto-inativo"))return false;
  if(colunaAlocacao(td)!==coluna)return false;
  return !editaveis||!celulaChefePosto(td);
});
const colunaVaziaEscala=(table,coluna)=>cellsColunaEscala(table,coluna,{editaveis:true}).every((td)=>!celulaOcupadaEscala(td));
const colunaNaoVaziaEscala=(table,coluna)=>!colunaVaziaEscala(table,coluna);
const colunasTabelaEscala=(table)=>[...new Set(Array.from(table.querySelectorAll("tbody td:not(.posto-cell)")).map(colunaAlocacao).filter((coluna)=>coluna>=0))];
const dadosCelulaColuna=(td)=>{
  const nome=nomeCelulaEscala(td);
  return nome?{nome,forca:forcaCelulaEscala(td)}:null;
};
const limparCelulaEscala=(td)=>{
  td.innerHTML="";
  delete td.dataset.nomeAlocado;
  delete td.dataset.forca;
  delete td.dataset.s03AutoChefe;
};
const cellsEditaveisTabelaEscala=(table)=>colunasTabelaEscala(table).flatMap((coluna)=>cellsColunaEscala(table,coluna,{editaveis:true}));
const preencherCelulaColuna=(td,dados)=>{
  if(!dados?.nome){
    limparCelulaEscala(td);
    return;
  }
  td.innerHTML=htmlAlocado(dados.nome);
  td.dataset.nomeAlocado=dados.nome;
  td.dataset.forca=dados.forca||forcaAtivaEscala();
};
const atualizarMarcacoesColunaEscala=()=>{
  limparMarcacoesColunaEscala();
  if(!modoColunaEscala)return;
  S03_TABLE_IDS.forEach((id)=>{
    const table=document.getElementById(id);
    if(!table)return;
    const colunas=colunasTabelaEscala(table);
    const temOrigem=colunas.some((coluna)=>colunaNaoVaziaEscala(table,coluna));
    const temDestino=colunas.some((coluna)=>colunaVaziaEscala(table,coluna));
    const tabelaOperavel=modoColunaEscala==="limpar"?temOrigem:temOrigem&&temDestino;
    colunasTabelaEscala(table).forEach((coluna)=>{
      const vazia=colunaVaziaEscala(table,coluna);
      const classe=!tabelaOperavel?"s03-col-blocked":modoColunaEscala==="limpar"?(vazia?"s03-col-blocked":"s03-col-source"):(vazia?"s03-col-dest":"s03-col-source");
      cellsColunaEscala(table,coluna).forEach((td)=>td.classList.add(classe));
    });
  });
  if(colunaOrigemEscala){
    cellsColunaEscala(colunaOrigemEscala.table,colunaOrigemEscala.coluna).forEach((td)=>td.classList.add("s03-col-active"));
  }
};
const limparEstadoColunaEscala=()=>{
  modoColunaEscala=null;
  colunaOrigemEscala=null;
  ponteiroColunaEscala=null;
  limparMarcacoesColunaEscala();
  document.querySelectorAll(".s03-tool-edicao [data-s03-tool='mover'],.s03-tool-edicao [data-s03-tool='copiar'],.s03-tool-edicao [data-s03-tool='limpar']").forEach((btn)=>btn.classList.remove("active"));
};
const limparSelecaoTabelaInteira=()=>{
  document.querySelectorAll(".s03-table-clear-selected").forEach((td)=>td.classList.remove("s03-table-clear-selected"));
  tabelaLimparPendente=null;
};
const fecharPopoverLimparTabela=(limpar=false)=>{
  const pop=document.getElementById("popoverS03LimparTabela");
  if(limpar&&tabelaLimparPendente){
    cellsEditaveisTabelaEscala(tabelaLimparPendente).forEach(limparCelulaEscala);
    if(modoColunaEscala)atualizarMarcacoesColunaEscala();
    atualizarDisponibilidadeColuna();
    if(typeof window.renderEfetivo==="function")window.renderEfetivo();
    salvarTabelasEscalaDados();
    salvarLocalEmergencial();
  }
  limparSelecaoTabelaInteira();
  pop?.classList.remove("is-open");
  pop?.setAttribute("aria-hidden","true");
};
const abrirPopoverLimparTabela=(table)=>{
  if(!table)return;
  limparSelecaoTabelaInteira();
  tabelaLimparPendente=table;
  cellsEditaveisTabelaEscala(table).forEach((td)=>td.classList.add("s03-table-clear-selected"));
  const pop=document.getElementById("popoverS03LimparTabela");
  pop?.classList.add("is-open");
  pop?.setAttribute("aria-hidden","false");
};
const possibilidadeModoColuna=(modo)=>S03_TABLE_IDS.some((id)=>{
  const table=document.getElementById(id);
  if(!table)return false;
  const estados=colunasTabelaEscala(table).map((coluna)=>({vazia:colunaVaziaEscala(table,coluna),naoVazia:colunaNaoVaziaEscala(table,coluna)}));
  if(modo==="limpar")return estados.some((estado)=>estado.naoVazia);
  return estados.some((estado)=>estado.naoVazia)&&estados.some((estado)=>estado.vazia);
});
const atualizarDisponibilidadeColuna=()=>{
  ["mover","copiar","limpar"].forEach((modo)=>{
    const possivel=possibilidadeModoColuna(modo);
    const btn=document.querySelector(`.s03-tool-edicao [data-s03-tool="${modo}"]`);
    if(btn){
      btn.disabled=!possivel;
      btn.classList.toggle("is-unavailable",!possivel);
    }
    if(modoColunaEscala===modo&&!possivel)limparEstadoColunaEscala();
  });
};
const copiarColunaEscala=(origem,destino,mover=false)=>{
  if(!origem||!destino)return false;
  if(origem.table===destino.table&&origem.coluna===destino.coluna)return false;
  if(!colunaNaoVaziaEscala(origem.table,origem.coluna)||!colunaVaziaEscala(destino.table,destino.coluna))return false;
  const source=cellsColunaEscala(origem.table,origem.coluna,{editaveis:true});
  const target=cellsColunaEscala(destino.table,destino.coluna,{editaveis:true});
  const dados=source.map(dadosCelulaColuna);
  target.forEach((td,index)=>preencherCelulaColuna(td,dados[index]));
  if(mover)source.forEach(limparCelulaEscala);
  colunaOrigemEscala=mover?destino:origem;
  atualizarMarcacoesColunaEscala();
  atualizarDisponibilidadeColuna();
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  salvarTabelasEscalaDados();
  salvarLocalEmergencial();
  return true;
};
const limparColunaEscala=(alvo)=>{
  if(!alvo||!colunaNaoVaziaEscala(alvo.table,alvo.coluna))return false;
  cellsColunaEscala(alvo.table,alvo.coluna,{editaveis:true}).forEach(limparCelulaEscala);
  colunaOrigemEscala=null;
  atualizarMarcacoesColunaEscala();
  atualizarDisponibilidadeColuna();
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  salvarTabelasEscalaDados();
  salvarLocalEmergencial();
  return true;
};
const acionarColunaEscala=(alvo)=>{
  if(!modoColunaEscala||!alvo)return false;
  if(modoColunaEscala==="limpar")return limparColunaEscala(alvo);
  if(colunaNaoVaziaEscala(alvo.table,alvo.coluna)){
    colunaOrigemEscala={table:alvo.table,coluna:alvo.coluna};
    atualizarMarcacoesColunaEscala();
    return true;
  }
  if(colunaOrigemEscala&&colunaVaziaEscala(alvo.table,alvo.coluna)){
    return copiarColunaEscala(colunaOrigemEscala,{table:alvo.table,coluna:alvo.coluna},modoColunaEscala==="mover");
  }
  return false;
};
const setModoColunaEscala=(modo)=>{
  const novoModo=modoColunaEscala===modo?null:modo;
  if(modoAlocarAtivo)setModoAlocar(false);
  if(modoDropdownEscala)setModoDropdownEscala(false);
  limparEstadoColunaEscala();
  modoColunaEscala=novoModo;
  if(!modoColunaEscala)return;
  document.querySelector(`.s03-tool-edicao [data-s03-tool="${modoColunaEscala}"]`)?.classList.add("active");
  atualizarMarcacoesColunaEscala();
  atualizarDisponibilidadeColuna();
};
const criarGhostColunaEscala=(alvo)=>{
  const ghost=document.createElement("div");
  ghost.className="drag-nome-ghost";
  ghost.textContent=`COLUNA ${alvo.coluna}`;
  document.body.appendChild(ghost);
  return ghost;
};
const iniciarPonteiroColunaEscala=(event)=>{
  if(modoColunaEscala!=="mover"&&modoColunaEscala!=="copiar")return false;
  const alvo=alvoColunaEscala(event.target);
  if(!alvo||!colunaNaoVaziaEscala(alvo.table,alvo.coluna))return false;
  ponteiroColunaEscala={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,origem:alvo,modo:modoColunaEscala,dragging:false,ghost:null};
  return true;
};
const atualizarPonteiroColunaEscala=(event)=>{
  if(!ponteiroColunaEscala||ponteiroColunaEscala.pointerId!==event.pointerId)return;
  const dx=Math.abs(event.clientX-ponteiroColunaEscala.startX);
  const dy=Math.abs(event.clientY-ponteiroColunaEscala.startY);
  if(!ponteiroColunaEscala.dragging&&(dx>4||dy>4)){
    ponteiroColunaEscala.dragging=true;
    colunaOrigemEscala=ponteiroColunaEscala.origem;
    ponteiroColunaEscala.ghost=criarGhostColunaEscala(colunaOrigemEscala);
    ignorarClickColunaEscala=true;
    atualizarMarcacoesColunaEscala();
  }
  if(!ponteiroColunaEscala.dragging)return;
  event.preventDefault();
  if(ponteiroColunaEscala.ghost){
    ponteiroColunaEscala.ghost.style.left=`${event.clientX+10}px`;
    ponteiroColunaEscala.ghost.style.top=`${event.clientY+10}px`;
  }
  const alvo=alvoColunaEscala(document.elementFromPoint(event.clientX,event.clientY));
  document.querySelectorAll(".s03-col-hover").forEach((cell)=>cell.classList.remove("s03-col-hover"));
  if(alvo&&alvo.table===ponteiroColunaEscala.origem.table&&colunaVaziaEscala(alvo.table,alvo.coluna)){
    cellsColunaEscala(alvo.table,alvo.coluna).forEach((td)=>td.classList.add("s03-col-hover"));
  }
};
const finalizarPonteiroColunaEscala=(event)=>{
  if(!ponteiroColunaEscala||ponteiroColunaEscala.pointerId!==event.pointerId)return;
  const estavaArrastando=ponteiroColunaEscala.dragging;
  const origem=ponteiroColunaEscala.origem;
  const modo=ponteiroColunaEscala.modo;
  ponteiroColunaEscala.ghost?.remove();
  ponteiroColunaEscala=null;
  document.querySelectorAll(".s03-col-hover").forEach((cell)=>cell.classList.remove("s03-col-hover"));
  if(!estavaArrastando)return;
  event.preventDefault();
  const alvo=alvoColunaEscala(document.elementFromPoint(event.clientX,event.clientY));
  if(alvo&&alvo.table===origem.table&&colunaVaziaEscala(alvo.table,alvo.coluna)){
    copiarColunaEscala(origem,alvo,modo==="mover");
  }
  setTimeout(()=>{ignorarClickColunaEscala=false;},0);
};
const setModoAlocar=(ativo)=>{
  modoAlocarAtivo=Boolean(ativo);
  if(modoAlocarAtivo){
    setModoDropdownEscala(false);
    limparEstadoColunaEscala();
  }
  limparAcaoCelulaEscala();
  document.body.classList.toggle("s03-alocar-mode",modoAlocarAtivo);
  const btn=document.querySelector(".s03-alocar");
  btn?.classList.toggle("active",modoAlocarAtivo);
  document.querySelectorAll(".s03-tool-edicao .s03-action-btn").forEach((item)=>{
    item.classList.remove("is-disabled");
    item.removeAttribute("aria-disabled");
  });
  if(!modoAlocarAtivo)limparSelecaoAlocar();
  else if(typeof window.renderEfetivo==="function")window.renderEfetivo();
};
const setModoDropdownEscala=(ativo)=>{
  modoDropdownEscala=Boolean(ativo);
  if(modoDropdownEscala){
    if(modoAlocarAtivo)setModoAlocar(false);
    limparEstadoColunaEscala();
    limparAcaoCelulaEscala();
  }else{
    removerDropdownsEscala();
  }
  document.body.classList.toggle("s03-lista-mode",modoDropdownEscala);
  document.querySelector(".s03-lista")?.classList.toggle("active",modoDropdownEscala);
};
const clicarCelulaEscala=(event)=>{
  if(ignorarClickAcaoEscala){
    event.preventDefault();
    event.stopPropagation();
    ignorarClickAcaoEscala=false;
    return;
  }
  if(ignorarClickColunaEscala){
    event.preventDefault();
    event.stopPropagation();
    ignorarClickColunaEscala=false;
    return;
  }
  const td=event.target.closest("td");
  const action=event.target.closest("[data-s03-cell-action]")?.dataset.s03CellAction;
  if(modoColunaEscala&&!action){
    const alvo=alvoColunaEscala(event.target);
    if(alvo){
      event.preventDefault();
      acionarColunaEscala(alvo);
      return;
    }
  }
  if(!td){
    if(acaoCelulaEscala)limparAcaoCelulaEscala();
    return;
  }
  if(modoDropdownEscala&&!action){
    event.preventDefault();
    event.stopPropagation();
    abrirDropdownModoLista(event);
    return;
  }
  if(modoAlocarAtivo&&!action){
    selecionarPostoAlocar(td);
    return;
  }
  if(action==="clear"){
    td.innerHTML="";
    delete td.dataset.nomeAlocado;
    delete td.dataset.forca;
    if(modoColunaEscala)atualizarMarcacoesColunaEscala();
    atualizarDisponibilidadeColuna();
    if(typeof window.renderEfetivo==="function")window.renderEfetivo();
    if(acaoCelulaEscala?.origem===td)limparAcaoCelulaEscala();
    return;
  }
  if(action==="move"||action==="copy"){
    prepararAcaoCelulaEscala(td,action);
    return;
  }
  if(acaoCelulaEscala&&acaoCelulaEscala.origem!==td){
    const ok=alocarCelulaEscala(td,acaoCelulaEscala.nome,acaoCelulaEscala.forca,acaoCelulaEscala.origem,acaoCelulaEscala.mover);
    if(acaoCelulaEscala?.mover||!ok)limparAcaoCelulaEscala();
  }
};
const prepararDragBotaoEscala=(event)=>{
  if(iniciarPonteiroColunaEscala(event))return;
  iniciarPonteiroAcaoEscala(event);
};
const postoInativo=(nome)=>{
  const config=postoConfigPorNome(nome);
  return config?config[2]==="INATIVO":false;
};
const setupAlocacaoEscalas=()=>{
  ["tbl-T2","tbl-T3","tbl-T4","tbl-T5"].forEach((id)=>{
    const table=document.getElementById(id);
    if(!table)return;
    if(!table._s03TableEvents){
      table.addEventListener("click",clicarCelulaEscala);
      table.addEventListener("pointerdown",prepararDragBotaoEscala);
      table.addEventListener("dragstart",iniciarDragCelulaEscala);
      table.addEventListener("dragover",setDropOk);
      table.addEventListener("drop",aplicarDropEscala);
      table._s03TableEvents=true;
    }
    // Mapeia local → [células inativas] para achar o centro de cada grupo
    const grupoInativo=new Map();
    table.querySelectorAll("tbody td:not(.posto-cell)").forEach((td)=>{
      const local=localAlocacao(td);
      if(local&&postoInativo(local)){
        td.classList.add("s03-posto-inativo");
        td.setAttribute("title","Posto inativo — alocação bloqueada");
        if(!grupoInativo.has(local))grupoInativo.set(local,[]);
        grupoInativo.get(local).push(td);
        return; // não registra drag/drop
      }
      if(!td._s03CellEvents){
        td.addEventListener("dragstart",iniciarDragCelulaEscala);
        td.addEventListener("dragend",finalizarDragCelulaEscala);
        td.addEventListener("dragenter",()=>{if(tdAvisoForca&&tdAvisoForca!==td)limparAvisoForcaRestrita(tdAvisoForca);});
        td.addEventListener("mouseenter",abrirDropdownModoLista);
        td.addEventListener("focusin",abrirDropdownModoLista);
        td.addEventListener("mouseleave",()=>setTimeout(()=>{if(!td.matches(":hover"))ocultarDropdownCelulaEscala(td);},120));
        td.addEventListener("dragover",setDropOk);
        td.addEventListener("dragleave",limparDrop);
        td.addEventListener("drop",aplicarDropEscala);
        td._s03CellEvents=true;
      }
    });
    grupoInativo.forEach((celulas)=>celulas.forEach((td)=>td.classList.add("s03-posto-inativo-hover")));
  });
};
const responsaveisAtuaisPorPosto=(forca)=>{
  const plantao=plantaoRespAtual()||"ALFA";
  const map=new Map();
  respRows.filter((row)=>row.forca===forca&&row.plantao===plantao&&row.status==="ATIVO").forEach((row)=>{
    map.set(normResp(row.posto),txtResp(row.responsavel));
  });
  return map;
};
const badgeResponsavel=(posto)=>{
  const badges={
    "CHEFE DE PLANTAO":"01",
    "CHEFE ADJUNTO":"02",
    "ARMARIA":"AR",
    "P1":"P1",
    "P2":"P2",
    "VIV. ALFA":"VA",
    "VIV. BRAVO":"VB",
    "VIV. CHARLIE":"VC",
    "VIV. DELTA":"VD",
    "IN/TR/SAU":"IS"
  };
  return badges[normResp(posto)]||"";
};
const atualizarBadgesResponsaveis=()=>{
  const plantao=plantaoRespAtual()||"ALFA";
  const map=new Map();
  respRows.filter((row)=>row.plantao===plantao&&row.status==="ATIVO"&&row.responsavel).forEach((row)=>{
    const badge=badgeResponsavel(row.posto);
    const nome=normResp(row.responsavel);
    if(!badge||!nome)return;
    const badges=map.get(nome)||[];
    if(!badges.includes(badge))badges.push(badge);
    map.set(nome,badges);
  });
  window._badgesResponsaveisEfetivo=map;
};
const linhasGrupoT2=(posto)=>{
  const table=document.getElementById("tbl-T2");
  if(!table)return [];
  const row=Array.from(table.querySelectorAll("tbody tr")).find((tr)=>normResp(tr.querySelector(".posto-cell")?.textContent)===posto);
  if(!row)return [];
  const span=Math.max(1,Number(row.querySelector(".posto-cell")?.rowSpan||1));
  const rows=[];
  let current=row;
  for(let index=0;index<span&&current;index+=1){
    rows.push(current);
    current=current.nextElementSibling;
  }
  return rows;
};
const limparAutoChefeCelula=(td)=>{
  td.textContent="";
  delete td.dataset.nomeAlocado;
  delete td.dataset.forca;
  delete td.dataset.s03AutoChefe;
};
const nomeAutoChefeAtual=(td)=>td?.dataset.s03AutoChefe==="1"?txtResp(td.textContent):"";
const preencherLinhaT2=(posto,nome,chefesT2=new Set(),{preservarAtualSemNome=true}={})=>{
  const rows=linhasGrupoT2(posto);
  if(!rows.length)return;
  rows.forEach((row,rowIndex)=>{
    const cells=Array.from(row.children).filter((td)=>!td.classList.contains("posto-cell"));
    cells.forEach((td)=>{
      const texto=normResp(td.textContent);
      const autoChefe=td.dataset.s03AutoChefe==="1";
      const chefeEmCelulaComum=texto&&chefesT2.has(texto)&&!td.querySelector(".s03-alocado");
      if(rowIndex>0){
        if(autoChefe||chefeEmCelulaComum)limparAutoChefeCelula(td);
        return;
      }
      if(!nome&&preservarAtualSemNome&&nomeAutoChefeAtual(td))return;
      if(txtResp(td.textContent)!==txtResp(nome))td.textContent=nome||"";
      if(nome)td.dataset.s03AutoChefe="1";
      else delete td.dataset.s03AutoChefe;
      delete td.dataset.nomeAlocado;
      delete td.dataset.forca;
    });
  });
};
const preencherVivencia=(tableId,posto,nome,responsaveisAtuais=new Set(),{preservarAtualSemNome=true}={})=>{
  const table=document.getElementById(tableId);
  const firstRow=table?.querySelector("tbody tr");
  if(!table||!firstRow)return;
  let start=0;
  Array.from(table.querySelectorAll("thead tr:first-child th")).some((th)=>{
    const span=Number(th.colSpan||1);
    if(normResp(th.textContent)===posto){
      Array.from({length:span},(_,offset)=>firstRow.children[start+offset]).forEach((cell,offset)=>{
        if(!cell)return;
        if(offset>0){
          const texto=normResp(cell.textContent);
          const chefeEmCelulaComum=texto&&responsaveisAtuais.has(texto)&&!cell.querySelector(".s03-alocado");
          if(cell.dataset.s03AutoChefe==="1"||chefeEmCelulaComum)limparAutoChefeCelula(cell);
          return;
        }
        if(!nome&&preservarAtualSemNome&&nomeAutoChefeAtual(cell))return;
        if(txtResp(cell.textContent)!==txtResp(nome))cell.textContent=nome||"";
        if(nome)cell.dataset.s03AutoChefe="1";
        else delete cell.dataset.s03AutoChefe;
        delete cell.dataset.nomeAlocado;
        delete cell.dataset.forca;
      });
      Array.from(table.querySelectorAll("tbody tr")).slice(1).forEach((row)=>{
        Array.from({length:span},(_,offset)=>row.children[start+offset]).forEach((cell)=>{
          if(!cell)return;
          const texto=normResp(cell.textContent);
          const chefeEmCelulaComum=texto&&responsaveisAtuais.has(texto)&&!cell.querySelector(".s03-alocado");
          if(cell.dataset.s03AutoChefe==="1"||chefeEmCelulaComum)limparAutoChefeCelula(cell);
        });
      });
      return true;
    }
    start+=span;
    return false;
  });
};
const limparResponsaveisAntigosT5=(map)=>{
  const table=document.getElementById("tbl-T5");
  const firstRow=table?.querySelector("tbody tr");
  if(!table||!firstRow)return;
  const responsaveis=new Set(Array.from(map.values()).map(normResp).filter(Boolean));
  Array.from(firstRow.children).forEach((cell)=>{
    const nome=normResp(cell.textContent);
    if(!nome||!responsaveis.has(nome)||cell.querySelector(".s03-alocado"))return;
    cell.textContent="";
    delete cell.dataset.nomeAlocado;
    delete cell.dataset.forca;
    delete cell.dataset.s03AutoChefe;
  });
};
const limparResponsaveisViews=()=>{
  document.querySelectorAll(".resp-table tbody").forEach((tbody)=>{tbody.innerHTML="";});
  window._badgesResponsaveisEfetivo=new Map();
  ["P1","P2"].forEach((posto)=>preencherLinhaT2(posto,"",new Set(),{preservarAtualSemNome:false}));
  ["VIV. ALFA","VIV. BRAVO","VIV. CHARLIE","VIV. DELTA","IN/TR/SAU"].forEach((posto)=>preencherVivencia("tbl-T3",posto,"",new Set(),{preservarAtualSemNome:false}));
  limparResponsaveisAntigosT5(new Map());
};
const sincronizarResponsaveisEscalas=()=>{
  garantirHorariosVivencias();
  const forca=document.body.classList.contains("force-fpn")?"FPN":"PPF";
  const map=responsaveisAtuaisPorPosto(forca);
  const responsaveisAtuais=new Set(Array.from(map.values()).map(normResp).filter(Boolean));
  ["P1","P2"].forEach((posto)=>preencherLinhaT2(posto,map.get(posto)||"",responsaveisAtuais));
  ["VIV. ALFA","VIV. BRAVO","VIV. CHARLIE","VIV. DELTA","IN/TR/SAU"].forEach((posto)=>{
    preencherVivencia("tbl-T3",posto,map.get(normResp(posto))||"",responsaveisAtuais);
  });
  limparResponsaveisAntigosT5(map);
};
const renderResponsaveisViews=()=>{
  const plantao=plantaoRespAtual();
  atualizarBadgesResponsaveis();
  document.querySelectorAll(".force-block").forEach((block)=>{
    const forca=block.classList.contains("force-fpn")?"FPN":"PPF";
    const tbody=block.querySelector(".resp-table tbody");
    if(!tbody)return;
    const rows=respRows.filter((row)=>row.forca===forca&&row.plantao===(plantao||"ALFA")&&row.status==="ATIVO");
    const podeExibirNomes=dataRespValida()&&plantao;
    tbody.innerHTML=rows.map((row)=>{
      const nome=podeExibirNomes?txtResp(row.responsavel):"";
      const nomes=podeExibirNomes?nomesPresentesResponsaveis(row.forca,row.plantao):[];
      const temNome=Boolean(nome);
      const opcoes=nome&&!nomes.map(normResp).includes(normResp(nome))?[nome,...nomes]:nomes;
      const select=podeExibirNomes
        ? `<select class="resp-inline-select${temNome?"":" empty"}"><option value="">-</option>${opcoes.map((item)=>`<option value="${cfgEsc(item)}"${normResp(item)===normResp(nome)?" selected":""}>${cfgEsc(item)}</option>`).join("")}</select>`
        : "-";
      return `<tr data-id="${row.id}" data-forca="${row.forca}"><td class="resp-role">${row.posto}</td><td class="resp-name${temNome?"":" empty"}">${select}</td><td class="resp-actions">${respActionHtml(temNome)}</td></tr>`;
    }).join("");
    tbody.querySelectorAll("tr").forEach((tr)=>{
      const row=respRows.find((item)=>item.id===tr.dataset.id);
      tr.querySelector(".resp-inline-select")?.addEventListener("change",(event)=>{
        event.stopPropagation();
        if(row)row.responsavel=event.currentTarget.value;
        respAcaoPendente=null;
        salvarResponsaveisDados({permitirVazio:true});
        salvarLocalEmergencial();
        renderResponsaveisViews();
        renderResponsaveisPostos();
      });
      tr.addEventListener("dragover",(event)=>{event.preventDefault();tr.classList.add("resp-drop-hover");});
      tr.addEventListener("dragleave",()=>tr.classList.remove("resp-drop-hover"));
      tr.addEventListener("drop",(event)=>{
        event.preventDefault();
        tr.classList.remove("resp-drop-hover");
        const nome=event.dataTransfer.getData("text/plain");
        const forca=normResp(event.dataTransfer.getData("application/x-forca"));
        aplicarResponsavelNaLinha(row,nome,forca,"",false);
      });
      tr.addEventListener("click",(event)=>{
        if(event.target.closest(".resp-inline-select"))return;
        const action=event.target?.dataset?.respAction;
        if(action==="remove"){if(row){row.responsavel="";salvarResponsaveisDados();salvarLocalEmergencial();renderResponsaveisViews();renderResponsaveisPostos();}return;}
        if((action==="move"||action==="copy")&&row?.responsavel){
          respAcaoPendente={nome:row.responsavel,forca:row.forca,sourceId:row.id,move:action==="move"};
          document.querySelectorAll(".resp-table tr.is-resp-source").forEach((item)=>item.classList.remove("is-resp-source"));
          tr.classList.add("is-resp-source");
          event.stopPropagation();
          return;
        }
        if(respAcaoPendente)aplicarResponsavelNaLinha(row,respAcaoPendente.nome,respAcaoPendente.forca,respAcaoPendente.sourceId,respAcaoPendente.move,{validarPresenca:false});
      });
    });
  });
  sincronizarResponsaveisEscalas();
  if(modoColunaEscala)atualizarMarcacoesColunaEscala();
  atualizarDisponibilidadeColuna();
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
};
importarResponsaveisDaView();
const STORAGE_ESCALA_KEY="escalaAgent:lastSave";
const STORAGE_ULTIMO_GRAVADO_KEY="escalaAgent:ultimoGravadoValido:v1";
const STORAGE_TABELAS_ESCALA_KEY="escalaAgent:tabelasEscala:v2";
let tabelasEscalaSaveTimer=null;
let restaurandoTabelasEscala=false;
let alocacaoRows=[];
let estadoPaginaRestaurouTabelas=false;
const tabelaCurtaEscala=(tableId)=>String(tableId||"").replace(/^tbl-/,"");
const indiceVagaCelulaEscala=(td)=>{
  const table=td?.closest("table");
  if(!table)return -1;
  const local=normResp(localAlocacao(td));
  const coluna=colunaAlocacao(td);
  const cells=Array.from(table.querySelectorAll("tbody td:not(.posto-cell)")).filter((cell)=>normResp(localAlocacao(cell))===local&&colunaAlocacao(cell)===coluna);
  return cells.indexOf(td);
};
const horarioCelulaEscala=(td)=>{
  const table=td?.closest("table");
  const coluna=colunaAlocacao(td);
  if(!table||coluna<0)return "";
  const lastHeaders=Array.from(table.querySelectorAll("thead tr:last-child th"));
  if(table.id==="tbl-T4")return txtResp(lastHeaders[coluna-1]?.textContent);
  return txtResp(lastHeaders[coluna]?.textContent);
};
const chaveAlocacaoCelula=(td)=>{
  const table=td?.closest("table");
  if(!table)return "";
  return [table.id,normResp(localAlocacao(td)),colunaAlocacao(td),indiceVagaCelulaEscala(td)].join("|");
};
const registroAlocacaoCelula=(td)=>{
  const table=td?.closest("table");
  const nome=nomeCelulaEscala(td);
  if(!table||!nome)return null;
  const coluna=colunaAlocacao(td);
  const posicao=indiceVagaCelulaEscala(td);
  return {
    id:chaveAlocacaoCelula(td),
    tabela:tabelaCurtaEscala(table.id),
    tableId:table.id,
    posto:localAlocacao(td),
    coluna,
    posicao,
    horario:horarioCelulaEscala(td),
    nome,
    forca:td.dataset.forca||forcaCelulaEscala(td),
    autoChefe:td.dataset.s03AutoChefe==="1"
  };
};
const estadoTabelaEscala=(id)=>Array.from(document.querySelectorAll(`#${id} tbody td:not(.posto-cell)`)).map((td)=>({
  row:td.parentElement.sectionRowIndex,
  col:td.cellIndex,
  childIndex:Array.from(td.parentElement.children).indexOf(td),
  local:localAlocacao(td),
  coluna:colunaAlocacao(td),
  vagaIndex:indiceVagaCelulaEscala(td),
  nome:td.dataset.nomeAlocado||nomeCelulaEscala(td),
  forca:td.dataset.forca||forcaCelulaEscala(td),
  autoChefe:td.dataset.s03AutoChefe==="1",
  html:td.innerHTML
}));
const snapshotTabelasEscala=()=>Object.fromEntries(S03_TABLE_IDS.map((id)=>[id,estadoTabelaEscala(id)]));
const tabelasEscalaTemNomes=(tabelas)=>tabelas&&typeof tabelas==="object"&&Object.values(tabelas).some((cells)=>Array.isArray(cells)&&cells.some((cell)=>txtResp(cell?.nome)));
const sincronizarAlocacoesDadosDoDom=()=>{
  const rows=[];
  S03_TABLE_IDS.forEach((id)=>{
    document.querySelectorAll(`#${id} tbody td:not(.posto-cell)`).forEach((td)=>{
      const row=registroAlocacaoCelula(td);
      if(row)rows.push(row);
    });
  });
  alocacaoRows=rows;
  return rows;
};
const alocacoesTemNomes=(rows)=>Array.isArray(rows)&&rows.some((row)=>txtResp(row?.nome));
const aplicarAlocacoesDadosNaView=(rows=alocacaoRows)=>{
  restaurandoTabelasEscala=true;
  S03_TABLE_IDS.forEach((id)=>{
    const table=document.getElementById(id);
    table?.querySelectorAll("tbody td:not(.posto-cell)").forEach((td)=>limparCelulaEscala(td));
  });
  rows.forEach((row)=>{
    const table=document.getElementById(row.tableId||`tbl-${row.tabela}`);
    if(!table||!row.nome)return;
    const cells=Array.from(table.querySelectorAll("tbody td:not(.posto-cell)")).filter((td)=>normResp(localAlocacao(td))===normResp(row.posto)&&colunaAlocacao(td)===Number(row.coluna));
    const td=cells[Number(row.posicao)];
    if(!td||td.classList.contains("s03-posto-inativo"))return;
    if(row.autoChefe){
      td.textContent=row.nome;
      td.dataset.s03AutoChefe="1";
      delete td.dataset.nomeAlocado;
      delete td.dataset.forca;
    }else{
      td.innerHTML=htmlAlocado(row.nome);
      td.dataset.nomeAlocado=row.nome;
      td.dataset.forca=row.forca||forcaCelulaEscala(td);
    }
  });
  restaurandoTabelasEscala=false;
};
const salvarTabelasEscalaDados=()=>{
  try{
    localStorage.removeItem(STORAGE_TABELAS_ESCALA_KEY);
    window._ultimoSnapshotTabelasEscala=snapshotTabelasEscala();
    window._alocacaoRows=alocacaoRows;
  }catch(err){
    console.warn("Nao foi possivel limpar cache local da escala",err);
  }
};
const agendarSalvarTabelasEscala=()=>{
  if(restaurandoTabelasEscala)return;
  clearTimeout(tabelasEscalaSaveTimer);
  tabelasEscalaSaveTimer=null;
};
const carregarTabelasEscalaDados=(forcar=false)=>{
  if(estadoPaginaRestaurouTabelas&&!forcar)return false;
  try{
    const payload=JSON.parse(localStorage.getItem(STORAGE_TABELAS_ESCALA_KEY)||"null");
    if(!payload||payload.versao<2)return false;
    if(tabelasEscalaTemNomes(payload.tabelas)){
      S03_TABLE_IDS.forEach((id)=>restaurarTabelaEscala(id,payload.tabelas?.[id]||[]));
      garantirHorariosVivencias();
      sincronizarAlocacoesDadosDoDom();
      sincronizarResponsaveisEscalas();
      return true;
    }
    if(alocacoesTemNomes(payload.alocacoes)){
      alocacaoRows=payload.alocacoes.map((row)=>({...row,id:row.id||[row.tableId||`tbl-${row.tabela}`,normResp(row.posto),row.coluna,row.posicao].join("|")}));
      aplicarAlocacoesDadosNaView(alocacaoRows);
      window._alocacaoRows=alocacaoRows;
      garantirHorariosVivencias();
      sincronizarResponsaveisEscalas();
      return true;
    }
    return false;
  }catch(err){
    restaurandoTabelasEscala=false;
    console.warn("Tabelas da escala salvas invalidas",err);
    return false;
  }
};
const tabelasEscalaCacheMaisNovoQue=(estado)=>{
  if(estado?.origemArquivoUsuario)return false;
  try{
    const payload=JSON.parse(localStorage.getItem(STORAGE_TABELAS_ESCALA_KEY)||"null");
    if(!payload||payload.versao<2)return false;
    if(!tabelasEscalaTemNomes(payload.tabelas)&&!alocacoesTemNomes(payload.alocacoes))return false;
    return Date.parse(payload.salvoEm||"")>Date.parse(estado?.salvoEm||"");
  }catch(err){
    return false;
  }
};
const observarTabelasEscala=()=>{
  S03_TABLE_IDS.forEach((id)=>{
    const table=document.getElementById(id);
    const alvo=table?.tBodies?.[0]||table;
    if(!table||!alvo)return;
    if(table._s03PersistObserver&&table._s03PersistTarget===alvo)return;
    table._s03PersistObserver?.disconnect?.();
    table._s03PersistObserver=new MutationObserver(()=>agendarSalvarTabelasEscala());
    table._s03PersistObserver.observe(alvo,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["data-nome-alocado","data-forca","data-s03-auto-chefe"]});
    table._s03PersistTarget=alvo;
  });
};
const horariosEscala=()=>({
  T2:Array.from(document.querySelectorAll("#tbl-T2 thead th")).map((th)=>th.textContent),
  T3:Array.from(document.querySelectorAll("#tbl-T3 thead tr")).map((tr)=>Array.from(tr.children).map((th)=>th.textContent)),
  T4:Array.from(document.querySelectorAll("#tbl-T4 thead tr")).map((tr)=>Array.from(tr.children).map((th)=>th.textContent)),
  T5:Array.from(document.querySelectorAll("#tbl-T5 thead tr")).map((tr)=>Array.from(tr.children).map((th)=>th.textContent))
});
const aplicarHorariosEscala=(horarios={})=>{
  const t2=Array.isArray(horarios.T2)?horarios.T2:[];
  document.querySelectorAll("#tbl-T2 thead th").forEach((th,index)=>{if(t2[index])th.textContent=t2[index];});
  const t4=Array.isArray(horarios.T4)?horarios.T4:[];
  document.querySelectorAll("#tbl-T4 thead tr").forEach((tr,rowIndex)=>{
    const values=Array.isArray(t4[rowIndex])?t4[rowIndex]:[];
    Array.from(tr.children).forEach((th,index)=>{if(values[index])th.textContent=values[index];});
  });
  const t3=Array.isArray(horarios.T3)?horarios.T3:[];
  const t5=Array.isArray(horarios.T5)?horarios.T5:[];
  [["tbl-T3",t3],["tbl-T5",t5]].forEach(([id,rows])=>{
    if(!rows.length)return;
    const table=document.getElementById(id);
    if(!table)return;
    if(table.tHead.rows.length<2)table.tHead.insertRow();
    rows.forEach((values,rowIndex)=>{
      const tr=table.tHead.rows[rowIndex]||table.tHead.insertRow();
      if(!Array.isArray(values))return;
      if(tr.children.length!==values.length){
        tr.innerHTML=values.map((value)=>`<th>${cfgEsc(value)}</th>`).join("");
      }else{
        Array.from(tr.children).forEach((th,index)=>{th.textContent=values[index]||"";});
      }
    });
  });
};
const restaurarTabelaEscala=(id,cells=[])=>{
  const table=document.getElementById(id);
  if(!table)return;
  table.querySelectorAll("tbody td:not(.posto-cell)").forEach((td)=>limparCelulaEscala(td));
  const localizarCelula=(item)=>{
    const local=normResp(item.local);
    const coluna=Number(item.coluna);
    const vagaIndex=Number(item.vagaIndex);
    if(local&&Number.isFinite(coluna)&&Number.isFinite(vagaIndex)&&vagaIndex>=0){
      const matches=Array.from(table.querySelectorAll("tbody td:not(.posto-cell)")).filter((td)=>normResp(localAlocacao(td))===local&&colunaAlocacao(td)===coluna);
      if(matches[vagaIndex])return matches[vagaIndex];
    }
    const tr=table.querySelectorAll("tbody tr")[Number(item.row)];
    const childIndex=Number.isFinite(Number(item.childIndex))?Number(item.childIndex):Number(item.col);
    return tr?.children?.[childIndex]||null;
  };
  cells.forEach((item)=>{
    const td=localizarCelula(item);
    if(!td||td.classList.contains("posto-cell")||td.classList.contains("s03-posto-inativo"))return;
    if(celulaChefePosto(td)&&!item.autoChefe)return;
    if(item.nome){
      if(item.autoChefe){
        td.textContent=item.nome;
        td.dataset.s03AutoChefe="1";
        delete td.dataset.nomeAlocado;
        delete td.dataset.forca;
      }else{
        td.innerHTML=htmlAlocado(item.nome);
        td.dataset.nomeAlocado=item.nome;
        td.dataset.forca=item.forca||forcaCelulaEscala(td);
      }
    }
  });
};
const coletarEstadoPagina=()=>({
  versao:1,
  salvoEm:new Date().toISOString(),
  topo:{
    data:document.getElementById("topoDatePicker")?.value||"",
    plantao:normResp(document.getElementById("topoPlantaoDia")?.textContent||window._nomePlantao||plantaoRespAtual()||""),
    forca:forcaAtivaEscala(),
    filtro:window._filtroEfetivoV9||"presente"
  },
  tabelas:snapshotTabelasEscala(),
  horarios:horariosEscala(),
  cadastroHorarios:{
    seq:horariosSeq,
    registros:horariosRegistros.map((r)=>({...r,filhos:r.filhos.map((f)=>({...f}))}))
  },
  configPostos:postoRows.map((row)=>[...row]),
  alocacoes:sincronizarAlocacoesDadosDoDom().map((row)=>({...row})),
  responsaveisVersao:2,
  responsaveis:snapshotResponsaveis(),
  servidores:typeof window._getServidoresArray==="function"?window._getServidoresArray().map((s)=>({...s})):[]
});
const aplicarEstadoPagina=(estado)=>{
  if(!estado||typeof estado!=="object")return false;
  limparEstadoColunaEscala();
  setModoAlocar(false);
  const date=document.getElementById("topoDatePicker");
  if(date)date.value=estado.topo?.data||"";
  _dataRespFallback=estado.topo?.data||"";
  _plantaoRespFallback=normResp(estado.topo?.plantao||window._nomePlantao||"");
  const forca=normResp(estado.topo?.forca||"PPF");
  document.querySelectorAll(".lp-force-btn").forEach((btn)=>btn.classList.toggle("active",normResp(btn.dataset.force)===forca));
  window._forcaAtiva=forca;
  document.body.classList.toggle("force-ppf",forca==="PPF");
  document.body.classList.toggle("force-fpn",forca==="FPN");
  window._filtroEfetivoV9=estado.topo?.filtro||"presente";
  document.querySelectorAll(".srv-filtro-v9").forEach((btn)=>btn.classList.toggle("active",(btn.dataset.status||"").toLowerCase()===window._filtroEfetivoV9));
  if(typeof window.importCadastroServidores==="function")window.importCadastroServidores(estado.servidores||[]);
  horariosSeq=Number(estado.cadastroHorarios?.seq||horariosSeq)||horariosSeq;
  horariosRegistros=Array.isArray(estado.cadastroHorarios?.registros)?estado.cadastroHorarios.registros.map((r)=>({...r,filhos:Array.isArray(r.filhos)?r.filhos:[]})):[];
  if(Array.isArray(estado.configPostos)){
    estado.configPostos.forEach((saved)=>{
      const row=postoRows.find((item)=>item[0]===saved[0]);
      if(row)saved.forEach((value,index)=>{row[index]=value;});
    });
    renderConfigPostos();
  }
  renderConfigHorario(configHorarioAtivo);
  if(horariosRegistros.some((r)=>r.atual))aplicarHorariosAtuais();
  else{
    aplicarHorariosAtuais();
    aplicarHorariosEscala(estado.horarios||{});
  }
  garantirHorariosVivencias();
  const estadoTemTabelas=tabelasEscalaTemNomes(estado.tabelas);
  const estadoTemAlocacoes=alocacoesTemNomes(estado.alocacoes);
  const cacheTabelasMaisNovo=tabelasEscalaCacheMaisNovoQue(estado);
  if(!cacheTabelasMaisNovo)S03_TABLE_IDS.forEach((id)=>restaurarTabelaEscala(id,estado.tabelas?.[id]||[]));
  garantirHorariosVivencias();
  if(!cacheTabelasMaisNovo&&!estadoTemTabelas&&estadoTemAlocacoes){
    alocacaoRows=estado.alocacoes.map((row)=>({...row}));
    aplicarAlocacoesDadosNaView(alocacaoRows);
    salvarTabelasEscalaDados();
  }
  if(cacheTabelasMaisNovo||(!estadoTemTabelas&&!estadoTemAlocacoes))carregarTabelasEscalaDados(true);
  const estadoTemResponsaveis=(estado?.origemArquivoUsuario||estado?.responsaveisVersao===2)&&listaResponsaveisTemNomes(estado.responsaveis);
  if(estadoTemResponsaveis){
    aplicarResponsaveisSalvos(estado.responsaveis||[]);
    salvarResponsaveisDados();
  }else{
    carregarResponsaveisDados();
  }
  window.atualizarTopoPlantao?.();
  _plantaoRespFallback=normResp(document.getElementById("topoPlantaoDia")?.textContent||window._nomePlantao||_plantaoRespFallback||"");
  removerResponsaveisAusentesPlantaoAtual();
  renderResponsaveisViews();
  renderResponsaveisPostos();
  if(!cacheTabelasMaisNovo&&(estadoTemTabelas||estadoTemAlocacoes))salvarTabelasEscalaDados();
  estadoPaginaRestaurouTabelas=estadoTemTabelas||estadoTemAlocacoes;
  if(cacheTabelasMaisNovo||(!estadoTemTabelas&&!estadoTemAlocacoes))carregarTabelasEscalaDados(true);
  atualizarDisponibilidadeColuna();
  return true;
};
let autosaveTimerPagina=null;
let restaurandoEstadoPagina=false;
let bloquearAutosaveAte=0;
const salvarUltimoGravadoValido=(estado)=>localStorage.setItem(STORAGE_ULTIMO_GRAVADO_KEY,JSON.stringify(estado));
const salvarLocalEmergencial=()=>{
  localStorage.removeItem(STORAGE_ESCALA_KEY);
  localStorage.removeItem(STORAGE_TABELAS_ESCALA_KEY);
};
const agendarAutosavePagina=()=>{
  clearTimeout(autosaveTimerPagina);
  autosaveTimerPagina=null;
};
const restaurarAutosavePagina=()=>{
  localStorage.removeItem(STORAGE_ESCALA_KEY);
  localStorage.removeItem(STORAGE_TABELAS_ESCALA_KEY);
};
const nomeDataArquivo=()=>document.getElementById("topoDatePicker")?.value||"";
const dataArquivoPt=()=>{
  const value=document.getElementById("topoDatePicker")?.value||"";
  if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
    const [ano,mes,dia]=value.split("-");
    return `${dia}-${mes}-${ano}`;
  }
  return value.replace(/[^\d-]/g,"");
};
const plantaoArquivo=()=>normResp(document.getElementById("topoPlantaoDia")?.textContent||"PLANTAO")||"PLANTAO";
const nomeBackupArquivo=()=>`escala-${dataArquivoPt()}-${plantaoArquivo()}.json`;
const ROTATIVA_DOC_ID="escala-rotativa";
const BACKUP_DOC_PREFIX="escala-";
const dataIsoValida=(value)=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||""))return false;
  const [ano,mes,dia]=value.split("-").map(Number);
  const data=new Date(ano,mes-1,dia);
  return data.getFullYear()===ano&&data.getMonth()===mes-1&&data.getDate()===dia;
};
const dataObjIso=(value)=>{
  if(!dataIsoValida(value))return null;
  const [ano,mes,dia]=value.split("-").map(Number);
  return new Date(ano,mes-1,dia);
};
const serialDataGestao=(data)=>{
  const excelBase=Date.UTC(1899,11,30);
  const utcDia=Date.UTC(data.getFullYear(),data.getMonth(),data.getDate());
  return Math.floor((utcDia-excelBase)/86400000);
};
const plantaoPorDataGestao=(dataIso)=>{
  const data=dataObjIso(dataIso);
  return data?["ALFA","BRAVO","CHARLIE","DELTA"][serialDataGestao(data)%4]:"";
};
const diaSemanaGestao=(dataIso)=>{
  const data=dataObjIso(dataIso);
  return data?["DOMINGO","SEGUNDA-FEIRA","TERCA-FEIRA","QUARTA-FEIRA","QUINTA-FEIRA","SEXTA-FEIRA","SABADO"][data.getDay()]:"";
};
const dataPtGestao=(dataIso)=>{
  if(!dataIsoValida(dataIso))return "";
  const [ano,mes,dia]=dataIso.split("-");
  return `${dia}-${mes}-${ano}`;
};
const backupDocIdGestao=(dataIso,plantao=plantaoPorDataGestao(dataIso))=>{
  const dataPt=dataPtGestao(dataIso);
  const nomePlantao=normResp(plantao);
  return dataPt&&nomePlantao?`${BACKUP_DOC_PREFIX}${dataPt}-${nomePlantao}`:"";
};
const legacyDocIdGestao=(dataIso,plantao=plantaoPorDataGestao(dataIso))=>{
  const dataPt=dataPtGestao(dataIso);
  const nomePlantao=normResp(plantao);
  return dataPt&&nomePlantao?`${dataPt}-${nomePlantao}`:"";
};
const setTopoGestao=(dataIso)=>{
  const dataEl=document.getElementById("topoDatePicker");
  const diaEl=document.getElementById("topoDiaSemana");
  const plantaoEl=document.getElementById("topoPlantaoDia");
  const plantao=plantaoPorDataGestao(dataIso);
  if(dataEl)dataEl.value=dataIso||"";
  if(diaEl)diaEl.textContent=diaSemanaGestao(dataIso);
  if(plantaoEl)plantaoEl.textContent=plantao;
  window._nomePlantao=plantao;
  _dataRespFallback=dataIso||"";
  _plantaoRespFallback=plantao;
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  renderResponsaveisViews();
  renderResponsaveisPostos();
  atualizarDisponibilidadeColuna();
  atualizarBotaoGravarGestao();
};
const validarDadosParaSalvar=()=>{
  if(!dataIsoValida(document.getElementById("topoDatePicker")?.value||"")){popMsg("Escolha uma data válida.");return false;}
  if(!normResp(document.getElementById("topoPlantaoDia")?.textContent)){popMsg("Plantão da navbar vazio. Escolha uma data válida.");return false;}
  return true;
};
const confirmarSubstituicaoArquivo=(onConfirm)=>{
  const pop=abrirPopArquivo(`<div class="s03-clear-title">CONFIRMAR</div><div class="s03-clear-msg">Confirma gravação? Os dados da tela sobrescreverão o registro deste plantão na nuvem.</div><div class="s03-clear-actions"><button class="s03-clear-confirm" type="button" data-act="confirmar">CONFIRMAR</button><button class="s03-clear-exit" type="button" data-act="sair">SAIR</button></div>`);
  pop.querySelector("[data-act='confirmar']").addEventListener("click",()=>{pop.remove();onConfirm();});
  pop.querySelector("[data-act='sair']").addEventListener("click",()=>pop.remove());
};
const baixarJson=(nome,estado)=>{
  const blob=new Blob([JSON.stringify(estado,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
const cloneGestao=(value)=>JSON.parse(JSON.stringify(value||{}));
const estadoParaRotativa=(estado)=>{
  const rotativa=cloneGestao(estado);
  rotativa.tipo="escala-rotativa";
  rotativa.salvoEm=new Date().toISOString();
  rotativa.tabelas=Object.fromEntries(S03_TABLE_IDS.map((id)=>[id,[]]));
  rotativa.alocacoes=[];
  rotativa.horarios={};
  rotativa.cadastroHorarios={seq:1,registros:[]};
  if(rotativa.topo){
    rotativa.topo={...rotativa.topo,data:"",plantao:""};
  }
  return rotativa;
};
const estadoEscalaTemDados=()=>{
  if(dataIsoValida(document.getElementById("topoDatePicker")?.value||""))return true;
  if(normResp(document.getElementById("topoPlantaoDia")?.textContent||""))return true;
  const tabelas=snapshotTabelasEscala();
  if(tabelasEscalaTemNomes(tabelas))return true;
  return alocacoesTemNomes(sincronizarAlocacoesDadosDoDom());
};
const atualizarBotaoGravarGestao=()=>{
  const btn=document.getElementById("btnGravarTop");
  if(!btn)return;
  const pode=dataIsoValida(document.getElementById("topoDatePicker")?.value||"")&&Boolean(normResp(document.getElementById("topoPlantaoDia")?.textContent||""));
  btn.disabled=!pode;
  btn.classList.toggle("is-disabled",!pode);
};
const carregarRotativaFirebase=async()=>{
  if(typeof window.FirebaseSync==="undefined")return null;
  const atual=await window.FirebaseSync.carregar(ROTATIVA_DOC_ID);
  if(atual?.payload)return atual.payload;
  const backups=await window.FirebaseSync.listarBackups?.();
  for(const item of backups||[]){
    const result=await window.FirebaseSync.carregar(item.id);
    if(result?.payload){
      const rotativa=estadoParaRotativa(result.payload);
      await window.FirebaseSync.salvar(rotativa,ROTATIVA_DOC_ID,{status:"aberto"});
      return rotativa;
    }
  }
  return null;
};
const aplicarBaseRotativaNaNovaEscala=async(dataIso)=>{
  bloquearAutosaveAte=Date.now()+2000;
  localStorage.removeItem(STORAGE_ESCALA_KEY);
  localStorage.removeItem(STORAGE_TABELAS_ESCALA_KEY);
  const rotativa=await carregarRotativaFirebase();
  if(rotativa){
    const estado=cloneGestao(rotativa);
    estado.topo={...(estado.topo||{}),data:dataIso,plantao:plantaoPorDataGestao(dataIso),forca:forcaAtivaEscala(),filtro:"presente"};
    estado.tabelas=Object.fromEntries(S03_TABLE_IDS.map((id)=>[id,[]]));
    estado.alocacoes=[];
    estado.horarios={};
    estado.cadastroHorarios={seq:1,registros:[]};
    restaurandoEstadoPagina=true;
    aplicarEstadoPagina(estado);
    restaurandoEstadoPagina=false;
  }else{
    limparPaginaNova();
  }
  setTopoGestao(dataIso);
  S03_TABLE_IDS.forEach((id)=>restaurarTabelaEscala(id,[]));
  alocacaoRows=[];
  window._alocacaoRows=alocacaoRows;
  aplicarHorariosAtuais();
  garantirHorariosVivencias();
  localStorage.removeItem(STORAGE_ESCALA_KEY);
  localStorage.removeItem(STORAGE_TABELAS_ESCALA_KEY);
};
const abrirPopArquivo=(html)=>{
  const overlay=document.createElement("div");
  overlay.className="s03-clear-popover is-open file-popover";
  overlay.setAttribute("aria-hidden","false");
  overlay.innerHTML=`<div class="s03-clear-box">${html}</div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click",(event)=>{if(event.target===overlay)overlay.remove();});
  return overlay;
};
const FS_DB_NAME="escalaAgentFileHandles";
const FS_STORE_NAME="handles";
const FS_ROTATIVO_KEY="arquivoRotativo";
const FS_DADOS_DIR_KEY="pastaDados";
let arquivoRotativoHandle=null;
let pastaDadosHandle=null;
const suportaFileSystemAccess=()=>typeof window.showSaveFilePicker==="function"&&typeof window.indexedDB==="object";
const abrirDbArquivos=()=>new Promise((resolve,reject)=>{
  const req=indexedDB.open(FS_DB_NAME,1);
  req.onupgradeneeded=()=>req.result.createObjectStore(FS_STORE_NAME);
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error);
});
const dbGet=(key)=>abrirDbArquivos().then((db)=>new Promise((resolve,reject)=>{
  const tx=db.transaction(FS_STORE_NAME,"readonly");
  const req=tx.objectStore(FS_STORE_NAME).get(key);
  req.onsuccess=()=>resolve(req.result||null);
  req.onerror=()=>reject(req.error);
}));
const dbSet=(key,value)=>abrirDbArquivos().then((db)=>new Promise((resolve,reject)=>{
  const tx=db.transaction(FS_STORE_NAME,"readwrite");
  tx.objectStore(FS_STORE_NAME).put(value,key);
  tx.oncomplete=()=>resolve(true);
  tx.onerror=()=>reject(tx.error);
}));
const dbDel=(key)=>abrirDbArquivos().then((db)=>new Promise((resolve,reject)=>{
  const tx=db.transaction(FS_STORE_NAME,"readwrite");
  tx.objectStore(FS_STORE_NAME).delete(key);
  tx.oncomplete=()=>resolve(true);
  tx.onerror=()=>reject(tx.error);
}));
const permissaoArquivo=(handle)=>handle.queryPermission({mode:"readwrite"}).then((status)=>{
  if(status==="granted")return true;
  return handle.requestPermission({mode:"readwrite"}).then((novo)=>novo==="granted");
});
const escreverJsonHandle=async(handle,estado)=>{
  const writable=await handle.createWritable();
  await writable.write(JSON.stringify(estado,null,2));
  await writable.close();
};
const permissaoDiretorio=(handle)=>handle.queryPermission({mode:"readwrite"}).then((status)=>{
  if(status==="granted")return true;
  return handle.requestPermission({mode:"readwrite"}).then((novo)=>novo==="granted");
});
const obterPastaDados=async({solicitar=false}={})=>{
  if(!suportaFileSystemAccess()||typeof window.showDirectoryPicker!=="function")return null;
  if(!pastaDadosHandle)pastaDadosHandle=await dbGet(FS_DADOS_DIR_KEY).catch(()=>null);
  if(pastaDadosHandle){
    try{
      if(await permissaoDiretorio(pastaDadosHandle))return pastaDadosHandle;
    }catch(err){
      pastaDadosHandle=null;
      await dbDel(FS_DADOS_DIR_KEY).catch(()=>{});
    }
  }
  if(!solicitar)return null;
  const handle=await window.showDirectoryPicker({mode:"readwrite"});
  pastaDadosHandle=handle;
  await dbSet(FS_DADOS_DIR_KEY,handle).catch(()=>{});
  return handle;
};
const obterHandleRotativo=async()=>{
  if(!suportaFileSystemAccess())return null;
  if(!arquivoRotativoHandle)arquivoRotativoHandle=await dbGet(FS_ROTATIVO_KEY).catch(()=>null);
  if(arquivoRotativoHandle){
    try{
      if(await permissaoArquivo(arquivoRotativoHandle))return arquivoRotativoHandle;
    }catch(err){
      arquivoRotativoHandle=null;
      await dbDel(FS_ROTATIVO_KEY).catch(()=>{});
    }
  }
  const pastaDados=await obterPastaDados({solicitar:true}).catch((err)=>{if(err?.name==="AbortError")throw err;return null;});
  const options={
    suggestedName:"escala_atual.json",
    types:[{description:"Arquivo JSON",accept:{"application/json":[".json"]}}]
  };
  if(pastaDados)options.startIn=pastaDados;
  const handle=await window.showSaveFilePicker(options);
  arquivoRotativoHandle=handle;
  await dbSet(FS_ROTATIVO_KEY,handle).catch(()=>{});
  return handle;
};
const limparResumoSecao2=()=>{
  document.querySelectorAll(".force-summary").forEach((summary)=>{
    const day=summary.querySelector(".stat-day");
    const night=summary.querySelector(".stat-night");
    if(day)day.textContent="☀ 00";
    if(night)night.textContent="☾ 00";
    summary.querySelectorAll(".stat-aus,.stat-perm,.stat-extra").forEach((el)=>{el.textContent="00";});
  });
};
const limparPaginaNova=()=>{
  bloquearAutosaveAte=Date.now()+1500;
  clearTimeout(autosaveTimerPagina);
  estadoPaginaRestaurouTabelas=false;
  localStorage.removeItem(STORAGE_ESCALA_KEY);
  localStorage.removeItem(STORAGE_TABELAS_ESCALA_KEY);
  limparEstadoColunaEscala();
  setModoAlocar(false);
  document.getElementById("topoDatePicker").value="";
  document.getElementById("topoDiaSemana").textContent="";
  document.getElementById("topoPlantaoDia").textContent="";
  _dataRespFallback="";
  _plantaoRespFallback="";
  limparResumoSecao2();
  S03_TABLE_IDS.forEach((id)=>restaurarTabelaEscala(id,[]));
  limparResponsaveisViews();
  if(typeof window.renderEfetivo==="function")window.renderEfetivo();
  atualizarDisponibilidadeColuna();
  atualizarBotaoGravarGestao();
};
const abrirPopoverNovaEscala=()=>{
  const pop=abrirPopArquivo(`<div class="s03-clear-title">INICIAR UMA NOVA ESCALA</div><div class="s03-clear-msg">Escolha uma data.</div><div class="s03-clear-actions" style="flex-direction:column;align-items:center;gap:8px"><input id="novaEscalaDataInput" type="date" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:4px;font-size:13px"><div id="novaEscalaPreview" style="min-height:18px;font-size:12px;font-weight:700;color:#1e3a5f"></div><div style="display:flex;gap:8px"><button class="s03-clear-confirm" type="button" data-act="confirmar">CONFIRMAR</button><button class="s03-clear-exit" type="button" data-act="cancelar">CANCELAR</button></div></div>`);
  const input=pop.querySelector("#novaEscalaDataInput");
  const preview=pop.querySelector("#novaEscalaPreview");
  const atualizarPreview=()=>{
    const dataIso=input.value;
    preview.textContent=dataIsoValida(dataIso)?`${diaSemanaGestao(dataIso)} - ${plantaoPorDataGestao(dataIso)}`:"";
    input.style.borderColor=dataIso&&dataIsoValida(dataIso)?"#cbd5e1":input.style.borderColor;
  };
  const confirmar=async()=>{
    const dataIso=input.value;
    if(!dataIsoValida(dataIso)){input.style.borderColor="#dc2626";popMsg("Escolha uma data válida");return;}
    const plantao=plantaoPorDataGestao(dataIso);
    const docId=backupDocIdGestao(dataIso,plantao);
    const legacyId=legacyDocIdGestao(dataIso,plantao);
    const jaExiste=await window.FirebaseSync?.existe?.(docId)||await window.FirebaseSync?.existe?.(legacyId);
    if(jaExiste){popMsg("Já existe uma escala com essa data, escolha uma outra.");return;}
    pop.remove();
    await aplicarBaseRotativaNaNovaEscala(dataIso);
    popMsg("Nova escala iniciada.");
  };
  input.addEventListener("input",atualizarPreview);
  input.addEventListener("keydown",(event)=>{if(event.key==="Enter")confirmar();});
  pop.querySelector("[data-act='confirmar']").addEventListener("click",confirmar);
  pop.querySelector("[data-act='cancelar']").addEventListener("click",()=>pop.remove());
  input.focus();
};
const confirmarNovoPagina=()=>{
  if(!estadoEscalaTemDados()){abrirPopoverNovaEscala();return;}
  const pop=abrirPopArquivo(`<div class="s03-clear-title">NOVO</div><div class="s03-clear-msg">Todos os dados na tela serão limpos, deseja prosseguir?</div><div class="s03-clear-actions"><button class="s03-clear-confirm" type="button" data-act="sim">SIM</button><button class="s03-clear-exit" type="button" data-act="nao">NÃO</button></div>`);
  pop.querySelector("[data-act='sim']").addEventListener("click",()=>{pop.remove();abrirPopoverNovaEscala();});
  pop.querySelector("[data-act='nao']").addEventListener("click",()=>pop.remove());
};
const executarGravarPagina=async()=>{
  const estado=coletarEstadoPagina();
    localStorage.removeItem(STORAGE_ESCALA_KEY);
  salvarUltimoGravadoValido(estado);
  if(typeof window.FirebaseSync==="undefined"){
    popMsg("Firebase indisponível. Dados salvos localmente.");
    return;
  }
  const dataIso=estado?.topo?.data||"";
  const plantao=estado?.topo?.plantao||"";
  const backupId=backupDocIdGestao(dataIso,plantao);
  if(!backupId){popMsg("Não foi possível gerar o ID do backup. Verifique a data e o plantão.");return;}
  const status=window.FirebaseSync.calcularStatus(dataIso);
  if(status==="fechado"&&!window._modoEdicaoForcado){
    popMsg("Escala vencida. Use EDITAR e informe a credencial para alterar apenas o backup.");
    return;
  }
  const backupResult=await window.FirebaseSync.salvar(estado,backupId,{status});
  if(!backupResult.ok){
    popMsg("Falha ao gravar backup na nuvem. Dados salvos localmente como emergência.");
    return;
  }
  if(status==="fechado"&&window._modoEdicaoForcado){
    popMsg(`Backup vencido gravado sem alterar a rotativa. [${backupId}]`);
    return;
  }
  const rotativa=estadoParaRotativa(estado);
  const rotativaResult=await window.FirebaseSync.salvar(rotativa,ROTATIVA_DOC_ID,{status:"aberto"});
  if(rotativaResult.ok){
    popMsg(`Escala gravada: rotativa atualizada e backup criado. [${backupId}]`);
  }else{
    popMsg(`Backup gravado, mas a rotativa não foi atualizada. [${backupId}]`);
  }
};
const gravarPagina=()=>{
  if(!validarDadosParaSalvar())return;
  confirmarSubstituicaoArquivo(()=>executarGravarPagina());
};
const executarBackupPagina=async()=>{
  const estado=coletarEstadoPagina();
  if(typeof window.FirebaseSync==="undefined"){popMsg("Firebase indisponível.");return;}
  const dataIso=estado?.topo?.data||"";
  const plantao=estado?.topo?.plantao||"";
  const docId=backupDocIdGestao(dataIso,plantao);
  if(!docId){popMsg("Não foi possível gerar o ID do backup. Verifique a data e o plantão.");return;}
  const result=await window.FirebaseSync.salvar(estado,docId);
  if(result.ok) popMsg(`Backup gravado na nuvem: [${docId}]`);
  else popMsg("Falha ao gravar backup na nuvem.");
};
const backupPagina=()=>{
  if(!validarDadosParaSalvar())return;
  executarBackupPagina();
};

// ─── EXPORTAR (download JSON local) ─────────────────────────────────────────
const exportarPagina=()=>{
  if(!validarDadosParaSalvar())return;
  const estado=coletarEstadoPagina();
  const dataIso=estado?.topo?.data||"";
  const plantao=estado?.topo?.plantao||"PLANTAO";
  const docId=window.FirebaseSync?.gerarDocId(dataIso,plantao)||nomeBackupArquivo();
  baixarJson(`${docId}.json`,estado);
  popMsg("Arquivo exportado para o seu computador.");
};

// ─── IMPORTAR (ler JSON local) ────────────────────────────────────────────────
const importarPagina=()=>{
  const pop=abrirPopArquivo(`<div class="s03-clear-title">IMPORTAR</div><div class="s03-clear-msg">Selecione um arquivo .json exportado anteriormente.</div><div class="s03-clear-actions"><button class="s03-clear-confirm" type="button" data-act="selecionar">SELECIONAR ARQUIVO</button><button class="s03-clear-exit" type="button" data-act="sair">SAIR</button></div><input id="importarJsonInput" type="file" accept="application/json,.json" hidden>`);
  const input=pop.querySelector("#importarJsonInput");
  pop.querySelector("[data-act='selecionar']").addEventListener("click",()=>input.click());
  input.addEventListener("change",()=>abrirBackupArquivo(input.files?.[0],pop));
  pop.querySelector("[data-act='sair']").addEventListener("click",()=>pop.remove());
};

// ─── VERIFICAR STATUS DO PLANTÃO ATUAL ───────────────────────────────────────
const plantaoEstaAberto=()=>{
  const dataIso=document.getElementById("topoDatePicker")?.value||"";
  if(!dataIso)return true;
  if(typeof window.FirebaseSync==="undefined")return true;
  return window.FirebaseSync.calcularStatus(dataIso)==="aberto";
};

// ─── EDITAR (plantão fechado com credencial) ──────────────────────────────────
const CREDENCIAL_EDICAO="2009";
const editarPagina=()=>{
  if(plantaoEstaAberto()){popMsg("Este plantão ainda está aberto para edição normal.");return;}
  const pop=abrirPopArquivo(`<div class="s03-clear-title">EDITAR PLANTÃO FECHADO</div><div class="s03-clear-msg">Este plantão está fechado. Informe a credencial para habilitar a edição.</div><div class="s03-clear-actions" style="flex-direction:column;align-items:center;gap:8px"><input id="credencialInput" type="password" placeholder="Credencial" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:4px;font-size:13px;width:140px;text-align:center"><div style="display:flex;gap:8px"><button class="s03-clear-confirm" type="button" data-act="confirmar">CONFIRMAR</button><button class="s03-clear-exit" type="button" data-act="sair">SAIR</button></div></div>`);
  const input=pop.querySelector("#credencialInput");
  input.focus();
  const tentar=()=>{
    if(input.value===CREDENCIAL_EDICAO){
      pop.remove();
      window._modoEdicaoForcado=true;
      popMsg("Modo de edição habilitado. Lembre de GRAVAR ao finalizar.");
    }else{
      input.value="";
      input.placeholder="Credencial incorreta";
      input.style.borderColor="#dc2626";
    }
  };
  pop.querySelector("[data-act='confirmar']").addEventListener("click",tentar);
  input.addEventListener("keydown",(e)=>{if(e.key==="Enter")tentar();});
  pop.querySelector("[data-act='sair']").addEventListener("click",()=>pop.remove());
};

// ─── DUPLICAR ────────────────────────────────────────────────────────────────
const duplicarPagina=()=>{
  if(typeof window.FirebaseSync==="undefined"){popMsg("Firebase não disponível.");return;}
  const pop=abrirPopArquivo(`<div class="s03-clear-title">DUPLICAR PLANTÃO</div><div class="s03-clear-msg">Escolha uma escala existente e informe a nova data.</div><div class="s03-clear-actions" style="flex-direction:column;align-items:center;gap:8px;width:min(420px,90vw)"><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><input id="dupFiltroAno" type="number" min="2000" max="2100" placeholder="Ano" style="width:72px;padding:6px;border:1px solid #cbd5e1;border-radius:4px"><select id="dupFiltroMes" style="padding:6px;border:1px solid #cbd5e1;border-radius:4px"><option value="">Mês</option>${Array.from({length:12},(_,i)=>`<option value="${String(i+1).padStart(2,"0")}">${String(i+1).padStart(2,"0")}</option>`).join("")}</select><select id="dupFiltroPlantao" style="padding:6px;border:1px solid #cbd5e1;border-radius:4px"><option value="">Plantão</option><option>ALFA</option><option>BRAVO</option><option>CHARLIE</option><option>DELTA</option></select></div><select id="duplicarOrigemSelect" style="width:100%;padding:6px;border:1px solid #cbd5e1;border-radius:4px"><option value="">Carregando escalas...</option></select><div id="duplicarOrigemInfo" style="min-height:18px;font-size:12px;font-weight:700;color:#1e3a5f"></div><input id="duplicarDataInput" type="date" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:4px;font-size:13px"><div id="duplicarNovaInfo" style="min-height:18px;font-size:12px;font-weight:700;color:#1e3a5f"></div><div style="display:flex;gap:8px"><button class="s03-clear-confirm" type="button" data-act="confirmar">DUPLICAR</button><button class="s03-clear-exit" type="button" data-act="sair">SAIR</button></div></div>`);
  const selectOrigem=pop.querySelector("#duplicarOrigemSelect");
  const inputData=pop.querySelector("#duplicarDataInput");
  const origemInfo=pop.querySelector("#duplicarOrigemInfo");
  const novaInfo=pop.querySelector("#duplicarNovaInfo");
  const filtros={
    ano:pop.querySelector("#dupFiltroAno"),
    mes:pop.querySelector("#dupFiltroMes"),
    plantao:pop.querySelector("#dupFiltroPlantao")
  };
  const parseBackupId=(id)=>{
    const match=String(id||"").match(/^(?:escala-)?(\d{2})-(\d{2})-(\d{4})-([A-Z]+)$/i);
    if(!match)return null;
    const [,dia,mes,ano,plantao]=match;
    const dataIso=`${ano}-${mes}-${dia}`;
    return {id,dataIso,plantao:normResp(plantao),label:`${dia}/${mes}/${ano} - ${normResp(plantao)}`};
  };
  let itens=[];
  const carregarLista=async()=>{
    selectOrigem.innerHTML=`<option value="">Carregando escalas...</option>`;
    const lista=await window.FirebaseSync.listarBackups?.({
      ano:filtros.ano.value,
      mes:filtros.mes.value,
      plantao:filtros.plantao.value
    })||[];
    itens=lista.map((item)=>parseBackupId(item.id)).filter(Boolean);
    selectOrigem.innerHTML=`<option value="">Escolha a escala origem</option>${itens.map((item)=>`<option value="${cfgEsc(item.id)}">${cfgEsc(item.label)}</option>`).join("")}`;
    if(!itens.length)selectOrigem.innerHTML=`<option value="">Nenhuma escala encontrada</option>`;
    atualizarInfos();
  };
  const origemSelecionada=()=>itens.find((item)=>item.id===selectOrigem.value)||null;
  const atualizarInfos=()=>{
    const origem=origemSelecionada();
    origemInfo.textContent=origem?`${diaSemanaGestao(origem.dataIso)} - ${origem.plantao}`:"";
    const novaData=inputData.value;
    novaInfo.textContent=dataIsoValida(novaData)?`${diaSemanaGestao(novaData)} - ${plantaoPorDataGestao(novaData)}`:"";
  };
  const executar=async()=>{
    const origem=origemSelecionada();
    if(!origem){popMsg("Escolha uma escala existente.");return;}
    const novaData=inputData.value;
    if(!dataIsoValida(novaData)){inputData.style.borderColor="#dc2626";popMsg("Escolha uma data válida");return;}
    const novoPlantao=plantaoPorDataGestao(novaData);
    if(novoPlantao!==origem.plantao){popMsg("O nome do plantão da nova data é diferente do plantão original.");return;}
    const novoId=backupDocIdGestao(novaData,novoPlantao);
    const legacyId=legacyDocIdGestao(novaData,novoPlantao);
    const jaExiste=await window.FirebaseSync.existe(novoId)||await window.FirebaseSync.existe(legacyId);
    if(jaExiste){popMsg("Já existe uma escala com essa data, escolha uma outra.");return;}
    const resultOrigem=await window.FirebaseSync.carregar(origem.id);
    if(!resultOrigem?.payload){popMsg("Não foi possível carregar a escala origem.");return;}
    const novoEstado=cloneGestao(resultOrigem.payload);
    novoEstado.topo={...(novoEstado.topo||{}),data:novaData,plantao:novoPlantao};
    novoEstado.salvoEm=new Date().toISOString();
    pop.remove();
    restaurandoEstadoPagina=true;
    aplicarEstadoPagina(novoEstado);
    restaurandoEstadoPagina=false;
    setTopoGestao(novaData);
    localStorage.removeItem(STORAGE_ESCALA_KEY);
    popMsg("Escala duplicada na tela. Confira os dados e clique em GRAVAR.");
  };
  Object.values(filtros).forEach((el)=>el.addEventListener("change",carregarLista));
  filtros.ano.addEventListener("input",()=>{clearTimeout(filtros.ano._timer);filtros.ano._timer=setTimeout(carregarLista,300);});
  selectOrigem.addEventListener("change",atualizarInfos);
  inputData.addEventListener("input",atualizarInfos);
  pop.querySelector("[data-act='confirmar']").addEventListener("click",executar);
  inputData.addEventListener("keydown",(e)=>{if(e.key==="Enter")executar();});
  pop.querySelector("[data-act='sair']").addEventListener("click",()=>pop.remove());
  carregarLista();
};

// ─── EXCLUIR ─────────────────────────────────────────────────────────────────
const excluirPagina=()=>{
  const dataIso=document.getElementById("topoDatePicker")?.value||"";
  const plantao=normResp(document.getElementById("topoPlantaoDia")?.textContent||"");
  const docId=window.FirebaseSync?.gerarDocId(dataIso,plantao);
  if(!docId){popMsg("Selecione um plantão válido antes de excluir.");return;}
  const pop=abrirPopArquivo(`<div class="s03-clear-title">EXCLUIR PLANTÃO</div><div class="s03-clear-msg">Excluir <strong>${docId}</strong>? O registro será marcado como inativo.<br>Informe a credencial para confirmar.</div><div class="s03-clear-actions" style="flex-direction:column;align-items:center;gap:8px"><input id="excluirCredInput" type="password" placeholder="Credencial" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:4px;font-size:13px;width:140px;text-align:center"><div style="display:flex;gap:8px"><button class="s03-clear-confirm" type="button" data-act="confirmar">EXCLUIR</button><button class="s03-clear-exit" type="button" data-act="sair">SAIR</button></div></div>`);
  const input=pop.querySelector("#excluirCredInput");
  input.focus();
  const executar=async()=>{
    if(input.value!==CREDENCIAL_EDICAO){
      input.value="";input.placeholder="Credencial incorreta";input.style.borderColor="#dc2626";return;
    }
    pop.remove();
    const ok=await window.FirebaseSync?.marcarInativo(docId);
    if(ok) popMsg(`Plantão [${docId}] marcado como inativo.`);
    else popMsg("Falha ao excluir. Verifique a conexão.");
  };
  pop.querySelector("[data-act='confirmar']").addEventListener("click",executar);
  input.addEventListener("keydown",(e)=>{if(e.key==="Enter")executar();});
  pop.querySelector("[data-act='sair']").addEventListener("click",()=>pop.remove());
};
const aplicarEstadoAberto=(estado,pop,origem="arquivo")=>{
  try{
    if(!estado||typeof estado!=="object")throw new Error("arquivo sem dados de escala");
    pop?.remove();
    estado.origemArquivoUsuario=true;
    restaurandoEstadoPagina=true;
    const ok=aplicarEstadoPagina(estado);
    if(!ok)throw new Error("estado nao aplicado");
    restaurandoEstadoPagina=false;
    const estadoAplicado=coletarEstadoPagina();
    localStorage.removeItem(STORAGE_ESCALA_KEY);
    salvarUltimoGravadoValido(estadoAplicado);
    salvarTabelasEscalaDados();
    popMsg(`${origem} aberto com sucesso.`);
    return true;
  }catch(err){
    restaurandoEstadoPagina=false;
    console.warn("Falha ao abrir escala",err);
    popMsg(`Não foi possível abrir: ${err?.message||"erro desconhecido"}`);
    return false;
  }
};
const abrirBackupArquivo=(file,pop)=>{
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const estado=JSON.parse(String(reader.result||""));
      aplicarEstadoAberto(estado,pop,"Backup");
    }catch(err){
      console.warn("Backup inválido",err);
      popMsg(`Backup inválido: ${err?.message||"JSON inválido"}`);
    }
  };
  reader.onerror=()=>{
    console.warn("Falha ao ler backup",reader.error);
    popMsg("Não foi possível ler o arquivo selecionado.");
  };
  reader.readAsText(file);
};
const abrirUltimoGravado=async(pop,inputFallback)=>{
  if(suportaFileSystemAccess()){
    try{
      const handle=arquivoRotativoHandle||await dbGet(FS_ROTATIVO_KEY).catch(()=>null);
      if(handle){
        arquivoRotativoHandle=handle;
        const file=await handle.getFile();
        const estado=JSON.parse(await file.text());
        aplicarEstadoAberto(estado,pop,"Último gravado");
        return;
      }
      if(typeof window.showOpenFilePicker==="function"){
        const [novoHandle]=await window.showOpenFilePicker({
          types:[{description:"Arquivo JSON",accept:{"application/json":[".json"]}}],
          multiple:false
        });
        if(novoHandle){
          arquivoRotativoHandle=novoHandle;
          await dbSet(FS_ROTATIVO_KEY,novoHandle).catch(()=>{});
          const file=await novoHandle.getFile();
          const estado=JSON.parse(await file.text());
          aplicarEstadoAberto(estado,pop,"Último gravado");
          return;
        }
      }
    }catch(err){
      if(err?.name==="AbortError")return;
      console.warn("Falha ao abrir arquivo rotativo",err);
      arquivoRotativoHandle=null;
      await dbDel(FS_ROTATIVO_KEY).catch(()=>{});
      popMsg("Não foi possível acessar o arquivo principal. Use BACKUP ou grave novamente para escolher outro arquivo.");
      return;
    }
  }
  const raw=localStorage.getItem(STORAGE_ULTIMO_GRAVADO_KEY);
  if(raw){
    aplicarEstadoAberto(JSON.parse(raw),pop,"Último gravado");
    return;
  }
  popMsg("Escolha o arquivo principal uma vez para registrar o último gravado.");
  inputFallback?.click();
};
const abrirDaNuvem=async(pop)=>{
  if(typeof window.FirebaseSync==="undefined"){popMsg("Firebase não disponível.");return;}
  pop?.remove();
  // Tenta carregar pelo ID da data atual da navbar
  const dataIso=document.getElementById("topoDatePicker")?.value||"";
  const plantao=normResp(document.getElementById("topoPlantaoDia")?.textContent||"");
  const docId=dataIso&&plantao?window.FirebaseSync.gerarDocId(dataIso,plantao):null;
  if(!docId){
    popMsg("Selecione uma data e plantão na navbar para carregar da nuvem.");
    return;
  }
  const result=await window.FirebaseSync.carregar(docId);
  if(!result){popMsg(`Nenhum registro encontrado para [${docId}].`);return;}
  aplicarEstadoAberto(result.payload,null,`Nuvem [${docId}]`);
};
const abrirPagina=()=>{
  const pop=abrirPopArquivo(`<div class="s03-clear-title">ABRIR</div><div class="s03-clear-msg">Escolha a origem dos dados.</div><div class="s03-clear-actions"><button class="s03-clear-confirm" type="button" data-act="nuvem">☁ NUVEM</button><button class="s03-clear-confirm" type="button" data-act="ultimo">ÚLTIMO LOCAL</button><button class="s03-clear-exit" type="button" data-act="importar">IMPORTAR</button><button class="s03-clear-exit" type="button" data-act="sair">SAIR</button></div><input id="arquivoBackupJson" type="file" accept="application/json,.json" hidden>`);
  const input=pop.querySelector("#arquivoBackupJson");
  pop.querySelector("[data-act='nuvem']").addEventListener("click",()=>abrirDaNuvem(pop));
  pop.querySelector("[data-act='ultimo']").addEventListener("click",()=>abrirUltimoGravado(pop,input));
  pop.querySelector("[data-act='importar']").addEventListener("click",()=>input.click());
  input.addEventListener("change",()=>abrirBackupArquivo(input.files?.[0],pop));
  pop.querySelector("[data-act='sair']").addEventListener("click",()=>pop.remove());
};
const inicializarGestaoPagina=()=>{
  limparPaginaNova();
  setTimeout(async()=>{
    const rotativa=await carregarRotativaFirebase();
    if(rotativa?.servidores&&typeof window.importCadastroServidores==="function"){
      window.importCadastroServidores(rotativa.servidores);
    }
    if(Array.isArray(rotativa?.configPostos)){
      rotativa.configPostos.forEach((saved)=>{
        const row=postoRows.find((item)=>item[0]===saved[0]);
        if(row)saved.forEach((value,index)=>{row[index]=value;});
      });
      renderConfigPostos();
    }
    if(rotativa?.responsaveisVersao===2&&listaResponsaveisTemNomes(rotativa.responsaveis)){
      aplicarResponsaveisSalvos(rotativa.responsaveis||[]);
      salvarResponsaveisDados();
    }
    limparPaginaNova();
    atualizarBotaoGravarGestao();
  },500);
};
window.renderResponsaveisPostos=renderResponsaveisPostos;
window.renderResponsaveisViews=renderResponsaveisViews;
window.validarResponsaveisAusentesPlantaoAtual=validarResponsaveisAusentesPlantaoAtual;
window.carregarTabelasEscalaDados=carregarTabelasEscalaDados;
window.getAlocacoesEscalaRows=()=>alocacaoRows.map((row)=>({...row}));
window.s03EstadoAlocarEfetivo=estadoAlocarEfetivo;
const abrirResponsaveisPosto=()=>{
  if(respFiltroForca)respFiltroForca.value="PPF";
  const plantaoNavbar=normResp(document.getElementById("topoPlantaoDia")?.textContent);
  if(respFiltroPlantao)respFiltroPlantao.value=plantoesResp.includes(plantaoNavbar)?plantaoNavbar:"TODOS";
  popoverResponsaveisPosto?.classList.add("is-open");popoverResponsaveisPosto?.setAttribute("aria-hidden","false");
  try{
    renderResponsaveisPostos();
  }catch(err){
    console.error("Falha ao renderizar responsaveis de posto",err);
  }
};
const fecharResponsaveisPosto=()=>{popoverResponsaveisPosto?.classList.remove("is-open");popoverResponsaveisPosto?.setAttribute("aria-hidden","true");};
document.addEventListener("click",(event)=>{
  if(event.target.closest(".resp-title-action"))abrirResponsaveisPosto();
});
popoverResponsaveisPosto?.querySelector(".resp-pop-sair")?.addEventListener("click",fecharResponsaveisPosto);
popoverResponsaveisPosto?.addEventListener("click",(event)=>{if(event.target===popoverResponsaveisPosto)fecharResponsaveisPosto();});
respFiltroForca?.addEventListener("change",renderResponsaveisPostos);
respFiltroPlantao?.addEventListener("change",renderResponsaveisPostos);
respBusca?.addEventListener("input",renderResponsaveisPostos);
popoverResponsaveisPosto?.querySelector(".resp-pop-limpar")?.addEventListener("click",()=>{if(respFiltroForca)respFiltroForca.value="PPF";if(respFiltroPlantao)respFiltroPlantao.value="TODOS";if(respBusca)respBusca.value="";renderResponsaveisPostos();});
document.getElementById("eftCanonicoBody")?.addEventListener("dragstart",(event)=>{
  const tr=event.target.closest("tr");
  if(!tr||normResp(tr.dataset.sit)!=="PRES"){event.preventDefault();return;}
  const nome=txtResp(tr.dataset.nome||tr.children[2]?.textContent);
  const forca=normResp(tr.dataset.forca);
  try{
    event.dataTransfer.setData("text/plain",nome);
    event.dataTransfer.setData("application/x-forca",forca);
  }catch(err){}
  event.dataTransfer.effectAllowed="copy";
  dragAtualEscala={nome,forca};
  const ghost=document.createElement("div");
  ghost.className="drag-nome-ghost";
  ghost.textContent=nome;
  document.body.appendChild(ghost);
  event.dataTransfer.setDragImage(ghost,10,10);
  setTimeout(()=>ghost.remove(),0);
});
document.getElementById("eftCanonicoBody")?.addEventListener("dragend",()=>{dragAtualEscala=null;});
document.getElementById("eftCanonicoBody")?.addEventListener("click",(event)=>{
  if(!modoAlocarAtivo||!selecaoAlocar)return;
  const tr=event.target.closest("tr");
  if(!tr)return;
  if(normResp(tr.dataset.sit)!=="PRES")return;
  if(event.target.closest(".sit-btn"))return;
  event.preventDefault();
  event.stopPropagation();
  aplicarAlocarNome(txtResp(tr.dataset.nome||tr.children[2]?.textContent),normResp(tr.dataset.forca));
},true);
document.addEventListener("click",(event)=>{
  selecionarPostoAlocarEvento(event);
},true);
document.addEventListener("click",(event)=>{
  if(!modoAlocarAtivo||!selecaoAlocar)return;
  const tr=event.target.closest?.("#eftCanonicoBody tr");
  if(!tr||event.target.closest(".sit-btn"))return;
  if(normResp(tr.dataset.sit)!=="PRES")return;
  event.preventDefault();
  event.stopPropagation();
  aplicarAlocarNome(txtResp(tr.dataset.nome||tr.children[2]?.textContent),normResp(tr.dataset.forca));
},true);
document.addEventListener("click",(event)=>{
  if(!acaoCelulaEscala)return;
  if(event.target.closest?.(".s03-table"))return;
  if(event.target.closest?.("[data-s03-cell-action]"))return;
  limparAcaoCelulaEscala();
},true);
document.addEventListener("dragend",()=>{if(tdAvisoForca)limparAvisoForcaRestrita(tdAvisoForca);});
document.getElementById("topoDatePicker")?.addEventListener("focus",(event)=>event.target.blur());
document.getElementById("topoDatePicker")?.addEventListener("click",(event)=>event.preventDefault());
document.getElementById("topoDatePicker")?.addEventListener("change",()=>{validarResponsaveisAusentesPlantaoAtual();renderResponsaveisViews();renderResponsaveisPostos();atualizarBotaoGravarGestao();});
document.getElementById("topoDatePicker")?.addEventListener("input",()=>{renderResponsaveisViews();atualizarBotaoGravarGestao();});
document.addEventListener("pointermove",atualizarPonteiroAcaoEscala);
document.addEventListener("pointermove",atualizarPonteiroColunaEscala);
document.addEventListener("pointerup",finalizarPonteiroAcaoEscala);
document.addEventListener("pointerup",finalizarPonteiroColunaEscala);
document.addEventListener("pointercancel",finalizarPonteiroAcaoEscala);
document.addEventListener("pointercancel",finalizarPonteiroColunaEscala);
document.addEventListener("dragover",setDropOkDocumento,true);
document.addEventListener("drop",aplicarDropEscalaDocumento,true);
const acionarFerramentaEscala=(btn,event)=>{
  if(!btn||btn.disabled)return;
  event?.preventDefault?.();
  const tool=btn.dataset.s03Tool;
  if(tool==="alocar")setModoAlocar(!modoAlocarAtivo);
  else if(tool==="lista")setModoDropdownEscala(!modoDropdownEscala);
  else setModoColunaEscala(tool);
};
document.querySelectorAll(".s03-tool-edicao [data-s03-tool]").forEach((btn)=>btn.addEventListener("click",(event)=>acionarFerramentaEscala(btn,event)));
document.getElementById("btnNovoTop")?.addEventListener("click",confirmarNovoPagina);
document.getElementById("btnGravarTop")?.addEventListener("click",gravarPagina);
document.getElementById("btnBackupTop")?.addEventListener("click",backupPagina);
document.getElementById("btnAbrirTop")?.addEventListener("click",abrirPagina);
document.getElementById("btnExportarTop")?.addEventListener("click",exportarPagina);
document.getElementById("btnImportarTop")?.addEventListener("click",importarPagina);
document.getElementById("btnEditarTop")?.addEventListener("click",editarPagina);
document.getElementById("btnDuplicarTop")?.addEventListener("click",duplicarPagina);
document.getElementById("btnExcluirTop")?.addEventListener("click",excluirPagina);
["change","input","click","drop"].forEach((eventName)=>document.addEventListener(eventName,agendarAutosavePagina,true));
window.addEventListener("beforeunload",salvarLocalEmergencial);
inicializarGestaoPagina();
document.querySelectorAll(".s03-banner-x").forEach((btn)=>btn.addEventListener("click",()=>{
  abrirPopoverLimparTabela(btn.closest(".s03-card")?.querySelector(".s03-table"));
}));
document.getElementById("btnS03LimparConfirmar")?.addEventListener("click",()=>fecharPopoverLimparTabela(true));
document.getElementById("btnS03LimparSair")?.addEventListener("click",()=>fecharPopoverLimparTabela(false));
document.getElementById("popoverS03LimparTabela")?.addEventListener("click",(event)=>{
  if(event.target===event.currentTarget)fecharPopoverLimparTabela(false);
});
document.addEventListener("keydown",(event)=>{
  if(event.key!=="Escape")return;
  if(modoAlocarAtivo)setModoAlocar(false);
  if(modoDropdownEscala)setModoDropdownEscala(false);
  if(modoColunaEscala)limparEstadoColunaEscala();
  if(tabelaLimparPendente)fecharPopoverLimparTabela(false);
});
document.querySelectorAll(".lp-force-btn").forEach((btn)=>btn.addEventListener("click",()=>{
  if(modoAlocarAtivo)limparSelecaoAlocar();
  setTimeout(()=>renderResponsaveisViews(),0);
}));
aplicarHorariosAtuais();
garantirHorariosVivencias();
setupAlocacaoEscalas();
observarTabelasEscala();
atualizarDisponibilidadeColuna();
document.addEventListener("dragover",(event)=>{
  const td = event.target?.closest?.("td");
  if(tdAvisoForca && tdAvisoForca!==td)limparAvisoForcaRestrita(tdAvisoForca);
});
renderResponsaveisViews();
setTimeout(()=>{carregarTabelasEscalaDados();garantirHorariosVivencias();renderResponsaveisViews();observarTabelasEscala();atualizarDisponibilidadeColuna();},350);
setTimeout(()=>{carregarTabelasEscalaDados();garantirHorariosVivencias();renderResponsaveisViews();observarTabelasEscala();atualizarDisponibilidadeColuna();},1000);
});

(function(){
  "use strict";

  const overlay = document.getElementById("previa-overlay");
  const frame = document.getElementById("previa-frame");
  const wrap = document.getElementById("previa-frame-wrap");
  const title = document.getElementById("previa-title");
  const sideBtns = Array.from(document.querySelectorAll(".previa-side-btn"));
  const zoomLabel = document.getElementById("previaZoomLabel");
  let modoAtual = "escala";
  let previewZoom = 1;
  const txt = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const normImp = (value) => txt(value).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const esc = (value) => txt(value).replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[ch]));

  function cssImpressao(){
    return `
      *{box-sizing:border-box}
      html,body{margin:0;padding:0;background:#d1d5db;color:#111;font-family:Calibri,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      body{box-sizing:border-box}
      body{padding:0}
      .imp-page{width:297mm;height:210mm;padding:10mm;break-after:page;page-break-after:always;overflow:hidden;background:#fff;margin:0 auto 12mm;box-shadow:0 8px 28px rgba(15,23,42,.35)}
      .imp-page + .imp-page{break-before:page;page-break-before:always}
      .imp-page:last-child{break-after:auto;page-break-after:auto}
      .imp-escala-section{margin-top:20px}
      .imp-cab{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border:2px solid #1f2937;margin-bottom:4mm}
      .imp-cab-cell{min-height:14mm;padding:2mm 3mm;border-right:1px solid #1f2937;display:flex;flex-direction:column;justify-content:center}
      .imp-cab-cell:last-child{border-right:0;text-align:right}
      .imp-org{font-size:10px;font-weight:700;text-transform:uppercase}
      .imp-title{font-size:16px;font-weight:900;letter-spacing:.8px;text-align:center;text-transform:uppercase}
      .imp-meta{font-size:10px;font-weight:700}
      .imp-top-frames{width:1046px;height:90px;display:grid;grid-template-columns:390px 90px 90px 198px 198px;gap:20px;margin:0 0 10px 0}
      .imp-top-frame{height:90px;background:#fff;overflow:visible}
      .imp-frame-1{border:1px solid #111}
      .imp-frame-1{display:grid;grid-template-columns:120px 270px}
      .imp-list-top-frames{width:718px;height:90px;display:grid;grid-template-columns:378px 85px 85px 125px;gap:15px;margin:0 0 10px 0}
      .imp-list-frame-1{display:grid;grid-template-columns:115px 263px;border:1px solid #111}
      .imp-list-top-frames .imp-mini-card{width:85px}
      .imp-list-chief-box{width:125px;height:90px}
      .imp-list-chief-title{height:25px;border:1px solid #508d60;background:#508d60;color:#fff;font-size:9px;font-weight:900;line-height:24px;text-align:center;text-transform:uppercase}
      .imp-list-chief-gap{height:10px}
      .imp-list-chief-row{height:22.5px;display:grid;grid-template-columns:40px 85px}
      .imp-list-chief-label,.imp-list-chief-value{height:22.5px;border:1px solid #508d60;background:#e4f2e0;color:#508d60;font-size:10px;font-weight:900;line-height:21.5px;text-align:center}
      .imp-list-chief-value{border-left:0;font-size:11px}
      .imp-list-chief-row.ppf .imp-list-chief-label{background:#2457b5;color:#fff;border-color:#2457b5}
      .imp-list-chief-row.ppf .imp-list-chief-value{background:#dfe8f8;color:#2457b5;border-color:#2457b5}
      .imp-list-chief-row.fpn .imp-list-chief-label{background:#8b1a1a;color:#fff;border-color:#8b1a1a}
      .imp-list-chief-row.fpn .imp-list-chief-value{background:#f6dede;color:#8b1a1a;border-color:#8b1a1a}
      .imp-frame-1-cell{height:90px;border:0}
      .imp-brasao-cell{display:flex;align-items:center;justify-content:center}
      .imp-brasao{width:76px;height:76px;object-fit:contain;display:block}
      .imp-org-text{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-size:12px;font-weight:900;line-height:1.25;text-transform:uppercase}
      .imp-mini-card{width:90px}
      .imp-mini-title{height:25px;border:1px solid #508d60;border-bottom:0;background:#508d60;color:#fff;font-size:12px;font-weight:900;text-align:center;line-height:24px;text-transform:uppercase}
      .imp-mini-body{height:65px;border:1px solid #508d60;background:#e4f2e0;color:#508d60;font-size:13px;font-weight:900;text-align:center;line-height:1.15;display:flex;flex-direction:column;align-items:center;justify-content:center}
      .imp-mini-date-value{font-size:15px;font-weight:900}
      .imp-mini-body-small{height:65px;border:1px solid #508d60;background:#e4f2e0;color:#508d60;font-size:18px;font-weight:900;text-align:center;line-height:64px}
      .imp-mini-weekday{font-size:8px;font-weight:900;margin-top:3px}
      .imp-card-gap{height:5px}
      .imp-info-banner{width:198px;height:20px;border:1px solid #111;font-size:12px;font-weight:900;text-align:center;line-height:19px;text-transform:uppercase}
      .imp-info-row{width:198px;height:20px;display:grid;grid-template-columns:108px 90px}
      .imp-info-row-title,.imp-info-row-body{height:20px;border:1px solid #111;font-size:8.5px;font-weight:900;line-height:19px;text-align:center}
      .imp-info-row-body{border-left:0;font-size:12px}
      .imp-info-table{width:198px;height:40px;border-collapse:separate;border-spacing:0;table-layout:fixed;border:1px solid #111}
      .imp-info-table td{width:99px;height:20px;border:1px solid #111;font-size:10px;line-height:19px;padding:0;text-align:center}
      .imp-info-table .imp-th{font-size:10px;font-weight:900;text-transform:uppercase}
      .imp-info-table tr:last-child td{font-size:13px;font-weight:900}
      .imp-frame-ppf .imp-info-banner,.imp-frame-ppf .imp-info-row-title,.imp-frame-ppf .imp-th{background:#2457b5;color:#fff;border-color:#2457b5}
      .imp-frame-ppf .imp-info-row-body,.imp-frame-ppf .imp-info-table,.imp-frame-ppf .imp-info-table td:not(.imp-th){background:#dfe8f8;color:#2457b5;border-color:#2457b5}
      .imp-frame-fpn .imp-info-banner,.imp-frame-fpn .imp-info-row-title,.imp-frame-fpn .imp-th{background:#8b1a1a;color:#fff;border-color:#8b1a1a}
      .imp-frame-fpn .imp-info-row-body,.imp-frame-fpn .imp-info-table,.imp-frame-fpn .imp-info-table td:not(.imp-th){background:#f6dede;color:#8b1a1a;border-color:#8b1a1a}
      .imp-info-table tr:first-child td{border-top:0}
      .imp-info-table td:first-child{border-left:0}
      .imp-info-table td:last-child{border-right:0}
      .imp-info-table tr:last-child td{border-bottom:0}
      .imp-info-table td+td{border-left:0}
      .imp-info-table tr+tr td{border-top:0}
      .imp-banner{width:1046px;height:20px;display:flex;align-items:center;justify-content:center;margin:0 0 5px 0;background:#dfe8f8;color:#2457b5;border:1px solid #b6c9ea;font-size:12px;font-weight:900;letter-spacing:.8px;text-transform:uppercase}
      .imp-banner-night{background:#e4f2e0;color:#508d60;border-color:#b8d4b0;margin-top:0}
      .imp-banner-gap{height:10px}
      .imp-row{width:1046px;display:grid;grid-template-columns:542px 1fr;gap:5px;align-items:start;margin-bottom:5px}
      .imp-stack{width:1046px;display:flex;flex-direction:column;align-items:flex-start}
      .imp-stack-gap{height:20px}
      .imp-scale-area{width:1046px;transform-origin:top left}
      .imp-block{break-inside:avoid;margin-bottom:2mm}
      .imp-block-title{height:6mm;display:flex;align-items:center;justify-content:center;background:#e5e7eb;border:1px solid #6b7280;border-bottom:0;font-size:10px;font-weight:900;text-transform:uppercase}
      .imp-grid-table{font-size:9px;font-weight:700}
      .imp-grid-t2{width:542px;margin-bottom:10px}
      .imp-grid-t3{width:469px}
      .imp-grid-t4{width:706px}
      .imp-grid-t5{width:469px}
      .imp-grid-head,.imp-grid-row{display:grid;gap:2px}
      .imp-grid-t2 .imp-grid-head,.imp-grid-t2 .imp-grid-row,.imp-grid-t2-group{grid-template-columns:50px repeat(6,80px)}
      .imp-grid-t3 .imp-grid-head,.imp-grid-t3 .imp-grid-row{grid-template-columns:repeat(var(--viv-cols,5),1fr)}
      .imp-grid-t4 .imp-grid-head,.imp-grid-t4 .imp-grid-row,.imp-grid-t4-group{grid-template-columns:50px repeat(8,80px)}
      .imp-grid-t5 .imp-grid-head,.imp-grid-t5 .imp-grid-row{grid-template-columns:repeat(var(--viv-cols,5),1fr)}
      .imp-grid-night-groups{height:18px;margin-bottom:2px;display:grid;grid-template-columns:50px repeat(4,162px);gap:2px}
      .imp-grid-night-groups .imp-grid-cell{background:#e4f2e0;color:#508d60;border-color:#b8d4b0;font-size:11px;font-weight:900;text-transform:uppercase}
      .imp-grid-head{height:18px;margin-bottom:2px}
      .imp-grid-posto-head{margin-bottom:2px}
      .imp-grid-row{height:17px;margin-bottom:0}
      .imp-grid-cell{height:100%;display:flex;align-items:center;justify-content:center;border:1px solid #9ca3af;background:#fff;overflow:hidden;white-space:nowrap}
      .imp-grid-head .imp-grid-cell{background:#dfe8f8;color:#2457b5;border-color:#b6c9ea;font-size:11px;font-weight:900;text-transform:uppercase}
      .imp-grid-t4 .imp-grid-head .imp-grid-cell,
      .imp-grid-t5 .imp-grid-head .imp-grid-cell{background:#e4f2e0;color:#508d60;border-color:#b8d4b0}
      .imp-grid-t5 .imp-grid-cell{border-color:#b8d4b0}
      .imp-grid-posto{background:#f3f4f6;font-size:12px;font-weight:900}
      .imp-grid-cell.imp-grid-highlight{background:#fff7cc;color:#8b6914;font-weight:900;border-left-color:#d6b34d;border-right-color:#d6b34d;border-bottom-color:#d6b34d}
      .imp-zebra-diurno-claro{background:#fffdf7}
      .imp-zebra-diurno-suave{background:#f8fafc}
      .imp-zebra-noturno-claro{background:#fffdf7}
      .imp-zebra-noturno-suave{background:#f2fff7}
      .imp-grid-head .imp-zebra-diurno-claro{background:#fffdf7;color:#2457b5}
      .imp-grid-head .imp-zebra-diurno-suave{background:#f8fafc;color:#2457b5}
      .imp-grid-head .imp-zebra-noturno-claro{background:#fffdf7;color:#508d60}
      .imp-grid-head .imp-zebra-noturno-suave{background:#f2fff7;color:#508d60}
      .imp-grid-t4 .imp-grid-head .imp-grid-cell.imp-zebra-noturno-claro,
      .imp-grid-t5 .imp-grid-head .imp-grid-cell.imp-zebra-noturno-claro,
      .imp-grid-night-groups .imp-grid-cell.imp-zebra-noturno-claro{background:#fffdf7;color:#508d60;border-color:#b8d4b0}
      .imp-grid-t4 .imp-grid-head .imp-grid-cell.imp-zebra-noturno-suave,
      .imp-grid-t5 .imp-grid-head .imp-grid-cell.imp-zebra-noturno-suave,
      .imp-grid-night-groups .imp-grid-cell.imp-zebra-noturno-suave{background:#f2fff7;color:#508d60;border-color:#b8d4b0}
      .imp-grid-diurno .imp-grid-row .imp-grid-cell.imp-grid-highlight,
      .imp-grid-noturno .imp-grid-row .imp-grid-cell.imp-grid-highlight{background:#fff7cc;color:#8b6914;border-left-color:#d6b34d;border-right-color:#d6b34d;border-bottom-color:#d6b34d}
      .imp-grid-t2-group{display:grid;grid-auto-rows:17px;column-gap:2px;row-gap:0;margin-bottom:2px}
      .imp-grid-t4-group{display:grid;grid-auto-rows:17px;column-gap:2px;row-gap:0;margin-bottom:2px}
      .imp-grid-posto-merge{height:auto;grid-row:span var(--rows);align-self:stretch}
      .imp-grid-time{height:17px}
      .imp-grid-soft-bottom{border-bottom:.05px solid rgba(100,116,139,.08)}
      .imp-grid-soft-top{border-top:.05px solid rgba(100,116,139,.08)}
      .imp-grid-t3{justify-self:start}
      .imp-grid-t5{justify-self:start}
      .imp-grid-t3 .imp-grid-row:not(:last-child) .imp-grid-cell{border-bottom:.05px solid rgba(100,116,139,.08)}
      .imp-grid-t3 .imp-grid-row:not(:first-child) .imp-grid-cell{border-top:.05px solid rgba(100,116,139,.08)}
      .imp-grid-group-gap{height:2px}
      .imp-name-cell{justify-content:flex-start;padding-left:2px;text-align:left}
      .imp-name-cell::before{display:none}
      .imp-name-cell.imp-name-filled::before{content:"";display:block;width:2px;height:2px;margin-right:2px;border-radius:50%;background:#64748b;flex:0 0 2px}
      .imp-grid-cell.imp-grid-highlight{justify-content:center;padding-left:0;text-align:center}
      .imp-grid-cell.imp-grid-highlight::before{display:none}
      table{border-collapse:collapse;table-layout:fixed;width:100%;font-family:Calibri,Arial,sans-serif}
      th,td{border:1px solid #9ca3af;height:5.3mm;padding:0 1.2mm;font-size:9.5px;text-align:center;vertical-align:middle;overflow:hidden;white-space:nowrap}
      th{background:#dbeafe;color:#111827;font-weight:900}
      .turno-noturno th{background:#e5e7eb}
      .posto-cell{background:#f3f4f6;font-weight:900}
      .destaque-linha td,.destaque-linha .posto-cell{background:#fff7cc}
      .t2-table{width:176mm}
      .t3-table{width:84mm}
      .t4-table,.t5-table{width:100%}
      .t4-head-grupos th{background:#d1d5db}
      .imp-lista{width:100%;border:2px solid #1f2937}
      .imp-lista th{height:7mm;background:#1f4e79;color:#fff;font-size:11px}
      .imp-lista td{height:7mm;font-size:11px}
      .imp-lista .nome{text-align:left;font-weight:700}
      .imp-lista .assinatura{width:40mm}
      .imp-list-section-title{width:718px;height:25px;display:flex;align-items:center;padding-left:5px;border:1px solid;font-size:12px;font-weight:900;text-transform:uppercase}
      .imp-list-section-title.ppf{background:#2457b5;color:#fff;border-color:#2457b5}
      .imp-list-section-title.fpn{background:#8b1a1a;color:#fff;border-color:#8b1a1a}
      .imp-list-section-title.resumo{background:#e4f2e0;color:#508d60;border-color:#508d60}
      .imp-list-subtitle{width:718px;height:20px;display:flex;align-items:center;padding-left:5px;border:1px solid;font-size:10px;font-weight:900;text-transform:uppercase}
      .imp-list-subtitle.ppf{background:#dfe8f8;color:#2457b5;border-color:#2457b5}
      .imp-list-subtitle.fpn{background:#f6dede;color:#8b1a1a;border-color:#8b1a1a}
      .imp-list-gap-10{height:10px}
      .imp-list-gap-20{height:20px}
      .imp-list-page{width:210mm;min-height:297mm;padding:10mm;break-after:page;page-break-after:always;background:#fff;margin:0 auto 12mm;box-shadow:0 8px 28px rgba(15,23,42,.35)}
      .imp-list-page + .imp-list-page{break-before:page;page-break-before:always}
      .imp-list-page:last-child{break-after:auto;page-break-after:auto}
      .imp-list-top-gap{height:20px}
      .imp-resumo-banner{width:718px;height:25px;display:flex;align-items:center;padding-left:5px;border:1px solid;font-size:12px;font-weight:900;text-transform:uppercase}
      .imp-resumo-banner.ppf{background:#2457b5;color:#fff;border-color:#2457b5}
      .imp-resumo-banner.fpn{background:#8b1a1a;color:#fff;border-color:#8b1a1a}
      .imp-resumo-presenca{width:660px;margin-left:10px;border-collapse:collapse;table-layout:fixed;font-family:Calibri,Arial,sans-serif}
      .imp-resumo-presenca th,.imp-resumo-presenca td{height:20px;border:1px solid #9ca3af;font-size:10px;text-align:center;padding:0 4px;overflow:hidden;white-space:nowrap}
      .imp-resumo-presenca th{font-weight:900;text-transform:uppercase}
      .imp-resumo-presenca.ppf th{background:#2457b5;color:#fff;border-color:#2457b5}
      .imp-resumo-presenca.fpn th{background:#8b1a1a;color:#fff;border-color:#8b1a1a}
      .imp-resumo-presenca td:not(:first-child){font-weight:900;text-align:center}
      .imp-resumo-presenca.ppf tbody tr:nth-child(odd) td{background:#fffdf7}
      .imp-resumo-presenca.ppf tbody tr:nth-child(even) td{background:#f8fafc}
      .imp-resumo-presenca.fpn tbody tr:nth-child(odd) td{background:#fffdf7}
      .imp-resumo-presenca.fpn tbody tr:nth-child(even) td{background:#f6dede}
      .imp-resumo-presenca.ppf td.item{background:#dfe8f8;color:#2457b5}
      .imp-resumo-presenca.fpn td.item{background:#f6dede;color:#8b1a1a}
      .imp-resumo-presenca td.item{padding-left:5px;text-align:left;font-weight:900}
      .imp-resumo-presenca td.group{padding-left:15px;text-align:left;font-weight:900}
      .imp-resumo-presenca td.subitem{padding-left:20px;text-align:left;font-weight:700}
      .imp-resumo-presenca td.bullet::before{content:"";display:inline-block;width:4px;height:4px;margin-right:5px;border-radius:50%;background:#111;vertical-align:middle}
      .imp-resumo-presenca td.vazio{background:#fff}
      .imp-resumo-turno{width:200px;margin-left:10px;border-collapse:collapse;table-layout:fixed;font-family:Calibri,Arial,sans-serif}
      .imp-resumo-turno td{height:20px;border:1px solid #9ca3af;font-size:10px;font-weight:900;text-align:center;padding:0 4px}
      .imp-resumo-turno.ppf td:first-child{background:#dfe8f8;color:#2457b5;border-color:#2457b5}
      .imp-resumo-turno.fpn td:first-child{background:#f6dede;color:#8b1a1a;border-color:#8b1a1a}
      .imp-resumo-turno td:last-child{width:40px}
      .imp-resumo-turno.ppf td{border-color:#2457b5}
      .imp-resumo-turno.fpn td{border-color:#8b1a1a}
      .imp-pres-table{width:718px;border-collapse:collapse;table-layout:fixed;font-family:Calibri,Arial,sans-serif}
      .imp-pres-table th{height:20px;border:1px solid #9ca3af;font-size:10px;font-weight:900;text-align:center;text-transform:uppercase}
      .imp-pres-table td{height:20px;border:1px solid #cbd5e1;font-size:10px;text-align:center;padding:0 3px;overflow:hidden;white-space:nowrap}
      .imp-pres-table th:last-child,.imp-pres-table td:last-child,
      .imp-resumo-presenca th:last-child,.imp-resumo-presenca td:last-child,
      .imp-resumo-turno td:last-child{border-right-width:2px}
      .imp-pres-table td.nome{text-align:left;font-weight:700}
      .imp-pres-table td.obs{text-align:left;padding-left:5px}
      .imp-pres-table.ppf th{background:#2457b5;color:#fff;border-color:#2457b5}
      .imp-pres-table.fpn th{background:#8b1a1a;color:#fff;border-color:#8b1a1a}
      .imp-pres-table tr.ausente td{background:#fee2e2!important;color:#b91c1c;font-weight:800}
      .imp-pres-table tbody tr:nth-child(odd) td{background:#fffdf7}
      .imp-pres-table tbody tr:nth-child(even) td{background:#f8fafc}
      .imp-pres-table.fpn tbody tr:nth-child(even) td{background:#f6dede}
      @page{margin:0}
      @media print{html,body{background:#fff} body{padding:0!important}.imp-page,.imp-list-page{margin:0;box-shadow:none}}
    `;
  }

  function dataPlantao(){
    const dateInput = document.getElementById("topoDatePicker");
    const dia = txt(document.getElementById("topoDiaSemana")?.textContent);
    const plantao = txt(document.getElementById("topoPlantaoDia")?.textContent) || "PLANTÃO";
    let data = dateInput?.value || "";
    if (data && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [ano, mes, diaNum] = data.split("-");
      data = `${diaNum}/${mes}/${ano}`;
    }
    return {data: data || "___/___/____", dia, plantao};
  }

  function responsavelView(forca, posto){
    const block = document.querySelector(`.force-block.force-${forca}`);
    const row = Array.from(block?.querySelectorAll(".resp-table tbody tr") || []).find((tr) => normImp(tr.querySelector(".resp-role")?.textContent) === normImp(posto));
    const select = row?.querySelector(".resp-inline-select");
    const nome = select ? txt(select.value) : txt(row?.querySelector(".resp-name")?.textContent);
    return nome && !["-","—","⊘"].includes(nome) ? nome : "";
  }

  function statForca(forca, selector){
    return txt(document.querySelector(`.force-block.force-${forca} ${selector}`)?.textContent).replace(/[^\d]/g,"") || "00";
  }

  function dadosTopoPrint(){
    const dp = dataPlantao();
    return {
      ...dp,
      ppf:{
        chefe:responsavelView("ppf","CHEFE DE PLANTAO"),
        diurno:statForca("ppf",".stat-day"),
        noturno:statForca("ppf",".stat-night")
      },
      fpn:{
        chefe:responsavelView("fpn","CHEFE DE PLANTAO"),
        diurno:statForca("fpn",".stat-day"),
        noturno:statForca("fpn",".stat-night")
      }
    };
  }

  function cabecalho(){
    const dp = dataPlantao();
    return `
      <header class="imp-cab">
        <div class="imp-cab-cell">
          <div class="imp-org">Ministério da Justiça</div>
          <div class="imp-meta">Escala operacional</div>
        </div>
        <div class="imp-title">Escala de Serviço</div>
        <div class="imp-cab-cell">
          <div class="imp-meta">Data: ${esc(dp.data)}</div>
          <div class="imp-meta">${esc(dp.dia || dp.plantao)}</div>
        </div>
      </header>`;
  }

  function topoEscalaServico(){
    const dados = dadosTopoPrint();
    const brasaoSrc = new URL("brasao_republica.png", window.location.href).href;
    return `
      <div class="imp-top-frames">
        <div class="imp-top-frame imp-frame-1">
          <div class="imp-frame-1-cell imp-brasao-cell"><img class="imp-brasao" src="${brasaoSrc}" alt="Brasão da República"></div>
          <div class="imp-frame-1-cell imp-org-text">
            <div>MINISTERIO DA JUSTICA E SEGURANCA PUBLICA</div>
            <div>SECRETARIA NACIONAL DE SERVICOS PENAIS</div>
            <div>PENITENCIARIA FEDERAL DE MOSSORO</div>
            <div>DIVISAO DE SEGURANCA E DISCIPLINA</div>
          </div>
        </div>
        <div class="imp-top-frame imp-frame-2">
          <div class="imp-mini-card">
            <div class="imp-mini-title">DATA</div>
            <div class="imp-mini-body"><div class="imp-mini-date-value">${esc(dados.data)}</div><div class="imp-mini-weekday">${esc(dados.dia)}</div></div>
          </div>
        </div>
        <div class="imp-top-frame imp-frame-2">
          <div class="imp-mini-card">
            <div class="imp-mini-title">PLANTAO</div>
            <div class="imp-mini-body-small">${esc(dados.plantao)}</div>
          </div>
        </div>
        <div class="imp-top-frame imp-frame-3 imp-frame-ppf">
          <div class="imp-info-banner">PPF</div>
          <div class="imp-card-gap"></div>
          <div class="imp-info-row">
            <div class="imp-info-row-title">CHEFE DE PLANTAO</div>
            <div class="imp-info-row-body">${esc(dados.ppf.chefe)}</div>
          </div>
          <div class="imp-card-gap"></div>
          <table class="imp-info-table"><tbody>
            <tr><td class="imp-th">DIURNO</td><td class="imp-th">NOTURNO</td></tr>
            <tr><td>${esc(dados.ppf.diurno)}</td><td>${esc(dados.ppf.noturno)}</td></tr>
          </tbody></table>
        </div>
        <div class="imp-top-frame imp-frame-4 imp-frame-fpn">
          <div class="imp-info-banner">FPN</div>
          <div class="imp-card-gap"></div>
          <div class="imp-info-row">
            <div class="imp-info-row-title">CHEFE DE PLANTAO</div>
            <div class="imp-info-row-body">${esc(dados.fpn.chefe)}</div>
          </div>
          <div class="imp-card-gap"></div>
          <table class="imp-info-table"><tbody>
            <tr><td class="imp-th">DIURNO</td><td class="imp-th">NOTURNO</td></tr>
            <tr><td>${esc(dados.fpn.diurno)}</td><td>${esc(dados.fpn.noturno)}</td></tr>
          </tbody></table>
        </div>
      </div>`;
  }

  function topoListaPresenca(){
    const dados = dadosTopoPrint();
    const brasaoSrc = new URL("brasao_republica.png", window.location.href).href;
    return `
      <div class="imp-list-top-frames">
        <div class="imp-top-frame imp-list-frame-1">
          <div class="imp-frame-1-cell imp-brasao-cell"><img class="imp-brasao" src="${brasaoSrc}" alt="Brasão da República"></div>
          <div class="imp-frame-1-cell imp-org-text">
            <div>MINISTERIO DA JUSTICA E SEGURANCA PUBLICA</div>
            <div>SECRETARIA NACIONAL DE SERVICOS PENAIS</div>
            <div>PENITENCIARIA FEDERAL DE MOSSORO</div>
            <div>DIVISAO DE SEGURANCA E DISCIPLINA</div>
          </div>
        </div>
        <div class="imp-top-frame">
          <div class="imp-mini-card">
            <div class="imp-mini-title">DATA</div>
            <div class="imp-mini-body"><div class="imp-mini-date-value">${esc(dados.data)}</div><div class="imp-mini-weekday">${esc(dados.dia)}</div></div>
          </div>
        </div>
        <div class="imp-top-frame">
          <div class="imp-mini-card">
            <div class="imp-mini-title">PLANTAO</div>
            <div class="imp-mini-body-small">${esc(dados.plantao)}</div>
          </div>
        </div>
        <div class="imp-top-frame imp-list-chief-box">
          <div class="imp-list-chief-title">CHEFE DE PLANTAO</div>
          <div class="imp-list-chief-gap"></div>
          <div class="imp-list-chief-row ppf">
            <div class="imp-list-chief-label">PPF</div>
            <div class="imp-list-chief-value">${esc(dados.ppf.chefe)}</div>
          </div>
          <div class="imp-list-chief-gap"></div>
          <div class="imp-list-chief-row fpn">
            <div class="imp-list-chief-label">FPN</div>
            <div class="imp-list-chief-value">${esc(dados.fpn.chefe)}</div>
          </div>
        </div>
      </div>`;
  }

  function limparCloneTabela(table){
    const clone = table.cloneNode(true);
    clone.querySelectorAll("button").forEach((btn) => {
      const span = document.createElement("span");
      span.textContent = txt(btn.textContent);
      btn.replaceWith(span);
    });
    clone.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
    return clone.outerHTML;
  }

  function blocoTabela(id, titulo){
    const table = document.getElementById(id);
    if (!table) return "";
    return `<section class="imp-block"><div class="imp-block-title">${esc(titulo)}</div>${limparCloneTabela(table)}</section>`;
  }

  function cell(value, extraClass = ""){
    const filledName = txt(value) && /\bimp-name-cell\b/.test(extraClass) ? " imp-name-filled" : "";
    return `<div class="imp-grid-cell ${extraClass}${filledName}">${esc(value)}</div>`;
  }

  function timeCell(value, softBottom, softTop, zebraClass = ""){
    return cell(value, `imp-grid-time ${zebraClass}${softBottom ? " imp-grid-soft-bottom" : ""}${softTop ? " imp-grid-soft-top" : ""}`);
  }

  function zebraDiurno(index){
    return index % 2 === 0 ? "imp-zebra-diurno-claro" : "imp-zebra-diurno-suave";
  }

  function zebraNoturno(index){
    return index % 2 === 0 ? "imp-zebra-noturno-claro" : "imp-zebra-noturno-suave";
  }

  function zebraNoturnoPar(index){
    return Math.floor(index / 2) % 2 === 0 ? "imp-zebra-noturno-claro" : "imp-zebra-noturno-suave";
  }

  function tableMatrix(id){
    const table = document.getElementById(id);
    if (!table) return {head: [], rows: []};
    const head = Array.from(table.querySelectorAll("thead tr:last-child th")).map((th) => txt(th.textContent));
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => Array.from(tr.children).map((td) => txt(td.querySelector(".s03-alocado-nome")?.textContent || td.dataset.nomeAlocado || td.textContent)));
    return {head, rows};
  }

  function tableHeaderRows(id){
    const table = document.getElementById(id);
    if (!table) return [];
    return Array.from(table.querySelectorAll("thead tr")).map((tr) => Array.from(tr.children).map((th) => ({
      text: txt(th.textContent),
      colspan: Math.max(1, Number(th.getAttribute("colspan")) || 1)
    })));
  }

  function valoresLinhaEscala(row, count){
    const values = Array.isArray(row) ? row.slice(-count) : [];
    return Array.from({length:count}, (_, index) => values[index] || "");
  }

  function horariosVivenciaPrint(tableId, headerRows, totalCols){
    if (headerRows.length > 1) return headerRows[headerRows.length - 1].map((item) => item.text);
    const labels = [tableId === "tbl-T5" ? "07:00-08:00" : "08:00-18:00"];
    return Array.from({length: totalCols}, (_, index) => labels[index % labels.length]);
  }

  function spanCell(value, span, extraClass = ""){
    return `<div class="imp-grid-cell ${extraClass}" style="grid-column:span ${Math.max(1, Number(span) || 1)}">${esc(value)}</div>`;
  }

  function buildT2Diurno(){
    const {head, rows} = tableMatrix("tbl-T2");
    const horarios = head.slice(1, 7);
    const groups = [
      {label:"P1", rows:5, softUntil:4},
      {label:"P2", rows:3, softUntil:2},
      {label:"T1", rows:1, softUntil:0},
      {label:"T2", rows:1, softUntil:0},
      {label:"T3", rows:1, softUntil:0},
      {label:"T4", rows:1, softUntil:0}
    ];
    let rowIndex = 0;
    const rowHtml = groups.map((group) => {
      let html = `<div class="imp-grid-t2-group" style="--rows:${group.rows}">`;
      html += cell(group.label, "imp-grid-posto imp-grid-posto-merge");
      for (let localRow = 1; localRow <= group.rows; localRow += 1) {
        const source = rows[rowIndex] || [];
        rowIndex += 1;
        const values = valoresLinhaEscala(source,6);
        html += values.map((value, colIndex) => {
          const zebra = zebraDiurno(colIndex);
          const highlight = localRow === 1 && (group.label === "P1" || group.label === "P2") ? " imp-grid-highlight" : "";
          return timeCell(value, localRow <= group.softUntil, localRow > 1, `${zebra}${highlight}${highlight ? "" : " imp-name-cell"}`);
        }).join("");
      }
      html += "</div>";
      return html;
    }).join("");

    return `<section class="imp-grid-table imp-grid-t2 imp-grid-diurno">
      <div class="imp-grid-head">${cell("POSTO", "imp-zebra-diurno-claro")}${horarios.map((value, colIndex) => cell(value, zebraDiurno(colIndex))).join("")}</div>
      ${rowHtml}
    </section>`;
  }

  function buildT3Diurno(){
    const {head, rows} = tableMatrix("tbl-T3");
    const headerRows = tableHeaderRows("tbl-T3");
    const postos = headerRows[0]?.length ? headerRows[0] : head.slice(0, 5).map((text) => ({text, colspan:1}));
    const totalCols = postos.reduce((sum, item) => sum + item.colspan, 0) || head.length || 5;
    const horarios = horariosVivenciaPrint("tbl-T3", headerRows, totalCols);
    const rowHtml = rows.map((source, rowIndex) => {
      const values = valoresLinhaEscala(source,totalCols);
      const highlight = rowIndex === 0 ? " imp-grid-highlight" : "";
      return `<div class="imp-grid-row">${values.map((value, colIndex) => cell(value, `${zebraDiurno(colIndex)}${highlight}${highlight ? "" : " imp-name-cell"}`)).join("")}</div>`;
    }).join("");

    return `<section class="imp-grid-table imp-grid-t3 imp-grid-diurno" style="--viv-cols:${totalCols}">
      <div class="imp-grid-head imp-grid-posto-head">${postos.map((item, colIndex) => spanCell(item.text, item.colspan, zebraDiurno(colIndex))).join("")}</div>
      <div class="imp-grid-head">${horarios.map((value, colIndex) => cell(value, zebraDiurno(colIndex))).join("")}</div>
      ${rowHtml}
    </section>`;
  }

  function formatMinutes(value){
    const normalized = value % (24 * 60);
    const h = String(Math.floor(normalized / 60)).padStart(2, "0");
    const m = String(normalized % 60).padStart(2, "0");
    return `${h}:${m}`;
  }

  function nightSlots(){
    const slots = [];
    let total = 20 * 60;
    for (let index = 0; index < 8; index += 1) {
      const start = total;
      const end = total + 90;
      slots.push(`${formatMinutes(start)}-${formatMinutes(end)}`);
      total = end;
    }
    return slots;
  }

  function nightGroupLabels(slots){
    return [0, 2, 4, 6].map((index) => {
      const start = slots[index].split("-")[0];
      const end = slots[index + 1].split("-")[1];
      return `${start}-${end}`;
    });
  }

  function buildT4Noturno(){
    const {head, rows} = tableMatrix("tbl-T4");
    const headerRows = tableHeaderRows("tbl-T4");
    const slots = head.slice(-8).length ? head.slice(-8) : nightSlots();
    const groupHeaders = headerRows[0]?.filter((item) => normImp(item.text) !== "POSTO") || [];
    const groups = [
      {label:"P1", rows:5, softUntil:4},
      {label:"P2", rows:3, softUntil:2},
      {label:"T1", rows:1, softUntil:0},
      {label:"T2", rows:1, softUntil:0},
      {label:"T3", rows:1, softUntil:0},
      {label:"T4", rows:1, softUntil:0}
    ];
    let rowIndex = 0;
    const rowHtml = groups.map((group) => {
      let html = `<div class="imp-grid-t4-group" style="--rows:${group.rows}">`;
      html += cell(group.label, "imp-grid-posto imp-grid-posto-merge");
      for (let localRow = 1; localRow <= group.rows; localRow += 1) {
        const source = rows[rowIndex] || [];
        rowIndex += 1;
        const values = valoresLinhaEscala(source,8);
        html += values.map((value, colIndex) => {
          const zebra = zebraNoturnoPar(colIndex);
          return timeCell(value, localRow <= group.softUntil, localRow > 1, `${zebra} imp-name-cell`);
        }).join("");
      }
      html += "</div>";
      return html;
    }).join("");

    return `<section class="imp-grid-table imp-grid-t4 imp-grid-noturno">
      <div class="imp-grid-night-groups">${cell("", "imp-zebra-noturno-claro")}${(groupHeaders.length ? groupHeaders.map((item)=>item.text) : nightGroupLabels(slots)).map((value, groupIndex) => cell(value, zebraNoturno(groupIndex))).join("")}</div>
      <div class="imp-grid-head">${cell("POSTO", "imp-zebra-noturno-claro")}${slots.map((value, colIndex) => cell(value, zebraNoturnoPar(colIndex))).join("")}</div>
      ${rowHtml}
    </section>`;
  }

  function buildT5Noturno(){
    const source = tableMatrix("tbl-T5");
    const headerRows = tableHeaderRows("tbl-T5");
    const postos = headerRows[0]?.length ? headerRows[0] : source.head.slice(0, 5).map((text) => ({text, colspan:1}));
    const totalCols = postos.reduce((sum, item) => sum + item.colspan, 0) || source.head.length || 5;
    const headers = horariosVivenciaPrint("tbl-T5", headerRows, totalCols);
    const rows = source.rows.map((row) => {
      return `<div class="imp-grid-row">${valoresLinhaEscala(row,totalCols).map((value, colIndex) => cell(value, `${zebraNoturno(colIndex)} imp-name-cell`)).join("")}</div>`;
    }).join("");

    return `<section class="imp-grid-table imp-grid-t5 imp-grid-noturno" style="--viv-cols:${totalCols}">
      <div class="imp-grid-head imp-grid-posto-head">${postos.map((item, colIndex) => spanCell(item.text, item.colspan, zebraNoturno(colIndex))).join("")}</div>
      <div class="imp-grid-head">${headers.map((value, colIndex) => cell(value, zebraNoturno(colIndex))).join("")}</div>
      ${rows}
    </section>`;
  }

  function buildEscala(){
    return `
      <div class="imp-page">
        ${topoEscalaServico()}
        <div class="imp-escala-section">
          <div class="imp-banner">Escala diurna</div>
          <div class="imp-banner-gap"></div>
          <div class="imp-scale-area">
            <div class="imp-stack">
              ${buildT2Diurno()}
              <div class="imp-stack-gap"></div>
              ${buildT3Diurno()}
            </div>
          </div>
        </div>
      </div>
      <div class="imp-page">
        ${topoEscalaServico()}
        <div class="imp-escala-section">
          <div class="imp-banner imp-banner-night">Escala noturna</div>
          <div class="imp-banner-gap"></div>
          <div class="imp-scale-area">
            ${buildT4Noturno()}
            <div class="imp-stack-gap"></div>
            ${buildT5Noturno()}
          </div>
        </div>
      </div>
    `;
  }

  function linhasEfetivo(){
    return Array.from(document.querySelectorAll("#eftCanonicoBody tr")).map((tr, index) => {
      const cells = tr.children;
      return {
        num: txt(cells[0]?.textContent) || String(index + 1).padStart(2, "0"),
        nome: txt(cells[2]?.textContent),
        obs: txt(cells[5]?.textContent),
        turno: txt(cells[8]?.textContent),
        situacao: txt(cells[1]?.textContent) || "PRES",
        tipo: txt(cells[7]?.textContent) || "fixo"
      };
    }).filter((row) => row.nome);
  }

  function buildListaPresenca(){
    const norm = (value) => txt(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const plantaoAtual = norm(document.getElementById("topoPlantaoDia")?.textContent);
    const servidores = Array.from(document.querySelectorAll("#svTbody tr")).map((tr) => {
      const c = tr.children;
      return {
        id:norm(c[0]?.textContent),
        nome:norm(c[2]?.textContent),
        curto:norm(c[3]?.textContent),
        forca:norm(c[4]?.textContent),
        status:norm(c[5]?.textContent),
        plantao:norm(c[6]?.textContent),
        turno:norm(c[7]?.textContent),
        motPres:norm(c[9]?.textContent),
        jornada:norm(c[10]?.textContent),
        horario:norm(c[11]?.textContent),
        motAus:norm(c[12]?.textContent),
        substituto:norm(c[13]?.textContent),
        plantaoPgto:norm(c[14]?.textContent),
        idPgto:norm(c[15]?.textContent),
        statusPgto:norm(c[16]?.textContent)
      };
    }).filter((row) => row.nome);
    const ativo = (row) => row.status === "ATIVO";
    const valorVazio = (value) => !value || value === "-" || value === "—" || value === "NAO" || value === "NÃO";
    const motivoAusencia = (row) => valorVazio(row.motAus) ? "" : row.motAus;
    const motivoPresenca = (row) => valorVazio(row.motPres) ? "" : row.motPres;
    const turnoKey = (row) => row.turno === "24H" ? "h24" : row.turno === "NOTURNO" ? "noturno" : "diurno";
    const turnos = ["h24","noturno","diurno"];
    const rowValores = (values) => {
      const h24 = Number(values.h24) || 0;
      const noturno = Number(values.noturno) || 0;
      const diurno = Number(values.diurno) || 0;
      return {h24, noturno, diurno, total:h24 + noturno + diurno};
    };
    const contarPorTurno = (rows) => rowValores(rows.reduce((acc, row) => {
      const key = turnoKey(row);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}));
    const fmtNum = (value) => String(Number(value) || 0).padStart(2, "0");
    const porForca = (kind) => servidores.filter((row) => ativo(row) && row.forca === kind.toUpperCase());
    const fixos = (kind, turno) => porForca(kind).filter((row) => row.plantao === plantaoAtual && row.turno === turno);
    const permutasPgto = (kind, statusPgto) => porForca(kind).filter((row) => row.plantao !== plantaoAtual && row.idPgto && row.plantaoPgto === plantaoAtual && (!statusPgto || row.statusPgto === statusPgto));
    const extras = (kind) => porForca(kind).filter((row) => (row.plantao !== plantaoAtual || !row.plantao) && motivoPresenca(row) && !motivoAusencia(row));
    const nomeCurtoPorId = new Map(servidores.map((row) => [row.id, row.curto || row.nome]));
    const obsPermuta = (row, faltou=false) => {
      const nome = nomeCurtoPorId.get(row.substituto) || row.substituto || row.curto || "";
      return `${faltou ? "FALTOU | " : ""}PERMUTA${nome ? " | " + nome : ""}`;
    };

    function sectionTitle(label, kind){
      return `<div class="imp-list-section-title ${kind}">${esc(label)}</div>`;
    }

    function subTitle(label, kind){
      return `<div class="imp-list-subtitle ${kind}">${esc(label)}</div>`;
    }

    function presTable(headers, kind, rowsData){
      const rows = rowsData.map((row, index) => {
        const ausente = row.situacao === "AUSENTE";
        const values = headers.map((header) => {
          if (header === "#") return String(index + 1).padStart(2, "0");
          if (header === "NOME COMPLETO") return row.nome;
          if (header === "SITUACAO") return row.situacao;
          if (header === "MOTIVO") return row.motivo;
          if (header === "SUBSTITUTO") return row.substituto;
          if (header === "TURNO") return row.turno;
          if (header === "OBS") return row.obs;
          return "";
        });
        return `<tr class="${ausente ? "ausente" : ""}">${values.map((value, colIndex) => `<td class="${headers[colIndex] === "NOME COMPLETO" ? "nome" : headers[colIndex] === "OBS" ? "obs" : ""}">${esc(value)}</td>`).join("")}</tr>`;
      }).join("");

      return `<table class="imp-pres-table ${kind}">
        <colgroup>
          <col style="width:25px"><col style="width:233px"><col style="width:85px"><col style="width:85px"><col style="width:85px"><col style="width:205px">
        </colgroup>
        <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    }

    function mapFixo(row){
      const motivo = motivoAusencia(row);
      const ausente = motivo !== "";
      return {
        nome:row.nome,
        situacao:ausente ? "AUSENTE" : "PRESENTE",
        motivo:ausente ? motivo : "",
        substituto:motivo === "PERMUTA" ? (nomeCurtoPorId.get(row.substituto) || row.substituto) : "",
        turno:row.turno,
        obs:""
      };
    }

    function mapPgto(row){
      const ausente = row.statusPgto === "AUSENTE";
      return {
        nome:row.nome,
        situacao:ausente ? "AUSENTE" : "PRESENTE",
        motivo:ausente ? row.motAus : "",
        substituto:row.substituto,
        turno:row.turno,
        obs:obsPermuta(row, ausente)
      };
    }

    function mapExtra(row){
      return {
        nome:row.nome,
        situacao:"PRESENTE",
        motivo:"",
        substituto:"",
        turno:row.turno,
        obs:[motivoPresenca(row),row.jornada,row.horario].filter(Boolean).join(" | ")
      };
    }

    function resumoValores(kind){
      const base = porForca(kind);
      const noPlantao = base.filter((row) => row.plantao === plantaoAtual);
      const efetivoFixo = contarPorTurno(noPlantao);
      const ausComumRows = noPlantao.filter((row) => {
        const motivo = motivoAusencia(row);
        return motivo && motivo !== "PERMUTA";
      });
      const ausComum = contarPorTurno(ausComumRows);
      const porMotivo = (...motivos) => contarPorTurno(ausComumRows.filter((row) => motivos.includes(motivoAusencia(row))));
      const ausPermuta = contarPorTurno(noPlantao.filter((row) => motivoAusencia(row) === "PERMUTA"));
      const presenteFixo = rowValores(Object.fromEntries(turnos.map((key) => [key, efetivoFixo[key] - ausComum[key] - ausPermuta[key]])));
      const pgtoPermuta = contarPorTurno(permutasPgto(kind, "PRESENTE"));
      const extraRows = extras(kind);
      const outrasExtra = contarPorTurno(extraRows);
      const apoioExtra = contarPorTurno(extraRows.filter((row) => motivoPresenca(row) === "APOIO"));
      const compensacaoExtra = contarPorTurno(extraRows.filter((row) => motivoPresenca(row) === "COMPENSACAO"));
      const totalFora = rowValores(Object.fromEntries(turnos.map((key) => [key, pgtoPermuta[key] + apoioExtra[key] + compensacaoExtra[key]])));
      const faltaPgto = contarPorTurno(permutasPgto(kind, "AUSENTE"));
      const totalGeral = rowValores(Object.fromEntries(turnos.map((key) => [key, presenteFixo[key] + totalFora[key] - faltaPgto[key]])));
      return {
        efetivoFixo, ausComum,
        atestado:porMotivo("ATESTADO", "ATESTADO MEDICO"),
        compensacao:porMotivo("COMPENSACAO"),
        ferias:porMotivo("FERIAS"),
        licenca:porMotivo("LICENCA"),
        missao:porMotivo("MISSAO"),
        outras:porMotivo("OUTRAS"),
        ausPermuta, presenteFixo, pgtoPermuta, outrasExtra, apoioExtra, compensacaoExtra,
        totalFora, faltaPgto, totalGeral,
        efetivoDiurno:totalGeral.h24 + totalGeral.diurno,
        efetivoNoturno:totalGeral.h24 + totalGeral.noturno
      };
    }

    function resumoPresencaTabela(kind){
      const v = resumoValores(kind);
      const linhas = [
        ["EFETIVO FIXO DO PLANTAO","item",v.efetivoFixo],
        ["AUSENCIAS COMUM","group",v.ausComum],
        ["ATESTADO MEDICO","subitem bullet",v.atestado],
        ["COMPENSACAO","subitem bullet",v.compensacao],
        ["FERIAS","subitem bullet",v.ferias],
        ["LICENCA","subitem bullet",v.licenca],
        ["MISSAO","subitem bullet",v.missao],
        ["OUTRAS","subitem bullet",v.outras],
        ["","vazio",null],
        ["AUSENCIAS POR PERMUTA","group",v.ausPermuta],
        ["","vazio",null],
        ["TOTAL DE PRESENTE DO EFETIVO FIXO","item",v.presenteFixo],
        ["","vazio",null],
        ["EFETIVO DE FORA DO PLANTAO","item",null],
        ["PAGAMENTO DE PERMUTA","group",v.pgtoPermuta],
        ["OUTRAS PRESENCAS EXTRA","group",v.outrasExtra],
        ["APOIO EXTRA","subitem",v.apoioExtra],
        ["COMPENSACAO","subitem",v.compensacaoExtra],
        ["TOTAL DO EFETIVO DE FORA DO PLANTAO","group",v.totalFora],
        ["","vazio",null],
        ["AUSENCIA NO PAGAMENTO DE PERMUTA","item",v.faltaPgto],
        ["","vazio",null],
        ["TOTAL GERAL DE PRESENTES NO PLANTAO","item",v.totalGeral]
      ];
      return `<table class="imp-resumo-presenca ${kind}">
        <colgroup><col style="width:300px"><col style="width:90px"><col style="width:90px"><col style="width:90px"><col style="width:90px"></colgroup>
        <thead><tr><th>ITEM</th><th>24H</th><th>NOTURNO</th><th>DIURNO</th><th>TOTAL</th></tr></thead>
        <tbody>${linhas.map(([label,cls,values])=>`<tr><td class="${cls}">${esc(label)}</td><td>${values?fmtNum(values.h24):""}</td><td>${values?fmtNum(values.noturno):""}</td><td>${values?fmtNum(values.diurno):""}</td><td>${values?fmtNum(values.total):""}</td></tr>`).join("")}</tbody>
      </table>`;
    }

    function resumoTurnoTabela(kind){
      const v = resumoValores(kind);
      return `<table class="imp-resumo-turno ${kind}">
        <tbody>
          <tr><td>EFETIVO DIURNO</td><td>${fmtNum(v.efetivoDiurno)}</td></tr>
          <tr><td>EFETIVO NOTURNO</td><td>${fmtNum(v.efetivoNoturno)}</td></tr>
        </tbody>
      </table>`;
    }

    function resumoPlantao(kind){
      return `
        <div class="imp-list-gap-20"></div>
        <div class="imp-resumo-banner ${kind}">RESUMO DO PLANTAO</div>
        <div class="imp-list-gap-10"></div>
        ${resumoPresencaTabela(kind)}
        <div class="imp-list-gap-20"></div>
        ${resumoTurnoTabela(kind)}
      `;
    }

    const headersFixo = ["#","NOME COMPLETO","SITUACAO","MOTIVO","SUBSTITUTO","OBS"];
    const headersPermuta = ["#","NOME COMPLETO","SITUACAO","SUBSTITUTO","TURNO","OBS"];
    const headersExtra = ["#","NOME COMPLETO","SITUACAO","MOTIVO","TURNO","OBS"];
    const dados = (kind) => ({
      fixo24:fixos(kind.toUpperCase(), "24H").map(mapFixo),
      fixoNoturno:fixos(kind.toUpperCase(), "NOTURNO").map(mapFixo),
      pgto:permutasPgto(kind.toUpperCase()).map(mapPgto),
      extra:extras(kind.toUpperCase()).map(mapExtra)
    });
    const ppfDados = dados("ppf");
    const fpnDados = dados("fpn");
    return `
      <div class="imp-list-page">
        ${topoListaPresenca()}
        <div class="imp-list-top-gap"></div>
        ${sectionTitle("PPF - POLICIA PENAL FEDERAL", "ppf")}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL FIXO DO PLANTAO - TURNO 24 HORAS", "ppf")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersFixo, "ppf", ppfDados.fixo24)}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL FIXO DO PLANTAO - TURNO NOTURNO", "ppf")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersFixo, "ppf", ppfDados.fixoNoturno)}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL PAGAMENTO DE PERMUTA", "ppf")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersPermuta, "ppf", ppfDados.pgto)}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL PRESENCA EXTRA", "ppf")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersExtra, "ppf", ppfDados.extra)}
        ${resumoPlantao("ppf")}
      </div>
      <div class="imp-list-page">
        ${topoListaPresenca()}
        <div class="imp-list-top-gap"></div>
        ${sectionTitle("FPN - FORCA PENETENCIARIA NACIONAL", "fpn")}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL FIXO DO PLANTAO - TURNO 24 HORAS", "fpn")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersFixo, "fpn", fpnDados.fixo24)}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL FIXO DO PLANTAO - TURNO NOTURNO", "fpn")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersFixo, "fpn", fpnDados.fixoNoturno)}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL PAGAMENTO DE PERMUTA", "fpn")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersPermuta, "fpn", fpnDados.pgto)}
        <div class="imp-list-gap-10"></div>
        ${subTitle("PESSOAL PRESENCA EXTRA", "fpn")}
        <div class="imp-list-gap-10"></div>
        ${presTable(headersExtra, "fpn", fpnDados.extra)}
        ${resumoPlantao("fpn")}
      </div>
    `;
  }

  function scriptAutoEscalaTabelas(){
    return `
      <script>
      (function(){
        function ajustar(){
          document.querySelectorAll(".imp-page").forEach(function(page){
            var area=page.querySelector(".imp-scale-area");
            if(!area)return;
            area.style.transform="scale(1)";
            area.style.height="auto";
            var areaRect=area.getBoundingClientRect();
            var availableH=page.clientHeight-(areaRect.top-page.getBoundingClientRect().top);
            var contentH=area.scrollHeight;
            if(!availableH||!contentH)return;
            var scaleH=availableH/contentH;
            var scale=Math.min(scaleH,1.18);
            scale=Math.max(0.68,scale);
            area.style.transform="scale("+scale+")";
            area.style.height=(contentH*scale)+"px";
          });
        }
        window.__ajustarEscalaServico=ajustar;
        window.addEventListener("load",function(){setTimeout(ajustar,30);});
        window.addEventListener("beforeprint",ajustar);
      })();
      <\/script>`;
  }

  function renderIframe(){
    if (!frame) return;
    const landscape = modoAtual === "escala";
    const body = landscape ? buildEscala() : buildListaPresenca();
    const page = landscape ? "A4 landscape" : "A4 portrait";
    frame.style.width = landscape ? "297mm" : "210mm";
    frame.style.height = landscape ? "210mm" : "297mm";
    const margin = "0";
    const ajustarAlturaFrame = () => {
      const doc = frame.contentDocument;
      const height = Math.max(doc?.documentElement?.scrollHeight || 0, doc?.body?.scrollHeight || 0);
      if (height) frame.style.height = `${height}px`;
      escalarPreview(landscape);
    };
    frame.onload = () => {
      frame.contentWindow?.__ajustarEscalaServico?.();
      setTimeout(ajustarAlturaFrame, 60);
    };
    frame.srcdoc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${cssImpressao()}@page{size:${page};margin:${margin};} body{padding:${margin};}</style></head><body>${body}${landscape ? scriptAutoEscalaTabelas() : ""}</body></html>`;
    setTimeout(() => {
      frame.contentWindow?.__ajustarEscalaServico?.();
      ajustarAlturaFrame();
    }, 80);
  }

  function escalarPreview(landscape){
    if (!frame || !wrap) return;
    const maxW = wrap.clientWidth - 40;
    const frameW = frame.offsetWidth || (landscape ? 1122 : 794);
    const frameH = frame.offsetHeight || (landscape ? 794 : 1122);
    const baseScale = Math.min(1, maxW / frameW);
    const scale = baseScale * previewZoom;
    frame.style.transform = `scale(${scale})`;
    frame.style.transformOrigin = "top center";
    frame.style.marginBottom = `${(frameH * scale) - frameH + 20}px`;
    if(zoomLabel)zoomLabel.textContent = `${Math.round(previewZoom * 100)}%`;
  }

  function setPreviewZoom(value){
    previewZoom = Math.min(2, Math.max(.5, value));
    escalarPreview(modoAtual === "escala");
  }

  function atualizarPreview(){
    if (title) {
      title.textContent = "Prévia de Impressão";
    }
    sideBtns.forEach((btn) => btn.classList.toggle("active", btn.dataset.imp === modoAtual));
    renderIframe();
  }

  function abrirPreview(){
    if (!overlay) return;
    overlay.classList.add("active");
    atualizarPreview();
  }

  document.querySelectorAll("#btnPreviewPrint,.print-escala-btn").forEach((btn) => {
    btn.addEventListener("click", abrirPreview);
  });

  sideBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modoAtual = btn.dataset.imp || "escala";
      atualizarPreview();
    });
  });

  document.getElementById("previaZoomMenos")?.addEventListener("click", () => setPreviewZoom(previewZoom - .1));
  document.getElementById("previaZoomMais")?.addEventListener("click", () => setPreviewZoom(previewZoom + .1));
  document.getElementById("previaZoomReset")?.addEventListener("click", () => setPreviewZoom(1));

  document.getElementById("btn-imprimir-cancelar")?.addEventListener("click", () => {
    overlay?.classList.remove("active");
  });

  document.getElementById("btn-imprimir-exec")?.addEventListener("click", () => {
    if (!frame?.srcdoc) return;
    let printFrame = document.getElementById("_print_iframe_imp");
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "_print_iframe_imp";
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
    document.body.appendChild(printFrame);
    }
    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow?.__ajustarEscalaServico?.();
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      }, 80);
    };
    printFrame.srcdoc = frame.srcdoc;
  });

  window.addEventListener("resize", () => {
    if (overlay?.classList.contains("active")) escalarPreview(modoAtual === "escala");
  });
})();
