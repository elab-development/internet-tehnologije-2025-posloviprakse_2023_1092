import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const BlogPostDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Post nije pronađen</h2>
          <Link to="/blog" className="text-emerald-300 hover:text-emerald-200 font-semibold">
            ← Nazad na blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 text-white min-h-screen py-12 px-4">
      <div className="max-w-[900px] mx-auto">
        
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-semibold mb-8 group transition"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Nazad na blog
        </Link>

        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-400/30">
            <BookOpen size={14} />
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mt-6 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Calendar size={16} />
            <span>{post.date}</span>
          </div>
        </div>

        <div className="w-full h-[420px] mb-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg prose-invert max-w-none animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12">
            <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light italic border-l-4 border-emerald-400 pl-6">
              {post.excerpt}
            </p>
            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-base md:text-lg">
              {post.fullContent}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Vidi sve blogove
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BlogPostDetail;