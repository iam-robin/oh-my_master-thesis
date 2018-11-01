<template>
  <div>
    <div class="info-container">
      <header>
        <div class="menu">
          <router-link to="/list">
            01 List
          </router-link>
          <router-link to="/ratio">
            02 Ratio
          </router-link>
          <router-link to="/limit">
            03 Limits
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
      let storageDate = date.format('YYYY-MM-DD');
      let entireData = this.data;
      let period = this.activePeriod;
      let periodSum = {
        time: 0,
        views: 0,
      };

      // reset data
      this.relevantData = [];
      this.periodSum = {};

      // detect the correct time span and fill relevant Data Array
      if (period === 'day') {
        console.log('Tag');
        for (let i = 0; i < entireData.length; i++) {
          if (entireData[i].date === storageDate) {
            periodSum.time += entireData[i].timeSum;
            periodSum.views += entireData[i].viewSum;
            this.relevantData = entireData[i].websites;
          }
        }
        // safe the time and view sum for this period in data
        this.periodSum = periodSum;
      } else if (period === 'week') {
        console.log('Woche');
        let startOfWeek = cloneDeep(date).startOf('isoWeek');
        let endOfWeek = cloneDeep(date).endOf('isoWeek');
        let completeWeek = []; // complete week in array
        let day = startOfWeek;
        let weekData = [];

        // get the week days
        while (day <= endOfWeek) {
          completeWeek.push(day.toDate());
          day = day.clone().add(1, 'd');
        }

        // calculate the time and view some and get the data of the week
        for (let i = 0; i < completeWeek.length; i++) {
          let weekday = moment(completeWeek[i]).format('YYYY-MM-DD');
          for (let x = 0; x < entireData.length; x++) {
            if (entireData[x].date === weekday) {
              periodSum.time += entireData[x].timeSum;
              periodSum.views += entireData[x].viewSum;
              weekData.push(entireData[x]);
            }
          }
        }

        // get the same domains and summarize their properties
        // safe them into this.relevantData
        this.relevantData = Array.from(
          weekData.reduce((m, { websites }) => {
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

        // safe the time and view sum for this period in data
        this.periodSum = periodSum;
      } else if (period === 'month') {
        console.log('Monat');
        let startOfMonth = cloneDeep(date).startOf('month');
        let endOfMonth = cloneDeep(date).endOf('month');
        let completeMonth = []; // complete month in array
        let day = startOfMonth;

        while (day <= endOfMonth) {
          completeMonth.push(day.toDate());
          day = day.clone().add(1, 'd');
        }
        for (let i = 0; i < completeMonth.length; i++) {
          let monthday = moment(completeMonth[i]).format('YYYY-MM-DD');
          for (let x = 0; x < entireData.length; x++) {
            if (entireData[x].date === monthday) {
              periodSum.time += entireData[x].timeSum;
              periodSum.views += entireData[x].viewSum;
              this.relevantData.push(entireData[x]);
            }
          }
        }
        // safe the time and view sum for this period in data
        this.periodSum = periodSum;
      }
      console.log(this.relevantData);
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

      this.formatDate();
      this.getRelevantData();
    },

    nextDate: function() {
      if (this.activePeriod === 'day') {
        this.date = this.date.add(1, 'days');
      } else if (this.activePeriod === 'week') {
        this.date = this.date.add(1, 'weeks');
      } else if (this.activePeriod === 'month') {
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
@import url('https://fonts.googleapis.com/css?family=Fira+Mono');
body {
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;
  font-size: 12px;

  .info-container {
    width: 40%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fece60;
    height: 100vh;
    padding: 40px 80px;
    box-sizing: border-box;

    header {
      height: 40px;
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
    background-color: #e5e5e5;
    min-height: 100vh;
  }

  .menu {
    display: flex;
    justify-content: left;

    a {
      padding: 0 24px;
      text-decoration: none;
      color: black;

      &.router-link-active {
        font-weight: 800;
      }
    }
  }
}
</style>
