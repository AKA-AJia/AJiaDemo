var app = getApp();
var util = require("../../../utils/util.js")
Page({
  data: {
    movies : {},
    navigationTitle: "",
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigationTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }

    util.http(dataUrl, this.callBack);
  },

  callBack: function (moviesData) {
    var movies = [];
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }

      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars)
      }

      movies.push(temp);
    }
    this.setData({
      movies : movies
    });
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle,
    })
  }
})