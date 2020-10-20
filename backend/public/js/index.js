const { createStore, applyMiddleware } = Redux;
const thunk = window.ReduxThunk.default;
const db = firebase.firestore();
const timeout = 180;

console.log(db);

// Reducer: Action to State
const paymentForm = (
  state = {
    progress: 0,
    stage: "INIT",
    timerStart: true,
    startAt: Date.now(),
    countdown: 0,
  },
  action
) => {
  switch (action.type) {
    case "BROWSER_CONNECTED":
      return {
        ...state,
        progress: 5,
      };
    case "BANK_LOADED":
      return {
        ...state,
        progress: 10,
      };
    case "ENTER_USERNAME":
      return {
        ...state,
        username: action.username,
        stage: action.type,
        progress: 10,
      };
    case "SUBMIT_USERNAME":
      return {
        ...state,
      };
    case "SECOND_PASSWORD":
      return {
        ...state,
      };
    case "ENTER_PASSWORD":
      return {
        ...state,
        progress: state.progress,
        stage: action.type,
        password: action.password,
      };
    case "SUBMIT_PASSWORD":
      return {
        ...state,
      };
    case "LOGIN_DONE":
      return {
        ...state,
      };
    case "ENTER_TAC":
      return { ...state, progress: state.progress + 40, stage: action.type };
    case "LOADING":
      return {
        ...state,
        stage: action.type,
      };
    case "FILL_DETAILS":
      return {
        ...state,
      };
    case "FILL_DONE":
      return {
        ...state,
      };
    case "REQUEST_TAC":
      return {
        ...state,
      };
    case "SUBMIT_TAC":
      return {
        ...state,
      };
    case "SUCCESSFUL":
      return {
        ...state,
        stage: action.type,
      };
    case "ERROR":
      return {
        ...state,
        progress: 0,
        stage: action.type,
      };
    case "UNSUCCESSFUL":
      return {
        ...state,
        progress: 0,
        stage: action.type,
      };
    case "TIMER_START":
      return {
        ...state,
        timerStart: true,
        startAt: Date.now(),
      };
    case "TIMER_RUN":
      return {
        ...state,
        countdown: Math.round((Date.now() - state.startAt) / 1000),
      };
    case "TIMEOUT":
      return {
        ...state,
        timerStart: false,
        progress: 0,
      };
    default:
      return state;
  }
};

const store = createStore(paymentForm, applyMiddleware(thunk));

// Action Creator
const setLoading = () => ({
  type: "LOADING",
});

const setTimer = () => ({
  type: "TIMER_RUN",
});

const setTimeout = () => ({
  type: "TIMEOUT",
});

const resetTimer = () => ({
  type: "TIMER_START",
});

const goTo = (stage) => {
  switch (stage) {
    case "password":
      return {
        type: "ENTER_USERNAME",
      };
    case "tac":
      return {};
    default:
      return {};
  }
};

// Thunk
const fillUsername = (username) => async (dispatch, getState) => {
  if (username) {
    console.log("Inside thunk");
    dispatch(setLoading());
    dispatch(resetTimer());

    window.setTimeout(() => {
      // console.log("Inside settimeout");
      dispatch(goTo("password"));
      dispatch(resetTimer());
    }, 5000);

    console.log("End of thunk");
  }
};

const fillPassword = (password) => async (dispatch, getState) => {
  if (password) {
    console.log(dispatch);

    // dispatch tac
  }
};

// UI Changes
const handleLoadingProgress = () => {
  document.querySelector(".progress-label").innerHTML = `${
    store.getState().progress
  }%`;
  document.querySelector(".progress-fill").style.width = `${
    store.getState().progress
  }%`;
};

