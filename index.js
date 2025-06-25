// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/"; // Make sure to change this!
const API = BASE + COHORT;

const API_URL =
  "https://fsa-puppy-bowl.herokuapp.com/api/2305-FTB-ET-WEB-PT/players";

const puppyList = document.getElementById("puppy-list");
const detailsContainer = document.getElementById("details-container");
const addForm = document.getElementById("add-puppy-form");

// Display all puppies
async function fetchPuppies() {
  const response = await fetch(API_URL);
  const { data } = await response.json();

  puppyList.innerHTML = "";
  data.players.forEach(renderPuppyCard);
}

// Puppy render card
function renderPuppyCard(puppy) {
  const card = document.createElement("div");
  card.className = "puppy-card";

  card.innerHTML = `
    <h3>${puppy.name}</h3>
    <img src="${puppy.imageUrl}" alt="${puppy.name}" />
  `;

  card.addEventListener("click", () => showPuppyDetails(puppy.id));
  puppyList.appendChild(card);
}

// Show details of selected puppy
async function showPuppyDetails(puppyId) {
  const response = await fetch(`${API_URL}/${puppyId}`);
  const { data } = await response.json();

  const puppy = data.player;
  detailsContainer.innerHTML = `
    <h3>${puppy.name}</h3>
    <p><strong>ID:</strong> ${puppy.id}</p>
    <p><strong>Breed:</strong> ${puppy.breed}</p>
    <p><strong>Status:</strong> ${puppy.status}</p>
    <p><strong>Team:</strong> ${puppy.team ? puppy.team.name : "Unassigned"}</p>
    <img src="${puppy.imageUrl}" alt="${puppy.name}" />
    <br><br>
    <button onclick="removePuppy(${puppy.id})">Remove from roster</button>
  `;
}

// Remove a puppy
async function removePuppy(puppyId) {
  await fetch(`${API_URL}/${puppyId}`, {
    method: "DELETE",
  });

  await fetchPuppies();
  detailsContainer.innerHTML = `<p>Puppy has been removed. Select another puppy.</p>`;
}

// Add a new puppy
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const breed = document.getElementById("breed").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, breed }),
  });

  addForm.reset();
  await fetchPuppies();
});

fetchPuppies();
