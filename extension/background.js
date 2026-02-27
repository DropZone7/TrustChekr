// TrustChekr Background Service Worker
// Handles extension icon badge updates based on cached scan results

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

  const cacheKey = `tc_cache_${tab.url}`;
  const cached = await chrome.storage.local.get(cacheKey);

  if (cached[cacheKey] && Date.now() - cached[cacheKey].ts < 3600000) {
    const level = cached[cacheKey].data.riskLevel;
    const badgeColors = {
      'safe': '#16a34a',
      'suspicious': '#ca8a04',
      'high-risk': '#ea580c',
      'very-likely-scam': '#dc2626',
    };
    const badgeText = {
      'safe': '✓',
      'suspicious': '!',
      'high-risk': '!!',
      'very-likely-scam': '⚠',
    };

    if (badgeColors[level]) {
      chrome.action.setBadgeBackgroundColor({ tabId, color: badgeColors[level] });
      chrome.action.setBadgeText({ tabId, text: badgeText[level] || '' });
    }
  } else {
    chrome.action.setBadgeText({ tabId, text: '' });
  }
});
