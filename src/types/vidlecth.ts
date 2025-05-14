export interface Transcript {
  time: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  timestamp: number;
  answered: boolean;
  isUser: boolean;
}

//   // components/LectureList/types.ts
// export interface Lecture {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   duration: number;
//   moduleNumber: number;
//   lectureNumber: number;
//   watched: boolean;
//   dateAdded: string;
// }



export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  moduleNumber: number;
  lectureNumber: number;
  watched: boolean;
  dateAdded: string;
  filename: string;
  size: number;
  hasTranscription: boolean;
  path: string;
}
// types/vidlecth.ts
export interface Lecture {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  moduleNumber: number;
  lectureNumber: number;
  watched: boolean;
  dateAdded: string;
  filename?: string;
  hasTranscription?: boolean;
  path?: string;
}

