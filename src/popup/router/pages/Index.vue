<template>
<div>
  <p>set time limit for:</p>
  <p class="domain" v-if="tabInfo">{{ tabInfo.domain }}</p>
  <input type="number" v-model="timeLimit" step="1" />
  <button v-on:click="saveLimitToStorage()">set limit</button>
  <p v-if="message !== ''"> {{ message }}</p>
</div>
</template>

<script>
export default {
  data() {
    return {
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
      }
      // call the callback function
      chrome.tabs.query(query, callback);
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
        let limits = JSON.parse(localStorage.getItem('limits'));
        let domains = [];
        for (let i = 0; i < limits.length; i++) {
          // push all existing domains in an array
          domains.push(limits[i].domain);
        }
        let domainExists = domains.indexOf(limit.domain) > -1;
        // if new limit domain doesn't exist in local storage
        if (domainExists === false) {
          limits.push(limit);
          localStorage.setItem('limits', JSON.stringify(limits));
          this.message = 'limit saved';
          // if websites already in local storage
        } else {
          this.message = 'website already has limit';
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
