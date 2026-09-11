type VersionValidityRange = {
  validFrom?: Date;
  validTo?: Date;
};

function toDayStartTimestamp(date: Date): number {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate.getTime();
}

export function isVersionValidOnDate(version: VersionValidityRange, targetDate: Date): boolean {
  if (!version.validFrom) {
    return false;
  }

  const validFrom = toDayStartTimestamp(version.validFrom);
  const validTo = version.validTo ? toDayStartTimestamp(version.validTo) : undefined;
  const target = toDayStartTimestamp(targetDate);

  if (validFrom > target) {
    return false;
  }

  return validTo === undefined || validTo >= target;
}

export function resolveDefaultVersion<T extends VersionValidityRange>(versions: T[], targetDate: Date): T | null {
  const sortedByValidFromDesc = [...versions].sort(
    (a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0),
  );

  const validOnTargetDate = sortedByValidFromDesc.find((version) => isVersionValidOnDate(version, targetDate));
  if (validOnTargetDate) {
    return validOnTargetDate;
  }

  const target = toDayStartTimestamp(targetDate);
  const latestBeforeTargetDate = sortedByValidFromDesc.find((version) => {
    if (!version.validFrom) {
      return false;
    }

    return toDayStartTimestamp(version.validFrom) < target;
  });

  return latestBeforeTargetDate ?? sortedByValidFromDesc[0] ?? null;
}
