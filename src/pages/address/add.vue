<template>
  <div class="add-address" v-wechat-title="title">
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
          <!-- <img src="http://yushun518.top/yijie/images/phone_b.png" /> -->
        </div>
      </div>
      <div class="inputs">
        <span class="left">手机号码</span>
        <input type="tel" maxlength="11" v-model="mobilephone" placeholder="手机号" />
      </div>
      <div class="inputs">
        <span class="left">所在地区</span>
        <div class="sel_area" @click="showProvince = true">
          <span class="sel">{{province}}</span>
          <span class="arrow"></span>
        </div>
      </div>
      <div class="inputs">
        <span class="left">市</span>
        <div class="sel_area" @click="citySelect(province)">
          <span class="sel">{{city}}</span>
          <span class="arrow"></span>
        </div>
      </div>
      <div class="inputs">
        <span class="left">区县</span>
        <div class="sel_area" @click="areaSelect">
          <span class="sel">{{area}}</span>
          <span class="arrow"></span>
        </div>
      </div>
      <div class="inputs">
        <span class="left">街道</span>
        <div class="sel_area" @click="streetSelect">
          <span class="sel">{{street}}</span>
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
      <mt-switch v-model="isdefault"></mt-switch>
    </div>
    <div class="info">
      <div class="inputs tag_inputs" @click="showTag=true,noScroll()">
        <span class="left">地址标签</span>
        <div class="tag_add">
          <span class="txt">{{tagSelTxt}}</span>
          <span class="arrow"></span>
        </div>
      </div>
    </div>

    <van-popup v-model="showProvince" position="bottom">
      <van-picker
        show-toolbar
        title="请选择省"
        :columns="provinceNameList"
        @cancel="onProvinceCancel"
        @confirm="onProvinceConfirm"
      />
    </van-popup>

    <van-popup v-model="showCity" position="bottom">
      <van-picker
        show-toolbar
        title="请选择市"
        :columns="cityNameList"
        @cancel="onCityCancel"
        @confirm="onCityConfirm"
      />
    </van-popup>

    <van-popup v-model="showArea" position="bottom">
      <van-picker
        show-toolbar
        title="请选择区县"
        :columns="areaNameList"
        @cancel="onAreaCancel"
        @confirm="onAreaConfirm"
      />
    </van-popup>

    <van-popup v-model="showStreet" position="bottom">
      <van-picker
        show-toolbar
        title="请选择街道"
        :columns="streetNameList"
        @cancel="onStreetCancel"
        @confirm="onStreetConfirm"
      />
    </van-popup>

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
            <!-- <input
              v-if="index==0"
              v-model="tagInput"
              ref="tagInput"
              type="text"
              placeholder="自定义标签，最多5个字"
            /> -->
            <van-field ref="tagInput" v-if="index==0" v-model="tagInput" placeholder="自定义标签，最多5个字" />
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
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { verifyEmpty, isPhone } from "api/util";
export default {
  data() {
    return {
      isSave: true,
      isdefault: false, // 默认地址
      isNoCity: false,

      province: "请选择", // 省名称
      provinceid: "", // 省份id
      showProvince: false,
      provinceList: [],
      provinceNameList: [],

      city: "请选择", // 市名称
      cityid: "", // 市id
      showCity: false,
      cityList: [],
      cityNameList: [],

      area: "请选择", // 县名称
      areaid: "", // 县id
      showArea: false,
      areaList: [],
      areaNameList: [],

      street: "请选择", // 街道名称
      streetid: "", // 街道id
      showStreet: false,
      streetList: [],
      streetNameList: [],
      userid: "",

      name: "",
      mobilephone: "",
      address: "",
      municipality: [], // 直辖市
      title: "添加收货地址",
      showTag: false, //
      tagIndex: 0,
      tagList: ["", "家", "公司", "学校"],
      tagSelTxt: "",
      tagSelTxt: "",
      tagInput: "",
      isEdit: false
    };
  },
  watch: {
    tagInput(val) {
      let reg = /^([\u4e00-\u9fa5]|[0-9]|[,]|[，]|[“]){0,200}$/;
      if (!reg.test(val)) {
        Toast("自定义标签只可输入文字、数字和标点符号");
        return;
      }
      if (val.length > 5) {
        this.tagInput = val.slice(0, 5);
      }
    },
    name(newVal,oldVal) {
      let reg = /^([\u4e00-\u9fa5]|[0-9]|[,]|[a-z]|[A-Z]|[，]|[“]){0,200}$/;
      if (!reg.test(newVal)) {
        this.name = oldVal
        Toast("收货人姓名只可输入文字、数字和标点符号");
        return;
      }
    },

    address(newVal,oldVal) {
      let reg = /^([\u4e00-\u9fa5]|[0-9]|[,]|[a-z]|[A-Z]|[，]|[“]){0,200}$/;
      if (!reg.test(newVal)) {
        this.address = oldVal
        Toast("详细地址只可输入文字、数字和标点符号");
        return;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave) {
      next();
    } else {
      // next(false)
      this.showConfirm(next);
    }
  },

  created() {
    this.userid = JSON.parse(localStorage.userInfo).info.userid;
    this.getProvince();
    this.editInfo();
  },

  methods: {
    showConfirm(next) {
      this.$dialog
        .confirm({
          message: "是否保存本次编辑结果",
          confirmButtonText: "保存",
          confirmButtonColor: "#333333",
          cancelButtonText: "不保存",
          cancelButtonColor: "#333333",
          className: "confrim-dialog"
        })
        .then(() => {
          // on confirm
          this.addConfirm();
        })
        .catch(() => {
          // on cancel
          next();
        });
    },

    isMunicipality(name) {
      let city = [
        "北京",
        "北京市",
        "上海",
        "上海市",
        "天津",
        "天津市",
        "重庆",
        "重庆市"
      ];
      if (city.includes(name)) return true;
      return false;
    },
    // 选择市
    citySelect(flag) {
      
      if (this.isNoCity) {
        return;
      }
      if(this.cityList.length==0){
        this.$toast('请先选择省')
        return
      }
      this.showCity = true;
    },
    areaSelect(){
      if(this.areaList.length==0){
        this.$toast('请先选择市')
        return
      }
      this.showArea = true
    },
    streetSelect(){
      if(this.streetList.length==0){
        this.$toast('请先选择县区')
        return
      }
      this.showStreet = true
    },
    // 省市县弹窗
    onProvinceConfirm(value, index) {
      this.province = value;
      this.provinceid = this.provinceList[index].code;
      const provinceName = this.provinceList[index].name;
      this.isNoCity = this.isMunicipality(provinceName);
      if (this.isNoCity) {
        this.city = provinceName;
        this.cityid = this.provinceid;
      } else {
        this.city = "请选择";
        this.cityNameList = [];
        this.cityList=[]
        this.cityid = "";
      }
      this.showProvince = false;
      this.area = "请选择";
      this.areaNameList = [];
      this.areaList=[]
      this.areaid = "";
      this.street = "请选择";
      this.streetNameList = [];
      this.streetList=[]
      this.streetid = "";
      this.getCity(this.provinceid);
      this.isEdit = true;
    },
    onProvinceCancel() {
      this.showProvince = false;
    },

    onCityConfirm(value, index) {
      this.city = value;
      this.cityid = this.cityList[index].code;
      this.showCity = false;
      this.getArea(this.cityid);
      this.area = "请选择";
      this.areaNameList = [];
      this.areaList=[]
      this.areaid = "";
      this.street = "请选择";
      this.streetNameList = [];
      this.streetList=[]
      this.streetid = "";
    },
    onCityCancel() {
      this.showCity = false;
    },

    onAreaConfirm(value, index) {
      this.area = value;
      this.areaid = this.areaList[index].code;
      this.showArea = false;
      if (this.isNoCity) {
        this.getStreet(this.areaid, 2);
      } else {
        this.getStreet(this.areaid);
      }
      this.street = "请选择";
      this.streetid=""
      this.streetList = [];
    },
    onAreaCancel() {
      this.showArea = false;
    },

    onStreetConfirm(value, index) {
      this.street = value;
      this.streetid = this.streetList[index].code;
      this.showStreet = false;
    },
    onStreetCancel() {
      this.showStreet = false;
    },

    // 获取省
    async getProvince() {
      let response = await this.getAddress(0, 0);
      response.data.map((item, index) => {
        this.provinceList.splice(index, 1, item);
        this.provinceNameList.splice(index, 1, item.name);
      });
    },

    // 获取市
    async getCity(id) {
      let response = await this.getAddress(id, 1);
      if (this.isNoCity) {
        response.data.map((item, index) => {
          this.areaList.splice(index, 1, item);
          this.areaNameList.splice(index, 1, item.name);
        });
      } else {
        response.data.map((item, index) => {
          this.cityList.splice(index, 1, item);
          this.cityNameList.splice(index, 1, item.name);
        });
      }
    },

    // 获取县
    async getArea(id, type) {
      let response = await this.getAddress(id, type || 2);
      if (this.isNoCity) {
        response.data.map((item, index) => {
          this.streetList.splice(index, 1, item);
          this.streetNameList.splice(index, 1, item.name);
        });
      } else {
        response.data.map((item, index) => {
          this.areaList.splice(index, 1, item);
          this.areaNameList.splice(index, 1, item.name);
        });
      }
    },

    // 获取街道
    async getStreet(id, type) {
      let response = await this.getAddress(id, type || 3);
      response.data.map((item, index) => {
        this.streetList.splice(index, 1, item);
        this.streetNameList.splice(index, 1, item.name);
      });
    },

    // 添加收货地址
    addConfirm() {
      if (
        verifyEmpty(
          this.name,
          "请输入收货人姓名",
          [2, 10],
          "收货人姓名长度需要在2-10个字之间"
        )
      )
        return;
      if (!isPhone(this.mobilephone)) return;
      if (verifyEmpty(this.province != "请选择", "省不能为空")) return;
      if (verifyEmpty(this.city != "请选择", "市不能为空")) return;
      if (verifyEmpty(this.area != "请选择", "县区不能为空")) return;
      if (verifyEmpty(this.street != "请选择", "街道不能为空")) return;
      if (
        verifyEmpty(
          this.address,
          "请填写详细地址",
          [5, 100],
          "详细地址长度需要在5-100个字之间"
        )
      )
        return;
      let data = {
        userId: this.userid,
        name: this.name,
        isdefault: this.isdefault ? 1 : 0,
        mobilephone: this.mobilephone,
        province: this.province,
        provId: this.provinceid,
        address: this.address,
        tag: this.tagSelTxt
      };

      if (this.isNoCity) {
        data = Object.assign(data, {
          city: this.area,
          cityId: this.areaid,
          area: this.street,
          areaId: this.streetid,
          street: "",
          streetId: ""
        });
      } else {
        data = Object.assign(data, {
          city: this.city,
          cityId: this.cityid,
          area: this.area,
          areaId: this.areaid,
          street: this.street,
          streetId: this.streetid
        });
      }

      let { type, info } = this.$route.params;
      if (type == "edit") {
        data = Object.assign(data, {
          id: info.id,
          tagId: info.tagId
        });
        apiServer.addressUpdate(data).then(res => {
          Toast(res.errorMsg);
          this.isSave=true
          setTimeout(() => {
            this.$router.back();
          }, 500);
        });
      } else {
        apiServer.addressCreate(data).then(res => {
          Toast(res.errorMsg);
          this.isSave=true
          setTimeout(() => {
            this.$router.back();
          }, 500);
        });
      }
    },

    // 删除收货地址
    delConfirm() {
      Dialog.confirm({
        message: "确定要删除此收货地址吗",
        confirmButtonText: "删除",
        // title: "提示",
        className:'delete-address-dialog',
        confirmButtonColor: "#333333",
        cancelButtonColor: "#333333",
      })
        .then(() => {
          let { info } = this.$route.params;
          apiServer
            .addressDelete({
              id: info.id
            })
            .then(res => {
              Toast(res.errorMsg);
              this.isSave=true
              setTimeout(() => {
                this.$router.back();
              }, 500);
            });
        })
        .catch();
    },

    // 编辑收货地址时调用的方法
    editInfo() {
      let { type, info } = this.$route.params;
      if (type == "edit") {
        this.isEdit = true;
        this.isNoCity = this.isMunicipality(info.province);
        this.title = "编辑收货地址";
        this.getCity(info.provId);
        this.getArea(info.cityId);
        if (this.isNoCity) {
          // this.getStreet(info.areaId, 2);
          this.city = info.province;
          this.cityid = info.provId;
          this.area = info.city;
          this.areaid = info.cityId;
          this.street = info.area;
          this.streetid = info.areaId;
        } else {
          this.getStreet(info.areaId);
          this.city = info.city;
          this.cityid = info.cityId;
          this.area = info.area;
          this.areaid = info.areaId;
          this.street = info.street;
          this.streetid = info.streetId;
        }
        this.name = info.name;
        this.mobilephone = info.mobilephone;
        this.province = info.province;
        this.provinceid = info.provId;
        this.address = info.address;
        this.tagSelTxt = info.tag;
        this.isdefault = info.isdefault == 1 ? true : false;
        this.$nextTick(() => {
          this.isSave = true;
        });
      } else {
        this.isSave = false;
      }
    },

    // 地区四级联动接口
    /**
     * code: 地区code（查询所有省传0，其余查询该id所属的下级地区）
     * type: 0：查询省 1：查询市 2：查询县 3：查询街道
     */
    getAddress(code, type) {
      return apiServer.cascaderAddresses({
        code: code,
        type: type
      });
    },

    // 地址标签弹层打开时
    tagClose() {
      this.tagIndex = 0;
    },

    tagConfirm() {
      if (this.tagIndex == 0) {
        this.tagSelTxt = this.tagInput;
      } else {
        this.tagSelTxt = this.tagList[this.tagIndex];
      }
      this.showTag = false;
      this.canScroll()
    }
  }
};
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
