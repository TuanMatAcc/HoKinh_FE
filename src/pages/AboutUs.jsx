import main_img from "@/assets/images/homepage/original_main.png";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Medal,
  ArrowLeft,
} from "lucide-react";

const AboutUsPage = () => {
  const [activeCoach, setActiveCoach] = useState(0);

  const clubHead = {
    name: "Thầy Đặng Lê Trí Dũng",
    image: "/giao_chu_HoKinh.jpg",
    belt: "Đai Đen 6 Đẳng",
    experience: "20 năm",
    achievements: [
      "HCV Giải Vô Địch Quốc Gia 2015",
      "HCB Giải Đông Nam Á 2017",
      "Huấn Luyện Viên Xuất Sắc TP.HCM 2020",
    ],
    quote:
      "Người Huấn Luyện Viên cố gắng dạy nhưng không truyền cảm hứng đến học trò của mình thì chẳng khác nào lấy búa nện vào tấm sắt lạnh.",
  };

  const coaches = [
    {
      name: "Huấn Luyện Viên Trần Minh Tuấn",
      image:
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop",
      belt: "Đai Đen 4 Đẳng",
      experience: "15 năm",
      achievements: ["HCV Giải TP.HCM 2018", "HCĐ Giải Quốc Gia 2019"],
    },
    {
      name: "Huấn Luyện Viên Lê Thị Mai",
      image:
        "https://images.unsplash.com/photo-1534339480783-6816b68be29c?w=400&h=500&fit=crop",
      belt: "Đai Đen 3 Đẳng",
      experience: "12 năm",
      achievements: ["HCB Giải Nữ Quốc Gia 2020"],
    },
    {
      name: "Huấn Luyện Viên Phạm Đức Anh",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
      belt: "Đai Đen 3 Đẳng",
      experience: "10 năm",
      achievements: [],
    },
    {
      name: "Huấn Luyện Viên Hoàng Thu Hà",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
      belt: "Đai Đen 2 Đẳng",
      experience: "8 năm",
      achievements: ["HCĐ Giải Trẻ TP.HCM 2021"],
    },
  ];

  const nextCoach = () => {
    setActiveCoach((prev) => (prev + 1) % coaches.length);
  };

  const prevCoach = () => {
    setActiveCoach((prev) => (prev - 1 + coaches.length) % coaches.length);
  };

  return (
    <div className="min-h-screen space-y-20 bg-linear-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-linear-to-r from-red-500 to-blue-500 py-12 md:py-16 px-4 shadow-lg relative">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-3 md:px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/40 hover:border-white/60 text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Quay Lại</span>
        </button>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-white drop-shadow-lg px-4">
            Câu Lạc Bộ Taekwondo Hổ Kình
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white opacity-95 px-4">
            Nơi Rèn Luyện Tinh Thần - Phát Triển Thể Chất
          </p>
        </div>
      </div>

      {/* Club Story */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border-2 border-gray-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Câu Chuyện Của Chúng Tôi
          </h2>
          <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed">
            <p>
              Được thành lập vào năm 2005, Câu Lạc Bộ Taekwondo Hổ Kình đã trở
              thành một trong những địa chỉ uy tín hàng đầu trong việc đào tạo
              và phát triển Taekwondo tại Thành phố Hồ Chí Minh. Với hơn 18 năm
              kinh nghiệm, chúng tôi đã đào tạo hàng ngàn học viên từ trẻ em đến
              người lớn.
            </p>
            <p>
              Tên "Hổ Kình" được chọn với ý nghĩa "Tinh thần mạnh mẽ như hổ, ý
              chí kiên định như vàng", thể hiện triết lý đào tạo của chúng tôi:
              không chỉ rèn luyện kỹ thuật võ thuật mà còn hun đúc nhân cách và
              phẩm chất cao đẹp cho mỗi học viên.
            </p>
          </div>
        </div>
      </div>

      {/* Club Head - Special Golden Frame */}
      <div className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center bg-linear-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
          Trưởng Câu Lạc Bộ
        </h2>

        <div className="relative">
          {/* Decorative corners - hidden on mobile */}
          <div className="hidden md:block absolute -top-4 -left-4 w-16 md:w-24 h-16 md:h-24 border-t-4 border-l-4 border-yellow-400 opacity-80"></div>
          <div className="hidden md:block absolute -top-4 -right-4 w-16 md:w-24 h-16 md:h-24 border-t-4 border-r-4 border-yellow-400 opacity-80"></div>
          <div className="hidden md:block absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 border-b-4 border-l-4 border-yellow-400 opacity-80"></div>
          <div className="hidden md:block absolute -bottom-4 -right-4 w-16 md:w-24 h-16 md:h-24 border-b-4 border-r-4 border-yellow-400 opacity-80"></div>

          <div className="bg-linear-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border-2 md:border-4 border-yellow-400 backdrop-blur">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="relative w-full max-w-xs md:w-64">
                <div className="absolute inset-0 bg-linear-to-br from-yellow-300 to-amber-400 rounded-2xl blur-2xl opacity-40"></div>
                <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden border-2 md:border-4 border-yellow-400 shadow-2xl">
                  <img
                    src={clubHead.image}
                    alt={clubHead.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4 md:space-y-6 w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-amber-600 text-center md:text-left">
                  {clubHead.name}
                </h3>

                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Medal className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-lg md:text-xl font-semibold text-gray-800">
                      {clubHead.belt}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-lg md:text-xl text-gray-700">
                      Kinh nghiệm: {clubHead.experience}
                    </span>
                  </div>
                </div>

                {clubHead.achievements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                      <span className="text-lg md:text-xl font-semibold text-amber-600">
                        Thành Tích
                      </span>
                    </div>
                    <ul className="space-y-2 md:ml-8">
                      {clubHead.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 flex items-start gap-2 text-sm md:text-base"
                        >
                          <span className="text-yellow-500 mt-1">▸</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-linear-to-r from-yellow-100 to-amber-100 rounded-xl p-4 md:p-6 border-l-4 border-yellow-500 italic shadow-md">
                  <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                    "{clubHead.quote}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coaches Carousel */}
      <div className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          Đội Ngũ Huấn Luyện Viên
        </h2>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevCoach}
            className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-linear-to-r from-red-500 to-red-600 p-2 md:p-4 rounded-full shadow-xl hover:scale-110 transition-transform text-white"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextCoach}
            className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-linear-to-r from-blue-500 to-blue-600 p-2 md:p-4 rounded-full shadow-xl hover:scale-110 transition-transform text-white"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Coaches Display */}
          <div className="flex items-center justify-center gap-2 md:gap-4 px-12 md:px-16">
            {/* Previous Coach (smaller) - hidden on mobile */}
            <div
              className="hidden lg:block opacity-50 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={prevCoach}
            >
              <div className="w-40 xl:w-48 h-56 xl:h-64 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
                <img
                  src={
                    coaches[(activeCoach - 1 + coaches.length) % coaches.length]
                      .image
                  }
                  alt="Previous coach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Active Coach (larger, special frame) */}
            <div className="relative shrink-0">
              <div className="absolute -inset-2 bg-linear-to-r from-red-400 to-blue-400 rounded-2xl blur-xl opacity-60"></div>

              <div className="relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl border-linear-to-r from-red-400 to-blue-400">
                <div className="w-0.7 sm:w-0.7 md:w-0.7 h-72 sm:h-80 md:h-96 rounded-lg md:rounded-xl overflow-hidden border-linear-to-r from-red-400 to-blue-400 mb-3 md:mb-4 shadow-xl">
                  <img
                    src={coaches[activeCoach].image}
                    alt={coaches[activeCoach].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 md:space-y-3 text-center">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                    {coaches[activeCoach].name}
                  </h3>

                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Medal className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    <span className="text-base md:text-lg font-semibold">
                      {coaches[activeCoach].belt}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    <span className="text-sm md:text-base">
                      Kinh nghiệm: {coaches[activeCoach].experience}
                    </span>
                  </div>

                  {coaches[activeCoach].achievements.length > 0 && (
                    <div className="pt-2 md:pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                        <span className="font-semibold text-yellow-600 text-sm md:text-base">
                          Thành Tích
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs md:text-sm text-gray-600">
                        {coaches[activeCoach].achievements.map(
                          (achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Next Coach (smaller) - hidden on mobile */}
            <div
              className="hidden lg:block opacity-50 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={nextCoach}
            >
              <div className="w-40 xl:w-48 h-56 xl:h-64 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
                <img
                  src={coaches[(activeCoach + 1) % coaches.length].image}
                  alt="Next coach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {coaches.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCoach(idx)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  idx === activeCoach
                    ? "bg-linear-to-r from-red-500 to-blue-500 w-6 md:w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Giá Trị Hổ Kình */}
      <div className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          GIÁ TRỊ HỔ KÌNH TAEKWONDO
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Tận Tâm - Red linear */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden mb-4 md:mb-6 shadow-xl">
              <img
                src={main_img}
                alt="Tận Tâm"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-linear-to-br from-red-500 to-red-700 bg-clip-text text-transparent">
              Tận Tâm
            </h3>
            <div className="text-center px-4">
              <p className="text-gray-700 leading-relaxed italic text-base md:text-lg">
                "Người Huấn Luyện Viên cố gắng dạy nhưng không truyền cảm hứng
                đến học trò của mình thì chẳng khác nào lấy búa nện vào tấm sắt
                lạnh."
              </p>
            </div>
          </div>

          {/* Rèn Luyện Sức Khỏe - Red to Blue linear */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden mb-4 md:mb-6 shadow-xl">
              <img
                src="/ren_luyen.webp"
                alt="Rèn Luyện Sức Khỏe"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-linear-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Rèn Luyện Sức Khỏe
            </h3>
            <div className="text-center px-4">
              <p className="text-gray-700 leading-relaxed italic text-base md:text-lg">
                "Sức khỏe không phải thứ chúng ta có thể mua. Tuy nhiên, nó có
                thể là một tài khoản tiết kiệm cực kỳ giá trị."
              </p>
            </div>
          </div>

          {/* Kết nối - Đồng đội - Blue linear */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden mb-4 md:mb-6 shadow-xl">
              <img
                src="/branch2.webp"
                alt="Kết nối - Đồng đội"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-linear-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Kết nối - Đồng đội
            </h3>
            <div className="text-center px-4">
              <p className="text-gray-700 leading-relaxed italic text-base md:text-lg">
                "Một bông hoa tươi không thể tạo nên mùa xuân đẹp. Sức mạnh của
                đoàn kết là thứ mà kẻ địch không thể biết trước khi đối mặt."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <div className="bg-linear-to-r from-red-500 to-blue-500 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Hãy Cùng Chúng Tôi Bắt Đầu Hành Trình
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-95 leading-relaxed max-w-3xl mx-auto">
            Tại Câu Lạc Bộ Taekwondo Hổ Kình, chúng tôi tin rằng mỗi người đều
            có tiềm năng để trở nên mạnh mẽ hơn, tự tin hơn và kiên cường hơn.
            Dù bạn là người mới bắt đầu hay đã có kinh nghiệm, chúng tôi luôn
            sẵn sàng đồng hành cùng bạn trên con đường phát triển bản thân.
          </p>
          <div className="text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg">
            🥋 Hổ Kình - Tinh Thần Mạnh Mẽ, Ý Chí Kiên Định 🥋
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
