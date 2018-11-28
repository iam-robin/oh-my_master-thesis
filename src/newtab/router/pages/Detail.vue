<template>
<div class="component">

  <div class="left" :style="{ 'background-color': getCurrentColor()}">
    <MainHeader 
      :links="[{name: 'all websites', to: '/ratio'}]"
      state="close"/>
    <h1>{{ data[0].info.domain }}</h1>
    <footer></footer>
  </div>

  <div class="right">
    <main>


      <!-- CHART -->

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

      <ul class="filter">
        <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">
          week
        </li>
        <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">
          month
        </li>
        <li v-on:click="setPeriod('year')" :class="{ active: getPeriod('year') }">
          year
        </li>
      </ul>

      <canvas id="usage-chart"></canvas>

      <div class="stat-container">

        <h1>total</h1>
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
            <h2>clicks</h2>
            <p v-if="periodSum.clicks != 0">{{periodSum.clicks}} clicks</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>scroll distance</h2>
            <p v-if="periodSum.scroll > 1000000">{{parseInt(periodSum.scroll/ 1000000)}}M px</p>
            <p v-else-if="periodSum.scroll > 1000">{{parseInt(periodSum.scroll / 1000)}}K px</p>
            <p v-else-if="periodSum.scroll > 0">{{periodSum.scroll}} px</p>
            <p v-else>–</p>
          </div>

        </div>

        <h1>average per day</h1>
        <div class="stat-overview">

          <div class="box">
            <h2>Ø time spent</h2>
            <p v-if="periodSum.time != 0">{{formatMS(periodSum.time / periodSum.dataCount, true)}}</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø site views</h2>
            <p v-if="periodSum.views != 0">{{Number((periodSum.views / periodSum.dataCount).toFixed(1))}} views</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø clicks</h2>
            <p v-if="periodSum.clicks != 0">{{Number((periodSum.clicks / periodSum.dataCount).toFixed(1))}} clicks</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø scroll distance</h2>
            <p v-if="periodSum.scroll != 0">{{Number((periodSum.scroll / periodSum.dataCount).toFixed(1))}} px</p>
            <p v-else>–</p>
          </div>

        </div>

        <h1>average per site view</h1>
        <div class="stat-overview">

          <div class="box">
            <h2>Ø time per site view</h2>
            <p v-if="periodSum.time != 0 && periodSum.views != 0">{{formatMS(periodSum.time / periodSum.views, true)}}</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø clicks per site view</h2>
            <p v-if="periodSum.clicks != 0">{{Math.round((periodSum.clicks/periodSum.views) * 100) / 100}} clicks</p>
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
      </div>
    </main>

  </div>

</div>
</template>

<script>
import MainHeader from '../../components/MainHeader.vue';
import getChartData from '../../functions/getChartData.js';

import moment from 'moment';
import Chart from 'chart.js';
import formatMS from '../../functions/formatMS';

export default {
  name: 'detail-page',

  components: {
    MainHeader,
  },

  data: function() {
    return {
      domain: '',
      date: moment(),
      data: [],
      periodSum: {},
      activePeriod: 'month',
      activeMode: 'time',
      myChart: {},
      chartData: {},
    };
  },

  created: function() {
    this.domain = this.$route.params.domain;
    this.data = this.getDetailData();
    this.getPeriodSum();

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
      let periodSum = {
        time: 0,
        views: 0,
        clicks: 0,
        scroll: 0,
        dataCount: 0,
      };

      for (let i = 0; i < this.data.length; i++) {
        periodSum.time += this.data[i].info.time;
        periodSum.views += this.data[i].info.count;
        periodSum.clicks += this.data[i].info.clicks;
        periodSum.scroll += this.data[i].info.scroll;
        periodSum.dataCount++;
      }
      this.periodSum = periodSum;
    },

    getCurrentColor: function() {
      let color;
      for (let i = 0; i < this.data.length; i++) {
        color = this.data[i].info.dominant_color.hex;
      }
      return color;
    },

    createChart: function(chartId, chartData) {
      const ctx = document.getElementById('usage-chart');
      this.myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },

    getScrollSpeed: function() {
      let scroll = this.periodSum.scroll;
      let timeInSec = parseInt(this.periodSum.time / 1000);
      let speed = scroll / timeInSec;
      speed = Math.round(speed * 100) / 100;

      return speed;
    },

    getPeriod: function(menuItem) {
      return this.activePeriod === menuItem;
    },

    setPeriod: function(menuItem) {
      this.activePeriod = menuItem;
      this.getPeriodSum();

      // reload chart
      this.myChart.destroy();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod);
      this.createChart('usage-chart', this.chartData);
    },

    getMode: function(menuItem) {
      return this.activeMode === menuItem;
    },

    setMode: function(menuItem) {
      this.activeMode = menuItem;

      // reload chart
      this.myChart.destroy();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod);
      this.createChart('usage-chart', this.chartData);
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

  h1 {
    font-size: 32px;
    color: $white;
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

  .filter {
    list-style: none;
    margin: 16px 0;
    padding: 0;

    li {
      display: inline-block;
      padding-right: 16px;
      cursor: pointer;

      &.active {
        font-weight: 800;
      }
    }
  }

  main {
    h1 {
      font-size: 18px;
    }

    .stat-container {
      margin-top: 160px;
    }

    .stat-overview {
      display: flex;
      flex-wrap: wrap;
      margin: 8px 0 80px;

      .box {
        width: 25%;
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
          margin: 0;
        }
      }
    }
  }
}
</style>
