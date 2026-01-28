import { redirect } from 'next/navigation';
import { tabsData } from './(services)/tabs';

export default function Home() {
  redirect(tabsData.VariableDefinitions.route);
}
