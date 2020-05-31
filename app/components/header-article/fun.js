import { deleteDoc, setDocToTemplate } from '@util/commonFun';
import { addToShortcutEntry } from '@util/commonFun2';
import { getIn } from '@util/util';

export async function onListItemClick({ key }, docInfo = {}, history, setIsTemplate) {
  const { doc_id, title, space_id } = docInfo;
  const url = `${window.location.origin}/article${doc_id}?spaceId=${space_id}`;
  if (key === 'delete') {
    deleteDoc({
      docId: doc_id,
      docTitle: title
    }, (success) => { success && history.replace(`/spacedetail?spaceId=${space_id}`); });
  } else if (key === 'template') {
    const [, data] = await setDocToTemplate({ docId: doc_id });
    if (getIn(data, ['templateId'])) {
      setIsTemplate(true);
    }
  } else if (key === 'addindex') {
    addToShortcutEntry({ title, url, type: 'XIGUA_DOC', signId: doc_id });
  }
};