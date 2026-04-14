export function getUserAgent(): string {
  return `${getAppName()}/${getAppVersion()} (${getContactEmailAddress()})`;
}

export function getAppName(): string | undefined {
  return process.env.appName;
}

export function getAppVersion(): string | undefined {
  return process.env.appVersion;
}

export function getContactEmailAddress(): string | undefined {
  return process.env.CONTACT_EMAIL_ADDRESS;
}
