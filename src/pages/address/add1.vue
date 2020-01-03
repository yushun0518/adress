<template>
  <div class="add-address">
    <!-- <y-header :title="'添加收货地址'" /> -->
    <div class="info">
      <div class="inputs">
        <span class="left">收货人</span>
        <div class="right">
          <input
            type="text"
            v-model="name"
            placeholder="姓名"
            placeholder-style="color:#999;font-size:16px;"
          />
        </div>
      </div>
      <div class="inputs">
        <span class="left">手机号码</span>
        <input type="tel" maxlength="11" v-model="mobilephone" placeholder="手机号" />
      </div>
      <div class="inputs">
        <span class="left">所在地区</span>
        <div class="sel_area" @click="showAddress=true">
          <span class="sel">{{addressTxt}}</span>
          <span class="arrow"></span>
        </div>
      </div>
      <div class="inputs area">
        <span class="left">详细地址</span>
        <textarea placeholder="请输入" v-model="address"></textarea>
      </div>
    </div>
    <div class="default">
      <span class="left">设为默认地址</span>
      <!-- <van-switch class="switch" v-model="isdefault"></van-switch> -->
      <van-switch class="switch" v-model="isdefault"  active-color="#45AB78" />
    </div>
    <div class="info">
      <div class="inputs tag_inputs" @click="showTag=true">
        <span class="left">地址标签</span>
        <div class="tag_add">
          <span class="txt">{{tagSelTxt}}</span>
          <span class="arrow"></span>
        </div>
      </div>
    </div>

    <van-popup
      v-model="showTag"
      round
      position="bottom"
      :style="{ height: '8rem' }"
      closeable
      @close="tagClose"
      @open="tagInput=''"
    >
      <div class="tag_wrapper">
        <h2 class="title">请选择地址标签</h2>
        <ul>
          <li
            v-for="(item, index) in tagList"
            :key="index"
            @click="tagIndex=index"
            :class="{'on':tagIndex==index}"
          >
            <input
              v-if="index==0"
              v-model="tagInput"
              ref="tagInput"
              type="text"
              placeholder="自定义标签，最多5个字"
            />
            {{item}}
          </li>
        </ul>
        <button class="tag_btn" @click="tagConfirm">确定</button>
      </div>
    </van-popup>

    <div v-if="$route.params.type == 'edit'">
      <button class="add_btn" @click="addConfirm">保存</button>
      <button class="add_btn del_btn" @click="delConfirm">删除</button>
    </div>
    <button v-else class="add_btn" @click="addConfirm">确认添加</button>
    <y-pannel ref="pannel" :info="addressInfo" @address="itemAddress" v-model="showAddress" />
  </div>
</template>

