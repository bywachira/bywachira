import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"
// import withRedux from "next-redux-wrapper";

// const initStore = () => createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(thunkMiddleware)))

// export const reduxPage = (comp: any) => withRedux(initStore)(comp)

export default createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(thunkMiddleware)))