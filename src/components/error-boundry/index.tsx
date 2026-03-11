'use client';

import { Heading } from '@digdir/designsystemet-react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { localization } from '@/libs/language';
import { clientLogger } from '@/libs/logger/client-logger';
import { sanitizeError } from '@/libs/logger/sanitize';
import CenterContainer from '../center-container';

interface Props {
  children?: ReactNode;
  fdkRegistrationBaseUrl?: string | undefined;
  title?: string | undefined;
}

interface State {
  hasError: boolean;
}

//TODO(): This component is from catalog-frontend and has not has not been updated
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
    clientLogger.error({ error: sanitizeError(error) }, 'Uncaught React error');
  }

  public render() {
    if (this.state.hasError) {
      // biome-ignore lint/correctness/noUnusedVariables: <Check why unused - copied from catalog-frontend>
      const pageSubtitle = 'Feil';

      return (
        <>
          <CenterContainer>
            <Heading level={2} data-size='sm'>
              {localization.error.somethingWentWrong}
            </Heading>
          </CenterContainer>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
