import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { AuthLayout } from "./components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
   _404,
   Home,
   Login,
   Post,
   AddPost,
   Signup,
   Profile,
   EditPost,
   SearchResult,
   EmailConfirmation,
   PasswordRecoveryStepOne,
   PasswordRecoveryStepTwo,
   MySavedPosts,
   EditProfile,
} from "./pages";

const queryClient = new QueryClient();

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
            element: <PasswordRecoveryStepOne />,
         },
         {
            path: "/password-recovery-step-two",
            element: <PasswordRecoveryStepTwo />,
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
            path: "/profile/:id",
            element: <Profile />,
         },
         {
            path: "/edit-profile",
            element: (
               <AuthLayout authentication>
                  <EditProfile />
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
      <QueryClientProvider client={queryClient}>
         <Provider store={store}>
            <RouterProvider router={router} />
         </Provider>
      </QueryClientProvider>
   </React.StrictMode>
);