<script>
import yPannel from './pannel'
import { Toast, Dialog } from 'vant'
import { verifyEmpty, isPhone } from 'api/util'
export default {
  components: {
    yPannel
  },
  data() {
    return {
      isSave: true,
      isdefault: false, // 默认地址
      isNoCity: false,
      userid: '',
      name: '',
      mobilephone: '',
      address: '',
      municipality: [], // 直辖市
      title: '添加收货地址',
      showTag: false, //
      tagIndex: 0,
      tagList: ['', '家', '公司', '学校'],
      tagSelTxt: '',
      tagSelTxt: '',
      tagInput: '',
      isEdit: false,
      showAddress: false,

      province: '',
      addressObj: {},
      addressTxt: '',
      addressInfo: ''
    }
  },
  watch: {
    tagInput(val) {
      let reg = /^([\u4e00-\u9fa5]|[0-9]|[,]|[，]|[“]){0,200}$/
      if (!reg.test(val)) {
        Toast('自定义标签只可输入文字、数字和标点符号')
        return
      }
      if (val.length > 5) {
        this.tagInput = val.slice(0, 5)
      }
    },
    name(newVal, oldVal) {
      let reg = /^([\u4e00-\u9fa5]|[0-9]|[,]|[，]|[“]){0,200}$/
      if (!reg.test(newVal)) {
        this.name = oldVal
        Toast('收货人姓名只可输入文字、数字和标点符号')
        return
      }
    },

    address(newVal, oldVal) {
      let reg = /^([\u4e00-\u9fa5]|[0-9]|[,]|[，]|[“]){0,200}$/
      if (!reg.test(newVal)) {
        this.name = oldVal
        Toast('详细地址只可输入文字、数字和标点符号')
        return
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave) {
      next()
    } else {
      next(false)
      this.showConfirm(next)
    }
  },

  created() {
    this.userid = JSON.parse(localStorage.userInfo).info.userid
    this.editInfo()
  },

  methods: {
    itemAddress(obj) {
      this.addressObj = obj
      let { province, city, area, street = '' } = obj
      this.addressTxt = `${province} ${city} ${area} ${street}`
      this.showAddress = false
    },

    showConfirm(next) {
      this.$dialog
        .confirm({
          message: '是否保存本次编辑结果',
          confirmButtonText: '保存',
          confirmButtonColor: '#333333',
          cancelButtonText: '不保存',
          cancelButtonColor: '#333333',
          className: 'confrim-dialog'
        })
        .then(() => {
          // on confirm
          this.addConfirm()
        })
        .catch(() => {
          // on cancel
          next()
        })
    },

    isMunicipality(name) {
      let city = [
        '北京',
        '北京市',
        '上海',
        '上海市',
        '天津',
        '天津市',
        '重庆',
        '重庆市'
      ]
      if (city.includes(name)) return true
      return false
    },

    // 添加收货地址
    addConfirm() {
      if (
        verifyEmpty(
          this.name,
          '请输入收货人姓名',
          [2, 10],
          '收货人姓名长度需要在2-10个字之间'
        )
      )
        return
      if (!isPhone(this.mobilephone)) return
      if (verifyEmpty(this.province != '请选择', '省不能为空')) return
      if (verifyEmpty(this.city != '请选择', '市不能为空')) return
      if (verifyEmpty(this.area != '请选择', '县区不能为空')) return
      if (verifyEmpty(this.street != '请选择', '街道不能为空')) return
      if (
        verifyEmpty(
          this.address,
          '请填写详细地址',
          [5, 100],
          '详细地址长度需要在5-100个字之间'
        )
      )
        return
      let data = {
        userId: this.userid,
        name: this.name,
        isdefault: this.isdefault ? 1 : 0,
        mobilephone: this.mobilephone,
        address: this.address,
        tag: this.tagSelTxt
      }
      data = Object.assign(data, this.addressObj)

      let { type, info } = this.$route.params
      if (type == 'edit') {
        data = Object.assign(data, {
          id: info.id,
          tagId: info.tagId
        })
        apiServer.addressUpdate(data).then(res => {
          Toast(res.errorMsg)
          this.isSave = true
          setTimeout(() => {
            this.$router.back()
          }, 500)
        })
      } else {
        apiServer.addressCreate(data).then(res => {
          Toast(res.errorMsg)
          this.isSave = true
          setTimeout(() => {
            this.$router.back()
          }, 500)
        })
      }
    },

    // 删除收货地址
    delConfirm() {
      Dialog.confirm({
        message: '确定要删除此收货地址吗',
        confirmButtonText: '删除',
        // title: "提示",
        className: 'delete-address-dialog',
        confirmButtonColor: '#333333',
        cancelButtonColor: '#333333'
      })
        .then(() => {
          let { info } = this.$route.params
          apiServer
            .addressDelete({
              id: info.id
            })
            .then(res => {
              Toast(res.errorMsg)
              this.isSave = true
              setTimeout(() => {
                this.$router.back()
              }, 500)
            })
        })
        .catch()
    },

    // 编辑收货地址时调用的方法
    async editInfo() {
      let { type, info } = this.$route.params
      console.log(info, 'infofinljlkl')
      if (type == 'edit') {
        this.addressInfo = info
        let { province, city, area, street = '' } = info
        this.addressTxt = `${province} ${city} ${area} ${street}`
        this.title = '编辑收货地址'
        this.city = info.city
        this.cityid = info.cityId
        this.area = info.area
        this.areaid = info.areaId
        this.street = info.street
        this.streetid = info.streetId
        this.name = info.name
        this.mobilephone = info.mobilephone
        this.province = info.province
        this.provinceid = info.provId
        this.address = info.address
        this.tagSelTxt = info.tag
        this.isdefault = info.isdefault == 1 ? true : false
        this.$nextTick(() => {
          this.isSave = true
        })
      } else {
        this.isSave = false
      }
    },

    // 地址标签弹层打开时
    tagClose() {
      this.tagIndex = 0
    },

    tagConfirm() {
      if (this.tagIndex == 0) {
        this.tagSelTxt = this.tagInput
      } else {
        this.tagSelTxt = this.tagList[this.tagIndex]
      }
      this.showTag = false
      console.log(this.tagList[this.tagIndex])
    }
  }
}
</script>

<style lang="stylus">
.delete-address-dialog
  .van-dialog__message
    font-size 0.32rem
    color #333
  .van-button__text
    font-size 0.32rem
</style>
<style scope  lang="stylus">
@import './add'
</style>
