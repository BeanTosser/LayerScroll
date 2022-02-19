//TODO see if geting rid of scale will fix 3d problems

/*
3d objects (using perspective and translateZ) shifting out of place horizontally on window resize (but not in responsive view!)

I am trying to produce a parallax effect by using the perspective and transform: translateZ css properties. 

I have everything working with one exception - the further away from the screen (ie 0pz) depth I translateZ a div to, The more the div becomes horizontally offset from it's intended position.

At first I Thought I was fixing this problem by adding seemingly arbitrary transform-origin tags to the divs, but I quickly realized the fix would only work for a given window size; if I changed the window size, the div would shift again.

However, if i open the developer tools panel and switch to responsive view, this no longer ahppens! the div is correctly placed regardless of the window size.

I suspect this has something to do with the scroll bar, which obviously isn't present in the responsive view.

Is there any way around this problem?
*/

// The "perspective" css property; it must be used to calculate how layers should scale to correct for their depths
const perspectiveValue = 1;

const addImageParallaxLayer = function(parallaxLayerConfig){//element, image, position, height, depth, imageScale, use3dTop, use3dBottom, zIndex

  //TODO: sanity check inputs
  if(!parallaxLayerConfig.zIndex){
	throw new Error("zIndex is a required parameter for addImageParallaxLayer()!");
  }
  // Next, create the actual visible layer
  let newLayer; 
  if(parallaxLayerConfig.image){
    newLayer = makeImageLayer(parallaxLayerConfig.image, parallaxLayerConfig.imageScale);
  } else if (parallaxLayerConfig.element){
    newLayer = parallaxLayerConfig.element;
  } else {
    throw("parallaxLayerConfig must contain a either an image or HTML element");
  }

  newLayer.className="parallax-layer";
  
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
  
  newLayer.className = "parallax-layer";
  newLayer.style.top = (parallaxLayerConfig.position || 0) + "px";
  //newLayer.style.transform = "translateY(" + (parallaxLayerConfig.position || 0) + "px)";
  
  // The height needs to be adjusted to account for the movement of the layer relative to the website content 
  let newHeight;
  if(parallaxLayerConfig.depth && parallaxLayerConfig !== "0"){
    newHeight = 1 / parallaxLayerConfig.depth * parallaxLayerConfig.height;
  } else {
    newHeight = parallaxLayerConfig.height;
  }
  
  console.log("newHeight: " + newHeight);

  newLayer.style.height = newHeight + "px";
  newLayer.style.width = "100vw";
  
  let depth;
  //=IF(A10<0,100*(A10+1),100-100/(A10+1))
  if(parallaxLayerConfig.depth < 1) {
    depth = perspectiveValue * (1-parallaxLayerConfig.depth);
  } else {
    depth = perspectiveValue*(-(parallaxLayerConfig.depth-1));
  }
  console.log("Converted depth: " + depth);
  let transformScale = 1 + (-depth / perspectiveValue);
  newLayer.style.transform = "translateZ(" + depth + "px) scale(" + transformScale + ")";
  
  // Assign an appropriate z-index to the layer so that it will appear in front of and/or behind other layers logically
  newLayer.style.zIndex = parallaxLayerConfig.zIndex;
  console.log("Adjusted zIndex: " + newLayer.style.zIndex);
  
  // ... and add the container to the page
  document.body.appendChild(newLayer);   
  
  // Rotate copies of the layer 90 degrees and place them even with the top and bottom of this layer to add additional sense of depth
  if(parallaxLayerConfig.use3dTop){
    make3dLayer(newLayer, transformScale, depth, parallaxLayerConfig.position || 0, newHeight, true);
  }
  if(parallaxLayerConfig.use3dBottom){
    make3dLayer(newLayer, transformScale, depth, parallaxLayerConfig.position || 0, newHeight, false);
  }
}

const make3dLayer = function(layer, scale, depth, position, height, isTop){
  let new3dLayer = layer.cloneNode(true);
  new3dLayer.style.width = "1000vw";
  new3dLayer.style.left = "-500vw";
  new3dLayer.style.zIndex = layer.style.zIndex - 1;
  let rotationDirection = -1;
  if(isTop){
    //Rotate about the top edge of the layer
    new3dLayer.style.transformOrigin = "50% 0% " + depth + "px";
  new3dLayer.style.top = (position + height/2) + "px";
  } else {
    // Rotate about the bottom edge of the layer
    new3dLayer.style.transformOrigin = "50% 100% " + depth + "px";
  new3dLayer.style.top = (height / 2) + "px";
    rotationDirection = 1;
  }
  //I'm not sure why a rotateX value of 1 degree actually results in a 90 degree rotation, but such is in fact the case
  new3dLayer.style.transform = "translateZ(" + depth + "px) scale(" + scale + ") rotateX(" + rotationDirection + "deg)";
  document.body.appendChild(new3dLayer);
}

const makeImageLayer = function(background, imageScale){
    newLayer = document.createElement("div"); 
  //Make sure the layer is visible
  newLayer.innerHTML = "&nbsp;";
  //Apply the image
  newLayer.style.backgroundImage = "url(" + background + ")";
  //Scale the background
  newLayer.style.backgroundSize = (imageScale || 1) * 100 + "vw";
  return newLayer;
}