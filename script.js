const params = new URLSearchParams(location.search);
const type = params.get("type") || "shiwake";

const quizInfo = {
  shiwake:{
    title:"仕訳クイズ",
    desc:"取引内容から正しい仕訳を選ぶクイズ"
  },
  kanjou:{
    title:"勘定科目クイズ",
    desc:"資産・負債・純資産・収益・費用を判定"
  },
  kessan:{
    title:"決算整理クイズ",
    desc:"減価償却・貸倒引当金・繰延べ見越し"
  },
  zaimu:{
    title:"財務諸表クイズ",
    desc:"貸借対照表・損益計算書の基礎"
  },
  genka:{
    title:"原価計算クイズ",
    desc:"工業簿記・材料費・労務費・製造間接費"
  }
};

const allQuestions =
  window.quizData?.[type] || window.quizData?.shiwake || [];

const info = quizInfo[type] || quizInfo.shiwake;

document.title = info.title;
document.getElementById("pageTitle").textContent = info.title;
document.getElementById("pageDesc").textContent = info.desc;

const quizList = document.getElementById("quizList");

quizList.innerHTML = Object.keys(quizInfo).map(key => `
  <a href="?type=${key}" class="${key === type ? "active" : ""}">
    ${quizInfo[key].title}
  </a>
`).join("");

function shuffle(array){
  return [...array].sort(() => Math.random() - 0.5);
}

let questions = shuffle(allQuestions).slice(0, 50);
let current = 0;
let score = 0;
let answered = false;

function showQuestion(){
  if(questions.length === 0){
    document.getElementById("question").textContent = "問題データがありません";
    return;
  }

  if(current >= questions.length){
    finishQuiz();
    return;
  }

  answered = false;
  const q = questions[current];

  document.getElementById("counter").textContent =
    `${current + 1} / ${questions.length}`;

  document.getElementById("score").textContent =
    `スコア: ${score}`;

  document.getElementById("question").textContent = q.q;
  document.getElementById("result").textContent = "";

  document.getElementById("progressBar").style.width =
    `${(current / questions.length) * 100}%`;

  document.getElementById("choices").innerHTML =
    shuffle(q.c).map(choice => `
      <button onclick="checkAnswer(this, '${choice.replace(/'/g, "\\'")}')">
        ${choice}
      </button>
    `).join("");
}

function checkAnswer(button, choice){
  if(answered) return;
  answered = true;

  const q = questions[current];
  const buttons = document.querySelectorAll("#choices button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if(btn.textContent.trim() === q.a){
      btn.classList.add("correct");
    }
  });

  if(choice === q.a){
    score++;
    button.classList.add("correct");
    document.getElementById("result").textContent = "正解！";
  }else{
    button.classList.add("wrong");
    document.getElementById("result").textContent =
      `不正解！ 正解は「${q.a}」`;
  }

  document.getElementById("score").textContent = `スコア: ${score}`;

  setTimeout(() => {
    current++;
    showQuestion();
  }, 1200);
}

function finishQuiz(){
  document.getElementById("counter").textContent = "終了";
  document.getElementById("question").textContent = "結果発表";

  document.getElementById("progressBar").style.width = "100%";

  document.getElementById("choices").innerHTML = `
    <div class="finish">
      <p>${questions.length}問中 ${score}問正解！</p>
      <button onclick="location.reload()">もう一度遊ぶ</button>
    </div>
  `;

  document.getElementById("result").textContent = "";
}

showQuestion();