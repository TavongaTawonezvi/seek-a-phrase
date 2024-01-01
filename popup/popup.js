
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
        
        return result[0].transcription[0];

    } catch (error) {
        console.error(error)
	    return error;
    }

    
}

async function main() {
    let transcription = await getTranscript();
    console.log(transcription)
}

main();
