# EQS25002 - Benefit Calculator Application

A modern, type-safe Next.js application for benefit calculations with comprehensive testing and clean architecture.

## 🏗️ Architecture & Structure

This project follows industry best practices with a clean, maintainable architecture:

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── config/                # Configuration files
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API services and external integrations
├── store/                 # State management (Zustand)
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions

__tests__/                 # Test files mirroring src structure
├── components/
├── hooks/
├── services/
├── store/
└── utils/
```

## 🚀 Features

- **Type Safety**: Comprehensive TypeScript configuration with strict rules
- **Modern State Management**: Zustand with immer middleware for immutable updates
- **Comprehensive Testing**: Jest + Testing Library with 80%+ coverage requirements
- **Clean Code**: ESLint + SonarJS rules for code quality
- **API Layer**: Robust API service with error handling and type safety
- **Form Validation**: Comprehensive validation with user-friendly error messages
- **Responsive Design**: Modern UI with Tailwind CSS
- **Performance**: Optimized with Next.js 15 and React 19

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- TypeScript knowledge

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eqs25002
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Structure

Tests are organized to mirror the source structure:

- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React component behavior and rendering
- **Integration Tests**: API services and complex workflows
- **Store Tests**: State management logic

### Writing Tests

```typescript
// Example test structure
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should behave correctly', () => {
      // Arrange
      // Act  
      // Assert
    });
  });
});
```

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ci      # Run tests for CI
```

## 📁 Project Structure Details

### Components
- **UI Components**: Reusable base components following shadcn/ui patterns
- **Form Components**: Specialized form components with validation
- **Layout Components**: Page layout and navigation components

### Services
- **API Service**: Centralized HTTP client with error handling
- **Type-safe**: All API calls are strongly typed
- **Error Handling**: Custom error classes for different failure scenarios

### State Management
- **Zustand Store**: Lightweight state management
- **Immer Integration**: Immutable state updates
- **Selector Hooks**: Performance-optimized state access

### Types
- **Comprehensive**: All data structures are typed
- **Type Guards**: Runtime type checking utilities
- **API Types**: Request/response type definitions

### Utils
- **Validation**: Form and data validation utilities
- **Formatters**: Display formatting functions
- **Helpers**: Common utility functions

## 🎯 Code Quality

### TypeScript Configuration
- Strict mode enabled
- No implicit any
- Unused variables detection
- Consistent import types

### ESLint Rules
- React best practices
- TypeScript-specific rules
- SonarJS code quality rules
- Import ordering and organization

### Code Style
- Consistent naming conventions
- Comprehensive error handling
- Documentation for complex functions
- Clean, readable code structure

## 📊 Testing Philosophy

### Unit Testing
- Test individual functions in isolation
- Mock external dependencies
- Cover edge cases and error scenarios

### Component Testing
- Test user interactions
- Test component props and state
- Test accessibility features

### Integration Testing
- Test API integration
- Test complex user workflows
- Test state management integration

## 🔒 Error Handling

### Client-Side
- Comprehensive form validation
- User-friendly error messages
- Graceful degradation

### API Layer
- Custom error classes
- Network error handling
- Retry logic for failed requests

### Validation
- Runtime type checking
- Input sanitization
- Business logic validation

## 🚀 Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Variables
```bash
NEXT_PUBLIC_API_BASE_URL=your_api_url
```

### Production Considerations
- Enable TypeScript strict mode
- Run full test suite
- Check ESLint compliance
- Verify environment configuration

## 📚 API Documentation

### Benefit Calculator API
- `POST /api/benefit-calculator` - Calculate benefits
- `GET /api/benefit-calculator/fields` - Get required fields
- `POST /api/benefit-calculator/validate` - Validate member data

### Bulk Processing API
- `POST /api/bulk-process` - Start bulk processing
- `GET /api/bulk-process/{id}/status` - Get batch status
- `GET /api/bulk-process/{id}/results` - Get batch results
- `DELETE /api/bulk-process/{id}` - Cancel batch

### Member Data API
- `GET /api/member-data/{id}` - Get member by ID
- `GET /api/member-data` - Search members

## 🤝 Contributing

1. **Follow TypeScript strict mode**
2. **Write comprehensive tests**
3. **Follow ESLint rules**
4. **Update documentation**
5. **Test thoroughly before committing**

### Code Review Checklist
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] ESLint rules pass
- [ ] Code coverage meets requirements
- [ ] Documentation updated
- [ ] Error handling implemented
- [ ] Accessibility considered

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
1. Check the test files for usage examples
2. Review the TypeScript types for API contracts
3. Check the ESLint configuration for coding standards
4. Create an issue with detailed reproduction steps
