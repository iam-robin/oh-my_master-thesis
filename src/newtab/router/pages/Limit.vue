<template>
<div class="container">
  <div class="domain-container" v-for="domain in limits" :key="domain.domain">
    <h2>{{domain.domain}}</h2>

    <div v-if="domain.timeLimit" class="limit-container">
      <p>time limit:</p>
      <p v-if="domain.timeLimitPercentage > 0">
        <span>{{domain.timeLimit}}min / {{parseInt(domain.usageTime / (1000 * 60))}}min</span>
        <span>({{Number((domain.timeLimitPercentage).toFixed(1))}}%)</span>
      </p>
      <p v-else>
        no usage today!
      </p>
      <div class="bar-chart">
        <div class="percentage"
          v-if="domain.timeLimitPercentage > 0"
          :style="{ 'width': domain.timeLimitPercentage + '%',
                'background-color': domain.color}">
        </div>
      </div>
    </div>

    <div v-if="domain.viewsLimit" class="limit-container">
      <p>views limit:</p>
      <p v-if="domain.viewsLimitPercentage > 0">
        <span>{{domain.viewsLimit}} views / {{domain.siteViews}} views</span>
        <span>({{Number((domain.viewsLimitPercentage).toFixed(1))}} %)</span>
      </p>
      <p v-else>
        no usage today!
      </p>
      <div class="bar-chart">
        <div class="percentage"
          v-if="domain.viewsLimitPercentage > 0"
          :style="{ 'width': domain.viewsLimitPercentage + '%',
                'background-color': domain.color}">
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'limits',
  data: function() {
    return {
      // array with key (dates) and values (websites)
      limits: [],
    };
  },

  props: {
    date: String,
  },

  watch: {
    date: function() {
      this.calculateLimits();
    },
  },

  created: function() {
    this.getLimits();
  },

  methods: {
    getLimits() {
      let limits = JSON.parse(localStorage.getItem('limits'));
      this.limits = limits;
      this.calculateLimits();
    },

    calculateLimits: function() {
      // let day = this.date;
      let day = moment().format('YYYY-MM-DD');
      let websites = JSON.parse(localStorage.getItem(day));

      for (let i = 0; i < websites.length; i++) {
        for (let x = 0; x < this.limits.length; x++) {
          if (websites[i].domain === this.limits[x].domain) {
            // dominant color
            this.limits[x].color = websites[i].dominant_color.hex;

            // usage time
            if (this.limits[x].timeLimit) {
              let usageTime = websites[i].time;
              let timeLimit = this.limits[x].timeLimit * 60 * 1000;
              let timeLimitPercentage = (100 / timeLimit) * usageTime;
              this.limits[x].usageTime = usageTime;
              this.limits[x].timeLimitPercentage = timeLimitPercentage;
            }

            // site views
            if (this.limits[x].viewsLimit) {
              let siteViews = websites[i].count;
              let viewsLimit = this.limits[x].viewsLimit;
              let viewsLimitPercentage = (100 / viewsLimit) * siteViews;
              this.limits[x].siteViews = siteViews;
              this.limits[x].viewsLimitPercentage = viewsLimitPercentage;
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';
.container {
  padding: 40px 80px;
  min-height: 100vh;
  box-sizing: border-box;

  .domain-container {
    margin-bottom: 80px;

    .limit-container {
      margin-bottom: 32px;

      .bar-chart {
        height: 40px;
        border: 3px solid $black;
        background-color: $white;

        .percentage {
          width: 60%;
          height: 100%;
          background-color: tomato;
          border-right: 3px solid black;
        }
      }
    }
  }
}
</style>
