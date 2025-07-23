import { createBrowserRouter, Navigate } from "react-router-dom";
import Script from "../pages/scriptPage/script";
import Scriptdetails from "../pages/scriptPage/scriptdetails";
import Comment from "../pages/scriptPage/comment";
import Describe from "../pages/scriptPage/describe";

const routes = createBrowserRouter([
  {
    path: "/ZYC",
    children: [
      {
        path: "script",
        element: <Script />,
      },
      {
        path: "scriptdetails/:scriptId",
        element: <Scriptdetails />,
        children: [
          {
            path: "comment",
            element: <Comment />,
          },
          {
            path: "describe",
            element: <Describe />,
          },
          {
            path: "",
            element: <Navigate to="comment" replace />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/ZYC/script" replace />,
  },
]);

export default routes;
