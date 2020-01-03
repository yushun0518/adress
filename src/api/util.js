import { Toast } from 'vant'
import Vue from 'vue'
import CryptoJS from 'crypto-js'
// 获取地址栏参数
export function UrlSearch(url) {
  let name,
    value,
    str = url||location.href,
    num = str.indexOf('?') //取得整个地址栏
  str = str.substr(num + 1) //取得所有参数 stringvar.substr(start [, length ]
  let arr = str.split('&') //各个参数放到数组里
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=')
    if (num > 0) {
      name = arr[i].substring(0, num)
      value = arr[i].substr(num + 1)
      //this[name] = value;
      obj[name] = value
    }
  }
  this.obj = obj
}

// 判断是否微信浏览器
export function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true // 是微信端
  } else {
    return false
  }
}

// 判断是否苹果设备
export function isIos() {
  var isIphone = navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)
  if (isIphone) {
    return true
  } else {
    return false
  }
}

// 手机号码验证
export function isPhone(val, ele, type) {
  let tel = /^0\d{2,3}-?\d{7,8}$/
  let phone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
  let way
  if (type) {
    way = tel.test(val) || phone.test(val)
  } else {
    way = phone.test(val)
  }
  if (way) {
    return true
  } else {
    ele && ele.focus()
    Toast({
      message: '请输入11位手机号码',
      position: 'middle'
    })
    return false
  }
}

/**
 * 隐藏号码中间部分
 * @param {String} phone 原始号码
 * @param {Number} firstNum 要保留的开始号码的长度 例如想输出 131****1233  则为  3
 * @param {Number} endNum 要保留的结束号码的长度 例如想输出 131****1233  则为  4
 * @param {Number} starNum  中间要显示几个*号
 * 例如想输出 131****1233  则参数为  原始号码,3,4,4,这里3,4,4为默认参数可以只输入第一个参数
 * 例如想输出 1311******1233  则参数为  原始号码,4,4,6
 */
export function showPhone(phone, firstNum=3, endNum=4, starNum=4) {
  const length = phone.length - endNum - firstNum
  const reg = new RegExp(`^(\\d{${firstNum}})\\d{${length}}(\\d+)`)
  const star = new Array(starNum).fill('*').join('')
  return phone.replace(reg,`$1${star}$2`)
}

// 验证必输项
export const verifyEmpty = (item, text, len, tip) => {
  if (!item) {
    Toast(text)
    return true
  }
  if (len) {
    let _len = item.length
    if (_len<len[0] || _len>len[1]) {
      Toast(tip)
      return true
    }
  }
}

export function getUrlParam(name) {
  //封装方法
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg) //匹配目标参数
  if (r != null) return unescape(r[2])
  return null //返回参数值
}

// 时间差 天数与小时数 第一个参数与第二个参数的时间差
export function dateMinus(date1, date2, type) {
  const sDate = new Date(date1.replace(/-/g,'/'))
  const nDate = new Date(date2 || new Date())
  const times = sDate.getTime() - nDate.getTime()
  let second = parseInt(times / 1000)
  let hours = parseInt(times / (1000 * 3600))  // 总小时数
  let day = parseInt(hours / 24) // 天数
  let hour = hours%24
  if (type == 'second') {
    return second
  }
  return `${day}天${hour}小时`
}

// AES加密
export const aes = {
  //加密
  encrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : 'abcdefgabcdefg12'
    var key = CryptoJS.enc.Utf8.parse(keyStr) //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  },
  //解密
  decrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : 'abcdefgabcdefg12'
    var key = CryptoJS.enc.Utf8.parse(keyStr) //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }
}

// urlencode
export function urlencode (str) {
  str = (str + '').toString();

  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

// urldecode
export function urldecode (str) {
  str = (str + '').toString();

  return decodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

export function IdentityCodeValid(code, ele) {
  let vm = this
  var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
  var tip = "";
  var pass= true;

  if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
    tip = "身份证号格式错误";
    pass = false;
  }

  else if(!city[code.substr(0,2)]){
    tip = "身份证地址编码错误";
    pass = false;
  }
  else{
    //18位身份证需要验证最后一位校验位
    if(code.length == 18){
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++)
      {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if(parity[sum % 11] != code[17]){
        tip = "身份证校验位错误";
        pass =false;
      }
    }
  }
  if(!pass) {
    Toast(tip)
  }
  return pass;
}

// 将base64转换为blob
export function convertBase64UrlToBlob(urlData) {
  var arr = urlData.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export function blobToFile(theBlob, fileName){
                
 /*  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName; */
  return new File([theBlob],fileName,{lastModifiedDate:new Date()});
}

// 压缩图片
export function compressImage(path, config, callback) {
  return new Promise((resolve, reject) => {
    var img = new Image()
    img.src = path.content
    img.onload = function() {
      var that = this
      var w = that.width
      var h = that.height
      var scale = w / h
      w = config.width || config.height * scale
      h = config.height || config.width / scale
      var quality = 0.1 // 默认图片质量为0.7
      // 生成canvas
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      // 创建属性节点
      var anw = document.createAttribute('width')
      anw.nodeValue = w
      var anh = document.createAttribute('height')
      anh.nodeValue = h
      canvas.setAttributeNode(anw)
      canvas.setAttributeNode(anh)
      ctx.drawImage(that, 0, 0, w, h)
      if (config.quality && config.quality <= 1 && config.quality > 0) {
        quality = config.quality
      }
      var base64 = canvas.toDataURL('image/*', quality)
      var blob = convertBase64UrlToBlob(base64)
      var _file = blobToFile(blob, path.file.name)
      // 回调函数返回base64的值，也可根据自己的需求返回blob的值
      resolve(_file)
    }
  })
}

export function shareUserid() {
  let userid = sessionStorage.parentId
  return userid ? userid : 'noshare'
}

