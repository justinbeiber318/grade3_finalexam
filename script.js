/*
  TEACHER EDIT AREA
  Replace the empty question arrays below with the actual questions from your PDF.
  Do not invent questions if the source does not provide them.
*/
const listenTickQuestions = [
  {text:"Question 1", options:[
    {label:"a", image:"images/1a.png"},
    {label:"b", image:"images/1b.png"}
  ], answer:"A"},
  {text:"Question 2", options:[
    {label:"a", image:"images/2a.png"},
    {label:"b", image:"images/2b.png"}
  ], answer:"B"},
  {text:"Question 3", options:[
    {label:"a", image:"images/3a.png"},
    {label:"b", image:"images/3b.png"}
  ], answer:"A"},
  {text:"Question 4", options:[
    {label:"a", image:"images/4a.png"},
    {label:"b", image:"images/4b.png"}
  ], answer:"B"}
];

const listenYNQuestions = [
  {text:"Question 1", image:"images/q2.1.png", answer:"Y"},
  {text:"Question 2", image:"images/q2.2.png", answer:"N"},
  {text:"Question 3", image:"images/q2.3.png", answer:"N"},
  {text:"Question 4", image:"images/q2.4.png", answer:"Y"}
];

const readingTFQuestions = [
  {number:6, text:"Mai is eight years old.", answer:"T"},
  {number:7, text:"There are five people in Mai's family.", answer:"F"},
  {number:8, text:"Her father is a doctor.", answer:"T"},
  {number:9, text:"Her mother is a nurse.", answer:"F"},
  {number:10, text:"Her brother is eleven years old.", answer:"T"}
];

const writingAnswers = ["bed", "doctor", "cats", "riding", "climbing"];

function normalizeWritingAnswer(value){
  return value
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^a\s+/, "")
    .replace(/^an\s+/, "")
    .replace(/^the\s+/, "");
}

const grammarQuestions = [
  {text:"This is my ______.", options:["A. mother", "B. mothers", "C. mother is"], answer:"A"},
  {text:"He ______ a doctor.", options:["A. am", "B. is", "C. are"], answer:"B"},
  {text:"They ______ my friends.", options:["A. am", "B. is", "C. are"], answer:"C"},
  {text:"______ your father's job?", options:["A. What's", "B. Who", "C. Where"], answer:"A"},
  {text:"My mother is ______ teacher.", options:["A. a", "B. an", "C. two"], answer:"A"},
  {text:"There ______ two cats in the garden.", options:["A. am", "B. is", "C. are"], answer:"C"},
  {text:"______ you like some milk?", options:["A. Would", "B. Are", "C. Is"], answer:"A"},
  {text:"I have ______ dog.", options:["A. a", "B. an", "C. are"], answer:"A"},
  {text:"The cat is ______ the table.", options:["A. in", "B. on", "C. at"], answer:"B"},
  {text:"What are you ______?", options:["A. do", "B. doing", "C. does"], answer:"B"},
  {text:"I am ______ a bike.", options:["A. ride", "B. rides", "C. riding"], answer:"C"},
  {text:"Can you ______ a kite?", options:["A. fly", "B. flying", "C. flies"], answer:"A"},
  {text:"I ______ two robots.", options:["A. has", "B. have", "C. having"], answer:"B"},
  {text:"She ______ a doll.", options:["A. have", "B. having", "C. has"], answer:"C"},
  {text:"______ are the dogs?", options:["A. Where", "B. What", "C. Who"], answer:"A"}
];

const SCORE_MAX = 70;

