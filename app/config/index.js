import { checkBrowser } from '@util/util';

const { isMobile } = checkBrowser();

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

// 网站ICON
export const FAV_ICON = '/images/pikachu.svg';

export const ENV = process.env.NODE_ENV;
export const DOMAIN = ENV === 'development' ? 'http://127.0.0.1:8080/' : 'https://www.bigxigua.net:8080/';
export const UPLOAD_DOMAIN = ENV === 'development' ? 'http://127.0.0.1:3000/upload' : 'https://www.bigxigua.net/upload';

// 空间类型对应ICON
export const SPACE_TYPE_ICON = {
  DOCS: '/images/book.png',
  RESOURCE: '/images/books.png',
  IMPORT: '/images/import.png',
  TEMPLATE_OF_STUDY: '/images/doc.png',
  TEMPLATE_OF_BLOG: '/images/blog.png',
  TEMPLATE_OF_TRAVEL: '/images/trip.png'
};

// simditor浏览器PC端toolbar
// TODO markdown支持 html支持
// simditor-mention 支持
const toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'emoji', 'link', 'image', 'hr', 'checklist', 'indent', 'outdent', 'alignment'];
const mobileToolbar = ['title', 'bold', 'fontScale', 'ol', 'ul', 'blockquote', 'code', 'hr'];
// simditor默认配置项
export const simditorParams = {
  // placeholder: '',
  toolbar: isMobile ? mobileToolbar : toolbar,
  toolbarFloat: true, // Fixed the toolbar on the top of the browser when scrolling.
  toolbarFloatOffset: 58, // Top offset of the toolbar when fixed
  toolbarHidden: false, // Hide the toolbar. Can not work together with `toolbarFloat`.
  defaultImage: '/images/book.png', // Default image placeholder. Used when inserting pictures in Simditor.
  tabIndent: true, // Use 'tab' key to make an indent.
  upload: { // Accept false or key/value pairs. Extra options for uploading images:
    url: `${UPLOAD_DOMAIN}/image`, // upload api url;
    params: null, // extra params sent to the server;
    fileKey: 'file', // key of the file param;
    connectionCount: 1, // how many images can be uploaded simultaneously;
    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?' // messages will be shown if one leave the page while file is being uploaded;
  },
  livemd: true,
  emoji: {
    imagePath: '/images/emoji/'
  },
  pasteImage: true, // Support uploading by pasting images from the clipboard. Work together with upload and only supported by Firefox and Chrome.
  cleanPaste: false // Remove all styles in paste content automatically.
};