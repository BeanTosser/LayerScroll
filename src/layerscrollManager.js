let style = getComputedStyle(document.documentElement);

let perspectiveValue = style.getPropertyValue("--perspective-value");
perspectiveValue = parseInt(perspectiveValue.slice(0,perspectiveValue.length-2));

/*
 * Unlike the standard parallaxLayer, the elementHeightTrackingLayer will dynamically match it's height to an existing DOM element
 * This gives the advantage of allowing for more reponsive pages and "standard" web page content
 * However, the effect will only work well with vertically tiling images.
 */
 
 /*
  * parallaxLayerConfig = {
  *   element,
  *   image,
  *   depth,
  *   imageScale,
  *   opacity,
  *   use3dTop,
  *   use3dBottom,
  *   zIndex 
  * }
  */

let heightTrackingLayersAndElements = [];

const addElementHeightTrackingLayer = function(parallaxLayerConfig){
  window.addEventListener("load", () => {
  console.log("window loaded");
  modifiedParallaxLayerConfig = {
    ...parallaxLayerConfig,
  }
  //
  if(!parallaxLayerConfig.position){
    /*
     * If the user reloads the page and the browser does not automatically return the scroll position to zero,
     * the code must account for it in order to adjust the position;
     * By default, place the tracking layer at the same position as the element it is tracking.
     * results of getBoundingClientRect are relative to the viewport/scroll position, so they need to be adjusted
     * in case the user reloaded the page and the browser did not automatically reset the scroll positio to zero.
     */
    let adjustedLayerHeight = 1 / parallaxLayerConfig.depth * parallaxLayerConfig.element.clientHeight;
    let adjustedElementTop = parallaxLayerConfig.element.getBoundingClientRect().top + document.body.scrollTop;
    // All layer style properties specified in relative units, so convert pixels to VWs
    modifiedParallaxLayerConfig.position = adjustedElementTop / screen.width * 100;
   console.log("element pos: " + parallaxLayerConfig.element.getBoundingClientRect().top);
  }
  
  // Will return an array of 1-3 layers depending on whether 3d layers are used
  const newElementHeightTrackingLayers = addParallaxLayer(modifiedParallaxLayerConfig);
  
  const newHeightTrackingLayersAndElements = newElementHeightTrackingLayers.map(layer => {
    layer.style.height = parallaxLayerConfig.element.clientHeight + "px";
    return {layer: layer, element: parallaxLayerConfig.element, currentHeight: parallaxLayerConfig.element.clientHeight, currentPosition: adjustedElementTop} 
  });
  // Concatenate the new layers and their tracked elements onto the array
  heightTrackingLayersAndElements = [...heightTrackingLayersAndElements, ...newHeightTrackingLayersAndElements];

  const adjustTrackingLayerHeight = function(event){

    layers.forEach(layer >= {
      layer.style.height = 1 / depth * event.target.clientHeight;
    })
  }
  
  
  
  
  
  
  const adjustTrackingLayerPosition = function(){
    //Start here! replacing window.resize event; it is horribly inefficient to check every element for chanes with ever window resize!   
  }
  
  
  
  
  
  if(parallaxLayerConfig.depth < 1) {
    parallaxLayerConfig.element.depth = perspectiveValue * (1-parallaxLayerConfig.depth);
  } else {
    parallaxLayerConfig.element.depth = perspectiveValue*(-(parallaxLayerConfig.depth-1));
  }
  
  parallaxLayerConfig.element.addEventListener("resize", adjustTrackingLayerHeight);
  parallaxLayerConfig.element.addEventListener("move", adjustTrackingLayerPosition);
  // Pass parameters to the functions
  parallaxLayerConfig.element.layers = newElementHeightTrackingLayers;
  parallaxLayerConfig.element.depth = parallaxLayerConfig.depth;
}

// Whenever the window size changes, check to make sure the element being tracked didn't responsively change it's height or position
const checkElementHeightTrackingLayers = function() {
  heightTrackingLayersAndElements.forEach(layerObject => {
    if(layerObject.element.clientHeight !== layerObject.currentHeight){
      // The layer's height is adjusted to reflect the speeding or slowing affect that depth has on scroll speed (and thus where the element appears on the page while scrolling through it)
      const relativeHeightChange = layerObject.currentHeight - layerObject.element.clientHeight;
      layerObject.currentHeight = layerObject.currentHeight * relativeHeightChange;
      layerObject.layer.top = layerObject.currentHeight / screen.width * 100 + "px";
    }
    let position = layerObject.element.getBoundingClientRect().top;
    if(layerObject.element.getBoundingClientRect().top + document.body.scrollTop !== layerObject.currentPosition){
      layerObject.currentPosition = position;
      // All layer style properties specified in relative units, so convert pixels to VWs
      layerObject.layer.style.top = position / screen.width * 100 + "vw";
    }
  })
}


/* ParallaxLayerConfig = {
 *   element, 
 *   image, 
 *   position, 
 *   height, 
 *   depth, 
 *   imageScale, 
 *   opacity, 
 *   use3dTop, 
 *   use3dBottom, 
 *   shouldAdjustHeight, 
 *   zIndex
 */
const addParallaxLayer = function(parallaxLayerConfig){
  console.log("%cparallaxLayerConfig.position: " + parallaxLayerConfig.position, "color: red");
  //For debugging: draw horizontal lines where the top and bottom of the layer should be
  /*
  let hr1 = document.createElement("hr");
  hr1.style.top = parallaxLayerConfig.position || 0 + "vw";
  hr1.style.color = "green";
  hr1.style.position = "absolute";
  hr1.style.width = "100%";
  hr1.style.margin = 0;
  let hr2 = hr1.cloneNode(false);
  hr2.style.top = parallaxLayerConfig.position || 0 + parallaxLayerConfig.height + "vw";
  hr2.style.color = "red";
  document.body.appendChild(hr1);
  document.body.appendChild(hr2);
  */addElementHeightTrackingLayer
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
  //newLayer.style.transform = "translateY(" + (parallaxLayerConfig.position || 0) + "px)";
  
  // The height needs to be adjusted to account for the movement of the layer relative to the website content 
  let newHeight;
  if(parallaxLayerConfig.depth && parallaxLayerConfig.depth !== 1 &&
    (parallaxLayerConfig.shouldAdjustHeight === undefined || parallaxLayerConfig.shouldAdjustHeight === true)){
    newHeight = 1 / parallaxLayerConfig.depth * parallaxLayerConfig.height;
  } else {
    newHeight = parallaxLayerConfig.height;
  }



  newLayer.style.height = newHeight + "vw";
  newLayer.style.width = "100vw";
  newLayer.style.transformOrigin = "top";
  
  let depth;
  //=IF(A10<0,100*(A10+1),100-100/(A10+1))
  if(parallaxLayerConfig.depth < 1) {
    depth = perspectiveValue * (1-parallaxLayerConfig.depth);
  } else {
    depth = perspectiveValue*(-(parallaxLayerConfig.depth-1));
  }

  let transformScale;
  if(depth != 0) {
    transformScale = 1 + (-depth / perspectiveValue);
  } else {
    transformScale = 1;
  }



  
  newLayer.style.opacity = parallaxLayerConfig.opacity;
  
  /*
   * translateZ causes undesireable horizontal displacement.
   *
   * ---Explanation---
   * As a layer's depth goes up/the layer pushes further away from the observer,
   * It's top and botom edges squeeze closer together towards the center - in other words the layer gets smaller.
   * We correct for this by scaling the layer back up - however, scaling does not push the top and
   * bottom edges of hte layer back apart; rather, it only pushes the bottom edge down.
   * As a result, the layer will be placed further down the page than it would be if translateZ had not been applied
   *
   * solution: subtract half of layer's SCALED height from it's style.top
   */

  
  /*
   * Presently there is a problem with the top of any layer with depth != 0 && position === 0 not lining up with the 
   * top of the screen; the amount by which it is displaced depends on the screen width, so changing window width
   * will change the displacement in real time as well
   * I have yet to find a solution to this issue; it is a major todo, but for now getting some kind of production build of
   * the demo site up and running is priority # 1
   */
  let adjustedPositionString = "calc(" + (parallaxLayerConfig.position || 0) + "vw - 50vh * " + (-depth / 100) + ")";
  console.log("%cadjustedPositionString: " + adjustedPositionString, "color: blue");



  //let adjustedPosition = parallaxLayerConfig.position || 0;
  let screenHeightInPixels = screen.height;

  newLayer.style.top = adjustedPositionString;
  newLayer.style.transform = "translateZ(" + depth + "vw) scale(" + transformScale + ")";
  
  // Assign an appropriate z-index to the layer so that it will appear in front of and/or behind other layers logically
  newLayer.style.zIndex = parallaxLayerConfig.zIndex;
  
  // ... and add the container to the page
  document.body.appendChild(newLayer);   
  
  let layers = [];
  // This is PROBALY the only layer since 3d layers are experimental and not recommended for use at present
  layers.push(newLayer);

  /* 
   * !!! NOTE !!!
   *
   * "3D" layers are experimental and don't work well at the moment. They render slowly and poorly at desktop resolutions
   * and suffer from depth-related texture distortion.
   */
  // Rotate copies of the layer 90 degrees and place them even with the top and bottom of this layer to add additional sense of depth
  if(parallaxLayerConfig.use3dTop){
    layers.push(make3dLayer(newLayer, transformScale, depth, parallaxLayerConfig.position || 0, parallaxLayerConfig.height, newHeight, true));
  }
  if(parallaxLayerConfig.use3dBottom){
    layers.push(make3dLayer(newLayer, transformScale, depth, parallaxLayerConfig.position || 0, parallaxLayerConfig.height, newHeight, false));
  }
  return layers;
}

// NOTE: not recommended for use with short (<100vh) layers. Top and bottom layers can have occlusion issues.
// There is no way around this (at least as far as I know at this point)
const make3dLayer = function(layer, scale, depth, position, initialHeight, depthAdjustedHeight, isTop){
  let new3dLayer = layer.cloneNode(true);
  new3dLayer.style.zIndex = layer.style.zIndex - 1;

  /* 
   * Stretch the layer's height to make it recede far into the background (because it is rotated, 
   * the layer's height is actually depth along the z-axis')
   */
  let adjustedHeight = 1000;
  //stretch the layer's width so that the edges don't recede from the sides of the window in the distance
  let adjustedWidth = 1000;

  new3dLayer.style.height = adjustedHeight + "vw";
  new3dLayer.style.width = adjustedWidth + "vw";
  // Shift the   ...
  
  /*
   * Setting the horizontal transform origin to "center" simplifies the math for placing the new 3d layer horizontally.
   * Now we can just move the new layer left by half its width to center it 
   */
  new3dLayer.style.transformOrigin = "center top";
  
  let leftDisplacement;
  if(depth < 0){
    leftDisplacement = -adjustedWidth / 2 / scale - 50;
  } else if(depth > 0) {
    leftDisplacement = -adjustedWidth / 2 * scale - 50;
  } else {
    leftDisplacement = -adjustedWidth / 2 + 50;
  }
  new3dLayer.style.left = leftDisplacement + "vw";
 
  if(isTop){
    new3dLayer.style.top = position + "vw";
  } else {
    new3dLayer.style.top = position + initialHeight + "vw";
    // Get the difference between the width of the source layer (which also happens to be the width of the screen ie 100vw) and tis layer
    //let widthDifference = adjustedWidth - 100;
    
    //new3dLayer.style.left = 
  }
  //new3dLayer.style.width = newWidth + "vw";
  new3dLayer.style.transform = "translateZ(" + (-adjustedHeight + depth) + "vw) scale(" + scale + ") rotateX(" + 90 + "deg)";
  document.body.appendChild(new3dLayer);
  return new3dLayer;
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