import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import subscribersMock from '@/static-data/subscribers.json';
import { SubscribeStatus } from '@/types/subscription';
import { postSubscriber } from './subscriptionData';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterEach(() => {
  vi.unstubAllEnvs();
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
});
describe('postSubscriber', () => {
  const subscriber = { email: 'test@ssb.no', classificationId: 1 };

  it('returns Created when static data and email is new', async () => {
    vi.stubEnv('KLASS_SUBSCRIBER_USE_STATIC_DATA', 'true');

    const result = await postSubscriber({ email: 'new@ssb.no', classificationId: 1 });
    expect(result.code).toBe(SubscribeStatus.Created);
    vi.unstubAllEnvs();
  });
  it('returns Exists when static data and email already subscribed', async () => {
    vi.stubEnv('KLASS_SUBSCRIBER_USE_STATIC_DATA', 'true');

    const existingSubscriber = subscribersMock[0];
    expect(existingSubscriber).toBeDefined();

    const result = await postSubscriber({
      email: existingSubscriber!.email,
      classificationId: existingSubscriber!.classificationId,
    });
    expect(result.code).toBe(SubscribeStatus.Exists);
    vi.unstubAllEnvs();
  });

  it('returns Created on successful API call', async () => {
    vi.stubEnv('KLASS_BASE_PATH', 'https://klass.example.com/api/klass/v1');
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 201 }));

    const result = await postSubscriber(subscriber);
    expect(result.code).toBe(SubscribeStatus.Created);
    vi.unstubAllEnvs();
  });

  it('returns Exists on 400 with Exists code', async () => {
    vi.stubEnv('KLASS_BASE_PATH', 'https://klass.example.com/api/klass/v1');
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ code: SubscribeStatus.Exists }), { status: 400 }),
    );

    const result = await postSubscriber(subscriber);
    expect(result.code).toBe(SubscribeStatus.Exists);
    vi.unstubAllEnvs();
  });

  it('returns Error on 500', async () => {
    vi.stubEnv('KLASS_BASE_PATH', 'https://klass.example.com/api/klass/v1');
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

    const result = await postSubscriber(subscriber);
    expect(result.code).toBe(SubscribeStatus.Error);
    vi.unstubAllEnvs();
  });

  it('returns Error on other non-ok status', async () => {
    vi.stubEnv('KLASS_BASE_PATH', 'https://klass.example.com/api/klass/v1');
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 404 }));

    const result = await postSubscriber(subscriber);
    expect(result.code).toBe(SubscribeStatus.Error);
    vi.unstubAllEnvs();
  });

  it('rethrows on unexpected error', async () => {
    vi.stubEnv('KLASS_BASE_PATH', 'https://klass.example.com/api/klass/v1');
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network failure'));

    await expect(postSubscriber(subscriber)).rejects.toThrow('Network failure');
    vi.unstubAllEnvs();
  });

  it('returns Error when KLASS_BASE_PATH is not configured', async () => {
    delete process.env.KLASS_BASE_PATH;

    const result = await postSubscriber(subscriber);
    expect(result.code).toBe(SubscribeStatus.Error);
    vi.unstubAllEnvs();
  });
});
