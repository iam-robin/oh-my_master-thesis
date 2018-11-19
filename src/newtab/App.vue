<template>
  <div>
    <div class="info-container">
      <header>
        <svg class="logo" viewBox="0 0 50 50" fill="none">
          <rect x="1.5" y="1.5" width="47" height="47" stroke="#333333" stroke-width="3"/>
          <rect x="1.5" y="1.5" width="17" height="47" stroke="#333333" stroke-width="3"/>
          <rect x="-1.5" y="1.5" width="17" height="18" transform="matrix(-1 0 0 1 17 0)" fill="#FECE60" stroke="#333333" stroke-width="3"/>
          <rect x="-1.5" y="1.5" width="30" height="17" transform="matrix(-1 0 0 1 47 30)" fill="#E6E9EE" stroke="#333333" stroke-width="3"/>
        </svg>
        <div class="menu">
          <router-link to="/ratio">
            Top Five
          </router-link>
          <router-link to="/list">
            List
          </router-link>
          <router-link to="/limit">
            Limits
          </router-link>
        </div>
      </header>

      <main>
        <!-- time mode -->
        <div v-if="activeMode === 'time'">
          <h1 class="sum">{{formatMS(periodSum.time)}}</h1>
        </div>

        <!-- views mode -->
        <div v-if="activeMode === 'views'">
            <h1 class="sum">{{periodSum.views}} views</h1>
        </div>

        <!-- clicks mode -->
        <div v-if="activeMode === 'clicks'">
            <h1 class="sum">{{periodSum.clicks}} clicks</h1>
        </div>

        <!-- scroll mode -->
        <div v-if="activeMode === 'scroll'">
            <h1 class="sum">{{parseInt(periodSum.scroll)}} px</h1>
        </div>

      </main>

      <footer>
        <div class="menu">

          <div class="menu-container date">
            <span v-on:click="prevDate()" class="arrow prev">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>

              <h2>{{formatedDate}}</h2>

            <span v-on:click="nextDate()" class="arrow next">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <div class="menu-container period">
            <ul>
              <li v-on:click="setPeriod('day')" :class="{ active: getPeriod('day') }">day</li>
              <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">week</li>
              <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">month</li>
            </ul>
          </div>

          <div class="menu-container mode">
            <ul>
              <li v-on:click="setMode('time')" :class="{ active: getMode('time') }">
                time
              </li>
              <li v-on:click="setMode('views')" :class="{ active: getMode('views') }">
                views
              </li>
              <li v-on:click="setMode('clicks')" :class="{ active: getMode('clicks') }">
                clicks
              </li>
              <li v-on:click="setMode('scroll')" :class="{ active: getMode('scroll') }">
                scroll
              </li>
            </ul>
          </div>
      
        </div>
        <button class="settings">Settings</button>
      </footer>
    </div>
    <div class="content-container" v-bind:class="{detail: detailPageActive}">
      <router-view :mode="activeMode"
        :data='relevantData'
        :period='activePeriod'
        @detailPageActive="handleDetailPage">
      </router-view>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import formatMS from './functions/formatMS';

