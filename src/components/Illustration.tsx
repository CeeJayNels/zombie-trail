import { useState } from 'react';

type IllustrationKind = 'event' | 'portrait' | 'icon' | 'scenery';

const FOLDER: Record<IllustrationKind, string> = {
  event: 'events',
  portrait: 'portraits',
  icon: 'icons',
  scenery: 'scenery',
};

interface Props {
  kind: IllustrationKind;
  name: string;
  alt: string;
  className?: string;
}

export function Illustration({ kind, name, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  const cls = ['illustration', className].filter(Boolean).join(' ');

  if (failed) {
    return (
      <div
        className={`${cls} illustration-placeholder`}
        role="img"
        aria-label={alt}
      >
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={`/art/${FOLDER[kind]}/${name}.svg`}
      alt={alt}
      className={cls}
      onError={() => setFailed(true)}
    />
  );
}
