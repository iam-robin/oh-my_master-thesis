import getTodaysDate from './getTodaysDate';

// save website to local storage
export default function saveTimeInStorage(domain, time) {
  let today = getTodaysDate();
  let websites = JSON.parse(localStorage.getItem(today));

  for (let i = 0; i < websites.length; i++) {
    // wenn website im local storage der voherigen Website entspricht
    // Nutzungszeit dazu rechnen
    if (websites[i].domain === domain) {
      websites[i].time += time;
    }
  }
  // when time and counter is set, save websites in local storage
  localStorage.setItem(today, JSON.stringify(websites));
}
