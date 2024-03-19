<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="social" style="height: 300px;" class="grid-content bg-purple">1</div>
      </el-col>
      <el-col :span="12">
        <div id="provident" style="height: 300px;" class="grid-content bg-purple-light">2</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { homeDataApi } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      homeData: {},
    };
  },
  mounted() {
    this.socialCharts = echarts.init(document.getElementById('social'))
    this.providentCharts = echarts.init(document.getElementById('provident'))
  },
  watch: {
    homeData() {
      this.socialCharts.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.homeData.socialInsurance.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.homeData.socialInsurance.yAxis,
            type: 'line',
            areaStyle: {}
          }
        ]
      }),
        this.providentCharts.setOption({
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.homeData.providentFund.xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: this.homeData.providentFund.yAxis,
              type: 'line',
              symbol: 'none',
              areaStyle: {
                color: '#04c9be' // 填充颜色
              },
              lineStyle: {
                color: '#04c9be' // 线的颜色
              }
            }
          ]
        })
    },
  },
  methods: {
    async getHomeData() {
      const res = await homeDataApi()
      console.log(res);
      this.homeData = res
    }
  },
  created() {
    this.getHomeData()
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
