<template>
  <div>
    <div class="info-container">
      <MainHeader
        v-on:click.native="getActiveRoute()"
        :links="[
          {name: 'Top Four', to: '/ratio'},
          {name: 'List', to: '/list'},
          {name: 'Limits', to: '/limit'}]"
      />

      <main>
        <!-- time mode -->
        <div class="value" v-if="activeMode === 'time' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.time > 0" class="sum">{{formatMS(periodSum.time, true)}}</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- views mode -->
        <div class="value" v-if="activeMode === 'views' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.views > 0" class="sum">{{periodSum.views}} views</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- clicks mode -->
        <div class="value" v-if="activeMode === 'clicks' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.clicks > 0" class="sum">{{periodSum.clicks}} clicks</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- scroll mode -->
        <div class="value" v-if="activeMode === 'scroll' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.scroll > 0" class="sum">{{parseInt(periodSum.scroll/100)}}K px</h1>
          <h1 v-else-if="periodSum.scroll > 1000" class="sum">{{parseInt(periodSum.scroll/1000)}}K px</h1>
          <h1 v-else-if="periodSum.scroll > 1000000" class="sum">{{parseInt(periodSum.scroll/1000000)}}M px</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- limits -->
        <div class="value" v-if="this.activeRoute === 'limit'">
          <h1 class="exceeded">{{ exceededLimits }}</h1>
        </div>

        <div class="date" :class="{ active: !this.menuActive }">
          <svg v-if="activeMode === 'time' && activeRoute !== 'limit'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g>
              <path d="M8.00002 16C3.60001 16 0 12.4 0 8.00002C0 3.60001 3.60001 0 8.00002 0C12.4 0 16 3.60001 16 8.00002C16 12.4 12.4 16 8.00002 16ZM8.00002 1.33334C4.33334 1.33334 1.33334 4.33334 1.33334 8.00002C1.33334 11.6667 4.33334 14.6667 8.00002 14.6667C11.6667 14.6667 14.6667 11.6667 14.6667 8.00002C14.6667 4.33334 11.6667 1.33334 8.00002 1.33334Z" fill="black"/>
              <path d="M8.00004 8.66676C7.60004 8.66676 7.33337 8.40009 7.33337 8.00009V3.33342C7.33337 2.93342 7.60004 2.66675 8.00004 2.66675C8.40004 2.66675 8.66671 2.93342 8.66671 3.33342V8.00009C8.66671 8.40009 8.40004 8.66676 8.00004 8.66676Z" fill="black"/>
              <path d="M10.6667 11.3333C10.4667 11.3333 10.3334 11.2666 10.2 11.1333L7.53337 8.46659C7.26671 8.19992 7.26671 7.79992 7.53337 7.53325C7.80004 7.26659 8.20004 7.26659 8.46671 7.53325L11.1334 10.1999C11.4001 10.4666 11.4001 10.8666 11.1334 11.1333C11 11.2666 10.8667 11.3333 10.6667 11.3333Z" fill="black"/>
            </g>
          </svg>

          <svg v-if="activeMode === 'views' && activeRoute !== 'limit'" width="16" height="16" viewBox="0 0 16 16">
            <g>
              <path d="M8.00005 10.6666C6.53338 10.6666 5.33337 9.46659 5.33337 7.99992C5.33337 6.53325 6.53338 5.33325 8.00005 5.33325C9.46672 5.33325 10.6667 6.53325 10.6667 7.99992C10.6667 9.46659 9.46672 10.6666 8.00005 10.6666ZM8.00005 6.66659C7.26671 6.66659 6.66671 7.26659 6.66671 7.99992C6.66671 8.73326 7.26671 9.33326 8.00005 9.33326C8.73338 9.33326 9.33338 8.73326 9.33338 7.99992C9.33338 7.26659 8.73338 6.66659 8.00005 6.66659Z" fill="#B4BBC5"/>
              <path d="M8.00012 14C3.02087 14 0.232487 8.6 0.0997071 8.375C-0.0330729 8.15 -0.0330729 7.85 0.0997071 7.625C0.232487 7.4 3.02087 2 8.00012 2C12.9794 2 15.7678 7.4 15.9005 7.625C16.0333 7.85 16.0333 8.15 15.9005 8.375C15.7678 8.6 12.9794 14 8.00012 14ZM1.4939 8C2.1578 9.125 4.48145 12.5 8.00012 12.5C11.5188 12.5 13.8424 9.125 14.5063 8C13.8424 6.875 11.5188 3.5 8.00012 3.5C4.48145 3.5 2.1578 6.875 1.4939 8Z" fill="#B4BBC5"/>
            </g>
          </svg>

          <svg v-if="activeMode === 'clicks' && activeRoute !== 'limit'" width="16" height="16" version="1.1" viewBox="0 0 16 16">
            <g transform="scale(0.666667)">
              <path fill="#000" d="M14,23c0,0 0,0 0,0c-0.4,0 -0.8,-0.3 -0.9,-0.7l-2.3,-6.9c-0.2,-0.5 0.1,-1.1 0.6,-1.3c0.5,-0.2 1.1,0.1 1.3,0.6l1.4,4.3l6.1,-15.3l-15.3,6.2l4.3,1.4c0.5,0.2 0.8,0.7 0.6,1.3c-0.2,0.5 -0.7,0.8 -1.3,0.6l-6.9,-2.3c-0.3,-0.1 -0.6,-0.5 -0.6,-0.9c0,-0.4 0.2,-0.8 0.6,-1l20,-8c0.4,-0.1 0.8,0 1.1,0.3c0.3,0.3 0.4,0.7 0.2,1.1l-8,20c-0.1,0.4 -0.5,0.6 -0.9,0.6Z"></path>
              <path fill="#000" d="M4,23c-0.8,0 -1.5,-0.3 -2.1,-0.9c-1.2,-1.2 -1.2,-3.1 0,-4.2l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.2,0.2 -0.3,0.4 -0.3,0.7c0,0.3 0.1,0.5 0.3,0.7c0.4,0.4 1,0.4 1.4,0l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.6,0.6 -1.3,0.9 -2.1,0.9Z"></path>
            </g>
          </svg>

          <svg v-if="activeMode === 'scroll' && activeRoute !== 'limit'" width="16" height="16" version="1.1" viewBox="0 0 16 16" >
            <g transform="scale(0.666667)">
              <path fill="#000" d="M12,24c-6.6,0 -12,-5.4 -12,-12c0,-6.6 5.4,-12 12,-12c6.6,0 12,5.4 12,12c0,6.6 -5.4,12 -12,12Zm0,-22c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10Z"></path>
              <path fill="#000" d="M15,11c-0.3,0 -0.5,-0.1 -0.7,-0.3l-2.3,-2.3l-2.3,2.3c-0.4,0.4 -1,0.4 -1.4,0c-0.4,-0.4 -0.4,-1 0,-1.4l3,-3c0.4,-0.4 1,-0.4 1.4,0l3,3c0.4,0.4 0.4,1 0,1.4c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
              <path fill="#000" d="M12,18c-0.3,0 -0.5,-0.1 -0.7,-0.3l-3,-3c-0.4,-0.4 -0.4,-1 0,-1.4c0.4,-0.4 1,-0.4 1.4,0l2.3,2.3l2.3,-2.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-3,3c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
            </g>
          </svg>

          {{formatedDate}}
        </div>

      </main>

      <SettingsMenu
        :activeRoute="activeRoute"
        @modeChanged="activeMode = $event"
        @periodChanged="getPeriod($event)"
        @formatedDateChanged="formatedDate = $event"
        @menuStateChanged="menuActive = $event"
        @dateChanged="getDate($event)"
      />

    </div>
    <div class="content-container" v-bind:class="{detail: detailPageActive}">
      <router-view :mode="activeMode"
        :data='relevantData'
        :date="storageDate"
        :entireData='data'
        :period='activePeriod'
        @detailPageActive="handleDetailPage">
      </router-view>
    </div>
  </div>
