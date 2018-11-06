<template>
<div class="container">
  
  <div class="list-header">
    <div>
      <span>Domain</span> 
    </div>
    <div>
      <span v-if="mode === 'time'">usage time</span>
      <span v-if="mode === 'views'">site views</span>
    </div>
  </div>

  <!--mode: time -->
  <ul v-if="mode === 'time'">
    <li v-for="website in data" :key="website.domain" 
        :style="{ 'order': website.time *-1 }">
      <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
        <div class="left">
          <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
          <span v-else class="placeholder"></span>
          <span class="domain">{{ website.domain }}</span>
        </div>
        <span class="count">{{ formatMS(website.time) }}</span>
      </router-link>
    </li>
  </ul>

  <!--mode: views -->
  <ul v-if="mode === 'views'">
    <li v-for="website in data" :key="website.domain" 
        :style="{ 'order': website.count *-1 }">
      <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
        <div class="left">
          <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
          <span v-else class="placeholder"></span>
          <span class="domain">{{ website.domain }}</span>
        </div>
        <span class="count">{{ website.count }}</span>
      </router-link>
    </li>
  </ul>

</div>
</template>

<script>
export default {
  name: 'list view',

  props: {
    mode: String,
    data: Array,
  },

  created: function() {},

  methods: {
    formatMS: function(ms) {
      let minutes = parseInt((ms / (1000 * 60)) % 60);
      let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      if (hours !== '00') {
        // hours, minutes and seconds
        return hours + 'h ' + minutes + 'min ';
      } else if (hours === '00' && minutes !== '00') {
        // minutes and seconds
        return minutes + 'min ';
      } else {
        // seconds
        return '< 01min ';
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
      border-top: 1px solid $grey;

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
            height: 16px;
            margin-right: 16px;
          }

          .placeholder {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 16px;
            border-radius: 100%;
            background-color: $grey;
          }
        }

        .count {
          text-align: right;
        }
      }
    }
  }
}
</style>
