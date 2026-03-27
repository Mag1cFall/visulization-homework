<template>
  <div>
    <div class="text-emerald-300 text-sm">{{ title }}</div> <!-- 原版: 硬编码"大区数据信息" -->
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 原版没有，新增字体变量

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '資料資訊' }, // 原版没有 title prop
})

let myChart = null
const target = ref(null)

onMounted(() => {
  myChart = echarts.init(target.value)
  renderChart()
})

const renderChart = () => {
  const options = {
    xAxis: {
      show: false,
      type: 'value',
      max: function (value) {
        return parseInt(value.max * 1.2)
      },
    },
    yAxis: {
      type: 'category',
      data: props.data.regions.map((item) => item.name),
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#a3e4d7', fontFamily: FONT, fontSize: 11 }, // 原版: color '#9eb1c8', 无 fontFamily
    },
    grid: { top: 0, right: 0, bottom: 0, left: 0, containLabel: true },
    series: [
      {
        type: 'bar',
        data: props.data.regions.map((item) => ({
          name: item.name,
          value: item.value,
        })),
        showBackground: true,
        backgroundStyle: { color: 'rgba(0,206,201,.1)' }, // 原版: 灰色
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [ // 原版: 纯蓝 #479AD3
            { offset: 0, color: '#00b894' },
            { offset: 1, color: '#00cec9' },
          ]),
          barBorderRadius: 8, // 原版: 5
          shadowColor: 'rgba(0,184,148,.4)', // 原版没有
          shadowBlur: 8, // 原版没有
        },
        barWidth: 10, // 原版: 12
        label: {
          show: true,
          position: 'right',
          textStyle: { color: '#e0f7fa', fontFamily: FONT, fontSize: 10 }, // 原版: 无 fontFamily
        },
      },
    ],
  }
  myChart.setOption(options)
}

watch(() => props.data, () => { renderChart() })
</script>
