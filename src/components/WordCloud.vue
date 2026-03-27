<template>
  <div>
    <div class="text-yellow-300 text-sm">{{ title }}</div> <!-- 原版: 硬编码"关键词条" -->
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 自定义字体

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '關鍵詞' }, // 原版没有 title prop
})

const target = ref(null)
let myChart = null

onMounted(() => {
  myChart = echarts.init(target.value)
  renderChart()
})

const warmColors = [ // 原版: 用 Math.random()*255 生成完全随机 RGB
  '#00b894', '#00cec9', '#ffeaa7', '#fab1a0',
  '#81ecec', '#55efc4', '#fdcb6e', '#e17055',
  '#74b9ff', '#a29bfe', '#dfe6e9', '#2ecc71'
]

const randomWarmColor = () => {
  return warmColors[Math.floor(Math.random() * warmColors.length)]
}

const renderChart = () => {
  const options = {
    tooltip: { // 原版: 没有这么详细的 tooltip 配置
      show: true,
      borderColor: '#00b894',
      borderWidth: 1,
      padding: [10, 15, 10, 15],
      confine: true,
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      textStyle: { color: '#55efc4', lineHeight: 22, fontFamily: FONT },
      extraCssText: 'box-shadow: 0 4px 20px -4px rgba(0,184,148,.5);border-radius: 4px;',
    },
    series: [
      {
        type: 'wordCloud',
        sizeRange: [14, 56], // 原版: [8, 46]
        rotationRange: [0, 0], // 水平排列，原版也是 [0,0]
        rotationStep: 0,
        gridSize: 6, // 原版: 0，改大避免文字挤在一起
        layoutAnimation: true,
        textStyle: {
          fontFamily: FONT, // 原版没有
          color: randomWarmColor, // 原版: 完全随机 RGB
        },
        emphasis: {
          textStyle: {
            fontWeight: 'bold',
            color: '#f1c40f', // 原版: 黑色
          },
        },
        data: props.data.datas,
      },
    ],
  }
  myChart.setOption(options)
}

watch(() => props.data, renderChart) // 原版没有 watch，现在可以跟随年份变化
</script>
