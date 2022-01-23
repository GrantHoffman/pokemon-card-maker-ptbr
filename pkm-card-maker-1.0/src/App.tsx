import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import CardCreatorPage from 'pages/CardCreator';
import styles from './App.module.scss';
import { Switch, BrowserRouter as Router, Route, } from 'react-router-dom';
import card from './garbodor.json';
import { ImportedCard } from 'interfaces';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerCircle} />
        </header>
        <div className={styles.content}>
          <Router>
            <Switch>
              <Route exact path='/preset'>
                <CardCreatorPage card={card as ImportedCard} />
              </Route>
              <Route path=''>
                <CardCreatorPage />
              </Route>
            </Switch>
          </Router>
        </div>
        <footer className={styles.footer} />
      </div>
    </Provider>
  )
}

export default App;
