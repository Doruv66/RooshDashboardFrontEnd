import BookingDetails from "./pages/BookingDetails";
import BookingHistory from "./pages/BookingHistory";
import GarageDetails from "./pages/GarageDetails";
import DeparturesAndArrivals from "./pages/DeparturesAndArrivals.jsx";
import Statistics from "./pages/Statistics.jsx";

const routes = [
    {
      path: "/bookinghistory",
      component: BookingHistory,
      isNavLink: true,
      text: "Booking History"
    },
    {
      path: "/booking/:bookingId", 
      component: BookingDetails,
      isNavLink: false, 
      text: "Booking Details" 
    },

    {
      path: "/garagedetails",
      component: GarageDetails,
      isNavLink: true,
      text: "Garage Details"
    },

    {
        path: "/addgarage",
        component: GarageDetails,
        isNavLink: true,
        text: "Add Garage"
    },
    {
        path: "/departuresandarrivals",
        component: DeparturesAndArrivals,
        isNavLink: true,
        text: "Departures and Arrivals"
    },

    {
        path: "/statistics",
        component: Statistics,
        isNavLink: true,
        text: "Statistics"
    },
  ];
  
  export default routes;
  