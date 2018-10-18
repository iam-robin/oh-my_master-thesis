import measureUsageTime from './functions/measureUsageTime';
import getTabInfo from './functions/getTabInfo';
import saveWebsiteToStorage from './functions/saveWebsiteToStorage';
import saveTimeInStorage from './functions/saveTimeInStorage';
import sendLimitToContent from './functions/sendLimitToContent';

// ================================================================================
// EVENTS
// ================================================================================

// on tab switch
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  getTabInfo(function(result) {
    // add measured time to result object
    let time = measureUsageTime();
    saveWebsiteToStorage(result);
    saveTimeInStorage(result, time);
    sendLimitToContent(result);
  });
});

// on tab update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // only fire once when site is loaded
  if (changeInfo.status === 'complete') {
    getTabInfo(function(result) {
      // add measured time to result object
      let time = measureUsageTime();
      saveWebsiteToStorage(result);
      saveTimeInStorage(result, time);
      sendLimitToContent(result);
    });
  }
});
