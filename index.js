// Initialize Lucide Icons
lucide.createIcons();

// State
let isDark = true;
const terminalFeed = document.getElementById('terminal-feed');

// Tab Switching
function switchTab(tabId) {
    // Prevent error if IDs don't exist
    const targetSection = document.getElementById(tabId);
    const targetNav = document.getElementById('nav-' + tabId);

    if (!targetSection || !targetNav) {
        console.warn(`Tab navigation failed: ${tabId} elements not found.`);
        logToTerminal(`Błąd: ${tabId.toUpperCase()} niedostępny.`);
        return;
    }

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    targetSection.classList.add('active');
    targetNav.classList.add('active');

    logToTerminal(`${tabId.toUpperCase()}`);
}

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    isDark = !isDark;
    if (isDark) {
        html.setAttribute('theme', 'dark');
        if (themeText) themeText.innerText = "|";
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        html.removeAttribute('theme');
        if (themeText) themeText.innerText = "|";
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    }
    logToTerminal(`Motyw: ${isDark ? 'OBLIVION' : 'STASIS'}`);

    // Re-render icons to apply changes to data-lucide attribute
    lucide.createIcons();
}

// Terminal Logic
function logToTerminal(msg) {
    if (!terminalFeed) return;
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="timestamp">[${time}]</span> <span class="cmd">></span> ${msg}`;
    terminalFeed.appendChild(line);
    terminalFeed.scrollTop = terminalFeed.scrollHeight;

    // Limit lines
    if (terminalFeed.children.length > 50) terminalFeed.removeChild(terminalFeed.firstChild);
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast-' + type : '');
    toast.setAttribute('role', 'alert');
    const label = type === 'critical' ? 'Błąd' : type === 'success' ? 'Sukces' : type === 'warning' ? 'Uwaga' : type === 'info' ? 'Info' : 'Powiadomienie';
    toast.innerHTML = '<div class="toast-header"><span class="toast-label">' + label + '</span><button type="button" class="toast-close" aria-label="Zamknij">&times;</button></div><div class="toast-message">' + (message || '').replace(/</g, '&lt;') + '</div>';
    container.appendChild(toast);
    const close = () => {
        toast.classList.add('closing');
        setTimeout(() => toast.remove(), 300);
    };
    toast.querySelector('.toast-close')?.addEventListener('click', close);
    setTimeout(close, 5000);
}

function startLiveTimer() {
    const timerEl = document.getElementById('live-timer');
    if (timerEl) {
        const update = () => {
            timerEl.innerText = new Date().toTimeString().split(' ')[0];
        };
        update();
        setInterval(update, 1000);
    }
}
// Archive: fetch linki.json and render links
const ARCHIVE_JSON_URL = 'https://raw.githubusercontent.com/s-pro-v/json-lista/refs/heads/main/linki/linki.json';
const archiveLinksEl = document.getElementById('archive-links');

// Active_Node_Map: fetch home.json
const HOME_JSON_URL = 'https://raw.githubusercontent.com/s-pro-v/json-lista/refs/heads/main/linki/home.json';
const networkLinksEl = document.getElementById('network-links');

const JSON_LISTA_REPO = 's-pro-v/json-lista';
const JSON_LISTA_HOME_PATH = 'linki/home.json';
const JSON_LISTA_LINKI_PATH = 'linki/linki.json';
const AUTH_JSON_URL = 'https://raw.githubusercontent.com/s-pro-v/json-lista/refs/heads/main/dev/auth.json';
const AUTH_XOR_KEY = String.fromCharCode(119, 53, 103);

const notesListEl = document.getElementById('notes-list');
const STORAGE_KEY = 'hub-notes';
const GITHUB_TOKEN_KEY = 'hub-github-token';
const GITHUB_API = 'https://api.github.com';
const GITHUB_REPO = 's-pro-v/fastnote';
const GITHUB_SNOTE_PATH = 's-note.json';

function domainFromUrl(href) {
    try {
        const u = new URL(href);
        return u.hostname.replace(/^www\./, '');
    } catch (_) { return ''; }
}

function getFaviconUrl(url) {
    if (!url || url === '#') return '';
    const cleanUrl = (url + '')
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
    if (cleanUrl.includes('carrd.co')) {
        return `https://${cleanUrl}/assets/images/favicon.png`;
    }
    return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${cleanUrl}&size=32`;
}

function handleFaviconError(imgElement, anchor) {
    const attempt = parseInt(imgElement.dataset.attempt, 10) || 1;
    const url = (anchor && anchor.href) || '';
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const isCarrd = cleanUrl.includes('carrd.co');

    if (isCarrd) {
        if (attempt === 1) {
            imgElement.src = `https://${cleanUrl}/assets/images/apple-touch-icon.png`;
            imgElement.dataset.attempt = '2';
        } else if (attempt === 2) {
            imgElement.src = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${cleanUrl}&size=32`;
            imgElement.dataset.attempt = '3';
        } else if (attempt === 3) {
            imgElement.src = `https://favicon.yandex.net/favicon/${cleanUrl}`;
            imgElement.dataset.attempt = '4';
        } else {
            showFaviconFallback(imgElement);
        }
    } else {
        if (attempt === 1) {
            imgElement.src = `https://www.google.com/s2/favicons?domain=${cleanUrl}&sz=32`;
            imgElement.dataset.attempt = '2';
        } else if (attempt === 2) {
            imgElement.src = `https://icons.duckduckgo.com/ip3/${cleanUrl}.ico`;
            imgElement.dataset.attempt = '3';
        } else if (attempt === 3) {
            imgElement.src = `https://${cleanUrl}/favicon.ico`;
            imgElement.dataset.attempt = '4';
        } else {
            showFaviconFallback(imgElement);
        }
    }
}

