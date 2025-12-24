import { useState,Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary'
import logo from '@/assets/images/homepage/logo_rmbg.png'
import main_img from '@/assets/images/homepage/original_main.png'
import  { facilityService }  from '@/services/facility_api.js';
import { awardService } from '../services/award_api';
import { articleService } from '../services/article_api';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { LoadingErrorUI } from '../components/LoadingError';
import Banner from '../components/Banner';
import { generateHTMLFromJSON } from '../utils/generateHtmlUtils';

export function Homepage() {

  const [scrollProgress, setScrollProgress] = useState(0);
  const scheduleSectionRef = useRef(null);
  const achievementSectionRef = useRef(null);
  const eventSectionRef = useRef(null);
  const informationSectionRef = useRef(null);
  const [user] = useState({
      ...JSON.parse(
        localStorage.getItem("userInfo")
          && localStorage.getItem("userInfo")
      ),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    });
    console.log(user);
    
  return (
    <>
      <StickyNavbar role={user.role}/>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-red-50">
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 lg:pr-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                  <span className="bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Câu lạc bộ
                  </span>
                  <br />
                  <span className="bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Taekwondo Hổ Kình
                  </span>
                </h1>
                
                <div className="h-1 w-24 bg-linear-to-r from-red-500 to-blue-500 rounded-full"></div>
              </div>

              <div className="space-y-4">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Chào mừng bạn đến với
                </p>
                <p className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Taekwondo Hổ Kình
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nơi đào tạo uy tín luôn đặt chất lượng và ưu tiên người học làm tôn chỉ.
                  Hãy <span className="font-semibold text-gray-800">Đăng Ký</span> hoặc{' '}
                  <span className="font-semibold text-gray-800">Liên Hệ</span> để được chúng tôi tư vấn, hỗ trợ các thắc mắc của bạn.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <ThemeButton name="Đăng Ký" />
                <ThemeOutlinedButton name="Liên Hệ" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <StatCard number="500+" label="Học viên" />
                <StatCard number="15+" label="Năm kinh nghiệm" />
                <StatCard number="50+" label="Giải thưởng" />
              </div>
            </div>

            {/* Right Image - Placeholder */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                  <img src= {main_img} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* Features Section */}
        <div className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Tại sao chọn chúng tôi?
              </h2>
              <div className="h-1 w-24 bg-linear-to-r from-red-500 to-blue-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon="🥋"
                title="Huấn luyện chuyên nghiệp"
                description="Đội ngũ HLV giàu kinh nghiệm, tận tâm với học viên"
              />
              <FeatureCard 
                icon="🏆"
                title="Thành tích xuất sắc"
                description="Nhiều học viên đạt huy chương tại các giải đấu"
              />
              <FeatureCard 
                icon="💪"
                title="Môi trường thân thiện"
                description="Không gian tập luyện hiện đại, an toàn"
              />
            </div>
          </div>
        </div>
          
        
        {/* Schedule Section */}
        <ScheduleSection sectionRef= {scheduleSectionRef}></ScheduleSection>
        <AchievementSection sectionRef={achievementSectionRef}></AchievementSection>
        <EventSection sectionRef={eventSectionRef}></EventSection>
        <Footer></Footer>
          

      </div>
    </>
  );
}

function OrcaBackground() {
  return (
    <div className='absolute inset-0 flex items-center justify-center pointer-events-none -z-10'>
      <img 
        src="/orca_up.svg" 
        alt="" 
        className="w-96 h-96 opacity-5" 
      />
    </div>
  );
}

function SymmetricOrcaBackground() {
  return (
    <>
      {/* Left Orca */}
      <div className='absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-15'>
        <img 
          src="/orca_up.svg" 
          alt="" 
          className="w-64 h-64 scale-x-[-1]" 
        />
      </div>
      
      {/* Right Orca */}
      <div className='absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-15'>
        <img 
          src="/orca_up.svg" 
          alt="" 
          className="w-64 h-64" 
        />
      </div>
    </>
  );
}

function SwimmingOrcaBackground() {
  return (
    <div className='absolute inset-0 pointer-events-none -z-10 opacity-10 overflow-hidden'>
      <img 
        src="/orca_up.svg" 
        alt="" 
        className="w-40 h-40 absolute top-4 left-10 rotate-12" 
      />
      <img 
        src="/orca_up.svg" 
        alt="" 
        className="w-32 h-32 absolute top-20 right-20 -rotate-45 scale-x-[-1]" 
      />
      <img 
        src="/orca_up.svg" 
        alt="" 
        className="w-48 h-48 absolute bottom-10 left-1/4 rotate-6" 
      />
    </div>
  );
}


function StickyNavbar({role}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 max-xl:ml-5 mb-5 flex scale-200 items-center h-12">
              <img src= {logo} alt="" />
            </div>
            <div className="flex flex-col">
              <span className="ml-4 text-xl font-bold bg-linear-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                Taekwondo Club
              </span>
              {/* <span className="ml-4 text-xl font-bold text-gray-500">
                Taekwondo Club
              </span> */}
              {/* <span className="text-xs text-gray-500 font-medium">Taekwondo Club</span> */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavLink href="#schedule" text="Lịch học" />
            <NavLink href="#achievement" text="Thành tích" />
            <NavLink href="#event" text="Sự kiện" />
            <NavLink href="#contact" text="Liên hệ" />
            <LoginButton role={role}/>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 border-t border-gray-100 pt-4 animate-in slide-in-from-top">
            <MobileNavLink href="#schedule" text="Lịch học" onClick={() => setIsOpen(false)} />
            <MobileNavLink href="#achievement" text="Thành tích" onClick={() => setIsOpen(false)} />
            <MobileNavLink href="#event" text="Sự kiện" onClick={() => setIsOpen(false)} />
            <MobileNavLink href="#activity" text="Hoạt động CLB" onClick={() => setIsOpen(false)} />
            <div className="pt-2">
              <MobileLoginButton onClick={() => setIsOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, text }) {
  return (
    <a
      href={href}
      className="relative px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50 group"
    >
      {text}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-red-500 to-blue-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
    </a>
  );
}

function LoginButton({role}) {
  return (
    <a
      href="/login"
      className="ml-4 px-6 py-2.5 bg-linear-to-r from-red-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 shadow-lg"
    >
      {!role ? "Đăng nhập" : "Vào câu lạc bộ"}
    </a>
  );
}

function MobileNavLink({ href, text, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
    >
      {text}
    </a>
  );
}

function MobileLoginButton({ onClick }) {
  return (
    <a
      href="#"
      onClick={onClick}
      className="block w-full px-4 py-3 text-center bg-linear-to-r from-red-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg"
    >
      Đăng nhập
    </a>
  );
}

function ThemeButton({ name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative px-8 py-4 bg-linear-to-r from-red-600 to-blue-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
    >
      <span className="relative z-10 text-lg uppercase tracking-wide">{name}</span>
      <div className="absolute inset-0 bg-linear-to-r from-red-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}

function ThemeOutlinedButton({ name, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="relative px-8 py-4 bg-white rounded-full hover:scale-105 transition-all duration-300 group"
    >
      {/* Gradient border */}
      <span className="absolute inset-0 rounded-full p-0.5 bg-linear-to-r from-red-600 to-blue-600">
        <span className="flex items-center justify-center w-full h-full bg-white rounded-full"></span>
      </span>
      
      {/* Button text */}
      <span className="relative z-10 text-lg font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wide">
        {name}
      </span>
      
      {/* Hover effect */}
      <span className="absolute inset-0 rounded-full bg-linear-to-r from-red-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
    </button>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="text-3xl max-sm:text-2xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-1">
        {number}
      </div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ScheduleSection({sectionRef}) {
  const itemsPerPage = 3;

  const {isError, isPending, isSuccess , data, refetch } = useQuery({
    queryKey: ['facility_homepage'],
    queryFn: () => facilityService.getDataHomepage(),
    staleTime: 300000,
  });

  return (
    <>
      <div ref={sectionRef} className="py-20 relative">
        <div className="absolute inset-0 bg-white/50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 relative">
            <OrcaBackground/>
            <div className='relative z-10'>
              <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-4 z-10">
                Lịch học
              </h2>
              <div className="h-1.5 w-32 bg-linear-to-r from-red-500 to-blue-500 rounded-full mx-auto z-10"></div>
              <p className="mt-6 text-gray-600 text-lg">Chọn chi nhánh phù hợp với bạn</p>
            </div>
          </div>

          {isPending && 
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <StudyShiftCardSkeleton key={i} />
              ))}
            </div>
          }
          {isError && <LoadingErrorUI refetchData={refetch} errorMessage="Không thể tải thông tin lịch học"/>}
          {isSuccess && (
            <ErrorBoundary fallback={<Banner message={"Không có giải thưởng nào để hiển thị..."} image={"cute_orca.svg"}/>}>
              <ScheduleContent itemsPerPage={itemsPerPage} data={data?.data} />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </>
  );
}

function ScheduleContent({itemsPerPage, data}) {
  const [currentPage, setCurrentPage] = useState(0);

  const allBranches = Array.isArray(data) ? data : [];

  const totalPages = Math.ceil(allBranches.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentBranches = allBranches.slice(startIndex, startIndex + itemsPerPage);

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="schedule" className="bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative">
          {totalPages > 1 && currentPage > 0 && (
            <button
              onClick={goToPrev}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBranches.map((branch, index) => (
              <StudyShiftCard key={startIndex + index} cardInfo={branch} />
            ))}
          </div>

          {totalPages > 1 && currentPage < totalPages - 1 && (
            <button
              onClick={goToNext}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="lg:hidden flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span className="font-semibold text-gray-700">Trước</span>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPage 
                      ? 'bg-linear-to-r from-red-600 to-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200"
            >
              <span className="font-semibold text-gray-700">Tiếp</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="hidden lg:flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-linear-to-r from-red-600 to-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudyShiftCard({ cardInfo }) {
  const [currentShiftPage, setCurrentShiftPage] = useState(0);
  const shiftsPerPage = 2;
  const mapNumberToDay = (number) => {
    const days = {
      '2': 'Thứ Hai',
      '3': 'Thứ Ba',
      '4': 'Thứ Tư',
      '5': 'Thứ Năm',
      '6': 'Thứ Sáu',
      '7': 'Thứ Bảy',
      '8': 'Chủ Nhật'
    };
    return days[number] || number;
  };
  const totalPages = Math.ceil(cardInfo['schedule'].length / shiftsPerPage);
  const startIndex = currentShiftPage * shiftsPerPage;
  const currentShifts = cardInfo['schedule'].slice(startIndex, startIndex + shiftsPerPage);

  return (
    <div className="group p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col">
      <div className="mb-6 rounded-xl overflow-hidden">
        <img 
          src={cardInfo['img']} 
          alt="Chi nhánh" 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex items-start mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 shrink-0 mt-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <p className="ml-3 text-gray-700 leading-relaxed text-sm font-medium">{cardInfo.address}</p>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-4"></div>

      <div className="space-y-3 mb-6 grow">
        {currentShifts.map((element, index) => {
          
          return <div key={index} className="flex items-start p-3 rounded-lg bg-linear-to-r from-blue-50 to-red-50 hover:from-blue-100 hover:to-red-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <div className="ml-3">
              <p className="text-gray-800 text-sm font-semibold">
                {element.day.split('-').map(mapNumberToDay).join(', ')}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {element.shift.join(' hoặc ')}
              </p>
            </div>
          </div>
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentShiftPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentShiftPage 
                  ? 'bg-linear-to-r from-red-600 to-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      <button className="mt-6 w-full py-3 bg-linear-to-r from-red-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">
        Đăng ký ngay
      </button>
    </div>
  );
}

function StudyShiftCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 flex flex-col">
      {/* Image Skeleton */}
      <div className="mb-6 rounded-xl overflow-hidden bg-gray-200 animate-pulse">
        <div className="w-full h-48"></div>
      </div>

      {/* Address Skeleton */}
      <div className="flex items-start mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse shrink-0 mt-1"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-4"></div>

      {/* Schedule Skeletons */}
      <div className="space-y-3 mb-6 grow">
        {[1, 2].map((item) => (
          <div key={item} className="flex items-start p-3 rounded-lg bg-gray-50">
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse shrink-0 mt-0.5"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center gap-2 mt-12">
        <div className="w-8 h-3 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-6 w-full py-3 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
  );
}

function AchievementSection({sectionRef}) {
  const {isPending, isError, isSuccess, data, refetch} = useQuery({
    queryKey: ['award_homepage'],
    queryFn: () => awardService.getDataHomepage(),
    staleTime: 300000
  })
  console.log(data);
  return (
    <>
      <div ref={sectionRef} id="achievement" className="relative py-20">
          <div className="absolute inset-0 bg-linear-to-b from-white/50 to-gray-50/50 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 text-center mb-16">
              <SymmetricOrcaBackground/>
              <div className='relative z-10'>
                <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Thành tích
                </h2>
                {/* <OrcaAnimation sectionRef={sectionRef} ></OrcaAnimation> */}
                <div className="h-1.5 w-32 bg-linear-to-r from-red-500 to-blue-500 rounded-full mx-auto"></div>
                <p className="mt-6 text-gray-600 text-lg">Niềm tự hào các học viên mang lại cho nhà Hổ Kình</p>
              </div>
            </div>

          {isPending && <AwardCarouselSkeleton/>}
          {isError && <LoadingErrorUI refetchData={refetch} errorMessage="Không thể tải thông tin thành tích"/>}
          {isSuccess && (
            <ErrorBoundary fallback={<Banner message={"Không có giải thưởng nào để hiển thị..."} image={"cute_orca.svg"}/>}>
              <AchievementContent data={data?.data} />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </>
  );
}

function AchievementContent({data}) {
  const [currentAward, setCurrentAward] = useState(0);
  
  const awards = Array.isArray(data) ? data : [];
  console.log(data);

  const goToNext = () => {
    setCurrentAward((prev) => (prev + 1) % awards.length);
  };

  const goToPrev = () => {
    setCurrentAward((prev) => (prev - 1 + awards.length) % awards.length);
  };

  const getPrevIndex = () => (currentAward - 1 + awards.length) % awards.length;
  const getNextIndex = () => (currentAward + 1) % awards.length;

  return (
    <div id="achievement" className="bg-linear-to-b from-white/50 to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group -translate-x-6 lg:-translate-x-16"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Carousel */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 py-8">
            {/* Previous Award - Small */}
            <div className="hidden md:block shrink-0 w-32 lg:w-48 opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer" onClick={goToPrev}>
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-red-400 to-blue-400 rounded-full blur-xl opacity-20"></div>
                <img 
                  src={awards[getPrevIndex()].image}
                  alt={awards[getPrevIndex()].rank}
                  className="relative rounded-full w-32 h-32 lg:w-48 lg:h-48 object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div>

            {/* Current Award - Large */}
            <div className="shrink-0 w-64 sm:w-80 lg:w-96">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-red-400 to-blue-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl">
                  <span className="absolute inset-0 rounded-3xl p-[3px] bg-linear-to-r from-red-600 via-purple-500 to-blue-600">
                    <span className="flex items-center justify-center w-full h-full bg-white rounded-3xl">
                    </span>
                  </span>
                  <img 
                    src={awards[currentAward].image}
                    alt={awards[currentAward].rank}
                    className="relative rounded-2xl w-full h-64 sm:h-80 object-cover mb-6"
                  />
                  <div className="relative text-center space-y-3">
                    <div className="inline-block px-4 py-1 bg-linear-to-r from-red-600 to-blue-600 rounded-full">
                      <span className="text-white font-bold text-sm">{awards[currentAward].year}</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                      {awards[currentAward].rank}
                    </h3>
                    <p className="text-gray-800 font-semibold text-lg">
                      {awards[currentAward].name}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {awards[currentAward].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Award - Small */}
            <div className="hidden md:block shrink-0 w-32 lg:w-48 opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer" onClick={goToNext}>
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-red-400 to-blue-400 rounded-full blur-xl opacity-20"></div>
                <img 
                  src={awards[getNextIndex()].image}
                  alt={awards[getNextIndex()].rank}
                  className="relative rounded-full w-32 h-32 lg:w-48 lg:h-48 object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group translate-x-6 lg:translate-x-16"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {awards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAward(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentAward 
                  ? 'bg-linear-to-r from-red-600 to-blue-600 w-8 h-3' 
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
              }`}
            />
          ))}
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="font-semibold text-gray-700">Trước</span>
          </button>

          <button
            onClick={goToNext}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <span className="font-semibold text-gray-700">Tiếp</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function AwardCarouselSkeleton() {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Previous Button Skeleton */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gray-200 rounded-full animate-pulse -translate-x-6 lg:-translate-x-16"></div>

      {/* Carousel */}
      <div className="flex items-center justify-center gap-4 lg:gap-8 py-8">
        {/* Previous Award - Small Skeleton */}
        <div className="hidden md:block shrink-0 w-32 lg:w-48 opacity-40">
          <div className="relative">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Current Award - Large Skeleton */}
        <div className="shrink-0 w-64 sm:w-80 lg:w-96">
          <div className="relative">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-gray-100">
              {/* Image Skeleton */}
              <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-2xl animate-pulse mb-6"></div>
              
              {/* Content Skeleton */}
              <div className="text-center space-y-3">
                {/* Year Badge Skeleton */}
                <div className="inline-block w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                
                {/* Rank Skeleton */}
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                
                {/* Name Skeleton */}
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full mx-auto"></div>
                
                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Award - Small Skeleton */}
        <div className="hidden md:block shrink-0 w-32 lg:w-48 opacity-40">
          <div className="relative">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Next Button Skeleton */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gray-200 rounded-full animate-pulse translate-x-6 lg:translate-x-16"></div>

      {/* Dots Indicator Skeleton */}
      <div className="flex justify-center gap-2 mt-12">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`rounded-full bg-gray-200 animate-pulse ${
              index === 0 ? 'w-8 h-3' : 'w-3 h-3'
            }`}
          />
        ))}
      </div>

      {/* Mobile Navigation Buttons Skeleton */}
      <div className="md:hidden flex items-center justify-center gap-4 mt-8">
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl animate-pulse w-28 h-12"></div>
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl animate-pulse w-28 h-12"></div>
      </div>
    </div>
  );
}

function EventSection({sectionRef}) {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isPending, isError, isSuccess, refetch } = useQuery({
    queryKey: ['articles'+ currentPage],
    queryFn: () => articleService.getDataHomepage(currentPage, itemsPerPage),
    staleTime: 300000,
    refetchOnMount: true,
  })
  console.log(data?.data);

  return (
  <>
    <div ref={sectionRef} id="event" className="relative py-20">
      <div className="absolute inset-0 bg-white/50 -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SwimmingOrcaBackground/>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Sự kiện
          </h2>
          <div className="h-1.5 w-32 bg-linear-to-r from-red-500 to-blue-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Các sự kiện nổi bật của CLB</p>
        </div>
        
        {isPending && 
          (<div id="event" className="py-20 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <StudyShiftCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>)
        }
        {isError && <LoadingErrorUI refetchData={refetch} errorMessage="Không thể tải thông tin sự kiện"/>}
        
        {isSuccess && (
            <ErrorBoundary fallback={<Banner message={"Không có giải thưởng nào để hiển thị..."} image={"cute_orca.svg"}/>}>
              <EventContent data={data?.data} itemsPerPage= {itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}></EventContent>
            </ErrorBoundary>
          )}
      </div>
    </div>
  </>
  );
}

function EventContent({itemsPerPage, data, currentPage, setCurrentPage}) {

  // Data Pagination
  const currentEvents = Array.isArray(data.content) ? data.content : [];
  const totalPages = data.page.totalPages || 0;
  const startIndex = currentPage * itemsPerPage;

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="event" className="bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative">
          {totalPages > 1 && currentPage > 0 && (
            <button
              onClick={goToPrev}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentEvents.map((event, index) => {
              event.content = generateHTMLFromJSON(event.content);
              return <ArticleCard key={startIndex + index} article={event} />
            })}
          </div>

          {totalPages > 1 && currentPage < totalPages - 1 && (
            <button
              onClick={goToNext}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gray-100 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="lg:hidden flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span className="font-semibold text-gray-700">Trước</span>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPage 
                      ? 'bg-linear-to-r from-red-600 to-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200"
            >
              <span className="font-semibold text-gray-700">Tiếp</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="hidden lg:flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-linear-to-r from-red-600 to-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleClick = () => {
    // Navigate to detail page and pass the article data
    navigate(`/article/${article.id}`, { state: { article } });
  };

  return (
    <div onClick={handleClick} className="group h-full rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={article.coverImage} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-xs font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              {article.category.categoryName}
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 grow flex flex-col space-y-4">
        {/* Date Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-linear-to-r from-red-600 to-blue-600 rounded-full">
            <span className="text-white font-bold text-xs">
              {new Date(article.date).getFullYear()}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {formatDate(article.date)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>

        {/* Content */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 grow" dangerouslySetInnerHTML={{ __html: article.content }}>
        </p>

        {/* Read More Button */}
        <button onClick={handleClick} className="mt-auto w-full py-3 px-4 bg-linear-to-r from-red-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group/btn">
          <span>Xem thêm</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="group h-full rounded-2xl bg-white shadow-lg transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden">
      {/* Image Container Skeleton */}
      <div className="relative overflow-hidden h-48">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        
        {/* Category Badge Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      {/* Content Container Skeleton */}
      <div className="p-6 grow flex flex-col space-y-4">
        {/* Date Badge Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-2 grow">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}



function Footer() {
  const branches = [
    {
      name: 'Chi nhánh Quận 3',
      address: 'Số 185 Cách Mạng Tháng Tám, Quận 3',
      hotline: '0123 456 789',
      mapUrl: 'https://maps.app.goo.gl/zubfmtXbNRuMTbQb7'
    },
    {
      name: 'Chi nhánh Quận 10',
      address: 'Số 123 Đường ABC, Quận 10',
      hotline: '0123 456 790',
      mapUrl: 'https://maps.app.goo.gl/ep5uspiUNxYVT7oX7'
    },
    {
      name: 'Chi nhánh Quận 1',
      address: 'Số 456 Lê Thánh Tôn, Quận 1',
      hotline: '0123 456 791',
      mapUrl: 'https://maps.google.com'
    },
    {
      name: 'Chi nhánh Quận 1',
      address: 'Số 456 Lê Thánh Tôn, Quận 1',
      hotline: '0123 456 791',
      mapUrl: 'https://maps.google.com'
    },
    {
      name: 'Chi nhánh Quận 1',
      address: 'Số 456 Lê Thánh Tôn, Quận 1',
      hotline: '0123 456 791',
      mapUrl: 'https://maps.google.com'
    },
    {
      name: 'Chi nhánh Quận 1',
      address: 'Số 456 Lê Thánh Tôn, Quận 1',
      hotline: '0123 456 791',
      mapUrl: 'https://maps.google.com'
    }
  ];

  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 scale-130 flex items-center justify-center">
                <img src= {logo} alt="" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-linear-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                  Hổ Kình
                </h3>
                <p className="text-xs text-gray-400">Taekwondo Club</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nơi đào tạo Taekwondo uy tín, chất lượng hàng đầu tại TP.HCM với đội ngũ huấn luyện viên chuyên nghiệp
            </p>
            
            {/* CTA Button */}
            <button className="w-full py-3 px-6 bg-linear-to-r from-red-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200">
              Đăng ký ngay
            </button>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li>
                <a href="#schedule" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Lịch học
                </a>
              </li>
              <li>
                <a href="#achievement" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Thành tích
                </a>
              </li>
              <li>
                <a href="#event" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  Sự kiện
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div id='contact' className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400 mr-3 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:hokinhtaekwondo@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  hokinhtaekwondo@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400 mr-3 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-gray-400">0909 123 456</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-white mb-3">Theo dõi chúng tôi</h5>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/profile.php?id=100027200575144" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@ho.kinh.taekwondo?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@TaekwondoHoKinh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Branches */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-4">Chi nhánh</h4>
            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-300">
                  <h5 className="font-semibold text-white mb-2">{branch.name}</h5>
                  <p className="text-gray-400 text-sm mb-2 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-red-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {branch.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <a href={`tel:${branch.hotline.replace(/\s/g, '')}`} className="text-blue-400 text-sm hover:text-blue-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {branch.hotline}
                    </a>
                    <a 
                      href={branch.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                      Bản đồ
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Câu Lạc Bộ Taekwondo Hổ Kình. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ArticlePage() {
  return (
    <>
      <div className='max-w-7xl'>
        <a href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="font-medium">Quay lại trang chủ</span>
        </a>
      </div>
    </>
  );
}

// const allBranches = [
  //   {
  //     address: 'Trung tâm cung ứng dịch vụ Văn Hóa - Thể Thao Phường Xuân Hoà - Số 185 Cách Mạng Tháng Tám, Quận 3',
  //     schedule: [
  //       {
  //         day: '2-4-6',
  //         shift: ['17:15-18:45', '19:00-20:30']
  //       },
  //       {
  //         day: '3-5-7',
  //         shift: ['17:15-18:45']
  //       },
  //       {
  //         day: '7-CN',
  //         shift: ['17:15-18:45', '19:00-20:30']
  //       }
  //     ],
  //     mapsLink: '',
  //     img: '/branch2.webp'
  //   },
  //   {
  //     address: 'Nhà văn hóa Phường 15, Quận 10 - Số 123 Đường ABC, Quận 10',
  //     schedule: [
  //       {
  //         day: '2-4-6',
  //         shift: ['18:00-19:30']
  //       }
  //     ],
  //     mapsLink: '',
  //     img: '/branch.webp'
  //   },
  //   {
  //     address: 'Trung tâm thể thao Phường Tân Định, Quận 1 - Số 456 Lê Thánh Tôn, Quận 1',
  //     schedule: [
  //       {
  //         day: '3-5-7',
  //         shift: ['17:00-18:30', '19:00-20:30']
  //       }
  //     ],
  //     mapsLink: '',
  //     img: '/branch2.webp'
  //   },
  //   {
  //     address: 'Nhà văn hóa Phường 12, Quận Tân Bình - Số 789 Trường Chinh, Quận Tân Bình',
  //     schedule: [
  //       {
  //         day: '2-4-6',
  //         shift: ['18:30-20:00']
  //       },
  //       {
  //         day: '8',
  //         shift: ['08:00-09:30', '09:45-11:15']
  //       }
  //     ],
  //     mapsLink: '',
  //     img: '/branch.webp'
  //   },
  //   {
  //     address: 'Trung tâm TDTT Phường 7, Quận 5 - Số 321 Nguyễn Trãi, Quận 5',
  //     schedule: [
  //       {
  //         day: '3-5',
  //         shift: ['17:30-19:00']
  //       },
  //       {
  //         day: '7',
  //         shift: ['17:30-19:00', '19:15-20:45']
  //       }
  //     ],
  //     mapsLink: '',
  //     img: '/branch2.webp'
  //   },
  //   {
  //     address: 'Trung tâm TDTT Phường 7, Quận 5 - Số 321 Nguyễn Trãi, Quận 5',
  //     schedule: [
  //       {
  //         day: '3-5',
  //         shift: ['17:30-19:00']
  //       },
  //       {
  //         day: '7',
  //         shift: ['17:30-19:00', '19:15-20:45']
  //       }
  //     ],
  //     mapsLink: '',
  //     img: '/branch2.webp'
  //   }
  // ];