'use client';

import Image from 'next/image';

type MyImageProps = {
  alt: string;
  src: string | null;
  w: number;
  h: number;
  blurDataURL?: string;
};

export function MyImage({ alt, src, w,h }: MyImageProps) {
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
        
        priority
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
