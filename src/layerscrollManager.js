let style = getComputedStyle(document.documentElement);

let perspectiveValue = style.getPropertyValue("--perspective-value");
perspectiveValue = parseInt(perspectiveValue.slice(0,perspectiveValue.length-2));

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
 *   shouldAlignTop:     elements with depth != 0 will have tops that appear to be at the specified positions
                         at the center of the screen; For deep/shallow layers to appear to align at the TOP
                         of the screen, we need to subtract half the view height multiplied by the depth-determined
                         transformScale.
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
  */

  //TODO: sanity check inputs
  if(!((typeof parallaxLayerConfig.zIndex) === "number")){
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
  console.log("Setting height of layer with id: " + newLayer.id);

  // The height needs to be adjusted to account for the movement of the layer relative to the website content 
  let baseHeight, newHeightString;

  // If this is a content layer (that is if the "element" parameter of the config is defined)
  console.log("parallaxLayerConfig.element: " + parallaxLayerConfig.element);
  if(parallaxLayerConfig.element){
    let elementRect = parallaxLayerConfig.element.getBoundingClientRect();
    // Get the height and convert to vw
    baseHeight = (elementRect.bottom - elementRect.top) / window.innerWidth * 100;
  } else {
    baseHeight = parallaxLayerConfig.height || 100;
  }
  console.log("baseHeight: " + baseHeight);
  
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
  
  if(parallaxLayerConfig.depth && parallaxLayerConfig.depth !== 1 &&
    (parallaxLayerConfig.shouldAdjustHeight === undefined || parallaxLayerConfig.shouldAdjustHeight === true)){
      
    /* 
     * As noted earlier, the height will also need to be lengthened so that the BOTTOM of the layer will align with the bottom of the
     * presumed element that this layer is supposed to align with when shouldAdjustPosition is true
     * ALSO NOTE there is no point in increasing the height if the layer is at depth 0 or shouldAdjustHeight is false 
     */ 
    console.log("transformScale: " + transformScale);
    console.log("1 / depth: " + 1 / parallaxLayerConfig.depth);
    if(parallaxLayerConfig.shouldAdjustPosition){
      console.log("Here it is");
      newHeightString = "calc(" + (transformScale * baseHeight) + "vw + " + transformScale + " * 50vh";
    }
    //First, convert window.innerHeight from px to vw
    //newHeightString = "calc(" + (transformScale * baseHeight) + "vw + 50vh)";
    newHeightString = "calc(" + (1 / parallaxLayerConfig.depth * baseHeight) + "vw + " + (1 / parallaxLayerConfig.depth) + " * 50vh";
  } else {
    newHeightString = baseHeight + "vw";
  }
  
console.log("baseheight: " + baseHeight);


  newLayer.style.height = newHeightString;
  console.log("Just set layer height to: " + newHeightString);
  newLayer.style.width = "100vw";
  newLayer.style.transformOrigin = "center top";
  
  newLayer.style.opacity = parallaxLayerConfig.opacity;
  
  /*
   * Presently there is a problem with the top of any layer with depth != 0 && position === 0 not lining up with the 
   * top of the screen; the amount by which it is displaced depends on the window.innerWidth, so changing window width
   * will change the displacement in real time as well
   * I have yet to find a solution to this issue; it is a major todo, but for now getting some kind of production build of
   * the demo site up and running is priority # 1
   */
  //let adjustedPositionString = "calc(" + (parallaxLayerConfig.position || 0) + "vw - 50vh * " + -transformScale + ")";
  let adjustedPositionString;
  
  /*
   * By default, layers with depth != 0 (that is not even with the screen) are positioned such their tops appear to align with their
   * specified positions at the center of the screen. This is undesireable if, for example, the layer needs to align with a content
   * layer at depth 0; in this case, the positions should align at the TOP of the screen.
   * The config parameter "shouldAdjustPosition" triggers this behavior when true by moving the layer upwards relative to the document
   * as a whole
   * NOTE that the height will also need to be lengthened so that the BOTTOM of the layer will align with the bottom of the
   * presumed element that this layer is supposed to align with.
   */

  if(parallaxLayerConfig.shouldAdjustPosition === true) {
    console.log("%ctransformScale: " + transformScale, "color: pink");
    adjustedPositionString = "calc(" + (parallaxLayerConfig.position || 0) + "vw - 25vh * " + transformScale + ")";
  } else {
    adjustedPositionString = (parallaxLayerConfig.position || 0) + "vw";
  }
  console.log("%cadjustedPositionString: " + adjustedPositionString, "color: blue");



  //let adjustedPosition = parallaxLayerConfig.position || 0;
  let screenHeightInPixels = window.innerHeight;

  newLayer.style.top = adjustedPositionString;
  //newLayer.style.top = parallaxLayerConfig.position + "vw";
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