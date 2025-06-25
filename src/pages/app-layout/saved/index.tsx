import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { FavoriteIcon } from '@/components/custom/favorite-icon';
import { StarIcon } from '@/components/custom/icons/star-icon';
import { SavedCard } from '@/components/custom/saved-card';
import { StackImages } from '@/components/custom/stack-images';
import { Tag } from '@/components/custom/tag';
import { MapPin } from 'lucide-react';
import { TextAnimate } from '@/components/magicui/text-animate';
export const Saved = () => {
  return (
    <AppLayoutContent
      title={
        <div className='flex items-center gap-2'>
          <TextAnimate animation="blurInUp" delay={0.1} duration={0.2} by="character" once as="h1" className='leading-8 font-normal'>
             Saved
          </TextAnimate>

          <TextAnimate animation="blurInUp" delay={0.3} duration={0.2} by="character" once as="span" className='text-xl md:text-2xl lg:text-3xl text-foreground/70 leading-5'>
            (4)
          </TextAnimate>
        </div>
        
      }
      description={
        <TextAnimate animation="blurInUp" delay={0.3} duration={0.3} by="character" once as="p" className='text-foreground/70 leading-5'>
          Destinations, hotels, and activities you’ve bookmarked
        </TextAnimate>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SavedCard delay={0.75}>
          <div className="absolute top-4 right-4">
            <FavoriteIcon className="size-6 fill-rose-500" />
          </div>
          <div className="flex flex-col gap-8 items-center justify-center pt-9">
            <StackImages
              coverImageUrl="/images/staycity-apart-hotel.jpg"
              coverImageAlt="Staycity Aparthotels Deptford Bridge"
            />
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className="size-4 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-base font-medium text-foreground">
                  Staycity Aparthotels Deptford Bridge
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="bg-review-card text-foreground-light-solid">4.3/5</Tag>
                <span className="text-sm font-bold text-foreground/70">
                  Very Good
                </span>
                <span className="text-sm text-foreground/40">167 reviews</span>
              </div>
              <span className="text-sm text-foreground/40 flex items-center gap-2">
                <MapPin className="size-4" />
                Near Railway Station
              </span>
            </div>
          </div>
        </SavedCard>
        <SavedCard delay={1}>
          <div className="absolute top-4 right-4">
            <FavoriteIcon className="size-6 fill-rose-500" />
          </div>
          <div className="flex flex-col gap-8 items-center justify-center pt-9">
            <StackImages
              coverImageUrl="/images/catolania-atenas.jpg"
              coverImageAlt="Catolania Atenas"
            />
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className="size-4 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-base font-medium text-foreground">
                  Catolania Atenas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="bg-review-card text-foreground-light-solid">4.8/5</Tag>
                <span className="text-sm font-bold text-foreground/70">
                  Amazing
                </span>
                <span className="text-sm text-foreground/40">481 reviews</span>
              </div>
              <span className="text-sm text-foreground/40 flex items-center gap-2">
                <MapPin className="size-4" />
                Near Sagrada Familia
              </span>
            </div>
          </div>
        </SavedCard>
        <SavedCard delay={1.25}>
          <div className="absolute top-4 right-4">
            <FavoriteIcon className="size-6 fill-rose-500" />
          </div>
          <div className="flex flex-col gap-8 items-center justify-center pt-9">
            <StackImages
              coverImageUrl="/images/hesperia-barcelona.jpg"
              coverImageAlt="Barcelona Del Mar"
            />
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className="size-4 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-base font-medium text-foreground">
                  Hesperia Barcelona Del Mar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="bg-review-card text-foreground-light-solid">3.9/5</Tag>
                <span className="text-sm font-bold text-foreground/70">
                  Good
                </span>
                <span className="text-sm text-foreground/40">129 reviews</span>
              </div>
              <span className="text-sm text-foreground/40 flex items-center gap-2">
                <MapPin className="size-4" />
                Near Poblenou Metro Station
              </span>
            </div>
          </div>
        </SavedCard>
        <SavedCard delay={1.5}>
          <div className="absolute top-4 right-4">
            <FavoriteIcon className="size-6 fill-rose-500" />
          </div>
          <div className="flex flex-col gap-8 items-center justify-center pt-9">
            <StackImages
              coverImageUrl="/images/claris-hotel.jpg"
              coverImageAlt="Claris Hotel"
            />
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className="size-4 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-base font-medium text-foreground">
                  Claris Hotel & Spa GL
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="bg-review-card text-foreground-light-solid">4.8/5</Tag>
                <span className="text-sm font-bold text-foreground/70">
                  Very Good
                </span>
                <span className="text-sm text-foreground/40">253 reviews</span>
              </div>
              <span className="text-sm text-foreground/40 flex items-center gap-2">
                <MapPin className="size-4" />
                Near La Pedrera – Casa Milà
              </span>
            </div>
          </div>
        </SavedCard>
      </div>
    </AppLayoutContent>
  );
};
