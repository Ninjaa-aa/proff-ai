import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Download } from 'lucide-react';
import { Transcript } from '@/types/vidlecth';

interface TranscriptDisplayProps {
  videoId: string;
  currentTime: number;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ videoId, currentTime }) => {
  const [transcriptData, setTranscriptData] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://zt7rwk6f-5000.inc1.devtunnels.ms/api/video/${videoId}/transcript`);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        setTranscriptData(data.transcript);
        setError(null);
      } catch (error) {
        console.error('Error fetching transcript:', error);
        setError(error instanceof Error ? error.message : 'Failed to load transcript');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchTranscript();
    }
  }, [videoId]);

  const handleDownloadTranscript = () => {
    if (!transcriptData.length) return;

    const transcript = transcriptData
      .map(item => `[${Math.floor(item.time / 60)}:${(item.time % 60).toString().padStart(2, '0')}] ${item.text}`)
      .join('\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoId}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!transcriptData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500" />
          <p>No transcript available for this video.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadTranscript}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-gray-800 text-purple-300 hover:bg-gray-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Transcript
        </button>
      </div>

      {/* Transcript Content */}
      <div className="h-64 overflow-y-auto space-y-4">
        {transcriptData.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-colors ${
              item.time <= currentTime 
                ? 'bg-gray-800 border-l-2 border-purple-500' 
                : 'bg-gray-900'
            }`}
          >
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {Math.floor(item.time / 60)}:{(item.time % 60)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>
            <p className="text-gray-200">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptDisplay;