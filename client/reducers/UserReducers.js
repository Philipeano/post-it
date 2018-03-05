const initialState = {
  requestData: {},
  isErrored: false,
  isLoading: false
};

/**
 * @class UserReducers
 */
export default class UserReducers {
  /**
  * Processes user registration actions
  * @param {Object} state The initial state
  * @param {Object} action The action to process
  * @returns {Object} The new state
  */
  static signUpUser(state = initialState, action) {
    switch (action.type) {
      case 'SIGN_UP_STARTED':
        return { ...state, isLoading: true };
      case 'SIGN_UP_SUCCEEDED':
      case 'SIGN_UP_FAILED':
        return { ...state, requestData: action.payload };
      case 'SIGN_UP_ERRORED':
        return { ...state, isErrored: true, requestData: action.payload };
      default:
        return state;
    }
  }

  /**
  * Processes user login actions
  * @param {Object} state The initial state
  * @param {Object} action The action to process
  * @returns {Object} The new state
  */
  static signInUser(state = initialState, action) {
    switch (action.type) {
      case 'SIGN_IN_STARTED':
        return { ...state, isLoading: true };
      case 'SIGN_IN_SUCCEEDED':
      case 'SIGN_IN_FAILED':
        return { ...state, requestData: action.payload };
      case 'SIGN_IN_ERRORED':
        return { ...state, isErrored: true, requestData: action.payload };
      default:
        return state;
    }
  }

}
