# Vehicle Rental Management System - Webapp

A modern frontend application for the Vehicle Rental Management System. It provides a full UI for managing customers, vehicles, and bookings through the API Gateway.

## Tech Stack

| Technology | Details |
|---|---|
| Next.js | 16.1.6 (App Router) |
| React | 19.2.3 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| ShadCN UI | Component library (Radix UI primitives) |
| React Hook Form | Form state management |
| Zod | Schema validation |
| Axios | HTTP client |
| Lucide React | Icon set |
| Sonner | Toast notifications |
| date-fns | Date formatting |

## Features

| Page | Path | Description |
|---|---|---|
| Dashboard | `/dashboard` | Stats overview, recent bookings, quick actions |
| Customers | `/customers` | Create, view, edit, delete customers with license image display |
| Vehicles | `/vehicles` | Create, view, edit, delete vehicles with daily rates |
| Bookings | `/bookings` | Create, view, edit, delete bookings with vehicle filtering |

## Project Structure

```
webapp/
├── app/
│   ├── layout.tsx            # Root layout (Sidebar + Header + Toaster)
│   ├── page.tsx              # Redirects to /dashboard
│   ├── dashboard/page.tsx    # Dashboard overview
│   ├── customers/page.tsx    # Customer management
│   ├── vehicles/page.tsx     # Vehicle management
│   └── bookings/page.tsx     # Booking management
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx       # Fixed navigation sidebar
│   │   └── header.tsx        # Sticky top header
│   ├── customers/
│   │   └── customer-form.tsx # Customer create/edit form
│   ├── vehicles/
│   │   └── vehicle-form.tsx  # Vehicle create/edit form
│   └── bookings/
│       └── booking-form.tsx  # Booking create/edit form
├── lib/
│   └── api.ts                # Axios API client (customerApi, vehicleApi, bookingApi)
├── types/
│   └── index.ts              # Shared TypeScript types
└── .env.local                # Environment variables
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:7000
```

## API Endpoints

- **Customer Service API**: `http://localhost:7000/api/v1/customers`
- **Vehicle Service API**: `http://localhost:7000/api/v1/vehicles`
- **Booking Service API**: `http://localhost:7000/api/v1/bookings`