function showFaviconFallback(imgElement) {
    imgElement.style.display = 'none';
    const fallback = imgElement.nextElementSibling;
    if (fallback) fallback.style.display = 'inline-block';
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getFirstLetter(url) {
    try {
        const domain = (url || '').replace(/^https?:\/\//, '').replace(/^www\./, '');
        return (domain.charAt(0) || 'W').toUpperCase();
    } catch (e) { return 'W'; }
}

function xorDecrypt(base64Str, keyStr) {
    if (!base64Str || !keyStr) return '';
    const raw = atob(base64Str.replace(/\s/g, ''));
    const data = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) data[i] = raw.charCodeAt(i);
    const key = new TextEncoder().encode(keyStr);
    for (let i = 0; i < data.length; i++) data[i] = data[i] ^ key[i % key.length];
    return new TextDecoder().decode(data);
}

function fetchAuthToken() {
    return fetch(AUTH_JSON_URL + '?t=' + Date.now())
        .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('auth.json nie dostępny')); })
        .then(function (arr) {
            if (!Array.isArray(arr)) return Promise.reject(new Error('auth.json: nieprawidłowy format'));
            const entry = arr.find(function (o) { return o && o.matrix_pat != null; });
            if (!entry || !entry.matrix_pat) return Promise.reject(new Error('auth.json: brak matrix_pat'));
            var token = xorDecrypt(entry.matrix_pat, AUTH_XOR_KEY);
            return token || Promise.reject(new Error('Odszyfrowanie nie powiodło się (sprawdź AUTH_XOR_KEY)'));
        });
}

function fetchJsonListaFile(path) {
    const token = getGitHubToken();
    if (!token) return Promise.reject(new Error('Brak tokena. Ustaw Token.'));
    const url = GITHUB_API + '/repos/' + JSON_LISTA_REPO + '/contents/' + path;
    return fetch(url, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token } })
        .then(res => {
            if (!res.ok) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            return res.json();
        })
        .then(file => ({
            content: file.content ? b64DecodeUtf8(file.content) : '',
            sha: file.sha
        }));
}

function putJsonListaFile(path, content, sha, message) {
    const token = getGitHubToken();
    if (!token) return Promise.reject(new Error('Brak tokena.'));
    const url = GITHUB_API + '/repos/' + JSON_LISTA_REPO + '/contents/' + path;
    const body = { message: message || 'Hub: aktualizacja ' + path, content: b64EncodeUtf8(content) };
    if (sha) body.sha = sha;
    return fetch(url, {
        method: 'PUT',
        headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(res => {
        if (!res.ok) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
        return res.json();
    });
}

function loadArchiveLinks() {
    if (!archiveLinksEl) return;
    archiveLinksEl.innerHTML = '<p class="empty-state-msg">LOADING_REGISTRY...</p>';
    var url = ARCHIVE_JSON_URL + '?t=' + Date.now();
    fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject(new Error('Network error')))
        .then(data => {
            const nodes = data.nodes || [];
            if (nodes.length === 0) {
                archiveLinksEl.innerHTML = '<p class="empty-state-msg">ARCHIVE_EMPTY. NO_NODES. Kliknij „Dodaj link”.</p>';
                updateLinksCounts();
                return;
            }
            archiveLinksEl.innerHTML = nodes.map(node => {
                const id = (node.id || '').replace(/"/g, '&quot;');
                const name = (node.name || node.id || '').replace(/"/g, '&quot;');
                const url = (node.url || '#').replace(/"/g, '&quot;');
                const faviconUrl = getFaviconUrl(node.url || '');
                const img = faviconUrl
                    ? `<img class="favicon" src="${faviconUrl}" alt="" onerror="handleFaviconError(this, this.closest('a'))"><i data-lucide="link" style="display:none;"></i>`
                    : '<i data-lucide="link"></i>';
                return `<div class="node-link-wrap" data-id="${id}" data-name="${name}"><a href="${url}" target="_blank" rel="noopener" class="node-link ripple-el">${img} <span class="node-link__name">${name}</span></a><button type="button" class="node-link-delete" aria-label="Usuń" data-id="${id}" data-name="${name}"><i data-lucide="trash-2"></i></button></div>`;
            }).join('');
            lucide.createIcons();
            archiveLinksEl.querySelectorAll('.node-link-delete').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var id = e.currentTarget.getAttribute('data-id');
                    var name = e.currentTarget.getAttribute('data-name') || id;
                    if (id) deleteArchiveLink(id, name);
                });
            });
            logToTerminal(`Archive: ${nodes.length} linków`);
            updateLinksCounts();
        })
        .catch(err => {
            archiveLinksEl.innerHTML = '<p class="empty-state-msg--error">ARCHIVE_OFFLINE. ACCESS_DENIED.</p>';
            logToTerminal('Archive: błąd');
            updateLinksCounts();
        });
}

