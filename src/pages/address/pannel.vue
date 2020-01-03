<template>
  <div class="pannel">
    <van-popup
      closeable
      position="bottom"
      v-bind="$attrs"
      v-on="$listeners"
      round
      :style="{ height: '10rem' }"
    >
      <h2 class="title">配送至</h2>
      <van-tabs v-model="active">
        <van-tab :title="item" v-for="(item, index) in tabList" :key="index">
          <ul class="list" v-if="index == 0">
            <li 
              :class="{'on' : aIndex == provinceIndex}" 
              v-for="(province, aIndex) in provinceList" 
              :key="aIndex"
              @click="selProvince(province, index, aIndex)"
            >{{province.name}}</li>
          </ul>
          <ul class="list" v-if="index == 1">
            <li
              :class="{'on' : aIndex == cityIndex}" 
              v-for="(city, aIndex) in cityList" 
              :key="aIndex"
              @click="selCity(city, index, aIndex)"
            >{{city.name}}</li>
          </ul>
          <ul class="list" v-if="index == 2">
            <li
              :class="{'on' : aIndex == areaIndex}" 
              v-for="(area, aIndex) in areaList" 
              :key="aIndex"
              @click="selArea(area, index, aIndex)"
            >{{area.name}}</li>
          </ul>
          <ul class="list" v-if="index == 3">
            <li
              :class="{'on' : aIndex == streetIndex}" 
              v-for="(street, aIndex) in streetList" 
              :key="aIndex"
              @click="selStreet(street, index, aIndex)"
            >{{street.name}}</li>
          </ul>
        </van-tab>
        <van-loading v-show="showLoading" :size="50" color="#dc2828" />
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: [String,Object]
    }
  },

  data() {
    return {
      active: 0,
      tabList: ['请选择'],
      provinceIndex: null, // 省高亮
      provinceList: [],
      cityIndex: null, // 市高亮
      cityList: [],
      areaIndex: null, // 县高亮 
      areaList: [],
      streetIndex: null, // 街道高亮
      streetList: [],
      showLoading: false,
    }
  },

  created() {
    this.getProvince()
  },

  methods: {
    // 选择省
    async selProvince(province, index, pIndex) {
      this.tabList = [province.name,'请选择']
      await this.getCity()
      this.active = 1
      this.cityIndex = null
    },

    // 选择市
    async selCity(city, index, cIndex) {
      this.cityIndex = cIndex
      let [province] = this.tabList
      this.tabList = [province, city.name,'请选择']
      await this.getArea()
      this.active = 2
      this.areaIndex = null
    },

    // 选择县
    async selArea(area, index, aIndex) {
      let [province,city] = this.tabList
      this.areaIndex = aIndex
      this.streetIndex = null
      this.tabList = [province,city,area.name,'请选择']
      await this.getStreet()
      this.active = 3
    },


    // 选择街道
    async selStreet(streets, index, sIndex) {
      this.streetIndex = sIndex
      console.log(streets,'streetsstreets')
      this.tabList.splice(index, 1, streets.name)
      let [province,city,area,street] = this.tabList
      let info = {
        province,
        city,
        area,
        street,
      }
      this.$emit('address',info)
    },
    
    // 获取省
    getProvince() {
      this.provinceList = [
        {
          name: '山东省',
          code: 1
        },
        {
          name: '北京',
          code: 1
        }
      ]
    },

    // 获取市
    getCity(id) {
      this.showLoading = true
      this.cityList = [
        {
          name: '济南市',
          code: 11
        },
        {
          name: '临沂市',
          code: 12
        }
      ]
      setTimeout(() => {
        this.showLoading = false
      }, 1000)
    },

    // 获取县
    getArea(id) {
      this.showLoading = true
      this.areaList = [
        {
          name: '章鱼县',
          code: 11
        },
        {
          name: '兰山区',
          code: 12
        }
      ]
      setTimeout(() => {
        this.showLoading = false
      }, 1000)
    },

    // 获取街道
    getStreet(id) {
      this.showLoading = true
      this.streetList = [
        {
          name: '城区',
          code: 11
        },
        {
          name: '东花街道',
          code: 12
        }
      ]
      console.log(this.streetList,'this.streetList')
      setTimeout(() => {
        this.showLoading = false
      }, 1000)
    },

    // 地区四级联动接口
    /**
     * code: 地区code（查询所有省传0，其余查询该id所属的下级地区）
     * type: 0：查询省 1：查询市 2：查询县 3：查询街道
     */
    getAddress(code, type) {
      /* return apiServer.cascaderAddresses({
        code: code,
        type: type
      }); */
    },
  }
}
</script>

<style scoped lang="stylus">
@import './add'
</style>