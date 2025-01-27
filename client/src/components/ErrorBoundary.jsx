// components/ErrorBoundary.jsx
import React from 'react';
import { Button } from '@nextui-org/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center max-w-md">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              color="primary"
              onPress={() => {
                this.setState({ hasError: false });
                window.location.href = '/group-therapy';
              }}
            >
              Return to Sessions
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;