const DEFAULT_JUNE_DATA = [
  { rank: 1, username: '**********unc', wagered: '$1.9K', prize: '$100', isPodium: true },
  { rank: 2, username: '***z56', wagered: '$833.56', prize: '—', isPodium: true },
  { rank: 3, username: '*******e07', wagered: '$465.57', prize: '—', isPodium: true },
  { rank: 4, username: '****Doy', wagered: '$408.04', prize: '—', isPodium: false },
  { rank: 5, username: '*****ate', wagered: '$16.13', prize: '—', isPodium: false },
  { rank: 6, username: '***ero', wagered: '$10.67', prize: '—', isPodium: false },
  { rank: 7, username: '*******679', wagered: '$10.26', prize: '—', isPodium: false },
  { rank: 8, username: '*******oee', wagered: '$6.37', prize: '—', isPodium: false },
  { rank: 9, username: '********ace', wagered: '$4.20', prize: '—', isPodium: false },
  { rank: 10, username: '****742', wagered: '$3.77', prize: '—', isPodium: false },
  { rank: 11, username: '****275', wagered: '$3.56', prize: '—', isPodium: false },
  { rank: 12, username: '****bon', wagered: '$2.76', prize: '—', isPodium: false },
  { rank: 13, username: '******o32', wagered: '$2.23', prize: '—', isPodium: false },
  { rank: 14, username: '*****ll9', wagered: '$1.72', prize: '—', isPodium: false },
  { rank: 15, username: '**********na8', wagered: '$1.06', prize: '—', isPodium: false },
  { rank: 16, username: '****445', wagered: '$0.79', prize: '—', isPodium: false },
  { rank: 17, username: '****579', wagered: '$0.48', prize: '—', isPodium: false },
  { rank: 18, username: '*****emc', wagered: '$0.35', prize: '—', isPodium: false },
  { rank: 19, username: '****iOG', wagered: '$0.11', prize: '—', isPodium: false },
  { rank: 20, username: '******s77', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 21, username: '***ng1', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 22, username: '****GH1', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 23, username: '****255', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 24, username: '****SKU', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 25, username: '****z31', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 26, username: '*********NCH', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 27, username: '**********ble', wagered: '$0.00', prize: '—', isPodium: false },
  { rank: 28, username: '**********fam', wagered: '$0.00', prize: '—', isPodium: false }
];

const DEFAULT_MAY_DATA = [
  { rank: 1, username: '*********ing', wagered: '$35.6K', prize: '$400', isPodium: true },
  { rank: 2, username: 'US *****CKI', wagered: '$18.1K', prize: '$250', isPodium: true },
  { rank: 3, username: 'e', wagered: '$12.4K', prize: '$150', isPodium: true },
  { rank: 4, username: '****o77', wagered: '$5.2K', prize: '$120', isPodium: false },
  { rank: 5, username: '*******oee', wagered: '$2.1K', prize: '$80', isPodium: false },
  { rank: 6, username: '****z31', wagered: '$1.4K', prize: '—', isPodium: false },
  { rank: 7, username: '******s77', wagered: '$802.00', prize: '—', isPodium: false },
  { rank: 8, username: '*********NCH', wagered: '$435.50', prize: '—', isPodium: false },
  { rank: 9, username: '*******s33', wagered: '$120.00', prize: '—', isPodium: false },
  { rank: 10, username: '**********ack', wagered: '$55.00', prize: '—', isPodium: false }
];

// Bump this version whenever DEFAULT data changes to force a cache refresh
const DATA_VERSION = '2026-08-18-v2';

(function checkVersion() {
  if (localStorage.getItem('dataVersion') !== DATA_VERSION) {
    localStorage.removeItem('juneData');
    localStorage.removeItem('mayData');
    localStorage.removeItem('junePrizePool');
    localStorage.removeItem('mayPrizePool');
    localStorage.setItem('dataVersion', DATA_VERSION);
  }
})();

export function getJuneData() {
  const local = localStorage.getItem('juneData');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing juneData', e);
    }
  }
  localStorage.setItem('juneData', JSON.stringify(DEFAULT_JUNE_DATA));
  return DEFAULT_JUNE_DATA;
}

export function getMayData() {
  const local = localStorage.getItem('mayData');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Error parsing mayData', e);
    }
  }
  localStorage.setItem('mayData', JSON.stringify(DEFAULT_MAY_DATA));
  return DEFAULT_MAY_DATA;
}

export function saveJuneData(data) {
  // Auto-recalculate ranks sorted by wager amount
  const sorted = sortAndRank(data);
  localStorage.setItem('juneData', JSON.stringify(sorted));
  return sorted;
}

export function saveMayData(data) {
  const sorted = sortAndRank(data);
  localStorage.setItem('mayData', JSON.stringify(sorted));
  return sorted;
}

export function resetData() {
  localStorage.setItem('juneData', JSON.stringify(DEFAULT_JUNE_DATA));
  localStorage.setItem('mayData', JSON.stringify(DEFAULT_MAY_DATA));
  localStorage.removeItem('wagerGoal');
  localStorage.removeItem('junePrizePool');
  localStorage.removeItem('mayPrizePool');
}

export function getWagerGoal() {
  const val = localStorage.getItem('wagerGoal');
  return val ? parseInt(val, 10) : 1000000;
}

export function saveWagerGoal(goal) {
  localStorage.setItem('wagerGoal', goal.toString());
}

export function getPrizePool(month) {
  const val = localStorage.getItem(`${month}PrizePool`);
  return val ? val : '$100';
}

export function savePrizePool(month, pool) {
  localStorage.setItem(`${month}PrizePool`, pool);
}

// Helper to parse wager strings into numerical values for sorting
function parseWager(wagerStr) {
  const cleaned = wagerStr.replace('$', '').trim();
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1000;
  }
  return parseFloat(cleaned) || 0;
}

// Sort data descending by wager amount and re-calculate rank & isPodium flags
function sortAndRank(data) {
  const cloned = [...data];
  cloned.sort((a, b) => parseWager(b.wagered) - parseWager(a.wagered));
  return cloned.map((player, idx) => ({
    ...player,
    rank: idx + 1,
    isPodium: idx < 3
  }));
}
