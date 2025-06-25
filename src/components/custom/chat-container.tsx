/* eslint-disable react-hooks/exhaustive-deps */

import { cn } from '@/lib/utils';
import { ReactNode, useState, useEffect, Fragment, useRef, useCallback } from 'react';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: ReactNode | string;
  files?: File[];
}

interface ChatMessagesProps {
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// Helper function to render JSX elements
const renderJSXWithTypingEffect = (content: ReactNode, isVisible: boolean) => {
  if (!isVisible) return null;
  
  if (typeof content === 'string') {
    return content;
  }
  
  return content;
};

const useAutoScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean
) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const lastScrollTopRef = useRef(0);
  const autoScrollingRef = useRef(false);
  const prevChildrenCountRef = useRef(0);
  const scrollTriggeredRef = useRef(false);
  const touchStartYRef = useRef(0);

  const isAtBottom = useCallback((element: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    // Increased tolerance value for iOS Safari
    return scrollHeight - scrollTop - clientHeight <= 20;
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const container = containerRef.current;
      if (!container) return;

      autoScrollingRef.current = true;
      scrollTriggeredRef.current = true;

      // Making scroll operation more reliable for iOS Safari
      const targetScrollTop = container.scrollHeight;
      
      // Use instant scroll instead of smooth scroll for iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: isIOS ? 'auto' : behavior,
      });

      // Additional check for iOS
      if (isIOS) {
        setTimeout(() => {
          container.scrollTop = targetScrollTop;
          autoScrollingRef.current = false;
          scrollTriggeredRef.current = false;
        }, 100);
      } else {
        const checkScrollEnd = () => {
          if (Math.abs(container.scrollTop - targetScrollTop) < 5) {
            autoScrollingRef.current = false;
            scrollTriggeredRef.current = false;
            return;
          }
          requestAnimationFrame(checkScrollEnd);
        };
        requestAnimationFrame(checkScrollEnd);
      }

      const safetyTimeout = setTimeout(() => {
        autoScrollingRef.current = false;
        scrollTriggeredRef.current = false;
      }, 500);

      return () => clearTimeout(safetyTimeout);
    },
    [containerRef]
  );

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef?.current;
    if (!container) return;

    lastScrollTopRef.current = container.scrollTop;

    const handleScroll = () => {
      if (autoScrollingRef.current) return;

      const currentScrollTop = container.scrollTop;

      if (currentScrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }

      if (isAtBottom(container) && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      lastScrollTopRef.current = container.scrollTop;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchStartYRef.current - touchY;

      if (touchDiff > 0 && container.scrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }

      lastScrollTopRef.current = container.scrollTop;
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        if (isAtBottom(container) && !autoScrollEnabled) {
          setAutoScrollEnabled(true);
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerRef, enabled, autoScrollEnabled, isAtBottom]);

  return {
    autoScrollEnabled,
    scrollToBottom,
    isScrolling: autoScrollingRef.current,
    scrollTriggered: scrollTriggeredRef.current,
    prevChildrenCountRef,
  };
};

