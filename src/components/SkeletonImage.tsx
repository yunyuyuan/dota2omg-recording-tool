import React, { type ImgHTMLAttributes, useState } from 'react';
import { Skeleton } from "@mui/material";
import clsx from 'clsx';


const ImageWithSkeleton = ({ className, width, height, src, alt, ...rest }: {aspect?: number} & ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full">
      {isLoading && (
        <Skeleton className={className} style={{
          // override <Skeleton> default style
          transform: 'none'
        }} width={width} height={height} />
      )}
      <img
        src={src}
        alt={alt}
        className={clsx(className, isLoading ? 'hidden' : 'block')}
        onLoad={() => setIsLoading(false)}
        {...rest}
      />
    </div>
  );
};

export default ImageWithSkeleton;