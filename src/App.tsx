import Header from './Header/Header';
import Converter from './Converter/Converter';
import styles from './index.module.scss'

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <Converter />
    </div>
  );
}

export default App;
