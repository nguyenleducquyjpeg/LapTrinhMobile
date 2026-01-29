import { createContext, useReducer } from "react"

const SeatProductContext = createContext()

const SeatProductProvider = ({ children }) => {
  const initialState = {
    seats: [],
    products: [],
    chosenProducts: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
  }
  function reducer(state, action) {
    switch (action.type) {
      case "SET_SEATS": 
        return {
          ...state,
          seats: action.payload
        }
      case "FETCH_PRODUCTS_PENDING":
        return {
          ...state,
          isLoading: true
        }
      case "FETCH_PRODUCTS_SUCCESS":
        return {
          ...state,
          products: action.payload,
          isSuccess: true,
          isLoading: false
        }
      case "FETCH_PRODUCTS_FAILURE":
        return {
          ...state,
          isError: true,
          message: "Failed to fetch products"
        }
      case "SET_CHOSEN_PRODUCTS": 
        return {
          ...state,
          chosenProducts: action.payload
        }
      case "RESET":
        return {
          ...state,
          seats: [],
          chosenProducts: [],
          isLoading: false,
          isError: false,
          isSuccess: false,
          message: ""
        }
      default:
        return state
    }
  }
  const [seatProduct, dispatchSeatProduct] = useReducer(reducer, initialState)
  return (
    <SeatProductContext.Provider value={{seatProduct, dispatchSeatProduct}}>
      {children}
    </SeatProductContext.Provider>
  )
}

export { SeatProductProvider }

export default SeatProductContext