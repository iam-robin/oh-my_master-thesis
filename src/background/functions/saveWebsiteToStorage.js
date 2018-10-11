import getTodaysDate from './getTodaysDate';

// save website to local storage
export default function saveWebsiteToStorage(websiteInfo) {
  let today = getTodaysDate();
  let website = {
    domain: websiteInfo.domain,
    favicon: websiteInfo.favicon,
    count: 1,
    time: 0,
  };

  if (websiteInfo.domain !== 'newtab' && websiteInfo.domain !== '') {
    // test if the local storage with the key 'websites' is empty
    if (localStorage.getItem(today) === null) {
      let websites = [];
      websites.push(website);
      localStorage.setItem(today, JSON.stringify(websites));
      // else get existent websites and check if new website is unique
    } else {
      let websites = JSON.parse(localStorage.getItem(today));
      let domains = [];
      for (let i = 0; i < websites.length; i++) {
        // push all existing domains in an array
        domains.push(websites[i].domain);
      }
      // check if the new website domain is already in local storage
      let domainExists = domains.indexOf(websiteInfo.domain) > -1;
      // new website
      if (domainExists === false) {
        websites.push(website);
        localStorage.setItem(today, JSON.stringify(websites));
        // if websites already in local storage
      } else {
        for (let i = 0; i < websites.length; i++) {
          if (websites[i].domain === websiteInfo.domain) {
            // counter++ if prev site isnt current site
            if (websiteInfo.prevDomain !== websiteInfo.domain) {
              websites[i].count++;
            }
          }
        }
        // when time and counter is set, save websites in local storage
        localStorage.setItem(today, JSON.stringify(websites));
      }
    }
  }
}
