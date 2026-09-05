const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{};:,.<>?",
};

const passwordOutput = document.querySelector("#password");
const lengthInput = document.querySelector("#length");
const lengthValue = document.querySelector("#lengthValue");
const generateButton = document.querySelector("#generateButton");
const copyButton = document.querySelector("#copyButton");
const errorMessage = document.querySelector("#errorMessage");
const strengthBar = document.querySelector("#strengthBar");
const strengthLabel = document.querySelector("#strengthLabel");
const toast = document.querySelector("#toast");
const optionInputs = [...document.querySelectorAll('.option input[type="checkbox"]')];

function secureRandomIndex(max) {
  const values = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value;

  do {
    crypto.getRandomValues(values);
    value = values[0];
  } while (value >= limit);

  return value % max;
}

function shuffle(characters) {
  const result = [...characters];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = secureRandomIndex(index + 1);
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result.join("");
}

function getSelectedSets() {
  return optionInputs
    .filter((input) => input.checked)
    .map((input) => characterSets[input.id]);
}

function updateStrength() {
  const length = Number(lengthInput.value);
  const variety = getSelectedSets().length;
  const score = length + variety * 4;

  let label = "Baja";
  let width = 28;
  let color = "#ff7474";

  if (score >= 34) {
    label = "Muy alta";
    width = 100;
    color = "#e8e9eb";
  } else if (score >= 24) {
    label = "Alta";
    width = 78;
    color = "#e8e9eb";
  } else if (score >= 16) {
    label = "Media";
    width = 53;
    color = "#ffd166";
  }

  strengthLabel.textContent = label;
  strengthLabel.style.color = color;
  strengthBar.style.width = `${width}%`;
  strengthBar.style.background = color;
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const selectedSets = getSelectedSets();

  if (selectedSets.length === 0) {
    errorMessage.textContent = "Selecciona al menos un tipo de carácter.";
    passwordOutput.textContent = "—";
    updateStrength();
    return;
  }

  errorMessage.textContent = "";
  const allCharacters = selectedSets.join("");
  const guaranteedCharacters = selectedSets.map(
    (set) => set[secureRandomIndex(set.length)],
  );
  const remainingCharacters = Array.from(
    { length: Math.max(0, length - guaranteedCharacters.length) },
    () => allCharacters[secureRandomIndex(allCharacters.length)],
  );

  passwordOutput.textContent = shuffle(
    [...guaranteedCharacters, ...remainingCharacters].slice(0, length),
  );
  updateStrength();
}

async function copyPassword() {
  const password = passwordOutput.textContent;

  if (!password || password === "—") {
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = password;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
  generatePassword();
});

optionInputs.forEach((input) => input.addEventListener("change", generatePassword));
generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);

generatePassword();
