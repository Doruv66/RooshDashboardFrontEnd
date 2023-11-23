import BookingDetails from "./pages/BookingDetails";
import BookingHistory from "./pages/BookingHistory";
import EditPricingScheme from "./pages/EditPricingScheme";
import GarageDetails from "./pages/GarageDetails";
import GarageImages from "./pages/GarageImages";
import GarageOverview from "./pages/GarageOverview";
import GaragePricing from "./pages/GaragePricing";
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
      text: "Garage details"
    },
    {path: "/addgarage",
        component: GarageDetails,
        isNavLink: true,
        text: "Add garage"},
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
    }
  ];
  
  export default routes;
  