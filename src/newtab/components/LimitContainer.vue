<template>
  <div class="limit">
    <router-link :to="{ name: 'detail', params: { domain: domain }}">
      <header>{{ domain }}</header>
    </router-link>
    
    <div v-if="limit.timeLimit" class="limit-container time">
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
        :class="{ filled: limit.timeLimitPercentage <= 0 }">
        <div class="value">{{limit.timeLimit - limit.usageTime}}min / {{limit.timeLimit}}min</div>
        <div class="bar" v-if="limit.timeLimitPercentage < 100"
          :style="{ 'width': 100 - timeLimit + '%',
                'background-color': getColor()}">
        </div>
      </div>
    </div>
    
    <div v-if="limit.viewsLimit" class="limit-container time">
      <div class="icon">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <g>
              <path d="M8.00005 10.6666C6.53338 10.6666 5.33337 9.46659 5.33337 7.99992C5.33337 6.53325 6.53338 5.33325 8.00005 5.33325C9.46672 5.33325 10.6667 6.53325 10.6667 7.99992C10.6667 9.46659 9.46672 10.6666 8.00005 10.6666ZM8.00005 6.66659C7.26671 6.66659 6.66671 7.26659 6.66671 7.99992C6.66671 8.73326 7.26671 9.33326 8.00005 9.33326C8.73338 9.33326 9.33338 8.73326 9.33338 7.99992C9.33338 7.26659 8.73338 6.66659 8.00005 6.66659Z" fill="#B4BBC5"/>
              <path d="M8.00012 14C3.02087 14 0.232487 8.6 0.0997071 8.375C-0.0330729 8.15 -0.0330729 7.85 0.0997071 7.625C0.232487 7.4 3.02087 2 8.00012 2C12.9794 2 15.7678 7.4 15.9005 7.625C16.0333 7.85 16.0333 8.15 15.9005 8.375C15.7678 8.6 12.9794 14 8.00012 14ZM1.4939 8C2.1578 9.125 4.48145 12.5 8.00012 12.5C11.5188 12.5 13.8424 9.125 14.5063 8C13.8424 6.875 11.5188 3.5 8.00012 3.5C4.48145 3.5 2.1578 6.875 1.4939 8Z" fill="#B4BBC5"/>
            </g>
          </svg>
      </div>
      <div class="bar-container"
      :class="{ filled: limit.viewsLimitPercentage <= 0 }">
        <div class="value">{{limit.viewsLimit - parseInt(limit.siteViews)}} views / {{limit.viewsLimit}} views</div>
        <div class="bar" v-if="limit.viewsLimitPercentage < 100"
          :style="{ 'width': 100 - parseInt(viewsLimit) + '%',
              'background-color': getColor()}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TweenLite from 'gsap/TweenLite';
import getOverAllData from '../functions/getOverAllData.js';
import mergeSameWebsitesInPeriod from '../functions/mergeSameWebsitesInPeriod.js';

export default {
  name: 'limit-container',
  props: {
    domain: String,
    limit: Object,
  },

  data: function() {
    return {
      timeLimit: 0,
      viewsLimit: 0,
      overAllData: getOverAllData(),
    };
  },

  watch: {
    limit: {
      handler: function(newValue) {
        TweenLite.to(this.$data, 0.3, { timeLimit: newValue.timeLimitPercentage, viewsLimit: newValue.viewsLimitPercentage });
      },
    },
  },

  created: function() {
    this.timeLimit = this.limit.timeLimitPercentage;
    this.viewsLimit = this.limit.viewsLimitPercentage;

    this.getColor();
  },

  methods: {
    getColor: function() {
      let mergedData = mergeSameWebsitesInPeriod(this.overAllData);
      for (let i = 0; i < mergedData.length; i++) {
        if (mergedData[i].domain === this.domain) {
          return mergedData[i].dominant_color.hex;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/_colors.scss';

a {
  color: $black;
  text-decoration: none;
}

.limit {
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
        left: 24px;
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
</style>
