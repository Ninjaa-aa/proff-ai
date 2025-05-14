'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "@/components/chatbothero/hero";
import Navbar from "@/components/navbar/navbar";
import TestUpload from "@/components/testupload/testupload";
import VideoUpload from "@/components/vidupload/upload";
import { useState } from "react";
import { withAuth } from "@/components/auth/withAuth";

function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('books');

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user?.role !== 'admin')) {
            router.replace('/');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session?.user || session.user.role !== 'admin') {
        return null;
    }

    return (
        <div>
            <Navbar />
            <Hero />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'books' 
                                    ? 'bg-gray-700 text-purple-300' 
                                    : 'text-gray-400 hover:text-purple-300'
                            }`}
                        >
                            Course Books
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'videos' 
                                    ? 'bg-gray-700 text-purple-300' 
                                    : 'text-gray-400 hover:text-purple-300'
                            }`}
                        >
                            Video Lectures
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'books' ? <TestUpload /> : <VideoUpload />}
                </div>
            </div>
        </div>
    );
}

export default withAuth(AdminPage, { requireAdmin: true });