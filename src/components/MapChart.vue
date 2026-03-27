<template>
  <div>
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import mapJson from '../assets/MapData/taiwan.json' // 原版: china.json
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 原版没有，新增全局字体变量

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
        normal: { textStyle: { color: '#ddd', fontFamily: FONT } }, // 加入 fontFamily
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
        normal: { color: '#00b894', borderColor: '#00b894' }, // 原版: 蓝色
        emphasis: { color: '#00cec9', borderColor: '#00cec9' },
      },
    },
    baseOption: {
      grid: { right: '2%', top: '15%', bottom: '10%', width: '20%' },
      tooltip: { // 加鼠标悬浮提示
        trigger: 'item',
        backgroundColor: 'rgba(10,22,40,0.9)',
        borderColor: '#00b894',
        textStyle: { color: '#e0f7fa', fontFamily: FONT },
      },
      geo: {
        show: true,
        map: 'taiwan', // 原版: 'china'
        roam: true, // 允许缩放和拖拽
        zoom: 1, // 改为1看全景
        center: [120.9, 23.6], // 原版: 没有指定，默认中国中心
        label: {
          normal: { show: false },
          emphasis: { show: true, color: '#fff', fontFamily: FONT, fontSize: 12 },
        },
        itemStyle: {
          normal: {
            borderColor: 'rgba(0,184,148,0.8)', // 原版: 蓝色系
            borderWidth: 1,
            areaColor: { // 原版: 蓝色渐变
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
      backgroundColor: '#0a1628', // 原版: 类似深蓝背景
      title: [
        {
          text: '2020-2025 台灣省資料統計', // 原版: '2019-2023'
          left: 0, top: 0,
          textStyle: { color: '#a3e4d7', fontSize: 24, fontFamily: FONT }, // 原版: 蓝白, fontSize 30
        },
        {
          id: 'statistic',
          text: item + '年資料統計情況', // 原版: '年数据统计情况'
          right: '0%', top: '4%',
          textStyle: { color: '#ccc', fontSize: 16, fontFamily: FONT }, // 原版: fontSize 20
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
          zlevel: 1.5,
          itemStyle: { normal: { color: props.data.colors[index % props.data.colors.length] } },
          data: props.data.categoryData[item]
            .sort((a, b) => a.value - b.value)
            .map((d) => d.value),
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: props.data.topData[item],
          symbolSize: function (val) { return val[2] / 10 }, // 原版: / 6，改小避免北部圆圈重叠
          rippleEffect: { brushType: 'stroke', scale: 3, period: 6 }, // 原版: 只有 brushType
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

  myChart.setOption(options)
}
</script>
