import React from 'react';
import PropTypes from 'prop-types';

import styles from './FileInput.module.css';

const FileInput = (props) => {
	return (
		<React.Fragment>
			<label htmlFor="files">{props.label}</label>
			<input type="file" id="files"
				className={styles.fileInput}
				onChange={props.onFileUploadHandler}
				accept={props.accept}
				multiple={props.multiple}
			/>
			<div className={styles.fileInputUploader}>
				<span><i className="fas fa-upload"></i></span>
				<div>
					<p>{props.uploadTitle}</p>
					<p>{props.uploadRules}</p>
				</div>
			</div>
		</React.Fragment>
	);

}

FileInput.propTypes = {
	accept: PropTypes.string,
	multiple: PropTypes.bool,
	uploadTitle: PropTypes.string,
	uploadRules: PropTypes.string,
	onFileUploadHandler: PropTypes.func
};

export default FileInput;