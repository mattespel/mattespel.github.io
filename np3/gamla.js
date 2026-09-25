// Facit och svarsrutor till de gamla proven.
// Varje delprov: lista av [sidnummer, [frågor]]. Varje fråga: [nummer, f => ({html, facit, check})].
// Facit är gjort av Claude utifrån uppgifterna, inte Skolverkets officiella bedömningsanvisningar.

const SELF=()=>({k:"self"});
const SEL=(opts,a)=>({k:"sel",opts,a});
const MULTI=(opts,a)=>({k:"multi",opts,a});
const toF=v=>parseFloat(String(v==null?"":v).replace(",",".").replace(/[^0-9.]/g,""));
const kg=()=>T(["kg","kilo","kilogram"],4),gr=()=>T(["g","gram"],4),dl=()=>T(["dl","deciliter"],4),li=()=>T(["l","liter"],5);
const ORD=w=>T([w],8);

// Q(nummer, delar, facit, check). En del = [etikett, text före, fält (eller lista av fält), text efter]
function Q(n,parts,facit,check){
  return[n,f=>({html:parts.map(([l,pre,fd,post])=>{
    const fs=fd==null?"":(Array.isArray(fd)?fd.map(x=>f(x)).join(" "):f(fd));
    const x=`${pre||""} ${fs} ${post||""}`;
    return l!=null?`<div class="sub"><span class="lbl">${l}</span><span class="sc">${x}</span></div>`:`<div class="sub"><span class="sc">${x}</span></div>`;
  }).join(""),facit,check})];
}
const SVAR=(n,fd,facit,unit)=>Q(n,[[null,"Svar:",fd,unit||""]],facit);
const CALC=(n,a,op,b)=>{const r=op==="+"?a+b:a-b,o=op==="+"?"+":"−";return[n,f=>({html:`<div class="sub"><span class="sc">${a} ${o} ${b} = ${f(N(r,5))}</span></div>`,facit:`<pre class="col">${colForm(a,b,o,r)}</pre>`})]};

// ---- återkommande uppgifter ----
const SYMS=["✕ △ ✕","✕ ✕ △","△ △ ✕","△ ✕ △","✕ △ △"]; // U O S L M
const qSymbols=n=>Q(n,[["a)","✕ △ △",T("m",2)],["","✕ △ ✕",T("u",2)],["","△ △ ✕",T("s",2)],
  ["b)","S =",MC(SYMS,2)],["","O =",MC(SYMS,1)],["","L =",MC(SYMS,3)]],
  "a) M, U, S<br>b) S = △ △ ✕, O = ✕ ✕ △, L = △ ✕ △");
const qAABC=n=>Q(n,[[null,"Vilken rad är ordnad som A A B C?",MC(["Raden med moln och hjärtan","Raden med fyrkanter","Raden med stjärnor"],2)]],
  "Raden med stjärnor: stjärna, stjärna, måne, sol. Två lika, sedan två olika, precis som A A B C.");
const qRepeat=(n,txt)=>Q(n,[[null,"Rita på papper.",SELF()]],txt);
const qTalOrdning=n=>Q(n,[["a)","",[N(14,3),N(15,3),N(40,3),N(41,3),N(50,3)]],["b)","",[N(158,4),N(185,4),N(510,4),N(815,4),N(851,4)]]],"a) 14, 15, 40, 41, 50<br>b) 158, 185, 510, 815, 851");
const qPlats=n=>Q(n,[["a)","Svar:",N(627)],["b)","Svar:",N(430)],["c)","Svar:",N(805)],["d)","Svar:",N(139)],["e)","Svar:",N(204)]],"a) 627&nbsp; b) 430&nbsp; c) 805&nbsp; d) 139&nbsp; e) 204");
const O4=["643","784","430","207"];
const qStreck=n=>Q(n,[[null,"Talet har inga ental:",MC(O4,2)],[null,"Dubbelt så många tiotal som ental:",MC(O4,1)],[null,"Fler ental än hundratal:",MC(O4,3)],[null,"Hälften så många ental som hundratal:",MC(O4,0)]],
  "Inga ental: 430. Dubbelt så många tiotal som ental: 784 (8 tiotal, 4 ental). Fler ental än hundratal: 207. Hälften så många ental som hundratal: 643 (6 hundratal, 3 ental).");
