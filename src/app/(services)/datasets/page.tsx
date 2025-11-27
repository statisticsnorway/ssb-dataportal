import SearchPage from '@/components/search-page/searchPage';
import styles from './datasets.module.css';

export default function Datasets() {
  return (
    <SearchPage
      filterGroups={[]}
      searchResult={
        <div className='container'>
          <h2 className={styles.message}>Under arbeid</h2>
        </div>
      }
    ></SearchPage>
  );
}
