// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here
  // Example function calls 
  applyFilterNoBackground(reddify);
  // applyFilterNoBackground(decreaseBlue);
  // applyFilterNoBackground(increaseGreenByBlue)



  // do not change the below line of code
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2 & 4: Create the applyFilter function here
function applyFilter(filterFunction) {
  for (let i = 0; i < image.length; i++) {
    for (let j = 0; j < image[i].length; j++) {
      var rgbString = image[i][j];
      var rgbNumbers = rgbStringToArray(rgbString);
      filterFunction(rgbNumbers);
      var newRgbString = rgbArrayToString(rgbNumbers);
      image[i][j] = newRgbString;
    }
  }
}



// TODO 7: Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunction) {
  var background = image[0][0]; // Store the background color of the image

  for (let i = 0; i < image.length; i++) {
    for (let j = 0; j < image[i].length; j++) {
      var rgbString = image[i][j];

      if (rgbString !== background) {
        var rgbNumbers = rgbStringToArray(rgbString);
        filterFunction(rgbNumbers);
        var newRgbString = rgbArrayToString(rgbNumbers);
        image[i][j] = newRgbString;
      }
    }
  }
}

// TODO 5: Create the keepInBounds function
function keepInBounds(num) {
  return Math.min(Math.max(num, 0), 255);
}


// TODO 3: Create reddify function
function reddify(array1) {
  array1[RED] = 200;
}

// TODO 6: Create more filter functions
function decreaseBlue(array2) {
  array2[BLUE] = keepInBounds(array2[BLUE] - 50);
}


function increaseGreenByBlue(array3) {
  array3[GREEN] = keepInBounds(array3[GREEN] + array3[BLUE])
}

// CHALLENGE code goes below here
