let currsong = new Audio();
let currFolder;
let song = [];

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs(folder) {
    currFolder = folder;

    console.log("Trying fetch:", `/${folder}/info.json`);

    const response = await fetch(`${folder}/info.json`);
    if (!response.ok) {
        console.error("Failed to fetch info.json", response.statusText);
        return;
    }

    const data = await response.json();
    const songs = data.tracks;

    const songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="assest/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Arbaj</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="assest/play.svg" alt="">
                </div> 
            </li>`;
    }

    // Attach click to each song item
    Array.from(songUL.getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            const songName = e.querySelector(".info").firstElementChild.innerText;
            playmusic(songName);
        });
    });

    return songs;
}

function playmusic(track, pause = false) {
    const encodedTrack = encodeURIComponent(track);
    currsong.src = `/${currFolder}/${encodedTrack}`;

    if (!pause) currsong.play();

    play.src = "assest/pause.svg";
    document.querySelector(".songinfo").innerText = decodeURIComponent(track);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}


async function displayAlbums() {
    let folders = ["houseful5", "ncs"]; // <-- manually add folder names
   
console.log("Trying fetch in displayAlbum:");


    let cardContainer = document.querySelector(".cardContainer");
    for (let folder of folders) {
        let res = await fetch(`songs/${folder}/info.json`);
        let data = await res.json();
        cardContainer.innerHTML += `
            <div data-folder="songs/${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="songs/${folder}/cover.jpg" alt="">
                <h2>${data.title}</h2>
                <p>${data.description}</p>
            </div>`;
    }

    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async () => {
            song = await getsongs(e.dataset.folder);
            playmusic(song[0]);
        });
    });
}

async function main() {
    song = await getsongs("songs/houseful5");
    playmusic(song[0], true);
    await displayAlbums();

    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play();
            play.src = "assest/pause.svg";
        } else {
            currsong.pause();
            play.src = "assest/play.svg";
        }
    });

    currsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)} / ${secondsToMinutesSeconds(currsong.duration)}`;
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currsong.currentTime = ((currsong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left-content").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left-content").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currsong.pause();
        let index = song.indexOf(currsong.src.split("/").pop());
        if ((index - 1) >= 0) playmusic(song[index - 1]);
    });

    next.addEventListener("click", () => {
        currsong.pause();
        let index = song.indexOf(currsong.src.split("/").pop());
        if ((index + 1) < song.length) playmusic(song[index + 1]);
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currsong.volume = parseInt(e.target.value) / 100;
        document.querySelector(".volume > img").src = currsong.volume > 0 ? "assest/volume.svg" : "assest/mute.svg";
    });

    document.querySelector(".volume > img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currsong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currsong.volume = 0.10;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
