console.log("hello Arbaj")

let currsong = new Audio();
let currFolder;

let song;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;

    let res = await fetch(`/${folder}/info.json`);
    let data = await res.json();

    let songs = data.tracks;

    let songUL = document.querySelector(".songList ul");
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

    // Attach click listeners
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });

    return songs;
}

const playmusic = (track , pause = false)=>{
//    let audio = new Audio("/songs/"+ track)
   currsong.src = `/${currFolder}/`+ track;
   if(!pause){
       currsong.play()
   }
   play.src = "assest/pause.svg";

   document.querySelector(".songinfo").innerHTML = decodeURI(track)
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    console.log("displaying albums")
let a = await fetch(`/songs/${folder}/info.json`)
let response = await a.json(); 
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            song = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(song[0])

        })
    })
}

async function main() {
    song = await getsongs("songs/ncs");
    playmusic(song[0] , true)

     await displayAlbums()

    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play()
            play.src = "assest/pause.svg"
        }
        else {
            currsong.pause()
            play.src = "assest/play.svg"
        }
    })
        currsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)} / ${secondsToMinutesSeconds(currsong.duration)}`
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
    })

        document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currsong.currentTime = ((currsong.duration) * percent) / 100
    })
    
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left-content").style.left = "0"
    })
        document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left-content").style.left = "-120%"
    })

        previous.addEventListener("click", () => {
        currsong.pause()
        console.log("Previous clicked")
        let index = song.indexOf(currsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(song[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currsong.pause()
        console.log("Next clicked")

        let index = song.indexOf(currsong.src.split("/").slice(-1)[0])
        if ((index + 1) < song.length) {
            playmusic(song[index + 1])
        }
    })

        // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currsong.volume = parseInt(e.target.value) / 100
        if (currsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
        else{
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src = "assest/mute.svg"
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}

main();
