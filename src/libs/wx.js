var share2_link = "";
var share_link = ""
if (share_link != ""){
	share2_link = share_link;
} else {
	share2_link = window.location.href;
}
var appid = "wx751f847875e116d7";

wx.ready(function(){
wx.updateAppMessageShareData({
  title: share_title,
  desc: share_desc,
  link: share2_link,
  imgUrl: share_imgurl,

  success: function (res) {
  },
  cancel: function (res) {
  },
  fail: function (res) {
  }
});

wx.updateTimelineShareData({
  title: share_title,
  link: share2_link,
  imgUrl: share_imgurl,

  success: function (res) {
  },
  cancel: function (res) {
  },
  fail: function (res) {
  }
});
});

function start_wx_sign()
{
	//console.log("start_wx_sign");
	var u = location.href.split('#')[0];
	u = encodeURIComponent(u);
	$.get
	(
		"/tools/getwxsign/?link=" + u,
		{},
		function(msg)
		{
			 if (msg.result == 0)
			 {
				wx.config({
				  debug: false,
				  appId: appid,
				  timestamp: msg.timestamp,
				  nonceStr: msg.nonceStr,
				  signature: msg.signature,
				  jsApiList: [
					'updateAppMessageShareData',
					'updateTimelineShareData',
					'chooseImage',
					'uploadImage'
				  ],
				   success: function (res) {
				  },
				   fail: function (res) {
					//alert(JSON.stringify(res));
				  }
				});
			 }
		},
		"json"
	);
}

function wx_image_from_album()
{
	wx.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album'],
		success: function (res) {
			var localIds = res.localIds;
			upload_wx_image(localIds[0]);
		}
	});
}

function wx_image_from_camera()
{
	wx.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['camera'],
		success: function (res) {
			var localIds = res.localIds;
			upload_wx_image(localIds[0]);
		}
	});
}

//上传图片到微信服务器
function upload_wx_image(localIds)
{
	wx.uploadImage({
		localId: localIds,
		isShowProgressTips: 1,
		success: function (res) {
			var serverId = res.serverId;
			add_wx_media(serverId,localIds);
		}
	});
}

// 调用微信支付
function start_wx_pay(msg){
	// console.log("start_wx_pay",msg);
	wx.chooseWXPay({
		timestamp: msg.timeStamp,
		nonceStr: msg.nonceStr,
		package: msg.package,
		signType: 'MD5',
		paySign: msg.sign,
		success: function (res) {
		// 支付成功后的回调函数
		},fail: function (res) {
			console.log(JSON.stringify(res));
		}
	});
}

module.exports = {
	start_wx_pay
}
