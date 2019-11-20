export default function useMessage() {
  const createMessageDom = (c, src, content) => {
    $('.Message').remove();
    const dom =
      `<div class="Message flex animated ${c}">` +
      `<img style="width: 20px;margin-right: 4px;" src="/images/${src}.png" />` +
      `<span>${content}</span>` +
      +'</div>';
    const style = '<style>' +
      '.Message_Error>span { position: relative; top: -2px;}\n' +
      '.Message{position: fixed; top: 20px;font-size: 14px; display: none;' +
      'left: 50%;padding: 10px 16px; ' +
      'border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); ' +
      'background: #fff; color: rgba(0, 0, 0, 0.65)}; font-size: 14px;}' +
      '</style>';
    $('body').append($(dom));
    $('head').append($(style));
  };
  const removeDom = (duration, onClose) => {
    setTimeout(() => {
      $('.Message').remove();
      onClose();
    }, duration || 3000);
  };
  const fn = () => { };
  const message = {
    success: ({ content, d, onClose = fn }) => {
      createMessageDom('slideInDown', 'success', content);
      removeDom(d, onClose);
    },
    error: ({ content, d, onClose = fn }) => {
      createMessageDom('slideInDown Message_Error', 'fail', content);
      removeDom(d, onClose);
    },
    info: ({ content, d, onClose }) => {
      createMessageDom('Message_Info', '', content);
      removeDom(d, onClose);
    },
    warning: ({ content, d, onClose }) => {
      createMessageDom('Message_Warning', '', content);
      removeDom(d, onClose);
    },
    warn: ({ content, d, onClose }) => {
      createMessageDom('Message_Warn', '', content);
      removeDom(d, onClose);
    },
    loading: ({ content, d, onClose }) => {
      createMessageDom('Message_Loading', '', content);
      removeDom(d, onClose);
    }
  };
  return message;
};