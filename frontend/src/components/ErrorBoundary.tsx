import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
                <p className="text-sm text-gray-600 mt-1">An error occurred while rendering this page</p>
              </div>
            </div>
            
            {this.state.error && (
              <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                <p className="font-semibold text-red-800 mb-2">Error:</p>
                <p className="text-sm text-red-700 font-mono">{this.state.error.message}</p>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-sm text-red-600 cursor-pointer">Stack trace</summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-48 bg-red-100 p-2 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/admin';
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go to Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

