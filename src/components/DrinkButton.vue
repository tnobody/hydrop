<template>
  <button
    @click="handleClick"
    class="text-blue-200 p-2 bg-blue-200 h-20 w-20 bg-opacity-25 flex flex-col items-center content-end justify-center"
  >
    <div class="flex-1">
      <svg
        class="w-8 h-8 text-blue-300 block"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <use
          xlink:href="#icon-glas"
          x="0"
          y="0"
        />
      </svg>
    </div>
    <div class="self">
      {{ amountIntl }} l
    </div>
  </button>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
  props: {
    amount: { type: Number, default: () => 0 },
  },
  setup(props, ctx) {
    const amountIntl = computed(() => {
      return Intl.NumberFormat().format(props.amount);
    });
    const handleClick = () => {
      console.log('Emit')
      ctx.emit("select", props.amount);
    };

    return { handleClick, amountIntl };
  },
});
</script>
