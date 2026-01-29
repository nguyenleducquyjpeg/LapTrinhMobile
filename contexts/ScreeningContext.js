import { createContext, useReducer } from "react"

const ScreeningContext = createContext()

const ScreeningProvider = ({ children }) => {
  const initialState = {
    screenings: [],
    screening: null,
    theater: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
  }
  function reducer(state, action) {
    switch (action.type) {
      case "FETCH_SCREENINGS_PENDING":
        return {
          ...state,
          isLoading: true
        }
      case "FETCH_SCREENINGS_SUCCESS":
        return {
          ...state,
          screenings: action.payload,
          isSuccess: true,
          isLoading: false
        }
      case "FETCH_SCREENINGS_FAILURE":
        return {
          ...state,
          isError: true,
          message: "Failed to fetch screenings"
        }
      case "SET_SCREENING":
        console.log(action.payload) 
        return {
          ...state,
          screening: action.payload
        }
      case "SET_THEATER": 
        return {
          ...state,
          theater: action.payload
        }
      case "RESET":
        return {
          ...state,
          screenings: [],
          screening: null,
          theater: null,
          isLoading: false,
          isError: false,
          isSuccess: false,
          message: ""
        }
      default:
        return state
    }
  }
  const [screenings, dispatchScreenings] = useReducer(reducer, initialState)
  return (
    <ScreeningContext.Provider value={{screenings, dispatchScreenings}}>
      {children}
    </ScreeningContext.Provider>
  )
}

export { ScreeningProvider }

export default ScreeningContext