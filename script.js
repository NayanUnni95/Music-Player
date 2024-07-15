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
const qualitySelect = document.getElementById("audioQuality");

// Set up metadata for the audio file when it is loaded
audio.onloadedmetadata = function () {
  updateProgressMax();
  maxVAlue.innerText = updateTime(audio.duration);
  progress.value = audio.currentTime;
  volumeBar.value = audio.volume * 10;
};

// Add event listener to the play/pause button
ctrlBtn.addEventListener("click", () => clearBtnState());

// Function to handle play/pause button state
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

// Play the audio
const play = () => {
  audio.play();
};

// Pause the audio
const pause = () => {
  audio.pause();
};

// Update the maximum value of the progress bar
function updateProgressMax() {
  if (audio.duration) {
    progress.max = audio.duration;
  } else {
    setTimeout(updateProgressMax, 100);
  }
}

// Update progress bar and current time display as audio plays
audio.ontimeupdate = () => {
  progress.value = audio.currentTime;
  currentVAlue.innerText = updateTime(progress.value);
  if (progress.value == Math.trunc(audio.duration)) {
    nextSong();
  }
};

// Format time display for current time and duration
const updateTime = (currentTime) => {
  let sec = Math.floor(currentTime % 60);
  let min = Math.floor(currentTime / 60);
  return `${min} : ${sec}`;
};

// Update audio current time when progress bar is changed
progress.onchange = () => {
  audio.currentTime = progress.value;
};

// Generic method to fetch data from a URL
const genericGetMethod = async (url) => {
  try {
    const data = await fetch(url);
    return [data.json(), null];
  } catch (error) {
    return [null, error];
  }
};

// Handle errors during data fetch
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
let audioQuality = "2";

// Update content based on the current song and quality
const updateContent = (source, audioQty) => {
  setSongData(source, audioQty);
  audio.src = songQueue[source].downloadUrl[audioQty].url;
  document.title = title.innerText = songQueue[source].name;
  image.src = songQueue[source].images[1].url;
  container.style.backgroundImage = `url(${songQueue[source].images[1].url})`;
};

// Fetch song data and update content
(async function () {
  const result = await genericErrorHandle("./data.json", "get");
  result.forEach((obj) => songQueue.push(obj));
})()
  .then(() => {
    let data = JSON.parse(getSongData());
    // if (data) {
    //   updateContent(data.index, parseInt(audioQuality));
    // } else {
    //   updateContent(currentSongIndex, audioQuality);
    // }
    updateContent(currentSongIndex, audioQuality);
  })
  .catch((err) => console.log(err));

// Move to the next song in the queue
const nextSong = () => {
  if (currentSongIndex < songQueue.length - 1) {
    updateContent(++currentSongIndex, audioQuality);
  } else if (currentSongIndex == songQueue.length - 1) {
    updateContent((currentSongIndex = 0), audioQuality);
  }
  clearBtnState();
};

// Move to the previous song in the queue
const prevSong = () => {
  if (currentSongIndex > 0) {
    updateContent(--currentSongIndex, audioQuality);
  } else if (currentSongIndex == 0) {
    updateContent((currentSongIndex = songQueue.length - 1), audioQuality);
  }
  clearBtnState();
};

// Add event listeners to the next and previous buttons
prevBtn.addEventListener("click", () => {
  prevSong();
});

nextBtn.addEventListener("click", () => {
  nextSong();
});

// Update the audio volume based on the volume bar
volumeBar.onchange = () => {
  audio.volume = volumeBar.value / 10;
};

// Show the volume bar when the volume button is clicked, then hide it after 3 seconds
volumeBtn.addEventListener("click", () => {
  volumeBar.style.display = "block";
  setTimeout(() => {
    volumeBar.style.display = "none";
  }, 3000);
});

// Change the audio quality and update the current song
qualitySelect.addEventListener("change", () => {
  audioQuality = qualitySelect.value;
  updateSongByTimeZone(currentSongIndex, audioQuality);
});

// Save the current song index and audio quality to local storage
const setSongData = (index, audioQuality) => {
  let data = {
    index,
    audioQuality,
  };
  localStorage.setItem("songData", JSON.stringify(data));
};

// Get the saved song data from local storage
const getSongData = () => localStorage.getItem("songData");

// Update the song based on the current time and quality
const updateSongByTimeZone = (index, quality) => {
  clearBtnState();
  setSongData(index, audioQuality);
  const url = songQueue[index].downloadUrl[quality].url;
  audio.src = url;
  audio.currentTime = progress.value;
  clearBtnState();
};
