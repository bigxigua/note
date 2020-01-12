import React, { Component } from 'react';
// import { Icon, Button, Progress, message } from 'antd';
import Icon from '@common/icon';
import Button from '@common/button';
import uploader from '@util/uploader';
import { DOMAIN } from '@util/config';

// eslint-disable-next-line no-unused-vars
function asyncUploader({ onProgress, onError, onSuccess, file, fileId }, ctx) {
  return new Promise((resolve) => {
    uploader({
      onProgress: (e) => {
        const { fileList } = ctx.state;
        const curIndex = fileList.findIndex(n => n.fileId === fileId);
        const percent = (e.total > 0) ? e.loaded / e.total * 100 : 0;
        if (curIndex !== -1) {
          fileList[curIndex].percent = percent;
        }
      },
      onError: (e) => {
        resolve([e || {}, null]);
      },
      onSuccess: (e) => {
        resolve([null, e]);
      },
      data: { fileId },
      filename: 'file',
      // file: new Blob(new Int8Array(binary), { type }),
      file,
      withCredentials: true,
      action: `${DOMAIN}uploadImage`,
      headers: []
    });
  });
}
export default class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadLoading: false, // 正在开始上传按钮loading是否显示
      canDropHere: false, // 是否处在可拖拽区域内
      fileList: [
        // {
        //     lastModified: 1558881596300,
        //     name: "560410975.jpg",
        //     size: 247172,
        //     type: "image/jpeg",
        //     percent: 0,
        //     relPath: '22222222',
        //     file: {},
        //     fileId: '1558881596300',
        //     url: "blob:http://127.0.0.1:3004/d455501a-dfe1-4569-9990-4b2f5d740171",
        //     webkitRelativePath: "",
        // }
      ]
    };
  }

  componentDidMount() {
    this.initializeDragHandle();
  }

  /**
   *  初始化图片拖拽，绑定事件，处理文件
   *  @returns {object} null
   */
  initializeDragHandle = () => {
    const { dragArea } = this.refs;
    const ctx = this;
    dragArea.ondragenter = function () {
      ctx.setState({ canDropHere: true });
    };
    dragArea.ondragover = function (e) {
      e.preventDefault();
    };
    dragArea.ondrop = function (e) {
      e.preventDefault();
      ctx.setState({ canDropHere: false });
      const files = Array.of(e.dataTransfer.files).splice(0, 3);
      const { fileList } = ctx.state;
      if (fileList.length >= 3) {
        return;
      }
      files[0].forEach((item) => {
        ctx.handleChange({
          currentTarget: {
            files: [item]
          }
        });
      });
    };
  }

  /**
   *  关闭上传组件
   *  @returns {object} null
   */
  handleCancel = () => {
    // @关闭时，清除已经上传成功的图片
    let { fileList } = this.state;
    fileList = fileList.filter(n => {
      return !n.relPath;
    });
    this.setState({ fileList });
    this.props.onToggleShowImageUploader(false);
  }

  /**
   *  选择图片进行预览
   *  @returns {object} null
   */
  handleChange = ({ currentTarget: node }) => {
    if (node.files && node.files[0]) {
      const file = node.files[0];
      const reader = new window.FileReader();
      const { fileList } = this.state;
      const ctx = this;
      reader.readAsArrayBuffer(file);
      reader.onload = function (e) {
        fileList.push({
          binary: e.target.result,
          url: window[window.webkitURL ? 'webkitURL' : 'URL'].createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          lastModified: file.lastModified,
          fileId: Date.now().toString(),
          webkitRelativePath: file.webkitRelativePath
        });
        ctx.setState({ fileList });
      };
      reader.onprogress = function (e) {
      };
      reader.onerror = function (e) {
        console.log(e, '---onerror--');
      };
      reader.onabort = function (e) {
        console.log(e, '--onabort---');
      };
    }
  }

  /**
   *  调用上传接口，二进制上传图片，返回图片地址
   *  @returns {object} null
   */
  onStartUploaderHandle = async () => {
    const { fileList } = this.state;
    // const { markdownInfo } = this.props;
    const asyncUploadeQueue = fileList.map(({ file, fileId, relPath }) => {
      if (relPath) {
        return Promise.resolve({});
      }
      return async (resolve, reject) => {
        const [error, data] = await asyncUploader({ file, fileId }, this); ;
        if (!error && data) {
          resolve(data);
        } else {
          reject(error || {});
        }
      };
    });
    this.setState({ uploadLoading: true });
    Promise.all(asyncUploadeQueue).then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        res.forEach(data => {
          if (data && data.data && data.data.path && data.data.fileId) {
            const curIndex = fileList.findIndex(n => n.fileId === data.data.fileId);
            if (curIndex !== -1) {
              fileList[curIndex].relPath = data.data.path;
            }
          }
        });
      }
      this.setState({ fileList });
      console.log(res);
    }).catch((error) => {
      // 全部失败，提示服务出错
      console.log(error);
    }).finally(() => {
      this.setState({ uploadLoading: false });
    });
  }

  /**
   *  复制图片地址
   *  @relPath {string} 图片真实地址
   *  @returns {object} null
   */
  onCopyLinkHandle = ({ relPath }) => {
    if (window.clipboardData) {
      window.clipboardData.setData('uploaderRelPath', relPath);
      // message.success('复制成功');
    } else {
      document.oncopy = function (e) {
        e.clipboardData.setData('text', relPath);
        e.preventDefault();
        document.oncopy = null;
        // message.success('复制成功');
      };
      document.execCommand('Copy');
    }
  }

  render() {
    const { canShowModal } = this.props;
    const { fileList, uploadLoading, canDropHere } = this.state;
    const fileListsJsx = fileList.map(file => {
      let linkClassName = 'image-preview-img-link';
      !file.relPath && (linkClassName += ' image-preview-disabled');
      return (
        <li className="image-preview-file"
          key={file.fileId}>
          <div className="image-preview-url">
            <img src={file.url}
              alt="图片" />
            {file.percent && (<div className="image-preview-progres">
              {/* <Progress percent={file.percent} size="small" /> */}
            </div>)}
          </div>
          <div className="image-preview-info">
            <div>
              <span className="image-preview-img-name">{file.name}</span>
              <Icon type="ellipsis" />
            </div>
            <div>
              <span className="image-preview-img-size">陶宝中 {file.size}b</span>
              <div className={linkClassName}
                onClick={() => { this.onCopyLinkHandle(file); }}><Icon type="link" />复制链接</div>
            </div>
          </div>
        </li>
      );
    });
    let modalClassName = 'image-uploader-modal';
    let coverClassName = 'image-loader-cover';
    let areaClassName = 'image-uploader-area';
    fileList.length > 0 && (modalClassName += ' image-uploader-modal-90');
    !canShowModal && (coverClassName += ' image-loader-cover-hide');
    canDropHere && (areaClassName += ' image-uploader-area-actived');
    const disabledUploader = fileList.every(n => n.relPath);
    const disabledChoseImage = fileList.length >= 3;
    const imageTotalSize = fileList.reduce((p, n) => {
      p += n.size / 1024;
      return Math.round(p);
    }, 0);
    return (
      <div className={coverClassName}>
        <div className={modalClassName}
          ref="dragArea">
          <Icon type="close-circle"
            theme="twoTone"
            onClick={this.handleCancel}
            className="image-uploader-close-icon" />
          {fileList.length === 0 ? (
            <div className="image-uploader-uploader">
              <div className={areaClassName}>
                <div className="image-uploader-placeholder">
                  <Button type="dashed"
                    onClick={this.onChoseImageHandle}
                    className="image-uploader-button">
                    <input type="file"
                      onChange={this.handleChange}></input>
                    点击选择图片
                  </Button>
                  <span className="image-uploader-drag-tips">或将照片拖到这里，单次最多可选3张</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="image-preview-container">
              <h1>图片</h1>
              <ul className="image-preview-filelist">
                {fileListsJsx}
              </ul>
              <div className="image-preview-footer">
                <div className="image-preview-footer-info">
                    选中{fileList.length}张图片，共{imageTotalSize}K。
                </div>
                <div className="image-preview-footer-buttons">
                  <Button disabled={disabledChoseImage}
                    type="dashed"
                    onClick={this.onChoseImageHandle}
                    className="image-uploader-button">
                    <input type="file"
                      onChange={this.handleChange}></input>继续添加
                  </Button>
                  <Button disabled={disabledUploader}
                    type="primary"
                    loading={uploadLoading}
                    onClick={this.onStartUploaderHandle}>开始上传</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};