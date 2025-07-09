# StakPro Testing Suite Documentation

## Overview

This document provides comprehensive information about the testing infrastructure and practices for the StakPro application. Our testing strategy covers unit tests, integration tests, component tests, and end-to-end tests to ensure high-quality, reliable software.

## Testing Strategy

### 1. **Testing Pyramid**

```
    /\
   /  \     E2E Tests (Few, High-Value)
  /____\    
 /      \   Integration Tests (Some)
/________\  
          \  Unit Tests (Many, Fast)
```

- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components in isolation
- **Integration Tests**: Test API services and data flows
- **E2E Tests**: Test complete user workflows

### 2. **Testing Tools**

- **Vitest**: Fast unit and integration testing
- **Testing Library**: Component testing with user-focused queries
- **Playwright**: End-to-end testing across browsers
- **GitHub Actions**: Automated CI/CD testing

## Test Structure

### Directory Organization

```
src/
├── test/
│   ├── setup.ts              # Test configuration
│   ├── utils/                # Utility function tests
│   ├── services/             # API service tests
│   └── components/           # Component tests
e2e/
├── home-chat.spec.ts         # Chat functionality
├── tool-discovery.spec.ts    # Search and discovery
└── user-flows.spec.ts        # Critical user journeys
```

## Running Tests

### Unit and Component Tests

```bash
# Run all unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test -- --watch
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

## Test Coverage Goals

### Coverage Targets
- **Overall Coverage**: 80%
- **Utilities**: 95%
- **Services**: 85%
- **Components**: 75%
- **Critical User Flows**: 100% E2E coverage

### Current Coverage Areas

#### ✅ **Well Covered**
- Utility functions (cn, formatting)
- Core services (comparison engine, recommendations)
- API integrations (tool-api, user-api)
- Chat interface components
- Tool card components

#### ⚠️ **Needs Improvement**
- AI assistant hooks
- Complex form components
- Error boundary components
- Authentication flows

## Test Categories

### 1. **Unit Tests**

**Purpose**: Test individual functions and logic
**Location**: `src/test/utils/`, `src/test/services/`

**Examples**:
- `cn.test.ts`: Class name utility function
- `comparison-engine.test.ts`: Tool comparison logic
- `recommendation-engine.test.ts`: AI recommendation system

**Best Practices**:
- Test pure functions extensively
- Mock external dependencies
- Test edge cases and error conditions
- Keep tests fast and isolated

### 2. **Component Tests**

**Purpose**: Test React components in isolation
**Location**: `src/test/components/`

**Examples**:
- `chat-container.test.tsx`: Chat interface functionality
- `tool-card.test.tsx`: Tool display components

**Best Practices**:
- Use user-centered queries (`getByRole`, `getByText`)
- Test user interactions with `fireEvent` or `userEvent`
- Mock external services and contexts
- Test accessibility features

### 3. **Integration Tests**

**Purpose**: Test API services and data flow
**Location**: `src/test/services/`

**Examples**:
- API calls with mocked Supabase
- Service layer integration
- Data transformation logic

**Best Practices**:
- Mock external APIs consistently
- Test error handling scenarios
- Verify data transformations
- Test authentication flows

### 4. **End-to-End Tests**

**Purpose**: Test complete user workflows
**Location**: `e2e/`

**Critical Flows Covered**:
- ✅ **Chat Interface**: Message sending, history persistence
- ✅ **Tool Discovery**: Search, filters, pagination
- ✅ **User Authentication**: Login, signup, password reset
- ✅ **Tool Management**: Save, compare, submit tools
- ✅ **Navigation**: Cross-page functionality
- ✅ **Responsive Design**: Mobile/desktop compatibility

**Best Practices**:
- Test realistic user scenarios
- Use data attributes for stable selectors
- Test across multiple browsers
- Include accessibility testing

## Mocking Strategy

### 1. **External Services**
```typescript
// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockQuery),
    auth: { getUser: vi.fn() }
  }
}));

