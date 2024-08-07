import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { AuthLayout } from "./components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
   _404,
   Home,
   Login,
   Post,
   AddPost,
   Signup,
   MyPosts,
   Profile,
   EditPost,
   SearchResult,
   EmailConfirmation,
   PasswordRecoveryStepOne,
   PasswordRecoveryStepTwo,
   MySavedPosts,
} from "./pages";

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
            path: "/password-recovery-step-one",
            element: (
               //<AuthLayout authentication={false}>
               <PasswordRecoveryStepOne />
               //</AuthLayout>
            ),
         },
         {
            path: "/password-recovery-step-two",
            element: (
               //<AuthLayout authentication={false}>
               <PasswordRecoveryStepTwo />
               //</AuthLayout>
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
            path: "/saved-posts",
            element: (
               <AuthLayout authentication>
                  <MySavedPosts />
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
            path: "/email-confirmation",
            element: (
               <AuthLayout authentication>
                  <EmailConfirmation />
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
            path: "/edit-post/:id",
            element: (
               <AuthLayout authentication>
                  <EditPost />
               </AuthLayout>
            ),
         },
         {
            path: "/post/:id",
            element: <Post />,
         },
         {
            path: "/search",
            element: <SearchResult />,
         },
         {
            path: "*",
            element: <_404 />,
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
