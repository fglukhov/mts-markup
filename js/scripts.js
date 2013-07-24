$(window).load(function(){
  $(".main-slider").each(function () {
    $(this).mainSlider();
  });
});

$(window).resize(function() {
  $(".autocomplete").css("left",$("#searchInput").offset().left).css("top",$("#searchInput").offset().top + 31);
});

$(document).ready(function () {
  
  // $(".form-wrapper").hide();
  // $(".map-content").show();
  // showMap();   
  
  if (!$.support.transition) {
    $.fn.transition = $.fn.animate;
  }
  
  
  if ($(".request-form label span").length) {
    $(".request-form label span").textShadow('1px 1px #005568');
  }
  
  $("input:submit").each(function () {
    var divBtn = $("<div></div>");
    var submit = $(this);
    divBtn.attr("class",$(this).attr("class")).attr("id",$(this).attr("id")).html("<span>"+
    $(this).val()+"</span>");
    if (submit.is(":disabled")) {
      divBtn.addClass("submit-disabled");
    }
    $(this).after(divBtn);
    $(this).hide();
    divBtn.on("click",function () {
      submit.click();
    });
    divBtn.children("span").textShadow('1px 1px #880000');;
  });

  $("input:text").each(function () {
    $(this).wrap("<div class='input-wrapper'></div>");
  });
  
  // Валидация формы заявки
  
  var validator = $("#requestForm").bind("invalid-form.validate", function() {
			$("#summary").html("Пожалуйста, заполните все поля");
		}).validate({
    rules: {
			request_email: {
				required: true,
				email: true
			}
		},
    sendForm : false,
    messages: {
      request_lastname: "Поле обязательно для заполнения",
      request_name: "Поле обязательно для заполнения",
      request_email: "Введите правильный адрес",
      request_phone: "Поле обязательно для заполнения"
    },
    errorPlacement: function(error, element) {
      element.parents(".input-wrapper").addClass("input-wrapper-error");
      if (element.attr("id") != "request_email" || element.val() == "") {
        error.insertAfter(element);
      }
      element.focus(function() {
        error.remove();
      });
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).parents(".input-wrapper").removeClass("input-wrapper-error");
      $(element).removeClass(errorClass);
    }
  });

	$("#requestForm").submit(function() {
    if ($("#requestForm").valid()) {
      $(".loader").show();
      $.ajax({
        type: "POST",
        url: "send.php",
          data: { 
            request_lastname: $("#request_lastname").val(), 
            request_name: $("#request_name").val(),
            request_email: $("#request_email").val(),
            request_phone: $("#request_phone").val()
          }
        }).done(function() {
        
        /* Submit message */
        $(".loader").hide();
        $(".form-wrapper").hide();
        $(".map-content").show();
        
        $("#searchForm").validate({
          sendForm : false,
          messages: {
            searchInput: "Введите адрес"
          },
          errorPlacement: function(error, element) {
            element.parents(".input-wrapper").addClass("input-wrapper-error");
            error.insertAfter(element);
            element.focus(function() {
              error.remove();
            });
          },
          unhighlight: function(element, errorClass, validClass) {
            $(element).parents(".input-wrapper").removeClass("input-wrapper-error");
            $(element).removeClass(errorClass);
          }
        });
        
        showMap();
        
      });
      return false;
    }
	});
  
});

