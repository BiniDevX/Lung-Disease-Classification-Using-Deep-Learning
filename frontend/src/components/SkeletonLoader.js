import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="h-32 bg-gray-200 rounded-lg w-full mb-4"></div>{" "}
      {/* Simulating an image placeholder */}
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>{" "}
      {/* Title placeholder */}
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>{" "}
      {/* Subtitle placeholder */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>{" "}
        {/* Text placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>{" "}
        {/* Text placeholder */}
      </div>
      <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>{" "}
      {/* Button placeholder */}
    </div>
  );
};

export default SkeletonLoader;
