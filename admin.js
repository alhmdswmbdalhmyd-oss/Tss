const ADMIN_PASSWORD = "MNMN0505";


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


/* LOGIN */

function login() {

  const password =
    document.getElementById("adminPassword").value;

  const error =
    document.getElementById("loginError");


  if (password === ADMIN_PASSWORD) {

    sessionStorage.setItem(
      "adminLoggedIn",
      "true"
    );

    document
      .getElementById("loginScreen")
      .classList.add("hidden");

    document
      .getElementById("dashboard")
      .classList.remove("hidden");

    loadDashboard();

  }

  else {

    error.textContent =
      "كلمة المرور غير صحيحة";

  }

}


/* CHECK LOGIN */

if (
  sessionStorage.getItem("adminLoggedIn") === "true"
) {

  document
    .getElementById("loginScreen")
    .classList.add("hidden");

  document
    .getElementById("dashboard")
    .classList.remove("hidden");

  loadDashboard();

}


/* LOAD */

function loadDashboard() {

  document.getElementById("startTime").value =
    settings.startTime || "";

  document.getElementById("endTime").value =
    settings.endTime || "";

  renderDashboard();

  updateCurrentStatus();

}


/* SAVE TIME */

function saveVotingTime() {

  const start =
    document.getElementById("startTime").value;

  const end =
    document.getElementById("endTime").value;


  if (!start || !end) {

    alert(
      "حدد وقت البداية ووقت النهاية."
    );

    return;
  }


  if (new Date(start) >= new Date(end)) {

    alert(
      "وقت النهاية يجب أن يكون بعد وقت البداية."
    );

    return;
  }


  settings.startTime = start;

  settings.endTime = end;

  settings.manualStatus = "auto";


  saveSettings();


  updateCurrentStatus();


  alert(
    "تم حفظ مواعيد التصويت."
  );

}


/* OPEN NOW */

function openVotingNow() {

  settings.manualStatus = "open";

  saveSettings();

  updateCurrentStatus();

  alert(
    "تم فتح التصويت الآن."
  );

}


/* CLOSE NOW */

function closeVotingNow() {

  settings.manualStatus = "closed";

  saveSettings();

  updateCurrentStatus();

  alert(
    "تم إغلاق التصويت."
  );

}


/* AUTO */

function automaticMode() {

  settings.manualStatus = "auto";

  saveSettings();

  updateCurrentStatus();

  alert(
    "تم تفعيل الوضع التلقائي."
  );

}


/* STATUS */

function getVotingStatus() {

  const now = new Date();


  if (
    settings.manualStatus === "open"
  ) {
    return "open";
  }


  if (
    settings.manualStatus === "closed"
  ) {
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


  if (
    settings.startTime &&
    settings.endTime
  ) {
    return "open";
  }


  return "closed";

}


/* CURRENT STATUS */

function updateCurrentStatus() {

  const box =
    document.getElementById("currentStatus");

  const status =
    getVotingStatus();


  if (status === "open") {

    box.innerHTML =
      "🟢 <strong>التصويت مفتوح الآن</strong>";

  }

  else if (status === "waiting") {

    box.innerHTML =
      "🟡 <strong>التصويت لم يبدأ بعد</strong>";

  }

  else {

    box.innerHTML =
      "🔴 <strong>التصويت مغلق</strong>";

  }

}


/* ADD CANDIDATE */

function addCandidate() {

  const name =
    document
      .getElementById("candidateName")
      .value
      .trim();


  const image =
    document
      .getElementById("candidateImage")
      .value
      .trim();


  const description =
    document
      .getElementById("candidateDescription")
      .value
      .trim();


  if (!name) {

    alert(
      "اكتب اسم المرشح."
    );

    return;
  }


  const candidate = {

    id:
      Date.now().toString(),

    name:
      name,

    image:
      image ||
      "https://via.placeholder.com/500x500",

    description:
      description ||
      "مرشح جديد"

  };


  candidates.push(candidate);

  votes[candidate.id] = 0;


  saveData();


  document
    .getElementById("candidateName")
    .value = "";


  document
    .getElementById("candidateImage")
    .value = "";


  document
    .getElementById("candidateDescription")
    .value = "";


  renderDashboard();

}


/* DELETE */

function deleteCandidate(id) {

  if (
    !confirm(
      "هل تريد حذف هذا المرشح؟"
    )
  ) {

    return;

  }


  candidates =
    candidates.filter(
      candidate =>
        candidate.id !== id
    );


  delete votes[id];


  saveData();

  renderDashboard();

}


/* DASHBOARD */

function renderDashboard() {

  const list =
    document.getElementById(
      "candidateList"
    );


  list.innerHTML = "";


  let totalVotes = 0;


  candidates.forEach(candidate => {

    const candidateVotes =
      votes[candidate.id] || 0;


    totalVotes += candidateVotes;


    const item =
      document.createElement("div");


    item.className =
      "admin-candidate";


    item.innerHTML = `

      <img
        src="${candidate.image}"
        alt="${candidate.name}"
      >

      <div class="candidate-info">

        <h3>
          ${candidate.name}
        </h3>

        <p>
          ${candidate.description}
        </p>

      </div>

      <div class="votes">
        🗳️ ${candidateVotes} صوت
      </div>

      <button
        class="delete-btn"
        onclick="deleteCandidate('${candidate.id}')"
      >
        حذف
      </button>

    `;


    list.appendChild(item);

  });


  document
    .getElementById("totalCandidates")
    .textContent =
      candidates.length;


  document
    .getElementById("totalVotes")
    .textContent =
      totalVotes;


  document
    .getElementById("candidateCount")
    .textContent =
      `${candidates.length} مرشح`;


  if (candidates.length === 0) {

    list.innerHTML = `

      <p
        style="
          color:#8992a7;
          text-align:center;
          padding:30px
        "
      >
        لا يوجد مرشحون حتى الآن.
      </p>

    `;

  }

}


/* SAVE DATA */

function saveData() {

  localStorage.setItem(
    "candidates",
    JSON.stringify(candidates)
  );


  localStorage.setItem(
    "votes",
    JSON.stringify(votes)
  );

}


function saveSettings() {

  localStorage.setItem(
    "voteSettings",
    JSON.stringify(settings)
  );

}


/* LOGOUT */

function logout() {

  sessionStorage.removeItem(
    "adminLoggedIn"
  );

  location.reload();

}


/* UPDATE STATUS */

setInterval(() => {

  updateCurrentStatus();

}, 1000);
