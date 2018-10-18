// import measureUsageTime from './functions/measureUsageTime';
import getTabInfo from './functions/getTabInfo';
import saveWebsiteToStorage from './functions/saveWebsiteToStorage';
import saveTimeInStorage from './functions/saveTimeInStorage';
import sendLimitToContent from './functions/sendLimitToContent';

// ================================================================================
// VARIABLES
// ================================================================================

let startTime = 0;
let websiteInfo;

// ================================================================================
// EVENTS
// ================================================================================

// on tab switch
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  getTabInfo(function(result) {
    websiteInfo = result;
    let time = measureUsageTime();
    saveWebsiteToStorage(result);
    saveTimeInStorage(result.prevDomain, time);
    sendLimitToContent(result);
  });
});

// on tab update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // only fire once when site is loaded
  if (changeInfo.status === 'complete') {
    getTabInfo(function(result) {
      websiteInfo = result;
      let time = measureUsageTime();
      saveWebsiteToStorage(result);
      saveTimeInStorage(result.prevDomain, time);
      sendLimitToContent(result);
    });
  }
});

// check if chrome window is in focus or idle
chrome.windows.onFocusChanged.addListener(function(window) {
  if (window === chrome.windows.WINDOW_ID_NONE) {
    // browser lost focus
    // get current usageTime and save it to storage
    console.log('browser lost focus');
    let time = measureUsageTime();
    saveTimeInStorage(websiteInfo.domain, time);
    startTime = 0;
  } else {
    // browser get focus
    // restart usageTime tracker
    console.log('browser get focus');
    measureUsageTime();
  }
});

// ================================================================================
// FUNCTIONS
// ================================================================================

function measureUsageTime() {
  let endTime;
  let usageTime = 0;

  // if there is a start time track the end of the time and calc the usageTime
  if (startTime !== 0) {
    endTime = Date.now();
    usageTime = endTime - startTime;
  }
  startTime = Date.now();
  return usageTime;
}
