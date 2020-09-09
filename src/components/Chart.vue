<template>
  <svg
    class
    viewBox="0 0 160 90"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g>
      <use
        xlink:href="#icon-drop"
        style="stroke-width: 0;"
        class="stroke-current fill-current"
        v-for="(d, i) in chartPoints"
        :x="d.x"
        :y="d.y"
        transform="translate(-2, -2)"
        :key="d.y + ',' + i"
      />
      <circle
        v-for="(d, i) in chartPoints"
        :cx="d.x"
        :cy="d.y"
        :key="d.y + ',' + i"
        r="2"
        style="stroke-width: 0;"
        class="stroke-current fill-current hidden"
      />
    </g>
    <line
      x1="0"
      :y1="interpolateY(target)"
      x2="200"
      :y2="interpolateY(target)"
      class="text-green-500 stroke-current"
      style="stroke-width:1"
      stroke-dasharray="10 5"
    />
    <rect
      v-for="i in maxY"
      x="0"
      :key="i"
      :y="(90 / maxY) * (i - 1)"
      width="160"
      :height="90 / maxY"
      class="fill-current text-blue-500 opacity-25"
      :class="{ hidden: i % 2 === 0 }"
    />
    <path
      :d="chartLine"
      style="stroke-width:0.5;fill:none"
      class="stroke-current"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>
</template>
<script lang="ts">
import { scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import { computed, PropType, defineComponent } from "vue";
import { Point } from "@/utils/line";

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<Point[]>,
      default: () => [],
    },
    target: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props) {
    const maxY = computed(() => {
      const maxDataPoint = props.data.reduce(
        (max, { y }) => Math.max(max, y),
        props.target
      );
      return Number.isInteger(maxDataPoint)
        ? maxDataPoint + 1
        : Math.ceil(maxDataPoint);
    });

    const interpolateY = (v: number) =>
      scaleLinear()
        .domain([0, maxY.value])
        .range([90, 0])(v);

    const interpolateX = (v: number) => {
      return scaleLinear()
        .domain([0, 24])
        .range([0, 160])(v);
    };
    const chartData = computed(() => {
      return props.data.map(({ x, y }) => ({
        x: interpolateX(x),
        y: interpolateY(y),
      }));
    });

    const chartPoints = computed(() => {
      const cd = [...chartData.value];
      cd.pop();
      cd.shift();
      return cd;
    });

    const chartLine = computed(() => {
      const lg = line<Point>()
        .x(({ x }) => x)
        .y(({ y }) => y)
        .curve(curveMonotoneX);
      return lg(chartData.value);
    });

    return {
      chartLine,
      chartPoints,
      chartData,
      interpolateY,
      interpolateX,
      maxY,
    };
  },
});
</script>
