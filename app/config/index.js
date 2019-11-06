const now = Date.now();
// 离线笔记内容
export const INTRODUCE_MARKDOWN = '# 欢迎使用土川记\n\n@(示例笔记本)[土川记|帮助|Markdown]\n\n**土川记**是一款专为学习时方便记笔记而打造的Markdown编辑器，通过精心的设计与技术实现，配合Editor强大的富文本编辑功能，带来前所未有的书写体验。特点概述：\n \n **功能丰富** ：支持高亮代码块、*LaTeX* 公式、流程图，本地图片以及附件上传，甚至截图粘贴，工作学习好帮手；\n **得心应手** ：简洁高效的编辑器，提供[1]以及[离线Chrome App][2]、 Web；\n **深度整合** ：支持选择笔记本和添加标签。\n\n\n\n[TOC]\n\n## Markdown简介\n\n> Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成格式丰富的HTML页面。    —— [维基百科](https://zh.wikipedia.org/wiki/Markdown)\n\n正如您在阅读的这份文档，它使用简单的符号标识不同的标题，将某些文字标记为**粗体**或者*斜体*，创建一个[链接](http://www.example.com)或一个脚注[^demo]。下面列举了几个高级功能，更多语法请按`Ctrl + /`查看帮助。 \n\n### 代码块\n``` python\n@requires_authorization\ndef somefunc(param1=\'\', param2=0):\n    \'\'\'A docstring\'\'\'\n    if param1 > param2: # interesting\n        print \'Greater\'\n    return (param2  param1 + 1) or None\nclass SomeClass:\n    pass\n>>> message = \'\'\'interpreter\n... prompt\'\'\'\n```\n### LaTeX 公式\n\n可以创建行内公式，例如 $\\Gamma(n) = (n1)!\\quad\\forall n\\in\\mathbb N$。或者块级公式：\n\n$$\tx = \\dfrac{b \\pm \\sqrt{b^2  4ac}}{2a} $$\n\n### 表格\n| Item      |    Value | Qty  |\n| : | :| :: |\n| Computer  | 1600 USD |  5   |\n| Phone     |   12 USD |  12  |\n| Pipe      |    1 USD | 234  |\n\n### 流程图\n```flow\nst=>start: Start\ne=>end\nop=>operation: My Operation\ncond=>condition: Yes or No?\n\nst>op>cond\ncond(yes)>e\ncond(no)>op\n```\n\n以及时序图:\n\n    # enter code here\n\n```sequence\nAlice>Bob: Hello Bob, how are you?\nNote right of Bob: Bob thinks\nBob>Alice: I am good thanks!\n```\n\n> **提示：**想了解更多，请查看**流程图**[语法][3]以及**时序图**[语法][4]。\n\n### 复选框\n\n使用 ` [ ]` 和 ` [x]` 语法可以创建复选框，实现 todolist 等功能。例如：\n\n [x] 已完成事项\n [ ] 待办事项1\n [ ] 待办事项2\n\n> **注意：**目前支持尚不完全，在土川记中勾选复选框是无效、不能同步的，所以必须在**土川记**中修改 Markdown 原文才可生效。下个版本将会全面支持。\n\n\n##土川记相关\n\n### 笔记本和标签\n**土川记**增加了`@(笔记本)[标签A|标签B]`语法, 以选择笔记本和添加标签。 **绑定账号后**， 输入`(`自动会出现笔记本列表，请从中选择。\n\n### 笔记标题\n**土川记**会自动使用文档内出现的第一个标题作为笔记标题。例如本文，就是第一行的 `欢迎使用土川记`。\n\n### 快捷编辑\n保存在印象笔记中的笔记，右上角会有一个红色的编辑按钮，点击后会回到**土川记**中打开并编辑该笔记。\n>**注意：**目前用户在印象笔记中单方面做的任何修改，土川记是无法自动感知和更新的。所以请务必回到土川记编辑。\n\n### 数据同步\n**土川记**通过**将Markdown原文以隐藏内容保存在笔记中**的精妙设计，实现了对Markdown的存储和再次编辑。既解决了其他产品只是单向导出HTML的单薄，又规避了服务端存储Markdown带来的隐私安全问题。这样，服务端仅作为对印象笔记 API调用和数据转换之用。\n\n >**隐私声明：用户所有的笔记数据，均保存在印象笔记中。土川记不存储用户的任何笔记数据。**\n\n### 离线存储\n**土川记**使用浏览器离线存储将内容实时保存在本地，不必担心网络断掉或浏览器崩溃。为了节省空间和避免冲突，已同步至印象笔记并且不再修改的笔记将删除部分本地缓存，不过依然可以随时通过`文档管理`打开。\n\n> **注意：**虽然浏览器存储大部分时候都比较可靠，但印象笔记作为专业云存储，更值得信赖。以防万一，**请务必经常及时同步到印象笔记**。\n\n## 编辑器相关\n### 设置\n右侧系统菜单（快捷键`Ctrl + M`）的`设置`中，提供了界面字体、字号、自定义CSS、vim/emacs 键盘模式等高级选项。\n\n### 快捷键\n\n帮助    `Ctrl + /`\n同步文档    `Ctrl + S`\n创建文档    `Ctrl + Alt + N`\n最大化编辑器    `Ctrl + Enter`\n预览文档 `Ctrl + Alt + Enter`\n文档管理    `Ctrl + O`\n系统菜单    `Ctrl + M` \n\n加粗    `Ctrl + B`\n插入图片    `Ctrl + G`\n插入链接    `Ctrl + L`\n提升标题    `Ctrl + H`\n\n## 关于收费\n\n**土川记**为新用户提供 10 天的试用期，试用期过后需要[续费](maxiang.info/vip.html)才能继续使用。未购买或者未及时续费，将不能同步新的笔记。之前保存过的笔记依然可以编辑。\n\n\n## 反馈与建议\n 微博：[@土川记](http://weibo.com/u/2788354117)，[@GGock](http://weibo.com/ggock "开发者个人账号")\n 邮箱：<hustgock@gmail.com>\n\n\n感谢阅读这份帮助文档。请点击右上角，绑定印象笔记账号，开启全新的记录与分享体验吧。\n\n\n\n\n[^demo]: 这是一个示例脚注。请查阅 [MultiMarkdown 文档](https://github.com/fletcher/MultiMarkdown/wiki/MultiMarkdownSyntaxGuide#footnotes) 关于脚注的说明。 **限制：** 印象笔记的笔记内容使用 [ENML][5] 格式，基于 HTML，但是不支持某些标签和属性，例如id，这就导致`脚注`和`TOC`无法正常点击。\n\n\n  [1]: http://maxiang.info/client_zh\n  [2]: https://chrome.google.com/webstore/detail/kidnkfckhbdkfgbicccmdggmpgogehop\n  [3]: http://adrai.github.io/flowchart.js/\n  [4]: http://bramp.github.io/jssequencediagrams/\n  [5]: https://dev.yinxiang.com/doc/articles/enml.php\n\n';
export const OFFLINE_NOTEBOOK_INFO = {
  notebook_created_time: now,
  notebook_last_update: now,
  notebook_name: '离线笔记',
  notebook_id: 'off_line_notebook_id',
  note_exist: 1,
  subNotes: [{
    notebook_id: 'off_line_notebook_id',
    sub_note_id: 'off_line_subnote_id',
    sub_note_created_time: now,
    sub_note_last_update: now,
    sub_note_html: '<p>这是一个新的笔记</p>↵',
    sub_note_markdown: INTRODUCE_MARKDOWN,
    sub_note_name: '离线子笔记',
    sub_note_exist: 1
  }]
};
// 离线笔记存localStorage的key
export const OFFLINENOTE_STORAGE_KEY = 'OFFLINENOTE_STORAGE_KEY';

export const THEME = ['default', 'dark'];

export const PREVIEW_THEME = [
  'ambiance',
  'eclipse',
  'mdnlike',
  'mbo',
  'monokai',
  'neat',
  'pastelondark'
];
export const EDITOR_THEME = [
  'default',
  '3024day',
  '3024night',
  'ambiance',
  'ambiancemobile',
  'base16dark',
  'base16light',
  'blackboard',
  'cobalt',
  'eclipse',
  'elegant',
  'erlangdark',
  'lesserdark',
  'mbo',
  'mdnlike',
  'midnight',
  'monokai',
  'neat',
  'neo',
  'night',
  'paraisodark',
  'paraisolight',
  'pastelondark',
  'rubyblue',
  'solarized',
  'thematrix',
  'tomorrownighteighties',
  'twilight',
  'vibrantink',
  'xqdark',
  'xqlight'
];