let startTime = 0;
let endTime;
let usageTime = 0;

export default function measureUsageTime() {
  // if there is a start time track the end of the time and calc the usageTime
  if (startTime !== 0) {
    endTime = Date.now();
    usageTime = endTime - startTime;
  }
  startTime = Date.now();
  return usageTime;
}

chrome.windows.onFocusChanged.addListener(function(window) {
  if (window === chrome.windows.WINDOW_ID_NONE) {
    // browser lost focus
    measureUsageTime();
    startTime = 0;
    console.log('browser lost focus');
  } else {
    // browser get focus
    measureUsageTime();
    console.log('browser get focus');
  }
});
