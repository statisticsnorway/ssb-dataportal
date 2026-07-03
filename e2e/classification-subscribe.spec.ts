import { expect, test } from './fixtures/classifications.fixture';
import classificationsMock from '@/static-data/classifications.json';
import { parseClassification, stripTitlePrefix } from '@/utils/classifications/classificationHelpers';
const classifications = classificationsMock.classifications;

// User wants to start new subscribtion
// User writes invalid email and user writes valid email and null email
// user retries after signing up in same session
// user retries after revisting explorer page
// User is already subscriber
