<template>
<div class="component">

  <div class="left" :style="{ 'background-color': data[0].info.dominant_color.hex}">
    <MainHeader
      :links="[
        {name: 'All Websites', to: '/ratio'},]"
    />
  </div>

  <div class="right">

    <div class="website">
      <span v-if="data[0].info.favicon != '' && data[0].info.favicon" :style="{ backgroundImage: 'url(' + data[0].info.favicon + ')' }" class="favicon"></span>
      <span v-else class="placeholder"></span>
      <span>{{domain}}</span>
    </div>

    <ul class="filter">
      <li v-on:click="setPeriod('day')" :class="{ active: getPeriod('day') }">
        today
      </li>
      <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">
        this week
      </li>
      <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">
        this month
      </li>
      <li v-on:click="setPeriod('total')" :class="{ active: getPeriod('total') }">
        total
      </li>
    </ul>

    <div class="stat-overview">

      <div class="box">
        <div>
          <p>time spent</p>
          <h2>{{formatMS(periodSum.time, true)}}</h2>
          <h3 v-if="getRelativeTime() >= 0">↓ {{formatMS(getRelativeTime(), true)}}</h3>
          <h3 v-else class="more">↑ {{formatMS(getRelativeTime() * -1, true)}}</h3>
        </div>
      </div>

      <div class="box">
        <div>
          <p>site views</p>
          <h2>{{periodSum.views}} views</h2>
          <h3>{{prevPeriodSum.views - periodSum.views}} views</h3>
        </div>
      </div>

      <div class="box">
        <div>
          <p>Ø time per site view</p>
          <h2>{{formatMS(periodSum.time / periodSum.views, true)}}</h2>
          <h3>{{getRelativeViews()}} views</h3>
        </div>
      </div>

      <div class="box">
        <div>
          <p>Ø internal site views</p>
          <h2>{{Math.round((periodSum.innerViews/periodSum.views) * 100) / 100}} views</h2>
        </div>
      </div>

      <div class="box">
        <div>
          <p>total clicks</p>
          <h2>{{periodSum.clicks}} clicks</h2>
        </div>
      </div>

      <div class="box">
        <div>
          <p>Ø clicks per site view</p>
          <h2>{{Math.round((periodSum.clicks/periodSum.views) * 100) / 100}} clicks</h2>
        </div>
      </div>

      <div class="box">
        <div>
          <p>total scroll distance</p>
          <h2>{{periodSum.scroll}} px</h2>
        </div>
      </div>

      <div class="box">
        <div>
          <p>Ø scroll distance per site view</p>
          <h2>{{parseInt(Math.round((periodSum.scroll/periodSum.views) * 100) / 100)}} px</h2>
        </div>
      </div>

      <div class="box">
        <div>
          <p>Ø scroll speed</p>
          <h2>{{getScrollSpeed()}} px/sec</h2>
        </div>
      </div>
    </div>

    <!-- <ul class="filter">
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

    <calendar-heatmap class="calendar-heatmap" :values="heatMapData"
                      :endDate="this.date"
                      :range-color="this.colors" /> -->

  </div>

</div>
</template>

<script>
import MainHeader from '../../components/MainHeader.vue';

import moment from 'moment';
import { CalendarHeatmap } from 'vue-calendar-heatmap';
import cloneDeep from 'lodash/cloneDeep';
import formatMS from '../../functions/formatMS';
import getPeriodDays from '../../functions/getPeriodDays';

