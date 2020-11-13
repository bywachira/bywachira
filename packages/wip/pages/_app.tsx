import { Provider } from "react-redux";
import store from "../redux/store";

function App({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
