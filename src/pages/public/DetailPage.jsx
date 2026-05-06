import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  Settings,
  Maximize,
  Volume2,
  FileText,
  Download,
  SkipForward,
  SkipBack,
  Trophy,
  Menu,
  X,
  Search
} from 'lucide-react';

const CURRICULUM = [
  {
    title: "Module 1: Getting Started",
    lessons: [
      { id: 1, title: "Welcome to the Course", duration: "05:20", completed: true, active: false },
      { id: 2, title: "Setting up the Environment", duration: "12:45", completed: true, active: false },
      { id: 3, title: "Understanding Next.js Architecture", duration: "15:10", completed: false, active: true }
    ]
  },
  {
    title: "Module 2: Core Concepts",
    lessons: [
      { id: 4, title: "Routing Fundamentals", duration: "18:22", completed: false, active: false },
      { id: 5, title: "Server Components vs Client Components", duration: "22:15", completed: false, active: false },
      { id: 6, title: "Data Fetching Patterns", duration: "10:45", completed: false, active: false }
    ]
  }
];

export default function DetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress] = useState(33);

  return (
    <div className="flex flex-col h-screen px-15 bg-white font-sans text-slate-900 overflow-hidden">

     

      <div className="flex flex-1 pt-10 overflow-hidden">

        {/* Main Player Area */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">

          {/* Video Player */}
          <div className="aspect-video bg-black relative group w-full max-h-[70vh] mr-6">

            <img
              src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&auto=format&fit=crop&q=80"
              className="w-full h-full object-cover opacity-60"
              alt="Video Preview"
            />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white transform hover:scale-110 transition-transform shadow-xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-3">

              <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer relative">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full"></div>

                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              </div>

              <div className="flex items-center justify-between text-white">

                <div className="flex items-center gap-4">

                  <button>
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button>
                    <Play className="w-5 h-5 fill-current" />
                  </button>

                  <button>
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>

                  <div className="flex items-center gap-2 ml-2">
                    <Volume2 className="w-5 h-5" />
                    <span className="text-xs font-medium">
                      10:45 / 24:00
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                    1x
                  </span>

                  <button>
                    <Settings className="w-5 h-5" />
                  </button>

                  <button>
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-w-4xl mx-auto w-full">

            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-8">

              {['overview', 'notes', 'resources', 'discussion'].map((tab) => (

                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${
                    activeTab === tab
                      ? 'text-primary'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}

                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="pb-10">

              {activeTab === 'overview' && (
                <div>

                  <h2 className="text-2xl font-black mb-4">
                    Advance web development with React
                  </h2>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    In this lesson, we dive deep into how React.js handles
                    server-side rendering, static site generation, and the
                    new App Router architecture.
                  </p>

                  <div className="flex flex-wrap gap-4">

                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                      <Download className="w-4 h-4" />
                      Download Transcript
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                      <FileText className="w-4 h-4" />
                      Lesson Assets (.zip)
                    </button>

                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

                  <textarea
                    placeholder="Take notes for this lesson..."
                    className="w-full h-32 bg-transparent border-none focus:ring-0 resize-none text-slate-700 text-sm"
                  />

                  <div className="flex justify-end mt-4">
                    <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm">
                      Save Note
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 lg:w-96 border-l border-slate-100 bg-white flex flex-col h-full overflow-hidden">

            <div className="p-4 border-b border-slate-100">

              <div className="relative mb-4">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

                <input
                  type="text"
                  placeholder="Search lessons..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">
                Course Content
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto">

              {CURRICULUM.map((module, mIdx) => (

                <div key={mIdx}>

                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-700">
                    {module.title}
                  </div>

                  {module.lessons.map((lesson) => (

                    <div
                      key={lesson.id}
                      className={`group flex items-start gap-3 p-4 cursor-pointer border-b border-slate-50 transition-all ${
                        lesson.active
                          ? 'bg-secondary'
                          : 'hover:bg-slate-50'
                      }`}
                    >

                      <div className="mt-1">

                        {lesson.completed ? (

                          <CheckCircle2 className="w-5 h-5 text-primary fill-secondary" />

                        ) : (

                          <div
                            className={`w-5 h-5 rounded-full border-2 ${
                              lesson.active
                                ? 'border-primary'
                                : 'border-slate-200'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1">

                        <p
                          className={`text-sm font-bold leading-tight mb-1 ${
                            lesson.active
                              ? 'text-primary'
                              : 'text-slate-800'
                          }`}
                        >
                          {lesson.title}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">

                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {lesson.duration}
                          </span>

                          {lesson.active && (
                            <span className="text-primary uppercase tracking-tighter">
                              Now Playing
                            </span>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}