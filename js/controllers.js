var ucControllers = angular.module('ucControllers', []);

var ae = angular.element;

function isInt(value) {
  return !isNaN(value) && parseInt(value) == value;
}

ucControllers.controller('GlobalCtrl', function($scope){
  $scope.globalMap = {};
  
  //hex manipulation
  //add hex
  $scope.addHex = function() {
    //validation
    if(!isInt(ae("#x-coord").val())){
      ae("#x-coord").parent().addClass('has-error');
      ae("#add-hexes-message").show().html('X should be integer');
    } else if(!isInt(ae("#y-coord").val())) {  
      ae("#x-coord").parent().removeClass('has-error');
      ae("#y-coord").parent().addClass('has-error');
      ae("#add-hexes-message").show().html('Y should be integer');
    
    } else {
      ae("#y-coord").parent().removeClass('has-error');
      ae("#add-hexes-message").hide().html('');
      var hex = {};
      hex["x"] = ae("#x-coord").val();
      hex["y"] = ae("#y-coord").val();
      hex["terrain"] = ae("#terrain").val();
      var hexToWrite = hex["x"] + " " + hex["y"];
      $scope.globalMap[hexToWrite] = hex;
    }
  };
  
  //delete hex
  $scope.deleteHex = function(){
    var hex = {};
    hex["x"] = ae("#x-coord").val();
    hex["y"] = ae("#y-coord").val();
    var hexToDelete = hex["x"] + " " + hex["y"];
    delete $scope.globalMap[hexToDelete];
  };
  
  //save map
  $scope.saveMap = function(){
    localStorage['globalMap'] = JSON.stringify($scope.globalMap);
  };
  
  //load map
  $scope.loadMap = function(){
  $scope.globalMap = JSON.parse(localStorage['globalMap']);
  console.log($scope.globalMap);
  };
  
  //get hex coordinates when hex is clicked
  $scope.hexClick = function(x, y) {
    ae('#x-coord').val(x);
    ae('#y-coord').val(y);
  };
    
  //clear map
  $scope.clearMap = function(){
    $scope.globalMap = {};
  };
  
  //empty save data
  $scope.clearSave = function(){
    localStorage.removeItem('globalMap');
  };
  
  //add empty hexes
  $scope.getMapDimensions = function(){
    var maxX = 0;
    var maxY = 0;
    var minX = 0;
    var minY = 0;
    angular.forEach($scope.globalMap, function(value, key){
      if(value.x>=0 && value.x>maxX){maxX = value.x;};
      if(value.y>=0 && value.y>maxY){maxY = value.y};
      if(value.x<0 && value.x<minX){minX = value.x;};
      if(value.y<0 && value.y<minY){minY = value.y};
    });
    console.log("maxX="+maxX+"minX="+minX);
    console.log("maxY="+maxY+"minY="+minY);
  };

  $scope.$watch(
    function () { return document.getElementById('hexes-anchor').innerHTML },  
    function(newval, oldval){
        //console.log(newval, oldval);
        //console.log('map changed');
        jQuery('#debug').append('map changed'+'<br>');
        $scope.drawMap();
    }, true);
  
  //loads of jquery code. yes, it doesn't belong here. no, I don't know where does it belong yet.
  
  //draw the map
  $scope.drawMap = function() {
    //variables for determining map size
    var maxX = 0;
    var maxY = 0;
    var minX = 0;
    var minY = 0;
    var maxXY = 0;
    var minXY = 0;
    var hexWidth = 154;//this includes horizontal margin between hexes
    var hexHeight = 172;//this DOES NOT include vertical margin between hexes
    var hexVerticalOffset = 42;
    
    //position hexes
    jQuery('.hex').each(function(){
      var x = jQuery(this).data("x");
      var y = jQuery(this).data("y");
      var xPos = x*hexWidth-hexWidth/2;
      if(y%2!=0){xPos+=hexWidth/2};
      var yPos = y*hexHeight;
      if(y>0){yPos-=hexVerticalOffset*y};
      if(y<0){yPos+=hexVerticalOffset*Math.abs(y)};
      jQuery(this).css('top', yPos).css('left', xPos).css('z-index', 10);
      
      //set data to determine map size
      if(x>=0 && x>maxX){maxX = x; maxXY = y};
      if(y>0 && y>maxY){maxY = y};
      if(x<0 && x<minX){minX = x; minXY = y};
      if(y<0 && y<minY){minY = y};
    });
    
    //yet another cycle to determine map size, thanks to odd rows' horizontal offset
    jQuery('.hex').each(function(){
      var x = jQuery(this).data("x");
      var y = jQuery(this).data("y");
      if(x>=0 && x==maxX && y%2!=0 && maxXY%2==0){maxX = x; maxXY = y};
      if(x<0 && x==minX && y%2==0 && minXY%2!=0){minX = x; minXY = y};
    });
    
    //set map size
    if((maxXY%2!=0 && minXY%2!=0)||(maxXY%2==0 && minXY%2==0)){
      var mapWidth = (maxX - minX + 1)*hexWidth;
    } else {
      var mapWidth = (maxX - minX + 1.5)*hexWidth;
    };
    //if(maxXY%2!=0){mapWidth+=hexWidth/2};
    jQuery('#debug').append(maxX+" ").append(maxXY)
    .append("<br>"+minX+" ").append(minXY+"<br>"+"<br>");
    var mapHeight = (maxY - minY + 1)*(hexHeight - hexVerticalOffset)+hexVerticalOffset;
    jQuery('#map').css('width', mapWidth).css('height', mapHeight).css('background','#dde');
    
    //set view offset
    if(minXY%2==0) {
      var viewOffsetX = (Math.abs(minX)+1)*hexWidth;
    } else {
      var viewOffsetX = (Math.abs(minX)+0.5)*hexWidth;
    };
    //var viewOffsetX = (Math.abs(minX)+1)*hexWidth;
    //if(maxXY%2!=0 && minXY%2!=0){viewOffsetX-=hexWidth/2};
    //var viewOffsetY = (Math.abs(minY)||0.5)*hexHeight + hexVerticalOffset;
    var viewOffsetY = (Math.abs(minY))*(hexHeight - hexVerticalOffset) + hexHeight/2;
    //jQuery('#debug').append(minY+" "+ viewOffsetY +"<br>");
    //if((maxY - minY)%2!=0){viewOffsetY-=hexVerticalOffset};
    jQuery('#hexes-anchor').css('top', viewOffsetY).css('left', viewOffsetX);
  };
});