import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsList,
  Button,
  Card,
  ChipButton,
  ChipRemovable,
  Heading,
  Paragraph,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Tag,
} from '@digdir/designsystemet-react';
import { DismissibleAlertExamples } from './dismissible-alert-examples';
import styles from './example.module.css';

const colors = ['primary', 'secondary', 'neutral', 'magic'] as const;

export default function ExamplePage() {
  return (
    <main className={`${styles.page} container`}>
      <Heading level={1}>SSB Designsystem fargeeksempel</Heading>
      <Paragraph>Midlertidig oversikt over de viktigste fargevariantene for kort, knapper og tags.</Paragraph>

      <section className={styles.alertExample}>
        <Heading level={2} data-size='sm'>
          Dismissible info alert options
        </Heading>
        <DismissibleAlertExamples />
      </section>

      <section className={styles.breadcrumbsExample}>
        <Heading level={2} data-size='sm'>
          Breadcrumbs
        </Heading>
        <Breadcrumbs data-color='secondary'>
          <BreadcrumbsList>
            <BreadcrumbsItem>
              <BreadcrumbsLink href='/'>Home</BreadcrumbsLink>
            </BreadcrumbsItem>
            <BreadcrumbsItem>
              <BreadcrumbsLink href='/example'>Examples</BreadcrumbsLink>
            </BreadcrumbsItem>
            <BreadcrumbsItem>
              <BreadcrumbsLink href={undefined} aria-current='page'>
                Components
              </BreadcrumbsLink>
            </BreadcrumbsItem>
          </BreadcrumbsList>
        </Breadcrumbs>
      </section>

      <section className={styles.tabsExample}>
        <Heading level={2} data-size='sm'>
          Tabs
        </Heading>
        <div className={styles.tabsGrid}>
          {(['primary', 'secondary', 'magic'] as const).map((color) => (
            <Tabs key={color} defaultValue={`${color}-one`} data-color='secondary'>
              <TabsList aria-label={`${color} tabs`}>
                <TabsTab value={`${color}-one`}>First</TabsTab>
                <TabsTab value={`${color}-two`}>Second</TabsTab>
                <TabsTab value={`${color}-three`}>Third</TabsTab>
              </TabsList>
              <TabsPanel value={`${color}-one`}>Selected {color} tab</TabsPanel>
              <TabsPanel value={`${color}-two`}>Second {color} tab</TabsPanel>
              <TabsPanel value={`${color}-three`}>Third {color} tab</TabsPanel>
            </Tabs>
          ))}
        </div>
      </section>

      <div className={styles.grid}>
        {colors.map((color) => (
          <section className={styles.colorGroup} key={color}>
            <Heading level={2} data-size='sm'>
              {color}
            </Heading>
            <div className={styles.cards}>
              <Card data-color={color}>
                <Heading level={3} data-size='xs'>
                  Standard
                </Heading>
                <Paragraph>Standard variant med {color}-fargen.</Paragraph>
              </Card>
              <Card data-color={color} variant='tinted'>
                <Heading level={3} data-size='xs'>
                  Tinted
                </Heading>
                <Paragraph>Tinted variant med {color}-fargen.</Paragraph>
              </Card>
            </div>
            <div className={styles.buttons}>
              <Button data-color={color}>Primary</Button>
              <Button data-color={color} variant='secondary'>
                Secondary
              </Button>
              <Button data-color={color} variant='tertiary'>
                Tertiary
              </Button>
            </div>
            <div className={styles.tags}>
              <Tag data-color='magic'>Tag magic tinted</Tag>
            </div>
            <div className={styles.chips}>
              <ChipRemovable data-color='secondary' aria-label={`Remove ${color} filter`}>
                Removable chip
              </ChipRemovable>
              <ChipButton data-color='secondary'>Chip button</ChipButton>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
