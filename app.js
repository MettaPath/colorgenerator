const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.code.toLowerCase() === "space") {
    setRandomColor();
  }
});

document.addEventListener("dblclick", (e) => {
  e.preventDefault();
  setRandomColor();
});

document.addEventListener("click", (e) => {
  const type = e.target.dataset.type;
  if (type === "lock") {
    const node =
      e.target.tagName.toLowerCase() === "i" ? e.target : e.target.children[0];
    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  }
  if (type === "copy") {
    const text = e.target.textContent;
    const color = e.target.style.color;
    copyToClickboard(text, color);
  }
});

function setRandomColor(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];
  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const text = col.querySelector("h2");
    const info = col.querySelector("h3");
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    col.style.background = color;
    text.textContent = color;

    setTextColor(text, color);
    setTextColor(button, color);

    if (info != null) {
      setTextColor(info, color);
    }

    updateColorHash(colors);
  });
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
}

function copyToClickboard(text, color) {
  let successMessage = "copied";
  return navigator.clipboard.writeText(text).then(() => {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();
    let message = document.createElement("span");
    message.innerText = successMessage;
    message.style.position = "absolute";
    message.style.top = rect.top - message.offsetHeight - 45 + "px";
    message.style.left = rect.left + "px";
    message.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    message.style.padding = "5px";
    message.style.color = color;
    message.style.borderRadius = "3px";
    document.body.appendChild(message);
    setTimeout(() => {
      document.body.removeChild(message);
    }, 500);
  });
}

function updateColorHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColor(true);

// without chroma-js
// function generateRandomColor() {
//   const hexCodes = "0123456789ABCDEF";
//   let color = "";
//   for (let i = 0; i < 6; i++) {
//     color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
//   }
//   return "#" + color;
// }