function updateLinksCounts() {
    const networkEl = document.getElementById('network-links');
    const archiveEl = document.getElementById('archive-links');
    const n = networkEl ? networkEl.querySelectorAll('.node-link').length : 0;
    const a = archiveEl ? archiveEl.querySelectorAll('.node-link').length : 0;
    const networkCountEl = document.getElementById('network-links-count');
    const archiveCountEl = document.getElementById('archive-links-count');
    const allCountEl = document.getElementById('all-links-count');
    if (networkCountEl) networkCountEl.textContent = n;
    if (archiveCountEl) archiveCountEl.textContent = a;
    if (allCountEl) allCountEl.textContent = n + a;
}

function loadNetworkLinks() {
    if (!networkLinksEl) return;
    networkLinksEl.innerHTML = '<p class="empty-state-msg">LOADING_NODES...</p>';
    var url = HOME_JSON_URL + '?t=' + Date.now();
    fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject(new Error('Network error')))
        .then(data => {
            const nodes = Array.isArray(data) ? data : (data.nodes || data.items || []);
            if (nodes.length === 0) {
                networkLinksEl.innerHTML = '<p class="empty-state-msg">NO_ACTIVE_NODES. Kliknij „Dodaj link”.</p>';
                updateLinksCounts();
                return;
            }
            networkLinksEl.innerHTML = nodes.map((node) => {
                const id = (node.id || '').replace(/"/g, '&quot;');
                const name = (node.name || node.id || '').replace(/"/g, '&quot;');
                const url = (node.url || '#').replace(/"/g, '&quot;');
                const faviconUrl = getFaviconUrl(node.url || '');
                const img = faviconUrl
                    ? `<img class="favicon" src="${faviconUrl}" alt="" onerror="handleFaviconError(this, this.closest('a'))"><i data-lucide="server" style="display:none;"></i>`
                    : '<i data-lucide="server"></i>';
                return `<div class="node-link-wrap" data-id="${id}" data-name="${name}"><a href="${url}" target="_blank" rel="noopener" class="node-link ripple-el">${img} <span class="node-link__name">${name}</span></a><button type="button" class="node-link-delete" aria-label="Usuń" data-id="${id}" data-name="${name}"><i data-lucide="trash-2"></i></button></div>`;
            }).join('');
            lucide.createIcons();
            networkLinksEl.querySelectorAll('.node-link-delete').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var id = e.currentTarget.getAttribute('data-id');
                    var name = e.currentTarget.getAttribute('data-name') || id;
                    if (id) deleteNetworkLink(id, name);
                });
            });
            logToTerminal(`Network: ${nodes.length} węzłów`);
            updateLinksCounts();
        })
        .catch(err => {
            networkLinksEl.innerHTML = '<p class="empty-state-msg--error">NODE_MAP_OFFLINE. ACCESS_DENIED.</p>';
            logToTerminal('Network: błąd');
            updateLinksCounts();
        });
}

function deleteNetworkLink(id, displayName) {
    if (!linksEditMode) return;
    if (!id) return;
    openConfirmDeleteLinkModal(id, displayName || id, 'network');
}

function doDeleteNetworkLink(id) {
    var idStr = String(id).trim();
    fetchJsonListaFile(JSON_LISTA_HOME_PATH)
        .then(({ content, sha }) => {
            let arr = [];
            try { arr = JSON.parse(content); } catch (_) { }
            if (!Array.isArray(arr)) arr = [];
            const next = arr.filter(function (n) { return String(n.id || '').trim() !== idStr; });
            if (next.length === arr.length) {
                return Promise.reject(new Error('Nie znaleziono linku o id: ' + idStr));
            }
            return putJsonListaFile(JSON_LISTA_HOME_PATH, JSON.stringify(next, null, 4), sha, 'Hub: usunięto link ' + idStr);
        })
        .then(function () { loadNetworkLinks(); logToTerminal('Network: link usunięty z GitHub'); showToast('Link usunięty z GitHub.', 'success'); })
        .catch(function (err) { logToTerminal('Network: błąd usuwania'); showToast(err.message || 'Błąd usuwania', 'critical'); });
}

function addNetworkLink(payload) {
    const name = (payload.name || '').trim();
    const url = (payload.url || '').trim();
    if (!name || !url) { showToast('Podaj nazwę i URL.', 'warning'); return; }
    fetchJsonListaFile(JSON_LISTA_HOME_PATH)
        .then(({ content, sha }) => {
            let arr = [];
            try { arr = JSON.parse(content); } catch (_) { }
            if (!Array.isArray(arr)) arr = [];
            let max = -1;
            arr.forEach(n => {
                const m = /^RES_(\d+)$/i.exec(n.id || '');
                if (m) max = Math.max(max, parseInt(m[1], 10));
            });
            const newId = 'RES_' + String(max + 1).padStart(3, '0');
            arr.push({ id: newId, name: name, url: url, type: 'WEB_SERVICE', status: 'ACTIVE' });
            return putJsonListaFile(JSON_LISTA_HOME_PATH, JSON.stringify(arr, null, 4), sha);
        })
        .then(() => { loadNetworkLinks(); logToTerminal('Network: link dodany'); showToast('Link dodany.', 'success'); })
        .catch(err => { logToTerminal('Network: błąd dodawania'); showToast(err.message || 'Błąd dodawania', 'critical'); });
}

function deleteArchiveLink(id, displayName) {
    if (!linksEditMode) return;
    if (!id) return;
    openConfirmDeleteLinkModal(id, displayName || id, 'archive');
}

