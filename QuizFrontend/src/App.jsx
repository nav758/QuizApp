import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ShowQuiz from './pages/ShowQuiz/ShowQuiz';
import UrlShowQuiz from './pages/UrlShowQuiz/UrlShowQuiz';

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/quiz' element={<ShowQuiz />}/>
      <Route path='/quiz/:quizId' element={<UrlShowQuiz />}/>
      <Route path='/dashboard' element={<ProtectedRoute Component={Dashboard}/>}/>
    </Routes>
   </BrowserRouter>
  );
}

export default App