function renderMC(containerId, questions, prefix){
  const box=document.getElementById(containerId);
  if(!questions.length){
    box.innerHTML='<div class="notice">Questions will appear here after the teacher adds the exact items from the original test.</div>';
    return;
  }
  if(prefix==="yn") box.classList.add("yn-grid");
  questions.forEach((q,i)=>{
    const div=document.createElement('div'); div.className=prefix==="yn" ? 'yn-item' : 'q';
    if(prefix==="yn" && q.image){
      div.innerHTML=`<div class="yn-card"><img src="${q.image}" alt="${q.text}"><div class="yn-answer"><label><input type="checkbox" name="${prefix}${i}" value="Y"> Y. Yes</label><label><input type="checkbox" name="${prefix}${i}" value="N"> N. No</label></div></div>`;
      div.querySelectorAll(`input[name="${prefix}${i}"]`).forEach(input=>{
        input.addEventListener("change",()=>{
          if(input.checked){
            div.querySelectorAll(`input[name="${prefix}${i}"]`).forEach(other=>{
              if(other!==input) other.checked=false;
            });
          }
        });
      });
      box.appendChild(div);
      return;
    }
    const imageOptions=q.options.length && typeof q.options[0]==="object";
    const questionImage=q.image
      ? `<img class="yn-image" src="${q.image}" alt="${q.text}">`
      : '';
    const options=imageOptions
      ? `<div class="picture-options">${q.options.map(o=>`<label class="picture-option"><input type="radio" name="${prefix}${i}" value="${o.label.toUpperCase()}"><img src="${o.image}" alt="${q.text} - ${o.label}"><span class="picture-label">${o.label}</span></label>`).join('')}</div>`
      : q.options.map(o=>`<label class="option"><input type="radio" name="${prefix}${i}" value="${o.charAt(0)}"> ${o}</label>`).join('');
    div.innerHTML=`<div class="q-title">${q.number ?? i+1}. ${q.text}</div>${questionImage}${options}`;
    box.appendChild(div);
  });
}
renderMC("listenTick",listenTickQuestions,"lt");
renderMC("listenYN",listenYNQuestions.map(q=>({...q,options:["Y. Yes","N. No"]})),"yn");
renderMC("readingTF",readingTFQuestions.map(q=>({...q,options:["T. True","F. False"]})),"rtf");
renderMC("grammar",grammarQuestions,"grammar");

let seconds=60*60;
const timer=setInterval(()=>{
  seconds--;
  if(seconds<0){clearInterval(timer); document.getElementById("testForm").requestSubmit(); return;}
  const m=String(Math.floor(seconds/60)).padStart(2,"0");
  const s=String(seconds%60).padStart(2,"0");
  document.getElementById("time").textContent=`${m}:${s}`;
},1000);

document.getElementById("testForm").addEventListener("submit",e=>{
  e.preventDefault();
  clearInterval(timer);
  const name=document.getElementById("studentName").value.trim();
  if(!name){alert("Please enter your full name.");return;}
  let total=0, correct=0;
  const wrongAnswers=[];

  function grade(arr,prefix,section){
    arr.forEach((q,i)=>{
      total++;
      const input=document.querySelector(`input[name="${prefix}${i}"]:checked`);
        const chosen=input && input.checked ? input.value : "";
      if(chosen===q.answer){
        correct++;
      }else{
        wrongAnswers.push(`${section} - Câu ${q.number ?? i+1}: đáp án đúng ${q.answer}`);
      }
    });
  }
  grade(listenTickQuestions,"lt","Listening I");
  grade(listenYNQuestions,"yn","Listening II");
  grade(readingTFQuestions,"rtf","Reading II");
  grade(grammarQuestions,"grammar","Grammar");

  const writing=document.querySelectorAll('input[name^="w"]');
  const answered=[...writing].filter(x=>x.value.trim()).length;
  writingAnswers.forEach((answer,i)=>{
    total++;
    const rawValue=document.querySelector(`input[name="w${i+1}"]`).value;
    const value=normalizeWritingAnswer(rawValue);
    const accepted = new Set([
      answer,
      `a ${answer}`,
      `an ${answer}`,
      `the ${answer}`
    ]);
    if(accepted.has(value)){
      correct++;
    }else{
      wrongAnswers.push(`Writing - Câu ${i+11}: đáp án đúng ${answer}`);
    }
  });

  const result=document.getElementById("result");
  result.style.display="block";
  const score=total ? Math.round(correct / total * SCORE_MAX * 100) / 100 : 0;
  document.getElementById("score").textContent=total ? `${score}/${SCORE_MAX}` : "—";
  document.getElementById("resultText").textContent=
    `Student: ${name}. Auto-graded: ${correct}/${total} correct, converted to ${score}/${SCORE_MAX}. Speaking is not included in the automatic score.`;
  document.getElementById("wrongAnswers").innerHTML=wrongAnswers.length
    ? `<strong>Câu sai:</strong><br>${wrongAnswers.map(item=>`- ${item}`).join("<br>")}`
    : "<strong>Không có câu sai. Làm bài rất tốt!</strong>";
  result.scrollIntoView({behavior:"smooth"});
});
