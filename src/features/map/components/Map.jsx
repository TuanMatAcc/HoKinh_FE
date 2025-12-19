import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Locate } from "lucide-react";

export default function InteractiveMap() {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const initMap = () => {
    if (!window.L || mapRef.current.children.length > 0) return;

    const newMap = window.L.map(mapRef.current, {
      zoomControl: false,
    }).setView([10.8231, 106.6297], 13);

    // Base map layer with labels
    window.L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap contributors © CARTO",
        maxZoom: 20,
        subdomains: "abcd",
      }
    ).addTo(newMap);

    // Add POI labels layer on top
    window.L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 20,
        subdomains: "abcd",
        pane: "shadowPane",
      }
    ).addTo(newMap);

    // Add custom zoom control on the right
    window.L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(newMap);

    newMap.on("click", (e) => {
      addMarker(e.latlng.lat, e.latlng.lng, newMap);
    });

    // Load POI markers when zoomed in
    newMap.on("zoomend moveend", () => {
      loadPOIMarkers(newMap);
    });

    setMap(newMap);
  };

  const loadPOIMarkers = async (mapInstance) => {
    const zoom = mapInstance.getZoom();

    // Only show POIs when zoomed in enough
    if (zoom < 15) {
      return;
    }

    const bounds = mapInstance.getBounds();
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const north = bounds.getNorth();
    const east = bounds.getEast();

    try {
      // Query Overpass API for POIs
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"restaurant|cafe|bar|fast_food|hospital|pharmacy|bank|atm|fuel|parking|school|university"](${south},${west},${north},${east});
          node["shop"~"supermarket|mall|convenience|department_store"](${south},${west},${north},${east});
          node["tourism"~"hotel|museum|attraction"](${south},${west},${north},${east});
          node["leisure"~"park|stadium|gym|sports_centre"](${south},${west},${north},${east});
        );
        out body 100;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await response.json();

      // Remove existing POI markers
      mapInstance.eachLayer((layer) => {
        if (layer.options && layer.options.isPOI) {
          mapInstance.removeLayer(layer);
        }
      });

      // Add new POI markers
      data.elements.forEach((poi) => {
        const icon = getPOIIcon(poi.tags);
        if (!icon) return;

        const poiMarker = window.L.marker([poi.lat, poi.lon], {
          icon: window.L.divIcon({
            className: "poi-marker",
            html: `
              <div style="
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                cursor: pointer;
              " title="${poi.tags.name || "POI"}">
                ${icon}
              </div>
              ${
                poi.tags.name
                  ? `<div style="
                position: absolute;
                top: 36px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                white-space: nowrap;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                font-weight: 500;
                color: #333;
                pointer-events: none;
              ">${poi.tags.name}</div>`
                  : ""
              }
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
          isPOI: true,
        });

        poiMarker.on("click", (e) => {
          window.L.popup()
            .setLatLng(e.latlng)
            .setContent(
              `
              <div style="min-width: 150px;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">
                  ${icon} ${poi.tags.name || "Unknown Place"}
                </div>
                <div style="font-size: 12px; color: #666; text-transform: capitalize;">
                  ${
                    poi.tags.amenity ||
                    poi.tags.shop ||
                    poi.tags.tourism ||
                    poi.tags.leisure ||
                    "Place"
                  }
                </div>
                ${
                  poi.tags.cuisine
                    ? `<div style="font-size: 11px; color: #999; margin-top: 2px;">Cuisine: ${poi.tags.cuisine}</div>`
                    : ""
                }
              </div>
            `
            )
            .openOn(mapInstance);
        });

        poiMarker.addTo(mapInstance);
      });
    } catch (error) {
      console.error("Error loading POIs:", error);
    }
  };

  const getPOIIcon = (tags) => {
    const amenity = tags.amenity;
    const shop = tags.shop;
    const tourism = tags.tourism;
    const leisure = tags.leisure;

    const iconMap = {
      restaurant: "🍽️",
      cafe: "☕",
      bar: "🍺",
      fast_food: "🍔",
      hospital: "🏥",
      pharmacy: "💊",
      bank: "🏦",
      atm: "🏧",
      fuel: "⛽",
      parking: "🅿️",
      school: "🏫",
      university: "🎓",
      supermarket: "🛒",
      mall: "🏬",
      convenience: "🏪",
      department_store: "🏬",
      hotel: "🏨",
      museum: "🏛️",
      attraction: "⭐",
      park: "🌳",
      stadium: "🏟️",
      gym: "💪",
      sports_centre: "🏋️",
    };

    return (
      iconMap[amenity] ||
      iconMap[shop] ||
      iconMap[tourism] ||
      iconMap[leisure] ||
      null
    );
  };

  const addMarker = (lat, lng, mapInstance) => {
    const targetMap = mapInstance || map;
    if (!targetMap) return;

    if (marker) {
      targetMap.removeLayer(marker);
    }

    // Custom marker icon
    const customIcon = window.L.divIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 32px;
            height: 32px;
            background: #EA4335;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          "></div>
          <div style="
            position: absolute;
            top: 6px;
            left: 6px;
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const newMarker = window.L.marker([lat, lng], {
      icon: customIcon,
    }).addTo(targetMap);

    setMarker(newMarker);
    setCoordinates({ lat, lng });
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const center = map ? map.getCenter() : { lat: 10.8231, lng: 106.6297 };

      // Search using multiple sources for better results
      const [nominatimResults, overpassResults] = await Promise.all([
        // Nominatim search (general places and addresses)
        fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `format=json&` +
            `q=${encodeURIComponent(query)}&` +
            `limit=5&` +
            `addressdetails=1&` +
            `viewbox=${center.lng - 0.5},${center.lat + 0.5},${
              center.lng + 0.5
            },${center.lat - 0.5}&` +
            `bounded=0`
        ).then((res) => res.json()),

        // Overpass API search (specific POIs and businesses)
        searchOverpass(query, center),
      ]);

      // Combine and deduplicate results
      const allResults = [...nominatimResults];

      // Add Overpass results if they're not duplicates
      overpassResults.forEach((overpassResult) => {
        const isDuplicate = nominatimResults.some((nomResult) => {
          const distance = Math.sqrt(
            Math.pow(parseFloat(nomResult.lat) - overpassResult.lat, 2) +
              Math.pow(parseFloat(nomResult.lon) - overpassResult.lon, 2)
          );
          return distance < 0.001; // ~100 meters
        });

        if (!isDuplicate) {
          allResults.push({
            lat: overpassResult.lat,
            lon: overpassResult.lon,
            display_name: overpassResult.name,
            name: overpassResult.name,
            type: overpassResult.type,
            class: overpassResult.class,
            address: overpassResult.address || {},
          });
        }
      });

      const enhancedResults = allResults.map((result) => ({
        ...result,
        category: getCategoryFromType(result.type, result.class),
      }));

      setSearchResults(enhancedResults.slice(0, 8));
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchOverpass = async (query, center) => {
    try {
      // Search for businesses, amenities, and leisure facilities matching the query
      const overpassQuery = `
        [out:json][timeout:10];
        (
          node["name"~"${query}",i](around:10000,${center.lat},${center.lng});
          way["name"~"${query}",i](around:10000,${center.lat},${center.lng});
          node["amenity"]["name"~"${query}",i](around:10000,${center.lat},${center.lng});
          node["leisure"]["name"~"${query}",i](around:10000,${center.lat},${center.lng});
          node["shop"]["name"~"${query}",i](around:10000,${center.lat},${center.lng});
          node["sport"]["name"~"${query}",i](around:10000,${center.lat},${center.lng});
        );
        out center 20;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
      });

      const data = await response.json();

      return data.elements
        .map((element) => {
          // For ways, use center coordinates
          const lat =
            element.lat || (element.center ? element.center.lat : null);
          const lon =
            element.lon || (element.center ? element.center.lon : null);

          if (!lat || !lon) return null;

          return {
            lat: lat,
            lon: lon,
            name: element.tags.name || "Unknown",
            type:
              element.tags.amenity ||
              element.tags.leisure ||
              element.tags.shop ||
              element.tags.sport ||
              "place",
            class: element.tags.amenity
              ? "amenity"
              : element.tags.leisure
              ? "leisure"
              : element.tags.shop
              ? "shop"
              : "other",
            address: {
              road: element.tags["addr:street"],
              city: element.tags["addr:city"] || "Ho Chi Minh City",
              country: "Vietnam",
            },
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Overpass search error:", error);
      return [];
    }
  };

  const getCategoryFromType = (type, className) => {
    const typeMap = {
      restaurant: "🍽️",
      cafe: "☕",
      hotel: "🏨",
      hospital: "🏥",
      school: "🏫",
      university: "🎓",
      bank: "🏦",
      atm: "🏧",
      pharmacy: "💊",
      supermarket: "🛒",
      shop: "🛍️",
      mall: "🏬",
      park: "🌳",
      museum: "🏛️",
      cinema: "🎬",
      theatre: "🎭",
      airport: "✈️",
      train_station: "🚂",
      bus_station: "🚌",
      fuel: "⛽",
      parking: "🅿️",
      place_of_worship: "⛪",
      church: "⛪",
      mosque: "🕌",
      temple: "🛕",
      gym: "💪",
      stadium: "🏟️",
      sports_centre: "🏋️",
      dojo: "🥋",
      sport: "⚽",
    };

    if (
      className === "amenity" ||
      className === "tourism" ||
      className === "shop"
    ) {
      return typeMap[type] || "📍";
    }
    if (className === "highway" || className === "railway") return "🛣️";
    if (className === "boundary" || className === "place") return "📍";

    return "📍";
  };

  const formatAddress = (result) => {
    const address = result.address || {};
    const parts = [];

    if (result.name && result.display_name.startsWith(result.name)) {
      parts.push(result.name);
    }

    if (address.road) parts.push(address.road);
    else if (address.suburb) parts.push(address.suburb);

    if (address.city) parts.push(address.city);
    else if (address.town) parts.push(address.town);
    else if (address.village) parts.push(address.village);

    if (address.country) parts.push(address.country);

    return parts.length > 0 ? parts.join(", ") : result.display_name;
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const selectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (map) {
      map.setView([lat, lng], 16);
      addMarker(lat, lng, map);
    }

    setSearchQuery(result.name || result.display_name.split(",")[0]);
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const copyCoordinates = () => {
    if (coordinates) {
      navigator.clipboard.writeText(`${coordinates.lat}, ${coordinates.lng}`);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map) {
            map.setView([latitude, longitude], 15);
            addMarker(latitude, longitude, map);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with Search */}
      <div className="relative z-20 bg-white shadow-md">
        <div className="p-3">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="relative flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Search className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search for places..."
                className="w-full pl-12 pr-12 py-3 outline-none rounded-lg text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => selectLocation(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-start gap-3"
                  >
                    <span className="text-2xl mt-0.5">{result.category}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {result.name || result.display_name.split(",")[0]}
                      </div>
                      <div className="text-sm text-gray-500 truncate mt-0.5">
                        {formatAddress(result)}
                      </div>
                      {result.type && (
                        <div className="text-xs text-gray-400 mt-1 capitalize">
                          {result.type.replace(/_/g, " ")}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0 z-0" />

        {/* My Location Button */}
        <button
          onClick={getCurrentLocation}
          className="absolute bottom-32 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10 border border-gray-200"
          title="My Location"
        >
          <Locate className="w-6 h-6 text-blue-500" />
        </button>

        {/* Coordinates Display */}
        {coordinates && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 max-w-xs">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Selected Location
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Latitude:</span>
                <span className="font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded">
                  {coordinates.lat.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Longitude:</span>
                <span className="font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded">
                  {coordinates.lng.toFixed(6)}
                </span>
              </div>
            </div>
            <button
              onClick={copyCoordinates}
              className="mt-4 w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
            >
              Copy Coordinates
            </button>
          </div>
        )}

        {/* Instructions */}
        {!coordinates && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 z-10 border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-medium">
              Search or click on the map to select a location
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
