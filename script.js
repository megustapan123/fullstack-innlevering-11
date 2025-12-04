// script.js

// Liste over navn basert på dyretype
const names = {
  hund: ["Rex", "Sivert", "Fido", "Max"],
  katt: ["Misty", "Cholo", "Luna", "Simba"],
  hamster: ["Nibbles", "Fuzzy", "Pip", "Cheeks"],
  Furry: ["Sivert", "Frank", "Cholo", "Elias"]
};

// Favoritter-liste
let favorites = [];

// ------------------- GENERATOR-SIDE -------------------
if (document.getElementById("generateBtn")) {
  const generateBtn = document.getElementById("generateBtn");
  const saveBtn = document.getElementById("saveBtn");
  const generatedNameSpan = document.getElementById("generatedName");
  const animalSelect = document.getElementById("animalType");
  let currentName = "";

  // Generer et tilfeldig navn
  generateBtn.addEventListener("click", () => {
    const type = animalSelect.value;
    const randomIndex = Math.floor(Math.random() * names[type].length);
    currentName = names[type][randomIndex];
    generatedNameSpan.textContent = currentName;
  });

  // Lagre favoritt via backend
  saveBtn.addEventListener("click", () => {
    if (!currentName) {
      alert("Generer først et navn!");
      return;
    }

    // Sjekk om navnet allerede finnes i favorites
    if (favorites.some(fav => fav.name === currentName)) {
      alert("Navnet finnes allerede i favoritter!");
      return;
    }

    // Send POST til backend
    fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentName, type: animalSelect.value })
    })
      .then(res => res.json())
      .then(data => {
        // Legg til i lokal liste
        favorites.push({ name: data.name, type: data.type });
        alert(`${currentName} er lagret som favoritt!`);
      })
      .catch(err => console.error("POST-feil:", err));
  });
}

// ------------------- FAVORITT-SIDE -------------------
if (document.getElementById("favoritesList")) {
  const list = document.getElementById("favoritesList");

  // Hent favoritter fra backend
  fetch("http://localhost:3000/favorites")
    .then(res => res.json())
    .then(data => {
      console.log("Favoritter fra backend:", data); // Debug
      favorites = data;
      data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.type})`;
        list.appendChild(li);
      });
    })
    .catch(err => console.error("Fetch-feil:", err));
}
