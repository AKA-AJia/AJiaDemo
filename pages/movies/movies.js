var app = getApp();
var util = require("../../utils/util.js")
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    isSearchFocus: false,
    isMovieListFocus: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var baseUrl = app.globalData.doubanBase;
    var inTheaters = baseUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoon = baseUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250 = baseUrl + "/v2/movie/top250" + "?start=0&count=3";
    //请求网络数据
    this.getMovieData(inTheaters, "inTheaters", "正在热映");
    this.getMovieData(comingSoon, "comingSoon", "即将上映");
    this.getMovieData(top250, "top250", "豆瓣Top250");
    wx.showNavigationBarLoading();
  },

  getMovieData(url, typeKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processMoviesData(res.data, typeKey, categoryTitle);
      },
      fail: function () {
      }
    })
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "movies-more/movies-more?category=" + category
    })
  },

  processMoviesData(moviesData, typeKey, categoryTitle) {
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

    // console.log(movies);
    var readyData = {};
    readyData[typeKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  onBindFocus: function (event) {
    this.setData({
      isSearchFocus: true,
      isMovieListFocus: false
    })
  },

  onBindConfirm: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieData(searchUrl, "searchKey", "");
    wx.showNavigationBarLoading();
  },

  onCancelTap: function (event) {
    this.setData({
      isSearchFocus: false,
      isMovieListFocus: true
    })
  }
})