// Mock API responses
const mockTools = [
  { id: 1, name: 'VS Code', category: 'Development' }
];
```

### 2. **Browser APIs**
```typescript
// Mock window objects
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
});
```

### 3. **React Context**
```typescript
// Mock authentication context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    isAuthenticated: true
  })
}));
```

## Writing Tests

### Unit Test Example
```typescript
describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('base-class', 'additional-class');
    expect(result).toBe('base-class additional-class');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', {
      'active': true,
      'disabled': false,
    });
    expect(result).toBe('base active');
  });
});
```

### Component Test Example
```typescript
describe('ToolCard', () => {
  it('should render tool information correctly', () => {
    render(<ToolCard tool={mockTool} />);
    
    expect(screen.getByText('VS Code')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  it('should handle save functionality', async () => {
    render(<ToolCard tool={mockTool} />);
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockSaveFunction).toHaveBeenCalled();
    });
  });
});
```

### E2E Test Example
```typescript
test('should persist chat history on page refresh', async ({ page }) => {
  await page.goto('/');
  
  // Send a message
  await page.fill('textarea', 'Test message');
  await page.click('button[type="submit"]');
  
  // Verify message appears
  await expect(page.locator('text=Test message')).toBeVisible();
  
  // Refresh and verify persistence
  await page.reload();
  await expect(page.locator('text=Test message')).toBeVisible();
});
```

## Test Data Management

### 1. **Mock Data**
Create reusable mock data in dedicated files:

```typescript
// src/test/mockData.ts
export const mockTool = {
  id: 1,
  name: 'VS Code',
  description: 'Code editor',
  category: 'Development',
  // ... other properties
};

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com'
};
```

### 2. **Test Fixtures**
For E2E tests, use consistent test data:

```typescript
// e2e/fixtures/tools.json
[
  {
    "name": "Test Tool",
    "category": "Development",
    "website": "https://testtool.com"
  }
]
```

## Continuous Integration

### GitHub Actions Workflow

Our CI pipeline runs:
1. **Lint Check**: Code quality verification
2. **Unit Tests**: Fast feedback on logic
3. **Build Verification**: Ensure production build works
4. **E2E Tests**: Full user workflow validation

### Test Results
- ✅ **Automated on PR**: All tests run on pull requests
- ✅ **Coverage Reports**: Generated and uploaded
- ✅ **Failure Artifacts**: Screenshots and traces saved
- ✅ **Multi-browser**: Tests run on Chrome, Firefox, Safari

## Performance Testing

### Test Execution Times
- **Unit Tests**: < 30 seconds
- **Component Tests**: < 60 seconds
- **E2E Tests**: < 5 minutes
- **Full Suite**: < 10 minutes

### Optimization Strategies
- Parallel test execution
- Selective test running in CI
- Test result caching
- Efficient mocking strategies

## Debugging Tests

### Unit/Component Tests
```bash
# Debug with UI
npm run test:ui

# Debug specific test
npm run test -- --reporter=verbose specific.test.ts

# Debug with VS Code
# Use "JavaScript Debug Terminal" in VS Code
npm run test -- --run specific.test.ts
```

### E2E Tests
```bash
# Debug mode with browser
npm run test:e2e:debug

# Headed mode
npx playwright test --headed

# Specific test debug
npx playwright test home-chat.spec.ts --debug
```

## Best Practices

### 1. **Test Organization**
- Group related tests with `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests focused and single-purpose

### 2. **Maintainability**
- Use page object model for E2E tests
- Create reusable test utilities
- Keep mocks simple and consistent
- Update tests when features change

### 3. **Performance**
- Avoid unnecessary DOM queries
- Use efficient selectors
- Minimize test setup/teardown
- Run tests in parallel when possible

### 4. **Reliability**
- Use stable selectors (data-testid)
- Add proper wait conditions
- Handle async operations correctly
- Test both success and failure scenarios

## Coverage Reports

### Viewing Coverage
```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Metrics
- **Lines**: 85%
- **Functions**: 82%
- **Branches**: 78%
- **Statements**: 85%

## Troubleshooting

### Common Issues

1. **Test Timeouts**
   - Increase timeout for async operations
   - Check for infinite loops or race conditions
   - Verify mock implementations

2. **Flaky E2E Tests**
   - Add explicit waits
   - Use more specific selectors
   - Check for timing-dependent assertions

3. **Mock Issues**
   - Verify mock implementations match real APIs
   - Clear mocks between tests
   - Check for missing mock returns

### Getting Help

- Check test output for specific error messages
- Use `--reporter=verbose` for detailed information
- Review test documentation and examples
- Ask team members for code review on test changes

---

*Last updated: July 3, 2025*
*For questions about testing, refer to this documentation or reach out to the development team.*