export default {
  name: 'detail-page',

  components: {
    MainHeader,
    CalendarHeatmap,
  },

  data: function() {
    return {
      domain: '',
      date: moment(),
      data: [],
      periodSum: {},
      prevPeriodSum: {},
      heatMapData: [],
      activePeriod: 'day',
      activeMode: 'time',
      colors: [],
    };
  },

  watch: {
    period: function() {},
  },

  created: function() {
    this.domain = this.$route.params.domain;
    this.data = this.getDetailData();
    this.getPeriodSum();
    this.getHeatMapData();
    this.getShadeColor();

    // send data to app.vue
    this.$emit('detailPageActive', true);
  },

  methods: {
    formatMS,

    getDetailData: function() {
      let storageKeys = Object.keys(localStorage);
      let data = [];
      for (let i = 0; i < storageKeys.length; i++) {
        let key = storageKeys[i];
        if (key !== 'limits') {
          let websites = JSON.parse(localStorage.getItem(key));
          for (let i = 0; i < websites.length; i++) {
            if (websites[i].domain === this.domain) {
              let object = {
                date: key,
                info: websites[i],
              };
              data.push(object);
            }
          }
        }
      }
      return data;
    },

    getPeriodSum: function() {
      // get the current time period
      let entireData = cloneDeep(this.data);
      let period = this.activePeriod;

      let periodSum = {
        time: 0,
        views: 0,
        innerViews: 0,
        clicks: 0,
        scroll: 0,
      };

      let prevPeriodSum = {
        time: 0,
        views: 0,
        innerViews: 0,
        clicks: 0,
        scroll: 0,
      };

      let currentPeriod = [];
      let prevPeriod = [];

      // reset data
      this.periodSum = {};
      this.prevPeriodSum = {};

      if (period === 'total') {
        for (let i = 0; i < this.data.length; i++) {
          periodSum.time += this.data[i].info.time;
          periodSum.views += this.data[i].info.count;
          periodSum.innerViews += this.data[i].info.innerCount;
          periodSum.clicks += this.data[i].info.clicks;
          periodSum.scroll += this.data[i].info.scroll;
        }
        this.periodSum = periodSum;
      } else {
        currentPeriod = getPeriodDays('current', this.date, this.activePeriod);

        for (let i = 0; i < currentPeriod.length; i++) {
          let periodday = moment(currentPeriod[i]).format('YYYY-MM-DD');
          for (let x = 0; x < entireData.length; x++) {
            if (entireData[x].date === periodday) {
              periodSum.time += entireData[x].info.time;
              periodSum.views += entireData[x].info.count;
              periodSum.innerViews += entireData[x].info.innerCount;
              periodSum.clicks += entireData[x].info.clicks;
              periodSum.scroll += entireData[x].info.scroll;
            }
          }
        }
        this.periodSum = periodSum;

        prevPeriod = getPeriodDays('prev', this.date, this.activePeriod);
        for (let i = 0; i < prevPeriod.length; i++) {
          let periodday = moment(prevPeriod[i]).format('YYYY-MM-DD');
          for (let x = 0; x < entireData.length; x++) {
            if (entireData[x].date === periodday) {
              prevPeriodSum.time += entireData[x].info.time;
              prevPeriodSum.views += entireData[x].info.count;
              prevPeriodSum.innerViews += entireData[x].info.innerCount;
              prevPeriodSum.clicks += entireData[x].info.clicks;
              prevPeriodSum.scroll += entireData[x].info.scroll;
            }
          }
        }
        this.prevPeriodSum = prevPeriodSum;
      }
    },

    getRelativeTime: function() {
      return this.prevPeriodSum.time - this.periodSum.time;
    },

    getRelativeViews: function() {
      return this.prevPeriodSum.views - this.periodSum.views;
    },

    getHeatMapData: function() {
      let data = cloneDeep(this.data);
      let dataDays = [];

      let startOfPeriod = cloneDeep(this.date).subtract(1, 'year');
      let endOfPeriod = cloneDeep(this.date);

      // add the percentage of each top side to the object
      data.forEach(function(day) {
        dataDays.push(moment(day.date));
      });

      let minData = moment.min(dataDays);

      // if min data date is closer to present then present minus 1 year -> use minData
      if (minData > startOfPeriod) {
        startOfPeriod = minData;
      }

      let day = startOfPeriod;
      let completePeriod = []; // complete period days (moment) in array

      // get the period days
      while (day <= endOfPeriod) {
        completePeriod.push(day.toDate());
        day = day.clone().add(1, 'd');
      }

      let heatMapData = [];

      for (let i = 0; i < completePeriod.length; i++) {
        let day = moment(completePeriod[i]).format('YYYY-MM-DD');

        for (let x = 0; x < data.length; x++) {
          let dataDay = data[x].date;
          let value;
          // change value for other data set
          if (this.activeMode === 'time') {
            value = data[x].info.time;
          } else if (this.activeMode === 'views') {
            value = data[x].info.count;
          } else if (this.activeMode === 'clicks') {
            value = data[x].info.clicks;
          } else if (this.activeMode === 'scroll') {
            value = data[x].info.scroll;
          }

          if (dataDay === day) {
            let object = {};
            object.date = day;
            object.count = value;
            heatMapData.push(object);
          }
        }
      }
      this.heatMapData = heatMapData;
    },

    getScrollSpeed: function() {
      let scroll = this.periodSum.scroll;
      let timeInSec = parseInt(this.periodSum.time / 1000);
      let speed = scroll / timeInSec;
      speed = Math.round(speed * 100) / 100;

      return speed;
    },

    getShadeColor: function() {
      let baseColor = this.data[0].info.dominant_color.hex;
      let dark1 = this.shadeColor(baseColor, -0.2);
      let light1 = this.shadeColor(baseColor, 0.3);
      let light2 = this.shadeColor(baseColor, 0.7);
      let neutral = '#fff';

      this.colors = [neutral, light2, light1, baseColor, dark1];
    },

    getPeriod: function(menuItem) {
      return this.activePeriod === menuItem;
    },

    setPeriod: function(menuItem) {
      this.activePeriod = menuItem;
      this.getPeriodSum();
    },

    getMode: function(menuItem) {
      return this.activeMode === menuItem;
    },

    setMode: function(menuItem) {
      this.activeMode = menuItem;
      this.getHeatMapData();
    },

    shadeColor(color, percent) {
      let f = parseInt(color.slice(1), 16);
      let t = percent < 0 ? 0 : 255;
      let p = percent < 0 ? percent * -1 : percent;
      let R = f >> 16;
      let G = (f >> 8) & 0x00ff;
      let B = f & 0x0000ff;
      return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.left {
  display: flex;
  position: fixed;
  width: 40%;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-right: 3px solid $black;

  header {
    display: flex;
    width: 100%;
    height: 120px;
    background-color: $white;
    border-bottom: 3px solid $black;
    box-sizing: border-box;
    justify-content: space-between;
  }

  main {
    h1 {
      font-size: 32px;
      color: $white;
    }
  }

  footer {
    width: 100%;
  }
}

.right {
  display: inline-block;
  margin-left: 40%;
  width: 60%;
  min-height: 100vh;
  padding: 40px 80px;
  box-sizing: border-box;
  background-color: $lightgrey;

  .website {
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

  .filter {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 80px;
    margin-bottom: 40px;

    li {
      display: inline-block;
      padding-right: 16px;
      cursor: pointer;

      &.active {
        font-weight: 800;
      }
    }
  }

  .stat-overview {
    display: flex;
    flex-wrap: wrap;
    margin: -12px;

    .box {
      width: 33%;
      display: inline-block;

      div {
        //min-height: 120px;
        background-color: white;
        margin: 12px;
        padding: 24px 24px 32px 24px;
        border: 2px solid black;
      }

      p {
        color: $darkgrey;
        font-family: 'Montserrat', sans-serif;
        letter-spacing: 1px;
        font-size: 9px;
        line-height: 1.5;
        text-transform: uppercase;
        margin: 0;
        padding: 0;
        width: 80%;
        min-height: 26px;
        margin-bottom: 8px;
      }

      h2 {
        font-size: 19px;
        font-weight: 800;
        margin: 0 0 8px 0;
      }

      h3 {
        font-size: 12px;
        font-weight: 400;
        margin: 0;
        color: #3fba9b;

        &.more {
          color: #d84756;
        }
      }
    }
  }

  .calendar-heatmap {
    margin-top: 24px;
  }
}
</style>