const qLinje1=n=>Q(n,[[null,"Dra strecken på papper.",SELF()]],"Varje streck är 5 steg: 5, 10, 15, 20, 25, 30, 35. 15 hör till det tredje strecket och 30 till det näst sista.");
const qLinje2=n=>Q(n,[[null,"Dra strecken på papper.",SELF()]],"Varje litet streck är 2 steg. 4 är det andra lilla strecket efter 0. 16 är det tredje lilla strecket efter 10. 23 ligger mitt emellan strecken för 22 och 24.");
const cardOK=(v,list)=>list.includes(String(toNum(v)));
const qKort=n=>Q(n,[["a)","Udda tal:",FREE(4)],["b)","Jämnt tal:",FREE(4)]],"a) 305 eller 503<br>b) 350 eller 530",v=>[cardOK(v[0],["305","503"]),cardOK(v[1],["350","530"])]);
const pG7=(a,b,c)=>[7,[Q("9",[["a)","",N(a[0],5)],["b)","",N(a[1])],["c)","",N(a[2])],["d)","",N(a[3])]],`a) ${a[0]}&nbsp; b) ${a[1]}&nbsp; c) ${a[2]}&nbsp; d) ${a[3]}`),
  Q("10",[["a)","",N(b[0])],["b)","",N(b[1])],["c)","",N(b[2])],["d)","",N(b[3])]],`a) ${b[0]}&nbsp; b) ${b[1]}&nbsp; c) ${b[2]}&nbsp; d) ${b[3]}`),
  Q("11",[["a)","",N(c[0])],["b)","",N(c[1])],["c)","",N(c[2])],["d)","",N(c[3])]],`a) ${c[0]}&nbsp; b) ${c[1]}&nbsp; c) ${c[2]}&nbsp; d) ${c[3]}`)]];
const muffins=n=>Q(n,[[null,"Nova hade",FREE(),"muffins."],[null,"Troj hade",FREE(),"muffins."]],"Nova ska ha 2 fler än Troj. T.ex. Nova 7 och Troj 5. Då har båda 6 efteråt.",
  v=>{const a=toNum(v[0]),b=toNum(v[1]);const ok=b>=0&&a===b+2;return[ok,ok]});
const SF=["Sant","Falskt"];
const OPS=["−","+","·","="];
function signOK(a,b,c,i1,i2){if(i1==null||i2==null)return false;const s1=OPS[i1],s2=OPS[i2],ap=(x,o,y)=>o==="+"?x+y:o==="−"?x-y:x*y;
  if(s1==="="&&s2!=="=")return a===ap(b,s2,c);if(s2==="="&&s1!=="=")return ap(a,s1,b)===c;return false}

