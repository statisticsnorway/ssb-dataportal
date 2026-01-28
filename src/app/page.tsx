import { redirect } from 'next/navigation';
import { tabsData } from './tabs';

export default function Home() {
  redirect(tabsData.VariableDefinitions.route);
}
