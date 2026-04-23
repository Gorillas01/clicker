let game = {
  points: 0,
  autoClickers: 0,
  unlockedMilestones: [],
  musicStarted: false
};

const pointsEl = document.getElementById("points");
const clickBtn = document.getElementById("triangleWrapper");
const shopDiv = document.getElementById("shopItems");

function startBackgroundMusic() {
  const music = document.getElementById("bgMusic");

  music.src = "musiikki/tunnelma.mp3";
  music.loop = true;
  music.volume = 0.3;

  music.play().catch(() => {});
}

function loadGame() {
  const data = localStorage.getItem("clickerGame");
  if (data) game = JSON.parse(data);

  if (!game.unlockedMilestones) game.unlockedMilestones = [];
  if (!game.autoClickers) game.autoClickers = 0;
  if (!game.points) game.points = 0;
  if (!game.musicStarted) game.musicStarted = false;
}

function saveGame() {
  localStorage.setItem("clickerGame", JSON.stringify(game));
}

setInterval(saveGame, 5000);

const milestones = [
  {
    points: 100,
    action: () => {
      addGif("https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnJoZWF0cW1lNzc1NW1peW56dnUzZzAzb2JzYTQzbXh1NGJtbnpjOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QaXcpBEQRfD9pR3zk5/giphy.gif");

      if (!game.musicStarted) {
        startBackgroundMusic();
        game.musicStarted = true;
      }
    }
  },
  { points: 500, action: () => addGif("https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif") },
  { points: 1000, action: () => addGif("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3dobDF0engza25uMDdsZXdpaWI4b2k4Z3hoYTRhcmRid3ZpNG9hMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LOQyoLIojnizS949is/giphy.gif") },
  { points: 5000, action: () => addGif("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWlrNHBlY2ZuYzhlNnNnd21xeTl1MG1paGo1YnBqYmxraTR4MWIxaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BpnkuY1i2rBpm/giphy.gif") },
  { points: 10000, action: () => addGif("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTM0aTZ0YzJldHo4dHE3czJxdmk5eGphc2dnemRvNXE3eXhvNGlmOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tJoJXEYRJTGJyYXDUR/giphy.gif") }
];

function checkMilestones() {
  milestones.forEach(m => {
    if (game.points >= m.points && !game.unlockedMilestones.includes(m.points)) {
      m.action();
      game.unlockedMilestones.push(m.points);
    }
  });
}

const shopItems = [
  {
    name: "Tanssimaan",
    cost: 100,
    type: "gif",
    src: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHQ5ZWU3dmN2czM4dHphYzJyem9xeWttN3I3OWphbTJ0eDF2bTd5diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/b8rJB6Z2fTVA2iOX61/giphy.gif"
  },
  {
    name: "Chillaa",
    cost: 500,
    type: "gif",
    src: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3phYnY0MWs3ajJuOTk4a29vc3JjeHk2d3Y3YTVudDN6YW9xMHg0aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yiADANv89n7UQuS5kJ/giphy.gif"
  },
  {
    name: "ONNEKSI OLKOON OLET SAAVUTTANUT RAUHOITTAVALLE VIDEO TASOLLE",
    cost: 5000,
    type: "video",
    src: "videot/klikkervideo.mp4"
  },
  {
    name: "Autoklikkeri",
    cost: 5,
    type: "auto"
  }
];

let displayedPoints = 0;

function updateUI() {
  const target = game.points;

  function animate() {
    if (displayedPoints < target) {
      displayedPoints += Math.ceil((target - displayedPoints) / 5);
      pointsEl.textContent = displayedPoints;
      requestAnimationFrame(animate);
    } else {
      displayedPoints = target;
      pointsEl.textContent = target;
    }
  }

  animate();
  renderShop();
  checkMilestones();
}

clickBtn.addEventListener("click", () => {
  game.points++;
  pointsEl.classList.add("bump");
  setTimeout(() => pointsEl.classList.remove("bump"), 100);
  updateUI();
});

function renderShop() {
  shopDiv.innerHTML = "";

  shopItems.forEach((item, index) => {
    if (game.points < item.cost) return;

    const btn = document.createElement("button");
    btn.className = "shop-item";
    btn.textContent = `${item.name} (${item.cost})`;
    btn.onclick = () => buyItem(index);

    shopDiv.appendChild(btn);
  });
}

function buyItem(index) {
  const item = shopItems[index];

  if (game.points < item.cost) {
    alert("Ei tarpeeksi pisteitä!");
    return;
  }

  game.points -= item.cost;

  if (item.type === "auto") {
    game.autoClickers = game.autoClickers === 0 ? 1 : game.autoClickers * 2;
    item.cost = Math.floor(item.cost * 2);
  }

  if (item.type === "gif") addGif(item.src);
  if (item.type === "video") addVideo(item.src);

  updateUI();
}

function addGif(src) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "gif";

  img.style.position = "fixed";
  img.style.width = "25vw";
  img.style.zIndex = "0";

  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 30 && top < 70 && left > 30 && left < 70);

  img.style.top = top + "%";
  img.style.left = left + "%";

  if (src.includes("yiADANv89n7UQuS5kJ")) {
    img.classList.add("floating");
  }

  document.body.appendChild(img);
}

function addVideo(src) {
  const old = document.querySelector("video");
  if (old) old.remove();

  const video = document.createElement("video");

  video.src = src;
  video.autoplay = true;
  video.loop = true;
  video.controls = true;
  video.muted = false;

  video.style.position = "fixed";
  video.style.top = "10px";
  video.style.right = "10px";
  video.style.width = "400px";
  video.style.zIndex = "999";

  video.play().catch(() => {});

  document.body.appendChild(video);
}

setInterval(() => {
  game.points += game.autoClickers;
  updateUI();
}, 1000);

// loadGame();
updateUI();
renderShop();