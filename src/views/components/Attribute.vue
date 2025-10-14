<template>
  <div class="attribute">
    <div>
      <slot name="name" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => { });

    return {};
  },
};
</script>

<style lang="scss" scoped>
.attribute {
  >div:first-child {
    font-weight: 500;
    font-size: 13px;
    line-height: 120%;
    color: #999999;;
  }

  >div:nth-child(2) {
    margin-top: 5px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #1a1a1a;
  }
}
</style>