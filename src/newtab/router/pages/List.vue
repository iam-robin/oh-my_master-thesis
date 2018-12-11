<template>
<div class="component">
  <div class="container">
    
    <div class="list-header">
      <div>
        <span>Domain</span> 
      </div>
      <div>
        <span v-if="mode === 'time'">Usage time</span>
        <span v-if="mode === 'views'">Site views</span>
        <span v-if="mode === 'clicks'">Clicks on website</span>
        <span v-if="mode === 'scroll'">Scroll distance</span>
      </div>
    </div>

    <!--mode: time -->
    <transition-group appear
      name="staggered-fade"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-if="mode === 'time'"
    >
      <li v-for="(website, index) in sortedData"
          :key="website.domain"
          v-bind:data-index="index">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <div class="bar-container">
              <span class="dot" v-for="index in dots" :key="index" :class="{ active: index <= getDotState(website.time) }"></span>
            </div>
            <span class="value time">{{ formatMS(website.time, true) }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g>
                <path d="M8.00002 16C3.60001 16 0 12.4 0 8.00002C0 3.60001 3.60001 0 8.00002 0C12.4 0 16 3.60001 16 8.00002C16 12.4 12.4 16 8.00002 16ZM8.00002 1.33334C4.33334 1.33334 1.33334 4.33334 1.33334 8.00002C1.33334 11.6667 4.33334 14.6667 8.00002 14.6667C11.6667 14.6667 14.6667 11.6667 14.6667 8.00002C14.6667 4.33334 11.6667 1.33334 8.00002 1.33334Z" fill="black"/>
                <path d="M8.00004 8.66676C7.60004 8.66676 7.33337 8.40009 7.33337 8.00009V3.33342C7.33337 2.93342 7.60004 2.66675 8.00004 2.66675C8.40004 2.66675 8.66671 2.93342 8.66671 3.33342V8.00009C8.66671 8.40009 8.40004 8.66676 8.00004 8.66676Z" fill="black"/>
                <path d="M10.6667 11.3333C10.4667 11.3333 10.3334 11.2666 10.2 11.1333L7.53337 8.46659C7.26671 8.19992 7.26671 7.79992 7.53337 7.53325C7.80004 7.26659 8.20004 7.26659 8.46671 7.53325L11.1334 10.1999C11.4001 10.4666 11.4001 10.8666 11.1334 11.1333C11 11.2666 10.8667 11.3333 10.6667 11.3333Z" fill="black"/>
              </g>
          </svg>
          </div>
        </router-link>
      </li>
    </transition-group>

    <!--mode: views -->
    <transition-group appear
      name="staggered-fade"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-if="mode === 'views'"
    >
      <li v-for="website in sortedData" :key="website.domain">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <div class="bar-container">
              <span class="dot" v-for="index in dots" :key="index" :class="{ active: index <= getDotState(website.count) }"></span>
            </div>
            <span class="value views">{{ website.count }}</span>
            <svg width="18" height="16" viewBox="0 0 18 16">
              <g>
                <path d="M8.00005 10.6666C6.53338 10.6666 5.33337 9.46659 5.33337 7.99992C5.33337 6.53325 6.53338 5.33325 8.00005 5.33325C9.46672 5.33325 10.6667 6.53325 10.6667 7.99992C10.6667 9.46659 9.46672 10.6666 8.00005 10.6666ZM8.00005 6.66659C7.26671 6.66659 6.66671 7.26659 6.66671 7.99992C6.66671 8.73326 7.26671 9.33326 8.00005 9.33326C8.73338 9.33326 9.33338 8.73326 9.33338 7.99992C9.33338 7.26659 8.73338 6.66659 8.00005 6.66659Z" fill="#B4BBC5"/>
                <path d="M8.00012 14C3.02087 14 0.232487 8.6 0.0997071 8.375C-0.0330729 8.15 -0.0330729 7.85 0.0997071 7.625C0.232487 7.4 3.02087 2 8.00012 2C12.9794 2 15.7678 7.4 15.9005 7.625C16.0333 7.85 16.0333 8.15 15.9005 8.375C15.7678 8.6 12.9794 14 8.00012 14ZM1.4939 8C2.1578 9.125 4.48145 12.5 8.00012 12.5C11.5188 12.5 13.8424 9.125 14.5063 8C13.8424 6.875 11.5188 3.5 8.00012 3.5C4.48145 3.5 2.1578 6.875 1.4939 8Z" fill="#B4BBC5"/>
              </g>
          </svg>
          </div>
        </router-link>
      </li>
    </transition-group>

    <!--mode: clicks -->
    <ul v-if="mode === 'clicks'">
      <li v-for="website in sortedData" :key="website.domain">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <div class="bar-container">
              <span class="dot" v-for="index in dots" :key="index" :class="{ active: index <= getDotState(website.clicks) }"></span>
            </div>
            <span class="value clicks">{{ website.clicks }}</span>
            <svg width="16" height="16" version="1.1" viewBox="0 0 16 16">
              <g transform="scale(0.666667)">
                <path fill="#000" d="M14,23c0,0 0,0 0,0c-0.4,0 -0.8,-0.3 -0.9,-0.7l-2.3,-6.9c-0.2,-0.5 0.1,-1.1 0.6,-1.3c0.5,-0.2 1.1,0.1 1.3,0.6l1.4,4.3l6.1,-15.3l-15.3,6.2l4.3,1.4c0.5,0.2 0.8,0.7 0.6,1.3c-0.2,0.5 -0.7,0.8 -1.3,0.6l-6.9,-2.3c-0.3,-0.1 -0.6,-0.5 -0.6,-0.9c0,-0.4 0.2,-0.8 0.6,-1l20,-8c0.4,-0.1 0.8,0 1.1,0.3c0.3,0.3 0.4,0.7 0.2,1.1l-8,20c-0.1,0.4 -0.5,0.6 -0.9,0.6Z"></path>
                <path fill="#000" d="M4,23c-0.8,0 -1.5,-0.3 -2.1,-0.9c-1.2,-1.2 -1.2,-3.1 0,-4.2l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.2,0.2 -0.3,0.4 -0.3,0.7c0,0.3 0.1,0.5 0.3,0.7c0.4,0.4 1,0.4 1.4,0l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.6,0.6 -1.3,0.9 -2.1,0.9Z"></path>
              </g>
          </svg>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: scroll -->
    <ul v-if="mode === 'scroll'">
      <li v-for="website in sortedData" :key="website.domain">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <div class="bar-container">
              <span class="dot" v-for="index in dots" :key="index" :class="{ active: index <= getDotState(website.scroll) }"></span>
            </div>
            <span class="value scroll">{{ parseInt(website.scroll)}} px</span>
            <svg width="16" height="16" version="1.1" viewBox="0 0 16 16" >
              <g transform="scale(0.666667)">
                <path fill="#000" d="M12,24c-6.6,0 -12,-5.4 -12,-12c0,-6.6 5.4,-12 12,-12c6.6,0 12,5.4 12,12c0,6.6 -5.4,12 -12,12Zm0,-22c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10Z"></path>
                <path fill="#000" d="M15,11c-0.3,0 -0.5,-0.1 -0.7,-0.3l-2.3,-2.3l-2.3,2.3c-0.4,0.4 -1,0.4 -1.4,0c-0.4,-0.4 -0.4,-1 0,-1.4l3,-3c0.4,-0.4 1,-0.4 1.4,0l3,3c0.4,0.4 0.4,1 0,1.4c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
                <path fill="#000" d="M12,18c-0.3,0 -0.5,-0.1 -0.7,-0.3l-3,-3c-0.4,-0.4 -0.4,-1 0,-1.4c0.4,-0.4 1,-0.4 1.4,0l2.3,2.3l2.3,-2.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-3,3c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
              </g>
          </svg>
          </div>
        </router-link>
      </li>
    </ul>

  </div>
</div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import formatMS from '../../functions/formatMS';

export default {
  name: 'list-view',

  props: {
    mode: String,
    period: String,
    data: Array,
  },

  data: function() {
    return {
      dots: 16,
      sortedData: [],
    };
  },

  watch: {
    mode: function() {
      this.sortData();
    },
    data: function() {
      this.sortData();
    },
  },

  created: function() {
    this.sortData();
    this.$emit('detailPageActive', false);
  },

  methods: {
    formatMS,

    sortData: function() {
      let sortedData = cloneDeep(this.data);

      if (this.mode === 'time') {
        sortedData.sort((a, b) => parseFloat(b.time) - parseFloat(a.time));
      } else if (this.mode === 'views') {
        sortedData.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
      } else if (this.mode === 'clicks') {
        sortedData.sort((a, b) => parseFloat(b.clicks) - parseFloat(a.clicks));
      } else if (this.mode === 'scroll') {
        sortedData.sort((a, b) => parseFloat(b.scroll) - parseFloat(a.scroll));
      }

      this.sortedData = sortedData;
    },

    getDotState: function(websiteData) {
      let maxValue = this.getMaxValue();

      let percentage = (this.dots / maxValue) * websiteData;
      percentage = parseInt(percentage);

      return percentage;
    },

    getMaxValue: function() {
      if (this.mode === 'time') {
        return this.data.reduce((max, p) => (p.time > max ? p.time : max), this.data[0].time);
      } else if (this.mode === 'views') {
        return this.data.reduce((max, p) => (p.count > max ? p.count : max), this.data[0].count);
      } else if (this.mode === 'clicks') {
        return this.data.reduce((max, p) => (p.clicks > max ? p.clicks : max), this.data[0].clicks);
      } else if (this.mode === 'scroll') {
        return this.data.reduce((max, p) => (p.scroll > max ? p.scroll : max), this.data[0].scroll);
      }
    },

    beforeEnter: function(el) {
      el.style.transform = 'translateY(40px)';
      el.style.opacity = 0;
    },

    enter: function(el, done) {
      let delay = el.dataset.index * 50;
      console.log(el.dataset);
      setTimeout(function() {
        el.style.transform = 'translateY(0px)';
        el.style.opacity = 1;
      }, delay);
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

  .list-header {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding-bottom: 16px;
    border-bottom: 3px solid $black;

    span {
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      letter-spacing: 2px;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    align-content: flex-start;
    list-style: none;

    li {
      flex: 0 0 100%;
      height: 80px;
      box-sizing: border-box;
      margin-top: 24px;
      background-color: $white;
      border: 3px solid $black;
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.4s ease-in-out;

      &:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 12px 0 -8px $black;
      }

      &:first-child {
        margin-top: 34px;
      }

      &:last-child {
        margin-bottom: 40px;
      }

      a {
        height: 100%;
        width: 100%;
        display: flex;
        font-size: 16px;
        padding: 0 24px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        color: $black;
        text-decoration: none;

        .left {
          display: flex;
          align-items: center;
          width: 33%;
          margin-right: 32px;
          overflow: hidden;

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

        .right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 66%;

          .value {
            flex-shrink: 0;
            text-align: right;

            &.time {
              width: 104px;
            }
            &.views {
              width: 56px;
            }
            &.clicks {
              width: 56px;
            }
            &.scroll {
              width: 120px;
            }
          }

          svg {
            margin-left: 8px;
            flex-shrink: 0;

            path {
              fill: $black;
            }
          }

          .bar-container {
            display: flex;
            align-items: center;
            flex-direction: row-reverse;

            .dot {
              height: 8px;
              width: 8px;
              background-color: $lightgrey;
              margin-left: 4px;

              &.active {
                background-color: $black;
              }
            }
          }
        }
      }
    }
  }
}
</style>
