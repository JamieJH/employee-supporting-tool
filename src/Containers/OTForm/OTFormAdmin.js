import React, { Component } from 'react';
import OTForm from './OTForm';
import { Field } from 'react-final-form';

import styles from '../FormStyles.module.css';

class OTFormAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            modalDetails: null
        }

        this.emailRef = React.createRef();
        this.statusFormRef = React.createRef();

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onSubmitHandler(logDetails, files) {
        this.props.onSubmitHandler(logDetails, files);
    }


    getUploadedFilesForEdit() {
        const files = this.props.initialValues.files;
        if (files) {
            return <div className={styles.initialFiles}>
                <h4>Current uploaded Files <i className="fas fa-cloud-download-alt"></i></h4>
                <div className={styles.initialFilesLinks}>
                    {files.map((file) => {
                        return <a key={file.name} href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
                    })}
                </div>
            </div>
        }
    }


    render() {
        return (
            <React.Fragment >
                <OTForm
                    role='admin'
                    action={this.props.action}
                    initialValues={this.props.initialValues}
                    onSubmitHandler={this.onSubmitHandler}>
                    <Field className={styles.formInput} name="status">
                        {({ input }) => (
                            <div className={styles.formInput}>
                                <label htmlFor="status">status</label>
                                <select id="status" {...input}>
                                    <option value="pending">pending</option>
                                    <option value="approved">approved</option>
                                    <option value="denied">denied</option>
                                </select>
                            </div>
                        )}
                    </Field>
                    <Field className={styles.formInput} name="processorComment">
                        {({ input }) => (
                            <div className={styles.formInput}>
                                <label htmlFor="processor-comment">processor comment</label>
                                <textarea id="processor-comment" {...input} />
                            </div>
                        )}
                    </Field>
                    <Field className={styles.formInput} name="processorEmail">
                        {({ input }) => (
                            <div className={styles.formInput}>
                                <label htmlFor="processor-email">processor</label>
                                <input type="text" id="processor-email" disabled {...input} />
                                <span className={styles.inputFootnote}>
                                    Adding (or Editing) this OT log will make you the latest processor.
                                </span>
                            </div>
                        )}
                    </Field>

                    {this.props.action === 'edit' && this.getUploadedFilesForEdit()}
                </OTForm>
            </React.Fragment>
        );
    }
}

export default OTFormAdmin;