<template>
  <div>
    <div class="text-purple-300 text-sm">{{ title }}</div> <!-- 原版: 硬编码"数据传递信息" -->
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const FONT = 'LXGW, Microsoft YaHei, sans-serif' // 原版没有

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '資料傳遞' }, // 原版没有 title prop
})

const target = ref(null)
let myChart = null

onMounted(() => {
  myChart = echarts.init(target.value)
  renderChart()
})

const renderChart = () => {
  const options = {
    xAxis: { show: false, type: 'value' },
    yAxis: { show: false, type: 'value' },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        symbolSize: 26,
        z: 3,
        edgeLabel: {
          normal: {
            show: true,
            color: '#dfe6e9', // 原版: 白色
            textStyle: { fontSize: 14, fontFamily: FONT }, // 原版: 无 fontFamily
            formatter: function (params) { return params.data.speed },
          },
        },
        label: {
          normal: {
            show: true,
            position: 'bottom',
            color: '#a29bfe', // 原版: 蓝色系
            fontFamily: FONT,
            fontSize: 12,
          },
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 8,
        data: props.data.relations.map((item) => {
          if (item.id !== 0) {
            return { name: item.name, value: item.value }
          } else {
            return {
              name: item.name,
              value: item.value,
              symbolSize: 100,
              itemStyle: {
                normal: {
                  color: {
                    colorStops: [
                      { offset: 0, color: '#6c5ce7' }, // 原版: #157eff
                      { offset: 1, color: '#a29bfe' }, // 原版: #35c2ff
                    ],
                  },
                },
              },
              label: { normal: { fontSize: 14, fontFamily: FONT } },
            }
          }
        }),
        links: props.data.relations.map((item) => ({
          source: item.source,
          target: item.target,
          speed: `${item.speed}kb/s`,
          lineStyle: { normal: { color: '#6c5ce7', curveness: 0.2 } }, // 原版: #12b5d0
          label: { show: true, position: 'middle', offset: [10, 0] },
        })),
      },
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        z: 1,
        effect: {
          show: true,
          smooth: false,
          trailLength: 0,
          symbol: 'arrow',
          color: 'rgba(162,155,254,0.6)', // 原版: 青蓝色
          symbolSize: 12,
        },
        lineStyle: { normal: { curveness: 0.2 } },
        data: [ // 原版坐标错误，修正为与节点一致
          [{ coord: [0, 200] }, { coord: [50, 300] }],
          [{ coord: [0, 200] }, { coord: [50, 100] }],
          [{ coord: [50, 100] }, { coord: [100, 150] }],
          [{ coord: [50, 300] }, { coord: [100, 250] }],
        ],
      },
    ],
  }
  myChart.clear()
  myChart.setOption(options)
}

watch(() => props.data, renderChart)
</script>
