import { useContext } from 'react';
import axiosInstance from '@util/axiosInstance';
import editorContext from '@context/editor/editorContext';

export default function useSaveContent({
  publish = false
}) {
  const { updateSaveStatus, saveContentStatus } = useContext(editorContext);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  async function update(editor) {
    if (saveContentStatus === 0) {
      return;
    }
    const markdown = editor.getMarkdown();
    const html = editor.getHtmlFromMarkDown(markdown);
    const title = $('.CodeMirror_title>input').val();
    const publishParams = !publish ? {} : {
      html,
      title,
      markdown
    };
    updateSaveStatus(0);
    const [error, data] = await axiosInstance.post('doc/update', {
      doc_id: docId,
      html_draft: html,
      title_draft: title,
      markdown_draft: markdown,
      ...publishParams
    });
    if (!error && data && data.STATUS === 'OK') {
      updateSaveStatus(1);
      return;
    }
    console.log('更新文档内容失败', error);
    updateSaveStatus(2);
  }
  return update;
}