import { Message } from '@/components/custom/chat-container';
import { InformationHeader } from '@/components/custom/information-header';
import {
  ChevronRightIcon,
  Code,
  Database,
  Settings,
} from 'lucide-react';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from '@/components/ui/timeline';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Divider } from '@/components/custom/divider';
import { Button } from '@/components/ui/button';
import { softwareToolData } from '@/temp-data/software-tool-data';

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export const useAssistantMessages = () => {
  const messages: Message[] = [
    {
      id: 1,
      role: 'assistant',
      content:
        "Perfect! Here's your React TypeScript development stack with Node.js backend – complete with code editor, database, testing, and deployment tools, all budget-friendly. Let's build something amazing:",
    },
    {
      id: 2,
      role: 'assistant',
      content: (
        <div className="flex flex-col gap-2">
          <h1 className='text-foreground/80'>
              Ready to discover new tools?
          </h1>

          <p className='text-foreground/60'>
              Let's find your perfect development stack! 🛠️
          </p>
        </div>
      ),
    },
    {
      id: 3,
      role: 'assistant',
      content: (
        <PhotoProvider>
            <div className="grid grid-cols-4 gap-1 md:gap-2 w-full rounded-2xl overflow-hidden">
              <div className="col-span-3 md:col-span-2 rounded-l-lg relative max-h-[360px]">
                
                <PhotoView src="/icons/unknown-icon.svg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer hover:opacity-80 transition-opacity duration-300"></div>
                </PhotoView>
                <div className="absolute flex rounded-l-lg items-center justify-center bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/32 via-white/2 to-transparent backdrop-blur-[1px]">
                  <div className="flex absolute max-w-[206px] px-4 bottom-4 sm:bottom-8 items-center justify-center gap-2 flex-col">
                    <span className="font-semibold text-white text-center text-base md:text-xl leading-5">
                      DEVELOPMENT STACK
                    </span>
                    <span className="text-white/80 text-center text-xs md:text-sm leading-4">
                      Complete toolkit for modern development
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 grid grid-rows-2 gap-1 md:gap-2">
                <div className="relative">
                  <PhotoView src="/icons/unknown-icon.svg">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 cursor-pointer hover:opacity-80 transition-opacity duration-300"></div>
                  </PhotoView>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">VS Code</span>
                  </div>
                </div>
                <div className="relative">
                  <PhotoView src="/icons/unknown-icon.svg">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 cursor-pointer hover:opacity-80 transition-opacity duration-300"></div>
                  </PhotoView>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">React + Node.js</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 relative">
                <PhotoView src="/icons/unknown-icon.svg">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 cursor-pointer hover:opacity-80 transition-opacity duration-300"></div>
                </PhotoView>
                <div className="absolute bottom-2 left-2">
                  <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">Database Options</span>
                </div>
              </div>
              <div className="col-span-2 relative">
                <PhotoView src="/icons/unknown-icon.svg">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 cursor-pointer hover:opacity-80 transition-opacity duration-300"></div>
                </PhotoView>
                <div className="absolute bottom-2 left-2">
                  <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">DevOps Tools</span>
                </div>
              </div>
            </div>
        </PhotoProvider>
      ),
    },
    {
      id: 4,
      role: 'assistant',
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-foreground/80 leading-relaxed">
            Your development stack combines the most popular and reliable tools for modern web development. From coding to deployment, these tools work seamlessly together and are trusted by millions of developers worldwide.
          </p>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium">Why this stack works great:</h3>
            <ul className="space-y-2 text-foreground/70">
              <li className="flex items-start gap-2">
                <Code className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>TypeScript provides type safety and better developer experience</span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                <span>Node.js allows you to use JavaScript for both frontend and backend</span>
              </li>
              <li className="flex items-start gap-2">
                <Settings className="w-4 h-4 mt-1 text-purple-500 flex-shrink-0" />
                <span>Great ecosystem with extensive package libraries and community support</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      role: 'assistant',
      content: (
        <div className="flex flex-col gap-4">
          <InformationHeader
            title={
              <span className="text-base font-medium text-foreground/60 leading-5">
                Essential Development Tools
              </span>
            }
            extra={
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/60 text-sm flex items-center gap-1 h-8 px-3"
              >
                View all tools
                <ChevronRightIcon className="size-4" />
              </Button>
            }
          />
          <div className="grid gap-3">
            {softwareToolData.slice(0, 3).map((tool, index) => (
              <div key={index} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{tool.name}</h4>
                  <span className="text-sm text-foreground/60">{tool.category}</span>
                </div>
                <p className="text-sm text-foreground/70 mb-3">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {tool.pricing.type === 'free' ? 'Free' : 
                       tool.pricing.type === 'freemium' ? 'Freemium' : 
                       `$${tool.pricing.startingPrice}/${tool.pricing.billingPeriod}`}
                    </span>
                    <span className="text-xs text-foreground/50">•</span>
                    <span className="text-xs text-foreground/50">{tool.rating}/5 ⭐</span>
                  </div>
                  <Button variant="outline" size="sm">Learn more</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 6,
      role: 'assistant',
      content: (
        <div className="flex flex-col gap-4">
          <Divider />
          <InformationHeader
            title={
              <span className="text-base font-medium text-foreground/60 leading-5">
                Your Development Roadmap
              </span>
            }
          />
          <Timeline>
            <TimelineItem step={1}>
              <TimelineSeparator>
                <TimelineIndicator className="bg-blue-500" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineDate>Phase 1 - Setup</TimelineDate>
                <div className="mt-2">
                  <h4 className="font-medium mb-1">Development Environment</h4>
                  <p className="text-sm text-foreground/70">Install VS Code, Node.js, and set up your TypeScript project with React</p>
                </div>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={2}>
              <TimelineSeparator>
                <TimelineIndicator className="bg-green-500" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineDate>Phase 2 - Development</TimelineDate>
                <div className="mt-2">
                  <h4 className="font-medium mb-1">Build Your Application</h4>
                  <p className="text-sm text-foreground/70">Create your frontend with React, set up your backend API with Express</p>
                </div>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={3}>
              <TimelineSeparator>
                <TimelineIndicator className="bg-purple-500" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineDate>Phase 3 - Database</TimelineDate>
                <div className="mt-2">
                  <h4 className="font-medium mb-1">Data Layer</h4>
                  <p className="text-sm text-foreground/70">Set up PostgreSQL database and integrate with your backend</p>
                </div>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={4}>
              <TimelineSeparator>
                <TimelineIndicator className="bg-orange-500" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineDate>Phase 4 - Deploy</TimelineDate>
                <div className="mt-2">
                  <h4 className="font-medium mb-1">Go Live</h4>
                  <p className="text-sm text-foreground/70">Deploy to Vercel (frontend) and Railway/Heroku (backend)</p>
                </div>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      ),
    },
    {
      id: 7,
      role: 'assistant',
      content: (
        <div className="flex flex-col gap-4">
          <Divider />
          <InformationHeader
            title={
              <span className="text-base font-medium text-foreground/60 leading-5">
                💡 Pro Tips for Your Stack
              </span>
            }
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="development">
              <AccordionTrigger className="text-left">
                Development Best Practices
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    • Use TypeScript strict mode for better type safety
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Set up ESLint and Prettier for consistent code formatting
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Use Git hooks with Husky for pre-commit validation
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="testing">
              <AccordionTrigger className="text-left">
                Testing Strategy
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    • Use Jest and React Testing Library for unit tests
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Consider Cypress or Playwright for end-to-end testing
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Aim for 80%+ code coverage on critical business logic
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="deployment">
              <AccordionTrigger className="text-left">
                Deployment & DevOps
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    • Use GitHub Actions for CI/CD automation
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Consider Docker for containerization
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Monitor your app with tools like Sentry or LogRocket
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    }
  ];

  return messages;
};