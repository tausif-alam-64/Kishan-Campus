import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Star, 
  ChevronRight, 
  LayoutGrid, 
  List,
  GraduationCap,
  PlayCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const COURSES = [
  {
    id: 1,
    title: "Advanced Web Development with React",
    instructor: "Sarah Jenkins",
    duration: "12h 45m",
    lessons: 24,
    rating: 4.8,
    reviews: 1250,
    price: 89.99,
    category: "Development",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Mastering UI/UX Design Principles",
    instructor: "Michael Chen",
    duration: "8h 20m",
    lessons: 15,
    rating: 4.9,
    reviews: 840,
    price: 59.99,
    category: "Design",
    level: "Intermediate",
    image: "https://miro.medium.com/v2/resize:fit:1200/1*jFurB5ZN8fyDjL7b0mybow.png"
  },
  {
    id: 3,
    title: "Digital Marketing Strategy 2024",
    instructor: "Emma Rodriguez",
    duration: "10h 15m",
    lessons: 32,
    rating: 4.7,
    reviews: 2100,
    price: 49.99,
    category: "Marketing",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    title: "Python for Data Science Bootcamp",
    instructor: "Dr. Alex Rivera",
    duration: "22h 10m",
    lessons: 45,
    rating: 4.9,
    reviews: 3500,
    price: 129.99,
    category: "Data Science",
    level: "All Levels",
    image: "https://www.pythoncoursetraining.com/blog/uploads/images/202507/image_870x_687cbaa8c4f9a.webp"
  },
  {
    id: 5,
    title: "Project Management Fundamentals",
    instructor: "David Wilson",
    duration: "6h 30m",
    lessons: 12,
    rating: 4.6,
    reviews: 920,
    price: 39.99,
    category: "Business",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    title: "Cybersecurity Essentials",
    instructor: "James Knight",
    duration: "15h 50m",
    lessons: 28,
    rating: 4.8,
    reviews: 1100,
    price: 74.99,
    category: "IT & Software",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
  },

  // New Courses 🚀

  {
    id: 7,
    title: "Complete JavaScript Masterclass",
    instructor: "Daniel Carter",
    duration: "18h 40m",
    lessons: 38,
    rating: 4.9,
    reviews: 2890,
    price: 94.99,
    category: "Development",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    title: "Machine Learning with Python",
    instructor: "Sophia Turner",
    duration: "20h 15m",
    lessons: 42,
    rating: 4.8,
    reviews: 1980,
    price: 119.99,
    category: "Data Science",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 9,
    title: "Mobile App Design with Figma",
    instructor: "Olivia Brooks",
    duration: "9h 10m",
    lessons: 19,
    rating: 4.7,
    reviews: 760,
    price: 54.99,
    category: "Design",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 10,
    title: "Node.js & Express API Development",
    instructor: "Ryan Mitchell",
    duration: "14h 25m",
    lessons: 30,
    rating: 4.8,
    reviews: 1650,
    price: 79.99,
    category: "Development",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 11,
    title: "Financial Analysis & Budget Planning",
    instructor: "Laura Simmons",
    duration: "7h 55m",
    lessons: 16,
    rating: 4.6,
    reviews: 640,
    price: 44.99,
    category: "Business",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 12,
    title: "AWS Cloud Practitioner Certification",
    instructor: "Ethan Walker",
    duration: "16h 35m",
    lessons: 34,
    rating: 4.9,
    reviews: 2450,
    price: 99.99,
    category: "IT & Software",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 13,
    title: "SEO & Content Marketing Blueprint",
    instructor: "Natalie Green",
    duration: "11h 20m",
    lessons: 26,
    rating: 4.7,
    reviews: 1340,
    price: 64.99,
    category: "Marketing",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 14,
    title: "React Native App Development",
    instructor: "Chris Evans",
    duration: "17h 50m",
    lessons: 36,
    rating: 4.8,
    reviews: 1730,
    price: 109.99,
    category: "Development",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 15,
    title: "Ethical Hacking & Penetration Testing",
    instructor: "Nathan Scott",
    duration: "19h 30m",
    lessons: 40,
    rating: 4.9,
    reviews: 3200,
    price: 139.99,
    category: "IT & Software",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 16,
    title: "AI Prompt Engineering Mastery",
    instructor: "Isabella Moore",
    duration: "5h 45m",
    lessons: 14,
    rating: 4.8,
    reviews: 980,
    price: 34.99,
    category: "Artificial Intelligence",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
  }
];

const CATEGORIES = ["All", "Development", "Design", "Marketing", "Business", "Data Science"];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredCourses = COURSES.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-3">Explore Our <span className="text-primary">Courses</span></h1>
          <p className="text-slate-500 max-w-2xl">
            Choose from over 1,000 online video courses with new additions published every month.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for courses, skills, or mentors..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-slate-50/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
            <div className="hidden sm:flex border border-slate-200 rounded-xl p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:text-secondary'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-400 hover:text-secondary'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-primary border text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#213b5b] hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCourses.map(course => (
              <Link 
                key={course.id}
                to={'/detailPage'}
                className={`group flex bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-orange-200 transition-all duration-300 ${
                  viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'
                }`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-48 w-full' : 'h-48 sm:h-auto sm:w-72'}`}>
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{course.rating}</span>
                      <span className="text-slate-400 text-xs font-normal">({course.reviews})</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    by <span className="text-slate-900 font-medium">{course.instructor}</span>
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                      ${course.price}
                    </div>
                  </div>

                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-orange-50 text-primary py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    Enroll Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
              className="mt-6 text-primary font-semibold underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Features/Stats Section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 p-10 bg-primary rounded-3xl text-white">
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-black mb-1">10K+</div>
            <div className="text-orange-100 text-sm">Active Students</div>
          </div>
          <div className="flex flex-col items-center text-center border-y sm:border-y-0 sm:border-x border-white/20 py-8 sm:py-0">
            <div className="text-4xl font-black mb-1">450+</div>
            <div className="text-orange-100 text-sm">Expert Instructors</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-black mb-1">1.2K+</div>
            <div className="text-orange-100 text-sm">Online Courses</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 mt-20 pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-2 rounded-lg">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold">EduFlow</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-6 leading-relaxed">
                Empowering learners worldwide with accessible, high-quality education led by industry experts.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li><a href="#" className="hover:text-primary">Browse Courses</a></li>
                <li><a href="#" className="hover:text-primary">Mentorship</a></li>
                <li><a href="#" className="hover:text-primary">Roadmaps</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
            © 2024 EduFlow LMS. All rights reserved. Built with White & Orange.
          </div>
        </div>
      </footer>
    </div>
  );
}