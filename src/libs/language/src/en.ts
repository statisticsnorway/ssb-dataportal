/**
 * Localized texts for the English language.
 *
 * We follow American (en-us) language conventions.
 *
 * Please maintain alphabetical order on variable name for ease of maintenance!
 */

import type { Translation } from './nb';

export const en = {
  apiDocumentation: 'API documentation',
  apiDocVardef: 'Variable definitions',
  apiDocKlass: 'Classifications',
  appTitle: 'SSB Dataportal',

  authentication: {
    logIn: 'Log in',
    logInSsbEmployee: 'Log in as Statistics Norway employee',
    logOut: 'Log out',
    loginHeading: 'Login',
    loginInfo:
      'Login is only available to employees at Statistics Norway. You can still use the service without logging in.',
  },

  breadcrumbsLabel: 'Breadcrumbs',

  button: {
    removeFilter: 'Clear filters',
  },

  by: 'by',

  classification: {
    about: {
      custodian: 'Maintainer',
      mail: 'Mail',
      validity: 'Valid from',
      publishedLanguages: 'Published languages',
      basedOn: 'Based on',
      langEN: 'English',
      langNB: 'Norwegian (Bokmål)',
      langNN: 'Norwegian (Nynorsk)',
      legalBasis: 'Legal basis',
      publications: 'Publications',
      unitTypes: 'Unit types',
      levels: 'Levels',
      noChanges: 'No changes',
      notRelevant: 'Not relevant',
      number: 'Number',
      name: 'Name',
      description: 'Description',
      changelog: 'Changelog',
      date: 'Date',
      time: 'Time',
      comment: 'Comment',
    },
    labelPlural: 'Classifications',
    labelSingular: 'Classification',
    label: 'Classification',
    view: 'View classification',
    type: 'Type',
    codelist: 'Codelist',
    standard: 'Classification',
    codeListPrefix: 'Codelist for',
    standardPrefix: 'Classification of',
    emailPlaceholder: 'Your email address',
    subscribe: 'Subscribe',
    subscription: 'Subscription',
    subscribeMessageError: 'An error occurred during registration',
    subscribeMessageAlready: 'You are already subscribed',
    subscribeConfirm: 'Confirm subscription',
    subscribeInfo: 'Subscribe to updates for this classification',
    subscribeMessageSuccess:
      'You will receive an email. Follow the instructions in the email to start your subscription.',
    subscribeMessageInvalidEmail: 'Enter a valid email address',
  },
  classificationDetails: {
    codes: 'Codes',
    about: 'About this version',
    changes: 'Changes',
    versions: 'Versions',
    correspondences: 'Correspondences',
    variants: 'Variants',
  },
  codeTree: {
    label: 'Code list',
    expand: 'Show subcodes for',
    collapse: 'Hide subcodes for',
    selectCode: 'Select code',
    filterLabel: 'Filter by code or name',
    filterPlaceholder: 'Filter by code or name',
    filterButton: 'Filter',
    clearFilter: 'Clear filter',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    codeColumn: 'Code',
    nameColumn: 'Name',
    back: 'Back',
    subcodes: 'Open subcodes',
    notesButtonLabel: 'Show additional information for',
  },
  codeSnippet: {
    codeExample: 'Example code',
    daplaManual: 'Dapla manual',
    getVariableDefinition: 'Get variable definition with',
    linkToPyPiPackage: 'dapla-toolbelt-metadata (pypi.org)',
    daplaLab: 'Dapla Lab',
  },

  cookieBanner: {
    closeButtonLabel: 'Close button',
    label: 'Cookie banner',
    message: 'We store cookies necessary to keep the website working and secure.',
  },

  comment: 'Comment',

  contact: {
    fallbackTitle: 'Contact us with questions or feedback',
    label: 'Contact',
  },

  context: 'Context',

  copy: {
    code: 'Copy code',
    copied: 'Copied',
    id: 'Copy ID',
    shortName: 'Copy short name',
    filePath: 'Copy gs:// path',
  },

  dataCoverageTimeline: {
    availableDataFileLabel: 'related data file',
    availableDataFileLabelPlural: 'related data files',
    filePathLabel: 'File path',
    labelBimesterPrefix: 'B',
    labelFullYear: 'Full year',
    labelHalfYearPrefix: 'H',
    labelQuarterPrefix: 'Q',
    labelTriannualPrefix: 'T',
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    statusDataPresent: 'Data available',
    statusMissingTargetSegment: 'No file with data for this period',
    tooltipStatusDataPresent: 'Data file exists',
    tooltipStatusMissingTargetSegment: 'No file with data for this period',
  },
  dataProductDetail: {
    dataProductFilters: 'Data product filters',
    dataset: 'Dataset',
  },
  datasetDetail: {
    aboutDataset: 'About dataset',
    dataProduct: 'Data product',
    bucket: 'Bucket',
    datasetState: 'Dataset state',
    assessment: 'Assessment',
    responsible: 'Responsible team',
    id: 'ID',
    namingStandardViolations: 'Number of naming standard violations',
    dataFiles: 'Data files',
    dataCoverageTimeline: 'Available periods',
    namingStandardViolationCountLabel: 'naming standard violations',
  },
  documentation: 'Documentation',

  editing: {
    created: 'Created',
    updated: 'Last updated',
  },

  error: {
    classificationDetailsTabs: {
      notFoundCodes: 'Codes not found',
      notFoundAboutClassification: 'About classification not found',
      notFoundChanges: 'Changes not found',
      notFoundVersions: 'Versions not found',
      notFoundCorrespondences: 'Correspondences not found',
      notFoundVariants: 'Variants not found',
    },
    somethingWentWrong: 'Sorry, something went wrong.',
    unauthorized: 'Sorry, you do not have access.',
    technicalProblemsTitle: 'We are experiencing technical problems',
    technicalProblemsMessage: 'This is not caused by anything you did. Wait a moment and try again.',
    reloadPage: 'Reload page',
    goBack: 'Go back',
    goHome: 'Go to home page',
    helpTitle: 'You can try to:',
    helpReload: 'wait a little and reload the page',
    helpBack: 'go back to the previous page',
    helpHome: 'go to the home page',
    helpChangeFilters: 'change search or filters',
    supportPrefix: 'If the problem has persisted for a while, you can',
    supportLinkText: 'contact us',
    brokenLinkMailSubject: 'Broken link in SSB Dataportal',
    brokenLinkMailBody: (path: string) =>
      [
        'Hi, I want to report a possible broken link in SSB Dataportal.',
        '',
        `Page: ${path}`,
        '',
        'Description of what did not work:',
      ].join('\n'),
    notFoundHelpListClassificationDetails: [
      'check that you have the correct classification ID in the URL',
      'go to the classification overview',
      'go to the home page',
    ],
    notFoundTitleClassificationDetails: 'Classification not found',
    notFoundMessageClassificationDetails:
      'Is there a typo in the URL? Or has the classification been deleted or moved?',
    notFoundTitle: 'Page not found',
    notFoundMessage: 'The page may have been moved, deleted, or the URL may be incorrect.',
    notFoundTitleVariableDetails: 'Variable definition not found',
    notFoundMessageVariableDetails: 'Is there a typo in the URL? Or has the variable definition been deleted or moved?',
    notFoundHelpListVariableDetails: [
      'check that you have the correct variable definition short name in the URL',
      'go to the variable definition overview',
      'go to the home page',
    ],
    reportBrokenLink: 'Report broken link',
  },

  from: 'From',
  home: 'Home',
  id: 'ID',

  info: {
    comingSoon: 'Coming soon',
    classificationsPrototypeIntro: 'Under development',
    classificationsPrototypeInfo:
      'A new and improved view of Klass will be launched during 2026. Until launch, use the current solution at',
    datasetPrototypeIntro: 'Under development',
    datasetPrototypeInfo:
      'This page describes a selection of data at Statistics Norway. Development continues with more data types and more detailed descriptions.',
    feedbackTitle: 'Share your experience!',
    feedbackBody: 'We continuously work to improve the Dataportal, and you can help us by filling out the',
    feedbackForm: 'feedback form for the SSB Dataportal',
    footerAboutPage: 'About the website',
    footerContact: 'Get in touch',
    footerAccessibilityStatement: 'Accessibility statement',
    footerPrivacyStatement: 'Privacy statement',
    landingPageInfoGoal:
      "The goal is to make it easier to find, understand, and use Statistics Norway's data correctly and efficiently.",
    landingPageInfoGoalTitle: 'Why SSB Dataportal?',
    landingPageInfoIntro:
      'Here we gather information about our datasets, variables, classifications, and APIs in one place.',
    landingPageInfoIntroTitle: 'What is SSB Dataportal?',
    landingPageInfoPrototype:
      'In this first version, you can explore Statistics Norway\'s variable definitions. The portal will gradually expand with an overview of datasets, code sets, and APIs, so you can see the full context from concept to finished data file. By linking definitions from Vardef with code sets from Klass and dataset documentation, we establish a "single source of truth" to ensure that we always interpret and use our data in the same way.',
    landingPagePrototypeTitle: 'Continuous improvement',
    landingPageSubTitle: "Your gateway to Statistics Norway's public data",
    landingPageTitle: 'Welcome to SSB Dataportal',
  },

  language: {
    label: 'Language',
    nb: 'Norsk bokmål',
    nn: 'Norsk nynorsk',
    en: 'English',
  },

  loading: {
    filters: 'Loading filters...',
    results: 'Loading results...',
  },

  loadingVariableDefinitions: 'Loading variable definitions',
  migration: {
    header: 'Migration of variable definitions in progress',
    info: 'We are moving variable definitions to SSB Dataportal. Until the work is complete, some content will still be on the old site.',
    linkText: 'Find more variable definitions on ssb.no',
  },
  navigateHome: 'Navigate to home page',
  navigateHomeClassifications: 'Navigate to Classifications main page',
  navigateHomeVariableDefinitions: 'Navigate to Variable definitions main page',
  next: 'Next',
  no: 'No',
  on: 'on',
  opensInNewTab: 'opens in a new tab',

  owner: {
    daplaTeam: 'Dapla Team',
    groups: 'Groups',
    label: 'Owner',
  },

  pageTitle: {
    classifications: 'Classifications',
    dataProducts: 'Data products',
    variableDefinitions: 'Variable definitions',
  },

  previous: 'Previous',
  products: {
    assessment: {
      filterLabel: 'Value assessment',
      open: 'Open',
      protected: 'Protected',
      sensitive: 'Sensitive',
      unknown: 'Unknown value assessment',
    },
    datasetState: {
      processedData: 'Processed data',
      outputData: 'Output data',
      inputData: 'Input data',
      statistics: 'Statistics',
      sourceData: 'Source data',
      unknown: 'Unknown dataset state',
    },
    other: 'Other data product',
    statistic: 'Statistical product',
    typeFilterLabel: 'Data product type',
    unknown: 'Unknown product type',
  },
  region: 'Region',
  references: 'References',

  search: {
    hits: 'hits',
    label: 'Search',
    noHits: 'Your search returned no hits',
    variableDefinitions: 'Variable definition search hits',
    classifications: 'Classification search hits',
    dataProducts: 'Data product search hits',
    datasets: 'Dataset search hits',

    textFilter: {
      search: 'Search',
      label: 'Filter by name',
      tagLabel: 'Name:',
      inputId: 'search-input',
    },

    filter: {
      close: 'Close filter',
      label: 'Filter',
      filterAndSearch: 'Filter and search',
      open: 'Open filter',
    },

    sort: {
      label: 'Sorting',
      lastUpdatedFirst: 'Last updated first',
      titleAlphabeticalAsc: 'Title A-Z',
      titleAlphabeticalDesc: 'Title Z-A',
    },
  },

  filterTag: {
    remove: 'Remove',
    listLabel: 'List of selected filters',
    sectionLabel: 'Active search filters',
  },

  ssbDataportal: 'SSB Dataportal',
  statisticsNorway: 'Statistics Norway',

  status: {
    draft: 'Draft',
    label: 'Status',
    publishedExternal: 'Published externally',
    publishedInternal: 'Published internally',
  },

  subjectArea: 'Subject area',
  subjectFields: 'Subject areas',

  tabs: {
    ariaLabel: 'Catalog navigation',
    classifications: 'Classifications',
    dataProducts: 'Data products',
    variableDefinitions: 'Variable definitions',
  },

  to: 'To',
  unitTypes: 'Unit types',
  yes: 'Yes',

  validity: {
    label: 'Validity',
  },

  variableDefinition: {
    aboutVariable: 'About the variable',
    externalReference: 'External reference',
    comment: 'Comment',
    contact: 'Contact',
    documentation: 'Documentation',
    externalPersonalData: 'Sensitive personal data',
    fetchWith: 'Get variable definition with',
    id: 'ID',
    internalPersonalData: 'Contains special categories of personal data',
    labelPlural: 'Variable definitions',
    labelSingular: 'Variable definition',
    labelWithComment: 'Variable definition with comment',
    mail: 'Email',
    notFoundAlertText: 'Variable definition not found',
    owner: 'Owner',
    unitTypeInfo:
      'A unit type is the type of objects (units) that statistics are produced for, for example person, enterprise, and election',
    relevant: 'Relevant variable definitions',
    shortName: 'Short name',
    validFrom: 'Valid from',
    validTo: 'Valid to',
    viewExternalReference: 'View external reference',
    viewRelevant: 'View relevant variable definition',
  },
  versions: {
    name: 'Name',
    validFrom: 'Valid from',
    validTo: 'Valid to',
    now: 'Now',
    tags: {
      isLatest: 'Current version:',
      validFrom: 'Valid from and including',
      isNotCurrent: 'This is not the current version of the classification',
    },
  },
} satisfies Translation;
