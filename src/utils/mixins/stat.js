/**
 * 埋点操作
 */
import apiServer from 'api'

export default {
    data(){
        return{
            userId: 'null',
            phone: 'null',
            from:'null',
            pl: "",
            ip: "null"
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm => {
            if(from.path !== '/'){
                vm.from = location.origin + from.path;
            }
        })
    },
    mounted(){
        this.pl = this.browserinfo();
        if (returnCitySN) {
            this.ip = returnCitySN["cip"];
        }
    },
    methods:{
        /**
         * 
         * @param {*} type 埋点事件类型
         */
        LogClick({type,bannerId='null',typeId='null',couponId='null',url='null',categoryId='null',homeGoodsId='null',goodsId='null',behavior='null'}){
            let time = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
            if(localStorage.userInfo){
                let userInfo = JSON.parse(localStorage.userInfo)
                this.userId = userInfo.info.userId;
                this.phone = userInfo.info.mobilephone;
            }
            switch(type){
                case 'getMessageCode_click':
                case 'getMessageCoderegist_click': //登录注册 埋点
                    apiServer.collectingLogin({
                        subtime: time, //时间
                        userId: this.userId, //userId
                        phone: this.phone, //手机号
                        from: this.from,//来源地址
                        event: type, //事件
                        pl: this.pl, //系统
                        IP: this.ip, //IP地址
                        deviceId: "null",//设备
                        sessionId: "null", //SessionID
                        openId: "null", //微信登录时的微信openId
                        appVer: "null", //app 版本
                        osVer: "null", //发布的渠道
                    })
                break
                default:
                    apiServer.collectingClick({
                        subtime: time, //时间
                        userId: this.userId, //userId
                        phone: this.phone, //手机号
                        event : type, //事件
                        bannerId:bannerId, //Banner页ID
                        typeId:typeId,//Typeid为消息列表页-优惠促销列表页跳转的类型(如：商品详情，活动卖场h5，站外链接，落地页)，如果没有值，可传空值
                        couponId:couponId, //卡券id 根据卡券的面值记录
                        url:url, //记录易捷头条-公告、易捷头条-公告文章内的url地址，如果没有值，可传空值
                        categoryId:categoryId, //类目导航ID 记录类目点击的类目导航的id
                        homeGoodsId:homeGoodsId, //首页商品ID
                        goodsId:goodsId, //加入购物车商品ID
                        behavior:behavior,//记录用户行为 包含浏览 收藏 购物车 订单 评分，表示如下1：浏览 ，2：收藏（暂没有这个），:3：购物车，4：订单，5：评分 ，如果没有值，可传空值
                        deviceId: "null",//设备
                        openId: "null", //微信登录时的微信openId
                    })
                break;
            }
        },
        /*获取浏览器类型*/
        browserinfo() {
            let br = window.navigator.appVersion;
            let info, os;
            if (br.indexOf("Chrome") > 0) {
                info = "Chrome";
            }
            if (br.indexOf("UCBrowser") > 0) {
                info = "UCBrowser";
            }
            if (br.indexOf("MQQBrowser") > 0) {
                info = "MQQBrowser";
            }
            if (br.indexOf("MicroMissenger") > 0) {
                info = "MicroMissenger";
            }
            if (br.indexOf("MSIE") > 0) {
                info = "MSIE";
            }
            if (br.indexOf('Windows') > 0) {
                os = "Windows";
            }
            if (br.indexOf('Mac OS') > 0) {
                os = "MacOS";
            }
            if (br.indexOf('Windows Phone') > 0) {
                os = "WindowsPhone";
            }
            if (br.indexOf('Android') > 0 || br.indexOf('Linux') > 0) {
                os = "Android";
            }
            if (br.indexOf('iPhone') > 0) {
                os = "iPhone";
            }
            if (br.indexOf('iPad') > 0) {
                os = "iPad";
            }

            return (info ? info : '') + '|' + (os ? os : '');
        }
    }
}