import React, { createContext, useState, useContext } from "react"
import cinemaApi from "../cinemaApi"
import { AuthContext } from "./AuthContext"

export const MoviesContext = createContext()

export const MoviesProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await cinemaApi.get("/movies", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
      setMovies(response.data)
    } catch (err) {
      console.error(
        "Fetch Featured Movies Error:",
        err.response ? err.response.data : err.message
      )
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MoviesContext.Provider
      value={{
        movies,
        loading,
        error,
        fetchMovies
      }}
    >
      {children}
    </MoviesContext.Provider>
  )
}
