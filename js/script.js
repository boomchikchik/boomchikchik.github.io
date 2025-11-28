// ================================
//  CONFIG: TMDB MOVIE SUGGESTION
// ================================
const TMDB_API_KEY = '6abcb6bb99fb77f33c37016a28866ed2';

// Optional movie suggestion (only runs if related elements exist)
async function getDets() {
    // Check if movie suggestion elements exist in current HTML
    const movieCont = document.querySelector('.movieSug');
    const img = document.querySelector('.movieimg img');
    const movieDets = document.querySelector('.movieDets');
    const movieDetsMini = document.querySelector('.movieDets-mini');

    // If new template doesn't have these – just skip silently
    if (!movieCont || !img || !movieDets || !movieDetsMini) return;

    try {
        let randPage = Math.floor(1 + Math.random() * 100);

        let apiArr = [
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=hin-US&page=${randPage}`,
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&language=hin-US&page=${randPage}`,
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=hin-US&page=${randPage}`
        ];

        let ArrRanIndex = Math.floor(Math.random() * apiArr.length);
        let apiUrl = apiArr[ArrRanIndex];

        let data = await fetch(apiUrl);
        let resData = await data.json();

        if (!resData || !resData.results || !resData.results.length) return;

        let ranIndex = Math.floor(Math.random() * resData.results.length);
        let movie = resData.results[ranIndex];

        movieDets.innerHTML = `
            <h3>Must-see blockbuster film!</h3>
            <h4><span>Title:</span> ${movie.title}</h4>
            <h4><span>Movie overview:</span> ${movie.overview || 'No overview available.'}</h4>
            <h4><span>Release Date:</span> ${movie.release_date || 'N/A'}</h4>
            <h4><span>Rating:</span> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</h4>
        `;

        movieDetsMini.innerHTML = `
            <h3><span>Title:</span> ${movie.title}</h3>
            <h3><span>Release Date:</span> ${movie.release_date || 'N/A'}</h3>
            <h3><span>Rating:</span> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</h3>
        `;

        if (movie.poster_path) {
            img.src = `https://image.tmdb.org/t/p/w1280/${movie.poster_path}`;
        }

        if (movie.backdrop_path) {
            movieCont.style.backgroundImage =
                `url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})`;
        }
    } catch (err) {
        console.error('TMDB fetch error:', err);
    }
}

// =============================================
//  GLOBALS: STREAM LINK + EXTERNAL PLAYERS
// =============================================
const videolink = window.location.href;
// /watch/ → /dl/  (adjust to your route if needed)
const streamlink = videolink.replace("/watch/", "/dl/");

function vlc_player() {
    const openVlc = `vlc://${streamlink}`;
    window.location.href = openVlc;
}

function mx_player() {
    const openMx = `intent:${streamlink}#Intent;package=com.mxtech.videoplayer.ad;end`;
    window.location.href = openMx;
}

function n_player() {
    const openNplayer = `nplayer-${streamlink}`;
    window.location.href = openNplayer;
}

function streamDownload() {
    window.location.href = streamlink;
}

function copyStreamLink() {
    const linkToCopy = streamlink.toLowerCase();

    // Fallback for old browsers
    function fallbackCopy(text) {
        return new Promise((resolve, reject) => {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.top = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(textArea);
                ok ? resolve() : reject(new Error('execCommand failed'));
            } catch (err) {
                reject(err);
            }
        });
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(linkToCopy)
            .then(() => {
                console.log('Stream link copied to clipboard!');
                alert('Stream link copied successfully!');
            })
            .catch(err => {
                console.error('Failed to copy link via clipboard API: ', err);
                fallbackCopy(linkToCopy)
                    .then(() => {
                        alert('Stream link copied successfully!');
                    })
                    .catch(e2 => {
                        console.error('Fallback copy failed:', e2);
                        alert('Failed to copy link. Please try manually.');
                    });
            });
    } else {
        // No clipboard API, use fallback
        fallbackCopy(linkToCopy)
            .then(() => {
                console.log('Stream link copied to clipboard (fallback)!');
                alert('Stream link copied successfully!');
            })
            .catch(err => {
                console.error('Failed to copy link (fallback): ', err);
                alert('Failed to copy link. Please try manually.');
            });
    }
}

