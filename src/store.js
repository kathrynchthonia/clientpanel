import { createStore, combineReducers, compose } from "redux";
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
// Reducers
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
    apiKey: "AIzaSyC1vx4TzCiHF9q8mUl7X6Uq7d_bD8DIAS0",
    authDomain: "reactclientpanel-tmc.firebaseapp.com",
    databaseURL: "https://reactclientpanel-tmc.firebaseio.com",
    projectId: "reactclientpanel-tmc",
    storageBucket: "reactclientpanel-tmc.appspot.com",
    messagingSenderId: "241692735625"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

// init firebase instance
firebase.initializeApp(firebaseConfig);
// Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) 
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

// Check for settings in local storage
if(localStorage.getItem('settings') == null) {
  // Defauls Settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  }

  // Set to Local Storage
  localStorage.setItem('settings', JSON.stringify(defaultSettings));
}


// Create initial state
const initialState = {settings: JSON.parse(localStorage.getItem('settings'))};

// Create store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
  reactReduxFirebase(firebase),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;