<template>
<div class="container">
  <div class="website-container" v-for="website in limits" :key="website.domain">
    <header>{{website.domain}}</header>
    <!-- TIME LIMIT-->
    <div v-if="website.timeLimit" class="limit-container time">
      <div class="icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g>
              <path d="M8.00002 16C3.60001 16 0 12.4 0 8.00002C0 3.60001 3.60001 0 8.00002 0C12.4 0 16 3.60001 16 8.00002C16 12.4 12.4 16 8.00002 16ZM8.00002 1.33334C4.33334 1.33334 1.33334 4.33334 1.33334 8.00002C1.33334 11.6667 4.33334 14.6667 8.00002 14.6667C11.6667 14.6667 14.6667 11.6667 14.6667 8.00002C14.6667 4.33334 11.6667 1.33334 8.00002 1.33334Z" fill="black"/>
              <path d="M8.00004 8.66676C7.60004 8.66676 7.33337 8.40009 7.33337 8.00009V3.33342C7.33337 2.93342 7.60004 2.66675 8.00004 2.66675C8.40004 2.66675 8.66671 2.93342 8.66671 3.33342V8.00009C8.66671 8.40009 8.40004 8.66676 8.00004 8.66676Z" fill="black"/>
              <path d="M10.6667 11.3333C10.4667 11.3333 10.3334 11.2666 10.2 11.1333L7.53337 8.46659C7.26671 8.19992 7.26671 7.79992 7.53337 7.53325C7.80004 7.26659 8.20004 7.26659 8.46671 7.53325L11.1334 10.1999C11.4001 10.4666 11.4001 10.8666 11.1334 11.1333C11 11.2666 10.8667 11.3333 10.6667 11.3333Z" fill="black"/>
            </g>
          </svg>
      </div>
      <div class="bar-container">
        <div class="bar"
          v-if="website.timeLimitPercentage > 0"
          :style="{ 'width': 100 - website.timeLimitPercentage + '%',
                'background-color': website.color}">
          {{website.timeLimit - parseInt(website.usageTime / (1000 * 60))}}min / {{website.timeLimit}}min
        </div>
      </div>
    </div>
    <!-- VIEWS LIMIT-->
    <div v-if="website.viewsLimit" class="limit-container time">
      <div class="icon">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <g>
              <path d="M8.00005 10.6666C6.53338 10.6666 5.33337 9.46659 5.33337 7.99992C5.33337 6.53325 6.53338 5.33325 8.00005 5.33325C9.46672 5.33325 10.6667 6.53325 10.6667 7.99992C10.6667 9.46659 9.46672 10.6666 8.00005 10.6666ZM8.00005 6.66659C7.26671 6.66659 6.66671 7.26659 6.66671 7.99992C6.66671 8.73326 7.26671 9.33326 8.00005 9.33326C8.73338 9.33326 9.33338 8.73326 9.33338 7.99992C9.33338 7.26659 8.73338 6.66659 8.00005 6.66659Z" fill="#B4BBC5"/>
              <path d="M8.00012 14C3.02087 14 0.232487 8.6 0.0997071 8.375C-0.0330729 8.15 -0.0330729 7.85 0.0997071 7.625C0.232487 7.4 3.02087 2 8.00012 2C12.9794 2 15.7678 7.4 15.9005 7.625C16.0333 7.85 16.0333 8.15 15.9005 8.375C15.7678 8.6 12.9794 14 8.00012 14ZM1.4939 8C2.1578 9.125 4.48145 12.5 8.00012 12.5C11.5188 12.5 13.8424 9.125 14.5063 8C13.8424 6.875 11.5188 3.5 8.00012 3.5C4.48145 3.5 2.1578 6.875 1.4939 8Z" fill="#B4BBC5"/>
            </g>
          </svg>
      </div>
      <div class="bar-container">
        <div class="bar"
          v-if="website.viewsLimitPercentage > 0"
          :style="{ 'width': 100 - parseInt(website.viewsLimitPercentage) + '%',
              'background-color': website.color}">
          {{website.viewsLimit - parseInt(website.siteViews)}} views / {{website.viewsLimit}} views
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="domain-container" v-for="domain in limits" :key="domain.domain">
    <h2>{{domain.domain}}</h2>

    <div v-if="domain.timeLimit" class="limit-container">
      <div class="desc">
        <p>time limit:</p>
        <p v-if="domain.timeLimitPercentage > 0">
          <span>{{parseInt(domain.usageTime / (1000 * 60))}}min / {{domain.timeLimit}}min</span>
          <span>({{Number((domain.timeLimitPercentage).toFixed(1))}}%)</span>
        </p>
        <p v-else>
          no usage today!
        </p>
      </div>
      <div class="bar-chart">
        <div class="percentage"
          v-if="domain.timeLimitPercentage > 0"
          :style="{ 'width': domain.timeLimitPercentage + '%',
                'background-color': domain.color}">
        </div>
      </div>
    </div>

    <div v-if="domain.viewsLimit" class="limit-container">
      <div class="desc">
        <p>views limit:</p>
        <p v-if="domain.viewsLimitPercentage > 0">
          <span>{{domain.siteViews}} views / {{domain.viewsLimit}} views</span>
          <span>({{Number((domain.viewsLimitPercentage).toFixed(1))}} %)</span>
        </p>
        <p v-else>
          no usage today!
        </p>
      </div>
      <div class="bar-chart">
        <div class="percentage"
          v-if="domain.viewsLimitPercentage > 0"
          :style="{ 'width': domain.viewsLimitPercentage + '%',
                'background-color': domain.color}">
        </div>
      </div>
    </div>

  </div> -->
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

  .website-container {
    width: 100%;
    margin-bottom: 40px;
    cursor: pointer;
    box-shadow: 4px 4px 0px 0px $black;
    transform: translate(-4px, -4px);
    transition: all 0.2s ease-in-out;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      box-shadow: none;
      transform: translate(0px, 0px);
    }

    header {
      display: flex;
      align-items: center;
      padding-left: 24px;
      height: 64px;
      background-color: $white;
      border: 3px solid $black;
      font-size: 16px;
    }

    .limit-container {
      display: flex;
      height: 54px;
      border-bottom: 3px solid $black;
      border-left: 3px solid $black;
      border-right: 3px solid $black;
      background-color: $white;

      .icon {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        height: 56px;
        width: 56px;
        border-right: 3px solid $black;

        svg {
          height: 18px;
          width: 18px;

          path {
            fill: $black;
          }
        }
      }

      .bar-container {
        width: 100%;
        height: 100%;

        .bar {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          border-right: 3px solid $black;
          height: 100%;
        }
      }
    }
  }
}
</style>