// =============================================
//  NAV / UI SETUP (SAFE, OPTIONAL)
// =============================================
function setupNavAndUI() {
    const heading = document.getElementById("heading");
    if (heading && heading.classList.contains("title")) {
        const titleEl = document.querySelector(".title");
        if (titleEl) titleEl.textContent = 'FILE STREAM';
    }

    // Old template classes – only run if they exist so new template won’t break
    const homeBtn = document.querySelector(".home-btn");
    const abtBtn = document.querySelector(".about-btn");
    const dldBtn_outer = document.querySelector(".downloadBtn");
    const file_name = document.querySelector(".file-name");
    const about_nav = document.querySelector(".about-nav");
    const contact_btn = document.querySelector('.contact-btn');
    const links = document.querySelectorAll('.links a');
    const chnl_link = document.querySelectorAll('.chnl-link a');
    const abt_chnl = document.querySelector('.abt-chnl');
    const contact = document.querySelectorAll('.contact a');
    const footer = document.querySelector('footer');

    let timer = 0;

    // If these don't exist in new template, skip gracefully
    if (homeBtn && abtBtn && dldBtn_outer && file_name && about_nav && footer) {
        // default active
        homeBtn.classList.add('active');

        abtBtn.addEventListener("click", () => {
            dldBtn_outer.style.display = "none";
            file_name.style.display = "none";
            footer.style.display = "none";
            about_nav.style.display = "block";
            about_nav.style.animation = "strtLoad 1s ease 0s forwards";
        });

        homeBtn.addEventListener("click", () => {
            dldBtn_outer.style.display = "flex";
            file_name.style.display = "block";
            footer.style.display = "block";
            window.location.href = "#main";
            about_nav.style.animation = "strtLoad 1s ease 0s forwards";
            about_nav.style.display = "none";
        });
    }

    if (abt_chnl && chnl_link.length) {
        abt_chnl.addEventListener("click", () => {
            timer = 1;
            chnl_link.forEach((i) => {
                i.style.animation = `strtLoad 1s ease ${timer}s forwards, linksBtnAn 2s ease ${timer}s infinite `;
                timer += 0.3;
            });
            timer = 0;
        });
    }

    // Download button animations (if present)
    const dldBtn = document.querySelectorAll('.downloadBtn button');
    timer = 0;
    dldBtn.forEach((i) => {
        i.style.animation = `strtLoad 1s ease ${timer}s forwards, linksBtnAn 2s ease ${timer}s infinite`;
        timer += 0.3;
        i.style.setProperty(
            "--beforestyl",
            `button_shine ${2 + Math.random() * 7}s ease ${Math.random() * 10}s infinite`
        );
    });

    // Links animation (old template – safe check)
    timer = 0;
    links.forEach((i) => {
        i.style.animation = `linksBtnAn 2s ease ${timer}s infinite`;
        timer += 0.3;
        i.style.setProperty(
            "--beforestyl",
            `button_shine ${2 + Math.random() * 7}s ease ${Math.random() * 10}s infinite`
        );
    });

    // File name trimming (if #myDiv exists)
    const div = document.getElementById('myDiv');
    if (div) {
        const text = div.textContent || '';
        if (text.length > 300) {
            div.textContent = text.slice(0, 300) + "....";
        }
    }

    // Contact button animation (if exists)
    if (contact_btn && contact.length) {
        contact_btn.addEventListener("click", () => {
            let timer = 1;
            contact.forEach((i) => {
                i.style.animation =
                    `linksBtnAn 2s ease ${timer}s infinite ,strtLoad 1s ease ${timer}s forwards`;
                timer += 0.3;
            });
        });
    }

    // Optional Shery mouse follower (only on desktop, if lib loaded)
    if (
        typeof Shery !== "undefined" &&
        !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    ) {
        Shery.mouseFollower();
        Shery.makeMagnet(".magnet");
    }
}

// =============================================
//  PLYR PLAYER INIT
// =============================================
function initPlyr() {
    const controls = [
        'play-large',
        'rewind', 'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        //'mute',
        //'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        // 'download',
        'fullscreen'
    ];

    const playerElement = document.querySelector('.player, #player');
    if (!playerElement || typeof Plyr === "undefined") return;

    // If #player is video element, use that id; else use .player
    const selector = playerElement.id ? `#${playerElement.id}` : '.player';

    Plyr.setup(selector, { controls });
}

// =============================================
//  ANTI-INSPECT / CONTEXT MENU (OPTIONAL)
// =============================================
function lockContextAndKeys() {
    // Disable right click
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Block F12, Ctrl+Shift+I, Ctrl+U, and plain Ctrl / Shift / Alt (your original behaviour)
    document.addEventListener('keydown', function (e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u') ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
        ) {
            e.preventDefault();
        }
    });
}

// =============================================
//  DOM READY
// =============================================
document.addEventListener("DOMContentLoaded", () => {
    initPlyr();
    setupNavAndUI();
    lockContextAndKeys();      // comment out if you don’t want this
    getDets();                 // safe: only runs if movie elements exist
});
