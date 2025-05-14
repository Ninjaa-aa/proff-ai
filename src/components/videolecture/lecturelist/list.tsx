// components/LectureList/LectureList.tsx
import React, { useEffect, useState } from 'react';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { Video } from '@/types/vidlecth';

interface LectureListProps {
  onLectureSelect?: (lecture: Video) => void;
  currentLectureId?: string;
}

const LectureList: React.FC<LectureListProps> = ({ onLectureSelect, currentLectureId }) => {
  const [lectures, setLectures] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  // The API URL should match your backend port
  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        console.log('Fetching lectures from:', `${API_URL}/api/videos`);
        const response = await fetch(`${API_URL}/api/videos`);
        const data = await response.json();
        console.log('Received lectures data:', data);
        setLectures(data.videos);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  // Function to get proper thumbnail URL with fallback
  const getThumbnailUrl = (lecture: Video): string => {
    // Use server-generated thumbnail if available
    if (lecture.thumbnail) {
      return `${API_URL}${lecture.thumbnail}`;
    }
    
    // Fallback to placeholder
    return '/api/placeholder/320/180';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-200">Course Content</h2>
        <div className="text-sm text-gray-400">
          {lectures.filter(l => l.watched).length}/{lectures.length} completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            onClick={() => onLectureSelect?.(lecture)}
            className={`
              group cursor-pointer rounded-xl overflow-hidden
              border ${currentLectureId === lecture.id 
                ? 'border-purple-500' 
                : 'border-gray-800'
              }
              bg-gray-900 hover:bg-gray-800 transition-all
              ${currentLectureId === lecture.id ? 'ring-2 ring-purple-500' : ''}
            `}
          >
            <div className="relative aspect-video">
              <div className="w-full h-full bg-gray-800">
                <img
                  src={getThumbnailUrl(lecture)}
                  alt={lecture.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Replace with fallback if image fails to load
                    e.currentTarget.src = '/api/placeholder/320/180';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              {lecture.watched && (
                <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                  {lecture.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-400 text-sm shrink-0">
                  <Clock className="w-4 h-4" />
                  {formatDuration(lecture.duration || 0)}
                </div>
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-2">
                {lecture.description}
              </p>
              
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Module {lecture.moduleNumber} • Lecture {lecture.lectureNumber}
                </span>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LectureList;