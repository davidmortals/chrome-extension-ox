var card = "<div class='image'><div class='score'></div></div><div class='test'></div><div class='product-info'><h1 class='title'></h1><p class='vote-count'></p></div><div class='overview'><p class='release-date'></p><div class='trailer-button'>Watch Trailer</div></div>";
var review = "<a class='backdrop-wrapper' target='_blank'><img class='backdrop'/><div class='colored-shadow'></div><div class='score'></div></a><div class='bottom'><div class='title'></div><div class='caption'></div></div><div class='actions-bar'><a class='user' target='_blank'><img class='user-avatar' /><div class='user-name'></a></div><div class='time-ago'></div></div>";
var page = 1;
var apiKey = "94a2f36cd4e27626b6a7a07766a76196";
var loaded_images_count = 0;
var rotate = 0;

function showOverview() {
  $(this).addClass('active');
}

function hideOverview() {
  $(this).removeClass('active');
}

function showCard() {
  $(this).closest('.product-card').addClass('is-loaded')
}

function showReview() {
  $(this).closest('.review-card').addClass('is-loaded')
}

function checkType() {
  if ($('#load-movies').hasClass('active')) {
    return 'movie'
  }
  if ($('#load-tv-shows').hasClass('active')) {
    return 'tv'
  }
  if ($('#load-games').hasClass('active')) {
    return 'game'
  }
}

function showTrailer() {
  $('#custom-modal-container').addClass('video-modal');
  $('body').addClass('.modal-active');
  var externalId = $(this)[0].id
  var type = checkType()
  var videoUrl
  if (type === 'game') {
    videoUrl = 'https://api.raterfox.com/api/api/v1/products/' + externalId + '/videos';
  } else {
    videoUrl = 'https://api.themoviedb.org/3/' + type + '/' + externalId + '?api_key=' + apiKey + '&append_to_response=videos';
  }
  $.getJSON(videoUrl, function (data) {
    var youTube = "https://www.youtube.com/embed/";
    var video = data.videos === undefined ? data.data[0].videos[0] : data.videos.results[0]
    if (video.site === undefined || video.site === "YouTube") {
      var videoId = video.key || video.video_id
      $('.custom-modal').html("<div class='embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src=" + youTube + videoId + "?autoplay=1 html5=1' frameborder='0'></iframe></div>");
    }
  });
}

function checkUrlType() {
  if ($('#load-movies').hasClass('active')) {
    return '1'
  }
  if ($('#load-tv-shows').hasClass('active')) {
    return '2'
  }
  if ($('#load-games').hasClass('active')) {
    return '3'
  }
}

function buildCard(i, results) {
  div = document.createElement('div');
  div.id = 'product_' + page + '_' + i;
  div.className = 'product-card'
  $('#products').append(div);
  movieCard = $('#products').find('#product_' + page + '_' + i)
  movieCard.html(card);
  movieCard.find('.image').append("<img src=" + results.data[i].medium_backdrop_url + ">")
  movieCard.find('.image img')[0].addEventListener('load', showCard);
  movieCard.find('.image')
  if (results.data[i].vote_average > 0) {
    movieCard.find('.score').html(results.data[i].vote_average)
  } else {
    movieCard.find('.score').remove()
  }
  movieCard.find('.title').html(results.data[i].title)
  movieCard.find('.release-date').html(results.data[i].release_date.substring(0,4))
  movieCard.find('.vote-count').html('Votes: ' + results.data[i].vote_count)
  movieCard.find('.overview').append(results.data[i].overview)
  if (results.data[i].product_type === 3) {
    movieCard.find('.trailer-button')[0].id = results.data[i].igdb_id
  } else {
    movieCard.find('.trailer-button')[0].id = results.data[i].tmdb_id
  }
  movieCard.find('.trailer-button')[0].addEventListener('click', showTrailer);
  movieCard[0].addEventListener('click', showOverview);
  movieCard[0].addEventListener('mouseleave', hideOverview);
}

function loadProducts(query) {
  urlType = checkUrlType()
  url = 'https://api.raterfox.com/api/api/v1/products?product_type=' + urlType + '&page=' + page;
  if (query == undefined) {
  } else if (query == '') {
    page = 1
    $('#products').html('');
    url = 'https://api.raterfox.com/api/api/v1/products?product_type=' + urlType + '&page=' + page;
  } else {
    $('#products').html('');
    url = 'https://api.raterfox.com/api/api/v1/products?product_type=' + urlType + '&page=' + page + '&query=' + query;
  }
  return $.getJSON(url, function(results) {
    for (var i = 0; i < results.data.length; i++) {
      buildCard(i, results)
    }
  });
}

function loadMoreProducts() {
  if (page == 1) {
    page += 1
    loadProducts();
  }
}

function loadMoreReviews() {
  if (page == 1) {
    page += 1
    loadReviews();
  }
}

