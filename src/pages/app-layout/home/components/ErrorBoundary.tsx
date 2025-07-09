import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="text-foreground/60">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left bg-foreground/5 p-4 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium">
                  Error details
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <Button onClick={this.handleReset}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}