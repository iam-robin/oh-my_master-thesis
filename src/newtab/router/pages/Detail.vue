<template>
<div class="container">
  <span>Domain: {{ $route.params.domain }}</span>
</div>
</template>

<script>
export default {
  name: 'detail page',
  data: function() {
    return {};
  },
  created: function() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40px;
}
</style>
