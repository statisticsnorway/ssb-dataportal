import { Button, Dialog, Field, Input, Label, ValidationMessage } from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';
import { postSubscriber } from '@/libs/data/classifications/classificationData';
import { localization } from '@/libs/language/src/localization';
import { clientLogger } from '@/libs/logger/client-logger';
import { SubscribeResult, Subscriber, SubscribeStatus, ValidationMessageColors } from '@/types/subscription';
import { validateEmailInput } from '@/utils/classifications/classificationHelpers';
import styles from './subscribe.module.css';

const SubscribeDialog = ({ classificationId }: { classificationId: number | undefined }) => {
  const [inputValue, setInputValue] = useState('');
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [subscribeResult, setSubscribeResult] = useState<SubscribeResult | null>(null);
  const persistedResult = useRef<SubscribeResult | null>(null);

  const resetState = () => {
    setInputValue('');
    setSubscriber(null);
    setSubscribeResult(persistedResult.current);
  };

  useEffect(() => {
    if (subscriber) {
      postSubscriber(subscriber)
        .then((result) => {
          clientLogger.info('subscribeResult', result.message);
          persistedResult.current = result;
          setSubscribeResult(result);
        })
        .catch((error) => {
          clientLogger.error('Subscription failed', error);
        });
    }
  }, [subscriber]);

  const handleSubscription = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmailInput(inputValue)) {
      setSubscribeResult({
        code: SubscribeStatus.InvalidEmail,
        message: localization.classification.subscribeMessageInvalidEmail,
        dataColor: ValidationMessageColors.Danger,
      });
      return;
    }
    setSubscriber({ email: inputValue, classificationId });
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>{localization.classification.subscribe}</Dialog.Trigger>
      <Dialog onClose={resetState}>
        <form onSubmit={handleSubscription} noValidate>
          <Field className={styles.field}>
            <Label weight='semibold' htmlFor='subscription-email'>
              {localization.classification.subscription}
            </Label>
            {persistedResult.current ? null : (
              <Field.Description>{localization.classification.subscribeInfo}</Field.Description>
            )}
            {persistedResult.current ? null : (
              <Input
                id='subscription-email'
                type='email'
                placeholder={localization.classification.emailPlaceholder}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setSubscribeResult(null);
                }}
              />
            )}
            {subscribeResult && (
              <ValidationMessage data-color={subscribeResult.dataColor}>{subscribeResult.message}</ValidationMessage>
            )}
          </Field>
          {persistedResult.current ? null : (
            <Button type='submit' id='subscribe-button'>
              {localization.classification.subscribe}
            </Button>
          )}
        </form>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export { SubscribeDialog };
