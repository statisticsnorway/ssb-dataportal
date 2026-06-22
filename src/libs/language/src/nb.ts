/**
 * This is the default language.
 *
 * It should be used as the reference for which strings are to be defined in the app.
 *
 * Please maintain alphabetical order on variable name for ease of maintenance!
 */

export const nb = {
  datasetDetail: {
    aboutDataset: 'Om datasettet',
    dataProduct: 'Dataprodukt',
    bucket: 'Bøtte',
    datasetState: 'Datatilstand',
    assessment: 'Vurdering',
    responsible: 'Ansvarlig team',
    id: 'ID',
    namingStandardViolations: 'Antall navnestandardavvik',
    dataFiles: 'Datafiler',
    dataCoverageTimeline: 'Tilgjengelige perioder',
    namingStandardViolationCountLabel: 'navnestandardavvik',
  },
  apiDocumentation: 'API-dokumentasjon',
  apiDocVardef: 'Variabeldefinisjoner',
  apiDocKlass: 'Klassifikasjoner',
  appTitle: 'SSB Dataportal',

  authentication: {
    logIn: 'Logg inn',
    logInSsbEmployee: 'Logg inn som SSB ansatt',
    logOut: 'Logg ut',
    loginHeading: 'Innlogging',
    loginInfo:
      'Innlogging er kun tilgjengelig for ansatte i Statistisk sentralbyrå. Du kan fortsatt bruke tjenesten uten å logge inn.',
  },

  breadcrumbsLabel: 'Brødsmulesti',

  button: {
    removeFilter: 'Fjern alle filter',
  },

  by: 'av',

  classification: {
    label: 'Klassifikasjon',
    view: 'Se klassifikasjon',
    type: 'Type',
    codelist: 'Kodeliste',
  },
  codeSnippet: {
    codeExample: 'Kodeeksempel',
    daplaManual: 'Dapla-manualen',
    getVariableDefinition: 'Hent variabeldefinisjon med',
    linkToPyPiPackage: 'dapla-toolbelt-metadata (pypi.org)',
    daplaLab: 'Dapla Lab',
  },

  comment: 'Kommentar',

  contact: {
    fallbackTitle: 'Ta kontakt med spørsmål eller innspill',
    label: 'Kontakt',
  },

  context: 'Kontekst',

  copy: {
    code: 'Kopier kode',
    copied: 'Kopiert',
    id: 'Kopier ID',
    shortName: 'Kopier kortnavn',
  },

  dataCoverageTimeline: {
    availableDatasetsLabel: 'Tilgjengelige datasett',
    filePathLabel: 'Filsti',
    labelBimesterPrefix: 'B',
    labelFullYear: 'Årlig',
    labelHalfYearPrefix: 'H',
    labelQuarterPrefix: 'K',
    labelTriannualPrefix: 'T',
    monthsShort: ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
    statusDataPresent: 'Data finnes',
    statusMissingTargetSegment: 'Ingen fil med data for perioden',
    tooltipStatusDataPresent: 'Fil med data finnes',
    tooltipStatusMissingTargetSegment: 'Ingen fil med data for perioden',
  },
  dataProductDetail: {
    dataProductFilters: 'Dataproduktfiltre',
    dataset: 'Datasett',
  },
  documentation: 'Dokumentasjon',

  editing: {
    created: 'Opprettet',
    updated: 'Sist oppdatert',
  },

  error: {
    somethingWentWrong: 'Beklager, noe gikk galt.',
    unauthorized: 'Beklager, du har ikke tilgang.',
    technicalProblemsTitle: 'Vi har tekniske problemer',
    technicalProblemsMessage: 'Dette skyldes ikke noe du gjorde. Vent litt og prøv igjen.',
    reloadPage: 'Last siden på nytt',
    goBack: 'Gå tilbake',
    goHome: 'Gå til forsiden',
    helpTitle: 'Du kan prøve å:',
    helpReload: 'vente litt og laste siden på nytt',
    helpBack: 'gå tilbake til forrige side',
    helpHome: 'gå til forsiden',
    helpChangeFilters: 'endre søk eller filtre',
    supportPrefix: 'Har problemet vart en stund, kan du',
    supportLinkText: 'kontakte oss',
    brokenLinkMailSubject: 'Ødelagt lenke i SSB dataportal',
    brokenLinkMailBody: (path: string) =>
      [
        'Hei, jeg vil melde fra om en mulig ødelagt lenke i SSB Dataportal.',
        '',
        `Side: ${path}`,
        '',
        'Beskrivelse av hva som ikke fungerte:',
      ].join('\n'),
    notFoundTitle: 'Siden finnes ikke',
    notFoundMessage: 'Siden kan være flyttet, slettet eller lenken kan være feil.',
    notFoundTitleVariableDetails: 'Variabeldefinisjon ikke funnet',
    notFoundMessageVariableDetails:
      'Er det skrivefeil i lenken? Eller har variabeldefinisjonen blitt slettet eller flyttet?',
    notFoundHelpListVariableDetails: [
      'sjekke at du har riktig variabeldefinisjon-kortnavn i lenken',
      'gå til oversikten over variabeldefinisjoner',
      'gå til forsiden',
    ],
    reportBrokenLink: 'Meld fra om ødelagt lenke',
  },

  from: 'Fra',
  home: 'Hjem',
  id: 'ID',

  info: {
    comingSoon: 'Kommer snart',
    classificationsPrototypeIntro: 'Under utvikling',
    classificationsPrototypeInfo:
      'En ny og forbedret visning av Klass lanseres ila 2026. Frem til lansering må du bruke dagens løsning på',
    datasetPrototypeIntro: 'Under utvikling',
    datasetProtoypeInfo:
      'Denne siden beskriver et utvalg av data i SSB. Utvikling fortsetter med flere typer data og mer detaljerte beskrivelser.',
    feedbackTitle: 'Del dine erfaringer!',
    feedbackBody: 'Vi jobber kontinuerlig med å forbedre dataportalen og du kan hjelpe oss ved å fylle ut',
    feedBackForm: 'tilbakemeldingsskjema for SSB Dataportal',
    footerAboutPage: 'Om nettstedet',
    footerContact: 'Kom i kontakt',
    footerAccessibilityStatement: 'Tilgjengelighetserklæring',
    footerPrivacyStatement: 'Personvernerklæring',
    landingPageInfoGoal:
      'Målet er å gjøre det enklere å finne, forstå og bruke SSBs data på en korrekt og effektiv måte.',
    landingPageInfoGoalTitle: 'Hvorfor SSB Dataportal?',
    landingPageInfoIntro: 'Her samler vi informasjon om våre datasett, variabler, kodeverk og API-er på ett sted.',
    landingPageInfoIntroTitle: 'Hva er SSB Dataportal?',
    landingPageInfoPrototype:
      'I denne første versjonen kan du utforske SSBs variabeldefinisjoner. Portalen vil gradvis utvides med oversikt over datasett, kodeverk og API-er, slik at du kan se hele sammenhengen fra konsept til ferdig datafil. Ved å koble definisjoner fra Vardef med kodeverk fra Klass og dokumentasjon om datasett, etablerer vi en "felles sannhet" som sikrer at vi alltid tolker og bruker dataene våre på samme måte.',
    landingPagePrototypeTitle: 'Kontinuerlig forbedring',
    landingPageSubTitle: 'Din inngang til SSBs felles kunnskap om data',
    landingPageTitle: 'Velkommen til SSB Dataportal',
  },

  loading: {
    filters: 'Laster filtere...',
    results: 'Laster resultater...',
  },

  loadingVariableDefinitions: 'Laster variabeldefinisjoner',
  migration: {
    header: 'Migrering av variabeldefinisjoner pågår',
    info: 'Vi er i gang med å flytte variabeldefinisjoner til SSB Dataportal. Inntil arbeidet er fullført vil noe innhold fortsatt ligge på den gamle siden.',
    linkText: 'Finn flere variabeldefinisjoner på ssb.no',
  },
  navigateHome: 'Naviger til hjemmesiden',
  navigateHomeClassifications: 'Naviger til hovedside Klassifikasjoner',
  navigateHomeVariableDefinitions: 'Naviger til hovedside Variabeldefinisjoner',
  next: 'Neste',
  no: 'Nei',
  on: 'på',
  opensInNewTab: 'åpnes i ny fane',

  owner: {
    daplaTeam: 'Dapla Team',
    groups: 'Grupper',
    label: 'Eier',
  },

  pageTitle: {
    classifications: 'Kodeverk',
    dataProducts: 'Dataprodukter',
    variableDefinitions: 'Variabeldefinisjoner',
  },

  previous: 'Forrige',
  products: {
    assessment: {
      filterLabel: 'Verdivurdering',
      open: 'Åpen',
      protected: 'Beskyttet',
      sensitive: 'Sensitiv',
      unknown: 'Ukjent verdivurdering',
    },
    datasetState: {
      processedData: 'Klargjorte data',
      outputData: 'Utdata',
      inputData: 'Inndata',
      statistics: 'Statistikk',
      sourceData: 'Kildedata',
      unknown: 'Ukjent datasettstatus',
    },
    other: 'Annen dataprodukt',
    statistic: 'Statistikkprodukt',
    typeFilterLabel: 'Dataprodukttype',
    unknown: 'Ukjent produkttype',
  },
  region: 'Region',
  references: 'Referanser',

  search: {
    hits: 'treff',
    label: 'Søk',
    noHits: 'Ditt søk ga ingen treff',
    variableDefinitions: 'Søketreff variabeldefinisjoner',
    classifications: 'Søketreff klassifikasjoner',
    dataProducts: 'Søketreff dataprodukter',
    datasets: 'Søketreff datasett',

    textFilter: {
      search: 'Søk',
      label: 'Filtrer på navn',
      tagLabel: 'Navn:',
      inputId: 'søk-input',
    },

    filter: {
      close: 'Lukk filter',
      label: 'Filter',
      filterAndSearch: 'Filter og søk',
      open: 'Åpne filter',
    },

    sort: {
      label: 'Sortering',
      lastUpdatedFirst: 'Sist endret først',
      titleAlphabeticalAsc: 'Tittel A-Å',
      titleAlphabeticalDesc: 'Tittel Å-A',
    },
  },

  filterTag: {
    remove: 'Fjern',
    listLabel: 'Liste over valgte filter',
    sectionLabel: 'Aktive søkefilter',
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
  subjectFields: 'Statistikkområder',

  tabs: {
    ariaLabel: 'Navigasjon kataloger',
    classifications: 'Klassifikasjoner',
    dataProducts: 'Dataprodukter',
    variableDefinitions: 'Variabeldefinisjoner',
  },

  to: 'Til',
  unitTypes: 'Enhetstyper',
  yes: 'Ja',

  validity: {
    label: 'Gyldighet',
  },

  // Labels specific to variable definitions
  variableDefinition: {
    aboutVariable: 'Om variabelen',
    externalReference: 'Ekstern referanse',
    comment: 'Kommentar',
    contact: 'Kontakt',
    documentation: 'Dokumentasjon',
    externalPersonalData: 'Sensitive personopplysninger',
    fetchWith: 'Hent variabeldefinisjon med',
    id: 'ID',
    internalPersonalData: 'Inneholder særlige kategorier av personopplysninger',
    labelPlural: 'Variabeldefinisjoner',
    labelSingular: 'Variabeldefinisjon',
    labelWithComment: 'Variabeldefinisjon med kommentar',
    mail: 'Mail',
    notFoundAlertText: 'Variabeldefinisjon ikke funnet',
    owner: 'Eier',
    unitTypeInfo:
      'En enhetstype er typen av objekter (enheter) som det lages statistikk om, f.eks. person, foretak og valg',
    relevant: 'Relevante variabeldefinisjoner',
    shortName: 'Kortnavn',
    validFrom: 'Gyldig fra',
    validTo: 'Gyldig til',
    viewExternalReference: 'Se ekstern referanse',
    viewRelevant: 'Se relevant variabeldefinisjon',
  },
};
