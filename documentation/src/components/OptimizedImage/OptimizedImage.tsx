import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  /** Optional WebP source. Omit when no WebP asset exists to avoid 404 console noise. */
  webpSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  decoding = 'async',
  webpSrc,
}: OptimizedImageProps) {
  if (webpSrc) {
    return (
      <picture className={className}>
        <source srcSet={webpSrc} type="image/webp" />
        <source srcSet={src} type={`image/${src.split('.').pop()}`} />
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding={decoding}
    />
  );
}
