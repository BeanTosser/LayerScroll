const screamdrollElements = document.getElementsByClassName(
  "LayerScroll-background"
);

const handleScroll = function () {
  Array.prototype.forEach.call(screamdrollElements, (background) => {
    const imageDepth = parseInt(
      background.getAttribute("data-background-depth"),
      10
    );
    if (imageDepth < -1) {
      background.style.backgroundPosition =
        "0 " + window.scrollY / imageDepth + "px";
    } else if (imageDepth > 1) {
      background.style.backgroundPosition =
        "0 " + -window.scrollY * imageDepth + "px";
    } else {
      background.style.backgroundPosition = "0 " + -window.scrollY + "px";
    }
  });
};

// getElementsByClassName() returns an "Array-like" object, not a true array, so we must call forEach from Array.prototype
Array.prototype.forEach.call(screamdrollElements, (background) => {
  const imageUrl = background.getAttribute("data-image-url");
  const imageScale = background.getAttribute("data-image-scale");
  const imageDepth = background.getAttribute("data-background-depth");

  background.style.backgroundImage = "url(" + imageUrl + ")";
  background.style.backgroundSize = imageScale * 100 + "vw";
  background.style.zIndex = imageDepth;
  window.addEventListener("scroll", handleScroll);
});
