// @ts-nocheck

import { combineReducers } from "redux";
import { commonReducer } from "./reducers/commonReducer";

const rootReducer = combineReducers({

  commonReducer: commonReducer
});

export default rootReducer;
