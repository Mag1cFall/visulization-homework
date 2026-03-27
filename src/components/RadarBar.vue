<template>
  <div>
    <div class="text-orange-300 text-sm">{{ title }}</div> <!-- 原版: 硬编码"云端报警风险" -->
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 原版没有

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '風險指數' }, // 原版没有 title prop
})

const target = ref(null)
let myChart = null

onMounted(() => {
  myChart = echarts.init(target.value)
  renderChart()
})

const renderChart = () => {
  const options = {
    radar: {
      name: {
        textStyle: { color: '#fab1a0', fontSize: 12, fontFamily: FONT }, // 原版: color '#05D5FF', fontSize 14
      },
      shape: 'polygon',
      center: ['50%', '50%'],
      radius: '80%',
      startAngle: 120,
      axisLabel: { lineStyle: { color: 'rgba(225,112,85,.6)' } }, // 原版: 青蓝色
      splitLine: {
        show: true,
        lineStyle: { width: 1, color: 'rgba(225,112,85,.5)' }, // 原版: 青蓝色
      },
      indicator: props.data.risks.map((item) => ({ name: item.name, max: 100 })),
      splitArea: { show: false },
    },
    polar: { center: ['50%', '50%'], radius: '0%' },
    angleAxis: { min: 0, interval: 5, clockwise: false },
    radiusAxis: { min: 0, interval: 20, splitLine: { show: true } },
    series: {
      type: 'radar',
      symbol: 'circle',
      symbolSize: 8, // 原版: 10
      itemStyle: { normal: { color: '#e17055' } }, // 原版: #05D5FF
      areaStyle: { normal: { color: '#e17055', opacity: 0.4 } }, // 原版: #05D5FF
      lineStyle: { width: 2, color: '#e17055' }, // 原版: #05D5FF
      label: {
        normal: { show: true, color: '#ffeaa7', fontFamily: FONT }, // 原版: 无 fontFamily
      },
      data: [{ value: props.data.risks.map((item) => item.value) }],
    },
  }
  myChart.setOption(options)
}

watch(() => props.data, renderChart)
</script>
