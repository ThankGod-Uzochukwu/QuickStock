# QuickStock

Modern inventory and cart flow built with Expo Router + Redux.

## Features

- Product listing with search, filters, and responsive grid
- Product detail page with add-to-cart
- Cart with quantity controls and live totals
- Checkout with form validation and mock payment
- Order confirmation and persisted last order
- Mock network failures with graceful error handling

## Screens

- Products (list + search/filter)
- Product Details
- Cart
- Checkout
- Order Confirmation

## Data Flow

- Products, cart, and last order are stored in Redux
- Local persistence uses Expo FileSystem
- App bootstrap loads products, cart, and last order on launch

## Running the App

- `npm install`
- `npm run start`

## Notes

- The mock order call simulates network latency and occasional failures.
- Product catalog is seeded on first run if no products exist.
