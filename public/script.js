$.fn.background = function(bg) {
  return $(this).css('backgroundImage', bg ? 'url('+bg+')' : 'none')
}

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)]
}

// call a function asynchronously to minimize codepaths
function async(fn) {
  setTimeout(fn, 10)
}

$(function() {
  function artistImage(artist, callback) {
    if (!artist) { async(callback); return }
    artist = encodeURI(artist)
    var last_fm_uri = "http://ws.audioscrobbler.com/2.0/?format=json&method=artist.getimages&artist=%s&api_key=b25b959554ed76058ac220b7b2e0a026"
    $.ajax({
      url: last_fm_uri.replace('%s', artist),
      dataType: 'jsonp',
      success: function(obj) {
        var images = obj.images.image
        callback(images.length ? images.random().sizes.size[0]['#text'] : null)
      },
      error: function() {}
    })
  }

  function updateInformation(obj) {
    obj = obj || {}
    var artist = obj.artist || '',
        album  = obj.album  || '',
        title  = obj.title  || ''

    $('#title' ).html(title)
    $('#artist').html(artist)
    $('#album' ).html(album)

    if (!title && !title) {
      $('title').html('So nice')
    } else {
      $('title').html(artist + (artist && title ? ' &ndash; ' : '') + title)
    }

    artistImage(obj.artist, function(url) {
      $('body').background(url)
    })
  }

  // XHR updating the text regularly
  function update() {
    setTimeout(function() {
      $.ajax({
        dataType: 'json',
        complete: update,
        success: updateInformation,
        error:   updateInformation
      })
    }, 10 * 1000)
  }
  update()

  // XHR overriding the buttons
  $('input').live('click', function(e) {
    var form = $(this).parents('form')
    $.ajax({
      type: form.attr('method'),
      url:  form.attr('action'),
      data: this.name+'='+this.value
    })
    return false
  })

  // Keyboard shortcuts
  $(document).keydown(function(e) {
    switch(e.keyCode) {
      case 32:  $('#playpause').click(); break // space
      case 78:  $('#next'     ).click(); break // n
      case 80:  $('#prev'     ).click(); break // p
      case 107: $('#volup'    ).click(); break // +
      case 109: $('#voldown'  ).click(); break // -
    }
  })
})

