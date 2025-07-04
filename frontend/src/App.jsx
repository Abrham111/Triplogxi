import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputForm from './components/InputForm';
import ResultPage from './components/ResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputForm />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;