import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './FileUploadDropzone.css';

interface FileUploadDropzoneProps {
    onFileSelect?: (file: File) => void;
    onContinueWithoutFile?: () => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
    onFileSelect,
    onContinueWithoutFile,
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isProcessing) setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const processAndRedirect = (file?: File) => {
        setIsProcessing(true);
        // Simulate auth/processing delay
        setTimeout(() => {
            if (file && onFileSelect) onFileSelect(file);
            if (!file && onContinueWithoutFile) onContinueWithoutFile();

            // Mock auth redirect - assuming /dashboard is the target
            navigate('/dashboard');
        }, 1500);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (isProcessing) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processAndRedirect(files[0]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processAndRedirect(e.target.files[0]);
        }
    };

    const handleDivClick = () => {
        if (!isProcessing) fileInputRef.current?.click();
    };

    const handleContinue = () => {
        if (!isProcessing) processAndRedirect();
    };

    return (
        <div className="file-upload-container">
            {/* Upload Dropzone */}
            <div className="dropzone-background-wrapper">
                <div
                    className={`dropzone-area ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleDivClick}
                    role="button"
                    tabIndex={0}
                >
                    {isProcessing ? (
                        <div className="dropzone-loading">
                            <div className="spinner"></div>
                            <p>Connect to Enrich...</p>
                        </div>
                    ) : (
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
                                    Instantané. Mis à jour chaque jour. Pas d'ingénieur requis.
                                </p>
                                <span className="dropzone-subtitle">Accepter: CSV, XLS, XLSX</span>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        className="hidden-file-input"
                        accept=".csv,.xls,.xlsx"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={isProcessing}
                    />
                </div>
            </div>

            {/* Help / Template Link */}
            <div className="dropzone-help-text">
                <p>
                    Besoin d’aide ? Utilisez notre{' '}
                    <a href="#" className="template-link" onClick={(e) => e.stopPropagation()}>
                        template
                    </a>{' '}
                    pour formater correctement vos données de leads
                </p>
            </div>

            {/* Action Buttons */}
            <div className="dropzone-actions">
                <button
                    type="button"
                    className="continue-button"
                    onClick={handleContinue}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Connecting...' : 'Ou continuer sans fichier'}
                </button>
            </div>
        </div>
    );
};
