import { createBrowserRouter } from "react-router-dom";
import AppointmentPaymentZ from "../pages/Appointment_payment_Z/Appointment_payment_Z";
import StartCarZ from "../pages/StartCar_Z/StartCar_Z";
import CarpoolDetailsZ from "../pages/Carpool_details_Z/Carpool_details_Z";
import CarpoolPaymentZ from "../pages/Carpool_payment_Z/Carpool_payment_Z";
import LnitiateCarpoolingZ from "../pages/Initiate_carpooling_Z/Initiate_carpooling_Z";

const routes = createBrowserRouter([
    {
        path: "/ZYC",
        children: [
            {
                path: "Appointment_payment_Z",
                element: <AppointmentPaymentZ />
            },
            {
                path: "StartCar_Z",
                element: <StartCarZ />
            },
            {
                path: "Carpool_details_Z",
                element: <CarpoolDetailsZ />
            },
            {
                path: "Carpool_payment_Z",
                element: <CarpoolPaymentZ />
            },
            {
                path: "LnitiateCarpooling_Z",
                element: <LnitiateCarpoolingZ />
            }
        ]
    }
])

export default routes;