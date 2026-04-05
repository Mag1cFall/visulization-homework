<template>
  <div>
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue' // 原版: 没有 watch
import mapJson from '../assets/MapData/taiwan.json' // 原版: china.json
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 自定义字体

const props = defineProps({
  data: { type: Object, required: true },
  currentYear: { type: Number, default: 2025 }, // 原版没有这个 prop
})

const target = ref(null)
let myChart = null

onMounted(() => {
  echarts.registerMap('taiwan', mapJson) // 原版: echarts.registerMap('china', mapJson)
  myChart = echarts.init(target.value)
  renderChart()
})

const renderChart = () => {
  const options = {
    timeline: {
      data: props.data.voltageLevel,
      axisType: 'category',
      autoPlay: true,
      playInterval: 3000,
      left: '10%',
      right: '10%',
      bottom: '0%',
      width: '80%',
      label: {
        normal: { textStyle: { color: '#ddd', fontFamily: FONT } },
        emphasis: { textStyle: { color: '#fff', fontFamily: FONT } },
      },
      symbolSize: 10,
      lineStyle: { color: '#2d3436' }, // 原版: #555
      checkpointStyle: {
        borderColor: '#00b894', // 原版: 蓝色
        borderWidth: 2,
      },
      controlStyle: {
        showNextBtn: true,
        showPrevBtn: true,
        normal: { color: '#00b894', borderColor: '#00b894' },
        emphasis: { color: '#00cec9', borderColor: '#00cec9' },
      },
    },
    baseOption: {
      grid: { right: '2%', top: '15%', bottom: '10%', width: '20%' },
      animation: false, // 性能优化：关掉 baseOption 动画防止拖拽卡顿
      tooltip: { // 原版没有 tooltip
        trigger: 'item',
        backgroundColor: 'rgba(10,22,40,0.9)',
        borderColor: '#00b894',
        textStyle: { color: '#e0f7fa', fontFamily: FONT },
      },
      geo: {
        show: true,
        map: 'taiwan', // 原版: 'china'
        roam: true, // 允许缩放和拖拽
        zoom: 1,
        center: [120.9, 23.6], // 原版: 没有指定，默认中国中心
        label: {
          normal: { show: false },
          emphasis: { show: true, color: '#fff', fontFamily: FONT, fontSize: 12 },
        },
        itemStyle: {
          normal: {
            borderColor: 'rgba(0,184,148,0.8)', // 原版: 蓝色系
            borderWidth: 1,
            areaColor: {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(0,184,148,0)' },
                { offset: 1, color: 'rgba(0,184,148,.2)' },
              ],
            },
          },
          emphasis: { areaColor: '#00b894', borderWidth: 0 }, // 原版: 蓝色
        },
      },
    },
    options: [],
  }

  props.data.voltageLevel.forEach((item, index) => {
    options.options.push({
      backgroundColor: '#0a1628',
      title: [
        {
          text: '2020-2025 台灣省資料統計', // 原版: '2019-2023'
          left: 0, top: 0,
          textStyle: { color: '#a3e4d7', fontSize: 24, fontFamily: FONT },
        },
        {
          id: 'statistic',
          text: item + '年資料統計情況',
          right: '0%', top: '4%',
          textStyle: { color: '#ccc', fontSize: 16, fontFamily: FONT },
        },
      ],
      xAxis: {
        type: 'value',
        scale: true,
        position: 'top',
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { margin: 2, textStyle: { color: '#aaa', fontFamily: FONT } },
      },
      yAxis: {
        type: 'category',
        axisLine: { show: true, lineStyle: { color: '#ddd' } },
        axisTick: { show: false },
        axisLabel: { interval: 0, textStyle: { color: '#ddd', fontFamily: FONT, fontSize: 11 } },
        data: props.data.categoryData[item]
          .sort((a, b) => a.value - b.value)
          .map((d) => d.name),
      },
      series: [
        {
          type: 'bar',
          zlevel: 1,
          itemStyle: { normal: { color: props.data.colors[index % props.data.colors.length] } },
          data: props.data.categoryData[item]
            .sort((a, b) => a.value - b.value)
            .map((d) => d.value),
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: props.data.topData[item],
          symbolSize: function (val) { return val[2] / 10 }, // 原版: / 6，改小避免重叠
          rippleEffect: { brushType: 'stroke', scale: 3, period: 6 },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true,
              fontFamily: FONT,
              fontSize: 11,
            },
          },
          itemStyle: {
            normal: {
              color: props.data.colors[index % props.data.colors.length],
              shadowBlur: 5,
              shadowColor: props.data.colors[index % props.data.colors.length],
            },
          },
        },
      ],
    })
  })

  myChart.clear() // 原版没有，新增清除旧数据防止残留
  myChart.setOption(options)
}

watch(() => props.data, () => { renderChart() }) // 原版没有 watch，年份切换后地图不会更新
</script>