function doDeleteArchiveLink(id) {
    var idStr = String(id).trim();
    fetchJsonListaFile(JSON_LISTA_LINKI_PATH)
        .then(({ content, sha }) => {
            let data = { system_status: 'active', registry_version: '1.0.0', nodes: [] };
            try { data = JSON.parse(content); } catch (_) { }
            if (!Array.isArray(data.nodes)) data.nodes = [];
            const before = data.nodes.length;
            data.nodes = data.nodes.filter(function (n) { return String(n.id || '').trim() !== idStr; });
            if (data.nodes.length === before) {
                return Promise.reject(new Error('Nie znaleziono linku o id: ' + idStr));
            }
            return putJsonListaFile(JSON_LISTA_LINKI_PATH, JSON.stringify(data, null, 2), sha, 'Hub: usunięto link ' + idStr);
        })
        .then(function () { loadArchiveLinks(); logToTerminal('Archive: link usunięty z GitHub'); showToast('Link usunięty z GitHub.', 'success'); })
        .catch(function (err) { logToTerminal('Archive: błąd usuwania'); showToast(err.message || 'Błąd usuwania', 'critical'); });
}

function slugId(name) {
    return (name || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'link-' + Date.now();
}

function addArchiveLink(payload) {
    const name = (payload.name || '').trim();
    const url = (payload.url || '').trim();
    if (!name || !url) { showToast('Podaj nazwę i URL.', 'warning'); return; }
    const id = slugId(name);
    fetchJsonListaFile(JSON_LISTA_LINKI_PATH)
        .then(({ content, sha }) => {
            let data = { system_status: 'active', registry_version: '1.0.0', nodes: [] };
            try { data = JSON.parse(content); } catch (_) { }
            if (!Array.isArray(data.nodes)) data.nodes = [];
            if (data.nodes.some(n => (n.id || '') === id)) {
                throw new Error('Link o takiej nazwie już istnieje (id: ' + id + '). Zmień nazwę.');
            }
            data.nodes.push({ id: id, name: name, url: url });
            return putJsonListaFile(JSON_LISTA_LINKI_PATH, JSON.stringify(data, null, 2), sha);
        })
        .then(() => { loadArchiveLinks(); logToTerminal('Archive: link dodany'); showToast('Link dodany.', 'success'); })
        .catch(err => { logToTerminal('Archive: błąd dodawania'); showToast(err.message || 'Błąd dodawania', 'critical'); });
}

function getNotes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (_) {
        return [];
    }
}

function saveNote(note) {
    const notes = getNotes();
    const now = new Date().toISOString();
    if (note.id) {
        const idx = notes.findIndex(n => n.id === note.id);
        if (idx >= 0) {
            notes[idx] = { ...notes[idx], title: note.title || '', content: note.content || '', updatedAt: now };
        } else {
            notes.push({ id: note.id, title: note.title || '', content: note.content || '', createdAt: now, updatedAt: now });
        }
    } else {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        notes.push({ id, title: note.title || '', content: note.content || '', createdAt: now, updatedAt: now });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    renderNotesList();
    logToTerminal('Notes: zapisano');
    showToast('Notatka zapisana.', 'success');
}

function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    renderNotesList();
    closeNoteModal();
    closeConfirmDeleteModal();
    logToTerminal('Notes: usunięto');
    showToast('Notatka usunięta.', 'success');
    syncDeleteToGitHub(id);
}

function syncDeleteToGitHub(noteId) {
    const token = getGitHubToken();
    if (!token) return;
    const getUrl = GITHUB_API + '/repos/' + GITHUB_REPO + '/contents/' + GITHUB_SNOTE_PATH;
    fetch(getUrl, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token } })
        .then(res => {
            if (!res.ok && res.status !== 404) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            return res.status === 404 ? null : res.json();
        })
        .then(file => {
            let list = [];
            let sha = null;
            if (file && file.content) {
                sha = file.sha;
                try {
                    const decoded = b64DecodeUtf8(file.content);
                    list = JSON.parse(decoded);
                    if (!Array.isArray(list)) list = [];
                } catch (_) { list = []; }
            }
            const before = list.length;
            list = list.filter((e) => e.id !== noteId);
            if (list.length === before) return;
            const jsonStr = JSON.stringify(list, null, 2);
            const putUrl = GITHUB_API + '/repos/' + GITHUB_REPO + '/contents/' + GITHUB_SNOTE_PATH;
            const putBody = { message: 'Hub: usunięto notatkę ' + noteId, content: b64EncodeUtf8(jsonStr) };
            if (sha) putBody.sha = sha;
            return fetch(putUrl, {
                method: 'PUT',
                headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify(putBody)
            });
        })
        .then(res => {
            if (res && !res.ok) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            if (res) {
                setGitHubStatus('Usunięto z GitHub', 'ok');
                logToTerminal('GitHub: usunięto z repo');
            }
        })
        .catch(err => {
            setGitHubStatus('Błąd usuwania z GitHub: ' + (err.message || err), 'error');
            logToTerminal('GitHub: błąd usuwania');
        });
}

let pendingDeleteId = null;
const confirmDeleteOverlayEl = document.getElementById('confirm-delete-overlay');
const confirmDeleteModalEl = document.getElementById('confirm-delete-modal');

