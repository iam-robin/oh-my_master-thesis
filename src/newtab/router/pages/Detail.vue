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

    <!-- VALUES -->
    <div class="value-container">
      <div class="box-container">
        <div class="box">
          <h2 class="title time">total time spent</h2>
          <p class="value" v-if="periodSum.time != 0">{{formatMS(periodSum.time, true)}}</p>
          <p v-else>–</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title time">Ø daily usage time</h2>
          <p class="value" v-if="periodSum.time != 0">{{formatMS(periodSum.time / periodSum.dataCount, true)}}</p>
          <p v-else>–</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title time">Ø time per site view</h2>
          <p class="value" v-if="periodSum.time != 0 && periodSum.views != 0">{{formatMS(periodSum.time / periodSum.views, true)}}</p>
          <p v-else>–</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title views">total site views</h2>
          <p class="value" v-if="periodSum.views != 0">{{periodSum.views}} views</p>
          <p v-else>–</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title clicks">Ø clicks per site view</h2>
          <p class="value" v-if="periodSum.clicks != 0">{{Math.round((periodSum.clicks/periodSum.views) * 100) / 100}} clicks</p>
          <p v-else>–</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title scroll">Ø scroll speed</h2>
          <p class="value" v-if="periodSum.scroll != 0">{{getScrollSpeed()}} px/sec</p>
          <p v-else>–</p>
        </div>
      </div>

    </div>

    <!-- CHART -->
    <div class="chart-container">

      <div class="settings">

        <div class="period">
          <div class="prev" v-on:click="prevDate()"></div>
          <div class="value">{{ formatedDate }}</div>
          <div class="next" v-on:click="nextDate()"></div>
        </div>

        <div class="menus">
          <div class="select-container icon" :class="activeMode">
            <select v-model="activeMode" v-on:change="setMode(activeMode)">
              <option value="time">time</option>
              <option value="views">views</option>
              <option value="clicks">clicks</option>
              <option value="scroll">scroll</option>
            </select>
          </div>

          <div class="select-container">
            <select v-model="activePeriod" v-on:change="setPeriod(activePeriod)">
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </select>
          </div>

        </div>

      </div>

      <canvas id="usage-chart"></canvas>

    </div>
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
      formatedDate: '',
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

    this.getChartDate();
    this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);

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

    getChartDate: function() {
      if (this.activePeriod === 'week') {
        let startOfWeek = moment(this.date).startOf('isoWeek');
        let endOfWeek = moment(this.date).endOf('isoWeek');
        this.formatedDate = startOfWeek.format('DD.MM') + ' - ' + endOfWeek.format('DD.MM.YYYY');
      } else if (this.activePeriod === 'month') {
        let month = moment(this.date).format('MMM YYYY');
        this.formatedDate = month;
      } else if (this.activePeriod === 'year') {
        let year = moment(this.date).format('YYYY');
        this.formatedDate = year;
      }
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
      this.getChartDate();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },

    setMode: function(menuItem) {
      // reload chart
      this.myChart.destroy();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },

    prevDate: function() {
      if (this.activePeriod === 'week') {
        this.date = this.date.subtract(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        this.date = this.date.subtract(1, 'months');
      } else if (this.activePeriod === 'year') {
        this.date = this.date.subtract(1, 'year');
      }

      // reload chart
      this.myChart.destroy();
      this.getChartDate();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },

    nextDate: function() {
      if (this.activePeriod === 'week') {
        this.date = this.date.add(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        this.date = this.date.add(1, 'months');
      } else if (this.activePeriod === 'year') {
        this.date = this.date.add(1, 'year');
      }

      // reload chart
      this.myChart.destroy();
      this.getChartDate();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
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

  .value-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -12px 12px -12px;

    .box-container {
      width: 33%;

      .box {
        height: 148px;
        box-sizing: border-box;
        background-color: $white;
        border: 3px solid $black;
        margin: 12px;

        .title {
          display: flex;
          position: relative;
          align-items: center;
          padding-left: 59px;
          height: 40px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 1px;
          border-bottom: 3px solid $black;
          margin: 0;

          &:before {
            content: '';
            left: 12px;
            top: 12px;
            position: absolute;
            display: inline-block;
            height: 16px;
            width: 16px;
          }

          &.time:before {
            background-image: url('@~/icons/time.svg');
          }

          &.views:before {
            background-image: url('@~/icons/views.svg');
          }

          &.clicks:before {
            background-image: url('@~/icons/clicks.svg');
          }

          &.scroll:before {
            background-image: url('@~/icons/scroll.svg');
          }

          &:after {
            content: '';
            position: absolute;
            left: 40px;
            height: 40px;
            width: 3px;
            background-color: $black;
          }
        }

        .value {
          font-size: 21px;
          font-weight: 800;
          margin: 32px 32px 8px 24px;
        }
      }
    }
  }

  .chart-container {
    background-color: $white;
    border: 3px solid $black;
    padding: 32px;

    .settings {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;

      .period {
        font-size: 16px;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        margin-left: -8px;

        .next,
        .prev {
          cursor: pointer;
          height: 16px;
          width: 16px;
          padding: 8px;
          background-size: 16px 16px;
          background-position: center;
          background-repeat: no-repeat;
        }

        .next {
          margin-left: 8px;
          background-image: url('@~/icons/arrow-right.svg');
        }

        .prev {
          margin-right: 8px;
          background-image: url('@~/icons/arrow-right.svg');
          transform: rotate(180deg);
        }
      }

      .menus {
        .select-container {
          margin-left: 8px;
          position: relative;
          display: inline-block;
          border: 3px solid $black;

          &:after {
            content: '';
            position: absolute;
            display: inline-block;
            height: 16px;
            width: 16px;
            background-image: url('@~/icons/arrow-down.svg');
            background-size: cover;
            background-repeat: no-repeat;
            right: 4px;
            top: 4px;
            z-index: 5;
            pointer-events: none;
          }

          select {
            background-color: transparent;
            border: none;
            padding: 4px 32px 4px 8px;
            -webkit-appearance: none;
            -moz-appearance: none;
            text-indent: 1px;
            text-overflow: '';
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            cursor: pointer;
            z-index: 10;

            &:focus {
              outline: none;
            }
          }
        }
      }
    }
  }
}
</style>
