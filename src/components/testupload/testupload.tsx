'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import io from 'socket.io-client';

// Socket connection
const socket = io('https://zt7rwk6f-5000.inc1.devtunnels.ms');

// Type definitions
type UploadStatus = {
    status: 'success' | 'error';
    message: string;
};

export default function TestUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfTitle, setPdfTitle] = useState('');
    const [databases, setDatabases] = useState<string[]>([]);

    // Fetch existing databases
    const fetchDatabases = () => {
        socket.emit('get_databases');
    };

    useEffect(() => {
        fetchDatabases();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = () => {
        if (file && pdfTitle) {
            setIsProcessing(true);
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result?.toString().split(',')[1];
                socket.emit('file_upload', {
                    filename: file.name,
                    content: content,
                    pdf_title: pdfTitle
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteDatabase = (title: string) => {
        socket.emit('delete_database', { pdf_title: title });
    };

    // Socket event listeners
    useEffect(() => {
        const handleUploadStatus = (data: UploadStatus) => {
            setStatus(data.message);
            setIsProcessing(false);
            if (data.status === 'success') {
                setFile(null);
                setPdfTitle('');
                fetchDatabases(); // Refresh database list after successful upload
            }
        };

        const handleDeleteStatus = (data: UploadStatus) => {
            setStatus(data.message);
            if (data.status === 'success') {
                fetchDatabases(); // Refresh database list after successful deletion
            }
        };

        const handleDatabasesList = (data: string[]) => {
            setDatabases(data);
        };

        socket.on('upload_status', handleUploadStatus);
        socket.on('delete_status', handleDeleteStatus);
        socket.on('databases_list', handleDatabasesList);

        return () => {
            socket.off('upload_status', handleUploadStatus);
            socket.off('delete_status', handleDeleteStatus);
            socket.off('databases_list', handleDatabasesList);
        };
    }, []);

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">File Upload</h2>
                </div>

                {/* PDF Title Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Course Book Name"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        className="w-full p-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleFileDrop}
                    className={`
                        w-full p-8 border-2 border-dashed rounded-lg transition-all duration-200 mb-6
                        ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-500/50'}
                    `}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-400 mb-2">
                            Drag and drop your files here, or click to browse
                        </p>
                        <label className="text-blue-400 hover:text-blue-300 cursor-pointer">
                            Browse files
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">PDF files only, limit 200MB per file</p>
                    </div>
                </div>

                {file && (
                    <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-300">
                            Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={isProcessing || !file}  // Removed !pdfTitle condition
                    className={`w-full p-3 rounded-lg font-medium transition-colors ${
                        isProcessing || !file  // Removed !pdfTitle from className condition
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isProcessing ? 'Processing...' : 'Upload'}
                </button>

                {status && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        status.includes('Error') 
                            ? 'bg-red-500/20 text-red-200' 
                            : 'bg-green-500/20 text-green-200'
                    }`}>
                        {status}
                    </div>
                )}
            </div>

            {/* Database Management Section */}
            {databases.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <h2 className="text-xl font-bold mb-4">Manage Databases</h2>
                    <div className="space-y-2">
                        {databases.map((db) => (
                            <div key={db} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <span className="text-gray-300">{db}</span>
                                <button
                                    onClick={() => handleDeleteDatabase(db)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}