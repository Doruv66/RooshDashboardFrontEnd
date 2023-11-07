import BookingDetails from "./pages/BookingDetails";
import BookingHistory from "./pages/BookingHistory";
import EditPricingScheme from "./pages/EditPricingScheme";
import GarageDetails from "./pages/GarageDetails";
import GarageImages from "./pages/GarageImages";
import GarageOverview from "./pages/GarageOverview";
import GaragePricing from "./pages/GaragePricing";

const routes = [
    {
      path: "/bookinghistory",
      component: BookingHistory,
      isNavLink: true,
      text: "Booking history"
    },
    {
      path: "/editpricingscheme",
      component: EditPricingScheme,
      isNavLink: true,
      text: "Edit pricing scheme"
    },
    {
      path: "/garagedetails",
      component: GarageDetails,
      isNavLink: true,
      text: "Garage details"
    },
    {
        path: "/garageimages",
        component: GarageImages,
        isNavLink: true,
        text: "Garage images"
    },
    {
        path: "/garageoverview",
        component: GarageOverview,
        isNavLink: true,
        text: "Garage overview"
    },
    {
        path: "/garagepricing",
        component: GaragePricing,
        isNavLink: true,
        text: "Garage pricing"
    },
  ];
  
  export default routes;
  