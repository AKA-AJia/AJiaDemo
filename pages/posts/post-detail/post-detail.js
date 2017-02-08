var postDatas = require('../../../data/data.js')
var app = getApp()

Page({
    data: {
        isPlaying: false
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
                iscollected: iscollected
            })
        } else {
            var collected_list = {};
            collected_list[postId] = false;
            wx.setStorageSync('collected_list', collected_list);
        }

        //根据全局音乐播放状态isPlayingMusic判断是否正在播放
        if (app.globalData.g_isPlayingMusic && app.globalData.g_isPlayingMusicId === postId) {
            this.setData({
                isPlaying: true
            })
        }

        this.setMusicListener();
    },

    //监听音乐总开关状态
    setMusicListener() {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            // callback
            that.setData({
                isPlaying: true
            })

            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_isPlayingMusicId = that.data.currentId;
        });

        wx.onBackgroundAudioPause(function () {
            // callback
            that.setData({
                isPlaying: false
            })

            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_isPlayingMusicId = null;
        })
    },

    //点击收藏
    onCollectTap: function (event) {
        //获取缓存中的收藏状态
        var collected_list = wx.getStorageSync('collected_list');
        var iscollected = collected_list[this.data.currentId];
        iscollected = !iscollected;
        collected_list[this.data.currentId] = iscollected;
        wx.setStorageSync('collected_list', collected_list);

        this.setData({
            iscollected: iscollected
        })

        //toast提醒
        wx.showToast({
            title: iscollected ? "收藏成功" : "取消收藏",
            duration: 1000,
        })
    },

    // 点击分享
    onShareTap: function (event) {
        wx.showActionSheet({
            itemList: [
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
    },

    //点击播放音乐
    onMusicTap: function (event) {
        var isPlaying = this.data.isPlaying;
        var currentId = this.data.currentId;
        var musicData = postDatas.postsList[currentId].music;
        if (isPlaying) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlaying: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: musicData.url,
                title: musicData.title,
                coverImgUrl: musicData.coverImg
            })
            this.setData({
                isPlaying: true
            })
        }
    }
})