const handleStep = (stage) => {
  document.querySelector(".bank-loading").setAttribute("hidden", true);

  switch (stage) {
    case "ENTER_USERNAME":
      document.querySelector(".bank-steps").innerHTML = `<div class="step-two">
      <div class="instructions">
        Please Enter Your Password
      </div>
      <input
        class="form-control password"
        type="text"
        placeholder="Bank Password"
        required
      />
      <button class="modal-btn form-control">
        Next
      </button>
      </div>`;
      break;
    case "ENTER_PASSWORD":
      break;
    case "ENTER_TAC":
      document.querySelector(".bank-steps").innerHTML = `
      <div class="step-tac">
      <div class="instructions">Enter the TAC</div>
      <input
        class="form-control tac"
        type="text"
        required
      />
      <button
        class="modal-btn form-control"
      >
        Next
      </button>
      <p class="tac-details">
        Your TAC Request is successful
       . Your TAC number will be sent to your
        registered mobile phone number
      </p>
      </div>`;
      break;

    case "ERROR":
      document.querySelector(".bank-steps").innerHTML = `
      <div class="step-error">
      <h3>Transaction Failed</h3>
        <br />
        <p>
          Transaction Failed. It seems like something has gone wrong. Please
          initiate a new payment or contact Merchant for support.
        </p>
        <br />
        <a href="/#">
          Returning to Merchant
        </a>
      </div>`;
      break;
    case "SUCCESSFUL":
      document.querySelector(".bank-steps").innerHTML = `
          <div class="step-successful">
          <h3>Transaction Successful!</h3>
          <br />
          <p>
            Transaction Successful. Please do not refresh, you will be redirect
            back to the website you came from.
          </p>
          </div>`;
      break;
    case "UNSUCCESSFUL":
      document.querySelector(".bank-steps").innerHTML = `
        <div class="step-unsuccessful">
        <h3>Transaction Failed</h3>
        <br />
        <p>
          Transaction Failed. It seems like something has gone wrong. Please
          initiate a new payment or contact Merchant for support.
        </p>
        <br />
        <a href="/#">
          Returning to Merchant
        </a>
        </div>`;
      break;
    case "TIMEOUT":
      document.querySelector(".bank-steps").innerHTML = `
          <div class="step-timeout">
          <h3>Timeout Error</h3>
        <br />
        <p>
          Failed to complete the transaction within the time limit. Please try
          again.
        </p>
        <br />
        <a href="/#">
          Returning to Merchant
        </a>
          </div>`;
      break;
    case "LOADING":
      document.querySelector(".bank-loading").removeAttribute("hidden");
      document.querySelector(".bank-steps").innerHTML = "";
      break;
    default:
      break;
  }
};

function formatCountdown(time) {
  if (time > 0) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return `0${minutes}:${("0" + seconds).slice(-2)}`;
  } else {
    return "EXPIRED";
  }
}

const handleTimer = (countdown) => {
  let countdownTimerHTML = document.querySelector("#timer");
  countdownTimerHTML.innerText = formatCountdown(timeout - countdown);
};

document.querySelector(".modal-btn").addEventListener("click", () => {
  switch (store.getState().stage) {
    case "INIT":
      let username = document.querySelector(".username").value;
      // store.dispatch(asyncTest(10));
      // store.dispatch({ type: "LOADING", username: username });
      store.dispatch(fillUsername(username));

      break;
    case "ENTER_USERNAME":
      let password = document.querySelector(".password").value;
      store.dispatch({ type: "ENTER_PASSWORD", password });
      break;
    case "ENTER_PASSWORD":
      break;
    case "ENTER_TAC":
      break;
    default:
      break;
  }
});

handleLoadingProgress();

// Run UI Code here
store.subscribe(() => {
  let { stage, countdown } = store.getState();

  handleLoadingProgress();

  handleStep(stage);

  handleTimer(countdown);
});

const runTimer = () => {
  return setInterval(() => {
    let { countdown, timerStart } = store.getState();
    if (timerStart) {
      if (countdown <= timeout) {
        store.dispatch(setTimer());
      } else {
        store.dispatch(setTimeout());
      }
    }
  }, 1000);
};

let timer = runTimer();
