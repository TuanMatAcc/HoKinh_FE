import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatDate from '../../../utils/formatDate';
import { Calendar, ChevronLeft, UserPen } from 'lucide-react';
import { useArticle } from '../../../hooks/useArticle';
import { generateHTMLFromJSON } from '../../../utils/generateHtmlUtils';
import { useEffect, useState } from 'react';
import { ThreeDotLoader } from '../../../components/ActionFallback';


export function ArticlePage() {
  
  const { id } = useParams();
  const location = useLocation();
  console.log(id);
  
  const {data: fetchedArticle} = useArticle(parseInt(id));
  const [article, setArticle] = useState(location.state?.article);
  console.log(fetchedArticle);
  
  
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const articleUrl = `${window.location.origin}/article/${id}`;

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      articleUrl
    )}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const openYouTube = () => {
    window.open(
      "https://youtube.com/@taekwondohokinh?si=yVECP5qWEYaTKY_P",
      "_blank"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      toast.success("Đã sao chép liên kết!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (e) {
      toast.error("Không thể sao chép liên kết", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  useEffect(() => {
    if(fetchedArticle?.data) {
      setArticle(fetchedArticle.data);
    }
  }, [fetchedArticle])

  return (
    <>
      {!article && 
        <ThreeDotLoader
          message='Đang tải tin tức. Vui lòng chờ !'
        />
      }
      {article && (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-red-50">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                  <span className="font-semibold">Quay lại</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-red-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">HK</span>
                  </div>
                  <span className="font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                    Hổ Kình
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-linear-to-r from-red-600 to-blue-600 text-white rounded-full text-sm font-bold">
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
                <UserPen size={23} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={23} />
                <span>
                  {formatDate({
                    dateString: article.date,
                    showTime: false,
                    region: "vi-VN",
                  })}
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="article-content text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: generateHTMLFromJSON(article.content),
                }}
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.8",
                }}
              />
            </div>

            {/* Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Hình ảnh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {article.gallery.map((img, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-gray-600 font-semibold">Chia sẻ:</span>
              <div className="flex gap-3">
                <button
                  onClick={shareFacebook}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </button>
                <button
                  onClick={copyLink}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
}