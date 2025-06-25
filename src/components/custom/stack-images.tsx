import { useState } from 'react';
import { FavoriteIcon } from './favorite-icon';
import { cn } from '@/lib/utils';

export const StackImages = ({
  coverImageUrl,
  coverImageAlt,
  hasFavorite,
}: {
  coverImageUrl: string;
  coverImageAlt: string;
  hasFavorite?: boolean;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={cn('relative w-42 h-32 rounded-2xl shadow-md select-none')}>
      <div className="absolute w-full h-full border-2 shadow-xl shadow-shadow-24 border-foreground-light-solid rounded-2xl overflow-hidden transform -rotate-6 z-20 opacity-50">
        <img
          src="/images/barcelona-beach.jpg"
          alt="Barcelona Beach"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute w-full h-full border-2 shadow-2xl border-foreground-light-solid rounded-2xl overflow-hidden transform -rotate-3 z-30 opacity-70">
        <img
          src="/images/barcelona-fountain.jpg"
          alt="Barcelona Fountain"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute w-full h-full border-2 shadow-2xl border-foreground-light-solid rounded-2xl overflow-hidden transform z-40">
        <img
          src={coverImageUrl}
          alt={coverImageAlt}
          className="w-full h-full object-cover"
        />
        {hasFavorite && (
          <div
            onClick={() => setIsFavorite((prev) => !prev)}
            className={
              'absolute top-2 right-2 z-10 w-[30px] cursor-pointer hover:opacity-80 transition-opacity duration-300'
            }
          >
            <FavoriteIcon
              className={
                isFavorite ? 'fill-rose-500' : 'fill-foreground-light-solid/40'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
