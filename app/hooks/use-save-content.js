import { useContext } from 'react';
import axiosInstance from '@util/axiosInstance';
import editorContext from '@context/editor/editorContext';
import { addRecent } from '@util/commonFun';
import useMessage from '@hooks/use-message';
import { getIn } from '@util/util';

const message = useMessage();

export default function useSaveContent({
  publish = false, // 是否发布
  spaceId = ''
}) {
  // updateSaveStatus， 0正在更新，1更新成功 2更新失败
  const { updateSaveStatus, saveContentStatus } = useContext(editorContext);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  async function update(editor) {
    if (saveContentStatus === 0) {
      return;
    }
    // editormd方式获取markdown
    // const markdown = editor.getMarkdown();

    const markdown = '';

    // editormd方式获取html
    // const html = editor.getHtmlFromMarkDown(markdown);

    // simditor方式获取html
    const html = editor.getValue();

    // editormd方式获取cover背景图
    // const cover = getImageFormMakeDown(markdown, html, editor) || '';
    const cover = '';

    const abstract = html.replace(/<\/?[^>]*>/g, '').substr(0, 160).replace(/[\r\n]/g, '');
    const title = $('.simditor-title>input').val();
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
    if (!error && data && data.STATUS === 'OK') {
      await addRecent({
        spaceId,
        docId,
        docTitle: title,
        type: publish ? 'UpdateEdit' : 'Edit'
      });
      updateSaveStatus(1);
      return [null, data];
    }
    // 添加操作记录
    message.error({ content: getIn(error, ['message'], '系统繁忙') });
    updateSaveStatus(2);
    return [error || {}, null];
  }
  return update;
}