function openConfirmDeleteModal(id) {
    pendingDeleteId = id;
    if (confirmDeleteOverlayEl) {
        confirmDeleteOverlayEl.classList.add('is-open');
        confirmDeleteOverlayEl.setAttribute('aria-hidden', 'false');
    }
    if (confirmDeleteModalEl) {
        confirmDeleteModalEl.classList.add('active');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeConfirmDeleteModal() {
    pendingDeleteId = null;
    if (confirmDeleteOverlayEl) {
        confirmDeleteOverlayEl.classList.remove('is-open');
        confirmDeleteOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (confirmDeleteModalEl) {
        confirmDeleteModalEl.classList.remove('active');
    }
}

document.getElementById('confirm-delete-cancel')?.addEventListener('click', closeConfirmDeleteModal);
document.getElementById('confirm-delete-cancel-btn')?.addEventListener('click', closeConfirmDeleteModal);
document.getElementById('confirm-delete-ok')?.addEventListener('click', () => {
    if (pendingDeleteId) {
        deleteNote(pendingDeleteId);
    }
    closeConfirmDeleteModal();
});
confirmDeleteOverlayEl?.addEventListener('click', (e) => { if (e.target === confirmDeleteOverlayEl) closeConfirmDeleteModal(); });

let pendingLinkDelete = null;
const confirmDeleteLinkOverlayEl = document.getElementById('confirm-delete-link-overlay');
const confirmDeleteLinkModalEl = document.getElementById('confirm-delete-link-modal');
const confirmDeleteLinkTitleEl = document.getElementById('confirm-delete-link-title');
const confirmDeleteLinkTextEl = document.getElementById('confirm-delete-link-text');

const confirmDeleteLinkOkBtn = document.getElementById('confirm-delete-link-ok');

function openConfirmDeleteLinkModal(id, displayName, listType) {
    var label = (displayName || id) + (displayName && displayName !== id ? ' (' + id + ')' : '');
    pendingLinkDelete = { id: String(id).trim(), name: displayName, listType: listType };
    if (confirmDeleteLinkOkBtn) {
        confirmDeleteLinkOkBtn.setAttribute('data-link-id', pendingLinkDelete.id);
        confirmDeleteLinkOkBtn.setAttribute('data-link-list', listType || '');
    }
    if (confirmDeleteLinkTitleEl) confirmDeleteLinkTitleEl.textContent = 'Usunąć link?';
    if (confirmDeleteLinkTextEl) confirmDeleteLinkTextEl.textContent = '„' + label + '” zostanie usunięty z GitHub' + (listType === 'network' ? ' (Active_Node_Map).' : ' (archiwum).');
    if (confirmDeleteLinkOverlayEl) {
        confirmDeleteLinkOverlayEl.classList.add('is-open');
        confirmDeleteLinkOverlayEl.setAttribute('aria-hidden', 'false');
    }
    if (confirmDeleteLinkModalEl) confirmDeleteLinkModalEl.classList.add('active');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeConfirmDeleteLinkModal() {
    pendingLinkDelete = null;
    if (confirmDeleteLinkOkBtn) {
        confirmDeleteLinkOkBtn.removeAttribute('data-link-id');
        confirmDeleteLinkOkBtn.removeAttribute('data-link-list');
    }
    if (confirmDeleteLinkOverlayEl) {
        confirmDeleteLinkOverlayEl.classList.remove('is-open');
        confirmDeleteLinkOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (confirmDeleteLinkModalEl) confirmDeleteLinkModalEl.classList.remove('active');
}

document.getElementById('confirm-delete-link-cancel')?.addEventListener('click', closeConfirmDeleteLinkModal);
document.getElementById('confirm-delete-link-cancel-btn')?.addEventListener('click', closeConfirmDeleteLinkModal);
confirmDeleteLinkOkBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    var id = this.getAttribute('data-link-id');
    var list = this.getAttribute('data-link-list');
    closeConfirmDeleteLinkModal();
    if (id && list === 'network') doDeleteNetworkLink(id);
    else if (id && list === 'archive') doDeleteArchiveLink(id);
});
confirmDeleteLinkOverlayEl?.addEventListener('click', (e) => { if (e.target === confirmDeleteLinkOverlayEl) closeConfirmDeleteLinkModal(); });

function getGitHubToken() {
    return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
}

function setGitHubToken(token) {
    if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token);
    else localStorage.removeItem(GITHUB_TOKEN_KEY);
}

function b64EncodeUtf8(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))));
}

function b64DecodeUtf8(b64) {
    const raw = atob(b64.replace(/\n/g, ''));
    const bytes = new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
    return new TextDecoder().decode(bytes);
}

const notePushGithubBtn = document.getElementById('note-push-github-btn');
const notePullGithubBtn = document.getElementById('note-pull-github-btn');

const githubStatusEl = document.getElementById('github-status');
function setGitHubStatus(text, state) {
    if (state === 'ok' && text) showToast(text, 'success');
    if (state === 'error' && text) showToast(text, 'critical');
    if (githubStatusEl) {
        githubStatusEl.textContent = state === 'ok' ? 'OK' : (state === 'error' ? (text || 'Błąd') : (text || '—'));
        githubStatusEl.className = 'resource-val' + (state === 'ok' ? ' status-ok' : state === 'error' ? ' status-error' : '');
    }
}

function setGitHubButtonsDisabled(disabled) {
    if (notePushGithubBtn) notePushGithubBtn.disabled = disabled;
    if (notePullGithubBtn) notePullGithubBtn.disabled = disabled;
}

