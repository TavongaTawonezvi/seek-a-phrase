
//youtube transcriptor api logic
async function getTranscript(video_id) {
    const url = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${video_id}&lang=en`;
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

     // Simulate an asynchronous operation (e.g., fetching data)
    setTimeout(function() {
        // Hide loading container
        loadingContainer.style.display = 'none';
    
        // Show content container
        contentContainer.style.display = 'block';
    }, 600); // Adjust the delay as needed

    let matches = [];

    // find subs that match the search term
    transcription.forEach(sub => {
        if (sub['subtitle'].toLowerCase().includes('we all have problems')) {
            // clean subs
            
            matches.push({
                subtitle: sub['subtitle'].replace(/\n/ , ' ').replace('&#39;', "'"),
                start: sub['start']
            })
        }
    });
    console.log(matches)
}


var loadingContainer = document.querySelector('.loading-container');
var contentContainer = document.querySelector('.popup-container');

contentContainer.style.display = 'none';
loadingContainer.style.display = 'block';

let vidId = []
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    let youtubeUrl = tabs[0].url;
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