function buildReview(i, results) {
  div = document.createElement('div');
  div.id = 'review_' + page + '_' + i;
  div.className = 'review-card'
  $('#products').append(div);
  movieCard = $('#products').find('#review_' + page + '_' + i)
  movieCard.html(review);
  movieCard.find('a.backdrop-wrapper')[0].href = "https://raterfox.com"
  movieCard.find('.backdrop-wrapper img.backdrop')[0].src = results.data[i].product.medium_backdrop_url
  movieCard.find('.backdrop-wrapper .colored-shadow')[0].style.backgroundImage = "url(" + results.data[i].product.medium_backdrop_url + ")"
  movieCard.find('.backdrop-wrapper img')[0].addEventListener('load', showReview);
  movieCard.find('.score').html(results.data[i].score)
  movieCard.find('.title').html(results.data[i].product.title)
  movieCard.find('.caption').html(results.data[i].stripped_caption)
  movieCard.find('.actions-bar img')[0].src = results.data[i].user.avatar_url
  movieCard.find('.actions-bar a.user')[0].href = "https://raterfox.com"
  movieCard.find('.actions-bar .user-name').html(results.data[i].user.user_name)
  movieCard.find('.actions-bar .time-ago').html(results.data[i].time_ago)
  movieCard.find('.caption').showMore({
    minheight: 75,
    buttontxtmore: "Read more",
    buttontxtless: "Read less",
  });
}

function loadReviews() {
  url = 'https://api.raterfox.com/api/api/v1/browse_posts?page=' + page;
  return $.getJSON(url, function(results) {
    for (var i = 0; i < results.data.length; i++) {
      buildReview(i, results)
    }
  });
}

function showBackgroundImage(path) {
  $('.body-wrapper').addClass('first-load')
  $('<img/>').attr('src', path).on('load', function() {
    $(this).remove();
    $('.body-wrapper.first-load').css('background-image', 'url(' + path + ')');
    $('.background-overlay').addClass('loaded');
    $('.info-block').addClass('loaded');
    $('.movie-info-card').addClass('loaded');
  });
}


function showTrailerOnFirstPage(tmdbId) {
  $('#custom-modal-container').addClass('video-modal');
  $('body').addClass('.modal-active');
  var videoUrl = 'https://api.themoviedb.org/3/movie/' + tmdbId + '?api_key=' + apiKey + '&append_to_response=videos';
  $.getJSON(videoUrl, function (data) {
    var youTube = "https://www.youtube.com/embed/";
    $('.custom-modal').html("<div class='embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src=" + youTube + data.videos.results[0].key + "?autoplay=1 html5=1' frameborder='0'></iframe></div>");
  });
}

function showInfoCard(movie) {
  $('.movie-info-card').find('.title').html(movie.title)
  $('.movie-info-card').find('.overview').html(movie.overview)
  $('.movie-info-card').find('.score').html(movie.vote_average)
  $('.movie-info-card').find('.year').html(movie.release_date.substring(0, 4))
  $('.movie-info-card').find('.show-trailer').click(function() {
    showTrailerOnFirstPage(movie.imdb_id)
  });
  if (movie.imdb_id) {
    $('.movie-info-card .show-on-imdb').click(function () {
      window.open('https://www.imdb.com/title/' + movie.imdb_id, 'iMDB');
    });
  };
  $('.movie-info-card').find('.show-on-raterfox').click(function () {
    window.open('https://www.raterfox.com/movies/' + movie.title);
  });
}


function getBgImage() {
  // productUrl = "https://api.raterfox.com/api/api/v1/products?product_type=1&limit=50"
  // $.getJSON(productUrl, function (results) {
  //   randomProduct = results.data[Math.floor(Math.random() * results.data.length)]
  //   showBackgroundImage(randomProduct.huge_backdrop_url)
  //   if (randomProduct.imdb_id) {
  //     goToImdb(randomProduct.imdb_id)
  //   }
  // });

  tmdbIds = ['316029', '353486', '181808', '354912', '374720', '271404', '283995', '321612', '121856', '271110',
    '198663', '364689', '245891', '335984', '166426', '259316', '99861', '10195', '343668', '47933',
    '281338', '293660', '284052', '206647', '274855', '68726', '269149', '19995', '209112', '106646',
    '351286', '284054', '353491', '274857', '399170', '335988', '400106', '293167', '126889', '313106',
    '399035', '336843', '396371', '429351', '442064', '459910', '282035', '263115', '390043', '315837',
    '348389', '401513', '320288', '284054', '337167', '98566', '406990', '76338', '400650', '335983',
    '338952', '375588', '346910', '353081', '360920', '369972', '345940', '345887', '299536', '404368']
  randomMovieId = tmdbIds[Math.floor(Math.random() * tmdbIds.length)]
  imdb_url = "https://api.themoviedb.org/3/movie/" + randomMovieId + "?api_key=" + apiKey + "&language=en-US"
  $.getJSON(imdb_url, function (results) {
    backdrop_path = results.backdrop_path
    background_image = 'https://image.tmdb.org/t/p/original/' + backdrop_path
    showBackgroundImage(background_image)
    showInfoCard(results)
  });
}
// function getBgOverlayColor() {
//   colorArray = [['#002f4b', '#dc4225'], ['#dc4225', '#dc4225']]
//   randomNumber = Math.floor(Math.random() * 2);
//   colorArray[randomNumber]
//   $('.body-wrapper.first-load::after')
// }

