import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Store/Store";
import { RouterProvider } from "react-router-dom";

import React from "react";
import Signin from "./Pages/Form_page/Auth/signin";
import Signup from "./Pages/Form_page/Auth/signup";
import { createBrowserRouter } from "react-router-dom";

import Pro from "./Pages/Form_page/Auth/pro";

import WorkerProfile from "./Pages/Workers_page/WorkerProfile";

import UserProfile from "./Pages/Users_page/UserProfile";

import UserPrivate from "./router/UserPrivate";

import LandingPage from "./Pages/Landing_page/LandingPage.jsx";

import WorkerAppointment from "./Pages/Appointment_page/workerAppointment";
import UpdateUser from "./Pages/Users_page/updateUser";
import UpdateWorker from "./Pages/Workers_page/updateWorker";
import AppointmentRequest from "./Pages/Appointment_page/AppointmentRequestForm";
import UpdateProject from "./Pages/Users_page/comp/updateProject.jsx";
import OrderPage from "./Pages/Payment_page/OrderPage.jsx";
import UpdateAppointment from "./Pages/Users_page/bookedAppointment";
import VerifyEmailPage from "./Pages/VerifyEmailPage.jsx";
import OrderDetail from "./Pages/Users_page/comp/OrderDetail.jsx";
import HowItWorksPage from "./Pages/HowItWorks/HowItWorks.jsx";

export let myRoutes = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserPrivate>
        <App />
      </UserPrivate>
    ),
    children: [
      {
        index: true,
        element: (
          <UserPrivate>
            <LandingPage />
          </UserPrivate>
        ),
      },

      {
        path: "/pro",
        element: (
          <UserPrivate>
            <Pro />
          </UserPrivate>
        ),
      },
      {
        path: "/signin",
        element: (
          <>
            <Signin />
          </>
        ),
      },
      {
        path: "/home",
        element: (
          <UserPrivate>
            <LandingPage />
          </UserPrivate>
        ),
      },
      {
        path: "/signup",
        element: (
          <>
            <Signup />
          </>
        ),
      },
      {
        path: "/orders/:orderId",
        element: (
          <UserPrivate>
            <OrderDetail />
          </UserPrivate>
        ),
      },

      {
        path: "/workerprofile",
        element: (
          <UserPrivate>
            <WorkerProfile />
          </UserPrivate>
        ),
      },
      {
        path: "/userprofile",
        element: (
          <UserPrivate>
            <UserProfile />
          </UserPrivate>
        ),
      },

      {
        path: "/worker/:workerId",
        element: (
          <UserPrivate>
            <WorkerAppointment />
          </UserPrivate>
        ),
      },
      {
        path: "/updateUser",
        element: (
          <UserPrivate>
            <UpdateUser />
          </UserPrivate>
        ),
      },
      {
        path: "/updateWorker",
        element: (
          <UserPrivate>
            <UpdateWorker />
          </UserPrivate>
        ),
      },
      {
        path: "/appointment-request/:workerId",
        element: (
          <UserPrivate>
            <AppointmentRequest />
          </UserPrivate>
        ),
      },
      {
        path: "/booking",
        element: (
          <UserPrivate>
            <OrderPage />
          </UserPrivate>
        ),
      },
      {
        path: "/updateAppointment",
        element: (
          <UserPrivate>
            <UpdateAppointment />
          </UserPrivate>
        ),
      },
      {
        path: "/updateProject",
        element: (
          <UserPrivate>
            <UpdateProject />
          </UserPrivate>
        ),
      },
      {
        path: "/how-it-works",
        element: (
          <UserPrivate>
            <HowItWorksPage />
          </UserPrivate>
        ),
      },
      {
        path: "/verify-email",
        element: (
          <UserPrivate>
            <VerifyEmailPage />
          </UserPrivate>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={myRoutes} />
  </Provider>,
);
