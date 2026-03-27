export const getMockTaiwanData = (year = 2025) => { // 原版: 没有这个函数，原版用 axios 请求后端
  const cities = [ // 原版: 辽宁省14个城市，改为台灣22縣市
    "台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市",
    "基隆市", "新竹市", "嘉義市", "新竹縣", "苗栗縣",
    "彰化縣", "南投縣", "雲林縣", "嘉義縣", "屏東縣",
    "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"
  ]

  const seededRandom = (seed) => { // 原版没有，用 Math.sin 伪随机保证同年同值
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const gdpBase = { // 原版: 辽宁14市GDP，改为台灣22縣市GDP基础值
    "台北市": 5800, "新北市": 3200, "桃園市": 2800, "台中市": 3100,
    "台南市": 2400, "高雄市": 2900, "基隆市": 450, "新竹市": 1800,
    "嘉義市": 380, "新竹縣": 1200, "苗栗縣": 520, "彰化縣": 780,
    "南投縣": 350, "雲林縣": 420, "嘉義縣": 380, "屏東縣": 480,
    "宜蘭縣": 410, "花蓮縣": 380, "台東縣": 280, "澎湖縣": 150,
    "金門縣": 120, "連江縣": 45
  }
  const yearFactor = 1 + (year - 2020) * 0.05 // 原版没有，每年增长5%

  const regionData = { // 原版: regions 直接从后端拿，这里本地生成
    regions: cities.slice(0, 14).map((city, i) => ({ // 只取前14个，避免柱状图太挤
      name: city,
      value: Math.floor((gdpBase[city] || 300) * yearFactor + seededRandom(year * 100 + i) * 200)
    }))
  }

  const riskData = { // 原版: risks 从后端拿，改为本地生成六都数据
    risks: cities.slice(0, 6).map((city, i) => ({
      name: city,
      value: Math.floor(40 + seededRandom(year * 200 + i) * 50)
    }))
  }

  const relationData = { // 原版: 从后端拿，改为台灣资料中心拓扑
    relations: [
      { id: 0, name: "台北資料中心", value: [0, 200], source: null, target: null, speed: 0 },
      { id: 1, name: "高雄分中心", value: [50, 300], source: 0, target: 1, speed: 256 },
      { id: 2, name: "台中分中心", value: [50, 100], source: 0, target: 2, speed: 198 },
      { id: 3, name: "新竹分中心", value: [100, 150], source: 2, target: 3, speed: 176 },
      { id: 4, name: "花蓮分中心", value: [100, 250], source: 1, target: 4, speed: 88 }
    ]
  }

  const totalData = { // 原版: 从后端拿，改为本地按年份计算
    total: 5200000 + (year - 2020) * 380000,
    hb: Math.floor(1200000 + seededRandom(year * 11) * 300000), // 北部
    db: Math.floor(900000 + seededRandom(year * 22) * 200000),  // 中部
    hd: Math.floor(1100000 + seededRandom(year * 33) * 250000), // 南部
    zn: Math.floor(800000 + seededRandom(year * 44) * 200000),  // 東部
    xn: Math.floor(600000 + seededRandom(year * 55) * 150000),  // 離島
    xb: Math.floor(400000 + seededRandom(year * 66) * 100000)   // 其他
  }

  const mapData = { // 原版: 从后端拿，改为本地按年份生成
    voltageLevel: [2020, 2021, 2022, 2023, 2024, 2025], // 原版: [2019,2020,2021,2022,2023]
    colors: ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#e67e22'], // 原版: 5个蓝色系颜色
    categoryData: {},
    topData: {}
  }

  ;[2020, 2021, 2022, 2023, 2024, 2025].forEach(y => {
    const yf = 1 + (y - 2020) * 0.08
    mapData.categoryData[y] = cities.slice(0, 14).map((city, i) => ({
      name: city,
      value: Math.floor(seededRandom(y * 300 + i) * 120 * yf + 30)
    }))
    mapData.topData[y] = [cities[0], cities[3], cities[4], cities[5]].map((city, i) => { // 只取4个分散城市避免重叠
      const coords = cityCoordinates[city] || [121.0, 24.0]
      return {
        name: city,
        value: [...coords, Math.floor(seededRandom(y * 400 + i) * 200 * yf + 60)]
      }
    })
  })

  const serverData = { // 原版: 从后端拿，改为台灣政务云服务器数据（繁体）
    servers: [
      { name: "Web服務", value: Math.floor(55 + seededRandom(year * 501) * 35) },  // 原版: Web服务
      { name: "資料庫", value: Math.floor(60 + seededRandom(year * 502) * 30) },   // 原版: 数据库
      { name: "快取", value: Math.floor(40 + seededRandom(year * 503) * 40) },     // 原版: 缓存
      { name: "檔案儲存", value: Math.floor(35 + seededRandom(year * 504) * 45) }, // 原版: 文件存储
      { name: "備份", value: Math.floor(25 + seededRandom(year * 505) * 30) },     // 原版: 备份
      { name: "監控", value: Math.floor(30 + seededRandom(year * 506) * 35) }      // 原版: 监控
    ]
  }

  const abnormalData = { // 原版: 从后端拿，改为台灣六都异常数据
    abnormals: [
      { name: "台北市", value: Math.floor(180 + seededRandom(year * 601) * 220) },
      { name: "新北市", value: Math.floor(150 + seededRandom(year * 602) * 180) },
      { name: "台中市", value: Math.floor(120 + seededRandom(year * 603) * 150) },
      { name: "高雄市", value: Math.floor(100 + seededRandom(year * 604) * 130) },
      { name: "桃園市", value: Math.floor(80 + seededRandom(year * 605) * 100) },
      { name: "台南市", value: Math.floor(60 + seededRandom(year * 606) * 80) }
    ]
  }

  // 原版: 从后端拿固定词云数据，这里改为台灣关键词且数值随年份波动
  const allKeywords = [
    "台北101", "高雄港", "日月潭", "阿里山", "台積電", "半導體",
    "珍珠奶茶", "夜市文化", "太魯閣", "墾丁", "九份老街", "故宮博物院",
    "花蓮", "科技園區", "淡水", "綠島", "鼎泰豐", "誠品書店",
    "捷運", "悠遊卡"
  ]
  const baseValues = [100, 92, 85, 80, 95, 88, 75, 70, 65, 60, 55, 50, 45, 78, 40, 35, 68, 62, 58, 42]
  const wordCloudData = {
    datas: allKeywords.map((name, i) => ({
      name: name,
      value: Math.floor(baseValues[i] * (0.8 + seededRandom(year * 700 + i) * 0.4))
    }))
  }

  return {
    regionData, riskData, relationData, totalData,
    mapData, serverData, abnormalData, wordCloudData,
    currentYear: year
  }
}

const cityCoordinates = { // 原版没有，新增台灣各縣市经纬度用于地图散点
  "台北市": [121.5654, 25.0330],
  "新北市": [121.4628, 25.0170],
  "桃園市": [121.3009, 24.9936],
  "台中市": [120.6736, 24.1477],
  "台南市": [120.2270, 22.9998],
  "高雄市": [120.3014, 22.6273],
  "基隆市": [121.7419, 25.1276],
  "新竹市": [120.9647, 24.8038],
  "嘉義市": [120.4491, 23.4800],
  "新竹縣": [121.0012, 24.8388],
  "苗栗縣": [120.8214, 24.5602],
  "彰化縣": [120.5161, 24.0518],
  "南投縣": [120.6837, 23.7610],
  "雲林縣": [120.5313, 23.7092],
  "嘉義縣": [120.2554, 23.4518],
  "屏東縣": [120.4879, 22.5519],
  "宜蘭縣": [121.7195, 24.7021],
  "花蓮縣": [121.6014, 23.9871],
  "台東縣": [121.1132, 22.7972],
  "澎湖縣": [119.5793, 23.5712],
  "金門縣": [118.3171, 24.4321],
  "連江縣": [119.9397, 26.1604]
}
