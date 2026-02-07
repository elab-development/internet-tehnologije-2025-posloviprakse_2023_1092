import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogData'; 

const BlogPage = () => {
  return (
    <div className="w-full bg-slate-950 text-white py-16 px-4 min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 text-emerald-300 mb-4">
            <BookOpen size={20} />
            <p className="text-xs uppercase tracking-[0.3em] font-semibold">Blog</p>
          </div>
          <h2 className="mt-4 text-4xl md:text-6xl font-display font-bold bg-gradient-to-br from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
            Saveti za karijeru i intervjue
          </h2>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">Kratki, jasni tekstovi koji pomažu da doneseš bolju odluku u profesionalnom razvoju.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link 
              to={`/blog/${post.id}`} 
              key={post.id} 
              className="group bg-slate-900/50 rounded-3xl overflow-hidden hover:bg-slate-900/70 transition-all duration-300 transform hover:scale-105 hover:border-emerald-300/60 flex flex-col h-full border border-white/10 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">{post.category}</span>
                <h3 className="mt-3 text-xl font-semibold text-white leading-snug group-hover:text-emerald-300 transition">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>{post.date}</span>
                  </div>
                  <span className="text-sm text-emerald-300 group-hover:text-emerald-200 font-semibold">Pročitaj više →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;