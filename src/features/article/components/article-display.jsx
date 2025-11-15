import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

export function ArticlePage() {

  const { id } = useParams();
  const location = useLocation();
  const article = location.state?.article;

  const relatedArticles = [
    {
      title: 'Giải vô địch Taekwondo Châu Á',
      category: 'Giải Quốc Tế',
      date: '2025-09-30T04:30:00.000Z',
      img: 'https://placehold.co/400x300/eff6ff/2563eb?text=Asian+Championship'
    },
    {
      title: 'Tổng kết hành trình năm 2024',
      category: 'Sự Kiện CLB',
      date: '2024-12-30T04:30:00.000Z',
      img: 'https://placehold.co/400x300/fef2f2/dc2626?text=Year+End+2024'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="font-semibold">Quay lại</span>
            </a> */}
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="font-semibold">Quay lại</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">HK</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Hổ Kình</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-full text-sm font-bold">
            {article.category.categoryName}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{formatDate(article.date)}</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img src={article.coverImage} alt={article.title} className="w-full h-auto" />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="article-content text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          />
        </div>

        {/* Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Hình ảnh</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {article.gallery.map((img, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <span className="text-gray-600 font-semibold">Chia sẻ:</span>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </button>
            <button className="w-10 h-10 bg-gray-700 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {/* <section className="py-16 bg-gradient-to-b from-white/50 to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-8">
            Bài viết liên quan
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {relatedArticles.map((relArticle, index) => (
              <a key={index} href="#" className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={relArticle.img} alt={relArticle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                      {relArticle.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {relArticle.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{formatDate(relArticle.date)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}