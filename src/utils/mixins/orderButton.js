import yDownload from "components/download"
import { Dialog, Toast } from 'vant'
import apiServer from 'api'

export default {
  components: {
    yDownload
  },

  data() {
    return {
      showDownload: false
    }
  },

  methods: {
    // 取消订单
    itemCancel(id) {
      this.masterNo = id
      this.showCancel = true
    },

    // 申请售后
    itemServicee() {
      this.showDownload = true
    },

    // 申请开票
    itemBallot() {
      this.showDownload = true
    },

    // 立即支付
    itemPay(id, price) {
      localStorage.orderNo = id
      this.$router.push({
        path: '/paymentList',
        query: {
          price: price
        }
      })
    },

    // 申请退款
    itemRefund() {
      this.showDownload = true
    },

    // 查看物流
    itemLogistics(orderNo) {
      // this.$router.push('/download')
      this.$router.push(`/order/express?orderNo=${orderNo}`)
    },

    // 评价晒单
    itemAssess(order, type) {
      if(type==1) order.goodsList = order.orderInfoVo[0].goodsList
      console.log(order,'order')
      this.$router.push({
        name: 'orderAssess',
        params: {
          orderInfo: order,
          userId: this.userId
        }
      })
    },

    // 删除订单
    itemDel(id) {
      Dialog.confirm({
        message: '确认删除此订单吗',
        confirmButtonColor: "#333333",
        cancelButtonColor: "#333333",
        className:'delete-order-dialog',
      }).then(async () => {
        await apiServer.orderDelete({
          orderNo: id
        })
        this.initList()
      })
    },

    itemDetail(order) {
      const orderCount=order.orderCount
      let orderId
      if(orderCount>1){
        orderId=order.masterNo
      }else{
        orderId=order.orderNo
      }
      this.$router.push({
        path: '/order/detail',
        query: {
          orderId: orderId
        }
      })
    },
  }
}