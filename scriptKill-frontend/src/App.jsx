import { RouterProvider } from 'react-router-dom';
import routes from './routes/index';
import './App.css';

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
