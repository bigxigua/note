(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('imagescale', ["@public/editor/module"], function (ImageScaleModule) {
      return (root['imageScale'] = factory(jQuery, ImageScaleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"), require("simple-module"));
  } else {
    root.imageScale = root.imageScale || {};
    root.imageScale = factory(jQuery, ImageScaleModule);
  }
}(this, function ($, ImageScaleModule) {

  var ScaleModule,
    extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ScaleModule = (function (superClass) {
    extend(ScaleModule, superClass);

    function ScaleModule() {
      return ScaleModule.__super__.constructor.apply(this, arguments);
    }


    ScaleModule.prototype.opts = {
    };

    ScaleModule.prototype._init = function () {
    };

    ScaleModule.prototype.scaleImage = function (img) {
      img.on('click', () => {
        console.log('------>>>>>');
      });
    };

    ScaleModule.prototype.destroy = function () {
      // var file, i, len, ref;
      // this.queue.length = 0;
      // ref = this.files;
      // for (i = 0, len = ref.length; i < len; i++) {
      //   file = ref[i];
      //   this.cancel(file);
      // }
      // $(window).off('.uploader-' + this.id);
      // return $(document).off('.uploader-' + this.id);
    };

    return ScaleModule;

  })(ImageScaleModule);

  return function (opts) {
    return new ScaleModule(opts);
  };;

}));