(function( jQuery ) {
  jQuery.fn.mainSlider = function() {
    var slider = $(this);
    var slides = slider.children(".slide");
    var sliderSize = slides.size();
    
    slider.append("<div class='lister'></div>");
    
    var lister = slider.children(".lister");
    
    slides.hide();
    slides.eq(0).show().addClass("slide-act");
    
    if (sliderSize > 1) {
    
      for (i=1;i<=sliderSize;i++) {
        lister.append("<div class='item'></div>");
      }
      
      lister.append("<div class='prev'></div>");
      lister.append("<div class='next'></div>");
      
      var i = 0;
      
      var sliderInt = setInterval(function() {
        if (slider.find(".slide-act .slide-content li").eq(i).length) {
          slider.find(".slide-act .slide-content li").eq(i).fadeIn(250);
          i++;
        } else {
          clearInterval(sliderInt);
        }
        
      },1500);
      
      var listerItems = lister.children(".item");
      
      listerItems.eq(0).addClass("act");
      
      $(".pic-element").stop().hide();
      
      sliderAnimation(0);
      
      var timer = new RecurringTimer(function() {
        if (lister.find(".act").index() < sliderSize-1) {
          lister.find(".act").next(".item").click();
        } else {
          listerItems.eq(0).click();
        }
      }, 10000);
      
      listerItems.on("click",function () {
        slides.find(".slide-content").hide();
        slides.find(".pic-element").hide();
        slides.find(".pic-group").hide();
        $(".pic-element").stop().hide();
        
        if (!$(this).hasClass("act")) {
          
          timer.restart();
        
          listerItems.removeClass("act");
          $(this).addClass("act");

          slides.hide().removeClass("slide-act");
          slides.eq($(this).index()).show().addClass("slide-act");
          
          slides.find(".slide-content").fadeOut(250);
          slides.find(".slide-content").eq($(this).index()).fadeIn(250);
          
          slides.find(".pic-element").fadeOut(250);
          
          slides.find(".pic-group").fadeOut(250);
          
          slider.find(".slide-act .slide-content li").hide();
        
          clearInterval(sliderInt);
          
          var i = 0;
      
          sliderInt = setInterval(function() {
            if (slider.find(".slide-act .slide-content li").eq(i).length) {
              slider.find(".slide-act .slide-content li").eq(i).fadeIn(250);
              i++;
            } else {
              clearInterval(sliderInt);
            }
            
          },1500);
          
          $(".pic-element").stop().hide();
          
          sliderAnimation($(this).index());
          
        }
      });
      
      // listerItems.bind("mouseover",function () {
        // $(this).click();
      // });
      
      lister.children(".next").on("click",function() {
        if (lister.find(".act").index() < sliderSize-1) {
          lister.find(".act").next(".item").click();
        } else {
          listerItems.eq(0).click();
        }
      });
      
      lister.children(".prev").on("click",function() {
        if (lister.find(".act").index() > 0) {
          lister.find(".act").prev(".item").click();
        } else {
          listerItems.eq(sliderSize-1).click();
        }
      });
      
      
      
      slider.bind("mouseover",function () {
        //timer.pause();
      });
      slider.bind("mouseout",function () {
        //$("#test").html("go")
      });
      
      
    }
  
  
    /* Card animation */
    
    var card = slider.find($(".card"));
  
    card.css("left",500 + slider.width() - card.width()).show().transition({
      left:649
    },1000);
    
    var slideTtl = slider.find("h2");
    
    slideTtl.css("position","absolute").css("left",200 + slider.width()).show();
    
    slideTtl.transition({
      left:0
    },1200);
    
  }
  
  
  
})( jQuery );

function RecurringTimer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  var resume = function() {
    start = new Date();
    timerId = window.setTimeout(function() {
      remaining = delay;
      resume();
      callback();
    }, remaining);
  };
  
  var restart = function() {
    window.clearTimeout(timerId);
    start = new Date();
    timerId = window.setTimeout(function() {
      restart();
      callback();
    }, delay);
  };
  
  this.resume = resume;
  this.restart = restart;

  this.resume();
}


function showMap() {
  ymaps.ready(mapInit); 
}

