import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import '/src/styles/App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage/>} />
      </Routes>
    </Router>
  )
}

export default App
