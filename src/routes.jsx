import BookingDetails from "./pages/BookingDetails";
import EditPricingScheme from "./pages/EditPricingScheme";
import GarageDetails from "./pages/GarageDetails";
import GarageImages from "./pages/GarageImages";
import GarageOverview from "./pages/GarageOverview";
import GaragePricing from "./pages/GaragePricing";

const routes = [
    {
      path: "/bookingdetails",
      component: BookingDetails,
      isNavLink: true,
      text: "Booking details"
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
  