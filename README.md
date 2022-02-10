#Description
##What is LayerScroll?
LayerScroll is a tool for creating web pages with multi-layered backgrounds at multiple depths, creating an effect reminiscent of the 3d parallax backgrounds featured in many video games from the 16-bit era.

##Why does LayerScroll exist?
A handful of parallax scroll web page frameworks are already available, such as [stellar](http://markdalgleish.com/2012/10/mobile-parallax-with-stellar-js/) and [scrollax](https://iprodev.github.io/Scrollax.js/). However, these tools are designed to add individual parallax scrolling images at different points on a web page, and each of these images has only a single layer of depth.

LayerScroll, on the other hand, layers multiple parallax scrolling images atop one another and tiles them through the entire page. Where the aforementioned parallax scroll tools add a single image that appears to be at a slightly different depth from the web page's content, LayerScroll adds a multi-layered background-foreground combination that can make the web page appear to exist in a three-dimensional world.

LayerScroll is a set of HTML/CSS/Javascript template files, so using it is just a matter of copying these files to your web page's root directory and modifying the HTML to suit your needs.

##Features

- Unlimited number of background layers
- Layers scroll at different speeds relative to a page's content to create an illusion of depth
- Layers can appear both in front of (or closer to the viewer than) and behind (further from the viewer than) the page's main content.
- Use is as simple as making a few quick modifications and additions to a boilerplate HTML template file.

#Usage
LayerScroll has a few limitations to note, particularly when porting it to an existing webpage:

- Setting the z-index property of any elements in the page's main content section may interfere with LayerScroll.
- A static web page background _within_ the page's main content will cover any LayerScroll background layers placed _behind_ the main content.
- LayerScroll will only work on _vertically_ scrolling pages.
- For best results, background images should either be seamlessly tiled or large enough fill the entire web page. The former is recommended due to the much smaller file sizes of tiled background images.
- Background images should use transparency/alpha channels - otherwise they will block out all backgrounds at a higher/deeper depth. The deepest - or furthest from the viewer - background is an exception to this rule.

A web page must have the following boilerplate HTML in order to use LayerScroll:

```
<head>
  <link rel="stylesheet" href="./LayerScrollStyles.css" />
</head>

<body>
  <div class="LayerScroll-background-container">
    <!-- define parallax backgrounds here -->
  </div>
  <div id="main_content">
    <!-- place webpage content here -->
  </div>
  <script src="./LayerScroll.js"></script>
</body>
```

Add a "LayerScroll-background" element between the opening and closing "LayerScroll-background-container" tags.

```
      <div
        class="LayerScroll-background"
        id="background_id"
        data-background-depth="0"
        data-image-url="/path/to/background_image"
        data-image-scale="1"
      >
        &nbsp;
      </div>
```

###Instructions

1. Create a directory to hold your website.
2. Copy the files in the "src" directory (LayerScroll.html, LayerScroll.js and LayerScrollStyles.css) to your new website directory.
3. Place the image files you wish to use as parallax backgrounds somewhere in your web page directory
4. Open "LayerScroll.html" in the text editor or IDE of your choice and add your backgrounds between the div tags with the class "LayerScroll-background-container". Each layer will use the following template HTML:

```
      <div
        class="LayerScroll-background"
        data-background-depth="0"
        data-image-url="/path/to/background_image"
        data-image-scale="1"
      >
        &nbsp;
      </div>
```

_class_: The "class" property must always be "LayerScroll-background".
_data-background-depth_: Any positive or negative number. data-background-depth defines depth of the layer relative to the website's main content. Values greater than one will appear in front of (or closer to the user than) the main web page content. Values less than -1 appear behind (or further from the viewer) than the main content. Value between and including negative one and one will appear at the same depth as the main content.
The depth value determines how fast the layer will scroll relative to the main content. For example, a layer with a value of "2" will scroll twice as fast as the main content; a layer with a value of "-2" will scroll half as fast as the main content.
_data-image-url_: The file location of the background image. For example `img/background.png`.
_data-image-scale_: The scale or "zoom" of the background image relative to the window width. A value of one will stretch the image to fit the window's width exactly. A value of two will stretch the image to _double_ the window's size; therefore, half of the image will not be visible. A value of 0.5 will cause the image to be half the width of the window, and the image will automatically tile to fill the window - thus, there will be two "copies" of the image. Likewise, a value of 0.25 will repeat 4 times and so on. This behavior is useful for seamless tiling backgrounds.
