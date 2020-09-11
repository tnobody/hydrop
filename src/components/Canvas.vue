<template>
  <article
    class="flex-1 overflow-hidden flex flex-col my-4 space-y-4 justify-center mb-32"
  >
    <div class="px-4 hidden">
      <div class="flex flex-col">
        <span class="text-xl hidden">
          {{ store.date }}
          <span class="text-opacity-50 text-blue-200">l</span>
        </span>
        <span class="text-opacity-25 text-blue-200">Getrunken</span>
      </div>
    </div>
    <div class="px-4 flex overflow-hidden justify-end"></div>
    <div
      class="flex-1 md:flex container mx-auto md:space-x-4 md:flex-row md:overflow-hidden overflow-auto overscroll-auto data-canvas"
    >
      <!-- <transition name="view-button-fade" mode="out-in"> -->
      <div class="h-full w-full md:w-auto md:flex-1 rounded-lg overflow-hidden">
        <div
          key="chart"
          style="padding-top: 56.25%"
          class="w-full self-center container mx-auto relative"
        >
          <div class="absolute top-0 left-0 w-full h-full">
            <Chart :data="chartData" :target="target" />
          </div>
        </div>
      </div>
      <div class="h-full overflow-auto  md:w-auto md:flex-1">
        <table class="w-100 table-auto">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody class="w-100">
            <tr v-for="d in store.drank.value" :key="d.$key" class="w-100">
              <td class="pl-4 py-4">
                <label class=" items-center space-x-2 flex">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="clock w-4 h-4 opacity-75"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>
                    <input
                      class="bg-transparent "
                      type="time"
                      :value="intlDate(d.date)"
                      required
                      @change="handleTimeChange($event, d)"
                      pattern="[0-9]{2}:[0-9]{2}"
                      min="00:00"
                      max="23:59"
                    />
                  </span>
                </label>
              </td>
              <td class="pl-4 py-4">{{ d.amount }}</td>
              <td class="px-4 w-12">
                <button @click="deleteEntry(d)">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="trash w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- </transition> -->
    </div>
    <DateChanger :value="store.date.value" @date-change="handleDateChange" />
  </article>
</template>
<script lang="ts">
import Chart from "@/components/Chart.vue";
import DateChanger from "@/components/DateChanger.vue";
import { DrinkDataEntry } from "@/db";
import { getHours, getMinutes, getTime, setHours, setMinutes } from "date-fns";
import { defineComponent, computed, ref } from "vue";
import { intlDate } from "@/utils/intl-date";
import { isHtmlInputElement } from "@/utils/events";
import { useStore } from "@/store";

export default defineComponent({
  components: {
    Chart,
    DateChanger,
  },
  setup() {
    const store = useStore();
    const target = ref(3);

    async function handleClick(amount: number) {
      await store.insert(amount);
    }

    async function deleteEntry(e: DrinkDataEntry) {
      await store.deleteEntry(e);
    }

    async function handleDateChange(evt: number) {
      store.setDate(evt);
    }

    async function handleTimeChange(
      { target }: InputEvent,
      entry: DrinkDataEntry
    ) {
      console.log(event, entry);
      if (
        isHtmlInputElement(target) &&
        /[0-9]{2}:[0-9]{2}/.test(target.value)
      ) {
        const [hrs, min] = target.value.split(":");
        const date = getTime(
          setMinutes(setHours(entry.date, Number(hrs)), Number(min))
        );
        await store.update(entry, { date });
        target.blur();
      }
    }

    const chartData = computed(() => {
      return [
        { x: 0, y: 0 },
        ...store.drankAccumulated.value.map(({ amountAccumulated, date }) => ({
          x: getHours(date) + getMinutes(date) / 60,
          y: amountAccumulated,
        })),
        { x: 160, y: store.drankToday.value },
      ];
    });

    return {
      deleteEntry,
      handleTimeChange,
      store,
      handleClick,
      chartData,
      target,
      handleDateChange,
      intlDate,
    };
  },
});
</script>
<style>
input[type="time"] {
  position: relative;
}
input[type="time"]::-webkit-calendar-picker-indicator {
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

table th:first-child {
  width: calc(100%);
}

.view-button-fade-enter-active,
.view-button-fade-leave-active {
  transition: all 0.25s ease-in;
  will-change: transform;
}

.view-button-fade-enter-from,
.view-button-fade-leave-to {
  opacity: 1;
}

.view-button-fade-leave-to {
  transform: translate(0, 100%);
}
.view-button-fade-enter-from {
  transform: translate(0, -100%);
}

.data-canvas {
  scroll-snap-type: y mandatory;
}
.data-canvas > div {
  scroll-snap-align: start;
}
</style>
