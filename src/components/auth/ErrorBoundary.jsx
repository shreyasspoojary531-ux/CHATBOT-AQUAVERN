import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../ui/Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/home";
  };

  render() {
    if (this.state.hasError) {
      // Allow custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0d0e12]">
          <div className="flex flex-col items-center gap-5 text-center max-w-sm px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/12 bg-red-500/6">
              <AlertTriangle className="h-8 w-8 text-red-400/50" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Something went wrong
              </h2>
              <p className="mt-1.5 text-sm text-white/40 leading-relaxed">
                An unexpected error occurred. You can try reloading or return to the home page.
              </p>
              {this.state.error && (
                <details className="mt-3 text-left">
                  <summary className="text-[11px] text-white/20 cursor-pointer hover:text-white/40 transition-colors">
                    Technical details
                  </summary>
                  <pre className="mt-2 text-[10px] text-red-400/40 bg-black/30 rounded-lg p-3 max-h-32 overflow-auto whitespace-pre-wrap font-mono">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="gap-2 text-sm" onClick={this.handleGoHome}>
                <Home className="h-4 w-4" /> Go Home
              </Button>
              <Button className="gap-2 text-sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" /> Reload
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}