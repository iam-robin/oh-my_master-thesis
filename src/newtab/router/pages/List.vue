<template>
<div class="container">
  <div v-for="item in data" :key="item.date" class="date-container">
    <div class="listhead">
      <h1>{{item.date}}</h1>
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

</div>
</div>
</template>

<script>
export default {
  name: 'test-route',

  props: {
    mode: String,
    data: Array,
  },

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
    width: 40%;
    margin: 0 auto;
    margin-bottom: 160px;

    &:last-child {
      margin-bottom: 80px;
    }

    .listhead {
      display: flex;
      align-items: bottom;
      justify-content: space-between;
      line-height: 16px;
      margin-bottom: 16px;

      h1 {
        font-size: 16px;
        margin: 0;
      }

      h2 {
        margin: 0;
        font-size: 12px;
      }
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    max-height: 500px;
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
        background-color: #e6e9ee;
      }

      .line {
        height: 1px;
        background-color: #e6e9ee;
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