</template>

<script>
import MainHeader from './components/MainHeader.vue';
import SettingsMenu from './components/SettingsMenu.vue';

import moment from 'moment';
import formatMS from './functions/formatMS';
import getPeriodDays from './functions/getPeriodDays';
import mergeSameWebsitesInPeriod from './functions/mergeSameWebsitesInPeriod';
import getFirstDate from './functions/getFirstDate';

export default {
  name: 'app-view',
  data: function() {
    return {
      data: [],
      relevantData: [],
      periodSum: {},
      detailPageActive: false,
      activeRoute: this.$router.currentRoute.name,
      exceededLimits: 0,

      date: moment(),
      activePeriod: 'day',
      activeMode: 'time',
      menuActive: false,
      formatedDate: '',
      storageDate: moment().format('YYYY-MM-DD'),
    };
  },

  components: {
    MainHeader,
    SettingsMenu,
  },

  created: function() {
    this.getData();
    this.getRelevantData();
  },

  methods: {
    formatMS,

    getDate: function(newDate) {
      this.date = newDate;
      this.storageDate = moment(newDate).format('YYYY-MM-DD');
      this.getRelevantData();
    },

    getPeriod: function(newPeriod) {
      this.activePeriod = newPeriod;
      this.getRelevantData();
    },

    getData: function() {
      let storageKeys = Object.keys(localStorage);
      let data = [];
      for (let i = 0; i < storageKeys.length; i++) {
        // for each key in storage build object with key(date) value(websites)
        // and push it to data array
        let key = storageKeys[i];
        if (key !== 'limits') {
          let websites = JSON.parse(localStorage.getItem(key));
          let timeSum = 0;
          let viewSum = 0;
          let clickSum = 0;
          let scrollSum = 0;
          for (let i = 0; i < websites.length; i++) {
            timeSum += websites[i].time;
            viewSum += websites[i].count;
            clickSum += websites[i].clicks;
            scrollSum += websites[i].scroll;
          }
          let object = {
            date: key,
            websites: websites,
            timeSum: timeSum,
            viewSum: viewSum,
            clickSum: clickSum,
            scrollSum: scrollSum,
          };
          data.unshift(object);
        }
      }
      this.data = data;
    },

    getRelevantData: function() {
      let entireData = this.data;

      let periodSum = {
        time: 0,
        views: 0,
        clicks: 0,
        scroll: 0,
      };

      let currentPeriod = [];
      let currentPeriodData = [];

      let relevantData = [];

      // reset data
      this.relevantData = [];
      this.periodSum = {};

      if (this.activePeriod === 'total') {
        currentPeriod = getPeriodDays(this.date, this.activePeriod, getFirstDate());
      } else {
        currentPeriod = getPeriodDays(this.date, this.activePeriod);
      }

      // calculate the current period
      for (let i = 0; i < currentPeriod.length; i++) {
        let periodday = moment(currentPeriod[i]).format('YYYY-MM-DD');
        for (let x = 0; x < entireData.length; x++) {
          if (entireData[x].date === periodday) {
            periodSum.time += entireData[x].timeSum;
            periodSum.views += entireData[x].viewSum;
            periodSum.clicks += entireData[x].clickSum;
            periodSum.scroll += entireData[x].scrollSum;
            currentPeriodData.push(entireData[x]);
          }
        }
      }

      this.periodSum = periodSum;
      relevantData = mergeSameWebsitesInPeriod(currentPeriodData);
      this.relevantData = relevantData;
    },

    getActiveRoute: function() {
      this.activeRoute = this.$router.currentRoute.name;
    },

    handleDetailPage: function(isActive) {
      this.detailPageActive = isActive;
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700');
@import url('https://fonts.googleapis.com/css?family=Montserrat:500');
@import 'scss/_colors.scss';

::-webkit-scrollbar {
  width: 0px; /* remove scrollbar space */
}

::selection {
  background: $primary;
}

html {
  overflow: hidden;
  height: 100%;
}

body {
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;
  font-weight: 400;
  font-size: 12px;
  border-top: 3px solid $black;
  -webkit-font-smoothing: subpixel-antialiased;

  .info-container {
    width: 40%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $white;
    height: 100vh;
    border-right: 3px solid $black;

    main {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .value {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 100%;

        h1.sum {
          font-size: 67px;
          margin: 0;
          text-align: center;
        }
      }

      .date {
        display: flex;
        align-items: center;
        font-size: 16px;
        margin-top: 16px;
        opacity: 0;
        transition: opacity 0.2s ease-out;

        &.active {
          opacity: 1;
        }

        svg {
          margin-right: 8px;

          path {
            fill: $black;
          }
        }
      }
    }
  }

  .content-container {
    display: inline-block;
    margin-left: 40%;
    width: 60%;
    background-color: $lightgrey;
    min-height: 100vh;

    &.detail {
      width: 100%;
      margin: 0;
    }
  }
}
</style>
