import ReactDOM from "react-dom";
import './index.scss';
import App from './App';
import { createStore } from "redux";
import rootReducer from "./reducer";
import { Provider } from "react-redux";

export const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

