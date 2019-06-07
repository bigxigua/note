import React, { Component } from 'react';
import { Icon, Button, Upload } from 'antd';
import axiosInstance from '../../util/axiosInstance.js';
import uploader from '../../util/uploader.js';
import {
    debunce,
    formatTimeStamp
} from '../../util/util.js';
import { DOMAIN } from '../../util/config.js';

export default class ImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [
                // {
                //     lastModified: 1558881596300,
                //     name: "560410975.jpg",
                //     size: 247172,
                //     type: "image/jpeg",
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
        const { fileList } = this.state;
        const { markdownInfo } = this.props;
        const { file, name, binary, type } = fileList[0];
        console.log(file);
        uploader({
            onProgress: (e) => {
                console.log('----onProgress---', e);
            },
            onError: (e) => {
                console.log('----onError---', e);
            },
            onSuccess: (e) => {
                console.log('----onSuccess---', e);
            },
            data: {
                name
            },
            filename: 'file',
            // file: new Blob(new Int8Array(binary), { type }),
            file,
            withCredentials: true,
            action: `${DOMAIN}uploadImage`,
            headers: [],
        });
        // let asyncUploadeQueue = fileList.map(item => {
        //     return new Promise(async (resolve, reject) => {
        //         const [error, data] = await axiosInstance.post('uploadImage', formData);
        //         if (!error && data) {
        //             resolve(data);
        //         } else {
        //             reject(error || {});
        //         }
        //     });
        // });
        // Promise.all(asyncUploadeQueue).then((res) => {
        //     console.log(res);
        // });
    }
    render() {
        const { canShowModal } = this.props;
        const { fileList } = this.state;
        const fileListsJsx = fileList.map(file => {
            return (
                <li className="image-preview-file" key={Math.random()}>
                    <div className="image-preview-url">
                        <img src={file.url} alt="图片" />
                    </div>
                    <div className="image-preview-info">
                        <div>
                            <span className="image-preview-img-name">{file.name}</span>
                            <Icon type="ellipsis" />
                        </div>
                        <div>
                            <span className="image-preview-img-size">陶宝中 {file.size}b</span>
                            <span className="image-preview-img-link"><Icon type="link" />复制链接</span>
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
                                        <Button type="primary" onClick={this.onStartUploaderHandle}>开始上传</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }
};