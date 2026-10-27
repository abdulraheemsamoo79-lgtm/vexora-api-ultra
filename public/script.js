Here's the translated version of the code in English:

const apiData = {
    "Downloader": [
        {
            method: "GET",
            title: "YouTube Downloader",
            status: "online",
            description: "API to download videos or shorts from YouTube.",
            endpoint: "/api/ytdl",
            parameters: [
                {name: "url", type: "text", placeholder: "YouTube URL (example: https://youtube.com/...)"},
                {name: "type", type: "text", placeholder: "Content type (mp4, mp3, all)"}
            ]
        },
        {
            method: "GET",
            title: "Twitter Downloader",
            status: "online",
            description: "API to download videos or images from Twitter.",
            endpoint: "/api/twitterdl",
            parameters: [
                {name: "url", type: "text", placeholder: "Tweet URL (example: https://twitter.com/...)"}
            ]
        },
        {
            method: "GET",
            title: "Instagram Downloader",
            status: "online",
            description: "API to download videos or images from Instagram.",
            endpoint: "/api/igdl",
            parameters: [
                {name: "url", type: "text", placeholder: "Instagram Post URL"}
            ]
        },
        {
            method: "GET",
            title: "Facebook Downloader",
            status: "online",
            description: "API to download videos from Facebook.",
            endpoint: "/api/fbdl",
            parameters: [
                {name: "url", type: "text", placeholder: "Facebook URL (example: https://fb.watch/...)"}
            ]
        },
        {
            method: "GET",
            title: "TikTok Downloader",
            status: "online",
            description: "API to download videos/images from TikTok.",
            endpoint: "/api/ttdl",
            parameters: [
                {name: "url", type: "text", placeholder: "TikTok URL (example: https://vm.tiktok.com/...)"}
            ]
        },
        {
            method: "GET",
            title: "GitHub Cloning",
            status: "online",
            description: "Cloning repositories from GitHub.",
            endpoint: "/api/gitclone",
            parameters: [
                {name: "url", type: "text", placeholder: "GitHub Repo URL (example: https://github.com/...)"}
            ]
        },
        {
            method: "GET",
            title: "Spotify Downloader",
            status: "online",
            description: "Download all songs from Spotify easily.",
            endpoint: "/api/spotifydl",
            parameters: [
                {name: "url", type: "text", placeholder: "Spotify URL (track/playlist/album)"}
            ]
        },
        {
            method: "GET",
            title: "Aptoide Downloader",
            status: "online",
            description: "Download any available APK from Aptoide.",
            endpoint: "/api/aptoide",
            parameters: [
                {name: "q", type: "text", placeholder: "App Name (example: WhatsApp)"}
            ]
        }
    ],
    "Search": [
        {
            method: "GET",
            title: "Search Groups",
            status: "online",
            description: "API to search for WhatsApp groups by keyword.",
            endpoint: "/api/searchgroups",
            parameters: [
                {name: "q", type: "text", placeholder: "Keyword (example: Programming)"}
            ]
        },
        {
            method: "GET",
            title: "Random Meme",
            status: "online",
            description: "Random image containing a meme, can specify count (number).",
            endpoint: "/api/randommeme",
            parameters: [
                {name: "count", type: "number", placeholder: "Number of memes (1-10)"}
            ]
        },
        {
            method: "GET",
            title: "TikTok Search",
            status: "online",
            description: "API to search for TikTok videos by query.",
            endpoint: "/api/ttsearch",
            parameters: [
                {name: "q", type: "text", placeholder: "Search keyword"}
            ]
        },
        {
            method: "GET",
            title: "YouTube Search",
            status: "online",
            description: "API to search for YouTube videos by keyword or query.",
            endpoint: "/api/ytsearch",
            parameters: [
                {name: "q", type: "text", placeholder: "Search keyword"}
            ]
        },
        {
            method: "GET",
            title: "NPM Search",
            status: "online",
            description: "Search for available packages/modules/libraries based on your query (q).",
            endpoint: "/api/npmsearch",
            parameters: [
                {name: "q", type: "text", placeholder: "Package name (example: react)"}
            ]
        },
        {
            method: "GET",
            title: "Google Search",
            status: "online",
            description: "Search anything and everything from Google quickly.",
            endpoint: "/api/googlesearch",
            parameters: [
                {name: "q", type: "text", placeholder: "Search keyword"}
            ]
        },
        {
            method: "GET",
            title: "DuckDuckGo Search",
            status: "offline",
            description: "Search anything and everything from DuckDuckGo easily.",
            endpoint: "/api/duckduckgo",
            parameters: [
                {name: "q", type: "text", placeholder: "Search keyword"}
            ]
        },
        {
            method: "GET",
            title: "Pinterest",
            status: "online",
            description: "Search for images on Pinterest based on your query (q).",
            endpoint: "/api/pinterest",
            parameters: [
                {name: "q", type: "text", placeholder: "Image search keyword"}
            ]
        },
        {
            method: "GET",
            title: "Spotify Search",
            status: "online",
            description: "Search for songs with additional information based on your query (q).",
            endpoint: "/api/spotifysearch",
            parameters: [
                {name: "q", type: "text", placeholder: "Song/artist title"}
            ]
        }
    ],
    "Stalker": [
        {
            method: "GET",
            title: "Genshin Stalk",
            status: "online",
            description: "Stalk Genshin accounts based on your UID.",
            endpoint: "/api/gistalk",
            parameters: [
                {name: "uid", type: "text", placeholder: "Enter UID (example: 812345678)"}
            ]
        },
        {
            method: "GET",
            title: "GitHub Stalk",
            status: "online",
            description: "Stalk GitHub accounts based on username.",
            endpoint: "/api/githubstalk",
            parameters: [
                {name: "username", type: "text", placeholder: "GitHub Username (example: johndoe)"}
            ]
        }
    ],
    "AI": [
        {
            method: "GET",
            title: "LLaMA 3.3 70B Versatile",
            status: "online",
            description: "API to access the versatile LLaMA 3.3 70B model.",
            endpoint: "/api/llama-3.3-70b-versatile",
            parameters: [
                {name: "content", type: "text", placeholder: "Text input (example: Explain quantum computing)"}
            ]
        },
        {
            method: "GET",
            title: "Blackbox AI",
            status: "online",
            description: "API to access the versatile Blackbox AI.",
            endpoint: "/api/blackboxai",
            parameters: [
                {name: "message", type: "text", placeholder: "Question/command"}
            ]
        }, 
        {
            method: "GET",
            title: "Gemini AI",
            status: "online",
            description: "API to access the versatile Gemini AI model.",
            endpoint: "/api/gemini",
            parameters: [
                {name: "text", type: "text", placeholder: "Question/command"}
            ]
        },
        {
            method: "GET",
            title: "Txt2Img",
            status: "online",
            description: "API to generate images with various styles from AI.",
            endpoint: "/api/txt2img",
            parameters: [
                {name: "prompt", type: "text", placeholder: "Image description"},
                {name: "style", type: "text", placeholder: "Style (example: anime, realistic)"}
            ]
        }
    ],
    "Tools": [
        {
            method: "GET",
            title: "Genshin Character Build",
            status: "online",
            description: "Complete Genshin Impact character builds based on your query (q).",
            endpoint: "/api/genshinbuild",
            parameters: [
                {name: "q", type: "text", placeholder: "Character name (example: Xiao)"}
            ]
        },
        {
            method: "GET",
            title: "Get Pastebin",
            status: "online",
            description: "Retrieve code from Pastebin based on your URL.",
            endpoint: "/api/getpastebin",
            parameters: [
                {name: "url", type: "text", placeholder: "Example: https://pastebin.com/abc"}
            ]
        },
        {
            method: "GET",
            title: "Website to Zip",
            status: "online",
            description: "Convert a website to a Zip file based on your URL parameter.",
            endpoint: "/api/web2zip",
            parameters: [
                {name: "url", type: "text", placeholder: "https://..."}
            ]
        },
        {
            method: "GET",
            title: "Screenshot Web",
            status: "online",
            description: "API to take a screenshot of a website easily.",
            endpoint: "/api/ssweb",
            parameters: [
                {name: "url", type: "text", placeholder: "Website URL (example: https://google.com)"}
            ]
        },
        {
            method: "GET",
            title: "Translate",
            status: "online",
            description: "API to translate any language to your desired language.",
            endpoint: "/api/translate",
            parameters: [
                {name: "text", type: "text", placeholder: "Text to translate"},
                {name: "to", type: "text", placeholder: "Target language code (example: en, id)"}
            ]
        },
        {
            method: "GET",
            title: "Weather",
            status: "online",
            description: "Get weather information for any city worldwide based on city query.",
            endpoint: "/api/cuaca",
            parameters: [
                {name: "city", type: "text", placeholder: "City name (example: Jakarta)"}
            ]
        },
        {
            method: "GET",
            title: "Credit Card Generator",
            status: "online",
            description: "Fake credit card generator for fun purposes.",
            endpoint: "/api/vcc",
            parameters: [
                {name: "type", type: "text", placeholder: "Card type (example: visa)"},
                {name: "count", type: "number", placeholder: "Number of cards (1-10)"}
            ]
        }
    ],
    "Fun": [
        {
            method: "GET",
            title: "Check Khodam",
            status: "online",
            description: "Fun game to show someone's Khodam based on name.",
            endpoint: "/api/cekkhodam",
            parameters: [
                {name: "name", type: "text", placeholder: "Enter name"}
            ]
        },
        {
            method: "GET",
            title: "Did You Know?",
            status: "online",
            description: "Fun game to show random facts that you might not know.",
            endpoint: "/api/tahukahkamu",
            parameters: [] // No parameters
        }
    ],
    "Maker": [
        {
            method: "GET",
            title: "Welcome-Goodbye Image",
            status: "online",
            description: "Create custom welcome and goodbye card images.",
            endpoint: "/api/welcome-goodbye-image",
            parameters: [
                {name: "name", type: "text", placeholder: "Enter name."},
                {name: "profile", type: "text", placeholder: "https://..."},
                {name: "welcome", type: "text", placeholder: "true/false"}
            ]
        },
        {
            method: "GET",
            title: "Tweet Generator",
            status: "online",
            description: "Create fake tweet images with customizable Avatar, Likes, Replies, Retweets, etc.",
            endpoint: "/api/tweet",
            parameters: [
                {name: "text", type: "text", placeholder: "Tweet text"},
                {name: "displayName", type: "text", placeholder: "Display name"},
                {name: "sender", type: "text", placeholder: "@username"},
                {name: "avatar", type: "text", placeholder: "Profile image URL"},
                {name: "replies", type: "number", placeholder: "Number of replies"},
                {name: "retweets", type: "number", placeholder: "Number of retweets"},
                {name: "likes", type: "number", placeholder: "Number of likes"}
            ]
        },
        {
            method: "GET",
            title: "Ghibli Image",
            status: "online",
            description: "Create images in Ghibli style based on your prompt.",
            endpoint: "/api/ghibliimage",
            parameters: [
                {name: "prompt", type: "text", placeholder: "Example: girl enjoying sunset"}
            ]
        },
        {
            method: "GET",
            title: "Emojimix",
            status: "online",
            description: "Create unique emoji combinations.",
            endpoint: "/api/emojimix",
            parameters: [
                {name: "emoji1", type: "text", placeholder: "Example: 😁"},
                {name: "emoji2", type: "text", placeholder: "Example: 🤭"}
            ]
        },
        {
            method: "GET",
            title: "QR Code Generator",
            status: "online",
            description: "Generate QR codes automatically and easily.",
            endpoint: "/api/qrcodegenerator",
            parameters: [
                {name: "text", type: "text", placeholder: "Text/URL for QR"}
            ]
        },
        {
            method: "GET",
            title: "Write",
            status: "online",
            description: "Create book images with writing based on your text query.",
            endpoint: "/api/nulis",
            parameters: [
                {name: "text", type: "text", placeholder: "Text to write in book"}
            ]
        }
    ],
    "Sticker": [
        {
            method: "GET",
            title: "Brat Image",
            status: "online",
            description: "Convert your text into a brat image.",
            endpoint: "/api/brat",
            parameters: [
                {name: "text", type: "text", placeholder: "Enter text here."}
            ]
        },
        {
            method: "GET",
            title: "Quoted Chat",
            status: "online",
            description: "Create a quoted chat image with custom name, color, profile picture, and more.",
            endpoint: "/api/qc",
            parameters: [
                {name: "text", type: "text", placeholder: "Message content"},
                {name: "name", type: "text", placeholder: "Sender name"},
                {name: "color", type: "color", placeholder: "Bubble color"},
                {name: "profile", type: "text", placeholder: "Profile image URL"}
            ]
        }
    ],
    "News": [
        {
            method: "GET",
            title: "Detik News",
            status: "online",
            description: "Get the latest news from Detik News.",
            endpoint: "/api/detiknews",
            parameters: [] // No parameters
        },
        { 
            method: "GET",
            title: "Kompas",
            status: "online",
            description: "Get the latest news from Kompas.",
            endpoint: "/api/kompasnews",
            parameters: [] // No parameters
        }
    ]      
};

