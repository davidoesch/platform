var maps = {};

Zepto(function($){

  $('rg-drawer').each(function() {
    var self = this;
    $.getJSON('/api/projects', function(projects) {
      $('.c-link--brand a').click(function(e) {
        e.preventDefault();
        window.scrollTo(0, 0);

        var tag = riot.mount('rg-drawer', {
          drawer: {
            header: '<< DASHBOARD',
            isvisible: true,
            position: 'top',
            items: projects
          }
        });
        tag[0].on('select', function (item) {
          location.href='/project/' + item.id;
        });
        $('rg-drawer .heading').click(function() {
          location.href='/';
        }).css('cursor', 'pointer');
        return false;
      })
    });
  });

  function get_project_path(url) {
      return (url.indexOf('http')<0) ?
        project_path + '/' + url : url;
  }
  function get_media_type(fmt) {
      if (fmt == 'image') return 'image/png';
      if (fmt == 'png') return 'image/png';
      if (fmt == 'jpg') return 'image/jpeg';
      if (fmt == 'geojson') return 'application/vnd.geo+json';
      if (fmt == 'datapackage') return 'application/vnd.datapackage+json';
      if (fmt == 'embed') return 'application/html';
  }

  function load_DataPackage(datapackage) {

    gallery = $('.gallery'); //.html('<div class="controls"></div>');
    var rescount = 0;

    function add_gallery_item(ii) {
      gallery.append('<div id="item-'+ii+'" class="control-operator"></div>');
      // gallery.find('.controls').append('<a href="#item-'+ii+'" class="control-button">•</a>');
      return gallery.append('<figure class="item" />').find('.item:last-child');
    }

    // console.log(datapackage);
    $.each(datapackage.resources, function(i, res) {
      if (typeof(res.mediatype) == 'undefined')
        res.mediatype = get_media_type(res.format);

      if (res.mediatype == 'application/vnd.datapackage+json') {
        pp = get_project_path(res.path);
        $.getJSON(get_project_path(res.path), function(dp) {
          project_path = pp.substring(0, pp.lastIndexOf('/')+1);
          load_DataPackage(dp);
        });

      } else if (res.mediatype.indexOf('image/')==0) {
        rescount = rescount + 1;
        item = add_gallery_item(rescount);

        img = item.append('<img id="image-'+rescount+'" />').find('img:last-child');
        imgpath = get_project_path(res.path);
        img.attr('style', 'background-image:url('+imgpath+')');

      } else if (res.mediatype == 'application/html') {
        rescount = rescount + 1;
        item = add_gallery_item(rescount);

        imgpath = get_project_path(res.path);
        item.append('<iframe id="frame-'+rescount+'" src="' + imgpath + '"/>');

      } else if (res.mediatype == 'application/vnd.geo+json') {
        rescount = rescount + 1;
        item = add_gallery_item(rescount);

        item.append('<div class="map" id="map-'+rescount+'" />');
        filepath = get_project_path(res.path);

        var lati = 47.38083877331195;
        var long = 8.548545854583836;
        var zoom = 9.28056836461962;

        var map = new mapboxgl.Map({
          container: 'map-' + rescount,
          style: 'mapbox://styles/mapbox/light-v9',
          zoom: zoom,
          center: { lat: lati, lng: long }
        });

        var layer = {
          "id": res.name,
          "type": res.type || "symbol",
          'layout': {}
        };

        if (layer.type == "line")
          layer["paint"] = {
              "line-color": res.color || "#888",
              "line-width": res.linewidth || 3
          };

        if (layer.type == "circle")
          layer["paint"] = {
              "circle-color": res.fillcolor || "#000",
              "circle-radius": res.fillradius || 2,
          };

        if (layer.type == "fill")
          layer["paint"] = {
              "fill-color": res.fillcolor || "#088",
              "fill-opacity": res.fillopacity || 0.8,
          };

        if (layer.type == "symbol")
          layer["layout"] = {
              "icon-image": "{icon}-15",
              "text-field": "{title}",
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 0.6],
              "text-anchor": "top"
          };

        layer["source"] = {
            "type": "geojson",
            "data": filepath
        };

        // console.log(layer);

        map.on('load', function () {
          map.addLayer(layer);

          if (res.view) {
            map.setCenter({
              lat: res.view.lat  || lati,
              lng: res.view.lng  || long
            });
            map.setZoom(res.view.zoom || zoom);
          }
        });

        maps[rescount] = map;
      } // -geojson

      if (res.name.length>1 && res.description.length>1) {
        $('.resource-content').append(
          '<div class="description" id="' + res.name + '">'
        + '<h2>' + (res.title || res.name) + '</h2><p>'
        + res.description + '</p></div>');
        $('.sidebar-nav ul').append(
          '<li><a href="#' + res.name + '">' + (res.title || res.name) + '</a></li>'
        );
      }
    });

    if (rescount > 0) {
      console.log(rescount);
      gallery.addClass('items-' + rescount);
      var tags = riot.mount('rg-pagination', {
        pagination: {
          pages: rescount,
          page: 1
        }
      });
      tags[0].on('page', function (page) {
        if (page < 1) { return tags[0].forward(); }
        if (page > rescount) { return tags[0].back(); }
        location.href="#item-" + page;
        if (maps.hasOwnProperty(page))
          maps[page].resize();
      });
      location.href="#item-1";
    }

  } //-load_DataPackage

  // Load selected project
  if (typeof project_id != 'undefined') {
    $.getJSON('/api/project/' + project_id, load_DataPackage);
  } else if (typeof project_path != 'undefined') {
    $.getJSON('/' + project_path + '/datapackage.json', load_DataPackage);
  }

  // Full screen mode
  function requestFullScreen() {
    element = document.body;
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { requestMethod.call(element); }
  }
  $('img.fullscreen').click(function(e) {
    e.preventDefault();
    if ($(this).hasClass('active')) {
      $('.gallery').removeClass('fullscreen');
      $(this).removeClass('active');
      if (document.exitFullscreen) { document.exitFullscreen(); }
    } else {
      requestFullScreen();
      $('.gallery').addClass('fullscreen');
      $(this).addClass('active');
    }
  });

  // Sticky navigation
  var sticky = new Sticky('.sticky');

  if (typeof mapboxgl !== 'undefined')
    mapboxgl.accessToken = 'pk.eyJ1Ijoic21hcnR1c2UiLCJhIjoiY2pkNGowcGdzMHhpbzMzcWp3eGYydGhmMiJ9.k9QyYo-2pFvyyFDJiz16UA';

});
