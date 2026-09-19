let candidates =
  JSON.parse(localStorage.getItem("candidates")) || [];

let votes =
  JSON.parse(localStorage.getItem("votes")) || {};

let settings =
  JSON.parse(localStorage.getItem("voteSettings")) || {

    startTime: "",
    endTime: "",
    manualStatus: "auto"

  };


function getVotingStatus() {

  const now = new Date();

  if (settings.manualStatus === "closed") {
    return "closed";
  }

  if (settings.manualStatus === "open") {
    return "open";
  }

  if (!settings.startTime && !settings.endTime) {
    return "closed";
  }

  if (
    settings.startTime &&
    now < new Date(settings.startTime)
  ) {
    return "waiting";
  }

  if (
    settings.endTime &&
    now > new Date(settings.endTime)
  ) {
    return "closed";
  }

  return "open";
}


function renderCandidates() {

  const container =
    document.getElementById("candidates");

  const count =
    document.getElementById("candidateCount");

  const status =
    getVotingStatus();

  count.textContent =
    `${candidates.length} مرشح`;

  container.innerHTML = "";


  if (candidates.length === 0) {

    container.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          ⭐
        </div>

        <h3>
          لا يوجد مرشحون حاليًا
        </h3>

        <p>
          سيتم إضافة المرشحين قريبًا.
        </p>

      </div>
    `;

    return;
  }


  candidates.forEach(candidate => {

    const card =
      document.createElement("div");

    card.className = "candidate";


    card.innerHTML = `

      <img
        src="${candidate.image}"
        alt="${candidate.name}"
      >

      <h3>
        ${candidate.name}
      </h3>

      <p>
        ${candidate.description}
      </p>

      <button
        class="vote-btn"
        onclick="vote('${candidate.id}')"
        ${status !== "open" ? "disabled" : ""}
      >

        ${
          status === "open"
          ? "🗳️ صوّت الآن"
          : "التصويت غير متاح"
        }

      </button>

    `;

    container.appendChild(card);

  });
}


function vote(id) {

  if (getVotingStatus() !== "open") {

    showMessage(
      "التصويت غير متاح حاليًا."
    );

    return;
  }


  if (
    localStorage.getItem("hasVoted") === "true"
  ) {

    showMessage(
      "لقد قمت بالتصويت مسبقًا."
    );

    return;
  }


  votes[id] =
    (votes[id] || 0) + 1;


  localStorage.setItem(
    "votes",
    JSON.stringify(votes)
  );


  localStorage.setItem(
    "hasVoted",
    "true"
  );


  showMessage(
    "تم تسجيل صوتك بنجاح ✅"
  );

  renderCandidates();
}


function updateStatus() {

  const status =
    getVotingStatus();

  const badge =
    document.getElementById("statusBadge");

  const timer =
    document.getElementById("timerBox");


  badge.className = "status";


  if (status === "open") {

    badge.classList.add("open");

    badge.textContent =
      "التصويت مفتوح";

    timer.textContent =
      settings.endTime
      ? "ينتهي: " +
        formatDate(settings.endTime)
      : "التصويت مفتوح حاليًا";

  }


  else if (status === "waiting") {

    badge.classList.add("waiting");

    badge.textContent =
      "التصويت لم يبدأ";

    timer.textContent =
      "يبدأ: " +
      formatDate(settings.startTime);

  }


  else {

    badge.classList.add("closed");

    badge.textContent =
      "التصويت مغلق";

    timer.textContent =
      "التصويت غير متاح حاليًا";

  }

}


function formatDate(date) {

  return new Date(date)
    .toLocaleString("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short"
    });

}


function showMessage(text) {

  const message =
    document.getElementById("message");

  message.textContent = text;

  message.classList.add("show");


  setTimeout(() => {

    message.classList.remove("show");

  }, 3000);

}


function saveSettings() {

  localStorage.setItem(
    "voteSettings",
    JSON.stringify(settings)
  );

}


function refresh() {

  updateStatus();
  renderCandidates();

}


refresh();

setInterval(refresh, 1000);
