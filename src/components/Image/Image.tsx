'use client';

import Image, { ImageProps } from 'next/image';

type MyImageProps = {
  alt: string;
  src: string | null;
  w: number;
  h: number;
  blurDataURL?: string;
  fill? : boolean
  onLoad?: ImageProps['onLoad'];
};

export function MyImage({ alt, src, w, h, onLoad, fill }: MyImageProps) {
  if (!src || src === '') {
    return null;
  }

  return (
    <div>
      <Image
        src={src}
        width={w}
        height={h}
        alt={alt}
        fill={fill}
        priority
        style={{ objectFit: 'cover' }}
        onLoad={onLoad}
      />
    </div>
  );
}