export const ChatContainer = ({ messages, containerRef }: ChatMessagesProps) => {
  const [typingTexts, setTypingTexts] = useState<string[]>([]);
  const [visibleJSX, setVisibleJSX] = useState<boolean[]>([]);
  const [activeMessages, setActiveMessages] = useState<number[]>([]);
  const [showThinking, setShowThinking] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const processedMessagesRef = useRef<Set<number>>(new Set());

  const {
    autoScrollEnabled,
    scrollToBottom,
    isScrolling,
    scrollTriggered,
    prevChildrenCountRef,
  } = useAutoScroll(containerRef, true);

  useEffect(() => {
    if (messages.length > prevChildrenCountRef.current) {
      scrollToBottom("smooth");
    }
    prevChildrenCountRef.current = messages.length;
  }, [messages, scrollToBottom]);

  // Runs when component mounts or messages change
  useEffect(() => {
    // Process a single assistant message and move to the next one when completed
    const processMessage = (messageIndex: number) => {
      const assistantMessages = messages.filter(msg => msg.role === 'assistant');
      
      if (messageIndex >= assistantMessages.length) {
        scrollToBottom("smooth");
        return;
      }
      
      const message = assistantMessages[messageIndex];
      const actualMessageIndex = messages.findIndex(
        (m, i) => m.role === 'assistant' && 
        messages.filter((msg, j) => msg.role === 'assistant' && j < i).length === messageIndex
      );

      // If this message has already been processed, move to the next one
      if (processedMessagesRef.current.has(message.id)) {
        processMessage(messageIndex + 1);
        return;
      }
      
      // Make this message visible
      setActiveMessages(prev => [...prev, actualMessageIndex]);
      
      if (typeof message.content === 'string') {
        // Display string content as streaming
        let currentCharIndex = 0;
        const content = message.content;
        
        const intervalId = setInterval(() => {
          if (currentCharIndex < content.length) {
            setTypingTexts((prev) => {
              const newTexts = [...prev];
              newTexts[messageIndex] = content.substring(
                0,
                currentCharIndex + 1
              );
              return newTexts;
            });
            currentCharIndex++;

            requestAnimationFrame(() => {
              if (containerRef.current && autoScrollEnabled) {
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                scrollToBottom(isIOS ? 'auto' : 'smooth');
              }
            });
          } else {
            clearInterval(intervalId);
            
            // Mark the message as processed
            processedMessagesRef.current.add(message.id);
            
            // Move to the next message after animation is completed
            setTimeout(() => {
              processMessage(messageIndex + 1);
              if (!isScrolling && !scrollTriggered && autoScrollEnabled) {
                scrollToBottom("smooth");
              }
            }, 500);
          }
        }, 10);

        return () => clearInterval(intervalId);
      } else if (message.content) {
        setVisibleJSX(prev => {
          const newVisible = [...prev];
          newVisible[messageIndex] = false;
          return newVisible;
        });
        
        setTimeout(() => {
          setVisibleJSX(prev => {
            const newVisible = [...prev];
            newVisible[messageIndex] = true;
            return newVisible;
          });
          
          // Mark the message as processed
          processedMessagesRef.current.add(message.id);
          
          setTimeout(() => {
            processMessage(messageIndex + 1);
            if (!isScrolling && !scrollTriggered && autoScrollEnabled) {
              scrollToBottom("smooth");
            }
          }, 200);
        }, 100);
      }
    };

    // Reset states for new messages only
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    const unprocessedAssistantMessages = assistantMessages.filter(msg => !processedMessagesRef.current.has(msg.id));
    
    if (unprocessedAssistantMessages.length > 0) {
      setTypingTexts(prev => {
        const newTexts = [...prev];
        unprocessedAssistantMessages.forEach((_, index) => {
          const totalIndex = assistantMessages.length - unprocessedAssistantMessages.length + index;
          newTexts[totalIndex] = '';
        });
        return newTexts;
      });
      
      setVisibleJSX(prev => {
        const newVisible = [...prev];
        unprocessedAssistantMessages.forEach((_, index) => {
          const totalIndex = assistantMessages.length - unprocessedAssistantMessages.length + index;
          newVisible[totalIndex] = false;
        });
        return newVisible;
      });
    }
    
    // Keep existing active messages and add new user messages
    setActiveMessages(prev => {
      const newActiveMessages = [...prev];
      messages.forEach((msg, index) => {
        if (msg.role === 'user' && !newActiveMessages.includes(index)) {
          newActiveMessages.push(index);
          // Scroll when a new user message is added
          requestAnimationFrame(() => {
            if (containerRef.current && autoScrollEnabled) {
              const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
              scrollToBottom(isIOS ? 'auto' : 'smooth');
            }
          });
        }
      });
      return newActiveMessages;
    });
    
    // Show "AI thinking" only if the last message is from user and unprocessed
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      setShowThinking(true);
      
      setTimeout(() => {
        setShowThinking(false);
        
        // Start processing from the first unprocessed assistant message
        const firstUnprocessedIndex = assistantMessages.findIndex(m => !processedMessagesRef.current.has(m.id));
        if (firstUnprocessedIndex !== -1) {
          processMessage(firstUnprocessedIndex);
        }
      }, 2000);
    } else {
      // If the last message is not from user, process any unprocessed assistant messages
      const firstUnprocessedIndex = assistantMessages.findIndex(m => !processedMessagesRef.current.has(m.id));
      if (firstUnprocessedIndex !== -1) {
        processMessage(firstUnprocessedIndex);
      }
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className={cn(
        `flex flex-col ${messages?.length > 0 ? 'h-full' : ''} gap-7 w-full`
      )}
    >
      {/* Display messages */}
      {messages.map((message, index) => {
        const assistantIndex = messages.filter(
          (m, i) => m.role === 'assistant' && i < index
        ).length;

        // Only show active messages
        if (!activeMessages.includes(index)) return null;

        return (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={cn(
              'flex w-full',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                index === 0 && 'mt-4',
                message.role === 'user' ? 'sm:w-full md:w-[420px]' : 'w-full',
                message.role === 'user' ? 'px-4 py-2' : 'px-0 py-0',
                'rounded-2xl',
                'text-foreground/70',
                message.role === 'user' ? 'bg-bubble' : 'bg-layout'
              )}
            >
              {message.role === 'assistant' ? (
                typeof message.content === 'string' ? (
                  // Typing animation for string content
                  <Fragment key={`typing-${index}`}>
                    {typingTexts[assistantIndex] || ''}
                    {typingTexts[assistantIndex] &&
                      typingTexts[assistantIndex].length <
                        message.content.length && (
                        <span className="animate-pulse">▋</span>
                      )}
                  </Fragment>
                ) : (
                  // Animation for JSX content
                  <div
                    className={`transition-opacity duration-500 ${
                      visibleJSX[assistantIndex] ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {renderJSXWithTypingEffect(
                      message.content,
                      visibleJSX[assistantIndex]
                    )}
                    {!visibleJSX[assistantIndex] && (
                      <span className="animate-pulse">▋</span>
                    )}
                  </div>
                )
              ) : (
                // Normal render for user messages
                <p className='text-foreground/70 text-sm'>{message.content}</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Show thinking message */}
      {showThinking && (
        <div className="flex w-full justify-start">
          <div className="rounded-2xl px-4 py-2 bg-layout text-foreground/70">
            <div className="flex items-center gap-2">
              <span className="text-xs italic">Thinking...</span>
              <span className="flex">
                <span className="animate-bounce delay-0">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
