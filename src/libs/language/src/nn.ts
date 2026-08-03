/**
 * Localized texts for Norwegian Nynorsk.
 *
 * Please maintain alphabetical order on variable name for ease of maintenance!
 */

import type { Translation } from './nb';

export const nn = {
  apiDocumentation: 'API-dokumentasjon',
  apiDocVardef: 'Variabeldefinisjonar',
  apiDocKlass: 'Klassifikasjonar',
  appTitle: 'SSB Dataportal',

  authentication: {
    logIn: 'Logg inn',
    logInSsbEmployee: 'Logg inn som SSB-tilsett',
    logOut: 'Logg ut',
    loginHeading: 'Innlogging',
    loginInfo:
      'Innlogging er kun tilgjengeleg for tilsette i Statistisk sentralbyrå. Du kan framleis bruke tenesta utan å logge inn.',
  },

  breadcrumbsLabel: 'Brødsmulesti',

  button: {
    removeFilter: 'Fjern alle filter',
  },

  by: 'av',

  classification: {
    about: {
      custodian: 'Ansvarleg',
      mail: 'E-post',
      validity: 'Gyldig', 
      publishedLanguages: 'Publiserte språk',
      basedOn: 'Basert på',
      legalBasis: 'Lovgrunnlag',
      publications: 'Publikasjonar',
      unitTypes: 'Einheitstypar',
      langEN: 'Engelsk',
      langNB: 'Bokmål',
      langNN: 'Nynorsk',
      levels: 'Nivå',
      number: 'Nummer',
      name: 'Namn',
      description: 'Skildring',
      changelog: 'Endringslogg',
      date: 'Dato',
      time: 'Klokkeslett',
      comment: 'Kommentar',
    },
    labelPlural: 'Klassifikasjonar',
    labelSingular: 'Klassifikasjon',
    label: 'Klassifikasjon',
    view: 'Sjå klassifikasjon',
    type: 'Type',
    codelist: 'Kodeliste',
    standard: 'Standard',
    codeListPrefix: 'Kodeliste for',
    standardPrefix: 'Standard for',
    emailPlaceholder: 'Di e-postadresse',
    subscribe: 'Abonner',
    subscription: 'Abonnement',
    subscribeMessageError: 'Det oppstod ein feil under registrering',
    subscribeMessageAlready: 'Du er allereie abonnent',
    subscribeConfirm: 'Stadfest abonnement',
    subscribeInfo: 'Abonner på oppdateringar for denne klassifikasjonen',
    subscribeMessageSuccess: 'Du vil motta ein e-post. Følg instruksjonane i e-posten for å starte abonnementet ditt.',
    subscribeMessageInvalidEmail: 'Skriv inn ei gyldig e-postadresse',
  },
  classificationDetails: {
    codes: 'Kodar',
    about: 'Om versjonen',
    changes: 'Endringar',
    versions: 'Versjonar',
    correspondences: 'Korrespondansar',
    variants: 'Variantar',
  },
  codeTree: {
    label: 'Kodeliste',
    expand: 'Vis underkodar for',
    collapse: 'Skjul underkodar for',
    selectCode: 'Vel kode',
    filterLabel: 'Filtrer på kode eller namn',
    filterPlaceholder: 'Filtrer på kode eller namn',
    filterButton: 'Filtrer',
    clearFilter: 'Fjern filter',
    expandAll: 'Opne alle',
    collapseAll: 'Lukk alle',
    codeColumn: 'Kode',
    nameColumn: 'Namn',
    back: 'Tilbake',
    subcodes: 'Opne underkodar',
    notesButtonLabel: 'Vis tilleggsinformasjon for',
  },
  codeSnippet: {
    codeExample: 'Kodeeksempel',
    daplaManual: 'Dapla-manualen',
    getVariableDefinition: 'Hent variabeldefinisjon med',
    linkToPyPiPackage: 'dapla-toolbelt-metadata (pypi.org)',
    daplaLab: 'Dapla Lab',
  },

  cookieBanner: {
    closeButtonLabel: 'Lukk knapp',
    label: 'Informasjonskapsel-kunngjering',
    message: 'Vi lagrar nødvendige informasjonskapslar som gjer at nettsida fungerer og er trygg.',
  },

  comment: 'Kommentar',

  contact: {
    fallbackTitle: 'Ta kontakt med spørsmål eller innspel',
    label: 'Kontakt',
  },

  context: 'Kontekst',

  copy: {
    code: 'Kopier kode',
    copied: 'Kopiert',
    id: 'Kopier ID',
    shortName: 'Kopier kortnamn',
    filePath: 'Kopier gs:// sti',
  },

  dataCoverageTimeline: {
    availableDataFileLabel: 'tilhøyrande datafil',
    availableDataFileLabelPlural: 'tilhøyrande datafiler',
    filePathLabel: 'Filsti',
    labelBimesterPrefix: 'B',
    labelFullYear: 'Heile',
    labelHalfYearPrefix: 'H',
    labelQuarterPrefix: 'K',
    labelTriannualPrefix: 'T',
    monthsShort: ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
    statusDataPresent: 'Data finst',
    statusMissingTargetSegment: 'Ingen fil med data for perioden',
    tooltipStatusDataPresent: 'Fil med data finst',
    tooltipStatusMissingTargetSegment: 'Ingen fil med data for perioden',
  },
  dataProductDetail: {
    dataProductFilters: 'Dataproduktfilter',
    dataset: 'Datasett',
  },
  datasetDetail: {
    aboutDataset: 'Om datasettet',
    dataProduct: 'Dataprodukt',
    bucket: 'Bøtte',
    datasetState: 'Datatilstand',
    assessment: 'Vurdering',
    responsible: 'Ansvarleg team',
    id: 'ID',
    namingStandardViolations: 'Tal på avvik frå namnestandard',
    dataFiles: 'Datafiler',
    dataCoverageTimeline: 'Tilgjengelege periodar',
    namingStandardViolationCountLabel: 'avvik frå namnestandard',
  },
  documentation: 'Dokumentasjon',

  editing: {
    created: 'Oppretta',
    updated: 'Sist oppdatert',
  },

  error: {
    classificationDetailsTabs: {
      notFoundCodes: 'Kodar ikkje funne',
      notFoundAboutClassification: 'Om klassifikasjonen ikkje funnen',
      notFoundChanges: 'Endringar ikkje funne',
      notFoundVersions: 'Versjonar ikkje funne',
      notFoundCorrespondences: 'Korrespondansar ikkje funne',
      notFoundVariants: 'Variantar ikkje funne',
    },
    somethingWentWrong: 'Beklagar, noko gjekk gale.',
    unauthorized: 'Beklagar, du har ikkje tilgang.',
    technicalProblemsTitle: 'Vi har tekniske problem',
    technicalProblemsMessage: 'Dette kjem ikkje av noko du gjorde. Vent litt og prøv igjen.',
    reloadPage: 'Last sida på nytt',
    goBack: 'Gå tilbake',
    goHome: 'Gå til framsida',
    helpTitle: 'Du kan prøve å:',
    helpReload: 'vente litt og laste sida på nytt',
    helpBack: 'gå tilbake til førre side',
    helpHome: 'gå til framsida',
    helpChangeFilters: 'endre søk eller filter',
    supportPrefix: 'Har problemet vart ei stund, kan du',
    supportLinkText: 'kontakte oss',
    brokenLinkMailSubject: 'Øydelagd lenkje i SSB Dataportal',
    brokenLinkMailBody: (path: string) =>
      [
        'Hei, eg vil melde frå om ei mogleg øydelagd lenkje i SSB Dataportal.',
        '',
        `Side: ${path}`,
        '',
        'Skildring av kva som ikkje fungerte:',
      ].join('\n'),
    notFoundHelpListClassificationDetails: [
      'sjekke at du har riktig klassifikasjon-id i lenkja',
      'gå til oversikta over klassifikasjonar',
      'gå til framsida',
    ],
    notFoundTitleClassificationDetails: 'Klassifikasjon ikkje funnen',
    notFoundMessageClassificationDetails:
      'Er det skrivefeil i lenkja? Eller har klassifikasjonen blitt sletta eller flytta?',
    notFoundTitle: 'Sida finst ikkje',
    notFoundMessage: 'Sida kan vere flytta, sletta eller lenkja kan vere feil.',
    notFoundTitleVariableDetails: 'Variabeldefinisjon ikkje funnen',
    notFoundMessageVariableDetails:
      'Er det skrivefeil i lenkja? Eller har variabeldefinisjonen blitt sletta eller flytta?',
    notFoundHelpListVariableDetails: [
      'sjekke at du har riktig variabeldefinisjon-kortnamn i lenkja',
      'gå til oversikta over variabeldefinisjonar',
      'gå til framsida',
    ],
    reportBrokenLink: 'Meld frå om øydelagd lenkje',
  },

  from: 'Frå',
  home: 'Heim',
  id: 'ID',

  info: {
    comingSoon: 'Kjem snart',
    classificationsPrototypeIntro: 'Under utvikling',
    classificationsPrototypeInfo:
      'Ei ny og forbetra vising av Klass blir lansert i løpet av 2026. Fram til lansering må du bruke dagens løysing på',
    datasetPrototypeIntro: 'Under utvikling',
    datasetPrototypeInfo:
      'Denne sida skildrar eit utval av data i SSB. Utviklinga held fram med fleire datatypar og meir detaljerte skildringar.',
    feedbackTitle: 'Del erfaringane dine!',
    feedbackBody: 'Vi jobbar kontinuerleg med å forbetre dataportalen, og du kan hjelpe oss ved å fylle ut',
    feedbackForm: 'tilbakemeldingsskjema for SSB Dataportal',
    footerAboutPage: 'Om nettstaden',
    footerContact: 'Kom i kontakt',
    footerAccessibilityStatement: 'Tilgjengelegheitserklæring',
    footerPrivacyStatement: 'Personvernerklæring',
    landingPageInfoGoal:
      'Målet er å gjere det enklare å finne, forstå og bruke SSB-data på ein korrekt og effektiv måte.',
    landingPageInfoGoalTitle: 'Kvifor SSB Dataportal?',
    landingPageInfoIntro: 'Her samlar vi informasjon om datasett, variablar, klassifikasjonar og API-ar på ein stad.',
    landingPageInfoIntroTitle: 'Kva er SSB Dataportal?',
    landingPageInfoPrototype:
      'I denne første versjonen kan du utforske SSBs variabeldefinisjonar. Portalen vil gradvis utvidast med oversikt over datasett, klassifikasjonar og API-ar, slik at du kan sjå heile samanhengen frå konsept til ferdig datafil. Ved å kople definisjonar frå Vardef med kodeverk frå Klass og dokumentasjon om datasett, etablerer vi ei "felles sanning" som sikrar at vi alltid tolkar og bruker dataa våre på same måte.',
    landingPagePrototypeTitle: 'Kontinuerleg forbetring',
    landingPageSubTitle: 'Di inngang til SSBs felles kunnskap om data',
    landingPageTitle: 'Velkomen til SSB Dataportal',
  },

  language: {
    label: 'Språk',
    nb: 'Norsk bokmål',
    nn: 'Norsk nynorsk',
    en: 'English',
  },

  loading: {
    filters: 'Lastar filter ...',
    results: 'Lastar resultat ...',
  },

  loadingVariableDefinitions: 'Lastar variabeldefinisjonar',
  migration: {
    header: 'Migrering av variabeldefinisjonar pågår',
    info: 'Vi er i gang med å flytte variabeldefinisjonar til SSB Dataportal. Inntil arbeidet er fullført vil noko innhald framleis ligge på den gamle sida.',
    linkText: 'Finn fleire variabeldefinisjonar på ssb.no',
  },
  navigateHome: 'Naviger til framsida',
  navigateHomeClassifications: 'Naviger til hovudsida Klassifikasjonar',
  navigateHomeVariableDefinitions: 'Naviger til hovudsida Variabeldefinisjonar',
  next: 'Neste',
  no: 'Nei',
  on: 'på',
  opensInNewTab: 'opnast i ny fane',

  owner: {
    daplaTeam: 'Dapla Team',
    groups: 'Grupper',
    label: 'Eigar',
  },

  pageTitle: {
    classifications: 'Klassifikasjoner',
    dataProducts: 'Dataprodukter',
    variableDefinitions: 'Variabeldefinisjonar',
  },

  previous: 'Førre',
  products: {
    assessment: {
      filterLabel: 'Verdivurdering',
      open: 'Open',
      protected: 'Skjerma',
      sensitive: 'Sensitiv',
      unknown: 'Ukjend verdivurdering',
    },
    datasetState: {
      processedData: 'Klargjorde data',
      outputData: 'Utdata',
      inputData: 'Inndata',
      statistics: 'Statistikk',
      sourceData: 'Kjeldedata',
      unknown: 'Ukjend datasettstatus',
    },
    other: 'Anna dataprodukt',
    statistic: 'Statistikkprodukt',
    typeFilterLabel: 'Dataprodukttype',
    unknown: 'Ukjend produkttype',
  },
  region: 'Region',
  references: 'Referansar',

  search: {
    hits: 'treff',
    label: 'Søk',
    noHits: 'Søket ditt ga ingen treff',
    variableDefinitions: 'Søketreff variabeldefinisjonar',
    classifications: 'Søketreff klassifikasjonar',
    dataProducts: 'Søketreff dataprodukter',
    datasets: 'Søketreff datasett',

    textFilter: {
      search: 'Søk',
      label: 'Filtrer på namn',
      tagLabel: 'Namn:',
      inputId: 'søk-input',
    },

    filter: {
      close: 'Lukk filter',
      label: 'Filter',
      filterAndSearch: 'Filter og søk',
      open: 'Opne filter',
    },

    sort: {
      label: 'Sortering',
      lastUpdatedFirst: 'Sist endra først',
      titleAlphabeticalAsc: 'Tittel A-Å',
      titleAlphabeticalDesc: 'Tittel Å-A',
    },
  },

  filterTag: {
    remove: 'Fjern',
    listLabel: 'Liste over valde filter',
    sectionLabel: 'Aktive søkjefilter',
  },

  ssbDataportal: 'SSB Dataportal',
  statisticsNorway: 'Statistisk sentralbyrå',

  status: {
    draft: 'Utkast',
    label: 'Status',
    publishedExternal: 'Publisert eksternt',
    publishedInternal: 'Publisert internt',
  },

  subjectArea: 'Statistikkområde',
  subjectFields: 'Statistikkområde',

  tabs: {
    ariaLabel: 'Navigasjon katalogar',
    classifications: 'Klassifikasjonar',
    dataProducts: 'Dataprodukter',
    variableDefinitions: 'Variabeldefinisjonar',
  },

  to: 'Til',
  unitTypes: 'Einingstypar',
  yes: 'Ja',

  validity: {
    label: 'Gyldigheit',
  },

  variableDefinition: {
    aboutVariable: 'Om variabelen',
    externalReference: 'Ekstern referanse',
    comment: 'Kommentar',
    contact: 'Kontakt',
    documentation: 'Dokumentasjon',
    externalPersonalData: 'Sensitive personopplysningar',
    fetchWith: 'Hent variabeldefinisjon med',
    id: 'ID',
    internalPersonalData: 'Inneheld særlege kategoriar av personopplysningar',
    labelPlural: 'Variabeldefinisjonar',
    labelSingular: 'Variabeldefinisjon',
    labelWithComment: 'Variabeldefinisjon med kommentar',
    mail: 'E-post',
    notFoundAlertText: 'Variabeldefinisjon ikkje funnen',
    owner: 'Eigar',
    unitTypeInfo:
      'Ein einingstype er typen objekt (einingar) det blir laga statistikk om, til dømes person, føretak og val',
    relevant: 'Relevante variabeldefinisjonar',
    shortName: 'Kortnamn',
    validFrom: 'Gyldig frå',
    validTo: 'Gyldig til',
    viewExternalReference: 'Sjå ekstern referanse',
    viewRelevant: 'Sjå relevant variabeldefinisjon',
  },
  versions: {
    name: 'Namn',
    validFrom: 'Gyldig frå',
    validTo: 'Gyldig til',
    now: 'No',
    tags: {
      isLatest: 'Gjeldande versjon:',
      validFrom: 'Gyldig frå og med',
      isNotCurrent: 'OBS! Dette er ikkje dagens versjon av klassifikasjonen',
    },
  },
} satisfies Translation;
