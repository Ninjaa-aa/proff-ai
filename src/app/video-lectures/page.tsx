// pages/Videopage.tsx
'use client';
import { useState, useEffect } from 'react';
import Hero from "@/components/chatbothero/hero";
import Navbar from "@/components/navbar/navbar";
import VideoLecture from "@/components/videolecture/lectplayer/vidlecth";
import LectureList from "@/components/videolecture/lecturelist/list";
import { Lecture } from "@/types/vidlecth";

export default function Videopage() {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('https://zt7rwk6f-5000.inc1.devtunnels.ms/api/videos');
        const data = await response.json();
        setProgress({
          completed: data.completed,
          total: data.total
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  const handleLectureSelect = (lecture: Lecture) => {
    setSelectedLecture(lecture);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="mt-8">
          <LectureList 
            onLectureSelect={handleLectureSelect} 
            currentLectureId={selectedLecture?.id} 
          />
        </div>
        
        <div className="space-y-8">
          <div className="bg-gray-900 p-4 rounded-lg">
            {/* <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Course Progress</span>
              <span>{progress.completed} / {progress.total} Lectures Completed</span>
            </div> */}
            {/* <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${progress.total ? (progress.completed / progress.total) * 100 : 0}%` 
                }}
              />
            </div> */}
          </div>
          
          {selectedLecture && <VideoLecture video={selectedLecture} />}
        </div>
      </div>
    </div>
  );
}