import { type Subscriber, SubscribeStatus, ValidationMessageColors } from '@/types/subscription';

export async function postSubscriber(_subscriber: Subscriber) {
  return {
    code: SubscribeStatus.Created,
    message: '',
    dataColor: ValidationMessageColors.Success,
  };
}
