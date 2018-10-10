<template>
<div class="container">
  <div v-for="item in content" class="date-container" :key="item.date">
    <h1>{{item.date}}</h1>
    <ul>
      <li v-for="website in item.websites" :key="website.domain" :style="{ 'order': website.time *-1 }">
        <span class="domain">{{ website.domain }}</span>
        <span class="line"></span>
        <span class="count">{{ formatMS(website.time) }}</span>
      </li>
    </ul>
</div>
</div>
</template>

<script>
export default {
  name: 'test-route',
  data: function() {
    return {
      // array with key (dates) and values (websites)
      content: [],
    };
  },
  created: function() {
    let storageKeys = Object.keys(localStorage);
    let content = [];
    for (let i = 0; i < storageKeys.length; i++) {
      // for each key in storage build object with key(date) value(websites)
      // and push it to content array
      let key = storageKeys[i];
      let websites = JSON.parse(localStorage.getItem(key));
      let object = {
        date: key,
        websites: websites,
      };
      content.unshift(object);
    }
    this.content = content;
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
    width: 60%;
    margin: 0 auto;
    margin-bottom: 160px;

    &:last-child {
      margin-bottom: 80px;
    }

    h1 {
      flex: 0 0 100%;
      font-size: 16px;
      margin-bottom: 16px;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;

    li {
      flex: 0 0 100%;
      display: flex;
      font-size: 12px;
      padding: 8px 0;
      justify-content: space-between;
      align-items: center;

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
