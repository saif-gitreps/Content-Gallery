import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { AuthLayout } from "./components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, AddPost, Login, Signup, EditPost, Post, MyPosts, Profile } from "./pages";

const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "/login",
            element: (
               <AuthLayout authentication={false}>
                  <Login />
               </AuthLayout>
            ),
         },
         {
            path: "/signup",
            element: (
               <AuthLayout authentication={false}>
                  <Signup />
               </AuthLayout>
            ),
         },
         {
            path: "/my-posts",
            element: (
               <AuthLayout authentication>
                  <MyPosts />
               </AuthLayout>
            ),
         },
         {
            path: "/profile",
            element: (
               <AuthLayout authentication>
                  <Profile />
               </AuthLayout>
            ),
         },
         {
            path: "/add-post",
            element: (
               <AuthLayout authentication>
                  <AddPost />
               </AuthLayout>
            ),
         },
         {
            path: "/edit-post/:slug",
            element: (
               <AuthLayout authentication>
                  <EditPost />
               </AuthLayout>
            ),
         },
         {
            path: "/post/:slug",
            element: <Post />,
         },
      ],
   },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   </React.StrictMode>
);
