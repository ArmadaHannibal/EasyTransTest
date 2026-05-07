// some-inner-component.jsx
import React from "react";
import { useSwiper } from "swiper/react";
import { GrPrevious } from "react-icons/gr";

export default function SlidePrevButton() {
  const swiper = useSwiper();

  return (
    <button
      className="absolute top-2/4 left-0 z-10 cursor-pointer bg-white p-2 rounded-full shadow-lg transform -translate-y-2/4"
      onClick={() => swiper.slidePrev()}
    >
      <GrPrevious />
    </button>
  );
}
