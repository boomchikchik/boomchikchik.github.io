// =============== BASIC UTILITIES ===============

// Get current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const yearNow = document.getElementById('yearNow');
    if (yearNow) {
        yearNow.textContent = new Date().getFullYear();
    }
});

// Small helper to show toast-style alerts
function showMessage(msg) {
    // Simple fallback
    alert(msg);
}

// =============== PLYR SETUP ===============

const controls = [
    'play-large',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'settings',
    'pip',
    'airplay',
    'fullscreen'
];

document.addEventListener('DOMContentLoaded', () => {
    if (window.Plyr) {
        Plyr.setup('.player', { controls });
    }
});

// =============== STREAM URL HANDLING ===============

// We assume the "watch" URL looks like: https://domain.com/watch/xyz
// and we want a "download" / "raw stream" URL like: https://domain.com/dl/xyz

function getStreamUrl() {
    const current = window.location.href;
    if (current.includes('/watch/')) {
        return current.replace('/watch/', '/dl/');
    }
    // Fallback: if URL does not contain /watch/, just return it as-is
    return current;
}

function getFileName() {
    // Take file name from page if present
    const nameEl = document.getElementById('fileNameMain') || document.getElementById('headerFileName');
    if (nameEl && nameEl.textContent.trim()) {
        return nameEl.textContent.trim();
    }
    // Fallback: last part of URL
    const url = new URL(window.location.href);
    const parts = url.pathname.split('/');
    return decodeURIComponent(parts[parts.length - 1] || 'video');
}

// =============== BUTTON ACTIONS ===============

function streamDownload() {
    const streamUrl = getStreamUrl();
    window.open(streamUrl, '_blank');
}

function copyStreamLink() {
    const streamUrl = getStreamUrl();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(streamUrl)
            .then(() => showMessage('Stream link copied to clipboard ✅'))
            .catch(() => {
                // fallback
                legacyCopy(streamUrl);
            });
    } else {
        legacyCopy(streamUrl);
    }
}

function legacyCopy(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    try {
        document.execCommand('copy');
        showMessage('Stream link copied (fallback) ✅');
    } catch (e) {
        showMessage('Unable to copy automatically. Here is the link:\n\n' + text);
    }
    document.body.removeChild(temp);
}

// =============== EXTERNAL PLAYER INTENTS ===============

// VLC: "vlc://<url>"
function vlc_player() {
    const streamUrl = getStreamUrl();
    const intentUrl = 'vlc://' + streamUrl;
    window.location.href = intentUrl;
}

// MX Player (Android)
// Basic intent: "intent:<url>#Intent;package=com.mxtech.videoplayer.ad;end"
function mx_player() {
    const streamUrl = getStreamUrl();
    const fileName = getFileName();

    const intentUrl =
        'intent:' + encodeURI(streamUrl) +
        '#Intent;package=com.mxtech.videoplayer.ad;' +
        'S.title=' + encodeURIComponent(fileName) + ';end';

    window.location.href = intentUrl;
}

// nPlayer (iOS / Android)
// Common scheme: "nplayer-<url>"
function n_player() {
    const streamUrl = getStreamUrl();
    const intentUrl = 'nplayer-' + encodeURI(streamUrl);
    window.location.href = intentUrl;
}

// =============== ABOUT TOGGLE ===============

function toggleAbout() {
    const aboutCard = document.getElementById('aboutCard');
    if (!aboutCard) return;
    aboutCard.classList.toggle('hidden');
}

// Expose functions globally for inline onclick=""
window.streamDownload = streamDownload;
window.copyStreamLink = copyStreamLink;
window.vlc_player = vlc_player;
window.mx_player = mx_player;
window.n_player = n_player;
window.toggleAbout = toggleAbout;

// =============== LIGHT ANTI-DEVTOOLS (optional, not too aggressive) ===============

// Disable right-click (optional)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Block common devtools shortcuts only (not all Ctrl keys)
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (
        key === 'f12' ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (e.ctrlKey && key === 'u')
    ) {
        e.preventDefault();
    }
});
