<template>
  <section
    class="text-2xl text-gray-100 justify-center space-x-4 items-center flex"
  >
    <button @click="addDay(-1)">
      <svg viewBox="0 0 10 10" class="w-6 h-6">
        <path
          d="    M6,2
                     L 4,5
                     L 6,8"
          style="stroke-width: 1"
          stroke-linejoin="round"
          stroke-linecap="round"
          class="stroke-current"
        />
      </svg>
    </button>
    <input
      class="bg-transparent text-center"
      type="date"
      :value="date"
      @change="emitChange"
    />
    <button
      @click="addDay(1)"
      :disabled="hasNextDay"
      :class="{ 'opacity-50': hasNextDay }"
    >
      <svg viewBox="0 0 10 10" class="w-6 h-6">
        <path
          d="M4,2
             L 6,5
             L 4,8"
          style="stroke-width: 1"
          stroke-linejoin="round"
          stroke-linecap="round"
          class="stroke-current"
        />
      </svg>
    </button>
  </section>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { isToday, addDays, getTime } from "date-fns";

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: Date.now(),
      required: true,
    },
  },
  setup(props, { emit }) {
    // const date = ref(new Date(props.value).toISOString().substr(0, 10));
    const date = computed(() => {
      const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      return new Date(props.value - tzoffset).toISOString().substr(0, 10);
    });
    const hasNextDay = computed(() => isToday(props.value));

    function addDay(offset: number) {
      emit("date-change", getTime(addDays(props.value, offset)));
    }

    function emitChange(e: InputEvent) {
      const d = new Date((e.currentTarget as HTMLInputElement).value);
      // date.value = d.getTime();
      emit("date-change", d.getTime());
    }

    return { addDay, date, emitChange, hasNextDay };
  },
});
</script>
<style scoped>
input[type="date"] {
  position: relative;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
</style>
