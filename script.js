let allWords = [];
let score = 0;
let totalQuestions = 0;
let currentGroup = "";
let currentCorrectAnswer = "";


for (const group in wordGroups) {
  allWords = allWords.concat(wordGroups[group]);
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateQuestion() {
  const questionDiv = document.getElementById("question");
  const optionsDiv = document.getElementById("options");
  const resultDiv = document.getElementById("result");

  document.getElementById("actionButtons").style.display = "none";
  resultDiv.innerText = "";

  currentGroup = getRandomElement(Object.keys(wordGroups));
  const correctOptions = wordGroups[currentGroup];
  currentCorrectAnswer = getRandomElement(correctOptions);

  const questionText = `Which of the following relates to ${currentGroup}?`;
  questionDiv.innerText = questionText;

  // Create options: only ONE from correct group, rest from other groups
  const options = new Set([currentCorrectAnswer]);

  while (options.size < 4) {
    const randomWord = getRandomElement(allWords);

    // Skip if word is from the current correct group
    if (
      wordGroups[currentGroup].includes(randomWord) &&
      randomWord !== currentCorrectAnswer
    ) {
      continue;
    }

    options.add(randomWord);
  }

  const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

  optionsDiv.innerHTML = "";
  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });

  updateScore();
}


function checkAnswer(selected) {
  const result = document.getElementById("result");
  totalQuestions++;

  if (selected === currentCorrectAnswer) {
    score++;
    result.innerText = "✅ Correct!";
    result.style.color = "green";
    document.getElementById("actionButtons").style.display = "block";
  } else {
    result.innerText = "❌ Incorrect!";
    result.style.color = "red";
    updateReview(currentGroup, selected);
    setTimeout(generateQuestion, 1500);
  }
  updateScore();
}

function updateScore() {
  document.getElementById("score").innerText = `Score: ${score} / ${totalQuestions}`;
}

function updateReview(group, selected) {
  const reviewList = document.getElementById("reviewList");
  const div = document.createElement("div");
  div.classList.add("entry");

  let selectedGroup = "";
  for (const g in wordGroups) {
    if (wordGroups[g].includes(selected)) {
      selectedGroup = g;
      break;
    }
  }

  div.innerHTML = `
    <div><strong>Word:</strong> <span style="color:green;">  ${group} </div>
    <div><strong>Correct Answer:</strong> <span style="color:green;"> ${currentCorrectAnswer} </div>
    <div><strong>Your Answer:</strong> <span style="color:red;"> ${selected} </span></div>
    <div><strong>Your Word Answer:</strong> <span style="color:red;"> ${selectedGroup || 'Unknown'} </span></div>
  `;

  reviewList.appendChild(div);
}

function showMeaning() {
  document.getElementById("meaningModal").style.display = "flex";
  document.getElementById("meaningWord").innerText = currentCorrectAnswer;
  const meaning = wordMeaning[currentCorrectAnswer] || "Meaning not found.";
  document.getElementById("meaningText").innerText = meaning;
}

function closeModal() {
  document.getElementById("meaningModal").style.display = "none";
}


function showGroup() {
  document.getElementById("groupModal").style.display = "flex";
  document.getElementById("groupName").innerText = currentGroup;

  const groupWords = wordGroups[currentGroup] || [];
  const list = document.getElementById("groupWords");
  list.innerHTML = "";
  groupWords.forEach(word => {
    const li = document.createElement("li");
    li.innerText = word;
    list.appendChild(li);
  });
}

function closeGroupModal() {
  document.getElementById("groupModal").style.display = "none";
}

function showSentence() {
  document.getElementById("sentenceModal").style.display = "flex";
  document.getElementById("sentenceWord").innerText = currentCorrectAnswer;
  const sentence = wordSentence[currentCorrectAnswer] || "Sentence not found.";
  document.getElementById("sentenceText").innerText = sentence;
}

function closeSentenceModal() {
  document.getElementById("sentenceModal").style.display = "none";
}


// Start game
window.onload = generateQuestion;
