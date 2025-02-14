// TestimonialsCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    image: "https://tse3.mm.bing.net/th?id=OIP.DxpcKmgZZtv0kMLJpaTJLgHaHa&pid=Api&P=0&h=180",
    name: "Priya Sharma",
    role: "Software Engineer",
    text: "SkillConnect Virtual World transformed my career. I gained hands-on experience and built a solid portfolio even before graduation!",
  },
  {
    image: "https://tse2.mm.bing.net/th?id=OIP.28jmE4s4hgzuaJnqvGffRQHaHa&pid=Api&P=0&h=180",
    name: "Ankit Verma",
    role: "Web Developer",
    text: "The real-world projects and mentorship provided a competitive edge in the job market. It opened many new opportunities for me.",
  },
  {
    image: "https://tse3.mm.bing.net/th?id=OIP.DxpcKmgZZtv0kMLJpaTJLgHaHa&pid=Api&P=0&h=180",
    name: "Ravi Kumar",
    role: "Data Scientist",
    text: "I was able to prove my skills through practical projects. This platform gave me the confidence and experience to excel in my career.",
  },
  {
    image: "https://tse3.mm.bing.net/th?id=OIP.DxpcKmgZZtv0kMLJpaTJLgHaHa&pid=Api&P=0&h=180",
    name: "Sneha Kapoor",
    role: "UI/UX Designer",
    text: "A perfect blend of theory and practice. I enhanced my technical and soft skills, which has significantly boosted my employability.",
  },
];

const TestimonialsCarousel = () => {
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
    <section id='TestimonialsCarousel' className=" py-16 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
          Our Success Stories
        </h2>
        <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
          Hear from our students who transformed their careers with SkillConnect Virtual World.
        </p>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex justify-center">
              <div className="w-full max-w-5xl bg-gray-800 bg-opacity-70 p-8 rounded-xl shadow-xl transition-transform duration-300 hover:scale-105 flex flex-col md:flex-row items-center">
                {/* Image Section */}
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg" 
                  />
                </div>
                {/* Text Section */}
                <div className="w-full text-left">
                  <h3 className="text-2xl font-semibold text-blue-400">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{testimonial.role}</p>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {testimonial.text}
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

export default TestimonialsCarousel;