function pushNotesToGitHub() {
    const token = getGitHubToken();
    if (!token) {
        logToTerminal('GitHub: ustaw token.');
        openGitHubTokenModal();
        return;
    }
    setGitHubButtonsDisabled(true);
    const getUrl = GITHUB_API + '/repos/' + GITHUB_REPO + '/contents/' + GITHUB_SNOTE_PATH;
    fetch(getUrl, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token } })
        .then(res => {
            if (!res.ok && res.status !== 404) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            return res.status === 404 ? null : res.json();
        })
        .then(file => {
            let list = [];
            let sha = null;
            if (file && file.content) {
                sha = file.sha;
                try {
                    const decoded = b64DecodeUtf8(file.content);
                    list = JSON.parse(decoded);
                    if (!Array.isArray(list)) list = [];
                } catch (_) { list = []; }
            }
            const notes = getNotes();
            notes.forEach((n) => {
                const entry = { id: n.id, data: n.updatedAt || n.createdAt || new Date().toISOString(), note: JSON.stringify({ title: n.title || '', content: n.content || '' }) };
                const idx = list.findIndex((e) => e.id === n.id);
                if (idx >= 0) list[idx] = entry;
                else list.push(entry);
            });
            const jsonStr = JSON.stringify(list, null, 2);
            const putUrl = GITHUB_API + '/repos/' + GITHUB_REPO + '/contents/' + GITHUB_SNOTE_PATH;
            const putBody = { message: 'Hub notes sync', content: b64EncodeUtf8(jsonStr) };
            if (sha) putBody.sha = sha;
            return fetch(putUrl, {
                method: 'PUT',
                headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify(putBody)
            });
        })
        .then(res => {
            if (!res.ok) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            setGitHubStatus('Wysłano do GitHub (s-note.json)', 'ok');
            updateNotesGitHubCount(getNotes().length);
            logToTerminal(`GitHub: push OK (${getNotes().length} notatek)`);
        })
        .catch(err => {
            setGitHubStatus('Błąd: ' + (err.message || err), 'error');
            logToTerminal('GitHub: błąd push');
        })
        .finally(() => { setGitHubButtonsDisabled(false); });
}

