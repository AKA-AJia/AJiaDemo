var postDatas = require('../../../data/data.js')

Page({
    data: {

    },

    onLoad: function (options) {
        var postId = options.id;
        var postDetailData = postDatas.postsList[postId];

        this.setData({
            postDetailData: postDetailData
        });
    }
})