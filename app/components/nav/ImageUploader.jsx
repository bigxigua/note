import React, { Component } from 'react';
import { Icon, Button, Progress, message } from 'antd';
import axiosInstance from '../../util/axiosInstance.js';
import uploader from '../../util/uploader.js';
import {
    debunce,
    formatTimeStamp
} from '../../util/util.js';
import { DOMAIN } from '../../util/config.js';

function asyncUploader({ onProgress, onError, onSuccess, file, fileId }, ctx) {
    return new Promise((resolve) => {
        uploader({
            onProgress: (e) => {
                const { fileList } = ctx.state;
                const curIndex = fileList.findIndex(n => n.fileId === fileId);
                let percent = (e.total > 0) ? e.loaded / e.total * 100 : 0;
                if (curIndex !== -1) {
                    fileList[curIndex].percent = percent;
                }
                console.log('----onProgress---', e, curIndex);
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
            headers: [],
        });
    });
}
export default class ImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadLoading: false, // 正在开始上传按钮loading是否显示
            fileList: [
                // {
                //     lastModified: 1558881596300,
                //     name: "560410975.jpg",
                //     size: 247172,
                //     type: "image/jpeg",
                //     percent: 0,
                //     relPath: '',
                //     file: {},
                //     fileId: '1558881596300',
                //     url: "blob:http://127.0.0.1:3004/d455501a-dfe1-4569-9990-4b2f5d740171",
                //     webkitRelativePath: "",
                // }
            ],
        };
    }
    componentDidMount() {
    }
    /**
     *  关闭上传组件
     *  @returns {object} null
     */
    handleCancel = () => {
        this.props.onToggleShowImageUploader(false);
    }
    /**
     *  选择图片进行预览
     *  @returns {object} null
     */
    handleChange = ({ currentTarget: node }) => {
        if (node.files && node.files[0]) {
            let file = node.files[0];
            let reader = new FileReader();
            let { fileList } = this.state;
            const ctx = this;
            reader.readAsArrayBuffer(file);
            reader.onload = function (e) {
                fileList.push({
                    binary: e.target.result,
                    url: window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](file),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file,
                    lastModified: file.lastModified,
                    fileId: Date.now().toString(),
                    webkitRelativePath: file.webkitRelativePath,
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
        let { fileList } = this.state;
        // const { markdownInfo } = this.props;
        let asyncUploadeQueue = fileList.map(({ file, fileId, relPath }) => {
            if (relPath) {
                return Promise.resolve({});
            }
            return new Promise(async (resolve, reject) => {
                const [error, data] = await asyncUploader({ file, fileId }, this);;
                if (!error && data) {
                    resolve(data);
                } else {
                    reject(error || {});
                }
            });
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
    onCopyLinkHandle = (file) => {
        if (window.clipboardData) {
            window.clipboardData.setData('uploaderRelPath', file.relPath);
            message.success('复制成功');
        } else {
            // 复制失败，弹框将复制的内容显示出来。
            message.error('复制失败');
        }
    }
    render() {
        const { canShowModal } = this.props;
        const { fileList, uploadLoading } = this.state;
        const fileListsJsx = fileList.map(file => {
            let linkClassName = 'image-preview-img-link';
            !file.relPath && (linkClassName += 'image-preview-disabled');
            return (
                <li className="image-preview-file" key={file.fileId}>
                    <div className="image-preview-url">
                        <img src={file.url} alt="图片" />
                        {file.percent && (<div className="image-preview-progres"><Progress percent={file.percent} size="small" /></div>)}
                    </div>
                    <div className="image-preview-info">
                        <div>
                            <span className="image-preview-img-name">{file.name}</span>
                            <Icon type="ellipsis" />
                        </div>
                        <div>
                            <span className="image-preview-img-size">陶宝中 {file.size}b</span>
                            <span className={linkClassName} onClick={() => {this.onCopyLinkHandle(file)}}><Icon type="link" />复制链接</span>
                        </div>
                    </div>
                </li>
            );
        });
        let modalClassName = 'image-uploader-modal';
        let coverClassName = 'image-loader-cover';
        fileList.length > 0 && (modalClassName += ' image-uploader-modal-90');
        !canShowModal && (coverClassName += ' image-loader-cover-hide');
        return (
            <div className={coverClassName}>
                <div className={modalClassName}>
                    <Icon type="close-circle" theme="twoTone" onClick={this.handleCancel} className="image-uploader-close-icon" />
                    {fileList.length === 0 ? (
                        <div className="image-uploader-uploader">
                            <div className="image-uploader-area">
                                <div className="image-uploader-placeholder">
                                    <Button type="dashed" onClick={this.onChoseImageHandle} className="image-uploader-button">
                                        <input type="file" onChange={this.handleChange}></input>
                                        点击选择图片
                                    </Button>
                                    <span className="image-uploader-drag-tips">或将照片拖到这里，单次最多可选1张</span>
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
                                        选中{fileList.length}张图片，共241.38K。
                                    </div>
                                    <div className="image-preview-footer-buttons">
                                        <Button type="dashed" onClick={this.onChoseImageHandle} className="image-uploader-button">
                                            <input type="file" onChange={this.handleChange}></input>继续添加
                                        </Button>
                                        <Button type="primary" loading={uploadLoading} onClick={this.onStartUploaderHandle}>开始上传</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }
};