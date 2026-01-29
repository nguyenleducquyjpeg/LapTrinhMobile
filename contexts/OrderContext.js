import { createContext, useReducer } from "react"

const OrderContext = createContext()

const OrderProvider = ({ children }) => {
  const initialState = {
    orders: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
  }
  function reducer(state, action) {
    switch (action.type) {
      case "FETCH_ORDERS_PENDING":
        return {
          ...state,
          isLoading: true
        }
      case "FETCH_ORDERS_SUCCESS":
        return {
          ...state,
          orders: action.payload,
          isSuccess: true,
          isLoading: false
        }
      case "FETCH_ORDERS_FAILURE":
        return {
          ...state,
          isLoading:false,
          isError: true,
          message: "Failed to fetch orders"
        }
      case "RESET":
        return {
          ...state,
          isLoading: false,
          isError: false,
          isSuccess: false,
          message: ""
        }
      default:
        return state
    }
  }
  const [orders, dispatchOrders] = useReducer(reducer, initialState)
  return (
    <OrderContext.Provider value={{orders, dispatchOrders}}>
      {children}
    </OrderContext.Provider>
  )
}

export { OrderProvider }

export default OrderContext