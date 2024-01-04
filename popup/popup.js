
//youtube transcriptor api logic
async function getTranscript(video_id) {
    const url = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${video_id}`;
    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0ba5d6d988mshda8e16518a7154bp1f250cjsn23cfacfb51d1',
		'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com'
	}
    };


    try {
	    const response = await fetch(url, options);
	    const result = await response.json();
        
        return result[0].transcription;

    } catch (error) {
       // console.error(error)
	    return error;
    }

    
}


async function main(video_id) {
    let transcription = await getTranscript(video_id);

    if (Object.keys(transcription).length > 0) {

        let searchTerm = document.querySelector('#searchQueryInput');

        // get a search term from the user
        document.getElementById('actionButton').addEventListener('click', e => {

            let matches = [];
            if (searchTerm.value.length > 0){
                loadingSvg.style.display = 'block';
                // find subs that match the search term
                console.log(transcription)
                transcription.forEach(sub => {
                    if (sub['subtitle'].toLowerCase().includes(searchTerm.value)) {

                         // push matching timestamps to array
                         matches.push( sub['start'] );
                    }
                    
                });

                bottomStamp.innerHTML = 0;
                topStamp.innerHTML = matches.length;
                setTimeout( loadFinished , 2000);
                matchesGlobal = matches;
                console.log(matches)
            }else{
                searchTerm.placeholder = 'Empty search bar';
            }
            
        });

    }else {


    }
   
   

   
}

let matchesGlobal = [];
var contentContainer = document.querySelector('.popup-container');

var timestampController = document.querySelector('#timestamp-controller');
var loadingSvg = document.querySelector('#loading-svg');

var back = document.querySelector('#back');
var forward = document.querySelector('#forward');

var bottomStamp = document.querySelector('#bottom-stamp');
var topStamp = document.querySelector('#top-stamp');


function loadFinished(){
    loadingSvg.style.display = 'none';
    timestampController.style.display = 'block';
}

let vidId = []
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    let youtubeUrl = tabs[0].url;
    // check if user is on YouTube
    if(youtubeUrl.includes('youtube.com')){
        vidId.push(youtubeUrl.slice(youtubeUrl.indexOf('v=') + 2, youtubeUrl.indexOf('&')));
        onYoutube(vidId[0]);
    }
    else {

    }
    
});


function onYoutube(video_id) {
    // Show loading container

    main(video_id);

};

back.addEventListener('click', goBack(matchesGlobal));

forward.addEventListener('click', goForward(matchesGlobal));

function goBack(matches) {
    if(bottomStamp.innerHTML === 0) {
        bottomStamp.innerHTML = matches.length;
    }else {
        bottomStamp.innerHTML = bottomStamp.innerHTML--;
    }
}

function goForward(matches) {
    if(topStamp.innerHTML === matches.length) {
        topStamp.innerHTML = 0;
    }else {
        topStamp.innerHTML = topStamp.innerHTML++;
    }
}