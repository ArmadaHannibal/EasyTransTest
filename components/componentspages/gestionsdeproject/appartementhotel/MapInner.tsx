"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { createRoot } from "react-dom/client";
import { Lens } from "@/components/ui/lens";

import { motion } from "motion/react";

interface Point {
  name: string;
  lat: number;
  lon: number;
  value: number;
}

interface BubbleMapProps {
  points: Point[];
}

export default function BubbleMapCongo({ points }: BubbleMapProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    d3.json("/congo.geojson").then((geojson: any) => {
      const projection = d3.geoMercator().fitSize([width, height], geojson);
      const path = d3.geoPath().projection(projection);

      // Zones avec contours légers
      svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", "#e0e0e0") // gris clair pour les zones
        .attr("stroke", "#999") // contours gris
        .attr("stroke-width", 1); // séparation légère

      // Labels noirs pour les zones
      svg
        .append("g")
        .selectAll("text")
        .data(geojson.features)
        .enter()
        .append("text")
        .attr("x", (d: any) => {
          const centroid = path.centroid(d);
          return centroid[0];
        })
        .attr("y", (d: any) => {
          const centroid = path.centroid(d);
          return centroid[1];
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#000000")
        .attr("font-size", 10)
        .attr("font-weight", "500")
        .text((d: any) => d.properties.name || "");

      // Points rouges avec labels noirs
      const g = svg.append("g");
      points.forEach((d) => {
        const [x, y] = projection([d.lon, d.lat])!;

        // Icône FaLocationDot rouge
        const fo = g
          .append("foreignObject")
          .attr("x", x - 12)
          .attr("y", y - 24)
          .attr("width", 24)
          .attr("height", 24);

        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.color = "#ff0000"; // rouge

        fo.node()?.appendChild(div);
        const root = createRoot(div);
        root.render(<FaLocationDot size={24} />);

        // Label du point
        svg
          .append("text")
          .attr("x", x)
          .attr("y", y - 16)
          .attr("text-anchor", "middle")
          .attr("fill", "#000000")
          .attr("font-size", 12)
          .attr("font-weight", "500")
          .text(d.name);
      });
    });
  }, [points]);

  return (
    <div className="relative z-10 w-full flex justify-center">
      <Lens hovering={hovering} setHovering={setHovering}>
        <svg ref={ref} className="max-w-full h-[26rem]"></svg>
      </Lens>
    </div>
  );
}
