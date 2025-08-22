// Mock data for development and testing when GBFS endpoints are not accessible

export const mockStationInformation = [
  {
    "station_id": "72",
    "name": "W 52 St & 11 Ave",
    "short_name": "6926.01",
    "lat": 40.76727216,
    "lon": -73.99392888,
    "region_id": "71",
    "rental_methods": ["KEY", "CREDITCARD"],
    "capacity": 39,
    "rental_url": "http://app.citibikenyc.com/S6Lr/IBV092JufD?station_id=72",
    "electric_bike_surcharge_waiver": false,
    "has_kiosk": true,
    "external_id": "66db237e-0aca-11e7-82f6-3863bb44ef7c"
  },
  {
    "station_id": "79",
    "name": "Franklin St & W Broadway",
    "short_name": "5430.08",
    "lat": 40.71911552,
    "lon": -74.00666661,
    "region_id": "71",
    "rental_methods": ["KEY", "CREDITCARD"],
    "capacity": 33,
    "rental_url": "http://app.citibikenyc.com/S6Lr/IBV092JufD?station_id=79",
    "electric_bike_surcharge_waiver": false,
    "has_kiosk": true,
    "external_id": "66db269c-0aca-11e7-82f6-3863bb44ef7c"
  },
  {
    "station_id": "82",
    "name": "St James Pl & Pearl St",
    "short_name": "5167.04",
    "lat": 40.71117416,
    "lon": -74.00016545,
    "region_id": "71",
    "rental_methods": ["KEY", "CREDITCARD"],
    "capacity": 27,
    "rental_url": "http://app.citibikenyc.com/S6Lr/IBV092JufD?station_id=82",
    "electric_bike_surcharge_waiver": false,
    "has_kiosk": true,
    "external_id": "66db2788-0aca-11e7-82f6-3863bb44ef7c"
  },
  {
    "station_id": "83",
    "name": "Atlantic Ave & Fort Greene Pl",
    "short_name": "4354.04",
    "lat": 40.68382604,
    "lon": -73.97632328,
    "region_id": "71",
    "rental_methods": ["KEY", "CREDITCARD"],
    "capacity": 62,
    "rental_url": "http://app.citibikenyc.com/S6Lr/IBV092JufD?station_id=83",
    "electric_bike_surcharge_waiver": false,
    "has_kiosk": true,
    "external_id": "66db27ee-0aca-11e7-82f6-3863bb44ef7c"
  },
  {
    "station_id": "116",
    "name": "W 17 St & 8 Ave",
    "short_name": "6085.02",
    "lat": 40.74177603,
    "lon": -74.00149746,
    "region_id": "71",
    "rental_methods": ["KEY", "CREDITCARD"],
    "capacity": 39,
    "rental_url": "http://app.citibikenyc.com/S6Lr/IBV092JufD?station_id=116",
    "electric_bike_surcharge_waiver": false,
    "has_kiosk": true,
    "external_id": "66db2ca8-0aca-11e7-82f6-3863bb44ef7c"
  }
]

export const mockStationStatus = [
  {
    "station_id": "72",
    "num_bikes_available": 17,
    "num_bikes_disabled": 1,
    "num_docks_available": 21,
    "num_docks_disabled": 0,
    "is_installed": 1,
    "is_renting": 1,
    "is_returning": 1,
    "last_reported": Date.now() - 60000,
    "num_ebikes_available": 5,
    "legacy_id": "72"
  },
  {
    "station_id": "79",
    "num_bikes_available": 12,
    "num_bikes_disabled": 0,
    "num_docks_available": 21,
    "num_docks_disabled": 0,
    "is_installed": 1,
    "is_renting": 1,
    "is_returning": 1,
    "last_reported": Date.now() - 120000,
    "num_ebikes_available": 3,
    "legacy_id": "79"
  },
  {
    "station_id": "82",
    "num_bikes_available": 3,
    "num_bikes_disabled": 1,
    "num_docks_available": 23,
    "num_docks_disabled": 0,
    "is_installed": 1,
    "is_renting": 1,
    "is_returning": 1,
    "last_reported": Date.now() - 180000,
    "num_ebikes_available": 1,
    "legacy_id": "82"
  },
  {
    "station_id": "83",
    "num_bikes_available": 25,
    "num_bikes_disabled": 2,
    "num_docks_available": 35,
    "num_docks_disabled": 0,
    "is_installed": 1,
    "is_renting": 1,
    "is_returning": 1,
    "last_reported": Date.now() - 90000,
    "num_ebikes_available": 8,
    "legacy_id": "83"
  },
  {
    "station_id": "116",
    "num_bikes_available": 0,
    "num_bikes_disabled": 0,
    "num_docks_available": 39,
    "num_docks_disabled": 0,
    "is_installed": 1,
    "is_renting": 1,
    "is_returning": 1,
    "last_reported": Date.now() - 45000,
    "num_ebikes_available": 0,
    "legacy_id": "116"
  }
]

export const createMockSnapshot = () => {
  const totalBikes = mockStationStatus.reduce((sum, s) => sum + s.num_bikes_available, 0)
  const totalDocks = mockStationStatus.reduce((sum, s) => sum + s.num_docks_available, 0)
  const activeStations = mockStationStatus.filter(s => s.is_renting === 1 && s.is_returning === 1).length
  
  return {
    id: Date.now(),
    timestamp: Date.now(),
    metrics: {
      totalStations: mockStationInformation.length,
      activeStations,
      totalBikes,
      totalDocks,
      utilization: totalBikes / (totalBikes + totalDocks) * 100
    },
    stationSample: mockStationStatus.map(s => ({
      station_id: s.station_id,
      bikes: s.num_bikes_available,
      docks: s.num_docks_available,
      is_active: s.is_renting === 1 && s.is_returning === 1
    }))
  }
}