<template>
  <div>
    <div class="text-pink-300 text-sm">{{ title }}</div> <!-- 原版: 硬编码"大区异常处理" -->
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 原版没有

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '異常處理' }, // 原版没有 title prop
})

const target = ref(null)
let myChart = null

onMounted(() => {
  myChart = echarts.init(target.value)
  renderChart()
})

const getSeriesData = () => {
  const series = []
  const ringColors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'] // 原版: 没有自定义颜色

  props.data.abnormals.forEach((item, index) => {
    series.push({
      name: item.name,
      type: 'pie',
      clockWise: false,
      hoverAnimation: false,
      radius: [73 - index * 15 + '%', 68 - index * 15 + '%'],
      center: ['55%', '55%'],
      label: { show: false },
      data: [
        {
          value: item.value,
          name: item.name,
          itemStyle: { color: ringColors[index] }, // 原版: 没有指定颜色
        },
        {
          value: 1000,
          itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
          tooltip: { show: false },
          hoverAnimation: false,
        },
      ],
    })
    series.push({
      name: item.name,
      type: 'pie',
      silent: true,
      z: 1,
      clockWise: false,
      hoverAnimation: false,
      radius: [73 - index * 15 + '%', 68 - index * 15 + '%'],
      center: ['55%', '55%'],
      label: { show: false },
      data: [
        {
          value: 7.5,
          itemStyle: { color: 'rgb(10,30,35)', borderWidth: 0 }, // 原版: rgb(3,31,62)
          tooltip: { show: false },
          hoverAnimation: false,
        },
        {
          value: 2.5,
          itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
          tooltip: { show: false },
          hoverAnimation: false,
        },
      ],
    })
  })
  return series
}

const renderChart = () => {
  const options = {
    legend: {
      show: true,
      icon: 'circle',
      top: '14%',
      left: '60%',
      data: props.data.abnormals.map((item) => item.name),
      orient: 'vertical',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 6,
      textStyle: { fontSize: 12, lineHeight: 5, color: 'rgba(255,255,255,0.85)', fontFamily: FONT }, // 原版: 无 fontFamily
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{a}<br>{b}:{c}({d}%)',
    },
    yAxis: [{ type: 'category', inverse: true, axisLine: { show: false } }],
    xAxis: [{ show: false }],
    series: getSeriesData(),
  }
  myChart.clear()
  myChart.setOption(options)
}

watch(() => props.data, renderChart)
</script>
