<template>
<div class="container">
  <ul>
    <li v-for="limit in limits" :key="limit.domain">
      <span>{{ limit.domain }}</span><span>{{ limit.timeLimit }}</span>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'test-route',
  data: function() {
    return {
      // array with key (dates) and values (websites)
      limits: [],
    };
  },
  created: function() {
    this.getLimits();
  },
  methods: {
    getLimits() {
      let limits = JSON.parse(localStorage.getItem('limits'));
      this.limits = limits;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 240px;
}
</style>