export default {
  name: 'app-view',
  data: function() {
    return {
      activeMode: 'time',
      activePeriod: 'day',
      date: null,
      formatedDate: null,
      data: [],
      relevantData: [],
      periodSum: {},
      detailPageActive: false,
    };
  },
  created: function() {
    // add key down event listener to window to detect key navigation
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        // next time period
        this.nextDate();
      } else if (e.key === 'ArrowLeft') {
        // prev time period
        this.prevDate();
      } else if (e.key === 'd') {
        // day mode
        this.setPeriod('day');
      } else if (e.key === 'w') {
        // week mode
        this.setPeriod('week');
      } else if (e.key === 'm') {
        // year mode
        this.setPeriod('month');
      } else if (e.key === 't') {
        // time mode
        this.setMode('time');
      } else if (e.key === 'v') {
        // views mode
        this.setMode('views');
      }
    });

    this.date = moment();
    this.formatDate();
    this.getData();
    this.getRelevantData();
  },

  methods: {
    formatMS,

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
      // get the current time period
      let date = cloneDeep(this.date);
      let entireData = this.data;
      let period = this.activePeriod;
      let periodSum = {
        time: 0,
        views: 0,
        clicks: 0,
        scroll: 0,
      };
      let startOfPeriod;
      let endOfPeriod;
      let completePeriod = []; // complete period data in array
      let periodData = [];

      // reset data
      this.relevantData = [];
      this.periodSum = {};

      if (period === 'day') {
        startOfPeriod = cloneDeep(date);
        endOfPeriod = cloneDeep(date);
      } else if (period === 'week') {
        startOfPeriod = cloneDeep(date).startOf('isoWeek');
        endOfPeriod = cloneDeep(date).endOf('isoWeek');
      } else if (period === 'month') {
        startOfPeriod = cloneDeep(date).startOf('month');
        endOfPeriod = cloneDeep(date).endOf('month');
      }

      let day = startOfPeriod;

      // get the period days
      while (day <= endOfPeriod) {
        completePeriod.push(day.toDate());
        day = day.clone().add(1, 'd');
      }

      // calculate the time and view and get the data of the period
      for (let i = 0; i < completePeriod.length; i++) {
        let periodday = moment(completePeriod[i]).format('YYYY-MM-DD');
        for (let x = 0; x < entireData.length; x++) {
          if (entireData[x].date === periodday) {
            periodSum.time += entireData[x].timeSum;
            periodSum.views += entireData[x].viewSum;
            periodSum.clicks += entireData[x].clickSum;
            periodSum.scroll += entireData[x].scrollSum;
            periodData.push(entireData[x]);
          }
        }
      }

      this.periodSum = periodSum;

      // bundle same domains inside the periodData and safe them in relevantData
      this.relevantData = Array.from(
        periodData.reduce((m, { websites }) => {
          websites.forEach(o => {
            var temp = m.get(o.domain);
            if (!temp) {
              m.set(o.domain, (temp = {}));
            }
            Object.entries(o).forEach(([k, v]) => {
              if (k === 'website') return;
              if (typeof v === 'number') {
                temp[k] = (temp[k] || 0) + v;
              } else {
                temp[k] = v;
              }
            });
          });
          return m;
        }, new Map()),
        ([domain, time]) => Object.assign({ domain }, time)
      );
    },

    formatDate: function() {
      let date = cloneDeep(this.date);
      if (this.activePeriod === 'day') {
        // date.format('ddd DD/MM/YYYY') for weekday
        this.formatedDate = date.format('DD/MM/YYYY');
      } else if (this.activePeriod === 'week') {
        this.formatedDate = date.startOf('isoWeek').format('DD/MM') + ' - ' + date.endOf('isoWeek').format('DD/MM/YYYY');
      } else if (this.activePeriod === 'month') {
        this.formatedDate = date.format('MMM YYYY');
      }
    },

    prevDate: function() {
      if (this.activePeriod === 'day') {
        this.date = this.date.subtract(1, 'days');
      } else if (this.activePeriod === 'week') {
        this.date = this.date.subtract(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        this.date = this.date.subtract(1, 'months');
      }

      this.nextAvailable = true;
      this.formatDate();
      this.getRelevantData();
    },

    nextDate: function() {
      if (this.activePeriod === 'day') {
        // if mode = day
        this.date = this.date.add(1, 'days');
      } else if (this.activePeriod === 'week') {
        // if mode = week
        this.date = this.date.add(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        // if mode = year
        this.date = this.date.add(1, 'months');
      }

      this.formatDate();
      this.getRelevantData();
    },

    nextMode: function() {
      if (this.activeMode === 'time') {
        this.setMode('views');
      } else if (this.activeMode === 'views') {
        this.setMode('clicks');
      } else if (this.activeMode === 'clicks') {
        this.setMode('scroll');
      } else if (this.activeMode === 'scroll') {
        this.setMode('time');
      }
    },

    prevMode: function() {
      if (this.activeMode === 'time') {
        this.setMode('scroll');
      } else if (this.activeMode === 'views') {
        this.setMode('time');
      } else if (this.activeMode === 'clicks') {
        this.setMode('views');
      } else if (this.activeMode === 'scroll') {
        this.setMode('clicks');
      }
    },

    getMode: function(menuItem) {
      return this.activeMode === menuItem;
    },

    setMode: function(menuItem) {
      this.activeMode = menuItem;
      this.getRelevantData();
    },

    getPeriod: function(menuItem) {
      return this.activePeriod === menuItem;
    },

    setPeriod: function(menuItem) {
      this.activePeriod = menuItem;
      this.formatDate();
      this.getRelevantData();
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
  border: 4px solid $black;

  .info-container {
    width: 40%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $white;
    height: 100vh;
    border-right: 4px solid $black;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40px 80px;
      height: 120px;
      box-sizing: border-box;
      border-bottom: 4px solid $black;

      .logo {
        width: 40px;
        height: 40px;
      }

      .menu {
        display: flex;

        a {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: $darkgrey;
          text-decoration: none;
          padding-left: 40px;

          &.router-link-active {
            color: $black;
          }
        }
      }
    }

    main {
      padding: 0 80px;

      h1.sum {
        font-size: 70px;
        margin: 0;
      }
    }

    footer {
      .menu {
        display: flex;
        flex-wrap: wrap;
        user-select: none;

        .menu-container {
          width: 100%;
          display: flex;
          align-items: center;
          border-top: 4px solid $black;
          height: 120px;

          &.period,
          &.mode {
            justify-content: center;

            ul {
              margin: 0;
              padding: 0;
              display: flex;

              li {
                list-style: none;
                padding: 20px;
                cursor: pointer;
              }
            }
          }

          &.date {
            justify-content: space-between;

            h2 {
              font-size: 21px;
              font-weight: 400;
              margin: 0;
            }

            span.arrow {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 80px;
              height: 120px;
              cursor: pointer;

              &.prev {
                border-right: 4px solid $black;
              }

              &.next {
                border-left: 4px solid $black;

                svg {
                  transform: rotate(180deg);
                }
              }

              &:hover {
                background-color: $primary;
              }

              svg {
                height: 32px;
                width: 32px;
              }
            }
          }
        }
      }

      button.settings {
        width: 100%;
        height: 96px;
        border: none;
        outline: none;
        cursor: pointer;
        border-top: 4px solid $black;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 2px;

        &:hover {
          background-color: $primary;
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
      position: absolute;
      width: 100%;
      margin: 0;
    }
  }
}
</style>
