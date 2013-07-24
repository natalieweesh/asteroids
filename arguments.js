var mySum = function () {
  var total = 0;

  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  };

  return total;
};

// console.log(mySum(1,2,3,4));

Function.prototype.myBind = function (obj) {
  var that = this;
  return function () {
    that.apply(obj, arguments);
  };
};

// function printName(greeting, thing){
//   console.log(greeting + thing + this.name);
// };
//
// var apple = { name:"apple" };
// var applefunc = printName.myBind(apple);
//
// applefunc("hello ", "stupid ");

var curriedSum = function (number) {
  var count = 0;
  if (count === 0) {
    var size = number;
  }
  var arr = [];
  var closure = function(number) {
    if (count === 0) {
      count ++;
      return closure;

    } else if (arr.length < size - 1) {
      arr.push(number);
      count ++;
      return closure;

    } else if (arr.length === size - 1) {
      var total = 0;

      for (var i = 0; i < arr.length; i++) {
        total += arr[i];
      };

      return total + number;
    }
  }

  return closure(number);

}

// var sum = curriedSum(4);
// console.log(sum(1)(2)(3)(10));


var curry = function (fun, number) {
  var count = 0;
  if (count === 0) {
    var size = number;
  }
  var arr = [];
  var closure = function(number) {
    if (count === 0) {
      count ++;
      return closure;

    } else if (arr.length < size - 1) {
      arr.push(number);
      count ++;
      return closure;

    } else if (arr.length === size - 1) {
      arr.push(number);
      return fun.apply(null, arr);

    }
  }

  return closure(number);

}

// var strThing = function () {
//   var str = "";
//   for (var i = 0; i < arguments.length; i++) {
//     str += arguments[i] + " ";
//   }
//   return str + "!";
// }
//
// var sum = curry(strThing, 4);
// console.log(sum("hello1")("hello2")("hello3")("hello4"));