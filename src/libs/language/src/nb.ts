/**
 * This is the default language.
 *
 * It should be used as the reference for which strings are to be defined in the app.
 *
 * Please maintain alphabetical order on variable name for ease of maintenance!
 */

export const nb = {
  appTitle: 'Dataportal',
  breadcrumbsLabel: 'Brødsmulesti',
  by: 'av',
  comment: 'Kommentar',
  context: 'Kontekst',
  daplaManual: 'Dapla-manualen',
  documentation: 'Dokumentasjon',
  feedBackForm: 'tilbakemeldingsskjema for Dataportalen',
  from: 'Fra',
  home: 'Hjem',
  id: 'ID',
  loadingVariableDefinitions: 'Laster variabeldefinisjoner',
  navigateHome: 'Naviger til hjemmesiden',
  navigateHomeClassifications: 'Naviger til hovedside Klassifikasjoner',
  navigateHomeVariableDefinitions: 'Naviger til hovedside Variabeldefinisjoner',
  next: 'Neste',
  no: 'Nei',
  on: 'på',
  opensInNewTab: 'åpnes i ny fane',
  previous: 'Forrige',
  references: 'Referanser',
  statisticsNorway: 'Statistisk sentralbyrå',
  subjectArea: 'Statistikkområde',
  subjectFields: 'Statistikkområder',
  to: 'Til',
  unitTypes: 'Enhetstyper',
  welcomeToTesting: 'Velkommen til testing av datakatalogen. Du er nå i en prototype under utvikling.',
  yes: 'Ja',

  tabs: {
    classifications: 'Klassifikasjoner',
    datasets: 'Datasett',
    variableDefinitions: 'Variabeldefinisjoner',
  },

  editing: {
    created: 'Opprettet',
    updated: 'Sist oppdatert',
  },

  copy: {
    code: 'Kopier kode',
    copied: 'Kopiert',
    id: 'Kopier ID',
    shortName: 'Kopier kortnavn',
  },

  error: {
    somethingWentWrong: 'Beklager, noe gikk galt. Prøv på nytt litt senere.',
    tryAgainButtonText: 'Prøv igjen',
    unauthorized: 'Beklager, du har ikke tilgang.',
    brokenLinkMailSubject: 'Ødelagt lenke i dataportalen',
    brokenLinkMailBody: (path: string) =>
      [
        'Hei, jeg vil melde fra om en mulig ødelagt lenke i Dataportalen.',
        '',
        `Side: ${path}`,
        '',
        'Beskrivelse av hva som ikke fungerte:',
      ].join('\n'),
  },

  contact: {
    fallbackTitle: 'Ta kontakt med spørsmål eller innspill',
    label: 'Kontakt',
  },

  owner: {
    daplaTeam: 'Dapla Team',
    groups: 'Grupper',
    label: 'Eier',
  },

  // Labels specific to variable definitions
  variableDefinition: {
    externalReference: 'Ekstern referanse',
    fetchWith: 'Hent variabeldefinisjon med',
    labelPlural: 'Variabeldefinisjoner',
    labelSingular: 'Variabeldefinisjon',
    labelWithComment: 'Variabeldefinisjon med kommentar',
    notFoundAlertText: 'Variabeldefinisjon ikke funnet',
    personalData: 'Inneholder særlige kategorier av personopplysninger',
    relevant: 'Relevante variabeldefinisjoner',
    viewExternalReference: 'Se ekstern referanse',
    viewRelevant: 'Se relevant variabeldefinisjon',
  },

  classification: {
    label: 'Klassifikasjon',
    view: 'Se klassifikasjon',
  },

  search: {
    hits: 'treff',
    label: 'Søk',
    noHits: 'Ditt søk ga ingen treff',
    searchDataportal: 'Søk i Dataportalen',
    searchForClassifications: 'Søk i kodeverk',
    searchForDatasets: 'Søk i datasett',
    searchForVariableDefinitions: 'Søk i variabeldefinisjoner',

    textFilter: {
      search: 'Søk',
      label: 'Filtrer på navn',
      tagLabel: 'Navn:',
      inputId: 'søk-input',
    },

    filter: {
      close: 'Lukk filter',
      label: 'Filter',
      open: 'Åpne filter',
    },

    sort: {
      label: 'Sortering',
      lastUpdatedFirst: 'Sist endret først',
      titleAlphabeticalAsc: 'Tittel A-Å',
      titleAlphabeticalDesc: 'Tittel Å-A',
    },
  },

  button: {
    removeFilter: 'Fjern alle filter',
  },

  status: {
    draft: 'Utkast',
    label: 'Status',
    publishedExternal: 'Publisert eksternt',
    publishedInternal: 'Publisert internt',
  },

  validity: {
    label: 'Gyldighet',
  },

  info: {
    comingSoon: 'Kommer snart',
    classificationsPrototypeIntro: 'Under utvikling',
    classificationsPrototypeInfo:
      'En ny og forbedret visning av Klass lanseres ila 2026. Frem til lansering må du bruke dagens løsning på',
    datasetPrototypeIntro: 'Planlagt utvidelse',
    datasetProtoypeInfo:
      'Denne siden vil i fremtiden inneholde vår nye løsning for beskrivelser av datasett. Utviklingen starter for fullt i 2026.',
    landingPageInfoGoal:
      'Målet er å gjøre det enklere for alle i SSB å finne, forstå og bruke dataene våre på en korrekt og effektiv måte.',
    landingPageInfoGoalTitle: 'Hvorfor Dataportalen?',
    landingPageInfoIntro: 'Her samler vi informasjon om våre datasett, variabler, kodeverk og API-er på ett sted.',
    landingPageInfoIntroTitle: 'Hva er Dataportalen?',
    landingPageInfoPrototype:
      'I denne første versjonen kan du utforske SSBs variabeldefinisjoner. Portalen vil gradvis utvides med oversikt over datasett, kodeverk og API-er, slik at du kan se hele sammenhengen fra konsept til ferdig datafil. Ved å koble definisjoner fra Vardef med kodeverk fra Klass og dokumentasjon fra Datadoc, etablerer vi en "felles sannhet" som sikrer at vi alltid tolker og bruker dataene våre på samme måte.',
    landingPagePrototypeTitle: 'Dataportal prototype',
    landingPageSubTitle: 'Din inngang til SSBs felles kunnskap om data',
    landingPageTitle: 'Velkommen til Dataportalen',
  },

  loading: {
    filters: 'Laster filtere...',
    results: 'Laster resultater...',
  },
};
