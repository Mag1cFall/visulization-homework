<template>
  <div class="p-4">
    <div class="text-emerald-300 text-center text-sm mb-2">{{ title }}</div> <!-- 加标题 -->
    <div class="text-slate-300 text-center">
      資料總量：
      <span ref="totalCountTarget" class="text-7xl ml-2 mr-2 font-bold font-[Electronic] text-gradient"></span>
      筆紀錄
    </div>
    <!-- 原版: flex flex-wrap 导致对不齐，改为 grid 三列 -->
    <div class="mt-3 grid grid-cols-3 gap-y-1 gap-x-2">
      <div class="text-center text-slate-400 text-sm">
        北部：<span ref="city1" class="text-[#2ecc71] text-2xl font-[Electronic]"></span>
      </div>
      <div class="text-center text-slate-400 text-sm">
        中部：<span ref="city2" class="text-[#2ecc71] text-2xl font-[Electronic]"></span>
      </div>
      <div class="text-center text-slate-400 text-sm">
        南部：<span ref="city3" class="text-[#2ecc71] text-2xl font-[Electronic]"></span>
      </div>
      <div class="text-center text-slate-400 text-sm">
        東部：<span ref="city4" class="text-[#2ecc71] text-2xl font-[Electronic]"></span>
      </div>
      <div class="text-center text-slate-400 text-sm">
        離島：<span ref="city5" class="text-[#2ecc71] text-2xl font-[Electronic]"></span>
      </div>
      <div class="text-center text-slate-400 text-sm">
        其他：<span ref="city6" class="text-[#2ecc71] text-2xl font-[Electronic]"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue' // 原版: 没有 watch
import { CountUp } from 'countup.js'

const props = defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: '資料總覽' }, // 原版没有 title prop
})

const totalCountTarget = ref(null)
const city1 = ref(null)
const city2 = ref(null)
const city3 = ref(null)
const city4 = ref(null)
const city5 = ref(null)
const city6 = ref(null)

const noComma = { separator: '' } // 原版没有，去掉数字中的逗号

let counters = {} // 原版没有，改为保存引用以便 watch 中调用 update

onMounted(() => {
  counters.total = new CountUp(totalCountTarget.value, props.data.total, noComma)
  counters.c1 = new CountUp(city1.value, props.data.hb, noComma)
  counters.c2 = new CountUp(city2.value, props.data.db, noComma)
  counters.c3 = new CountUp(city3.value, props.data.hd, noComma)
  counters.c4 = new CountUp(city4.value, props.data.zn, noComma)
  counters.c5 = new CountUp(city5.value, props.data.xn, noComma)
  counters.c6 = new CountUp(city6.value, props.data.xb, noComma)
  Object.values(counters).forEach(c => c.start())
})

watch(() => props.data, () => { // 原版没有 watch，年份切换后数字不会变
  if (!counters.total) return
  counters.total.update(props.data.total)
  counters.c1.update(props.data.hb)
  counters.c2.update(props.data.db)
  counters.c3.update(props.data.hd)
  counters.c4.update(props.data.zn)
  counters.c5.update(props.data.xn)
  counters.c6.update(props.data.xb)
})
</script>

