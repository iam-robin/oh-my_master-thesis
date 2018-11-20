<template>
<div class="component">
  <div class="container">
    
    <div class="list-header">
      <div>
        <span>Domain</span> 
      </div>
      <div>
        <span v-if="mode === 'time'">usage time</span>
        <span v-if="mode === 'views'">site views</span>
        <span v-if="mode === 'clicks'">clicks on website</span>
        <span v-if="mode === 'scroll'">scroll distance</span>
      </div>
    </div>

    <!--mode: time -->
    <ul v-if="mode === 'time'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.time *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span>{{ formatMS(website.time, true) }}</span>
            <span class="relative" v-if="website.relativeData">| {{ getRelativeValue(website.time, website.relativeData.time) }}</span>
            <span class="relative" v-else>| +{{ formatMS(website.time, true) }}</span>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: views -->
    <ul v-if="mode === 'views'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.count *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span class="count">{{ website.count }}</span>
            <span v-if="website.relativeData">| {{ getRelativeValue(website.count, website.relativeData.count) }}</span>
            <span v-else>| +{{ website.count }}</span>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: clicks -->
    <ul v-if="mode === 'clicks'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.clicks *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span class="count">{{ website.clicks }} clicks</span>
            <span v-if="website.relativeData">| {{ getRelativeValue(website.clicks, website.relativeData.clicks) }} clicks</span>
            <span v-else>| +{{ website.clicks }} clicks</span>
          </div>
        </router-link>
      </li>
    </ul>

    <!--mode: scroll -->
    <ul v-if="mode === 'scroll'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.scroll *-1 }">
        <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
          <div class="left">
            <span v-if="website.favicon != '' && website.favicon" :style="{ backgroundImage: 'url(' + website.favicon + ')' }" class="favicon"></span>
            <span v-else class="placeholder"></span>
            <span class="domain">{{ website.domain }}</span>
          </div>
          <div class="right">
            <span>{{ parseInt(website.scroll)}} px</span>
            <span v-if="website.relativeData">| {{ getRelativeValue(website.scroll, website.relativeData.scroll) }} px</span>
            <span v-else>| +{{ website.scroll}} px</span>
          </div>
        </router-link>
      </li>
    </ul>

  </div>
</div>
</template>

<script>
import formatMS from '../../functions/formatMS';

export default {
  name: 'list-view',

  props: {
    mode: String,
    data: Array,
  },

  created: function() {
    console.log(this.data);
    // send data to app.vue
    this.$emit('detailPageActive', false);
  },

  methods: {
    formatMS,

    getRelativeValue: function(currentData, prevData) {
      let relativeValue = (prevData - currentData) * -1;

      if (this.mode === 'time') {
        if (relativeValue >= 0) {
          return '+' + formatMS(relativeValue, true);
        } else {
          relativeValue = relativeValue * -1;
          return '-' + formatMS(relativeValue, true);
        }
      } else {
        if (relativeValue >= 0) {
          return '+' + relativeValue;
        } else {
          return relativeValue;
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
  height: 100vh;
  box-sizing: border-box;

  .list-header {
    display: flex;
    justify-content: space-between;
    height: 32px;
    border-bottom: 3px solid $black;

    span {
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    max-height: 97%;
    align-content: flex-start;
    overflow: scroll;

    li {
      flex: 0 0 100%;
      height: 64px;
      border-bottom: 1px solid $darkgrey;

      a {
        height: 100%;
        width: 100%;
        display: flex;
        font-size: 12px;
        justify-content: space-between;
        align-items: center;
        color: $black;
        text-decoration: none;

        .left {
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
      }
    }
  }
}
</style>
