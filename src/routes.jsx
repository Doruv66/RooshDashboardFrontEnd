import BookingDetails from "./pages/BookingDetails";
import BookingHistory from "./pages/BookingHistory";
import GarageDetails from "./pages/GarageDetails";
import DeparturesAndArrivals from "./pages/DeparturesAndArrivals.jsx";
import Statistics from "./pages/Statistics.jsx";
import Pricing from "./pages/GaragePricing.jsx";
import Logout from "./pages/Logout.jsx"


const handleLogout = () => {
  console.log("Logging out...");
  TokenManager.clear();
  window.location.reload();
};


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
    {
      path: "/pricing",
      component: Pricing,
      isNavLink: true,
      text: "Pricing"
    },
{   path: "/logout",
    component: Logout,
    text: "Logout",
    isNavLink: true,
    onClick: handleLogout
   },
];

  
  export default routes;
  