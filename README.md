# Quaid Projecteds

A Roblox limited item sales tracker and projection tool. Scrapes historical sales data, monitors real-time trades, and serves the data through a local API.

## Features

- Scrapes full sales history for all tracked limited items
- Monitors real-time sales and appends new data points
- Estimates sale prices from RAP (Recent Average Price) deltas
- Stores data persistently with SQLite via quick.db
- Exposes data through an Express API server (runs as a worker thread)

## Tech Stack

- **Node.js** (ES Modules)
- **Express** - API server
- **quick.db / better-sqlite3** - persistent storage
- **Superagent** - HTTP client

## Setup

```bash
npm install
cp .env.example .env  # configure environment variables
```

## Usage

```bash
npm start
```

The tracker will begin fetching item data and monitoring for new sales. The API server runs in a separate worker thread.
