import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import './FileUploadDropzone.css';
import { useModal } from '../context/ModalContext';

interface FileUploadDropzoneProps {
    onFileSelect?: (file: File) => void;
    onContinueWithoutFile?: () => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
    onFileSelect,
    onContinueWithoutFile,
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const { openRegisterModal } = useModal();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            openRegisterModal(files[0]);
            if (onFileSelect) onFileSelect(files[0]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            openRegisterModal(e.target.files[0]);
            if (onFileSelect) onFileSelect(e.target.files[0]);
        }
    };

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleContinue = () => {
        openRegisterModal();
        if (onContinueWithoutFile) onContinueWithoutFile();
    };

    return (
        <>
            <div className="file-upload-container">
                {/* Upload Dropzone */}
                <div className="dropzone-background-wrapper">
                    <div
                        className={`dropzone-area ${isDragOver ? 'drag-over' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleDivClick}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="dropzone-content">
                            {/* Icon */}
                            <div className={`dropzone-icon ${isDragOver ? 'active' : ''}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
                                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                    <path d="M3 15h6"></path>
                                    <path d="M6 12v6"></path>
                                </svg>
                            </div>

                            {/* Text */}
                            <div className="dropzone-text-group">
                                <p className="dropzone-title">
                                    Instant results. Updated daily. No engineer required.
                                </p>
                                <span className="dropzone-subtitle">Accepts: CSV, XLS, XLSX</span>
                            </div>
                        </div>

                        <input
                            type="file"
                            className="hidden-file-input"
                            accept=".csv,.xls,.xlsx"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Help / Template Link */}
                <div className="dropzone-help-text">
                    <p>
                        Need help? Use our{' '}
                        <a href="#" className="template-link" onClick={(e) => e.stopPropagation()}>
                            template
                        </a>{' '}
                        to format your lead data correctly
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="dropzone-actions">
                    <button
                        type="button"
                        className="continue-button"
                        onClick={handleContinue}
                    >
                        Or continue without a file
                    </button>
                </div>
            </div>
        </>
    );
};
