import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// Mock data for bookings
const bookings = [
  { id: 1, name: 'John Doe', service: 'Valet', startDate: '03-11-2032', endDate: '21-11-2033' },
  // ... other bookings
];

// Booking List Component
const BookingList = () => {
  return (
    <div>
      <h1>Bookings</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <Link to={`/booking/${booking.id}`}>
              {booking.name} - {booking.service} - {booking.startDate} to {booking.endDate}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Booking Details Component
const BookingDetails = ({ match }) => {
  // Find the booking by id
  const booking = bookings.find((b) => b.id === parseInt(match.params.id));
  return (
    <div>
      <h1>Booking Details</h1>
      {booking ? (
        <div>
          <p>Name: {booking.name}</p>
          <p>Service: {booking.service}</p>
          <p>Start Date: {booking.startDate}</p>
          <p>End Date: {booking.endDate}</p>
        </div>
      ) : (
        <p>Booking not found.</p>
      )}
    </div>
  );
};

// App Component with routing
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={BookingList} />
        <Route path="/booking/:id" component={BookingDetails} />
        {/* ... other routes */}
      </Switch>
    </Router>
  );
};

export default App;