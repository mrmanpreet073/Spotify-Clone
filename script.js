// Global Declaration 
let currentsong = new Audio();
const play = document.querySelector('.play');
let songs;
let currfolder;

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`${folder}/`);

  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith('.mp3'))//only mp3 files
    {
      // console.log(element);

      songs.push(element.href.split(`/${folder}/`)[1]);//only song name
    }
  }
  let songul = document.querySelector('.songlist').getElementsByTagName('ul')[0];
  songul.innerHTML="";
  for (const song of songs) {
    //Show all the songs in the playlist
    songul.innerHTML = songul.innerHTML + `
      <li>
       <img src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll('%20', ' ')}</div>
            

        </div>
         <div class="playnow">
           
            
        </div>
    </li>
    
   `;//removing %20 from song name
  }

  //attach  an event listener to all the li
  Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e => {
    e.addEventListener('click', () => {

      playmusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
    })

    // console.log(e.querySelector('.info').firstElementChild.innerHTML);//
  })
 return songs;
}
//play Music Function
const playmusic = (track, pause = false) => {
  currentsong.src = `${currfolder}/` + track;
  if (!pause) {

    currentsong.play();
    play.src = "./img/pause.svg";
  }
  document.querySelector('.title').innerHTML = decodeURI(track);
  // document.querySelector('.duration').innerHTML = "00:00";
  // console.log();



}
// Seconds to minutes coversion Function
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00"; // handle NaN or invalid input
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

async function displayalbum() {
  let cardcontainer= document.querySelector('.card-container');

  let a = await fetch(`music/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName('a');

  let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
   
    if (e.href.includes('music')) {
      let folder = e.href.split('/').slice(-1)[0];

      // ✅ Ignore "music" itself
      if (folder !== "music") {
        // console.log(folder);  // chakme, sad, sidhu

        //get the meta data of the folder
        let a = await fetch(`music/${folder}/info.json`);
        let response = await a.json();
        // console.log(response);

        cardcontainer.innerHTML= cardcontainer.innerHTML+`
              <div data-folder="${folder}" class="card">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                                <!-- Spotify green circle -->
                                <circle cx="12" cy="12" r="10" fill="#1DB954" />
                                <!-- Black play arrow -->
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="#000000" />
                            </svg>

                            <img src="music/${folder}/cover.jpg" alt="">
                            <h4>${response.title}</h4>
                            <p>${response.description} </p>
                        </div>`;

        
      }
    }
 }
   //load the library whenever card is clicked
  Array.from(document.getElementsByClassName('card')).forEach((e) => {

    e.addEventListener('click', async item => {
      console.log(item.currentTarget); // Add this line

     await getsongs(`music/${item.currentTarget.dataset.folder}`);
      // console.log(songs);
      playmusic(songs[0]);
      
    });

  });
}


async function main() {


  //get List of all the songs
 await getsongs("music/chakme");
  // console.log(songs);

  playmusic(songs[0], true);
  //selecting ul from songlist class

 

  //display all  the album on the page
  displayalbum();



  // Play Pause operation

  play.addEventListener('click', () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "./img/pause.svg"
    }
    else {
      currentsong.pause();
      play.src = "./img/play.svg"
    }
  })

  // working on duration(Timeupdate Event)
  currentsong.addEventListener('timeupdate', () => {
    // console.log(currentsong.currentTime);//
    document.querySelector(".sduration").innerHTML = `${formatTime(currentsong.currentTime)}`;
    document.querySelector(".duration").innerHTML = ` ${formatTime(currentsong.duration)}`;

    document.querySelector('.circle').style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })

  //add an event listner to Seekbar
  document.querySelector('.song-line').addEventListener('click', e => {
    // console.log(e.offsetX,e.target.getBoundingClientRect().width);
    persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
   

    document.querySelector('.circle').style.left = persent + "%";
    currentsong.currentTime = (persent * currentsong.duration) / 100; // (persentage /seconds)/100  Divide by 100 for converting to seconds

  })

  //hamburger menu
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0';
  });

  //cross fuctionality
  document.querySelector('.cross').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-100%';
  });

  //previous
  let previous = document.querySelector('.previous').addEventListener('click', () => {
    console.log('previous');
    let index = songs.indexOf(currentsong.src.split('/').splice(-1)[0])
    if ((index - 1) >= 0) {
      playmusic(songs[index - 1]);

    }
    else {
      playmusic(songs[songs.length - 1]);
    }

  });

  //next
  let next = document.querySelector('.next').addEventListener('click', () => {
    console.log('next');

    let index = songs.indexOf(currentsong.src.split('/').splice(-1)[0])
    if ((index + 1) < songs.length) {
      playmusic(songs[index + 1]);


    }
    else {
      playmusic(songs[0]);
    }
  });

  //setting volume 

  document.querySelector('.volume').getElementsByTagName('input')[0].addEventListener('change', (e) => {
    // console.log((e.target.value / 100));
    currentsong.volume = parseInt(e.target.value) / 100;// the volume range is from 0.1 - 1 so thats why divided by 100
  });

  // setting mute setting 

  document.querySelector('.volimg').addEventListener('click',(e)=> {
    console.log(e.target.src);
    if(e.target.src.includes("volume.svg")){
    e.target.src= e.target.src.replace("volume.svg","mute.svg");
    currentsong.volume=0;
     document.querySelector('.volume').getElementsByTagName('input')[0].value=0;
    }
    else{
       e.target.src= e.target.src.replace("mute.svg","volume.svg");
    currentsong.volume=.50;
         document.querySelector('.volume').getElementsByTagName('input')[0].value=40;

    }
  });

 
}
main();



