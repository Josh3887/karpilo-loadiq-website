# Fuel National Average Website Signal

## Purpose

The public website displays a national diesel average because fuel pressure is central to LoadIQ positioning: CPM, RPM, deadhead exposure, gross-to-net reality, and load profitability can all move when fuel changes.

This is a market signal, not a guaranteed pump price.

## Data Source

The website route `src/app/api/fuel/national-diesel-average/route.ts` requests the U.S. Energy Information Administration weekly national on-highway diesel reference when `EIA_API_KEY` is configured.

Default base URL:

```text
https://api.eia.gov/v2
```

Optional environment variables:

```text
EIA_API_KEY
EIA_BASE_URL
```

## Fallback Behavior

The homepage component `src/components/fuel/current-national-diesel-average-card.tsx` does not hardcode a live price. If the API key, EIA response, or network request is unavailable, the component displays a safe unavailable state:

```text
Diesel average temporarily unavailable
Connect fuel data source to enable live national average.
```

## Caching

Successful EIA responses are returned with:

```text
Cache-Control: public, max-age=900, stale-while-revalidate=3600
```

Unavailable fallback responses use a shorter cache:

```text
Cache-Control: public, max-age=120, stale-while-revalidate=600
```

The EIA series is weekly and delayed, so the website should present the value as an informational national reference only.
