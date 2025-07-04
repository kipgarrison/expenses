import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundryProps = {
  children: ReactNode;
  fallback: ReactNode
}

type ErrorBoundryState = {
  hasError: boolean;
	error?: Error
}

export default class ErrorBoundry extends Component<ErrorBoundryProps, ErrorBoundryState> {
  state = { hasError: false };
	

	static getDerivedStateFromError(error: Error): ErrorBoundryState {
		return { hasError: true,  error};
	}

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
		// TODO::  Adder service endpoint to log error 
  }

	render() {
		if (this.state.hasError) {
			return this.props.fallback
		}
		return this.props.children
	}
}





