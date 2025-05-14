// // import React, { useState, useEffect, useCallback } from 'react';
// // import { Upload, Video, Loader2 } from 'lucide-react';
// // import io from 'socket.io-client';

// // const VideoUpload = () => {
// //   const [file, setFile] = useState(null);
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [status, setStatus] = useState('');
// //   const [error, setError] = useState('');
// //   const [socket, setSocket] = useState(null);
// //   const [isConnected, setIsConnected] = useState(false);

// //   // Socket initialization
// //   useEffect(() => {
// //     const newSocket = io('https://zt7rwk6f-5000.inc1.devtunnels.m', {
// //       transports: ['websocket', 'polling'],
// //       withCredentials: true
// //     });

// //     newSocket.on('connect', () => {
// //       setIsConnected(true);
// //       setError('');
// //     });

// //     newSocket.on('disconnect', () => {
// //       setIsConnected(false);
// //     });

// //     newSocket.on('processing_status', (data) => {
// //       if (data.status === 'success') {
// //         setIsUploading(false);
// //         setFile(null);
// //         setVideoTitle('');
// //         setStatus(data.message);
// //         setError('');
// //       } else {
// //         setError(data.message);
// //         setIsUploading(false);
// //       }
// //     });

// //     setSocket(newSocket);

// //     return () => {
// //       newSocket.close();
// //     };
// //   }, []);

// //   const handleUpload = useCallback(async () => {
// //     if (!file || !videoTitle || !socket?.connected) return;

// //     try {
// //       setIsUploading(true);
// //       setError('');
// //       setStatus('Processing video...');

// //       const reader = new FileReader();
      
// //       reader.onload = () => {
// //         socket.emit('upload_video', {
// //           file: reader.result,
// //           filename: file.name,
// //           title: videoTitle
// //         });
// //       };

// //       reader.onerror = (readerError: ProgressEvent<FileReader>) => {
// //         setError('Error reading file: ' + readerError.type);
// //         setIsUploading(false);
// //       };

// //       reader.readAsDataURL(file);

// //     } catch (error) {
// //       setError(error.message);
// //       setIsUploading(false);
// //     }
// //   }, [file, videoTitle, socket]);

// //   const handleFileSelect = useCallback((selectedFile) => {
// //     if (selectedFile) {
// //       setFile(selectedFile);
// //       setVideoTitle(selectedFile.name.split('.')[0]);
// //       setError('');
// //       setStatus('');
// //     }
// //   }, []);

// //   return (
// //     <div className="w-full max-w-2xl mx-auto p-6 space-y-4">
// //       <div className="space-y-4">
// //         <input
// //           type="text"
// //           value={videoTitle}
// //           onChange={(e) => setVideoTitle(e.target.value)}
// //           placeholder="Enter video title"
// //           className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
// //           disabled={isUploading}
// //         />

// //         <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
// //           <input
// //             type="file"
// //             accept="video/*"
// //             onChange={(e) => handleFileSelect(e.target.files?.[0])}
// //             className="hidden"
// //             id="video-upload"
// //             disabled={isUploading}
// //           />
// //           <label
// //             htmlFor="video-upload"
// //             className="flex flex-col items-center justify-center cursor-pointer"
// //           >
// //             <Video className="w-12 h-12 text-gray-400 mb-2" />
// //             <span className="text-gray-400">
// //               {file ? file.name : 'Choose video file'}
// //             </span>
// //           </label>
// //         </div>

// //         <button
// //           onClick={handleUpload}
// //           disabled={isUploading || !file || !videoTitle || !isConnected}
// //           className="w-full p-3 bg-purple-600 rounded text-white font-medium
// //                      disabled:opacity-50 disabled:cursor-not-allowed
// //                      flex items-center justify-center gap-2"
// //         >
// //           {isUploading ? (
// //             <>
// //               <Loader2 className="w-4 h-4 animate-spin" />
// //               Processing...
// //             </>
// //           ) : (
// //             <>
// //               <Upload className="w-4 h-4" />
// //               Upload Video
// //             </>
// //           )}
// //         </button>

// //         {error && (
// //           <div className="p-4 rounded bg-red-500/20 border border-red-500 text-red-300">
// //             {error}
// //           </div>
// //         )}

// //         {status && !error && (
// //           <div className="p-4 rounded bg-green-500/20 border border-green-500 text-green-300">
// //             {status}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoUpload;

// import React, { useState, useEffect, useCallback } from 'react';
// import { Upload, Video, Loader2, CheckCircle } from 'lucide-react';
// import io from 'socket.io-client';

// const VideoUpload = () => {
//   const [file, setFile] = useState(null);
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadComplete, setUploadComplete] = useState(false);
//   const [error, setError] = useState('');
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   // Socket initialization
//   useEffect(() => {
//     const newSocket = io('https://zt7rwk6f-5000.inc1.devtunnels.ms', {
//       transports: ['websocket', 'polling'],
//       withCredentials: true
//     });

