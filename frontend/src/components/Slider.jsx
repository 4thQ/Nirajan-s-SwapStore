import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Slide from "./Slide";
import { Navigation, Autoplay } from "swiper/modules";

import menswearImage from "../assets/slide-1.jpg";
import womenImage from "../assets/slide-2.jpg";
import brandImage from "../assets/slide-3.jpg";
import saleImage from "../assets/slide-4.jpg";

const slideData = [
  {
    title: "Menswear",
    link: "/items",
    image: menswearImage,
  },
  {
    title: "Women",
    link: "/items",
    image: womenImage,
  },
  {
    title: "Accessories",
    link: "/items",
    image: brandImage,
  },
  // {
  //   title: "Sale",
  //   link: "/items",
  //   image: saleImage,
  // },
];

const CustomSlider = () => {
  return (
    <div>
      <Swiper
        modules={[Navigation, Autoplay]}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
        loop
      >
        {slideData.map((slide, index) => (
          <SwiperSlide key={index}>
            <Slide title={slide.title} link={slide.link} image={slide.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomSlider;
