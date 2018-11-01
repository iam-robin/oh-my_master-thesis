<template>
<div class="container">
  <div class="date-container">

    <!--mode: time -->
    <ul v-if="mode === 'time'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.time *-1 }">
        <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
        <span v-else class="placeholder"></span>
        <span class="domain">{{ website.domain }}</span>
        <span class="line"></span>
        <span class="count">{{ formatMS(website.time) }}</span>
      </li>
    </ul>

    <!--mode: views -->
    <ul v-if="mode === 'views'">
      <li v-for="website in data" :key="website.domain" 
          :style="{ 'order': website.count *-1 }">
        <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
        <span v-else class="placeholder"></span>
        <span class="domain">{{ website.domain }}</span>
        <span class="line"></span>
        <span class="count">{{ website.count }}</span>
      </li>
    </ul>

  </div>

  
  <!-- <div v-for="item in data" :key="item.date" class="date-container">

    <div class="listhead">
      <h2>{{mode}}</h2>
    </div>

    <ul v-if="mode === 'time'">
      <li v-for="website in item.websites" :key="website.domain" 
      :style="{ 'order': website.time *-1 }">
        <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
        <span v-else class="placeholder"></span>
        <span class="domain">{{ website.domain }}</span>
        <span class="line"></span>
        <span class="count" v-if="mode === 'time'">{{ formatMS(website.time) }}</span>
      </li>
    </ul>

    <ul v-if="mode === 'views'">
      <li v-for="website in item.websites" :key="website.domain" 
      :style="{ 'order': website.count *-1 }">
        <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
        <span v-else class="placeholder"></span>
        <span class="domain">{{ website.domain }}</span>
        <span class="line"></span>
        <span class="count" v-if="mode === 'views'">{{ website.count }}</span>
      </li>
    </ul>

  </div> -->
</div>
</template>

<script>
export default {
  name: 'test-route',

  data: function() {
    return {};
  },

  props: {
    mode: String,
    data: Array,
  },

  created: function() {},

  methods: {
    formatMS: function(ms) {
      let seconds = parseInt((ms / 1000) % 60);
      let minutes = parseInt((ms / (1000 * 60)) % 60);
      let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      if (hours !== '00') {
        // hours, minutes and seconds
        return hours + 'h ' + minutes + 'min ' + seconds + 'sec ';
      } else if (hours === '00' && minutes !== '00') {
        // minutes and seconds
        return minutes + 'min ' + seconds + 'sec ';
      } else {
        // seconds
        return seconds + 'sec ';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 240px;

  .date-container {
    width: 80%;
    margin: 0 auto;
    margin-bottom: 160px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    max-height: 510px;
    align-content: flex-start;
    overflow: scroll;

    li {
      flex: 0 0 100%;
      display: flex;
      font-size: 12px;
      padding: 8px 0;
      justify-content: space-between;
      align-items: center;

      .favicon {
        height: 16px;
        margin-right: 8px;
      }

      .placeholder {
        width: 16px;
        margin-right: 8px;
        height: 16px;
        border-radius: 100%;
        background-color: #fff;
      }

      .line {
        height: 1px;
        background-color: #fff;
        margin: 0 24px;
        flex-grow: 99;
      }

      .count {
        text-align: right;
      }
    }
  }
}
</style>
