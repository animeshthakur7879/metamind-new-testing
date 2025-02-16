import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    image: './public/meta mind no bg.png',
    title: "About Meta Mind",
    description: "At Meta Mind, we are dedicated to bridging the gap between academic knowledge and real-world industry demands. Our platform empowers students by offering immersive virtual experiences, enabling them to gain hands-on experience long before they graduate. We combine innovative technology, personalized assessments, and real-world projects to build a comprehensive learning ecosystem that transforms theory into practical skills",
  },
  {
    image: 'https://ideogram.ai/assets/image/lossless/response/hFfZNd9qT8OLgPn04bIXcQ',
    title: "Our Mission",
    description: "Our mission is to revolutionize education by seamlessly integrating academic learning with practical, industry-ready skills. We strive to equip every student with the tools, experience, and confidence needed to excel in today’s competitive job market. By providing personalized learning paths, real-world project exposure, and direct mentorship from industry experts, we aim to create a future where every graduate emerges fully prepared for professional success while also reducing the training burden on companies.",
  },
  {
    image: 'https://ideogram.ai/assets/image/lossless/response/YgrjKrdrRMqqbFk4dsWT_w',
    title: "Our Vision",
    description: "We envision a future where the transition from education to employment is effortless and efficient. Meta Mind aspires to create a dynamic, collaborative ecosystem that nurtures innovation and continuous learning. Our goal is to transform the traditional educational model by making it more aligned with industry needs, ensuring that students not only learn but also apply their knowledge in real-world scenarios. In doing so, we pave the way for a new era of skilled professionals who drive progress and excellence in the global workforce.",
  },
];

const AboutCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="w-full py-20 text-white bg-gradient-to-b from-black via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="flex justify-center">
              <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Image Section */}
                <div className="md:w-1/2">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full rounded-xl shadow-xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {/* Text Section */}
                <div className="md:w-1/2">
                  <h2 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default AboutCarousel;