//     newSocket.on('connect', () => {
//       setIsConnected(true);
//       setError('');
//     });

//     newSocket.on('disconnect', () => {
//       setIsConnected(false);
//     });

//     newSocket.on('processing_status', (data) => {
//       if (data.status === 'success') {
//         setIsUploading(false);
//         setUploadComplete(true);
//         // Reset form after 3 seconds
//         setTimeout(() => {
//           setFile(null);
//           setVideoTitle('');
//           setUploadComplete(false);
//         }, 3000);
//       } else if (data.status === 'error') {
//         setError(data.message);
//         setIsUploading(false);
//       }
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   const handleUpload = useCallback(async () => {
//     if (!file || !videoTitle || !socket?.connected) return;

//     try {
//       setIsUploading(true);
//       setError('');
//       setUploadComplete(false);

//       const reader = new FileReader();
      
//       reader.onload = () => {
//         socket.emit('upload_video', {
//           file: reader.result,
//           filename: file.name,
//           title: videoTitle
//         });
//       };

//       reader.onerror = (readerError) => {
//         setError('Error reading file: ' + readerError.type);
//         setIsUploading(false);
//       };

//       reader.readAsDataURL(file);

//     } catch (error) {
//       setError(error.message);
//       setIsUploading(false);
//     }
//   }, [file, videoTitle, socket]);

//   const handleFileSelect = useCallback((selectedFile) => {
//     if (selectedFile) {
//       setFile(selectedFile);
//       setVideoTitle(selectedFile.name.split('.')[0]);
//       setError('');
//       setUploadComplete(false);
//     }
//   }, []);

//   return (
//     <div className="w-full max-w-2xl mx-auto p-6 space-y-4">
//       <div className="space-y-4">
//         <input
//           type="text"
//           value={videoTitle}
//           onChange={(e) => setVideoTitle(e.target.value)}
//           placeholder="Enter video title"
//           className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
//           disabled={isUploading}
//         />

//         <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
//           <input
//             type="file"
//             accept="video/*"
//             onChange={(e) => handleFileSelect(e.target.files?.[0])}
//             className="hidden"
//             id="video-upload"
//             disabled={isUploading}
//           />
//           <label
//             htmlFor="video-upload"
//             className="flex flex-col items-center justify-center cursor-pointer"
//           >
//             <Video className="w-12 h-12 text-gray-400 mb-2" />
//             <span className="text-gray-400">
//               {file ? file.name : 'Choose video file'}
//             </span>
//           </label>
//         </div>

//         <button
//           onClick={handleUpload}
//           disabled={isUploading || !file || !videoTitle || !isConnected}
//           className="w-full p-3 bg-purple-600 rounded text-white font-medium
//                      disabled:opacity-50 disabled:cursor-not-allowed
//                      flex items-center justify-center gap-2"
//         >
//           {isUploading ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               <Upload className="w-4 h-4" />
//               Upload Video
//             </>
//           )}
//         </button>

//         {error && (
//           <div className="p-4 rounded bg-red-500/20 border border-red-500 text-red-300">
//             {error}
//           </div>
//         )}

//         {uploadComplete && (
//           <div className="p-4 rounded bg-green-500/20 border border-green-500 text-green-300 flex items-center gap-2">
//             <CheckCircle className="w-5 h-5" />
//             Video uploaded and processed successfully!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoUpload;
// Complete VideoUpload component with status code handling

import React, { useState, useEffect } from 'react';
import { Upload, Video, Loader2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('https://zt7rwk6f-5000.inc1.devtunnels.ms');

interface VideoInfo {
    filename: string;
    title: string;
    hasTranscription: boolean;
}

export default function VideoUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [videos, setVideos] = useState<VideoInfo[]>([]);
    const [processingComplete, setProcessingComplete] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    // Add new state for processing success
    const [processingSuccess, setProcessingSuccess] = useState<boolean | null>(null);
    const [processingVideos, setProcessingVideos] = useState<Set<string>>(new Set());
    useEffect(() => {
        // Initial fetch of videos
        fetchVideos();
        socket.on('connect', () => {
            console.log('Socket connected with ID:', socket.id);
            if (processingVideos.size > 0) {
                console.log('Checking status of videos being processed:', Array.from(processingVideos));
                // Request status update for videos being processed
                Array.from(processingVideos).forEach(title => {
                    socket.emit('check_processing_status', { video_title: title });
                });
            }
          });
          
          socket.on('disconnect', () => {
            console.log('Socket disconnected');
          });
          
          socket.on('processing_status', (data) => {
            console.log('RECEIVED PROCESSING STATUS:', data);
            handleProcessingStatus(data);
          });
        const handleProcessingStatus = (data) => {
            console.log('RAW processing status received:', data);
            
            // Set status message if present
            if (data.message) {
              setStatus(data.message);
            }
            if (data.video_title && processingVideos.has(data.video_title)) {
                // If it's completed (success or error), remove from tracking
                if (data.status_code !== undefined) {
                    setProcessingVideos(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(data.video_title);
                        return newSet;
                    });
                }
            }
            // Explicitly check for the numeric status code
            if (data.status_code !== undefined) {
              console.log(`Status code received: ${data.status_code} (type: ${typeof data.status_code})`);
              
              // Use strict equality to ensure proper type checking
              const isSuccess = data.status_code === 1;
              setProcessingSuccess(isSuccess);
              setProcessingComplete(true);
              setIsProcessing(false);
              
              // Refresh videos list on success
              if (isSuccess) {
                fetchVideos();
              }
              
              // Reset form after delay
              setTimeout(() => {
                setProcessingComplete(false);
                setStatus('');
                setFile(null);
                setVideoTitle('');
                setProcessingSuccess(null);
              }, 5000);
            }
          };
        const handleVideoList = (data: { videos: string[]; video_dbs: string[] }) => {
            console.log('Video list update:', data);
            const videoInfos = data.videos.map(filename => ({
                filename,
                title: filename.split('.')[0].replace(/_/g, ' '),
                hasTranscription: data.video_dbs.some(db => 
                    db.toLowerCase() === filename.split('.')[0].toLowerCase().replace(/_/g, ' ')
                )
            }));
            setVideos(videoInfos);
        };

        const handleDeleteStatus = (data: { status: string; message: string }) => {
            if (data.status === 'success') {
                fetchVideos();
                setStatus('Video deleted successfully');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus(`Error: ${data.message}`);
            }
            setIsDeleting(null);
        };

        socket.on('processing_status', handleProcessingStatus);
        socket.on('video_databases_list', handleVideoList);
        socket.on('video_delete_status', handleDeleteStatus);

        return () => {
            socket.off('processing_status', handleProcessingStatus);
            socket.off('video_databases_list', handleVideoList);
            socket.off('video_delete_status', handleDeleteStatus);
        };
    }, []);

    const fetchVideos = () => {
        console.log('Fetching videos...');
        socket.emit('get_video_databases');
    };

    const handleDelete = async (video: VideoInfo) => {
        try {
            setIsDeleting(video.filename);
            socket.emit('delete_video', {
                title: video.title,
                filename: video.filename
            });
        } catch (error) {
            console.error('Error deleting video:', error);
            setStatus('Error deleting video');
            setIsDeleting(null);
        }
    };

    const handleUpload = () => {
        if (!file || !videoTitle) {
            setStatus('Please ensure file and title are available');
            return;
        }

        setIsProcessing(true);
        setStatus('Uploading and processing video...');
        setProcessingComplete(false);
        setProcessingSuccess(null);
        setProcessingVideos(prev => new Set(prev).add(videoTitle));
        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result?.toString().split(',')[1];
            socket.emit('upload_video', {
                file: content,
                filename: file.name,
                title: videoTitle
            });
        };
        
        reader.onerror = () => {
            setStatus('Error reading file');
            setIsProcessing(false);
        };

        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setVideoTitle(selectedFile.name.split('.')[0]);
            setStatus('');
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

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            setVideoTitle(droppedFile.name.split('.')[0]);
            setStatus('');
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Video Upload</h2>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Video Title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full p-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={isProcessing}
                    />
                </div>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        w-full p-8 border-2 border-dashed rounded-lg transition-all duration-200 mb-6
                        ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-500/50'}
                        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <Video className="w-8 h-8 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-400 mb-2">
                            Drag and drop your video here, or click to browse
                        </p>
                        <label className="text-blue-400 hover:text-blue-300 cursor-pointer">
                            Browse videos
                            <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isProcessing}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            MP4, WebM, and other video formats supported
                        </p>
                    </div>
                </div>

                {file && (
                    <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-300">
                            Selected video: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={isProcessing || !file || !videoTitle}
                    className={`
                        w-full p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                        ${isProcessing || !file || !videoTitle
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }
                    `}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload Video
                        </>
                    )}
                </button>

                {status && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        processingSuccess === true
                        ? 'bg-green-500/20 text-green-200'
                        : processingSuccess === false
                            ? 'bg-red-500/20 text-red-200'
                            : 'bg-blue-500/20 text-blue-200'
                    }`}>
                        <div className="flex items-center gap-2">
                        {processingSuccess === true && <CheckCircle className="w-5 h-5" />}
                        {processingSuccess === false && <AlertTriangle className="w-5 h-5" />}
                        {status}
                        </div>
                    </div>
                    )}
            </div>

            {/* Video Management Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Manage Videos</h2>
                </div>

                <div className="space-y-2">
                    {videos.map((video) => (
                        <div 
                            key={video.filename}
                            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Video className="w-5 h-5 text-gray-400" />
                                <div>
                                    <span className="text-gray-300">{video.title}</span>
                                    {video.hasTranscription && (
                                        <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                            Processed
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(video)}
                                disabled={isDeleting === video.filename}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete video"
                            >
                                {isDeleting === video.filename ? (
                                    <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                )}
                            </button>
                        </div>
                    ))}

                    {videos.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            No videos uploaded yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}