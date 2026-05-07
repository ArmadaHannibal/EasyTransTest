// some-inner-component.jsx
import React from "react";
import { useSwiper } from "swiper/react";
import { GrNext } from "react-icons/gr";

export default function SlideNextButton() {
  const swiper = useSwiper();

  return (
    <button
      className="absolute top-2/4 right-0 z-10 cursor-pointer p-2.5 bg-white rounded-full shadow-lg transform -translate-y-2/4"
      onClick={() => swiper.slideNext()}
    >
      <GrNext />
    </button>
  );
}
