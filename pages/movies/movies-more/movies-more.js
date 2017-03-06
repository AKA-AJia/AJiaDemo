var app = getApp();
var util = require("../../../utils/util.js")
Page({
  data: {
    movies: {},
    navigationTitle: "",
    moreUrl: "",
    loadIndex: 0,
    isEmpty: true,
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
    this.data.moreUrl = dataUrl;
    util.http(dataUrl, this.callBack);
    wx.showNavigationBarLoading();
  },

  // 上滑加载更多
  onScrollLower: function (event) {
    var loadingMoreUrl = this.data.moreUrl + "?start=" + this.data.loadIndex + "&count=20";
    util.http(loadingMoreUrl, this.callBack);
    wx.showNavigationBarLoading();
  },

  // 下拉加载更多
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.moreUrl +
      "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.loadIndex = 0;
    util.http(refreshUrl, this.callBack);
    wx.showNavigationBarLoading();
  },

  //点击电影item。跳转到电影详情
  onDetailTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId
    })
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

    //如果数据集不为空，追加新的数据
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      movies: totalMovies
    });

    this.data.loadIndex += 20;
    wx.hideNavigationBarLoading();
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle,
    })
  }
})