function pullNotesFromGitHub() {
    const token = getGitHubToken();
    if (!token) {
        logToTerminal('GitHub: ustaw token.');
        openGitHubTokenModal();
        return;
    }
    setGitHubButtonsDisabled(true);
    const getUrl = GITHUB_API + '/repos/' + GITHUB_REPO + '/contents/' + GITHUB_SNOTE_PATH;
    fetch(getUrl, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token } })
        .then(res => {
            if (!res.ok) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            return res.json();
        })
        .then(file => {
            if (!file || !file.content) {
                setGitHubStatus('Brak pliku s-note.json w repo', 'error');
                logToTerminal('GitHub: brak pliku');
                return;
            }
            const decoded = b64DecodeUtf8(file.content);
            let arr;
            try {
                arr = JSON.parse(decoded);
            } catch (_) {
                setGitHubStatus('Nieprawidłowy JSON', 'error');
                logToTerminal('GitHub: błąd JSON');
                return;
            }
            const list = Array.isArray(arr) ? arr : [];
            const notes = list.map((e) => {
                let title = 'Bez tytułu';
                let content = '';
                if (e.note) {
                    try {
                        const parsed = JSON.parse(e.note);
                        if (parsed && typeof parsed.title !== 'undefined') title = parsed.title || title;
                        if (parsed && typeof parsed.content !== 'undefined') content = parsed.content || '';
                        else if (typeof e.note === 'string') content = e.note;
                    } catch (_) {
                        content = typeof e.note === 'string' ? e.note : '';
                    }
                }
                const date = e.data || new Date().toISOString();
                return { id: e.id || ('n-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9)), title, content, createdAt: date, updatedAt: date };
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            renderNotesList();
            setGitHubStatus('Pobrano z GitHub (' + notes.length + ')', 'ok');
            updateNotesGitHubCount(notes.length);
            logToTerminal(`GitHub: pull OK (${notes.length} notatek)`);
        })
        .catch(err => {
            setGitHubStatus('Błąd: ' + (err.message || err), 'error');
            logToTerminal('GitHub: błąd pull');
        })
        .finally(() => { setGitHubButtonsDisabled(false); });
}

const githubTokenModalEl = document.getElementById('github-token-modal');
const githubTokenInput = document.getElementById('github-token-input');

function openGitHubTokenModal() {
    if (githubTokenInput) githubTokenInput.value = getGitHubToken();
    if (githubTokenModalEl) {
        githubTokenModalEl.classList.add('is-open');
        githubTokenModalEl.setAttribute('aria-hidden', 'false');
        githubTokenInput?.focus();
    }
}

function closeGitHubTokenModal() {
    if (githubTokenModalEl) {
        githubTokenModalEl.classList.remove('is-open');
        githubTokenModalEl.setAttribute('aria-hidden', 'true');
    }
    if (githubTokenInput) githubTokenInput.value = '';
}

document.getElementById('note-github-token-btn')?.addEventListener('click', openGitHubTokenModal);
document.getElementById('note-push-github-btn')?.addEventListener('click', pushNotesToGitHub);
document.getElementById('note-pull-github-btn')?.addEventListener('click', pullNotesFromGitHub);
document.getElementById('github-token-cancel')?.addEventListener('click', closeGitHubTokenModal);
document.getElementById('github-token-load-auth-btn')?.addEventListener('click', function () {
    var btn = this;
    btn.disabled = true;
    btn.textContent = 'Pobieranie…';
    fetchAuthToken()
        .then(function (token) {
            if (githubTokenInput) githubTokenInput.value = token;
            logToTerminal('Token z auth.json (matrix_pat, XOR) załadowany.');
            showToast('Token z auth.json załadowany. Kliknij Zapisz.', 'success');
        })
        .catch(function (err) {
            logToTerminal('auth.json: ' + (err.message || err));
            showToast(err.message || 'Błąd auth.json', 'critical');
        })
        .finally(function () {
            btn.disabled = false;
            btn.textContent = 'Pobierz z auth.json';
        });
});
document.getElementById('github-token-save')?.addEventListener('click', () => {
    const token = (githubTokenInput?.value || '').trim();
    setGitHubToken(token);
    closeGitHubTokenModal();
    fetchGitHubNotesCount();
    logToTerminal('GitHub: token zapisany');
});
githubTokenModalEl?.addEventListener('click', (e) => { if (e.target === githubTokenModalEl) closeGitHubTokenModal(); });

const linkAddModalEl = document.getElementById('link-add-modal');
const linkAddListTypeEl = document.getElementById('link-add-list-type');
const linkAddTitleEl = document.getElementById('link-add-modal-title');
const linkAddNameEl = document.getElementById('link-add-name');
const linkAddUrlEl = document.getElementById('link-add-url');

function openLinkAddModal(listType) {
    if (!getGitHubToken()) {
        showToast('Ustaw token przed dodawaniem.', 'warning');
        openGitHubTokenModal();
        return;
    }
    linkAddListTypeEl.value = listType || '';
    linkAddTitleEl.textContent = listType === 'network' ? 'Dodaj link — Active_Node_Map' : 'Dodaj link — Archive';
    if (linkAddNameEl) linkAddNameEl.value = '';
    if (linkAddUrlEl) linkAddUrlEl.value = '';
    if (linkAddModalEl) {
        linkAddModalEl.classList.add('is-open');
        linkAddModalEl.setAttribute('aria-hidden', 'false');
        linkAddNameEl?.focus();
    }
}

function closeLinkAddModal() {
    if (linkAddModalEl) {
        linkAddModalEl.classList.remove('is-open');
        linkAddModalEl.setAttribute('aria-hidden', 'true');
    }
}

let linksEditMode = false;
const linksEditModeBtn = document.getElementById('links-edit-mode-btn');
const linksEditModeBtnArchive = document.getElementById('links-edit-mode-btn-archive');

function setLinksEditMode(on) {
    linksEditMode = !!on;
    document.body.classList.toggle('links-edit-mode', linksEditMode);
    linksEditModeBtn?.classList.toggle('is-active', linksEditMode);
    linksEditModeBtnArchive?.classList.toggle('is-active', linksEditMode);
    if (linksEditModeBtn) linksEditModeBtn.textContent = linksEditMode ? 'Wyłącz edycję' : 'Tryb edycji';
    if (linksEditModeBtnArchive) linksEditModeBtnArchive.textContent = linksEditMode ? 'Wyłącz edycję' : 'Tryb edycji';
}

function toggleLinksEditMode() {
    setLinksEditMode(!linksEditMode);
}

linksEditModeBtn?.addEventListener('click', toggleLinksEditMode);
linksEditModeBtnArchive?.addEventListener('click', toggleLinksEditMode);

document.getElementById('network-add-link-btn')?.addEventListener('click', () => openLinkAddModal('network'));
document.getElementById('archive-add-link-btn')?.addEventListener('click', () => openLinkAddModal('archive'));
document.getElementById('link-add-cancel')?.addEventListener('click', closeLinkAddModal);
document.getElementById('link-add-save')?.addEventListener('click', () => {
    const listType = linkAddListTypeEl?.value || '';
    const name = linkAddNameEl?.value?.trim() || '';
    const url = linkAddUrlEl?.value?.trim() || '';
    if (!name || !url) { showToast('Podaj nazwę i URL.', 'warning'); return; }
    closeLinkAddModal();
    if (listType === 'network') addNetworkLink({ name, url });
    else addArchiveLink({ name, url });
});
linkAddModalEl?.addEventListener('click', (e) => { if (e.target === linkAddModalEl) closeLinkAddModal(); });

document.getElementById('network-github-token-btn')?.addEventListener('click', openGitHubTokenModal);
document.getElementById('archive-github-token-btn')?.addEventListener('click', openGitHubTokenModal);

function updateNotesCount() {
    const n = getNotes().length;
    const countEl = document.getElementById('notes-count');
    const toPushEl = document.getElementById('notes-to-push-count');
    if (countEl) countEl.textContent = n;
    if (toPushEl) toPushEl.textContent = n;
}

function updateNotesGitHubCount(count) {
    const el = document.getElementById('notes-github-count');
    if (el) el.textContent = count === undefined || count === null ? '—' : count;
}

function fetchGitHubNotesCount() {
    const token = getGitHubToken();
    if (!token) {
        updateNotesGitHubCount(null);
        return;
    }
    const getUrl = GITHUB_API + '/repos/' + GITHUB_REPO + '/contents/' + GITHUB_SNOTE_PATH;
    fetch(getUrl, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + token } })
        .then(res => {
            if (!res.ok && res.status !== 404) return res.json().then(j => Promise.reject(new Error(j.message || 'HTTP ' + res.status)));
            return res.status === 404 ? null : res.json();
        })
        .then(file => {
            if (!file || !file.content) {
                updateNotesGitHubCount(0);
                return;
            }
            try {
                const decoded = b64DecodeUtf8(file.content);
                const list = JSON.parse(decoded);
                const count = Array.isArray(list) ? list.length : 0;
                updateNotesGitHubCount(count);
            } catch (_) {
                updateNotesGitHubCount(0);
            }
        })
        .catch(() => updateNotesGitHubCount(null));
}

function renderNotesList() {
    if (!notesListEl) return;
    const notes = getNotes();
    updateNotesCount();
    if (notes.length === 0) {
        notesListEl.innerHTML = '<p class="empty-state-msg">Brak notatek. Kliknij „Nowa notatka”, aby dodać.</p>';
        return;
    }
    notesListEl.innerHTML = notes.map(note => {
        const title = (note.title || 'Bez tytułu').replace(/</g, '&lt;');
        const excerpt = (note.content || '').replace(/</g, '&lt;').slice(0, 80);
        const date = note.updatedAt || note.createdAt || '';
        const meta = date ? `<span class="note-card__meta">${date.slice(0, 10)}</span>` : '';
        return '<div class="note-card ripple-el" data-id="' + note.id.replace(/"/g, '&quot;') + '">' +
            '<div class="note-card__body">' +
            '<div class="note-card__title">' + title + '</div>' +
            (excerpt ? '<div class="note-card__excerpt">' + excerpt + (excerpt.length >= 80 ? '…' : '') + '</div>' : '') +
            meta + '</div>' +
            '<button type="button" class="note-card__delete" aria-label="Usuń"><i data-lucide="trash-2"></i></button></div>';
    }).join('');
    lucide.createIcons();
    notesListEl.querySelectorAll('.note-card').forEach(card => {
        const id = card.dataset.id;
        card.addEventListener('click', (e) => {
            if (e.target.closest('.note-card__delete')) return;
            openNoteModal(id);
        });
        card.querySelector('.note-card__delete')?.addEventListener('click', (e) => { e.stopPropagation(); openConfirmDeleteModal(id); });
    });
}

const noteModalEl = document.getElementById('note-modal');
const noteFormTitleEl = document.getElementById('note-form-title');
const noteInputTitle = document.getElementById('note-input-title');
const noteInputContent = document.getElementById('note-input-content');

function openNoteModal(editId) {
    if (editId) {
        const notes = getNotes();
        const note = notes.find(n => n.id === editId);
        if (note) {
            noteFormTitleEl.textContent = 'Edycja notatki';
            noteInputTitle.value = note.title || '';
            noteInputContent.value = note.content || '';
            noteModalEl.dataset.editId = editId;
        }
    } else {
        noteFormTitleEl.textContent = 'Nowa notatka';
        noteInputTitle.value = '';
        noteInputContent.value = '';
        delete noteModalEl.dataset.editId;
    }
    noteModalEl.classList.add('is-open');
    noteModalEl.setAttribute('aria-hidden', 'false');
    noteInputTitle.focus();
}

function closeNoteModal() {
    noteModalEl.classList.remove('is-open');
    noteModalEl.setAttribute('aria-hidden', 'true');
    delete noteModalEl.dataset.editId;
}

document.getElementById('note-new-btn')?.addEventListener('click', () => openNoteModal());
document.getElementById('note-cancel-btn')?.addEventListener('click', closeNoteModal);
document.getElementById('note-save-btn')?.addEventListener('click', () => {
    const editId = noteModalEl.dataset.editId;
    const note = { id: editId || null, title: noteInputTitle.value.trim(), content: noteInputContent.value };
    saveNote(note);
    closeNoteModal();
});
noteModalEl?.addEventListener('click', (e) => { if (e.target === noteModalEl) closeNoteModal(); });

// Init
window.onload = () => {
    logToTerminal('System gotowy.');
    setGitHubStatus('—', null);
    loadArchiveLinks();
    loadNetworkLinks();
    renderNotesList();
    updateNotesCount();
    fetchGitHubNotesCount();
    updateLinksCounts();
    startLiveTimer();
};

// Ripple click effect
function createRipple(e) {
    const el = e.target.closest('.ripple-el');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX != null ? e.clientX : e.touches && e.touches[0].clientX) - rect.left;
    const y = (e.clientY != null ? e.clientY : e.touches && e.touches[0].clientY) - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    el.appendChild(ripple);
    requestAnimationFrame(() => ripple.classList.add('ripple-active'));
    ripple.addEventListener('animationend', () => ripple.remove());
}
document.addEventListener('mousedown', function (e) {
    if (e.target.closest('.ripple-el')) createRipple(e);
});
document.addEventListener('touchstart', function (e) {
    if (e.target.closest('.ripple-el')) createRipple(e);
}, { passive: true });

// Add these to your existing script section
document.addEventListener("DOMContentLoaded", function () {
    // Remove draggable attribute from all elements
    document.querySelectorAll('[draggable="true"]').forEach((el) => {
        el.removeAttribute("draggable");
    });

    // Prevent dragstart event
    document.addEventListener("dragstart", function (e) {
        e.preventDefault();
        return false;
    });

    // Prevent drop event
    document.addEventListener("drop", function (e) {
        e.preventDefault();
        return false;
    });

    // Prevent dragover event
    document.addEventListener("dragover", function (e) {
        e.preventDefault();
        return false;
    });
});

