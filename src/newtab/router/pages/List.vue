<template>
<div class="component">
  <div class="container">
    
    <div class="list-header">
      <div>
        <span>Domain</span> 
      </div>
      <div>
        <span v-if="mode === 'time'">usage time</span>
        <span v-if="mode === 'views'">site views</span>
        <span v-if="mode === 'clicks'">clicks on website</span>
        <span v-if="mode === 'scroll'">scroll distance</span>
      </div>
    </div>

    <!--mode: time -->
    <ul v-if="mode === 'time'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.time *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span>{{ formatMS(website.time, true) }}</span>
            <span v-if="period === 'day'"
              v-bind:class="{'above':(website.time > website.averageData.time)}"
              class="average">
              | {{formatMS(website.averageData.time, true)}}
            </span>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: views -->
    <ul v-if="mode === 'views'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.count *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span class="count">{{ website.count }} views</span>
            <span v-if="period === 'day'"
              v-bind:class="{'above':(website.count > website.averageData.count)}"
              class="average">
              | {{Number((website.averageData.count).toFixed(1))}} views
            </span>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: clicks -->
    <ul v-if="mode === 'clicks'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.clicks *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span class="count">{{ website.clicks }} clicks</span>
            <span v-if="period === 'day'"
              v-bind:class="{'above':(website.clicks > website.averageData.clicks)}"
              class="average">
              | {{Number((website.averageData.clicks).toFixed(1))}} clicks
            </span>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: scroll -->
    <ul v-if="mode === 'scroll'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.scroll *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span>{{ parseInt(website.scroll)}} px</span>
            <span v-if="period === 'day'"
              v-bind:class="{'above':(website.scroll > website.averageData.scroll)}"
              class="average">
              | {{parseInt(website.averageData.scroll)}} px
            </span>
          </div>
        </router-link>
      </li>
    </ul>

  </div>
</div>
</template>

<script>
import formatMS from '../../functions/formatMS';
import mergeSameWebsitesInPeriod from '../../functions/mergeSameWebsitesInPeriod';

export default {
  name: 'list-view',

  props: {
    mode: String,
    period: String,
    data: Array,
    entireData: Array,
  },

  watch: {
    data: function() {
      this.getAverage();
    },
  },

  created: function() {
    this.getAverage();
    // send data to app.vue
    this.$emit('detailPageActive', false);
  },

  methods: {
    formatMS,

    getAverage: function() {
      let data = this.data;
      let entireData = this.entireData;
      let mergedEntireData = mergeSameWebsitesInPeriod(entireData);
      data.forEach(website => {
        let averageData = {};

        let days = 0;
        // get number of days the website was used
        for (let i = 0; i < entireData.length; i++) {
          entireData[i].websites.forEach(dailywebsite => {
            if (dailywebsite.domain === website.domain) {
              days++;
            }
          });
        }
        averageData.days = days;

        // safe added up data of entire data in averageData object
        for (let i = 0; i < mergedEntireData.length; i++) {
          if (mergedEntireData[i].domain === website.domain) {
            averageData.timeSum = mergedEntireData[i].time;
            averageData.countSum = mergedEntireData[i].count;
            averageData.clicksSum = mergedEntireData[i].clicks;
            averageData.scrollSum = mergedEntireData[i].scroll;
            averageData.time = mergedEntireData[i].time / days;
            averageData.count = mergedEntireData[i].count / days;
            averageData.clicks = mergedEntireData[i].clicks / days;
            averageData.scroll = mergedEntireData[i].scroll / days;
          }
        }

        website.averageData = averageData;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.container {
  padding: 40px 80px;
  height: 100vh;
  box-sizing: border-box;

  .list-header {
    display: flex;
    justify-content: space-between;
    height: 32px;
    border-bottom: 3px solid $black;

    span {
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    max-height: 97%;
    align-content: flex-start;
    overflow: scroll;

    li {
      flex: 0 0 100%;
      height: 80px;
      border-bottom: 1px solid $darkgrey;

      a {
        height: 100%;
        width: 100%;
        display: flex;
        font-size: 16px;
        justify-content: space-between;
        align-items: center;
        color: $black;
        text-decoration: none;

        .left {
          display: flex;
          align-items: center;

          .favicon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 16px;
            background-size: 16px 16px;
            background-position: center;
            background-repeat: no-repeat;
          }

          .placeholder {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 16px;
            border-radius: 100%;
            background-color: $darkgrey;
          }
        }

        .right {
          .average {
            color: #3fba9b;

            &.above {
              color: #d84756;
            }
          }
        }
      }
    }
  }
}
</style>
