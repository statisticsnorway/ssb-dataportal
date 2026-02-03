/**
 * This is the default language.
 *
 * It should be used as the reference for which strings are to be defined in the app.
 *
 * Please maintain alphabetical order on variable name for ease of maintenance!
 */

export const nb = {
  appTitle: 'Dataportal',
  by: 'av',
  comment: 'Kommentar',
  context: 'Kontekst',
  documentation: 'Dokumentasjon',
  from: 'Fra',
  id: 'ID',
  loadingVariableDefinitions: 'Laster variabeldefinisjoner',
  navigateHome: 'Naviger til hjemmesiden',
  navigateHomeClassifications: 'Naviger til hovedside Klassifikasjoner',
  navigateHomeVariableDefinitions: 'Naviger til hovedside Variabeldefinisjoner',
  next: 'Neste',
  no: 'Nei',
  on: 'på',
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
  },

  error: {
    somethingWentWrong: 'Beklager, noe gikk galt. Prøv på nytt litt senere.',
    unauthorized: 'Beklager, du har ikke tilgang.',
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
    searchForClassifications: 'Søk i kodeverk',
    searchForDatasets: 'Søk i datasett',
    searchForVariableDefinitions: 'Søk i variabeldefinisjoner',

    textFilter: {
      label: 'Filtrer på Navn',
      tagLabel: 'Navn:',
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
      defaultSortOrder: 'titleAsc',
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
    landingPageTitle: 'Velkommen til Dataportalen',
    landingPageSubTitle: 'Din inngang til SSBs felles kunnskap om data',
    landingPageInfoIntroTitle: 'Hva er Dataportalen?',
    landingPageInfoIntro: 'Her samler vi informasjon om våre datasett, variabler, kodelister og API-er på ett sted.',
    landingPageInfoGoalTitle: 'Hvorfor Dataportalen?',
    landingPageInfoGoal:
      'Målet er å gjøre det enklere for alle i SSB å finne, forstå og bruke dataene våre på en korrekt og effektiv måte.',
    landingPagePrototypeTitle: 'Dataportal prototype',
    landingPageInfoPrototype:
      'I denne første versjonen kan du utforske SSBs variabeldefinisjoner. Portalen vil gradvis utvides med oversikt over datasett, kodelister og API-er, slik at du kan se hele sammenhengen fra konsept til ferdig datafil. Ved å koble definisjoner fra Vardef med kodelister fra Klass og dokumentasjon fra Datadoc, etablerer vi en "felles sannhet" som sikrer at vi alltid tolker og bruker dataene våre på samme måte.',
  },
};
