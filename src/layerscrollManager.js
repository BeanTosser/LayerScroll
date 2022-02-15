// The "perspective" css property; it must be used to calculate how layers should scale to correct for their depths
const perspectiveValue = 100;

const addParallaxLayer = function(parallaxLayerConfig){//image, position, height, depth, imageScale

  // First, create the container div
  const containerDiv = document.createElement("div");
  containerDiv.className = "parallax-layer-container";
  
  // Next, create the actual visible layer
  let newLayer = document.createElement("div");
  newLayer.className="parallax-layer";
  if(!parallaxLayerConfig.image){
    throw new Error("layerscroll layers MUST have a background image!");
  }
  
  // Set all properties accordingly
  
  /* 
   * depth needs to be corrected;
   * The value of the "input" depth corresponds to the distance of the layer from the screen;
   * a value of "2" means the layer is halfway between the viewer and the screen,
   * and a value of "-2" meanas the layer is twice as far from the viewer as the screen.
   * However because we are forced to use the "perspective" css property - and it is set to 100 - 
   * a positive value represents a fraction of the distance from the viewer to the layer (where the viewer is at positoin 100).
   * A negative value, on the other hand, represents a FACTOR of the distance from the screen/content to the layer relative to the css perspective value.
   * So for example, a depth of 50px makes a layer halfway between the screen and the viewer (50/100);
   * a depth of _100px_ has the inverse effect - a layer twice as far from the viewer as the screen.
   */
  
  newLayer.style.backgroundImage = "url(" + parallaxLayerConfig.image + ")";
  newLayer.className = "parallax-layer";
  newLayer.style.transform = "translateY(" + (parallaxLayerConfig.position || 0) + "px)";
  
  // The height needs to be adjusted to account for the movement of the layer relative to the website content 
  //let newHeight = 
  
  newLayer.style.height = (parallaxLayerConfig.height || document.documentElement.clientHeight) + "px";
  newLayer.style.width = "100vw";
  //Make sure the layer is visible
  newLayer.innerHTML = "&nbsp;";
  newLayer.style.backgroundSize = (parallaxLayerConfig.imageScale || 1) * 100 + "vw";
  let depth = parallaxLayerConfig.depth || 0;
  let transformScale = 1 + (-depth / perspectiveValue);
  containerDiv.style.transform = "translateZ(" + depth + "px) scale(" + transformScale + ")";
  // Prevent the top and left sides from "pulling away" from the top and left of the page
  containerDiv.style.zIndex = depth || 1;
  
  // Nest the visible layer in its container...
  containerDiv.appendChild(newLayer);
  // ... and add the container to the page
  document.body.appendChild(containerDiv);   
}