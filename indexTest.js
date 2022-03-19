let elements = [];
for(let i = 0; i < 3; i++){
  let element = document.getElementById("s" + (i+1));
  console.log("element: " + element);
  elements.push(element);
}


window.addEventListener("load", () => {
/*
elements.forEach((element, index) => {
  let elementPosition = element.getBoundingClientRect().top;
  let relativePosition = elementPosition / screen.width * 100;
  console.log("elementPos: " + elementPosition + "; relative: " + relativePosition);
  addParallaxLayer({
    depth: index * 3 + 5,
    zIndex: -index,
    shouldAdjustHeight: false,
    element: element,
    position: relativePosition
  });
})
*/

let hrIndicator = document.getElementById("hr_indicator");
let hrElement = document.getElementById("visual");
let lastScrollTop;

console.log("element top: " + hrElement.getBoundingClientRect().top);
console.log("scrollY: " + window.scrollY);

lastScrollTop = (hrElement.getBoundingClientRect().top + document.body.scrollTop) + "px";
hrIndicator.innerText = lastScrollTop;

window.addEventListener("resize", () => {
  hrIndicator.innerText = (hrElement.getBoundingClientRect().top + lastScrollTop) + "px";
console.log("element top: " + hrElement.getBoundingClientRect().top);
console.log("scrollY: " + lastScrollTop);
})
document.body.addEventListener("scroll", () => {
lastScrollTop = document.body.scrollTop;
hrIndicator.innerText = (hrElement.getBoundingClientRect().top + lastScrollTop) + "px";
console.log("element top: " + hrElement.getBoundingClientRect().top);
console.log("scrollY: " + lastScrollTop);
})

});

  addParallaxLayer({
    image: "images/UnderwaterBackground.png",
    imageScale: 1,
    depth: 3,
    zIndex: -1001,
    shouldAdjustHeight: true,
    height: 100
  });

// UnderwaterBackground.png modified from source: https://pxhere.com/en/photo/716419
function buildOceanBackgroundLayer(element){
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