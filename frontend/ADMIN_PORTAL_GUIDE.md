# Admin Portal Guide

## Overview

The Admin Portal provides a complete management interface for the AJH Sports booking system. Administrators can manage events, coaches, users, and bookings without needing to access the database directly.

## Accessing the Admin Portal

1. **Log in** with an admin account (user with `role = 'admin'` in the database)
2. Navigate to `/admin` in your browser, or use the direct URL: `http://localhost:3000/admin`

### Creating an Admin User

To create an admin user, you need to update the database:

```sql
-- After signing up a user, update their role:
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

## Features

### 1. Admin Dashboard (`/admin`)

- **Overview Statistics**: View total counts of events, coaches, users, and bookings
- **Quick Navigation**: Access cards to navigate to different management sections

### 2. Events Management (`/admin/events`)

**Features:**
- View all events in a table
- Create new events with:
  - Event name
  - Description
  - Date and time
  - Maximum players
  - Price (AUD)
- Edit existing events
- Delete events

**Usage:**
1. Click "Manage Events" from the dashboard
2. Click "+ Add Event" to create a new event
3. Fill in the form and click "Create Event"
4. Use "Edit" button to modify existing events
5. Use "Delete" button to remove events (with confirmation)

### 3. Coaches Management (`/admin/coaches`)

**Features:**
- View all coaches in a table
- Create new coaches with:
  - Coach name
  - Specialty (e.g., Tennis, Table Tennis)
  - Hourly rate (AUD)
  - Availability schedule (day, start time, end time)
- Edit existing coaches
- Delete coaches

**Usage:**
1. Click "Manage Coaches" from the dashboard
2. Click "+ Add Coach" to create a new coach
3. Fill in the form
4. Add availability slots by selecting day, start time, and end time, then clicking "Add Availability Slot"
5. Use "Edit" to modify coaches
6. Use "Delete" to remove coaches (with confirmation)

### 4. Users Management (`/admin/users`)

**Features:**
- View all users in a table
- See user details: ID, name, email, phone, location, role
- Delete users (admin users cannot be deleted)

**Usage:**
1. Click "Manage Users" from the dashboard
2. View all registered users
3. Use "Delete" button to remove users (admin users are protected)

### 5. Bookings Management (`/admin/bookings`)

**Features:**
- View all event bookings and coach bookings in separate tabs
- See booking details:
  - Booking ID
  - Event/Coach name
  - User information
  - Date and time
  - Status (pending, confirmed, cancelled)
  - Payment status (pending, paid, failed)
- Update booking status using dropdown selectors

**Usage:**
1. Click "Manage Bookings" from the dashboard
2. Switch between "Event Bookings" and "Coach Bookings" tabs
3. Use the status dropdown to update booking status:
   - **Pending**: Booking created but not confirmed
   - **Confirmed**: Booking is confirmed
   - **Cancelled**: Booking has been cancelled

## Design Consistency

The admin portal uses the same design system as the main application:
- **Colors**: Primary dark (#030213), Accent yellow (#e0cb23)
- **Fonts**: Inter font family
- **Components**: Same UI components (cards, buttons, tables, dialogs)
- **Styling**: Consistent with existing frontend design

## Security

- **Role-Based Access**: Only users with `role = 'admin'` can access the portal
- **Authentication Required**: Must be logged in with a valid JWT token
- **Automatic Redirect**: Non-admin users are redirected with an error message
- **Token Validation**: Token is validated on every admin page access

## Error Handling

- **Success Notifications**: Green toast notifications for successful operations
- **Error Notifications**: Red toast notifications for errors
- **Confirmation Dialogs**: Delete operations require confirmation
- **Loading States**: Loading indicators while fetching data

## API Integration

All admin operations use the existing backend admin routes:
- `GET /api/events` - List events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)
- `GET /api/events/bookings/all` - Get all event bookings (admin)
- `GET /api/coaches` - List coaches
- `POST /api/coaches` - Create coach (admin)
- `PUT /api/coaches/:id` - Update coach (admin)
- `DELETE /api/coaches/:id` - Delete coach (admin)
- `GET /api/coaches/bookings/all` - Get all coach bookings (admin)
- `PUT /api/coaches/bookings/status` - Update booking status (admin)
- `GET /api/users/all` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Troubleshooting

### "Access Denied" Error
- Ensure you're logged in with an admin account
- Check that the user's role is set to 'admin' in the database
- Verify your JWT token is valid (try logging out and back in)

### "Failed to load" Errors
- Check that the backend server is running on port 5001
- Verify your API URL in `.env` file: `VITE_API_URL=http://localhost:5001/api`
- Check browser console for detailed error messages

### Toast Notifications Not Showing
- Ensure the `Toaster` component is added to `App.tsx` (already included)
- Check that `sonner` package is installed

## Notes

- **No Frontend Changes**: All existing user-facing functionality remains unchanged
- **No Backend Route Modifications**: Only new admin endpoints were added (not modifying existing user routes)
- **Database Access**: Admin can manage everything through the UI without touching the database
- **Real-time Updates**: Changes are reflected immediately after save/delete operations

