'use client';

import Image, { ImageProps } from 'next/image';

type MyImageProps = {
  alt: string;
  src: string | null;
  w: number;
  h: number;
  blurDataURL?: string;
  fill?: boolean;
  onLoad?: ImageProps['onLoad'];
};

export function MyImage({ alt, src, w, h, onLoad, fill }: MyImageProps) {
  if (!src || src === '') {
    return null;
  }

  return (
    <div
      className='w-full h-full overflow-hidden relative'
      style={!fill ? { width: w, height: h } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        {...(fill
          ? { fill: true }
          : { width: w, height: h })}
        priority
        style={{ objectFit: 'cover' }}
        onLoad={onLoad}
      />
    </div>
  );
}
