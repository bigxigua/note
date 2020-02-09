(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simditor-inlinecode', ["@public/editor/simditor.js"], function (a0) {
      return (root['InlineCode'] = factory(jQuery, a0));
    });
  } else {
    root['InlineCode'] = factory(root["jQuery"], root["Simditor"]);
  }
}(this, function ($, Simditor) {

  var InlineCode,
    __hasProp = {}.hasOwnProperty,
    __extends = function (child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;
  InlineCode = (function (_super) {
    function InlineCode() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      InlineCode.__super__.constructor.apply(this, args);
      $.extend(this.editor.formatter._allowedAttributes, {
        p: ['class']
      });
    }
    __extends(InlineCode, _super);

    InlineCode.prototype.name = 'inlinecode';

    InlineCode.prototype.icon = 'inlinecode';

    InlineCode.prototype.disableTag = 'pre';

    InlineCode.prototype.inlineMode = false;

    InlineCode.prototype.htmlTag = 'p';

    InlineCode.prototype._status = function () {
      this._checkMode();
      InlineCode.__super__._status.call(this);
    };

    InlineCode.prototype._activeStatus = function () {
      var active, endNode, endNodes, startNode, startNodes;
      startNodes = this.editor.selection.startNodes();
      endNodes = this.editor.selection.endNodes();
      startNode = startNodes.filter('code.xigua-inline__code');
      endNode = endNodes.filter('code.xigua-inline__code');
      active = startNode.length > 0 && endNode.length > 0 && startNode.is(endNode);
      this.node = active ? startNode : null;
      this.setActive(active);
      return this.active;
    };

    InlineCode.prototype._init = function () {
      InlineCode.__super__._init.call(this);
      this.editor.on('decorate', (function (_this) {
        return function (e, $el) {
        };
      })(this));
      // this.editor.keystroke.add('enter', 'p', (function (_this) {
      //   return function (e, $node) {
      //     if ($node.is('p') && $node.find('>code').length) {
      //       var innerText = $node.contents().filter(function (index, content) {
      //         return content.nodeType === 3;
      //       }).text();
      //       console.log(_this.editor.selection.blockNodes().last().next().length);
      //       var startContainer = _this.editor.selection.range().startContainer;
      //       if (innerText !== startContainer.textContent) {
      //         _this.editor.selection.setRangeAtEndOf($node.find('>code'));
      //         return;
      //       }
      //       // 判断光标位置
      //       // 1. 行内内容点击换行，直接跳出code，到p.xigua-inline__code的末尾</br>
      //       $p = $('<p/>').append(_this.editor.util.phBr).insertAfter($node);
      //       _this.editor.selection.setRangeAtStartOf($p);
      //       return true;
      //     }
      //   }
      // })(this));
    }

    InlineCode.prototype._checkMode = function () {
      var range = this.editor.selection.range();
      if (($blockNodes = $(range.cloneContents()).find(this.editor.util.blockNodes.join(','))) > 0 || (range.collapsed && this.editor.selection.startNodes().filter('code').length === 0)) {
        this.inlineMode = false;
      } else {
        this.inlineMode = true;
      }
    }

    InlineCode.prototype.command = function () {
      var $rootNodes = this.editor.selection.blockNodes();
      var range = this.editor.selection.range();
      var classes = 'xigua-inline__code';
      this.editor.selection.save();

      $rootNodes.each((function (_this) {
        function insertCodeTag() {
          var $contents = $(range.extractContents());
          var $code = $('<code />').append($contents.contents());
          if ($code.find('code').length > 0) {
            $code.find('code').each(function (i, dom) {
              $(dom).contents().unwrap();
            });
          };
          range.insertNode($code[0]);
          $code.after('&nbsp;');
          $code.addClass(classes);
          // range.selectNodeContents($code[0]);
          // _this.editor.selection.range(range);
        }
        return function (i, node) {
          var $node = $(node);
          if ($node.is('pre') || $node.is(_this.disableTag) || !$.contains(document, node)) {
            return;
          }
          var $element = $(range.commonAncestorContainer);
          if (_this.inlineMode) {
            if ($element.is('code')) {
              $element.contents().unwrap();
            } else {
              insertCodeTag();
            }
            return;
          } else if ($node.is('p') && $node.find(`>code.${classes}`).length > 0) {
            insertCodeTag();
          } else {
            var $inline = $(`<p><code class="${classes}"></code>&nbsp;</br></p>`);
            $inline.find('code').append($node.html() || _this.editor.util.phBr);
            $inline.replaceAll($node);
          }

        }
      })(this));
      this.editor.selection.restore();
      return $(document).trigger('selectionchange');
    };

    return InlineCode;

  })(Simditor.Button);

  Simditor.Toolbar.addButton(InlineCode);

  return InlineCode;

}));