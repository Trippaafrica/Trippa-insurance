import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#FF6B00', marginBottom: '20px' }}>Something went wrong</h1>
          <div style={{ 
            backgroundColor: '#f8f8f8', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h3>Error Details:</h3>
            <pre style={{ 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#666'
            }}>
              {this.state.error?.toString()}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              backgroundColor: '#FF6B00',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
); 