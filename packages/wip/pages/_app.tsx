import { Provider } from "react-redux";
import store from "../redux/store";
import "../public/root.css";

function App({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
