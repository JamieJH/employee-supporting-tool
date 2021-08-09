import React, { Component } from 'react';

import styles from './FileInput.module.css';

class FileInput extends Component {
    render() {
        return (
            <React.Fragment>
                <label htmlFor="files">Profile Image</label>
                <input type="file" id="files"
                    className={styles.fileInput}
                    ref={this.imageRef}
                    onChange={this.props.onImageUploadedHandler}
                    accept={this.props.accept}
                />
                <div className={styles.fileInputUploader}>
                    <span><i className="fas fa-upload"></i></span>
                    <div>
                        <p>{this.props.uploadTitle}</p>
                        <p>{this.props.uploadRules}</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FileInput;