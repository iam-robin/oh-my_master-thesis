<template>
<div>
  <div v-if="!hasLimit">
    <p>set time limit for:</p>
    <p class="domain" v-if="tabInfo">{{ tabInfo.domain }}</p>
    <input type="number" v-model="timeLimit" step="1" />
    <button v-on:click="saveLimitToStorage()">set limit</button>
    <p v-if="message !== ''"> {{ message }}</p>
  </div>
  <div v-if="hasLimit">
    <p>website already has time limit:</p>
    <p>XXX min</p>
    <p>edit existing time limit:</p>
    <input type="number" v-model="timeLimit" step="1" />
    <button v-on:click="saveLimitToStorage()">set limit</button>
    <button v-on:click="deleteLimitFromStorage()">delete limit</button>
    <p v-if="message !== ''"> {{ message }}</p>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      hasLimit: false,
      limits: [],
      tabInfo: null,
      timeLimit: 0,
      message: '',
    };
  },
  mounted() {
    this.getTabInfo();
  },
  methods: {
    getTabInfo() {
      // queries for getting tab info
      let query = { active: true, currentWindow: true };
      let self = this;
      function callback(tabs) {
        let tabInfo = tabs[0];
        let tabUrl = tabInfo.url;
        self.tabInfo = tabInfo;
        self.tabInfo['domain'] = self.extractRootDomain(tabUrl);
        self.setInterface();
      }
      // call the callback function
      chrome.tabs.query(query, callback);
    },

    setInterface() {
      // check if there is already a limit on this page

      this.limits = JSON.parse(localStorage.getItem('limits'));
      for (let i = 0; i < this.limits.length; i++) {
        if (this.tabInfo.domain === this.limits[i].domain) {
          this.hasLimit = true;
          console.log(this.hasLimit);
          break;
        } else {
          this.hasLimit = false;
          console.log(this.hasLimit);
        }
      }
    },

    extractRootDomain(url) {
      let domain = this.extractHostname(url);
      let splitArr = domain.split('.');
      let arrLen = splitArr.length;

      // extracting the root domain here
      // if there is a subdomain
      if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        // check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
          // this is using a ccTLD
          domain = splitArr[arrLen - 3] + '.' + domain;
        }
      }
      return domain;
    },

    extractHostname(url) {
      let hostname;

      // find & remove protocol (http, ftp, etc.) and get hostname
      if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2];
      } else {
        hostname = url.split('/')[0];
      }

      // find & remove port number
      hostname = hostname.split(':')[0];
      // find & remove "?"
      hostname = hostname.split('?')[0];

      return hostname;
    },

    saveLimitToStorage() {
      let limit = {
        domain: this.tabInfo.domain,
        timeLimit: this.timeLimit,
      };

      // if localStorage has no key 'limits'
      if (localStorage.getItem('limits') === null) {
        let limits = [];
        limits.push(limit);
        localStorage.setItem('limits', JSON.stringify(limits));
        this.message = 'limit saved';
        // else get existing limits and add new one
      } else {
        let domains = [];
        for (let i = 0; i < this.limits.length; i++) {
          // push all existing domains in an array
          domains.push(this.limits[i].domain);
        }
        let domainExists = domains.indexOf(limit.domain) > -1;
        // if new limit domain doesn't exist in local storage
        if (domainExists === false) {
          this.limits.push(limit);
          localStorage.setItem('limits', JSON.stringify(this.limits));
          this.message = 'limit saved';
          // if websites already in local storage
        } else {
          // overwrite existing limit
          for (let i = 0; i < this.limits.length; i++) {
            if (this.tabInfo.domain === this.limits[i].domain) {
              this.limits[i].timeLimit = this.timeLimit;
              localStorage.setItem('limits', JSON.stringify(this.limits));
              this.message = 'limit edited';
            }
          }
        }
      }
    },

    deleteLimitFromStorage() {
      for (let i = 0; i < this.limits.length; i++) {
        if (this.tabInfo.domain === this.limits[i].domain) {
          this.limits.splice(i, 1);
          localStorage.setItem('limits', JSON.stringify(this.limits));
          this.message = 'limit deleted';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.domain {
  font-weight: 800;
}
</style>
