
import React, { useState, useEffect, useCallback } from 'react';
import { Article, Category } from './types';
import { INITIAL_ARTICLES, CATEGORIES } from './constants';
import { geminiService } from './services/geminiService';

// --- Sub-components (Internal to maintain single file structure for App core) ---

const Header: React.FC<{ onMenuToggle: () => void; onPostClick: () => void }> = ({ onMenuToggle, onPostClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
          aria-label="Toggle Menu"
        >
          <div className="space-y-1.5 w-6">
            <span className="block h-0.5 w-6 bg-slate-900 group-hover:bg-indigo-600 transition-colors"></span>
            <span className="block h-0.5 w-6 bg-slate-900 group-hover:bg-indigo-600 transition-colors"></span>
            <span className="block h-0.5 w-6 bg-slate-900 group-hover:bg-indigo-600 transition-colors"></span>
          </div>
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-indigo-600 cursor-pointer" onClick={() => window.location.reload()}>
          LUMINA
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-indigo-600">Features</a>
        <a href="#" className="hover:text-indigo-600">Newsletter</a>
        <a href="#" className="hover:text-indigo-600">Community</a>
      </div>

      <button 
        onClick={onPostClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        Write Post
      </button>
    </header>
  );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; activeCategory: string; onCategorySelect: (cat: Category) => void }> = ({ isOpen, onClose, activeCategory, onCategorySelect }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-slate-900">Discover</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { onCategorySelect(cat as Category); onClose(); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeCategory === cat ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="mt-auto absolute bottom-8 left-8 right-8">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white">
              <p className="text-sm opacity-80 mb-2">Pro Plan</p>
              <h4 className="font-bold mb-3">Unlimited AI Drafting</h4>
              <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold">Upgrade Now</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const PostCard: React.FC<{ article: Article; onClick: () => void; onShare: () => void }> = ({ article, onClick, onShare }) => {
  return (
    <article className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={onClick}>
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h3 
          className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight"
          onClick={onClick}
        >
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
              {article.author.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-slate-700">{article.author}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors group/share"
            title="Share article"
          >
            <svg className="w-5 h-5 text-slate-400 group-hover/share:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

const CreatePostModal: React.FC<{ isOpen: boolean; onClose: () => void; onPost: (article: Article) => void }> = ({ isOpen, onClose, onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAiDraft = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const draft = await geminiService.generateDraft(aiPrompt);
      setTitle(draft.title || '');
      setContent(draft.content || '');
    } catch (err) {
      alert('Failed to generate draft. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: content.substring(0, 150) + '...',
      author: 'Current User',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/450`,
      readTime: `${Math.ceil(content.split(' ').length / 200)} min read`
    };

    onPost(newArticle);
    setTitle('');
    setContent('');
    setAiPrompt('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create New Article</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <label className="block text-sm font-bold text-indigo-700 mb-2 uppercase tracking-tight">AI Assistant</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type a topic for AI to write..." 
                className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button 
                onClick={handleAiDraft}
                disabled={isGenerating || !aiPrompt}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isGenerating ? 'Drafting...' : 'Generate'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Title</label>
              <input 
                type="text" 
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter a compelling title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Category</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Content</label>
              <textarea 
                required
                rows={10}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Tell your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl text-lg font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
            >
              Post Article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ArticleDetail: React.FC<{ article: Article; onClose: () => void; onShare: () => void }> = ({ article, onClose, onShare }) => {
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-50">
      <div className="sticky top-0 z-[90] bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to feed
        </button>
        <button 
          onClick={onShare}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          Share
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-[1.1]">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                {article.author.charAt(0)}
              </div>
              <span className="text-slate-900">{article.author}</span>
            </div>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        <div className="rounded-[40px] overflow-hidden shadow-2xl mb-16">
          <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover max-h-[600px]" />
        </div>

        <div className="prose prose-slate prose-xl mx-auto leading-relaxed">
          <p className="text-slate-700 whitespace-pre-wrap text-lg md:text-xl">
            {article.content}
          </p>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Enjoyed this story?</h3>
            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Get more stories like this delivered straight to your inbox every week.</p>
            <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-6 py-3 rounded-xl text-slate-900 outline-none" />
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Initialize articles from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('lumina_articles');
    if (saved) {
      setArticles(JSON.parse(saved));
    } else {
      setArticles(INITIAL_ARTICLES);
    }
  }, []);

  // Save to localStorage when articles change
  useEffect(() => {
    if (articles.length > 0) {
      localStorage.setItem('lumina_articles', JSON.stringify(articles));
    }
  }, [articles]);

  const handlePost = (newArticle: Article) => {
    setArticles([newArticle, ...articles]);
    // Optionally open the newly created article
    // setSelectedArticle(newArticle);
  };

  const handleShare = useCallback((article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(err => console.error('Share failed:', err));
    } else {
      // Fallback
      navigator.clipboard.writeText(`${article.title}\n\n${article.excerpt}\n\nShared from Lumina Blog`);
      alert('Article link copied to clipboard!');
    }
  }, []);

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen selection:bg-indigo-200 selection:text-indigo-900">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(true)} 
        onPostClick={() => setIsModalOpen(true)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Latest Stories</h2>
              <p className="text-slate-500 text-lg">Insightful perspectives from our global community.</p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredArticles.map(article => (
                <PostCard 
                  key={article.id} 
                  article={article} 
                  onClick={() => setSelectedArticle(article)}
                  onShare={() => handleShare(article)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white border border-dashed border-slate-300 rounded-[40px]">
              <div className="mb-6 inline-flex p-4 bg-indigo-50 rounded-full text-indigo-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">No articles found in {activeCategory}</h3>
              <p className="text-slate-500 mb-8">Be the first to share your thoughts in this category!</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-indigo-200 transition-all"
              >
                Create a Post
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">LUMINA</h2>
              <p className="text-slate-500 text-lg max-w-sm leading-relaxed">
                A modern platform for thinkers, builders, and dreamers. Join the movement and start sharing your voice with the world.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">Platform</h4>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Creators</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API & Tools</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">Connect</h4>
              <ul className="space-y-4 text-slate-600 font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Lumina Blog Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals & Full Views */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPost={handlePost} 
      />
      
      {selectedArticle && (
        <ArticleDetail 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)}
          onShare={() => handleShare(selectedArticle)}
        />
      )}
    </div>
  );
}
