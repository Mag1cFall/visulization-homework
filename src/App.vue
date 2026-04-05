<template>
  <!-- 原版: flex，改为 flex flex-col 让标题栏在上面 -->
  <div
    class="bg-[url('assets/imgs/bg.jpg')] bg-cover bg-center h-screen text-white p-5 flex flex-col overflow-hidden"
    v-if="data"
  >
    <!-- 加标题栏 -->
    <div class="flex items-center justify-between mb-3 shrink-0">
      <div class="text-emerald-300 text-lg font-bold">台灣省資料視覺化平台</div>
      <div class="flex items-center bg-black bg-opacity-50 p-2 rounded-lg">
        <span class="mr-2 text-emerald-300 text-sm">年份：</span>
        <select
          v-model="selectedYear"
          @change="handleYearChange"
          class="bg-slate-700 text-white p-1 rounded border border-emerald-400 text-sm"
        >
          <!-- 2020~2025年份选择 -->
          <option v-for="year in [2020, 2021, 2022, 2023, 2024, 2025]" :key="year" :value="year">
            {{ year }}年
          </option>
        </select>
        <!-- 原版没有匯出按钮 加 -->
        <button
          @click="exportData"
          class="ml-3 bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-sm"
        >
          匯出資料
        </button>
      </div>
    </div>

    <!-- 原版: 直接三列 flex，这里包一层 flex-1 min-h-0 防止溢出 -->
    <div class="flex flex-1 min-h-0">
      <!-- 左栏 -->
      <div class="flex-1 mr-4 bg-opacity-50 bg-slate-800 p-3 flex flex-col">
        <!-- 原版: 无 :title prop，新增 -->
        <HorizontalBar class="h-1/3 box-border pb-3" :title="'台灣各縣市GDP（億元）'" :data="data.regionData" />
        <RadarBar class="h-1/3 box-border pb-3" :title="'六都綜合發展指數'" :data="data.riskData" />
        <Relation class="h-1/3" :title="'台灣資料中心網路'" :data="data.relationData" />
      </div>

      <!-- 中栏 -->
      <div class="w-1/2 mr-4 flex flex-col">
        <TotalData
          class="bg-opacity-50 bg-slate-800 p-3"
          :title="`台灣省資料總覽（${data.currentYear}年）`"
          :data="data.totalData"
        />
        <!-- 原版没有 :currentYear prop，新增 -->
        <MapChart
          class="bg-opacity-50 bg-slate-800 p-3 mt-2 flex-1"
          :data="data.mapData"
          :currentYear="data.currentYear"
        />
      </div>

      <!-- 右栏 -->
      <div class="flex-1 bg-opacity-50 bg-slate-800 p-3 flex flex-col">
        <VerticalBar class="h-1/3 box-border pb-3" :title="'台灣政務雲資源佔用'" :data="data.serverData" />
        <RingBar class="h-1/3 box-border pb-3" :title="'各城市異常處理量'" :data="data.abnormalData" />
        <WordCloud class="h-1/3" :title="'台灣城市關鍵詞'" :data="data.wordCloudData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import HorizontalBar from './components/HorizontalBar.vue'
import RadarBar from './components/RadarBar.vue'
import Relation from './components/Relation.vue'
import TotalData from './components/TotalData.vue'
import MapChart from './components/MapChart.vue'
import VerticalBar from './components/VerticalBar.vue'
import RingBar from './components/RingBar.vue'
import WordCloud from './components/WordCloud.vue'

import { getMockTaiwanData } from './api/visualization.js' // 原版: import { getVisualization } from './api/visualization.js'
import { ref, onMounted, nextTick } from 'vue' // 原版: 只有 ref

const data = ref(null)
const selectedYear = ref(2025) // 原版没有

const loadData = () => { // 原版: async + axios 请求后端，现在改本地 mock + nextTick 避免同时重绘卡顿
  data.value = null
  nextTick(() => {
    data.value = getMockTaiwanData(selectedYear.value)
  })
}

const handleYearChange = () => { // 原版没有
  loadData()
}

const exportData = () => { // 原版没有
  const dataStr = JSON.stringify(data.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `台灣省資料_${selectedYear.value}年.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => { // 原版: 直接调 loadData()，没用 onMounted
  loadData()
})
// 原版: setInterval(loadData, 3000)，卡成*
</script>
