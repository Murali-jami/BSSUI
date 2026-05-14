import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/auth/authSlice";
import networkListReducer from "./slices/networkListSlice";
import networkStatusReducer from "./slices/networkStatusSlice";
import countriesReducer from "./slices/countriesSlice";
import statesReducer from "./slices/statesSlice";
import networkCreationReducer from "./slices/networkCreationSlice";
import networkDetailsReducer from "./slices/networkDetailsSlice";
import networkModificationReducer from "./slices/networkModificationSlice";
import changePasswordReducer from "./slices/updatePassword";
import networkConfigReducer from "./slices/networkConfigSlice";
import networkConfigSubmitReducer from "./slices/networkConfigSubmitSlice";

const rootReducer = combineReducers({
    auth: authReducer,
     countries: countriesReducer,
     states: statesReducer,
    networkCreation: networkCreationReducer,
    networkList: networkListReducer,
    networkStatus: networkStatusReducer,
    networkDetails: networkDetailsReducer,
    networkModification: networkModificationReducer,
    changePassword: changePasswordReducer,
    networkConfig: networkConfigReducer,
    networkConfigSubmit: networkConfigSubmitReducer,
});

export default rootReducer;