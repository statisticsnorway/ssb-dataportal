import { Button, Dialog, Field, Input, Label, ValidationMessage } from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';
import { postSubscriber } from '@/libs/data/classifications/classificationData';
import { localization } from '@/libs/language/src/localization';
import { clientLogger } from '@/libs/logger/client-logger';
import { SubscribeResult, Subscriber } from '@/types/classification';
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
    setSubscriber({ email: inputValue, classificationId });
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>{localization.classification.subscribe}</Dialog.Trigger>
      <Dialog onClose={resetState}>
        <form onSubmit={handleSubscription}>
          <Field className={styles.field}>
            <Label weight='semibold'>{localization.classification.subscribeInfo}</Label>
            {persistedResult.current ? null : (
              <Input
                id='subscription-email'
                type='email'
                required
                placeholder='Din e-postadresse'
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
