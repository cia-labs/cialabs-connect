'use client';

import Image from 'next/image';

type MyImageProps = {
  alt: string;
  src: string;
  blurDataURL?: string;
};

export function MyImage({ alt, src }: MyImageProps) {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
