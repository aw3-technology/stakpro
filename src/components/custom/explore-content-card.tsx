import { cn } from '@/lib/utils';
import { StackImages } from './stack-images';
import { Tag } from './tag';

export const ExploreContentCard = ({
  coverImageUrl,
  coverImageAlt,
  title,
  description,
  tags,
  footer,
}: {
  coverImageUrl: string;
  coverImageAlt: string;
  title: string;
  description: string;
  tags: {
    small?: boolean;
    text: string;
    bgColor: string;
    darkBgColor: string;
    textColor: string;
    darkTextColor: string;
  }[];
  footer?: React.ReactNode
}) => {
  return (
    <div className="flex flex-col items-center sm:flex-row justify-center sm:justify-start gap-3 py-6 px-0 sm:px-6 rounded-lg bg-card shadow-shadow-2 backdrop-blur-md">
      <StackImages
        coverImageUrl={coverImageUrl}
        coverImageAlt={coverImageAlt}
        hasFavorite
      />
      <div className="flex flex-col px-4 gap-4 ">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-medium leading-6 text-foreground">
            {title}
          </span>
          <span className="text-sm text-foreground leading-5">
            {description}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <Tag
              key={tag.text}
              small={true}
              className={cn(
                'bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-900 dark:text-fuchsia-100',
                tag.bgColor,
                tag.textColor,
                tag.darkBgColor,
                tag.darkTextColor
              )}
            >
              {tag.text}
            </Tag>
          ))}
        </div>
        {footer}
      </div>
    </div>
  );
};
