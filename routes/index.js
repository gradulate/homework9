function User(name){
    this.name = name;
}
User.prototype.hello = function(who){
    console.log("hello " + who.name);
};

console.log("Проверка связи");

exports.User = User;
//---------------------------
function extend(Child, Parent) {
    var F = function() { }
    F.prototype = Parent.prototype
    Child.prototype = new F()
    Child.prototype.constructor = Child
    Child.superclass = Parent.prototype
}

// задаємо батьківський клас
function Mario_Red(name,walkSpeed) {
    this.name = name;
    var speed = walkSpeed;
    this.distance = 0;
    this.dist = 5;  // відстань ураження
    // добавить метод, использующий private speed
    this.walk = function(time) {
        this.distance = this.distance + time*speed
    }
}

// Методи
Mario_Red.prototype = {
    speed: 0,
    power: 20,  // сила
    mind: 35,   // розум
    toString: function() {
        return this.name},
    run: function(speed) {
        this.speed += speed;
        console.log(this.name + ' біжить зі швидкістю ' +
        this.speed);
    },

    stop: function() {
        this.speed = 0;
        console.log(this.name + ' стоїть');
    }

}

// задаємо класс-нащадок
function Mario_Blue(name, walkSpeed, flySpeed) {
    Mario_Red.apply(this, arguments); // викликаємо метод батька
    this.dist = 6;
    Mario_Blue.superclass.constructor.call(this, name, walkSpeed)
    this.fly = function(time) {
        this.distance = this.distance + time*flySpeed
    }
}

/* наслідуємо методи батьківського класу
 2-й спосіб.
 створює новий об'єкт з властивостями прототипа батька*/
Mario_Blue.prototype = Object.create(Mario_Red.prototype);

// методи нащадка
Mario_Blue.prototype.run = function() {
    Mario_Red.prototype.run.apply(this); // визиваємо метод батька
    console.log(this + " підпригує!");
};

extend(Mario_Blue, Mario_Red);// викликаэмо ф-ю наслідування класів

exports.Mario_Blue = Mario_Blue;
exports.Mario_Red = Mario_Red;



//Ф-Я ХАОТИЧНОГО РУХУ ПРАЦЮЄ. ЗАКОМЕНТОВАНА ТОМУ, ЩО НА ДАННИЙ
//МОМЕНТ Я ВИКОРИСТОВУЮ РУХ ПО КООРДИНАТАМ

//-----------------------------
// хаотичний рух з часовим інтервалом у 1с
// зупиняється при натисканні мишкою на елемент



//var i = 1;
//
//  var timer = setInterval(  // ф-ю будемо викликати кожну секунду
//     function MarioLoad() {  // хаотичний рух
//                    MR = document.getElementById('MR'); // виловлюємо id елемента
//                    MB = document.getElementById('MB');
//                        RandX = getRandomInteger(-1, 5); // координати задаємо ф-ю випадкових чисел
//                        RandY = getRandomInteger(-1, 5);
//                        move(RandX, RandY);    // виклик ф-ї руху
//                        i++;
//                }, 1000);  // інтервал 1 сек
//
//
//
//
//      // ф-я генерації випадкових цілих чисел для хаотичного руху
//    randomNumber = Math.random();
//
//    function getRandomInteger(min, max){
//      return Math.floor(Math.random() * (max - min + 1)) + min;
//      //return Math.random();
//    }
//
//document.onmousedown=function(){
//        stop=1;
//        clearInterval(timer); // при натисненні кнопки хаотичний рух припиняється
//    };


// ------------------
// рух мишкою

function agent(v) {
    return( Math.max(navigator.userAgent.toLowerCase().indexOf(v),0));
}

function CoordXY(e,v) {
    return(v?(agent('msie')?event.clientY+
    document.body.scrollTop:e.pageY):(agent('msie')?event.clientX+
    document.body.scrollTop:e.pageX));
}

function Motion_Elem(d,e) {
    function drag(e) {
        if(!stop) {
            d.style.top=(tX=CoordXY(e,1)+oY-eY+'px'); // діву задаємо стиль-верхні координати
            d.style.left=(tY=CoordXY(e)+oX-eX+'px'); // ліві координати
        }
    }
    var oX=parseInt(d.style.left), // координати положення елементів
        oY=parseInt(d.style.top),
        eX=CoordXY(e),
        eY=CoordXY(e,1),
        tX,
        tY,
        stop;

    document.onmousemove=drag;
    document.onmouseup=function(){
        stop=1;
    };
}

//---------------------
// рух клавіатурою

function MarioClick(id) {
    MR = id;
};

var MR = null;

function move(vX, vY) { // ф-я руху
    var x = MR.offsetLeft + vX * 10;
    var y = MR.offsetTop + vY * 10;

    if(x>0 && x<730){  // умови непроходження за межі поля
        x = x;
    }
    else if (x<0) {
        x = -x;
    }
    else {
        x = x-20;
    }

    if(y>0 && y<315){
        y = y;
    }
    else if (y<0){
        y = -y;
    }
    else {
        y = y-20;
    }


    MR.style.left =  x + "px"; // тепер це число задаємо як стисль діва, у пікселях
    MR.style.top = y + "px";

    document.getElementById('RedX').value = x;
    document.getElementById('RedY').value = y;
}

// ф-я прослуховування натиснення клавіш клавіатури
addEventListener("keydown", function(event) {
    if (event.keyCode == 39)
        move(1, 0);
    if (event.keyCode == 37)
        move(-1, 0);
    if (event.keyCode == 38)
        move(0, -1);
    if (event.keyCode == 40)
        move(0, 1);
});

//------------------------
// рух елемента за мишкою

function field(e) {
    var MB = document.getElementById('MB');
    var field = document.getElementById('field');

    var fieldCoords = field.getBoundingClientRect();
    var fieldInnerCoords = {
        top: fieldCoords.top + field.clientTop,
        left: fieldCoords.left + field.clientLeft
    };

    MB.style.left = e.clientX - fieldInnerCoords.left + 'px';
    MB.style.top = e.clientY - fieldInnerCoords.top + 'px';

};
// -------------
// рух по заданій траекторії



var i = 0;
function MarioLoadWay() {  // хаотичний рух
    var points = [
        [600, 70],
        [430, 170],
        [420, 290],
        [260, 200]
    ];

    MB.style.left =  points[i][0] + "px";
    MB.style.top = points[i][1] + "px";
    i = i+1;
    if(i < 4){
        setTimeout("MarioLoadWay()",1000);
    }
};

function MarioLoadWayR() {  // хаотичний рух
    var points = [
        [600, 70],
        [430, 170],
        [420, 290],
        [260, 200]
    ];

    MR.style.left =  points[i][0] + "px";
    MR.style.top = points[i][1] + "px";
    i = i+1;
    if(i < 4){
        setTimeout("MarioLoadWayR()",1000);
    }
};