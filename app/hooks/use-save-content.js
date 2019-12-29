import { useContext } from 'react';
import axiosInstance from '@util/axiosInstance';
import editorContext from '@context/editor/editorContext';
import { addRecent } from '@util/commonFun';

function getImageFormMakeDown(markdown) {
  if (!markdown) return null;
  let markImage = ((markdown.match(/!\[.*\]\(.+\)/g) || [])[0] || '');
  if (!markImage) {
    try {
      const sources = markdown.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        .map(x => x.replace(/.*src="([^"]*)".*/, '$1'));
      markImage = sources[0];
    } catch (error) { }
  } else {
    markImage = ((markImage.match(/\(.*\).*/g) || [])[0] || '').replace(/(\(|\))/g, '');
  }
  return markImage;
}

export default function useSaveContent({
  publish = false, // 是否发布
  spaceId = ''
}) {
  const { updateSaveStatus, saveContentStatus } = useContext(editorContext);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  async function update(editor) {
    if (saveContentStatus === 0) {
      return;
    }
    const markdown = editor.getMarkdown();
    const html = editor.getHtmlFromMarkDown(markdown);
    const cover = getImageFormMakeDown(markdown, html, editor);
    console.log(cover);
    const abstract = html.replace(/<\/?[^>]*>/g, '').substr(0, 160).replace(/[\r\n]/g, '');
    const title = $('.CodeMirror_title>input').val();
    const publishParams = !publish
      ? {
        html_draft: html,
        title_draft: title,
        markdown_draft: markdown
      } : {
        cover,
        html,
        title,
        abstract,
        markdown,
        html_draft: '',
        title_draft: '',
        markdown_draft: ''
      };
    updateSaveStatus(0);
    const [error, data] = await axiosInstance.post('doc/update', {
      doc_id: docId,
      ...publishParams
    });
    await addRecent({
      spaceId,
      docId,
      docTitle: title,
      type: publish ? 'UpdateEdit' : 'Edit'
    });
    if (!error && data && data.STATUS === 'OK') {
      updateSaveStatus(1);
      return [null, data];
    }
    console.log('更新文档内容失败', error);
    updateSaveStatus(2);
    return [error || {}, null];
  }
  return update;
}