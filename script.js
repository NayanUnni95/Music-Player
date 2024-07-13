const audio = document.querySelector("audio");
const ctrlBtn = document.getElementById("ctrlBtn");
const progress = document.getElementById("progressBar");

audio.onloadedmetadata = function () {
  updateProgressMax();
  progress.value = audio.currentTime;
};

ctrlBtn.addEventListener("click", () => {
  if (audio.paused) {
    play();
    document.querySelector(
      "svg"
    ).innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
  } else {
    pause();
    document.querySelector("svg").innerHTML = `<path d="M8 5v14l11-7z"/>`;
  }
});
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
};

progress.onchange = () => {
  audio.currentTime = progress.value;
};
