
    var infoWindow = 0;
    var usId = 0;
    var userR;
    var user;
    var tmp = 1;
//    var userr = 'user_' + usId;
    var user0 = {
        id: usId,
        key: 'true',
        friends:[],
        name: '',
        email: '',
        pass: '',
        markers:{
            coords:{
                lat: [],
                lng: []
            },
            title: [],
            description: []
        } 
    }
    //Первая запись массива в localStorage (при авторизации)
    function firstLocalSet(){
        var str = JSON.stringify(user0);
        if (localStorage.length !== undefined) {
            usId = localStorage.length;
        }else{
            usId = 0;
        }
        userr = 'user_' + usId;
        localStorage.setItem(userr, str);
    }
    //Запись массива в localStorage
    function localSet(){
        var str = JSON.stringify(user);
        for (var i = 0; i < localStorage.length; i++) {
            if(window.location.hash == '#user=' + i){
                usId = i;
                userr = 'user_' + usId;
                localStorage.setItem(userr, str);
            } 
        };
    };
    //получение массива из localStorage
    function localGet(){
        for (var i = 0; i < localStorage.length; i++) {
            if(window.location.hash == '#user=' + i){
                usId = i;
                userr = 'user_' + usId;
                object = localStorage.getItem(userr);
                if (object !== null) {
                    user = JSON.parse(object);
                }
            } 
        }; 
    };
    // function userLocalGet(){
    //     object = localStorage.getItem(userr);
    //     if (object !== null) {
    //                 user = JSON.parse(object);
    //             } 
    //         }   function userLocalGet(){
    //             object = localStorage.getItem(userr);
    //             if (object !== null) {
    //                 user = JSON.parse(object);
    //             } 
    //         };
    function pageOnLoad() {
        hash();
        enterClick();
        regClick();
        enter1Click();
        reg1Click();
        submit1Click();
        submit2Click();
        exitClick();
        homeClick();
        allUsersClick();
        friendsClick();
        //задание параметров и создание карты
        var centerLatLng = new google.maps.LatLng(49.98986319656137, 36.235313415527344);
        var mapOptions = {
            zoom: 12,
            center: centerLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        //создание карты 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //проверка, для того, чтоб не требовало массив юзера до его создания
        if(window.location.hash !== ''){
            if(window.location.hash !== '#registration'){
                if(window.location.hash !== '#enter'){
                    if(window.location.hash !== '#allUsers'){
                        if(window.location.hash !== '#friends'){
                            localGet();
                            initialize();
                        }
                    }
                }
            }
        }
        //правый клик по карте, запись координат в user
        google.maps.event.addListener(map,'rightclick', function(event) {
            for (var i = 0; i < localStorage.length; i++) {
                if(window.location.hash == '#user=' + i){
                    usId = i;
                    userr = 'user_' + usId;
                    object = localStorage.getItem(userr);
                    if (object !== null) {   
                        userR = JSON.parse(object);
                        if(userR.key == 'true'){
                            lat = event.latLng.lat();
                            lng = event.latLng.lng();
                            var longlat = user.markers.coords.lat.length;
                            var longlng = user.markers.coords.lng.length;
                            user.markers.coords.lat[longlat] = lat;
                            user.markers.coords.lng[longlng] = lng;
                            localSet();
                            initialize();
                        }
                    }
                } 
            };
        });
        // пробежка по user.markers.coords.lat[j] и получение координат маркеров
        function initialize(){
            localGet();
                for (var j = 0; j <= user.markers.coords.lat.length; j++) {
                    var markerLatLng = new google.maps.LatLng(user.markers.coords.lat[j],user.markers.coords.lng[j]);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: markerLatLng
                    });
                    //клик по маркеру, создание инфовиндоу, запись описания в массив юзера
                    google.maps.event.addListener(marker,'click', function(event){
                        for (var i = 0; i < localStorage.length; i++) {
                            if(window.location.hash == '#user=' + i){
                                usId = i;
                                userr = 'user_' + usId;
                                object = localStorage.getItem(userr);
                                if (object !== null) {   
                                    userR = JSON.parse(object);
                                    if(userR.key == 'true'){
                                        lat = event.latLng.lat();
                                        lng = event.latLng.lng();
                                        var point = new google.maps.LatLng(lat+0.00690,lng);
                                        var label1 = '<div id="new_window">' + $('#div3').html() + '</div>'; 
                                        var infoWindow1 = new google.maps.InfoWindow({
                                            content: label1,
                                            position: point 
                                        });

                                        infoWindow1.open(map); 
                                        markerClick(infoWindow1,lat);
                                    }
                                }
                            } 
                        };
                    }); 
                    //при наведении на маркер вытаскивает данные с юхера, рисует по ним всплывающие окна.
                    google.maps.event.addListener(marker,'mouseover', function(event){
                        var curentLat = event.latLng.lat();
                        var curentLng = event.latLng.lng();
                        for (var k = 0; k <= user.markers.coords.lat.length; k++) {
                            if(user.markers.coords.lat[k] == curentLat){
                                var point1 = new google.maps.LatLng(curentLat+0.00690,curentLng);
                                var l1 = user.markers.title[k];
                                var l2 = user.markers.description[k];
                                if(l1 == null || l1 == 'undefined'||l1 == ''){
                                    var label1 = 'Data not available.' + '<br>' + 'Please, complete all fields.';
                                }else{
                                    var label1 = l1 + '<br>' + l2;
                                }
                                infoWindow = new google.maps.InfoWindow({
                                    content: label1,
                                    maxWidth: 200,
                                    position: point1
                                });
                                infoWindow.open(map);
                                break;
                            }
                        }
                    });
                    google.maps.event.addListener(marker,'mouseout', function(){
                        infoWindow.close();
                    });
                } 
        }; 
            function markerClick(infoWindow1,lat){
                $('#new_window button').click(function() {
                    var tit = $('#title').val();
                    var inf = $('#information').val();
                    for (var j = 0; j <= user.markers.coords.lat.length; j++) {
                        if(user.markers.coords.lat[j] == lat){
                            user.markers.title[j] = tit;
                            user.markers.description[j] = inf;
                        }
                    }
                    infoWindow1.close();
                    localSet();
                }); 
            }
            //клик по кнопке enter, при клике меняется хэш
            function enterClick(){
                $('#div1 #enter').click(function() {
                     window.location.hash = '#enter';
                });
            }
            //клик по кнопке registration
            function regClick(){
                $('#div2 #registration').click(function() {
                    window.location.hash = '#registration';
                });
            }
            //клик по кнопке enter, при клике меняется хэш
            function enter1Click(){
                $('#div2 #enter').click(function() {
                    location.reload();
                });
            }
            //клик по кнопке registration
            function reg1Click(){
                $('#div1 #registration').click(function() {
                    location.reload();
                });
            }
            //клик по кнопке #div1 #submit запись данных нового пользователя в localStorage
            function submit1Click(){
                $('#div1 #submit').click(function() {
                    var name = $('#div1 #name').val();
                    var email = $('#div1 #email').val();
                    var pass = $('#div1 #password').val();
                    var conf_pass= $('#div1 #conf_pass').val();
                    if(name !== '' && email !== '' && pass !== '' && conf_pass !== ''){
                        if(pass == conf_pass){
                            for (var i = 0; i < localStorage.length; i++) {
                                object = localStorage.getItem('user_' + i);
                                if (object !== null) {
                                    userR = JSON.parse(object);
                                    if(email == userR.email){
                                        tmp = 0;
                                    }
                                }
                            } 
                            if(tmp == 1){
                                user0.id = localStorage.length;
                                user0.name = name;
                                user0.email = email;
                                user0.pass = pass;
                                firstLocalSet();
                                window.location.hash = '#user=' + usId;
                                location.reload();
                            }else{
                                alert('Account already exists.');
                                location.reload();
                                tmp = 1;
                            } 
                        }else{
                            alert('Passwords do not match!');
                        }      
                    }else{
                        alert('Please complete all fields.');
                    }
                });
            }
            //клик по кнопке #div2 #submit вход пользователя на сайт
            function submit2Click(){
                $('#div2 #submit').click(function() {
                    var name = $('#div2 #name').val();
                    var email = $('#div2 #email').val();
                    var pass = $('#div2 #password').val();
                    if(name !== '' && email !== '' && pass !== ''){
                        for (var i = 0; i < localStorage.length; i++) {
                            object = localStorage.getItem('user_' + i);
                            if (object !== null) {
                                userR = JSON.parse(object);
                                if(name == userR.name && email == userR.email && pass == userR.pass){
                                    usId = userR.id;
                                    userR.key = 'true';
                                    var str = JSON.stringify(userR);
                                    userr = 'user_' + usId;
                                    localStorage.setItem(userr, str);
                                    window.location.hash = '#user=' + userR.id;
                                }
                            } 
                        }
                    }else{
                        alert('Please complete all fields.');
                    }
                });
            }
            //ф-я установка ключа при входе на сайт
            function keySet(){
                for (var i = 0; i < localStorage.length; i++) {
                    object = localStorage.getItem('user_' + i);
                    if (object !== null) {
                        userR = JSON.parse(object);
                        usId = userR.id;
                        userR.key = 'false';
                        var str = JSON.stringify(userR);
                        userr = 'user_' + usId;
                        localStorage.setItem(userr, str);
                    } 
                }
            }
            // клик по кнопке exit
            function exitClick(){
                $('#exit').click(function() {
                    window.location.hash = '#enter';
                });
            }
            // клик по кнопке allUsers
            function allUsersClick(){
                $('#allUsers').click(function() {
                    window.location.hash = '#allUsers';
                });
            }
            // клик по кнопке b_friends
            function friendsClick(){
                $('#b_friends').click(function() {
                    window.location.hash = '#friends';
                });
            }
            // клик по кнопке homepage
            function homeClick(){
                $('#homepage').click(function() {
                    for (var i = 0; i < localStorage.length; i++) {
                            object = localStorage.getItem('user_' + i);
                            if (object !== null) {
                                userR = JSON.parse(object);
                                if(userR.key == 'true'){
                                    window.location.hash = '#user=' + i;
                                }
                            } 
                        }
                });
            }
            //проверка изменения хэша
            $(window).bind('hashchange', function() {
                hash();
                location.reload();
            });
            //проверка на определенный хэш, скрытие ненужных блоков, выведение нужных
            function hash(){
                if(window.location.hash == '#enter'){
                    keySet();
                    $('#outdiv1').attr('style','display:none');
                    $('#allMap').attr('style','display:none');
                    $('#buttons1').attr('style','display:none');
                    $('#allU1').attr('style','display:none');
                    $('#friends').attr('style','display:none');
                    $('#outdiv2').attr('style','display:block');
                } 
                if(window.location.hash == '#registration'){
                    keySet();
                    $('#outdiv2').attr('style','display:none');
                    $('#allMap').attr('style','display:none');
                    $('#buttons1').attr('style','display:none');
                    $('#allU1').attr('style','display:none');
                    $('#friends').attr('style','display:none');
                    $('#outdiv1').attr('style','display:block');
                }
                if(window.location.hash == '#allUsers'){
                    setFriends();
                    $('#outdiv1').attr('style','display:none');
                    $('#outdiv2').attr('style','display:none')
                    $('#allMap').attr('style','display:none');
                    $('#friends').attr('style','display:none');
                    $('#allU1').attr('style','display:block');
                    $('#buttons1').attr('style','display:block');
                }
                if(window.location.hash == '#friends'){
                    getFriends();
                    $('#outdiv1').attr('style','display:none');
                    $('#outdiv2').attr('style','display:none')
                    $('#allMap').attr('style','display:none');
                    $('#allU1').attr('style','display:none');
                    $('#buttons1').attr('style','display:block');
                    $('#friends').attr('style','display:block');
                }
                for (var i = 0; i < localStorage.length; i++) {
                    if(window.location.hash == '#user=' + i){
                        us_get = localStorage.getItem('user_' + i);
                        user = JSON.parse(us_get);
                        usId = i;
                        $('#outdiv1').attr('style','display:none');
                        $('#outdiv2').attr('style','display:none')
                        $('#allU1').attr('style','display:none');
                        $('#friends').attr('style','display:none');
                        $('#allMap').attr('style','display:block');
                        $('#buttons1').attr('style','display:block');
                    }
                };
            }
            //получение id друзей, запись их в localStorage
            function setFriends(){
                $('#allU').html('All users:<br>');
                for (var i = 0; i < localStorage.length; i++) {
                    object = localStorage.getItem('user_' + i);
                    if (object !== null) {
                        userR = JSON.parse(object);
                        if(userR.key == 'false'){
                            var newUser = document.createElement('a');
                            newUser.href = 'index.html#user=' + userR.id;
                            newUser.innerHTML = userR.name;
                            var button = document.createElement('button');
                            button.id = i;
                            button.innerHTML = 'Add to friend';
                            var br = document.createElement('br');
                            $('#allU').append(button);
                            $('#allU').append(newUser);
                            $('#allU').append(br);
                            button.onclick = function(){
                                for (var i = 0; i < localStorage.length; i++) {
                                    object = localStorage.getItem('user_' + i);
                                    if (object !== null) {
                                        user = JSON.parse(object);
                                        if(user.key == 'true'){
                                            if(user.friends[this.id] !== this.id){
                                            user.friends[this.id] = this.id;
                                            str = JSON.stringify(user);
                                            userr = 'user_' + i;
                                            localStorage.setItem(userr, str)
                                            alert('This user has been added to your friends!');
                                            }else{
                                                alert('This user is already your friend!');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } 
                }
            }
            //получение id друзей, запись их в див friends
            function getFriends(){
                $('#friends').html('Your friends:<br>');
                for (var i = 0; i < localStorage.length; i++) {
                    object = localStorage.getItem('user_' + i);
                    if (object !== null) {
                        userR = JSON.parse(object);;
                        if(userR.key == 'true'){
                            if(userR.friends.length !== 0){
                                for (var j = 0; j < userR.friends.length; j++) {
                                    if(userR.friends[j] !== null){
                                        var newUser2 = document.createElement('a');
                                        newUser2.href = 'index.html#user=' + userR.friends[j];
                                        object2 = localStorage.getItem('user_' +  userR.friends[j]);
                                        user2 = JSON.parse(object2);
                                        newUser2.innerHTML = user2.name;
                                        var br2 = document.createElement('br');
                                        $('#friends').append(newUser2);
                                        $('#friends').append(br2);
                                    }
                                }
                            }else{
                                var div = document.createElement('div'); 
                                div.innerHTML = 'You have no friends.';
                                $('#friends').append(div);
                            }
                        }
                    } 
                }
            }
        }