function loadNextScreen() {
  $('.body-wrapper').off('click');
  $('#scroll-indicator').remove();
  $('.body-wrapper').css('background', '#F8F8F8')
  $('.body-wrapper').removeClass('first-load');
  $('.info-block').remove();
  $('.movie-info-card').remove();
  $('.background-overlay').remove();
  $('.wrapper').removeClass('hidden');
  page = 1
  loadProducts().then(function(){
    loadMoreProducts();
  });
}

var revealDistance = 0;
var resetRevealTimeout;
var pauseScrollTimeout;

function activateWheelScrollEffect() {
  $('body').on("wheel scroll", function (e) {
    scrollProgressBar = $("#scroll-indicator .progress");

    function resetReveal(ratio) {
      $({ val: ratio }).animate({ val: 180 }, { step: function (now) {
        scrollProgressBar.css('transform', 'translateX(-50%) rotate(' + now + 'deg)');
      }})
    };

    revealDistance -= e.originalEvent.wheelDeltaY;

    var absRevealDistance = Math.abs(revealDistance);

    if (absRevealDistance < 250) {

      //Set progress range between 180 and 295deg
      var revealRatio = Math.round(115 / 1000 * absRevealDistance) + 180;

      scrollProgressBar.css('transform', 'translateX(-50%) rotate(' + revealRatio + 'deg)');

      clearTimeout(resetRevealTimeout);
      resetRevealTimeout = setTimeout(function() {

        absRevealDistance = 0

        resetReveal(revealRatio);
      }, 750);

      e.preventDefault();

    } else {

      clearTimeout(resetRevealTimeout);

      if (pauseScrollTimeout) {

        e.preventDefault();
        return;

      } else {

        if (pauseScrollTimeout === 0) {
          $('main').off("wheel scroll");
          return;
        }

        pauseScrollTimeout = setTimeout(function() {
          pauseScrollTimeout = 0;
        }, 1000)

        e.preventDefault();
      }

      $({ val: 210 }).animate({ val: 295 }, {
        duration: 200,
        step: function (now) {
          scrollProgressBar.css('transform', 'translateX(-50%) rotate(' + now + 'deg)');
        },
        complete: function() {
          setTimeout(function() {
            loadNextScreen();
          }, 100);
        }
      })
    }
  });
}

function showDate() {
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
 ];
  date = new Date($.now());

  $('.day-name').html(dayNames[date.getDay()]);
  $('.day').html(date.getDate());
  $('.month').html(monthNames[date.getMonth()]);
  $('.year').html(date.getFullYear());
};

$(document).ready(function () {
  getBgImage();
  // getBgOverlayColor();
  activateWheelScrollEffect();
  showDate();

  $('#scroll-indicator').click(function(){
    loadNextScreen()
  });

  $('input#search-input').keyup(function() {
    loadProducts($(this).val());
  });


  var win = $(window);
  win.scroll(function() {
    if ($(document).height() - win.height() == win.scrollTop()) {
      if ($('input#search-input').val() == '') {
        page += 1
        if ($('#load-reviews').hasClass('active')) {
          loadReviews();
        } else {
          loadProducts();
        }
      }
    }
  });

  $('#load-movies').click(function() {
    $(this).addClass('active');
    $('#load-tv-shows').removeClass('active');
    $('#load-reviews').removeClass('active');
    $('#load-games').removeClass('active');
    $('#products').html('');
    page = 1
    loadProducts().then(function(){
      loadMoreProducts();
    });
  });

  $('#load-tv-shows').click(function() {
    $(this).addClass('active');
    $('#load-movies').removeClass('active');
    $('#load-reviews').removeClass('active');
    $('#load-games').removeClass('active');
    $('#products').html('');
    page = 1
    loadProducts().then(function(){
      loadMoreProducts();
    });
  });

  $('#load-games').click(function () {
    $(this).addClass('active');
    $('#load-movies').removeClass('active');
    $('#load-tv-shows').removeClass('active');
    $('#load-reviews').removeClass('active');
    $('#products').html('');
    page = 1
    loadProducts().then(function () {
      loadMoreProducts();
    });
  });

  $('#load-reviews').click(function() {
    $(this).addClass('active');
    $('#load-tv-shows').removeClass('active');
    $('#load-movies').removeClass('active');
    $('#load-games').removeClass('active');
    $('#products').html('');
    page = 1
    loadReviews().then(function(){
      loadMoreReviews();
    });
  });

  $('.modal-background').click(function(){
    $('#custom-modal-container').removeClass('video-modal');
    $('body').removeClass('.modal-active');
    $('#custom-modal-container').find('.custom-modal').html('');
  });
});
