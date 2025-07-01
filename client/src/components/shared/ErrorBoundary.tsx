import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundryProps = {
  children: ReactNode;
  fallback: ReactNode
}

type ErrorBoundryState = {
  hasError: boolean;
}

export default class ErrorBoundry extends Component<ErrorBoundryProps, ErrorBoundryState> {
  state = { hasError: false };

	static getDerivedStateFromError(_: Error): ErrorBoundryState {
		return { hasError: true };
	}

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

	render() {
		if (this.state.hasError) {
			return this.props.fallback
		}
		return this.props.children
	}
}





