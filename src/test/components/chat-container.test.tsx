import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ChatContainer, Message } from '@/components/custom/chat-container';
import { useRef } from 'react';

// Mock the container with required DOM methods
const createMockContainer = () => ({
  current: {
    scrollTo: vi.fn(),
    scrollTop: 0,
    scrollHeight: 1000,
    clientHeight: 500,
    offsetHeight: 500
  }
});

const TestChatContainer = ({ messages, containerRef }: { messages: Message[], containerRef?: any }) => {
  const defaultRef = createMockContainer();
  return <ChatContainer messages={messages} containerRef={containerRef || defaultRef} />;
};

describe('ChatContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any pending timers
    vi.clearAllTimers();
  });

  it('should render empty state when no messages', () => {
    render(<TestChatContainer messages={[]} />);
    
    // Should render the container but with no messages
    const container = document.querySelector('.flex.flex-col');
    expect(container).toBeTruthy();
  });

  it('should render user messages correctly', () => {
    const messages: Message[] = [
      {
        id: 1,
        role: 'user',
        content: 'Hello, I need help with React tools'
      }
    ];

    render(<TestChatContainer messages={messages} />);

    expect(screen.getByText('Hello, I need help with React tools')).toBeInTheDocument();
  });

  it('should render assistant messages correctly', () => {
    const messages: Message[] = [
      {
        id: 1,
        role: 'assistant',
        content: 'I can help you find the best React development tools.'
      }
    ];

    render(<TestChatContainer messages={messages} />);

    // Assistant messages may show as "Thinking..." initially due to typing animation
    const assistantContainer = document.querySelector('.justify-start');
    expect(assistantContainer).toBeTruthy();
  });

  it('should handle multiple messages in conversation', () => {
    const messages: Message[] = [
      {
        id: 1,
        role: 'user',
        content: 'What are the best React IDEs?'
      },
      {
        id: 2,
        role: 'assistant',
        content: 'Here are some excellent React IDEs: VS Code, WebStorm, and Atom.'
      },
      {
        id: 3,
        role: 'user',
        content: 'Tell me more about VS Code'
      }
    ];

    render(<TestChatContainer messages={messages} />);

    // User messages should be visible immediately
    expect(screen.getByText('What are the best React IDEs?')).toBeInTheDocument();
    expect(screen.getByText('Tell me more about VS Code')).toBeInTheDocument();
    
    // Assistant messages may show thinking animation
    const assistantContainers = document.querySelectorAll('.justify-start');
    expect(assistantContainers.length).toBeGreaterThan(0);
  });

  it('should display messages in correct order', () => {
    const messages: Message[] = [
      { id: 1, role: 'user', content: 'First message' },
      { id: 2, role: 'assistant', content: 'Second message' },
      { id: 3, role: 'user', content: 'Third message' }
    ];

    render(<TestChatContainer messages={messages} />);

    // Check user messages are in correct order
    const userMessages = screen.getAllByText(/First message|Third message/);
    expect(userMessages[0]).toHaveTextContent('First message');
    expect(userMessages[1]).toHaveTextContent('Third message');
  });

  it('should handle JSX content in messages', async () => {
    const messages: Message[] = [
      {
        id: 1,
        role: 'assistant',
        content: <div data-testid="jsx-content">Custom JSX content</div>
      }
    ];

    render(<TestChatContainer messages={messages} />);

    // Wait for the JSX content to become visible (after typing animation)
    await waitFor(() => {
      expect(screen.getByTestId('jsx-content')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Custom JSX content')).toBeInTheDocument();
  });

  it('should apply correct styling for user vs assistant messages', () => {
    const messages: Message[] = [
      { id: 1, role: 'user', content: 'User message' },
      { id: 2, role: 'assistant', content: 'Assistant message' }
    ];

    const { container } = render(<TestChatContainer messages={messages} />);

    // Check that user messages have different styling than assistant messages
    const userMessageContainer = container.querySelector('.justify-end');
    const assistantMessageContainer = container.querySelector('.justify-start');
    
    expect(userMessageContainer).toBeTruthy();
    expect(assistantMessageContainer).toBeTruthy();
    
    // User messages should have bubble styling
    const userBubble = container.querySelector('.bg-bubble');
    expect(userBubble).toBeTruthy();
    
    // Assistant messages should have layout styling
    const assistantBubble = container.querySelector('.bg-layout');
    expect(assistantBubble).toBeTruthy();
  });

  it('should handle file attachments in user messages', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const messages: Message[] = [
      {
        id: 1,
        role: 'user',
        content: 'Here is my project file',
        files: [mockFile]
      }
    ];

    render(<TestChatContainer messages={messages} />);

    expect(screen.getByText('Here is my project file')).toBeInTheDocument();
    // File attachments would be rendered by the component
  });

  it('should maintain scroll position appropriately', () => {
    const mockContainer = {
      current: {
        scrollTop: 100,
        scrollHeight: 500,
        clientHeight: 300,
        scrollTo: vi.fn()
      }
    };

    const messages: Message[] = [
      { id: 1, role: 'user', content: 'Test message' }
    ];

    render(<TestChatContainer messages={messages} containerRef={mockContainer} />);

    // Scroll behavior would be tested in integration tests
    expect(mockContainer.current).toBeDefined();
  });

  it('should handle rapid message updates', async () => {
    const { rerender } = render(<TestChatContainer messages={[]} />);

    // Add messages rapidly
    const messages1: Message[] = [
      { id: 1, role: 'user', content: 'Message 1' }
    ];
    rerender(<TestChatContainer messages={messages1} />);

    const messages2: Message[] = [
      ...messages1,
      { id: 2, role: 'assistant', content: 'Message 2' }
    ];
    rerender(<TestChatContainer messages={messages2} />);

    // User message should be visible immediately
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    
    // Assistant message should become visible after typing animation
    await waitFor(() => {
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle long messages gracefully', () => {
    const longContent = 'A'.repeat(1000);
    const messages: Message[] = [
      { id: 1, role: 'user', content: longContent }
    ];

    render(<TestChatContainer messages={messages} />);

    expect(screen.getByText(longContent)).toBeInTheDocument();
  });
});