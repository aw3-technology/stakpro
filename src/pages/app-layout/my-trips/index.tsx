import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { ExploreCard } from '@/components/custom/explore-card';
import { TextAnimate } from '@/components/magicui/text-animate';

export const MyTrips = () => {
  return (
    <AppLayoutContent
      title={
        <div className='flex items-center gap-2'>
          <TextAnimate animation="blurInUp" delay={0.1} duration={0.1} by="character" once as="h1" className='leading-8 font-normal'>
          My Trips
          </TextAnimate>

          <TextAnimate animation="blurInUp" delay={0.3} duration={0.1} by="character" once as="span" className='text-xl md:text-2xl lg:text-3xl text-foreground/70 leading-5'>
            (5)
          </TextAnimate>
        </div>
      
      }
      description={
        <TextAnimate animation="blurInUp" delay={0.3} duration={0.1} by="character" once as="p" className='text-foreground/70 leading-5'>
          Your active and upcoming AI-planned adventures
        </TextAnimate>
      }
    >
      <div className="flex flex-col gap-3">
        <TextAnimate animation="blurInUp" delay={0.1} duration={0.1} by="character" once as="span" className='text-foreground/60 leading-5'>Yesterday</TextAnimate>
        
        <ExploreCard
          className="p-2"
          title="6-Day Spain and Barcelona Adventure"
          description="11 May - 17 May 2025 • 2 traveller • 1 room"
          subText="3 travellers • 2 room"
          image="/images/barcelona-cathedral.jpg"
          iconSymbol="🚕"
          imageSize="large"
          delay={0.1}
        />
      </div>
      <div className="flex flex-col gap-3">
        <TextAnimate animation="blurInUp" delay={0.2} duration={0.1} by="character" once as="span" className='text-foreground/60 leading-5'>Previous 7 days</TextAnimate>
        <ExploreCard
          className="p-2"
          title="5-Day London Cultural Escape"
          description="22 May - 27 May 2025 • 2 traveller • 1 room"
          subText="1 traveller • 1 room"
          image="/images/london-cultural.jpg"
          iconSymbol="🚕"
          imageSize="large"
          delay={0.1}
        />
        <ExploreCard
          className="p-2"
          title="7-Day NYC Melting Pot Tour"
          description="4 Feb - 11 Feb 2025 • 2 traveller • 1 room"
          subText="4 travellers • 2 room"
          image="/images/nyc-melting.jpg"
          iconSymbol="🚕"
          imageSize="large"
          delay={0.2}
        />
        <ExploreCard
          className="p-2"
          title="5-Day Rome & Vatican Discovery"
          description="1 Apr - 5 Apr 2025 • 2 traveller • 1 room"
          subText="1 traveller • 1 room"
          image="/images/rome-vatican.jpg"
          iconSymbol="🚕"
          imageSize="large"
          delay={0.3}
        />
      </div>
      <div className="flex flex-col gap-3">
        <TextAnimate animation="blurInUp" delay={0.3} duration={0.1} by="character" once as="span" className='text-foreground/60 leading-5'>Previous 30 days</TextAnimate>
        <ExploreCard
          className="p-2"
          title="7-Day Australia’s East Coast: Sydney & Beyond"
          description="16 May - 22 May 2025 • 2 traveller • 1 room"
          subText="1 traveller • 1 room"
          image="/images/sydney.jpg"
          iconSymbol="🚕"
          imageSize="large"
          delay={0.4}
        />
      </div>
    </AppLayoutContent>
  );
};
