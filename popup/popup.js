
//youtube transcriptor api logic
async function getTranscript() {
    const url = 'https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=8aGhZQkoFbQ&lang=en';
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

async function main() {
    let transcription = await getTranscript();

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
        if (sub['subtitle'].includes('function')) {
            // clean subs
            
            matches.push({
                subtitle: sub['subtitle'].replace(/\n/ , ' ').replace('&#39;', "'"),
                start: sub['start']
            })
        }
    });
    console.log(matches)
}

let youtubeUrl;
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
     youtubeUrl = tabs[0].url;
});
console.log(youtubeUrl);

var loadingContainer = document.querySelector('.loading-container');
var contentContainer = document.querySelector('.popup-container');

window.onload = function() {
    // Show loading container
    contentContainer.style.display = 'none';
    loadingContainer.style.display = 'block';
    main();

};
