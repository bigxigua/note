import React, { useCallback, useContext } from 'react';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { checkBrowser, parseUrlQuery } from '@util/util';
import './index.css';

export default function FloatButton() {
  const { isMobile } = checkBrowser();
  const { spaceId = '' } = parseUrlQuery();
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const { editor } = useContext(editorContext);
  const update = useSaveContent({ publish: true, spaceId });

  if (!isMobile) return null;

  const onClick = useCallback(async () => {
    const [error] = await update(editor);
    if (!error) {
      window.location.replace(window.location.origin + `/article/${docId}?spaceId=${spaceId}&content=origin`);
    }
  }, [editor]);

  return (
    <div className="float-button flex"
      onClick={onClick}>
      <img src="/images/shangdian.png" />
    </div>
  );
};