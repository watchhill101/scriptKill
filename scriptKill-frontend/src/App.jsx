import { RouterProvider } from "react-router-dom";
import routes from "./routes/index_G.jsx";

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
