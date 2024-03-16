
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Appointments from './components/Appointments';
import './styles.css';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
          <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
