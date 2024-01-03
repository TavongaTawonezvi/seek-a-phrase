
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

// show search box if api returns a valid video transcription
function transcriptionTrue() {
    loadingContainer.style.display = 'none';
    contentContainer.style.display = 'block';
}

// show an error dialog if api returns an invalid transcription
function transcriptionFalse() {
    loadingContainer.innerHTML = "<p>Error loading video data</p>";
}

async function main(video_id) {
    let transcription = await getTranscript(video_id);

    if (Object.keys(transcription).length > 0) {

        transcriptionTrue();
        let searchTerm = document.querySelector('.searchTerm');

        // get a search term from the user
        document.getElementById('actionButton').addEventListener('click', e => {

            let matches = [];
            if (searchTerm.value.length > 0){

                // find subs that match the search term
                transcription.forEach(sub => {
                    if (sub['subtitle'].toLowerCase().includes(searchTerm.value)) {

                         // clean subs and push to array
                         matches.push({
                             subtitle: sub['subtitle'].replace(/\n/ , ' ').replace('&#39;', "'"),
                             start: sub['start']
                         })
                    }
                });
                console.log(matches)
            }else{
                searchTerm.placeholder = 'Empty search bar';
            }
            
        });

    }else {

        transcriptionFalse();

    }
   
   

   
}


var loadingContainer = document.querySelector('.loading-container');
var contentContainer = document.querySelector('.popup-container');


contentContainer.style.display = 'none';
loadingContainer.style.display = 'block';

let vidId = []
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    let youtubeUrl = tabs[0].url;
    // check if user is on YouTube
    if(youtubeUrl.includes('youtube.com')){
        vidId.push(youtubeUrl.slice(youtubeUrl.indexOf('v=') + 2, youtubeUrl.indexOf('&')));
        onYoutube(vidId[0]);
    }
    else {
        loadingContainer.innerHTML = '<p>Error... \n Go to a YouTube Video</p>';
    }
    
});


function onYoutube(video_id) {
    // Show loading container

    main(video_id);

};
