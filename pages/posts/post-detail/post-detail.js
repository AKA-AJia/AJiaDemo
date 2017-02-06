var postDatas = require('../../../data/data.js')

Page({
    data: {

    },

    onLoad: function (options) {
        var postId = options.id;
        this.data.currentId = postId;
        var postDetailData = postDatas.postsList[postId];

        this.setData({
            postDetailData: postDetailData
        })

        var collected_list = wx.getStorageSync('collected_list')
        if (collected_list) {
            var iscollected = collected_list[postId]
            this.setData({
                iscollected : iscollected
            })
        } else {
            var collected_list = {};
            collected_list[postId] = false;
            wx.setStorageSync('collected_list', collected_list);
        }
    },


    onCollectTap:function(event){
        //获取缓存中的收藏状态
        var collected_list = wx.getStorageSync('collected_list');
        var iscollected = collected_list[this.data.currentId];
        iscollected = !iscollected;
        collected_list[this.data.currentId] = iscollected;
        wx.setStorageSync('collected_list', collected_list);

        this.setData({
            iscollected:iscollected
        })

        //toast提醒
        wx.showToast({
            title:iscollected?"收藏成功":"取消收藏",
            duration:1000,
        })
    },

    onShareTap:function(event){
        wx.showActionSheet({
            itemList:[
                "分享到微信",
                "分享朋友圈",
                "分享到到QQ",
                "分享到微博"
            ],

            // success(res){
            //     wx.showModal({
            //         title:"分享",
            //         content:"分享成功",
            //         comfirmText:"确认",
            //         itemColor:"#405f80",
            //     })
            // }
        })
    }
})