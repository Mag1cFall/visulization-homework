<template>
  <div>
    <div class="text-blue-300 text-sm">{{ title }}</div> <!-- 原版: 硬编码"服务资源占用比" -->
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 原版没有

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '資源佔用' }, // 原版没有 title prop
})

const target = ref(null)
let myChart = null

onMounted(() => {
  myChart = echarts.init(target.value)
  renderChart()
})

const renderChart = () => {
  const options = {
    xAxis: {
      type: 'category',
      data: props.data.servers.map((item) => item.name),
      axisLabel: { color: '#74b9ff', fontFamily: FONT, fontSize: 11 }, // 原版: 默认颜色，无 fontFamily
    },
    yAxis: {
      type: 'value',
      show: false,
      max: function (value) { return parseInt(value.max * 1.2) },
    },
    grid: { top: 16, right: 0, bottom: 26, left: -26, containLabel: true },
    series: [
      {
        type: 'bar',
        data: props.data.servers.map((item) => ({
          name: item.name,
          value: item.value,
        })),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ // 原版: 纯蓝 #479AD3
            { offset: 0, color: '#74b9ff' },
            { offset: 1, color: '#0984e3' },
          ]),
          barBorderRadius: 8, // 原版: 5
          shadowColor: 'rgba(9,132,227,.4)', // 原版没有
          shadowBlur: 8, // 原版没有
        },
        barWidth: 14, // 原版: 12
        label: {
          show: true,
          position: 'top',
          textStyle: { color: '#dfe6e9', fontFamily: FONT, fontSize: 11 }, // 原版: 无 fontFamily
          formatter: '{c}%',
        },
      },
    ],
  }
  myChart.setOption(options)
}

watch(() => props.data, renderChart)
</script>
