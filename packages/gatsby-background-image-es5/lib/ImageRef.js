"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.activateMultiplePictureRefs = exports.activatePictureRef = exports.createMultiplePictureRefs = exports.createPictureRef = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _HelperUtils = require("./HelperUtils");

var _ImageUtils = require("./ImageUtils");

var createPictureRef = function createPictureRef(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.isBrowser)() && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _HelperUtils.hasImageArray)(convertedProps) && !(0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
      return createMultiplePictureRefs(props, onLoad);
    }

    var img = new Image();

    img.onload = function () {
      return onLoad();
    };

    if (!img.complete && typeof convertedProps.onLoad === "function") {
      img.addEventListener('load', convertedProps.onLoad);
    }

    if (typeof convertedProps.onError === "function") {
      img.addEventListener('error', convertedProps.onError);
    }

    if (convertedProps.crossOrigin) {
      img.crossOrigin = convertedProps.crossOrigin;
    } // Only directly activate the image if critical (preload).


    if (convertedProps.critical || convertedProps.isVisible) {
      return activatePictureRef(img, convertedProps);
    }

    return img;
  }

  return null;
};
/**
 * Creates multiple image references. Internal function.
 *
 * @param props   object    Component Props (with fluid or fixed as array).
 * @param onLoad  function  Callback for load handling.
 */


exports.createPictureRef = createPictureRef;

var createMultiplePictureRefs = function createMultiplePictureRefs(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed;
  return (0, _map.default)(imageStack).call(imageStack, function (imageData) {
    if (convertedProps.fluid) {
      return createPictureRef((0, _assign.default)({}, convertedProps, {
        fluid: imageData
      }), onLoad);
    }

    return createPictureRef((0, _assign.default)({}, convertedProps, {
      fixed: imageData
    }), onLoad);
  });
};
/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param imageRef
 * @param props
 * @param selfRef
 * @return {null|Array|*}
 */


exports.createMultiplePictureRefs = createMultiplePictureRefs;

var activatePictureRef = function activatePictureRef(imageRef, props, selfRef) {
  if (selfRef === void 0) {
    selfRef = null;
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.isBrowser)() && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _HelperUtils.hasImageArray)(convertedProps) && !(0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
      return activateMultiplePictureRefs(imageRef, props, selfRef);
    } else {
      var imageData = (0, _HelperUtils.hasArtDirectionArray)(convertedProps) ? (0, _HelperUtils.getCurrentSrcData)(convertedProps) : (0, _ImageUtils.getCurrentFromData)(convertedProps); // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
      // but don't prevent it during SSR.

      var removableElement = null;

      if ((0, _ImageUtils.hasPictureElement)()) {
        var pic = document.createElement('picture');

        if (selfRef) {
          // Set original component's style.
          pic.width = imageRef.width = selfRef.offsetWidth;
          pic.height = imageRef.height = selfRef.offsetHeight;
        } // TODO: check why only the 1400 image gets loaded & single / stacked images don't!


        if ((0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
          var sources = (0, _ImageUtils.createArtDirectionSources)(convertedProps);
          (0, _forEach.default)(sources).call(sources, function (currentSource) {
            return pic.appendChild(currentSource);
          });
        } else if (imageData.srcSetWebp) {
          var sourcesWebP = document.createElement('source');
          sourcesWebP.type = "image/webp";
          sourcesWebP.srcset = imageData.srcSetWebp;
          sourcesWebP.sizes = imageData.sizes;

          if (imageData.media) {
            sourcesWebP.media = imageData.media;
          }

          pic.appendChild(sourcesWebP);
        }

        pic.appendChild(imageRef);
        removableElement = pic; // document.body.appendChild(removableElement)
      } else {
        if (selfRef) {
          imageRef.width = selfRef.offsetWidth;
          imageRef.height = selfRef.offsetHeight;
        }

        removableElement = imageRef; // document.body.appendChild(removableElement)
      }

      imageRef.srcset = imageData.srcSet ? imageData.srcSet : "";
      imageRef.src = imageData.src ? imageData.src : "";

      if (imageData.media) {
        imageRef.media = imageData.media;
      } // document.body.removeChild(removableElement)


      return imageRef;
    }
  }

  return null;
};
/**
 * Creates multiple picture elements.
 *
 * @param imageRefs
 * @param props
 * @param selfRef
 * @return {Array||null}
 */


exports.activatePictureRef = activatePictureRef;

var activateMultiplePictureRefs = function activateMultiplePictureRefs(imageRefs, props, selfRef) {
  if (imageRefs === void 0) {
    imageRefs = [];
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  return (0, _map.default)(imageRefs).call(imageRefs, function (imageRef, index) {
    if (convertedProps.fluid) {
      return activatePictureRef(imageRef, (0, _assign.default)({}, convertedProps, {
        fluid: convertedProps.fluid[index]
      }), selfRef);
    }

    return activatePictureRef(imageRef, (0, _assign.default)({}, convertedProps, {
      fixed: convertedProps.fixed[index]
    }), selfRef);
  });
};

exports.activateMultiplePictureRefs = activateMultiplePictureRefs;