function mapInit () {

  var stores = $.getValues("stores2.xml");
  
  var myMap = new ymaps.Map('map', {
    center: [63.369315, 105.440191],
    zoom: 13,
    // Добавим к стандартным поведениям карты зум колесом мыши.
    behaviors: ['default', 'scrollZoom']
  });
  
  // Метка

  
  // Геолокация
  
  var geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function geoSuccess(pos) {
    var crd = pos.coords;

    // console.log('Your current position is:');
    // console.log('Latitude : ' + crd.latitude);
    // console.log('Longitude: ' + crd.longitude);
    // console.log('More or less ' + crd.accuracy + ' meters.');
    
    //findNearest(crd);
    
    //myMap.setCenter([crd.latitude, crd.longitude]);

    findNearest(crd);
        
    //addMarkers();
    
  };
  
  function findNearest(coords) {
    var lat = coords.latitude;
    var lng = coords.longitude;
    var placemarksNumber = stores.length;
    allPlacemarks = createAllObjects(placemarksNumber);
    
    var latGoal = parseFloat(lat);
    var closestLat = 0;
    var lngGoal = parseFloat(lng);
    var closestLng = 0;
    var distances = new Array();
    var i=0;
    $.each(allPlacemarks, function(){
      thisLat = parseFloat(this[0]);
      thisLng = parseFloat(this[1]);
      distance = Math.pow(latGoal-thisLat,2) + Math.pow(lngGoal-thisLng,2);
      distances.push(distance);
      i++;
    });
    
    
    var minDistance = Math.min.apply(null, distances);
    var minIndex = $.inArray(minDistance,distances);
    var closestCoords = stores[minIndex].GPS.split(",");
    
    closestLat = closestCoords[0];
    closestLng = closestCoords[1];
    var nearestAddress = stores[minIndex].address.substring(stores[minIndex].address.indexOf(', ')+2, stores[minIndex].address.length);
    $("#nearestAddress").html(nearestAddress.replace(" г,",","));
    $("#sample address").text(nearestAddress.replace(" г,",","));
    
    
    $(".map-search span").each(function() {
      
      if (!$(this).hasClass("shadow") && !$(this).children(".shadow").length) {
        $(this).textShadow('1px 1px #005568');
      }
    });
    
    myMap.setCenter([closestLat, closestLng],13);
    myMap.container.fitToViewport();
    
    
    
    addMarkers();
    
  }
  
  function geoError(err) {
    //console.warn('ERROR(' + err.code + '): ' + err.message);
    myMap.setCenter([55.752198, 37.622478],11);
    myMap.container.fitToViewport()
  };
  
  if (navigator.geolocation) {
      // Запрашиваем текущие координаты устройства.
      navigator.geolocation.getCurrentPosition(
          geoSuccess,
          geoError,
          geoLocationOptions
      );
  }
  else {
      var coords = ymaps.geolocation;
      if (coords.length) {
        findNearest(coords);
      } else {
        myMap.setCenter([55.752198, 37.622478],11);
        myMap.container.fitToViewport()
      }
      //this.handleGeolocationError('Ваш броузер не поддерживает GeolocationAPI.');
      //myMap.setCenter([63.369315, 105.440191]);
  }
  
  // Создаем кластеризатор c красной иконкой (по умолчанию используются синия).
  //222 var clusterer = new ymaps.Clusterer({preset: 'twirl#redClusterIcons'});
      // Создаем коллекцию геообъектов.
  var collection = new ymaps.GeoObjectCollection();
      // Дополнительное поле ввода при включенном режиме кластеризации.
      
          
  // Добавляем кластеризатор на карту.
  //222 myMap.geoObjects.add(clusterer);
  
  // Добавляем коллекцию геообъектов на карту.
  myMap.geoObjects.add(collection);
  
  // Добавление меток с произвольными координатами.
  function addMarkers () {
  
      // Количество меток, которое нужно добавить на карту.
      var placemarksNumber = stores.length,
          
          bounds = myMap.getBounds(),
          // Флаг, показывающий, нужно ли кластеризовать объекты.
          //222 useClusterer = $('#useClusterer').is(':checked'),
          // Размер ячейки кластеризатора, заданный пользователем.
          //222 gridSize = parseInt($('#gridSize').val()),
          // Генерируем нужное количество новых объектов.
          newPlacemarks = createGeoObjects(placemarksNumber, bounds);
      //222 if (gridSize > 0) {
          // clusterer.options.set({
              // gridSize: gridSize
          // });
      // }
      
      // Если используется кластеризатор, то добавляем кластер на карту,
      // если не используется - добавляем на карту коллекцию геообъектов.
      //222 if (useClusterer) {      
          // // Добавлеяем массив меток в кластеризатор.
          // clusterer.add(newPlacemarks);
      // } else {
          for (var i = 0; i < newPlacemarks.length; i++) {
              //collection.add(newPlacemarks[i]);
              myMap.geoObjects.add(newPlacemarks[i]);
          }
      //222 }
      
      // if(!newPlacemarks.length) {
        // myMap.setZoom(myMap.getZoom() - 1);
        // addMarkers();
      // }
      
  }
  
  function createGeoObjects (number, bounds) {
      
      var placemarks = [];
      
      var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
          '<div class="balloon-top">$[properties.address]</div><div class="balloon-bottom">$[properties.hours]</div>', {
            build: function () {
                // Сначала вызываем метод build родительского класса.
                MyBalloonContentLayoutClass.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
            },

            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                MyBalloonContentLayoutClass.superclass.clear.call(this);
            }
          }
      );
      
      // Создаем нужное количество меток
      for (var i = 0; i < number; i++) {
          // Генерируем координаты метки случайным образом.
          var pointCoords = stores[i].GPS.split(",");
          var lat = pointCoords[0];
          var lng = pointCoords[1];
          if (lat >= bounds[0][0] && lat <= bounds[1][0] && lng >= bounds[0][1] && lng <= bounds[1][1]) {
            coordinates = [lat, lng];
            myPlacemark = new ymaps.Placemark(coordinates, {
              address: stores[i].address,
              hours: stores[i].openingHours
            },
            {
              iconImageHref: '../images/map-pin.png',
              // Размеры метки.
              iconImageSize: [24, 40],
              // Смещение левого верхнего угла иконки относительно
              // её "ножки" (точки привязки).
              iconImageOffset: [-12, -40],
              balloonContentLayout: MyBalloonContentLayoutClass,
              hasHint: false,
              hasBalloon: true,
              draggable: false,
              balloonAutoPan : true,
              balloonHasCloseButton: false,
              balloonShadow : false

            }
            );
            placemarks.push(myPlacemark);
          }
          
          //coordinates = getRandomCoordinates(bounds);
          // Создаем метку со случайными координатами.
          
      }
      return placemarks;
  }
  
  function createAllObjects (number) {
      var allPlacemarks = [];
      // Создаем нужное количество меток
      for (var i = 0; i < number; i++) {
          // Генерируем координаты метки случайным образом.
          var pointCoords = stores[i].GPS.split(",");
          var lat = pointCoords[0];
          var lng = pointCoords[1];
            coordinates = [lat, lng];
            allPlacemarks.push(coordinates);
          
          //coordinates = getRandomCoordinates(bounds);
          // Создаем метку со случайными координатами.
          
      }
      return allPlacemarks;
  }
  
  // Функция, генерирующая случайные координаты
  // в пределах области просмотра карты.
  function getRandomCoordinates (bounds) {
      var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
      return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
  }
  
  function getCoordinates (bounds) {
      var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
      return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
  }
  
  // Показывать/скрывать дополнительное поле ввода.
  function toggleGridSizeField () {
      // Если пользователь включил режим кластеризации, то появляется дополнительное поле
      // для ввода опции кластеризатора - размер ячейки кластеризации в пикселях.
      // По умолчанию размер ячейки сетки равен 64.
      // При отключении режима кластеризации дополнительное поле ввода скрывается.
      gridSizeField.toggle();
  }

  // Удаление всех меток с карты
  function removeMarkers () {
      // Удаляем все  метки из кластеризатора.
      //222 clusterer.removeAll();
      // Удаляем все метки из коллекции.
      collection.removeAll();
  }
  
  $(document).on('submit','#searchForm',function(e) {
    var searchRequest = $("#searchInput").val();
    
    ymaps.geocode(searchRequest, { results: 1 }).then(function (res) {
      // Выбираем первый результат геокодирования.
      var firstGeoObject = res.geoObjects.get(0);
      
      if (!firstGeoObject) {
        alert('error')
      }
      
      
      var searchLat = firstGeoObject.geometry._ti[0];
      var searchLng = firstGeoObject.geometry._ti[1];
      
      myMap.setCenter([searchLat, searchLng]);
      myMap.container.fitToViewport();
      
      removeMarkers();
      
      var searchCoords = {
        "latitude": searchLat,
        "longitude": searchLng
      };
      
      findNearest(searchCoords);
      
      if ($(".autocomplete").css("display") == "block") {
        myMap.setZoom(16);
        myMap.container.fitToViewport();
        $(".autocomplete").hide();
      }
      
    }, function (err) {
        // Если геокодирование не удалось, сообщаем об ошибке.
        alert('error')
        
    });
    return false;
  });
  
  $(".map-search #sample").click(function() {
    $("#searchInput").val($(this).find("address").html());
    $("#searchForm").submit();
  });
  
  $("#searchForm").on("submit",function() {
    if (!$("#searchInput").val()) {
      $("#searchInput").blur();
    }
  });
  
  // Автозаполнение формы поиска
  
  $("#searchInput").keydown(function(e) {
  
    if(window.event) { keynum = e.keyCode; }  // IE (sucks)
    else if(e.which) { keynum = e.which; }
    
    if (keynum == 40) {
      acDown();
    } else if (keynum == 38) {
      acUp();
    } else if  (keynum == 13) {
      acSelect();
    } else if ((keynum != 37) // Left
                || (keynum != 39) // Right
                || (keynum != 40 || keynum != 38)// && (document.getElementById('ulSuggestList').style.display != 'none')) // Down or Up
                || (keynum != 20) // Caps Lock
                || (keynum != 9)  // Tab
                || (keynum != 17) // Ctrl up
                || (keynum != 33) // Page up
                || (keynum != 34) // Page down
                || (keynum != 35) // End
                || (keynum != 36) // Home
                || (keynum != 45) // Insert
                || (keynum != 145)
                || (keynum != 144)
                || (keynum != 19) // Pause
                || (keynum != 123) // F12
                || (keynum != 122) // F11
                || (keynum != 121) // F10
                || (keynum != 120) // F9
                || (keynum != 119) // F8
                || (keynum != 118) // F7
                || (keynum != 117) // F6
                || (keynum != 116) // F5
                || (keynum != 115) // F4
                || (keynum != 114) // F3
                || (keynum != 113) // F2
                || (keynum != 112) // F1
                || (keynum != 219)
                || (keynum != 0)
    ) {
    
      var val = $(this).val();
      var acresults = new Array();
      for (i in stores) {
        address = stores[i].address;
        if (address.toLowerCase().indexOf(val.toLowerCase()) != -1 && val !="" && acresults.length < 11) {
          acresults.push(stores[i].address.replace(" г,",","));
        }
      }
      
      if (!$(".autocomplete").length && acresults.length) {
        $("body").append("<ul class='autocomplete' />");
        $(".autocomplete").css("left",$("#searchInput").offset().left).css("top",$("#searchInput").offset().top + 31);
      } else {
        $(".autocomplete").html("").hide();
      }
      
      if (acresults.length) {
        $(".autocomplete").show().css("left",$("#searchInput").offset().left).css("top",$("#searchInput").offset().top + 31);;
      }
      
      for (i in acresults) {
        $(".autocomplete").append("<li><span>" + acresults[i] + "</span></li>");
      }
      
      $(".autocomplete li").hover(function() {
        $(".autocomplete li").removeClass("act");
        $(this).addClass("act");
      });
      
      $(".autocomplete").bind("mouseleave",function() {
        var acT = setTimeout(function() {
          $(".autocomplete").hide();
        },500);
      });
      
      $(".autocomplete span").click(function() {
        acSelect();
        $("#searchForm").submit();
      });
      
    }
    
  });
  
  function acDown() {
    if ($(".autocomplete li").length) {
      var items = $(".autocomplete li");
      if (!$(".autocomplete .act").length) {
        items.eq(0).addClass("act");
      } else {
        actItem = $(".autocomplete .act");
        if (actItem.index() < items.length - 1) {
          actItem.next("li").addClass("act");
          actItem.removeClass("act");
        } else {
          actItem.removeClass("act");
          items.eq(0).addClass("act");
        }
      }
    }
  }

  function acUp() {
    if ($(".autocomplete li").length) {
      var items = $(".autocomplete li");
      if (!$(".autocomplete .act").length) {
        items.eq(items.length - 1).addClass("act");
      } else {
        actItem = $(".autocomplete .act");
        if (actItem.index() > 0) {
          actItem.prev("li").addClass("act");
          actItem.removeClass("act");
        } else {
          actItem.removeClass("act");
          items.eq(items.length - 1).addClass("act");
        }
      }
    }
  }

  function acSelect() {
    if ($(".autocomplete .act").length) {
      $("#searchInput").val($(".autocomplete .act span").html());
    } else {
      $("#searchForm").submit();
    }
  }
  
  
}



