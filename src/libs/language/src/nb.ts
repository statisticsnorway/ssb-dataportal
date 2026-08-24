/**
 * This is the default language.
 *
 * It should be used as the reference for which strings are to be defined in the app.
 *
 * Please maintain alphabetical order on variable name for ease of maintenance!
 */

export const nb = {
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
    about: {
      custodian: 'Ansvarlig',
      mail: 'E-post',
      validity: 'Gyldig fra',
      publishedLanguages: 'Publiserte språk',
      basedOn: 'Basert på',
      langEN: 'Engelsk',
      langNB: 'Bokmål',
      langNN: 'Nynorsk',
      legalBasis: 'Lovhjemmel',
      publications: 'Publikasjoner',
      unitTypes: 'Enhetstyper',
      levels: 'Nivåer',
      number: 'Nummer',
      name: 'Navn',
      notRelevant: 'Ikke relevant',
      noChanges: 'Ingen beskrivelser i endringsloggen.',
      description: 'Beskrivelse',
      changelog: 'Endringslogg',
      date: 'Dato',
      time: 'Klokkeslett',
      comment: 'Kommentar',
    },
    labelPlural: 'Klassifikasjoner',
    labelSingular: 'Klassifikasjon',
    label: 'Klassifikasjon',
    language: {
      notSelectedLanguage: 'Denne klassifikasjonen er ikke tilgjengelig på valgt språk',
      displayedInLanguage: 'Denne klassifikasjonen viser innhold på {language}',
    },
    view: 'Se klassifikasjon',
    type: 'Type',
    codelist: 'Kodeliste',
    standard: 'Standard',
    codeListPrefix: 'Kodeliste for',
    standardPrefix: 'Standard for',
    emailPlaceholder: 'Din e-postadresse',
    subscribe: 'Abonner',
    subscribeMessageError: 'Det oppstod en feil under registering',
    subscribeMessageAlready: 'Du er allerede abonnent',
    subscribeSubmit: 'Send inn',
    subscribeInfo: 'Abonner på oppdateringer for denne klassifikasjonen',
    subscribeMessageSuccess: 'Du vil motta en mail. Følg instruksjonene i mailen for å starte ditt abonnement.',
    subscribeMessageInvalidEmail: 'Skriv inn en gyldig e-postadresse',
    download: {
      button: 'Last ned',
      formatLabel: 'Format',
      languageLabel: 'Språk',
      copyLink: 'Kopier lenke',
      linkCopied: 'Lenke kopiert.',
      confirm: 'Last ned fil',
      inProgress: 'Laster ned ...',
      error: 'Kunne ikke laste ned filen. Prøv igjen.',
    },
    correspondence: {
      heading: 'Korrespondanser',
      info: 'Korrespondansetabeller viser sammenhengen mellom to ulike kodeverk.',
      none: 'Denne versjonen har ingen korrespondanser',
      from: 'Korrespondanser fra',
      fromLevel: 'Nivå',
      to: 'Korrespondanser til',
      toLevel: 'Nivå',
      owner: 'Eier',
      id: 'ID',
      ownerSection: 'Eierseksjon',
      responsible: 'Ansvarlig',
      codeSummary:
        'Korrespondansen kobler {sourceCount} koder fra «{sourceName}» til {targetCount} koder fra «{targetName}».',
      tableLabel: 'Korrespondansetabell',
      noTarget: 'Ingen tilsvarende kode',
    },
    variant: {
      name: 'Navn',
      id: 'ID',
      description: 'Beskrivelse',
      responsible: 'Ansvarlig',
      owner: 'Eier',
      ownerSection: 'Eierseksjon',
      validFrom: 'Gyldig fra og med',
      noVariants: 'Denne versjonen har ingen varianter',
      variantHeading: 'Varianter',
      variantInfo:
        'En variant baserer seg på en klassifikasjonsversjon, og representerer en alternativ gruppering av denne (grupperingen KAN gå på tvers av strukturen i den opprinnelige klassifikasjonen). Varianter brukes ofte for å oppfylle krav til spesifikke statistikker, f.eks. brukes en variant av Standard for næringsgruppering for å lage Miljøregnskap.',
    },
  },
  classificationDetails: {
    codes: 'Koder',
    details: 'Detaljer',
    changes: 'Endringer',
    versions: 'Velg versjon',
    correspondences: 'Korrespondanser',
    variants: 'Varianter',
  },
  codeTree: {
    label: 'Kodeliste',
    expand: 'Vis underkoder for',
    collapse: 'Skjul underkoder for',
    selectCode: 'Velg kode',
    filterLabel: 'Filtrer på kode eller navn',
    filterPlaceholder: 'Filtrer på kode eller navn',
    filterButton: 'Filtrer',
    clearFilter: 'Fjern filter',
    expandAll: 'Åpne alle',
    collapseAll: 'Lukk alle',
    codeColumn: 'Kode',
    nameColumn: 'Navn',
    back: 'Tilbake',
    subcodes: 'Åpne underkoder',
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
    label: 'Informasjonskaplser kunngjøring',
    message: 'Vi lagrer nødvendige informasjonskapsler som gjør at nettsiden fungerer og er trygg.',
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
    filePath: 'Kopier gs:// sti',
  },

  dataCoverageTimeline: {
    availableDataFileLabel: 'tilhørende data fil',
    availableDataFileLabelPlural: 'tilhørende data filer',
    filePathLabel: 'Filsti',
    labelBimesterPrefix: 'B',
    labelFullYear: 'Hele',
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
  documentation: 'Dokumentasjon',

  editing: {
    created: 'Opprettet',
    updated: 'Sist oppdatert',
  },

  error: {
    classificationDetailsTabs: {
      notFoundCodes: 'Koder ikke funnet',
      notFoundAboutClassification: 'Om klassifikasjonen ikke funnet',
      notFoundChanges: 'Endringer ikke funnet',
      notFoundVersions: 'Versjoner ikke funnet',
      notFoundCorrespondences: 'Korrespondanser ikke funnet',
      notFoundVariants: 'Varianter ikke funnet',
    },
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
    statusCode: 'Feilkode',
    referenceCode: 'Referanse',
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
    notFoundHelpListClassificationDetails: [
      'sjekke at du har riktig klassifikasjon-id i lenken',
      'gå til oversikten over klassifikasjoner',
      'gå til forsiden',
    ],
    notFoundHelpListClassificationId: [
      'sjekke at du har riktig klassifikasjon-id i lenken',
      'gå til oversikten over klassifikasjoner',
    ],
    notFoundTitleClassificationDetails: 'Klassifikasjon ikke funnet',
    notFoundMessageClassificationDetails:
      'Er det skrivefeil i lenken? Eller har klassifikasjonen blitt slettet eller flyttet?',
    notFoundTitleVersionDetails: 'Versjon ikke funnet',
    notFoundMessageVersionDetails: 'Er det skrivefeil i lenken? Eller har versjonen blitt slettet eller flyttet?',
    notFoundHelpListVersionDetails: [
      'sjekke at du har riktig versjons-id i lenken',
      'gå tilbake til klassifikasjonen',
      'gå til oversikten over klassifikasjoner',
    ],
    notFoundTitleVariantDetails: 'Variant ikke funnet',
    notFoundMessageVariantDetails: 'Er det skrivefeil i lenken? Eller har varianten blitt slettet eller flyttet?',
    notFoundHelpListVariantDetails: [
      'sjekke at du har riktig variant-id i lenken',
      'gå til oversikten over varianter',
      'gå til oversikten over klassifikasjoner',
    ],
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
    datasetPrototypeInfo:
      'Denne siden beskriver et utvalg av data i SSB. Utvikling fortsetter med flere typer data og mer detaljerte beskrivelser.',
    feedbackTitle: 'Del dine erfaringer!',
    feedbackBody: 'Vi jobber kontinuerlig med å forbedre dataportalen og du kan hjelpe oss ved å fylle ut',
    feedbackForm: 'tilbakemeldingsskjema for SSB Dataportal',
    footerAboutPage: 'Om nettstedet',
    footerContact: 'Kom i kontakt',
    footerAccessibilityStatement: 'Tilgjengelighetserklæring',
    footerPrivacyStatement: 'Personvernerklæring',
    landingPageInfoGoal:
      'Målet er å gjøre det enklere å finne, forstå og bruke SSBs data på en korrekt og effektiv måte.',
    landingPageInfoGoalTitle: 'Hvorfor SSB Dataportal?',
    landingPageInfoIntro:
      'Her samler vi informasjon om våre datasett, variabler, klassifikasjoner og API-er på ett sted.',
    landingPageInfoIntroTitle: 'Hva er SSB Dataportal?',
    landingPageInfoPrototype:
      'I denne første versjonen kan du utforske SSBs variabeldefinisjoner. Portalen vil gradvis utvides med oversikt over datasett, klassifikasjoner og API-er, slik at du kan se hele sammenhengen fra konsept til ferdig datafil. Ved å koble definisjoner fra Vardef med kodeverk fra Klass og dokumentasjon om datasett, etablerer vi en "felles sannhet" som sikrer at vi alltid tolker og bruker dataene våre på samme måte.',
    landingPagePrototypeTitle: 'Kontinuerlig forbedring',
    landingPageSubTitle: 'Din inngang til SSBs felles kunnskap om data',
    landingPageTitle: 'Velkommen til SSB Dataportal',
  },
  language: {
    notSelectedLanguage: 'Denne {item} er ikke tilgjengelig på valgt språk',
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
    classifications: 'Klassifikasjoner',
    dataProducts: 'Dataprodukter',
    variableDefinitions: 'Variabeldefinisjoner',
  },

  previous: 'Forrige',
  products: {
    assessment: {
      filterLabel: 'Verdivurdering',
      open: 'Åpen',
      protected: 'Skjermet',
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
  versions: {
    name: 'Navn',
    invert: 'Inverter tabell',
    validFrom: 'Gyldig fra',
    validTo: 'Gyldig til',
    now: 'Nå',
    tags: {
      isLatest: 'Gjeldende versjon:',
      validFrom: 'Gyldig fra og med',
      isNotCurrent: 'Dette er ikke dagens versjon av klassifikasjonen',
    },
    noChanges: 'Ingen kodeendringer finnes for den aktuelle versjonen.',
    numberOfCodesAndLevels: 'Versjonen inneholder {numberOfCodes} koder fordelt over {numberOfLevels} {level}.',
    level: 'nivå',
    levelPlural: 'nivåer',
    codeChangesForVersion: '{numberOfChanges} kodeendringer fra forrige versjon.',
  },
};

export type Translation = typeof nb;
