// GitHub API integration for Hunchos Leaderboard
// Pushes and fetches leaderboard data directly to/from the GitHub repo

const GITHUB_OWNER = 'OfficialTeamAN';
const GITHUB_REPO = 'Hunchos';
const DATA_FILE_PATH = 'public/data/leaderboard.json';
const BRANCH = 'main';
const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${DATA_FILE_PATH}`;

// ---- Token Management (stored securely in admin's browser only, never committed to git) ----

export function setGitHubToken(token) {
  if (token) {
    localStorage.setItem('gh_admin_token', token.trim());
  } else {
    localStorage.removeItem('gh_admin_token');
  }
}

export function getGitHubToken() {
  return localStorage.getItem('gh_admin_token') || '';
}

export function hasGitHubToken() {
  return !!getGitHubToken();
}

// ---- Fetch data from GitHub (for all visitors) ----

export async function fetchLeaderboardFromGitHub() {
  try {
    // Fetch from raw GitHub URL with cache-busting
    const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[GitHubSync] Could not fetch from GitHub, using local defaults:', err.message);
    return null;
  }
}

// ---- Push data to GitHub (admin only) ----

export async function pushLeaderboardToGitHub(data) {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('GitHub token not set. Please enter your token in the admin panel.');
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`;

  // Step 1: Get the current file SHA (required for updates)
  const getRes = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  let sha = null;
  if (getRes.ok) {
    const fileInfo = await getRes.json();
    sha = fileInfo.sha;
  } else if (getRes.status === 404) {
    // File doesn't exist yet, will be created
    sha = null;
  } else {
    const errBody = await getRes.text();
    throw new Error(`Failed to read file from GitHub: ${getRes.status} - ${errBody}`);
  }

  // Step 2: Encode content as base64
  const jsonStr = JSON.stringify(data, null, 2);
  const content = btoa(unescape(encodeURIComponent(jsonStr)));

  // Step 3: Push the update
  const body = {
    message: `Update leaderboard data — ${new Date().toLocaleString()}`,
    content,
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    throw new Error(errBody.message || `GitHub API error: ${putRes.status}`);
  }

  return await putRes.json();
}
