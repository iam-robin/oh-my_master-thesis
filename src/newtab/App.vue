<template>
  <div>
    <div class="info-container">
      <header>
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
          <span v-on:click="prevDate()" class="prev"></span>
            <h2>{{formatedDate}}</h2>
          <span v-on:click="nextDate()" class="next"></span>
        </div>
        <h1 class="sum" v-if="activeMode === 'time'">{{formatMS(periodSum.time)}}</h1>
        <h1 class="sum" v-if="activeMode === 'views'">{{periodSum.views}} site views</h1>
      </main>
      <footer>
        <ul class="mode">
          <li v-on:click="setMode('time')" :class="{ active: getMode('time') }">time</li>
          <li v-on:click="setMode('views')" :class="{ active: getMode('views') }">views</li>
        </ul>
        <ul class="period">
          <li v-on:click="setPeriod('day')" :class="{ active: getPeriod('day') }">day</li>
          <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">week</li>
          <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">month</li>
        </ul>
      </footer>
    </div>
    <div class="content-container">
      <router-view :mode="activeMode" :data='relevantData'></router-view>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

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
    };
  },
  created: function() {
    // add key down event listener to window to detect key navigation
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' && this.nextAvailable) {
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
    formatMS: function(ms) {
      let seconds = parseInt((ms / 1000) % 60);
      let minutes = parseInt((ms / (1000 * 60)) % 60);
      let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      if (hours !== '00') {
        // hours, minutes and seconds
        return hours + 'h ' + minutes + 'min ' + seconds + 'sec ';
      } else if (hours === '00' && minutes !== '00') {
        // minutes and seconds
        return minutes + 'min ' + seconds + 'sec ';
      } else {
        // seconds
        return seconds + 'sec ';
      }
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
        this.formatedDate = date.format('ddd DD/MM/YYYY');
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
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700');
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,700');
@import 'scss/_colors.scss';

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
      height: 40px;

      .menu {
        display: flex;
        justify-content: flex-end;
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 3px;

        a {
          text-decoration: none;
          color: black;
          padding-left: 32px;

          &.router-link-active {
            font-weight: 700;
          }
        }
      }
    }

    main {
      .date {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        span {
          display: inline-block;
          height: 24px;
          width: 24px;
          background-color: tomato;
          cursor: pointer;

          &:first-child {
            margin-right: 16px;
          }

          &:last-child {
            margin-left: 16px;
          }
        }
      }
    }

    footer {
      height: 40px;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: inline-block;
          padding: 8px 16px;
          cursor: pointer;

          &.active {
            font-weight: 800;
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
