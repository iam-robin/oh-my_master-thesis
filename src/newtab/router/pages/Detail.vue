<template>
<div class="component">

  <div class="left" :style="{ 'background-color': data[0].info.dominant_color.hex}">
    <MainHeader/>
  </div>

  <div class="right">

    <header>
      <div class="website">
        <span v-if="data[0].info.favicon != '' && data[0].info.favicon" :style="{ backgroundImage: 'url(' + data[0].info.favicon + ')' }" class="favicon"></span>
        <span v-else class="placeholder"></span>
        <span>{{domain}}</span>
      </div>

      <router-link to="/ratio">all websites</router-link>
    </header>

    <main>

      <ul class="filter">
        <li v-on:click="setPeriod('day')" :class="{ active: getPeriod('day') }">
          day
        </li>
        <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">
          week
        </li>
        <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">
          month
        </li>
        <li v-on:click="setPeriod('total')" :class="{ active: getPeriod('total') }">
          total
        </li>
      </ul>

      <ul class="filter">
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

      <div class="stat-overview">

        <div class="box">
          <h2>time spent</h2>
          <p v-if="periodSum.time != 0">{{formatMS(periodSum.time, true)}}</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>site views</h2>
          <p v-if="periodSum.views != 0">{{periodSum.views}} views</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>Ø time per site view</h2>
          <p v-if="periodSum.time != 0 && periodSum.views != 0">{{formatMS(periodSum.time / periodSum.views, true)}}</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>Ø clicks with site loads</h2>
          <p v-if="periodSum.innerViews != 0">{{Math.round((periodSum.innerViews/periodSum.views) * 100) / 100}} views</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>total clicks</h2>
          <p v-if="periodSum.clicks != 0">{{periodSum.clicks}} clicks</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>Ø clicks per site view</h2>
          <p v-if="periodSum.clicks != 0">{{Math.round((periodSum.clicks/periodSum.views) * 100) / 100}} clicks</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>total scroll distance</h2>
          <p v-if="periodSum.scroll != 0">{{periodSum.scroll}} px</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>Ø scroll distance per site view</h2>
          <p v-if="periodSum.scroll != 0">{{parseInt(Math.round((periodSum.scroll/periodSum.views) * 100) / 100)}} px</p>
          <p v-else>–</p>
        </div>

        <div class="box">
          <h2>Ø scroll speed</h2>
          <p v-if="periodSum.scroll != 0">{{getScrollSpeed()}} px/sec</p>
          <p v-else>–</p>
        </div>
      </div>


      <!-- CHART -->
      <canvas id="usage-chart"></canvas>


      <!-- HEATMAP -->
      <calendar-heatmap class="calendar-heatmap" :values="heatMapData"
                        :endDate="this.date"
                        :range-color="this.colors" />


    </main>

  </div>

</div>
</template>

<script>
import MainHeader from '../../components/MainHeader.vue';
import getChartData from '../../functions/getChartData.js';

import moment from 'moment';
import { CalendarHeatmap } from 'vue-calendar-heatmap';
import Chart from 'chart.js';
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
      heatMapData: [],
      activePeriod: 'day',
      activeMode: 'time',
      colors: [],
      chartData: {},
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

    this.chartData = getChartData(this.data, this.activeMode, this.activePeriod);

    // send data to app.vue
    this.$emit('detailPageActive', true);
  },

  mounted() {
    this.createChart('usage-chart', this.chartData);
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

      let currentPeriod = [];

      // reset data
      this.periodSum = {};

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
        currentPeriod = getPeriodDays(this.date, this.activePeriod);

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
      }
    },

    createChart: function(chartId, chartData) {
      const ctx = document.getElementById('usage-chart');
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
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

      // reload chart
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod);
      this.createChart('usage-chart', this.chartData);
    },

    getMode: function(menuItem) {
      return this.activeMode === menuItem;
    },

    setMode: function(menuItem) {
      this.activeMode = menuItem;
      this.getHeatMapData();

      // reload chart
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod);
      this.createChart('usage-chart', this.chartData);
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
    margin-top: 32px;

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
    margin: 80px 0;

    .box {
      width: 33%;
      display: inline-block;
      margin-bottom: 32px;

      h2 {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        font-size: 12px;
        line-height: 1.5;
        width: 60%;
      }

      p {
        font-size: 16px;
        font-weight: 800;
      }
    }
  }

  .calendar-heatmap {
    margin-top: 160px;
  }
}
</style>
