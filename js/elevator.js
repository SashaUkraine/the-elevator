Array.prototype.injectArray = function( idx, arr ) {
    return this.slice( 0, idx ).concat( arr ).concat( this.slice( idx) );
};
angular.module("elevator", []).
  controller("ElevatorCtrl", ["$scope", "$interval", function ($scope, $interval) {
    // Object representing the car
    var car = $scope.car = {
      active: function (n) {
        return this.floor == n;
      },
      state: function () {
        var r = this.occupied ? "Occpd " : "Empty ";
        switch (this.dir) {
          case  1: r += "↑↑↑↑"; break;
          case -1: r += "↓↓↓↓"; break;
          case  0: r += this.open ? "OPEN" : "STOP";
        }
        return r;
      },
      canOpen: function (n) {
        if(this.dir == 0 && this.floor == n){
          return true;
        }else{
          return false;
        }
      },
      stepIn: function () { this.occupied = true },
      stepOut: function () { this.occupied = false },
      dir: 0,
      floor: 0,
      open: false,
      occupied: false,
    }
    
    // Object representing the control panel in the car
    $scope.panel = {
      btnClass: function (n) {
        if(control.route.includes(n))
          return 'active-panel-btn';
      },
      press: function (n) {
        control.callElevator(n, 'within');
      },
      stop: function () {
        control.stop();
      }
    }

    // Floors
    var floors = $scope.floors = [];
    floors.push({title:"G"});
    for (var i=1; i<=10; i++) floors.push({title:i});
    

    // Let's have them know their indices. Zero-indexed, from top to bottom.
    // Also let's initialize them.
    floors.forEach(function (floor,n) {
      floor.n = n;
      floor.open = false;
      floor.light = null;
    });


    // Teaching car to go up, down and sit still
    car.go = function(dir){
      this.dir = dir;
      this.floor += dir;
    };


    // Controlling module
    var control = $scope.control = {
      route: [],
      getDir:  function(from, to){
        if(from - to != 0)
         return Math.sign(from - to) * -1;
        return 0;
      },
      callElevator: function(floor, mode = 'outside'){
        console.log('Lift called on %f th floor', floor);
        //In case lift was stationary and no command was given before.
        if(this.route.length == 0){
          car.dir = this.getDir(car.floor, floor);
        }
        this.addNewStop(floor);
      },
      addNewStop: function (floor) {
        this.route.push(floor);

        var priority_route_stops = [];
        var temp = this.route.slice();
        //Loop through stops, prioritize if same direction
        for(var i = 0; i < this.route.length; i++)
        {
          var stop = this.route[i];
          if(this.getDir(car.floor, stop) == car.dir){
            priority_route_stops.push(stop);
            delete temp[i];
          }
        }
        //Sort in order of initial movement
        if(car.dir != 0)
          priority_route_stops.sort(function(a, b) {
            if(car.dir == -1){
              return b - a;
            }else{
              return a - b;
            }
        });
        //Reassign corrected values.
        this.route = temp.injectArray(0, priority_route_stops).filter(function(n){ return n != undefined });
      },
      openCar: function(){
        car.open = true;
      },
      closeCar: function(){
        car.open = false;
      },
      stop: function () {
        this.route = [];
      },
      manageLights: function(){
        floors.forEach( function(floor, index) {
          if(index == car.floor){
            if(car.occupied) floor.light = "red"
            else floor.light = "green";
          }else{
            floor.light = "";
          }
        });
      },
      run: function() {
        console.log(this.route);
        var dir = 0;
        if(this.route[0]!=null) dir = this.getDir(car.floor, this.route[0]);
        //Move car
        if(!car.open){
          car.go(dir);
        }
        this.manageLights();
        
        //Remove stop after arrived
        if(dir == 0 ) this.route.shift();
        
      }
    }

    $interval(function () {
      control.run();
    }, 1000);
  }]). 
  filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });