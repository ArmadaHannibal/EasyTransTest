// CongoMapWrapper.tsx
import dynamic from "next/dynamic";
import { Point } from "@/types/types";

interface MapProps {
  points: Point[];
}

const CongoBubbleMap = dynamic<MapProps>(() => import("./MapInner"), { ssr: false });

const points: Point[] = [
  { name: "Brazzaville", lat: -4.2634, lon: 15.2429, value: 15 },
  { name: "Pointe-Noire", lat: -4.7693, lon: 11.8668, value: 10 },
  { name: "Dolisie", lat: -4.2050, lon: 12.6750, value: 7 },
  { name: "Nkayi", lat: -4.1761, lon: 12.9950, value: 5 },
  { name: "Owando", lat: -0.5000, lon: 15.9167, value: 3 }
];

export default function CongoMapWrapper() {
  return <CongoBubbleMap points={points} />;
}
