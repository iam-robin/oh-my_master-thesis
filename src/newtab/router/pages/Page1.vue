<template>
<div class="container">
  <div v-for="item in content" class="date-container" :key="item.date">
    <div class="listhead">
      <h1>{{item.date}}</h1>
      <h2>{{item.sum}} Seitenaufrufe</h2>
    </div>
    <ul>
      <li v-for="website in item.websites" :key="website.domain" :style="{ 'order': website.count *-1 }">
        <img v-if="website.favicon != '' && website.favicon" :src="website.favicon" alt="favicon" class="favicon">
        <span v-else class="placeholder"></span>
        <span class="domain">{{ website.domain }}</span>
        <span class="line"></span>
        <span class="count"><span v-if="website.count<10">0</span>{{ website.count }}</span>
      </li>
    </ul>
</div>
</div>
</template>

<script>
export default {
  name: 'page1',
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
      if (key !== 'limits') {
        let websites = JSON.parse(localStorage.getItem(key));
        let sum = 0;
        for (let i = 0; i < websites.length; i++) {
          sum += websites[i].count;
        }
        let object = {
          date: key,
          websites: websites,
          sum: sum,
        };
        content.unshift(object);
      }
    }
    console.log(content);
    this.content = content;
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
