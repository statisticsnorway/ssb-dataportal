/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { Button, Dialog, Field, Input, Label, ValidationMessage } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { postSubscriber, SubscribeResult } from '@/libs/data/classifications/classificationData';
import { localization } from '@/libs/language/src/localization';
import styles from './subscribe.module.css';

export type Subscriber = {
  email: string;
  classificationId: number | undefined;
};

const SubscribeButton = ({ classificationId }: { classificationId: number | undefined }) => {
  const [inputValue, setInputValue] = useState('');
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [subscribeResult, setSubscribeResult] = useState<SubscribeResult | null>(null);

  const resetState = () => {
    setInputValue('');
    setSubscribeResult(null);
  };

  useEffect(() => {
    if (subscriber) {
      postSubscriber(subscriber)
        .then((result) => setSubscribeResult(result))
        .catch((error) => {
          console.error('Subscription failed', error);
        });
    }
  }, [subscriber]);

  const handleSubscription = (event: { preventDefault: () => void }) => {
    event?.preventDefault();
    setSubscriber({ email: inputValue, classificationId });
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>{localization.classification.subscribe}</Dialog.Trigger>
      <Dialog onClose={resetState}>
        <Field className={styles.field}>
          <Label weight='medium'>{localization.classification.subscribeInfo}</Label>
          <Input
            id='subscription-email'
            type='email'
            placeholder='Din e-postadresse'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSubscribeResult(null);
            }}
          />
          {subscribeResult && (
            <ValidationMessage data-color={subscribeResult.dataColor}>{subscribeResult.message}</ValidationMessage>
          )}
        </Field>
        <Button type='submit' id='subscribe-button' onClick={handleSubscription}>
          {localization.classification.subscribe}
        </Button>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export { SubscribeButton };