jQuery.extend({
    getValues: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'text',
            async: false
        }).done(function(data) {
          storesTxt = data;
                
                var storesXml = $.parseXML(storesTxt);
                var storesRaw = $.xml2json(storesXml).Element;
                
                var stores = new Array();
                
                $.each(storesRaw, function(index, value) {
                  if (value.GPS != "" && value.status != "Закрыта") {
                    stores.push(value);
                  }
                });
                
                result = stores;
                
        });
        
        return result;
    }
});

function sliderAnimation(slideNum) {
  
  $(".pic-element").hide();
  $("#slider-bag").hide();
  $("#slider-lamps").hide();
  $("#slider-lamps img").hide();
  
  
  
  /* Первый слайд */
  
  if (slideNum == 0) {
    
    var box = $("#slider-box");
    var coins = $("#slider-coins");
    
    var t01 = setTimeout(function() {
    
    
      box.css("left",640).css("top",44).show().stop().animate({
        left: 546,
        top: 49
      },450);
      
      $({deg: 20}).animate({deg: 0}, {
         duration: 450,
         step: function(now){
           box.css({
             transform: "rotate(" + now + "deg)"
           });
         }
      });
      
    },1500);
    
    var t02 = setTimeout(function() {
      coins.css("width",299).css("height",166).css("left",546).css("top",146).css("z-index",4).fadeIn(1000);
    },2500);
    
    // var t02 = setTimeout(function() {
      // coins.css("width",90).css("height",50).css("left",620).css("top",96).css("z-index",1).show().animate({
        // width:[180, 'linear'],
        // height:[100,'linear'],
        // left:[405, 'easeOutCirc'],
        // top:[121,'linear']
      // },800,function() {
        // coins.css("z-index",4);
        // coins.animate({
          // width: [299, 'linear'],
          // height: [166, 'linear'],
          // left: [520, 'easeInQuad'],
          // top:[146, 'linear']
        // },500,function() {
          // coins.animate({
            // width: 299,
            // height: 166,
            // left: [546, 'easeOutQuad']
          // },300);
        // });
      // });
      
    // },2500);
    
    //545, 145
    
  }
  
  if (slideNum == 1) {
    
    var notebook = $("#slider-notebook");
    var cursor = $("#slider-cursor");
    
    var t11 = setTimeout(function() {
      notebook.css("left",500 + $(".main-slider").width() - notebook.width()).show().stop().transition({
        left:490
      },1100,'easeInOutSine');
      
      /*543,-3*/
      
    },300);
    
    var t12 = setTimeout(function() {
      cursor.css("left",$(".main-slider").offset().left + $(".main-slider").width()).css("top",-230).show().stop().transition({
        left:686,
        top:184
      },1100,'easeInOutSine');
      
      /*543,-3*/
      
    },1200);
    
    var t13 = setTimeout(function() {
      cursor.stop().animate({
        width:55,
        height:90
      },50);
    },2900);
    
    var t14 = setTimeout(function() {
      cursor.stop().animate({
        width:61,
        height:100
      },50);
    },3000);
    
      /*543,-3*/
      
    
  }
  
  if (slideNum == 2) {
    
    var bag = $("#slider-bag");
    var bagFront = $("#slider-bag-front");
    var shoes = $("#slider-shoes");
    var shirt = $("#slider-shirt");
    var scarf = $("#slider-scarf");
    
    var t21 = setTimeout(function() {
      bag.css("left",500 + $(".main-slider").width() - bag.width()).show().stop().transition({
        left:515
      },1100,'easeInOutSine');
      
      /*543,-3*/
      
    },300);
    
    var t22 = setTimeout(function() {
      
      shoes.css("left",-550).show().transition({
        left:460
      },1300,'easeInOutSine');
      
      /*543,-3*/
      
    },800);
    
    var t23 = setTimeout(function() {
      shirt.css("top",-22).fadeIn(500);
      
      /*543,-3*/
      
    },2100);
    
    var t24 = setTimeout(function() {
      scarf.css("top",-8).fadeIn(500);
      
      /*543,-3*/
      
    },3100);
    
  }
  
  if (slideNum == 3) {
    
    var phone = $("#slider-phone");
    var paypass = $("#slider-paypass");
    
    //
    
    var t31 = setTimeout(function() {
      phone.css("left",613).css("top",165).css("width",10).css("height",10).show().stop().transition({
        width:141,
        height:327,
        left:543,
        top:-3
      },500);
      
      /*543,-3*/
      
    },500);
    
    var t32 = setTimeout(function() {
      paypass.css("left",727).css("top",213).css("width",10).css("height",10).show().stop().transition({
        width:155,
        height:162,
        left:655,
        top:131
      },500,function() {
        $("#slider-lamps").show();
        lamp.eq(0).fadeIn(50).delay(150).fadeOut(50).delay(1500).fadeIn(50).delay(150).fadeOut(50);
        lamp.eq(1).delay(150).fadeIn(50).delay(150).fadeOut(50).delay(1500).fadeIn(50).delay(150).fadeOut(50);
        lamp.eq(2).delay(300).fadeIn(50).delay(150).fadeOut(50).delay(1500).fadeIn(50).delay(150).fadeOut(50);
        lamp.eq(3).delay(450).fadeIn(50).delay(150).fadeOut(50).delay(1500).fadeIn(50).delay(150).fadeOut(50);
      });
      
      /*543,-3*/
      
    },1500);
    
    var lamp = $("#slider-lamps img");
    
    
        
    if ($("#slider-lamps").hasClass("active")) {
      // t33.restart();
      // t34.restart();
      // t35.restart();
      // t36.restart();
    } else {
      $("#slider-lamps").addClass("active");

      
      
      // var t33 = new RecurringTimer(function() {
        // lamp.eq(0).fadeIn(50).delay(150).fadeOut(50);
        // isAnimation = 1;
      // }, 1000);
      
      // var t34 = new RecurringTimer(function() {
        // lamp.eq(1).delay(150).fadeIn(50).delay(150).fadeOut(50);
      // }, 1000);
      
      // var t35 = new RecurringTimer(function() {
        // lamp.eq(2).delay(250).fadeIn(50).delay(150).fadeOut(50);
      // }, 1000);
      
      // var t36 = new RecurringTimer(function() {
        // lamp.eq(3).delay(350).fadeIn(50).delay(150).fadeOut(50);
      // }, 1000);
    }
      
    
    
    
  }
  
  if (slideNum == 4) {
    
    var backpack = $("#slider-backpack");
    
    var t41 = setTimeout(function() {
      backpack.css("left",500 + $(".main-slider").width() - backpack.width()).show().stop().transition({
        left:525
      },1200,"easeInOutSine");
      
      /*543,-3*/
      
    },500);
    
  }
  
}

$.fn.animateRotate = function(angle, duration, easing, complete){
    return this.each(function(){
        var elem = $(this);

        $({deg: 0}).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function(now){
                elem.css({
                    transform: "rotate(" + now + "deg)"
                });
            },
            complete: complete || $.noop
        });
    });
};