const EXAMS={
"2019-B":[
  [3,[qTalOrdning("1"),qPlats("2")]],
  [4,[qStreck("3")]],
  [5,[qLinje1("4"),qLinje2("5"),SVAR("6",N(2),"2, mitt emellan 0 och 4"),SVAR("7",N(5),"5, mitt emellan 3 och 7")]],
  [6,[(()=>{const o=["10 · 5","10 + 5","10 − 5",frac(10,5)];return Q("8",[["a)","Sara (klubbor):",MC(o,2)],["","Troj (äpplen):",MC(o,0)],["","Nova (kulor):",MC(o,3)],["b)","Skriv en räknehändelse på papper.",SELF()]],
    "a) Sara: 10 − 5. Troj: 10 · 5. Nova: 10/5. Uttrycket 10 + 5 blir över.<br>b) T.ex. Amir har 10 kulor och får 5 till. Hur många kulor har han nu?")})()]],
  [7,[qKort("9")]]],
"2019-C":[
  [3,[SVAR("1",N(42),"25 + 17 = 42 poäng","poäng"),SVAR("2",N(24),"56 − 32 = 24 bruna kaniner"),SVAR("3",N(17),"25 − 8 = 17 cm","cm")]],
  [4,[SVAR("4",N(22),"28 − 6 = 22 fåglar"),SVAR("5",N(16),"29 − 13 = 16 färre vita möss"),SVAR("6",N(6),"18 / 3 = 6 burar","burar")]],
  [5,[SVAR("7",N(16),"En kanin har 4 ben. 4 · 4 = 16 ben","ben"),SVAR("8",N(15),"30 / 2 = 15 kronor","kr")]]],
"2019-D":[
  [3,[SVAR("1",TM(620),"09.00 + 1 timme = 10.00. Plus 20 minuter = 10.20"),SVAR("2",TM(705),"En kvart är 15 minuter. 11.30 + 15 min = 11.45"),
    Q("3",[[null,"",MC(["10 sekunder","20 minuter","10 timmar"],1)]],"20 minuter"),Q("4",[[null,"",MC(["5 sekunder","5 minuter","5 timmar"],1)]],"5 minuter")]],
  [4,[Q("5",[[null,"Ett år är",N(12),"månader."],[null,"En vecka är",N(7),"dagar."],[null,"En timme är",N(60),"minuter."]],"12 månader, 7 dagar, 60 minuter"),
    Q("6",[["a)","Svar:",T("januari",9)],["b)","Svar:",T("juni",9)]],"a) Januari (två månader före mars)<br>b) Juni (tre månader efter mars)")]],
  [5,[Q("7",[[null,"",MC(["Lika mycket i båda glasen","Mest saft i glas A","Mest saft i glas B"],1)],[null,"Förklara på papper.",SELF()]],"Mest saft i glas A. Saften står lika högt i båda glasen, men glas A är bredare."),
    Q("8",[[null,"En mugg 2",dl()],[null,"En kanna saft 1",li()],[null,"En stor hink 10",li()],[null,"En burk läsk 3",dl()]],"Mugg 2 dl, kanna 1 liter, hink 10 liter, burk läsk 3 dl")]],
  [6,[Q("9",[["a)","Svar:",N(12),"dl"],["b)","",MC(["1 liter","2 liter","4 liter","12 liter"],0)]],"a) 4 · 3 = 12 dl<br>b) 10 dl är 1 liter, så 12 dl är ungefär 1 liter."),
    SVAR("10",N(20),"10 + 10 + ... = 200. 20 hinkar (20 · 10 = 200)","hinkar")]]],
"2019-E":[
  [3,[SVAR("1",N(12),"3 · 4 = 12 fiskar","fiskar"),
    Q("2",[[null,"Nova har",FREE(),"fiskar."],[null,"Melvin har",FREE(),"fiskar."],[null,"Troj har",FREE(),"fiskar."]],"Det finns flera svar: 1, 1, 6 eller 2, 2, 4 eller 3, 3, 2.",
      v=>{const n=v.map(toNum);const ok=n.every(x=>x>=1)&&n[0]===n[1]&&n[0]+n[1]+n[2]===8;return[ok,ok,ok]})]],
  [4,[Q("3",[["a)","Svar:",N(7),"ben"],["b)","Svar:",N(3),"påsar"]],"a) En vecka har 7 dagar, alltså 7 ben.<br>b) 14 ben behövs. 2 påsar är 10 ben och räcker inte. 3 påsar är 15 ben och räcker."),
    SVAR("4",N(80),"50 + 10 + 20 = 80 kr","kr")]],
  [5,[Q("5",[["a)","",N(6),"hopp"],["b)","",N(12),"hopp"],["c)","",N(5),"hopp"]],"a) 6&nbsp; b) 12&nbsp; c) 5"),
    Q("6",[[null,"Växter:",FREE(),"st"],[null,"Fiskar:",FREE(),"st"]],"Det ska kosta mer än 95 kr och högst 120 kr. T.ex. 2 växter och 2 fiskar (100 kr), 1 växt och 4 fiskar (110 kr), 3 växter och 1 fisk (110 kr), 2 växter och 3 fiskar (120 kr).",
      v=>{const a=toNum(v[0]),b=toNum(v[1]),c=30*a+20*b;const ok=a>=1&&b>=1&&c>95&&c<=120;return[ok,ok]})]],
  [6,[SVAR("7",N(21),"Sara köpte 12 fiskar. 6 + 12 + 3 = 21 fiskar","fiskar")]]],
"2019-F":[
  [2,[CALC("1",96,"+",87),CALC("2",138,"+",56),CALC("3",141,"+",59)]],
  [3,[CALC("4",68,"+",107),CALC("5",124,"+",78)]],
  [4,[CALC("6",90,"-",23),CALC("7",77,"-",29),CALC("8",200,"-",64)]],
  [5,[CALC("9",127,"-",68),CALC("10",178,"-",39)]]],
"2019-G":[
  [2,[qRepeat("1","△ ○ ✕ ska ritas i båda tomma rutorna."),qRepeat("2","□ ✕ ○ ska ritas i alla tomma rutor.")]],
  [3,[qSymbols("3")]],
  [4,[qAABC("4"),Q("5",[[null,"Fyll i på papper.",SELF()]],"Mönstret är svart, röd, blå, gul om och om igen. De vita fälten blir, medurs från det övre till höger: röd, gul, svart, blå, röd.")]],
  [5,[Q("6",[["a)","🐟 =",N(3)],["b)","🐭 =",N(5)],["c)","🐱 =",N(10)]],"Fisken är 3 (3 + 3 = 6). Musen är 5 (5 + 3 = 8). Katten är 10 (10 + 3 = 13)."),
    Q("7",[[null,"🦜 =",N(12)]],"Kaninen är 6 (6 + 6 + 6 = 18). Papegojan är 12 (6 + 12 = 18).")]],
  [6,[Q("8",[["a)","🍏 =",N(5)],["b)","🥕 =",N(2)],["c)","🦴 =",N(7)]],"Äpplet är 5 (5 + 5 = 10). Moroten är 2 (2 + 3 = 5). Benet är 2 + 5 = 7.")]],
  pG7([800,21,17,62],[4,5,6,10],[5,3,7,17])],
"2020-B":[
  [3,[Q("1",[["a)","Hur hög ska stapeln för mål vara?",N(3)],["","Bollar?",N(6)],["","Rockringar?",N(12)],["b)","Svar:",N(11)],["c)","Svar:",N(2)],["d)","",MULTI(["Mål","Klubbor","Hopprep","Bollar","Styltor","Rockringar"],[1,3])]],
    "a) Mål 3, bollar 6, rockringar 12<br>b) 3 + 8 = 11<br>c) 12 − 10 = 2<br>d) Klubbor och bollar (6 av varje)")]],
  [4,[Q("2",[["a)","Svar:",N(2)],["b)","Svar:",N(4)],["c)","",MULTI(["Mål","Klubbor","Hopprep","Bollar","Styltor","Rockringar"],[3])],["d)","Svar:",N(120),"kr"],["e)","Svar:",N(15)]],
    "a) 6 − 4 = 2&nbsp; b) 10 − 6 = 4&nbsp; c) Bollar (2 st)<br>d) 3 · 40 = 120 kr&nbsp; e) 12 + 3 = 15")]],
  [5,[Q("3",[["a)","Ahmed, första hoppet:",N(105),"cm"],["b)","Ahmed, andra hoppet:",N(164),"cm"],["c)","Melker, tredje hoppet:",N(167),"cm"]],"a) 105 cm&nbsp; b) 105 + 59 = 164 cm&nbsp; c) 163 + 4 = 167 cm"),
    Q("4",[["a)","Svar:",N(163),"cm"],["b)","Svar:",N(70),"cm"],["c)","Svar:",N(23),"cm"]],"a) 163 cm&nbsp; b) 179 − 109 = 70 cm&nbsp; c) 179 − 156 = 23 cm")]]],
"2020-C":[
  [3,[SVAR("1",N(42),"25 + 17 = 42 poäng","poäng"),SVAR("2",N(24),"56 − 32 = 24 barn","barn"),SVAR("3",N(17),"25 − 8 = 17 m","m")]],
  [4,[SVAR("4",N(22),"28 − 6 = 22 elever","elever"),SVAR("5",N(16),"29 − 13 = 16 färre vita bollar"),SVAR("6",N(6),"18 / 3 = 6 grupper","grupper")]],
  [5,[SVAR("7",N(40),"10 · 4 = 40 pennor","pennor"),SVAR("8",N(15),"30 / 2 = 15 kulor","kulor")]]],
"2020-D":[
  [3,[Q("1",[[null,"Klot",T("b",2)],[null,"Cylinder",T("d",2)],[null,"Rätblock",T("c",2)],[null,"Pyramid",T("a",2)]],"Klot B, cylinder D, rätblock C, pyramid A"),
    Q("2",[[null,"Rita på papper.",SELF()]],"Kvadraten har fyra lika långa sidor och räta hörn. Den ritade linjen är en av sidorna."),
    Q("3",[[null,"Cirkeln:",T("cirkel",10)],[null,"Den spetsiga:",T(["triangel","trekant","trehörning"],10)],[null,"Den avlånga:",T("rektangel",10)],[null,"Den med fem hörn:",T(["femhörning","pentagon"],10)]],"Cirkel, triangel, rektangel, femhörning")]],
  [4,[(()=>{const o=["Figur 1","Figur 2","Figur 3","Figur 4"];return Q("4",[[null,"Figurerna räknas från vänster.",null],[null,"Den har tre sidor:",MULTI(o,[2,3])],[null,"Den har fyra hörn:",MULTI(o,[0,1])],[null,"Den har alla sidor lika långa:",MULTI(o,[1])]],
    "Tre sidor: de två trianglarna (figur 3 och 4). Fyra hörn: figur 1 och 2. Alla sidor lika långa: bara kvadraten (figur 2).")})(),
    Q("5",[[null,"Skriv på papper.",SELF()]],"T.ex. A har sex hörn och sex sidor, men B har tre. A har lika långa sidor, B har olika långa sidor.")]],
  [5,[Q("6",[[null,"<i>Mät med linjal på ett utskrivet prov. På skärmen stämmer inte centimetrarna.</i><br>Svar:",FREE(4),"cm"]],"6 + 3 + 5 = 14 cm",v=>{const x=toF(v[0]);return[x>=13&&x<=14.5]}),
    Q("7",[[null,"Svar:",FREE(4),"cm"]],"Alla fyra sidor är 3 cm. 3 + 3 + 3 + 3 = 12 cm",v=>{const x=toF(v[0]);return[x>=11.5&&x<=12.5]}),
    Q("8",[[null,"",MULTI(["A","B","C"],[0,2])]],"A och C. A: 3 + 3 + 3 + 3 = 12 cm. C: 1 + 5 + 1 + 5 = 12 cm. B: 2 + 3 + 2 + 3 = 10 cm.")]],
  [6,[Q("9",[[null,"",MC(["Den blå rektangeln","Den rosa åttahörningen","Den gula figuren"],0)]],"Den blå rektangeln: 8 rutor. Åttahörningen är 7 rutor och den gula figuren 6 rutor."),
    Q("10",[[null,"",MULTI(["A","B","C"],[1,2])]],"B och C. B är 4 · 4 = 16 rutor och C är 2 · 8 = 16 rutor. A är 5 · 3 = 15 rutor.")]]],
"2020-E":[
  [3,[SVAR("1",N(12),"4 · 3 = 12 böcker","böcker"),Q("2",[[null,"Röda",N(2)],[null,"Gula",N(4)],[null,"Svarta",N(3)]],"Röda 2, gula 2 · 2 = 4, svarta 9 − 2 − 4 = 3")]],
  [4,[SVAR("3",N(9),"18 / 2 = 9 elever","elever"),SVAR("4",N(5),"15 / 3 = 5 elever","elever")]],
  [5,[muffins("5"),SVAR("6",N(3),"3 · 5 = 15 bollar räcker till 3 klasser. 1 boll blir över.","klasser")]],
  [6,[Q("7",[[null,"Arvid har lika många som de andra tillsammans:",MC(SF,0)],[null,"Mia har dubbelt så många som Sara:",MC(SF,1)],[null,"Neo har hälften så många som Mia:",MC(SF,1)],[null,"Tillsammans har barnen 36 kulor:",MC(SF,0)]],
    "Sant (3 + 9 + 6 = 18). Falskt (dubbelt av 6 är 12). Falskt (hälften av 9 är inte 3). Sant (18 + 3 + 9 + 6 = 36)."),
    SVAR("8",N(18),"7 långa och 14 korta är 21 hopprep. 21 − 3 = 18","hopprep")]]],
"2020-F":[
  [2,[CALC("1",96,"+",87),CALC("2",138,"+",56),CALC("3",141,"+",59)]],
  [3,[CALC("4",68,"+",107),CALC("5",124,"+",78)]],
  [4,[CALC("6",90,"-",23),CALC("7",77,"-",29),CALC("8",200,"-",64)]],
  [5,[CALC("9",127,"-",68),CALC("10",178,"-",49)]]],
"2020-G":[
  (()=>{const D=[1,3,5,7,10],ok3=(v,s)=>{const n=v.map(toNum);return n.every(x=>D.includes(x))&&n.reduce((a,b)=>a+b,0)===s};
   return[3,[Q("1",[["a)","",[FREE(),FREE(),FREE()]],["b)","",[FREE(),FREE(),FREE()]],["c)","5",[FREE(),FREE()]]],
     "a) T.ex. 5 + 5 + 5 eller 7 + 7 + 1 eller 10 + 3 + ... (flera svar)<br>b) T.ex. 7 + 7 + 7 eller 10 + 10 + 1<br>c) 10 och 3 (5 + 10 + 3 = 18)",
     v=>{const a=ok3(v.slice(0,3),15),b=ok3(v.slice(3,6),21),n=v.slice(6).map(toNum),c=n.every(x=>D.includes(x))&&n[0]+n[1]===13;return[a,a,a,b,b,b,c,c]}),
    Q("2",[["a)","2 lag med",N(6),"elever i varje."],["b)","",FREE(),"lag med"],["","",FREE(),"elever i varje."]],"a) 6 elever<br>b) T.ex. 3 lag med 4, 4 lag med 3, 6 lag med 2 eller 12 lag med 1",
      v=>{const a=toNum(v[1]),b=toNum(v[2]);const ok=a*b===12&&a!==2;return[undefined,ok,ok]})]]})(),
  (()=>{const S=[202,98,397,301],pair=(v,t)=>{const n=v.map(toNum);return n.every(x=>S.includes(x))&&Math.abs(n[0]+n[1]-t)<=10};
   return[4,[Q("3",[[null,"",FREE(4),"och"],[null,"",FREE(4)]],"98 och 301 (98 + 301 = 399, ungefär 400)",v=>{const o=pair(v,400);return[o,o]}),
     Q("4",[[null,"",FREE(4),"och"],[null,"",FREE(4)]],"202 och 397 (202 + 397 = 599, ungefär 600)",v=>{const o=pair(v,600);return[o,o]})]]})(),
  [5,[Q("5",[[null,"Till simhallen ungefär 100 m:",MC(SF,0)],[null,"Till fotbollsplanen ungefär 150 m:",MC(SF,0)],[null,"Till parken ungefär 200 m:",MC(SF,1)]],
    "Sant (103 m). Sant (103 + 48 = 151 m). Falskt (103 + 48 + 154 = 305 m, ungefär 300 m)."),
    (()=>{const o=["Bild 1","Bild 2","Bild 3","Bild 4"];return Q("6",[[null,"Bilderna räknas uppifrån.",null],[null,"Mia (en tredjedel):",MC(o,3)],[null,"Sara (halva):",MC(o,1)],[null,"Karim (en fjärdedel):",MC(o,2)]],
      "Mia: bild 4. Sara: bild 2. Karim: bild 3. Bild 1 blir över (där är tre fjärdedelar kvar).")})()]],
  [6,[Q("7",[[null,"Spadar",N(5)],[null,"Krattor",N(5)],[null,"Hinkar",N(10)]],"En fjärdedel av 20 är 5. Spadar 5, krattor 5, hinkar 20 − 10 = 10"),
    Q("8",[[null,"Svar:",T(["en fjärdedel","fjärdedel","1/4","en fjärdedel av flaggan","1 fjärdedel","en fjärde del"],12)]],"En fjärdedel. En fjärdedel röd + två fjärdedelar blå = tre fjärdedelar. Det som är kvar är en fjärdedel.")]],
  pG7([800,21,17,62],[4,5,6,10],[5,3,7,17])],
"2021-B":[
  [3,[qRepeat("1","△ ○ ✕ ska ritas i båda tomma rutorna."),qRepeat("2","□ ✕ ○ ska ritas i alla tomma rutor.")]],
  [4,[qAABC("3"),Q("4",[[null,"Fyll i på papper.",SELF()]],"Mönstret är blå, röd, svart, gul om och om igen. Rutan efter den översta blå blir röd. Den vita längst ner blir röd. På vänster sida blir de vita, nerifrån och upp: blå, svart, gul.")]],
  [5,[qSymbols("5")]],
  [6,[["6",f=>{const A=["↑","↓","←","→"],m=i=>f(SEL(A,i)),w=x=>`<span class="arrowbox">${x}</span>`;
    return{html:`<div class="sub"><span class="lbl">a)</span><span class="sc">${w("↑")} ${m(0)} ${w("→")} ${m(3)} ${m(3)} ${w("↓")}</span></div><div class="sub"><span class="lbl">b)</span><span class="sc">${m(0)} ${w("←")} ${m(2)} ${m(0)} ${m(0)}</span></div>`,
    facit:"a) ↑ ↑ → → → ↓<br>b) ↑ ← ← ↑ ↑"}}]]],
  [7,[Q("7",[["a)","🍏 =",N(5)],["b)","🥕 =",N(2)],["c)","🍌 =",N(7)]],"Äpplet är 5, moroten är 2, bananen är 2 + 5 = 7."),
    Q("8",[["a)","8 = 6 +",N(2),""],["","=",N(4),"+ 4"],["b)","12 =",[FREE(),FREE()],""],["","=",N(9),"+ 3"]],"a) 8 = 6 + 2 = 4 + 4<br>b) T.ex. 12 = 10 + 2 = 9 + 3",
      v=>{const s=toNum(v[2])+toNum(v[3])===12;return[undefined,undefined,s,s,undefined]})]]],
"2021-C":[
  [3,[SVAR("1",N(75),"38 + 37 = 75 poäng","poäng"),SVAR("2",N(23),"47 − 24 = 23 fler päron"),SVAR("3",N(16),"23 − 7 = 16 gosedjur","gosedjur")]],
  [4,[Q("4",[[null,"",MC(["9 + 3","9 − 3","9 · 3",frac(9,3)],2)]],"9 · 3"),Q("5",[[null,"",MC(["30 + 10","30 − 10","30 · 10",frac(30,10)],3)]],frac(30,10)),
    Q("6",[["a)","12 =",[FREE(),FREE()]],["b)","",[FREE(),FREE()],"= 12"],["c)","12 =",[FREE(),FREE()]],["d)","",[FREE(),FREE()],"(täljare, nämnare) = 12"]],
      "Många svar. T.ex. 12 = 10 + 2, 15 − 3 = 12, 12 = 3 · 4, 24/2 = 12",
      v=>{const n=v.map(toNum),A=n[0]+n[1]===12,B=n[2]-n[3]===12,C=n[4]*n[5]===12,D=n[7]>0&&n[6]/n[7]===12;return[A,A,B,B,C,C,D,D]})]],
  [5,[["7",f=>{const rows=[[6,2,12],[12,4,8],[9,3,3],[4,2,2]];
    return{html:rows.map((r,i)=>`<div class="sub"><span class="lbl">${L[i]})</span><span class="sc">${r[0]} ${f(SEL(OPS,-1))} ${r[1]} ${f(SEL(OPS,-1))} ${r[2]}</span></div>`).join(""),
      facit:"a) 6 · 2 = 12<br>b) 12 − 4 = 8 eller 12 = 4 + 8<br>c) 9 = 3 · 3<br>d) 4 = 2 + 2, 4 = 2 · 2 eller 4 − 2 = 2",
      check:v=>{const out=[];rows.forEach((r,i)=>{const ok=signOK(r[0],r[1],r[2],v[2*i],v[2*i+1]);out.push(ok,ok)});return out}}}],
    Q("8",[[null,"",MULTI(["108 − 103","101 − 97","12 − 9","27 − 4","39 − 36","23 − 19"],[1,5])]],"101 − 97 och 23 − 19")]]],
"2021-D":[
  [2,[Q("1",[["a)","Milos väska har nummer",N(9)],["b)","Trojs väska har nummer",N(5)],["c)","Skriv på papper.",SELF()]],"a) 9 (bakom väska 13)<br>b) 5 (ovanpå väska 17)<br>c) T.ex. På översta hyllan längst till vänster, framför den stora blå väskan.")]],
  [3,[Q("2",[[null,"Plats 1:",T("troj",6)],[null,"Plats 2:",T("leo",6)],[null,"Plats 3:",T("amir",6)],[null,"Plats 4:",T("nova",6)],[null,"Plats 5:",T("hanna",6)]],
    "Troj, Leo, Amir, Nova, Hanna (från vänster). Troj sitter under bollen, Amir under hatten, Leo mellan dem, Nova mitt emot Amir och Hanna bakom Nova.")]],
  [4,[Q("3",[[null,"",MULTI(["Gå på bio","Äta en banan","Gå i skolan en dag","Sova en natt","Ta en bild","Titta på en karta"],[1,4,5])]],"Äta en banan, ta en bild och titta på en karta."),
    Q("4",[["a)","Svar:",TM(465)],["b)","Svar:",TM(510)]],"a) 7.45 (en kvart före 8.00)<br>b) 8.30")]],
  [5,[SVAR("5",TM(720),"11.20 + 40 minuter = 12.00"),
    (()=>{const m=[25,30,15,20,10,5];return Q("6",[[null,"",MULTI(["Fia med knuff 25 min","Bingo 30 min","Fika 15 min","Läsa en bok 20 min","Kort 10 min","Tre-i-rad 5 min"],[])]],
      "Flera svar. Det ska bli 60 minuter, t.ex. bingo + fia med knuff + tre-i-rad (30 + 25 + 5), eller bingo + läsa + kort (30 + 20 + 10).",
      v=>[Array.isArray(v[0])&&v[0].reduce((s,i)=>s+m[i],0)===60])})()]],
  [6,[(()=>{return Q("7",[[null,"Ryggsäcken och",MC(["tofflorna","gemet","biobiljetten","juicepaketet","boken"],3)],[null,"Tofflorna och",MC(["ryggsäcken","gemet","biobiljetten","juicepaketet","boken"],4)],[null,"Gemet och",MC(["ryggsäcken","tofflorna","biobiljetten","juicepaketet","boken"],2)]],
      "Ryggsäcken och juicepaketet (tunga). Tofflorna och boken. Gemet och biobiljetten (mycket lätta).")})(),
    Q("8",[[null,"Ett bord 18",kg()],[null,"En mobiltelefon 170",gr()],[null,"En cykel 13",kg()],[null,"En gaffel 32",gr()],[null,"En apelsin 210",gr()]],"Bord 18 kg, mobil 170 g, cykel 13 kg, gaffel 32 g, apelsin 210 g")]],
  [7,[Q("9",[[null,"",MC(["Låda A väger mest","Båda väger lika mycket","Låda B väger mest"],2)],[null,"Förklara på papper.",SELF()]],"Låda B väger mest. Låda A väger lika mycket som 3 klossar och låda B lika mycket som 6 klossar.")]]],
"2021-E":[
  [2,[SVAR("1",N(12),"En kanin har 4 ben. 3 · 4 = 12 ben","ben"),SVAR("2",N(8),"4 · 5 = 20 kakor. 20 − 12 = 8 kakor","kakor")]],
  [3,[Q("3",[[null,"Svarta",N(5)],[null,"Bruna",N(4)],[null,"Vita",N(2)]],"Svarta 5. Då är 6 kvar. Vita 2 och bruna 4 (dubbelt så många)."),SVAR("4",N(25),"Smörgåsen kostar 15 kr. 10 + 15 = 25 kr","kr")]],
  [4,[Q("5",[["a)","Svar:",N(4),"äpplen"],["b)","Svar:",N(3),"äpplen"],["c)","Svar:",N(30),"kr"]],"Ett äpple kostar 6 kr.<br>a) 24 / 6 = 4&nbsp; b) 18 / 6 = 3&nbsp; c) 5 · 6 = 30 kr")]],
  [5,[muffins("6"),SVAR("7",N(7),"De äter 6 plommon. 20 − 6 = 14. 14 / 2 = 7 plommon i varje påse","plommon")]]],
"2021-F":[
  [2,[Q("1",[[null,"Rita på papper, eller skriv antal stenar. Hundratal",N(1,2)],[null,"Tiotal",N(2,2)],[null,"Ental",N(7,2)]],"1 sten i hundratal, 2 i tiotal, 7 i ental"),
    Q("2",[[null,"Hundratal",N(3,2)],[null,"Tiotal",N(4,2)],[null,"Ental",N(0,2)]],"3 stenar i hundratal, 4 i tiotal och inga i ental. Troj hade lagt 4 stenar som ental i stället för tiotal.")]],
  [3,[Q("3",[["a)","Svar:",N(213)],["b)","Svar:",N(245)]],"a) 213&nbsp; b) 213 + 32 = 245"),Q("4",[["a)","Svar:",N(238)],["b)","Svar:",N(241)]],"a) 238&nbsp; b) 238 + 3 = 241")]],
  [4,[Q("5",[[null,"Amir sitter på plats",N(253)],[null,"Mia sitter på plats",N(275)],[null,"Olle sitter på plats",N(381)],[null,"Hanna sitter på plats",N(326)]],"Amir 253, Mia 275, Olle 381, Hanna 326. Plats 342 är ledig."),
    Q("6",[[null,"",FREE(4),"och"],[null,"",FREE(4)]],"Två av: 216, 261, 612, 621",v=>{const s=["216","261","612","621"],a=String(toNum(v[0])),b=String(toNum(v[1]));const ok=s.includes(a)&&s.includes(b)&&a!==b;return[ok,ok]}),
    Q("7",[["a)","Svar:",N(345)],["b)","Svar:",N(543)]],"a) 345&nbsp; b) 543")]],
  [5,[CALC("8",86,"+",97),CALC("9",135,"+",68),CALC("10",180,"-",34)]],
  [6,[CALC("11",177,"-",129),CALC("12",200,"-",67),CALC("13",128,"-",59)]]],
"2021-G":[
  [2,[Q("1",[[null,"Olle står på",ORD("andra"),"plats."],[null,"Lisa står på",ORD("sjunde"),"plats."],[null,"Amir står på",ORD("sjätte"),"plats."],[null,"Den sista står på",ORD("nionde"),"plats."]],
    "Kön börjar hos Hanna (längst till höger). Olle andra, Lisa sjunde, Amir sjätte, den sista nionde.")]],
  [3,[Q("2",[[null,"Vilket datum skriver du O på?",N(6)],[null,"H?",N(17)],[null,"E?",N(31)],[null,"J?",N(11)]],"O på 6, H på 17, E på 31, J på 11")]],
  [4,[Q("3",[[null,"Plats 1",T("hanna",7)],[null,"Plats 2",T("troj",7)],[null,"Plats 3",T("erik",7)],[null,"Plats 4",T("nova",7)]],"1 Hanna, 2 Troj, 3 Erik, 4 Nova"),
    Q("4",[["a)","80 +",N(20),"= 100"],["b)","100 =",N(45),"+ 55"],["c)","100 = 23 +",N(77)],["d)","8 +",N(92),"= 100"]],"a) 20&nbsp; b) 45&nbsp; c) 77&nbsp; d) 92"),
    Q("5",[["a)","100 − 36 =",N(64)],["b)","100 −",N(96),"= 4"]],"a) 64&nbsp; b) 96")]],
  [5,[Q("6",[[null,"Förslag 1: stjärnor",FREE(2),""],[null,"månar",FREE(2),""],[null,"cirklar",FREE(2),""],[null,"Förslag 2: stjärnor",FREE(2),""],[null,"månar",FREE(2),""],[null,"cirklar",FREE(2),""]],
    "Många svar, t.ex. 3 stjärnor (50 + 50 + 50), 5 månar (5 · 30), 6 cirklar (6 · 25), 2 stjärnor + 2 cirklar, 1 stjärna + 4 cirklar. Skriv 0 om du inte använder en figur.",
    v=>{const n=v.map(x=>{const t=toNum(x);return isNaN(t)?0:t});const s1=50*n[0]+30*n[1]+25*n[2]===150,s2=50*n[3]+30*n[4]+25*n[5]===150,diff=n.slice(0,3).join()!==n.slice(3).join();const a=s1,b=s2&&diff;return[a,a,a,b,b,b]})]],
  [6,[Q("7",[[null,"",MC(["10","50","100","200"],2)]],"Ungefär 100. Man ser ungefär 10 blommor. Hela lådan är ungefär 10 gånger så stor."),
    Q("8",[[null,"",MC(["20","200","500","1000"],1)]],"Ungefär 200. Högen i paket B är ungefär en femtedel så hög som i paket A.")]],
  pG7([16,12,18,80],[5,3,7,9],[7,6,9,18])],
"2022-F":[
  [2,[CALC("1",86,"+",97),CALC("2",135,"+",68),CALC("3",180,"-",34)]],
  [3,[CALC("4",177,"-",129),CALC("5",200,"-",67),CALC("6",128,"-",59)]]],
"2022-G":[
  [3,[qTalOrdning("1"),qPlats("2")]],
  [4,[qStreck("3")]],
  [5,[qLinje1("4"),qLinje2("5"),SVAR("6",N(2),"2, mitt emellan 0 och 4"),SVAR("7",N(5),"5, mitt emellan 3 och 7")]],
  [6,[qKort("8")]],
  pG7([16,12,18,80],[5,3,8,9],[6,2,9,18])]
};
