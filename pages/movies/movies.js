var app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var baseUrl = app.globalData.doubanBase;
    var inTheaters = baseUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoon = baseUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250 = baseUrl + "/v2/movie/top250" + "?start=0&count=3";
    //请求网络数据
    this.getMovieData(inTheaters);
    // this.getMovieData(comingSoon);
    // this.getMovieData(top250);
  },

  getMovieData(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        // success
        that.processMoviesData(res.data);
      },
      fail: function () {
        // fail
      }
    })
  },

  processMoviesData(moviesData) {
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
        movieId: subject.id
      }

      movies.push(temp);
    }

    console.log(movies);

    this.setData({
      movies: movies
    })
  }
})