const changelogData = [
     {
         date: "June 5, 2025",
         updates: [
              "Added a new endpoint /api/web2zip under the Tools category, please use responsibly and not for illegal purposes."
         ]
     },
     {
         date: "June 5, 2025 V2",
         updates: [ 
              "Added a new endpoint /api/ghibliimage under the Maker category, please use responsibly and not for illegal purposes."
         ]
     }    
]

let changelogRead = localStorage.getItem('changelogRead') === 'true';
let currentlyOpenItem = null;

function syntaxHighlight(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
    }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            cls = match.endsWith(':') ? 'key' : 'string';
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
    });
}

function setupTryItFeature(apiItem, endpoint, title, parameters) {
    const tryItBtn = document.createElement('button');
    tryItBtn.className = 'try-it-btn';
    tryItBtn.innerHTML = '<i class="fas fa-flask"></i> Try It';
    const buttonContainer = apiItem.querySelector('.api-button-container');
    buttonContainer.appendChild(tryItBtn);

    tryItBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openApiModal(endpoint, title, parameters);
    });
}

function openApiModal(endpoint, title, parameters) {
    const modal = document.getElementById('apiModal');
    const modalTitle = document.getElementById('modalTitle');
    const testerUrl = modal.querySelector('.tester-url');
    const responseContent = modal.querySelector('.response-content');
    const paramsContainer = modal.querySelector('.params-container');

    modalTitle.textContent = title;
    testerUrl.value = endpoint;
    paramsContainer.innerHTML = '';

    if(parameters && parameters.length) {
        parameters.forEach(param => {
            const wrapper = document.createElement('div');
