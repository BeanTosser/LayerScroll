// This script will get the content elements when they are available via window.onload
let introductionSection, underwaterSection;
let introductionSectionHeight, underwaterSectionHeight;

window.addEventListener("load", () => {
    introductionSection = document.getElementById("introduction");
    underwaterSection = document.getElementById("underwater");
    introductionSectionHeight = parseInt(getComputedStyle(introductionSection).height.replace(/[^0-9].]/g, '')) / window.innerWidth * 100;
    console.log("introductionSectionHeight: " + introductionSectionHeight);
    underwaterSectionHeight = parseInt(getComputedStyle(underwaterSection).height.replace(/[^0-9].]/g, '')) / window.innerWidth * 100;
    buildContentLayers();
    buildOceanBackgroundLayer(underwaterSectionHeight);
    buildCloudObjects();
})

const buildCloudObjects = function() {
//Generate random clouds within introduction layer
const numClouds = 15;
let positionTotal = 0;
let randomTotal = 0;
for(let i = 0; i < numClouds; i++){
  let depth = Math.random() * 4 + 0.5;
  let width = Math.random() * 30 + 30;
  let height = Math.random() * 15 + 20;
  let scaledWidth = 1 / depth * width;
  console.log("cloud width: " + width);
  console.log("depth: " + depth);
  console.log("scaledWidth: " + scaledWidth);
  let maxPositionX = 100 - scaledWidth * 0.2;
  let minPositionX = -scaledWidth * 0.8;
  console.log("maxPositionX(100 - scaledWidth * 0.2): " + maxPositionX);
  console.log("minPositionX(-scaledWidth * 0.8): " + minPositionX);
  let positionRandom = Math.random();
  console.log("positionRandom: " + positionRandom);
  randomTotal += positionRandom;
  let positionX = positionRandom * (maxPositionX - minPositionX) + minPositionX;
  let positionY = Math.random() * introductionSectionHeight;
  positionTotal += positionX;
  addObjectLayer({
    zIndex: -1000,
    image: "images/cloud.png",
    positionX: positionX,
    positionY: positionY,
    depth: depth,
    width: width,
    height: height,
  })
}
console.log(" ");
console.log("Average cloud position: " + (positionTotal / 15));
console.log("Average random num: " + (randomTotal / 15));
console.log(" ");
}

/*
 * Get the height:width ratio of the images (they are all the same resolution)
 * in order to set the layer height accordingly (so that the image, which is shorter than it is wide,
 * will not tile vertically)
 */
// Returns the original dimensions of an image file via callback
// code borrowed from: https://aaronsmith.online/use-javascript-to-get-original-dimensions-of-an-image-file/

function getImgSize(imgSrc, callback) {
  console.log("getImgSize");
  const newImg = new Image();

  newImg.onload = function() {
    const height = newImg.height;
    const width = newImg.width;
    console.log("loaded image dimensions: " + width + "; " + height);
    callback({ width, height });
  };

  newImg.src = imgSrc; // this must be done AFTER setting onload
}

/*
getImgSize("images/cthuljhu.1.png", function({width, height}){
  const cthulhuLayerHeight = height / width * 100;
  console.log("cthulhuLayerHeight: " + cthulhuLayerHeight);
  buildCthulhuLayers(cthulhuLayerHeight);
})
*/

// UnderwaterBackground.png modified from source: https://pxhere.com/en/photo/716419
function buildOceanBackgroundLayer(sectionHeight){
  addParallaxLayer({
    image: "images/seamlessTest.jpg",
    imageScale: 1,
    depth: 10,
    zIndex: -1001,
    height: sectionHeight,
    shouldAdjustHeight: true,
    shouldAdjustPosition: true,
    position: introductionSectionHeight
  });
}
function buildOceanForegroundLayer(sectionHeight) {
  addParallaxLayer({
    image: "images/simpleWater.png",
    imageScale: 1,
    depth: 0.9,
    zIndex: 1000,
    opacity: 0.5,
    use3dTop: true,
    shouldAdjustHeight: true,
    shouldAdjustPosition: true,
    position: introductionSectionHeight,
    height: sectionHeight
  });
}



/*
function buildCthulhuLayers(cthulhuLayerHeight){
  addParallaxLayer({
    image: "images/cthuljhu.1.png",
    position: 30,
    height: cthulhuLayerHeight,
    depth: 1.2,
    zIndex: -1002,
    shouldAdjustHeight: false
  });
  addParallaxLayer({
    image: "images/cthuljhu.2.png",
    position: 30,
    height: cthulhuLayerHeight,
    depth: 1.1,
    zIndex: -1001,
    shouldAdjustHeight: false
  })
  addParallaxLayer({
    image: "images/cthuljhu.3.png",
    position: 30,
    height: cthulhuLayerHeight,
    depth: 1,
    zIndex: -1000,
    shouldAdjustHeight: false
  })
}
*/

function buildContentLayers(){
  console.log("intro height on building content layers: " + introductionSectionHeight);
  addParallaxLayer({
    element: underwaterSection,
    depth: 1,
    zIndex: 0,
    shouldAdjustHeight: false,
    shouldAdjustPosition: false,
    position: introductionSectionHeight
  })
  addParallaxLayer({
    element: introductionSection,
    depth: 1,
    zIndex: -9999,
    shouldAdjustHeight: false,
    shouldAdjustPosition: false,
    position: 0
  })
}
/*
// Create a random starfield SVG
let starFieldElementSource = document.getElementById("starfield");
let sourceCircle = document.getElementById("starfield-circle");

for(let i = 0; i < 4; i++){
  let starFieldElement = starFieldElementSource.cloneNode(true);
starFieldElement.setAttribute("viewbox", "0 0 100 100");
starFieldElement.setAttribute("style", "width: 100%; height: 100%;");
let stars = [];
for(let j = 0; j < 300; j++){
  //   <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
  let circle = sourceCircle.cloneNode(false);
  circle.setAttribute("cx", Math.random()*window.innerWidth);
  circle.setAttribute("cy", Math.random()*window.innerHeight);
  let r = Math.random()*(4-i-0.5);
  circle.setAttribute("r", r);
console.log("Created circle with radius " + r);
  circle.style.fill = "white";
  starFieldElement.appendChild(circle);
}
let starFieldContainer = document.createElement("div");
starFieldContainer.style.width = "100vw";
starFieldContainer.style.height = "1000px";
starFieldContainer.appendChild(starFieldElement);
//starFieldElement.removeChild(sourceCircle);
if(i < 2) { 
  addParallaxLayer({element: starFieldContainer, depth: (i+0.5)/2});
} else {
addParallaxLayer({element: starFieldContainer, depth: (i+1)*2});
}
}

//document.body.removeChild(starFieldElementSource);

let blackBackground = document.createElement("div");
blackBackground.style.height = "100%";
blackBackground.style.width = "100%";
console.log("blackBackground: " + blackBackground);
blackBackground.innerText = "&nbsp;";
blackBackground.style.backgroundColor="black";
addParallaxLayer({element: blackBackground, height: 5000, depth: 11});

*/
//image, position, height, depth, imageScale