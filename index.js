/*
addImageParallaxLayer({
  image: "images/vineBackground.png", 
  position: 0, 
  height: 1000,
  depth: 0.75,
  imageScale: 1
});
*/

addImageParallaxLayer({
  image: "images/rockBackground.jpg", //https://www.maxpixel.net/static/photo/1x/Texture-Background-Seamless-Stone-Rocks-1657467.jpg
  position: 1000, 
  height: 1000,
  depth: 2,
  imageScale: 0.1,
  use3dTop: true,
  use3dBottom: true
});

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
  addImageParallaxLayer({element: starFieldContainer, depth: (i+0.5)/2});
} else {
addImageParallaxLayer({element: starFieldContainer, depth: (i+1)*2});
}
}

//document.body.removeChild(starFieldElementSource);

let blackBackground = document.createElement("div");
blackBackground.style.height = "100%";
blackBackground.style.width = "100%";
console.log("blackBackground: " + blackBackground);
blackBackground.innerText = "&nbsp;";
blackBackground.style.backgroundColor="black";
addImageParallaxLayer({element: blackBackground, height: 5000, depth: 11});

*/
//image, position, height, depth, imageScale