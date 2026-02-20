import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <h1>Puuuuuf... algo se ha roto</h1>
            <p>Parece que el código ha entrado en un bucle infinito de nostalgia o un error inesperado.</p>
            <button 
              className="btn-main" 
              onClick={() => window.location.href = '/'}
            >
              Volver al inicio
            </button>
            {import.meta.env.DEV && (
              <pre className="error-details">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
