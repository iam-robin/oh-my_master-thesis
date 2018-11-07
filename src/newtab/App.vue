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
            Ratio
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

        <div class="date">
          <span v-on:click="prevDate()" class="prev">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>

            <h2>{{formatedDate}}</h2>

          <span v-on:click="nextDate()" class="next">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>

        <!-- time mode -->
        <div v-if="activeMode === 'time'">
          <!-- total view active-->
          <div v-if="detailPageActive === false">
            <h1 class="sum">{{formatMS(periodSum.time)}}</h1>
            <p class="description">total usage time</p>
          </div>
          <!-- detail view active-->
          <div v-if="detailPageActive === true">
            <h1 class="sum">xx min</h1>
            <p class="description">time spent on {{detailPageDomain}}</p>
          </div>
        </div>

        <!-- views mode -->
        <div v-if="activeMode === 'views'">
          <!-- total view active-->
          <div v-if="detailPageActive === false">
            <h1 class="sum">{{periodSum.views}}</h1>
            <p class="description">total site views</p>
          </div>
          <!-- detail view active-->
          <div v-if="detailPageActive === true">
            <h1 class="sum">xx</h1>
            <p class="description">site views on {{detailPageDomain}}</p>
          </div>
        </div>

      </main>
      <footer>
        <ul class="period">
          <li v-on:click="setPeriod('day')" :class="{ active: getPeriod('day') }">day</li>
          <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">week</li>
          <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">month</li>
        </ul>
        <ul class="mode">
          <li v-on:click="setMode('time')" :class="{ active: getMode('time') }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" fill="none"/>
              <path d="M17.6569 6.34315C20.781 9.46735 20.781 14.5327 17.6569 17.6569C14.5327 20.781 9.46732 20.781 6.34315 17.6569C3.21895 14.5327 3.21895 9.46732 6.34315 6.34315C9.46735 3.21895 14.5327 3.21895 17.6569 6.34315" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 7.19995V12L14.4 14.4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </li>
          <li v-on:click="setMode('views')" :class="{ active: getMode('views') }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" fill="none"/>
              <path d="M2 12C2 12 5.5 5 11.625 5C17.75 5 21.25 12 21.25 12C21.25 12 17.75 19 11.625 19C5.5 19 2 12 2 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.4811 10.1438C14.5062 11.169 14.5062 12.831 13.4811 13.8562C12.456 14.8813 10.7939 14.8813 9.76881 13.8562C8.74369 12.831 8.74369 11.169 9.76881 10.1438C10.7939 9.11872 12.456 9.11872 13.4811 10.1438Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </li>
        </ul>
      </footer>
    </div>
    <div class="content-container">
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
  name: 'test-route',
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
      detailPageDomain: '',
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
          for (let i = 0; i < websites.length; i++) {
            timeSum += websites[i].time;
            viewSum += websites[i].count;
          }
          let object = {
            date: key,
            websites: websites,
            timeSum: timeSum,
            viewSum: viewSum,
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

      // calculate the time and view some and get the data of the period
      for (let i = 0; i < completePeriod.length; i++) {
        let periodday = moment(completePeriod[i]).format('YYYY-MM-DD');
        for (let x = 0; x < entireData.length; x++) {
          if (entireData[x].date === periodday) {
            periodSum.time += entireData[x].timeSum;
            periodSum.views += entireData[x].viewSum;
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

    handleDetailPage: function(active, domain) {
      if (active) {
        this.detailPageActive = true;
        this.detailPageDomain = domain;
      } else {
        this.detailPageActive = false;
        this.detailPageDomain = '';
      }
      console.log('handle detail page');
      console.log(domain);
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

body {
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;
  font-weight: 400;
  font-size: 12px;

  .info-container {
    width: 40%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $white;
    height: 100vh;
    padding: 40px 80px;
    box-sizing: border-box;

    header {
      display: flex;
      align-items: top;
      justify-content: space-between;

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
          padding-left: 32px;

          &.router-link-active {
            color: $black;
          }
        }
      }
    }

    main {
      user-select: none;
      margin-bottom: 16px;

      .date {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        h2 {
          font-size: 16px;
          font-weight: 400;
          margin: 0;
        }

        span {
          display: inline-block;
          height: 16px;
          width: 16px;
          padding: 16px;
          cursor: pointer;

          svg path {
            stroke-width: 1;
          }

          &:last-child {
            transform: rotate(180deg);
          }
        }
      }

      h1.sum {
        font-size: 50px;
        margin: 0;
        text-align: center;
      }

      .description {
        margin: 8px 0 0 0;
        font-size: 16px;
        text-align: center;
      }
    }

    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: inline-block;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          color: $darkgrey;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        &.period li {
          padding-right: 32px;

          &.active {
            color: $black;
          }
        }

        &.mode li {
          padding-left: 8px;

          svg path {
            stroke: $darkgrey;
          }

          &.active svg path {
            stroke: $black;
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
  }
}
</style>
