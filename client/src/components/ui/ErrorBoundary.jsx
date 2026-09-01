import { Component } from "react";
import { PageError } from "./PageState";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App error boundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030407] text-white">
          <PageError
            title="The page ran into a problem"
            message="Refresh the page or go back and try that action again."
            actionLabel="Try again"
            onAction={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
