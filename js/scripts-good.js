﻿$(document).ready(function () {
  
  $(".form-wrapper").hide();
  $(".map-content").show();
  showMap();      

  if ($(".request-form label span").length) {
    $(".request-form label span").textShadow('1px 1px #005568');
  }
  
  $(".main-slider").each(function () {
    $(this).mainSlider();
  });
  
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
      
      sliderAnimation(0);
      $(".pic-element").stop().hide();
      
      // var timer = new RecurringTimer(function() {
        // if (lister.find(".act").index() < sliderSize-1) {
          // lister.find(".act").next(".item").click();
        // } else {
          // listerItems.eq(0).click();
        // }
      // }, 10000);
      
      listerItems.on("click",function () {
        
        $(".pic-element").stop().hide();
        
        if (!$(this).hasClass("act")) {
          
          // timer.restart();
        
          listerItems.removeClass("act");
          $(this).addClass("act");
          slides.fadeOut(250).removeClass("slide-act");
          slides.eq($(this).index()).fadeIn(250).addClass("slide-act");
          
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
  
    card.css("left",slider.offset().left + slider.width()).show();
    
    card.animate({
      left:649
    },1000);
    
    var slideTtl = slider.find("h2");
    
    slideTtl.css("position","absolute").css("left",slider.offset().left + slider.width()).show();
    
    slideTtl.animate({
      left:0
    },1000,function() {
      slideTtl.css("position","relative")
    });
    
    
    
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
  
  // Геолокация
  
  var geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function geoSuccess(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    
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
    
    $("#nearestAddress").html(nearestAddress);
    //$("#nearestPhone").html(nearestPhone);
    $("#sample query").html(nearestAddress);
    
    
    $(".map-search span").each(function() {
      
      if (!$(this).hasClass("shadow") && !$(this).children(".shadow").length) {
        $(this).textShadow('1px 1px #005568');
      }
    });
    
    myMap.setCenter([closestLat, closestLng]);
    
    addMarkers();
    
  }
  
  function geoError(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    myMap.setCenter([63.369315, 105.440191]);
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
      //333 findNearest(coords);
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
  
  // Функция, создающая необходимое количество геообъектов внутри указанной области.
  function createGeoObjects (number, bounds) {
      
      var placemarks = [];
      // Создаем нужное количество меток
      for (var i = 0; i < number; i++) {
          // Генерируем координаты метки случайным образом.
          var pointCoords = stores[i].GPS.split(",");
          var lat = pointCoords[0];
          var lng = pointCoords[1];
          if (lat >= bounds[0][0] && lat <= bounds[1][0] && lng >= bounds[0][1] && lng <= bounds[1][1]) {
            coordinates = [lat, lng];
            myPlacemark = new ymaps.Placemark(coordinates, {
              // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
              balloonContentBody: stores[i].address,
              balloonContentFooter: stores[i].openingHours
            });
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
      
      removeMarkers();
      
      var searchCoords = {
        "latitude": searchLat,
        "longitude": searchLng
      };
      
      //333 findNearest(searchCoords);
      
      
    }, function (err) {
        // Если геокодирование не удалось, сообщаем об ошибке.
        alert('error')
        
    });
    return false;
  });
  
  $(".map-search #sample").click(function() {
    $("#searchInput").val($(this).find("query").html());
    $("#searchForm").submit();
  });
  
  $("#searchForm").on("submit",function() {
    if (!$("#searchInput").val()) {
      $("#searchInput").blur();
    }
  });
  
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
  
  /* Первый слайд */
  
  if (slideNum == 0) {
    
    var box = $("#slider-box");
    var coins = $("#slider-coins");
    
    var t01 = setTimeout(function() {
      box.css("left",656).css("top",49).show().animate({
        left: 546
      },1000);
      
      
      
    },1500);
    
    var t02 = setTimeout(function() {
      coins.css("left",545).css("top",311).css("height",0).show().animate({
        height: 166,
        top: 145
      },700);
    },2500);
    //545, 145
    
  }
  
  if (slideNum == 3) {
    
    var phone = $("#slider-phone");
    var paypass = $("#slider-paypass");
    
    var t31 = setTimeout(function() {
      phone.css("left",613).css("top",165).css("width",10).css("height",10).show().animate({
        width:141,
        height:327,
        left:543,
        top:-3
      },500);
      
      /*543,-3*/
      
    },500);
    
    var t31 = setTimeout(function() {
      paypass.css("left",727).css("top",213).css("width",10).css("height",10).show().animate({
        width:155,
        height:162,
        left:655,
        top:131
      },500);
      
      /*543,-3*/
      
    },1500);
    
  }
  
  if (slideNum == 4) {
    
    var backpack = $("#slider-backpack");
    
    var t41 = setTimeout(function() {
      backpack.css("left",$(".main-slider").offset().left + $(".main-slider").width()).show().animate({
        left:525
      },1000);
      
      /*543,-3*/
      
    },500);
    
  }
  
}