<template>
<div class="container">
  <div class="header">
    <div>Your daily limits</div>
    <div class="icon" @mouseover="showHelp = true" @mouseout="showHelp = false">
      <span>?</span>
    </div>
    <div class="help-container" v-if="showHelp">
      You want to set a new limit? <br> <br>Visit the desired website and click on the extension icon on your browser bar!
    </div>
  </div>
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
      <div class="bar-container"
        :class="{ filled: website.timeLimitPercentage <= 0 }">
        <div class="value">{{website.timeLimit - website.usageTime}}min / {{website.timeLimit}}min</div>
        <div class="bar" v-if="website.timeLimitPercentage < 100"
          :style="{ 'width': 100 - website.timeLimitPercentage + '%',
                'background-color': website.color}">
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
      <div class="bar-container"
      :class="{ filled: website.viewsLimitPercentage <= 0 }">
        <div class="value">{{website.viewsLimit - parseInt(website.siteViews)}} views / {{website.viewsLimit}} views</div>
        <div class="bar" v-if="website.viewsLimitPercentage < 100"
          :style="{ 'width': 100 - parseInt(website.viewsLimitPercentage) + '%',
              'background-color': website.color}">
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import moment from 'moment';
import TweenLite from 'gsap/TweenLite';

export default {
  name: 'limits',
  data: function() {
    return {
      // array with objects: key (dates) and values (websites)
      limits: [],
      showHelp: false,
    };
  },

  props: {
    date: String,
  },

  computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(0);
    },
  },

  watch: {
    date: function() {
      this.getLimits();
    },
    limits: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue });
    },
  },

  created: function() {
    this.getLimits();
  },

  methods: {
    getLimits() {
      let storageLimits = JSON.parse(localStorage.getItem('limits'));
      let limits = [];
      for (let i = 0; i < storageLimits.length; i++) {
        let limit = {
          domain: storageLimits[i].domain,
          timeLimit: storageLimits[i].timeLimit,
          usageTime: 0,
          timeLimitPercentage: 0,
          viewsLimit: storageLimits[i].viewsLimit,
          siteViews: 0,
          viewsLimitPercentage: 0,
          color: '#FECE60',
        };
        limits.push(limit);
      }
      this.limits = limits;
      this.calculateLimits();
    },

    calculateLimits: function() {
      let day = this.date;
      let websites = JSON.parse(localStorage.getItem(day));

      for (let i = 0; i < websites.length; i++) {
        for (let x = 0; x < this.limits.length; x++) {
          if (websites[i].domain === this.limits[x].domain) {
            // dominant color
            this.limits[x].color = websites[i].dominant_color.hex;
            this.limits[x].favicon = websites[i].favicon;

            // usage time
            if (this.limits[x].timeLimit) {
              let usageTime = parseInt(websites[i].time / 60000);
              let timeLimit = this.limits[x].timeLimit;
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
      console.log(this.limits);
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

  .header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3px;
    margin-bottom: 29px;
    padding-bottom: 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    letter-spacing: 1px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid $black;
      height: 24px;
      width: 24px;
      background-color: $white;
      cursor: pointer;

      span {
        font-size: 16px;
        font-weight: 800;
        margin-left: 1px;
      }
    }

    .help-container {
      position: absolute;
      right: 0;
      top: 46px;
      width: 240px;
      background-color: $white;
      border: 3px solid black;
      z-index: 9999;
      padding: 16px;

      &:after,
      &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border-style: solid;
        transform: rotate(270deg);
      }

      &:after {
        top: -14px;
        right: 5px;
        border-color: transparent transparent transparent $white;
        border-width: 8px;
      }

      &:before {
        top: -19px;
        right: 4px;
        border-color: transparent transparent transparent $black;
        border-width: 9px;
      }
    }
  }

  .website-container {
    width: 100%;
    margin-bottom: 48px;

    &:last-child {
      margin-bottom: 0;
    }

    header {
      display: flex;
      align-items: center;
      padding-left: 24px;
      height: 54px;
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
        position: relative;
        width: 100%;
        height: 100%;

        .value {
          position: absolute;
          top: 20px;
          left: 40px;
          font-weight: 800;
        }

        .bar {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          border-right: 3px solid $black;
        }

        &.filled {
          .bar {
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
