const audio = document.querySelector("audio");
const ctrlBtn = document.getElementById("ctrlBtn");
const progress = document.getElementById("progressBar");
const title = document.getElementById("songTitle");
const image = document.getElementsByTagName("img")[0];
const container = document.getElementById("bgImg");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const volumeBar = document.getElementById("volumeBar");
const volumeBtn = document.getElementById("volumeBtn");
const currentVAlue = document.getElementById("currentValue");
const maxVAlue = document.getElementById("maxValue");

audio.onloadedmetadata = function () {
  updateProgressMax();
  maxVAlue.innerText = updateTime(audio.duration);
  progress.value = audio.currentTime;
  volumeBar.value = audio.volume * 10;
};

ctrlBtn.addEventListener("click", () => clearBtnState());

const clearBtnState = () => {
  if (audio.paused) {
    play();
    document.getElementById(
      "ctrlIcon"
    ).innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
  } else if (audio.played) {
    pause();
    document.getElementById("ctrlIcon").innerHTML = `<path d="M8 5v14l11-7z"/>`;
  }
};

const play = () => {
  audio.play();
};

const pause = () => {
  audio.pause();
};

function updateProgressMax() {
  if (audio.duration) {
    progress.max = audio.duration;
  } else {
    setTimeout(updateProgressMax, 100);
  }
}

audio.ontimeupdate = () => {
  progress.value = audio.currentTime;
  currentVAlue.innerText = updateTime(progress.value);
};

const updateTime = (currentTime) => {
  let sec = Math.floor(currentTime % 60);
  let min = Math.floor(currentTime / 60);
  return `${min} : ${sec}`;
};

progress.onchange = () => {
  audio.currentTime = progress.value;
};

const genericGetMethod = async (url) => {
  try {
    const data = await fetch(url);
    return [data.json(), null];
  } catch (error) {
    return [null, error];
  }
};

const genericErrorHandle = async (url) => {
  const [data, error] = await genericGetMethod(url);
  if (data) {
    return data;
  } else {
    return error;
  }
};

let songQueue = [];
let currentSongIndex = 0;

const updateContent = (source) => {
  audio.src = songQueue[source].downloadUrl[3].url;
  document.title = title.innerText = songQueue[source].name;
  image.src = songQueue[source].images[1].url;
  container.style.backgroundImage = `url(${songQueue[source].images[1].url})`;
};

(async function () {
  const result = await genericErrorHandle("./data.json", "get");
  result.forEach((obj) => songQueue.push(obj));
})()
  .then(() => updateContent(currentSongIndex))
  .catch((err) => console.log(err));

const nextSong = () => {
  if (currentSongIndex < songQueue.length - 1) {
    updateContent(++currentSongIndex);
  } else if (currentSongIndex == songQueue.length - 1) {
    updateContent((currentSongIndex = 0));
  }
  clearBtnState();
};

const prevSong = () => {
  if (currentSongIndex > 0) {
    updateContent(--currentSongIndex);
  } else if (currentSongIndex == 0) {
    updateContent((currentSongIndex = songQueue.length - 1));
  }
  clearBtnState();
};

prevBtn.addEventListener("click", () => {
  prevSong();
});

nextBtn.addEventListener("click", () => {
  nextSong();
});

volumeBar.onchange = () => {
  audio.volume = volumeBar.value / 10;
};

volumeBtn.addEventListener("click", () => {
  volumeBar.style.display = "block";
  setTimeout(() => {
    volumeBar.style.display = "none";
  }, 3000);
});
