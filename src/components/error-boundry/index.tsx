'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Heading } from '@digdir/designsystemet-react';
import { Breadcrumbs } from '../breadcrumbs';
import CenterContainer from '../center-container';
import { localization } from '@/utils/src';

interface Props {
  children?: ReactNode;
  fdkRegistrationBaseUrl?: string | undefined;
  title?: string | undefined;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private title: string | undefined;

  constructor(props: Props) {
    super(props);
    this.title = props.title;
  }

  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const pageSubtitle = 'Feil';

      return (
        <>
          <Breadcrumbs
            breadcrumbList={[]} homeUrl={{
              href: '',
              text: ''
            }}          />
          <CenterContainer>
            <Heading
              level={2}
              size='small'
            >
              {localization.somethingWentWrong}
            </Heading>
          </CenterContainer>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
