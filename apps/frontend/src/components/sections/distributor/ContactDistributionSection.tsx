"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList, MapPin, Package, CheckCircle, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import api from "@/lib/api";

interface DistributorFormData {
  businessName: string;
  businessType: string;
  businessId: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  warehouseAddress: string;
  city: string;
  fullAddress: string;
  additionalNote: string;
  productInterests: string[];
  latitude?: number;
  longitude?: number;
}

const INITIAL_FORM: DistributorFormData = {
  businessName: "",
  businessType: "",
  businessId: "",
  contactPerson: "",
  phoneNumber: "",
  email: "",
  warehouseAddress: "",
  city: "",
  fullAddress: "",
  additionalNote: "",
  productInterests: [],
};

const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Dire Dawa', 'Adama (Nazret)', 'Mekelle', 'Gondar',
  'Hawassa', 'Bahir Dar', 'Jimma', 'Dessie', 'Jijiga',
  'Shashamane', 'Bishoftu (Debre Zeit)', 'Sodo', 'Arba Minch', 'Hosaena',
  'Harar', 'Dilla', 'Nekemte', 'Debre Birhan', 'Asella',
  'Debre Markos', 'Kombolcha', 'Debre Sina', 'Woldia', 'Gambela',
  'Axum', 'Lalibela', 'Ambo', 'Woldiya', 'Bonga',
];

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Addis Ababa': { lat: 9.03, lng: 38.74 },
  'Dire Dawa': { lat: 9.60, lng: 41.86 },
  'Adama (Nazret)': { lat: 8.54, lng: 39.27 },
  'Mekelle': { lat: 13.49, lng: 39.47 },
  'Gondar': { lat: 12.60, lng: 37.47 },
  'Hawassa': { lat: 7.05, lng: 38.49 },
  'Bahir Dar': { lat: 11.59, lng: 37.39 },
  'Jimma': { lat: 7.67, lng: 36.83 },
  'Dessie': { lat: 11.13, lng: 39.64 },
  'Jijiga': { lat: 9.35, lng: 42.80 },
  'Shashamane': { lat: 7.20, lng: 38.60 },
  'Bishoftu (Debre Zeit)': { lat: 8.75, lng: 38.98 },
  'Sodo': { lat: 6.86, lng: 37.76 },
  'Arba Minch': { lat: 6.03, lng: 37.55 },
  'Hosaena': { lat: 7.55, lng: 37.85 },
  'Harar': { lat: 9.31, lng: 42.12 },
  'Dilla': { lat: 6.41, lng: 38.31 },
  'Nekemte': { lat: 9.08, lng: 36.55 },
  'Debre Birhan': { lat: 9.68, lng: 39.53 },
  'Asella': { lat: 7.95, lng: 39.12 },
  'Debre Markos': { lat: 10.33, lng: 37.73 },
  'Kombolcha': { lat: 11.08, lng: 39.73 },
  'Debre Sina': { lat: 9.85, lng: 39.75 },
  'Woldia': { lat: 11.83, lng: 39.60 },
  'Gambela': { lat: 8.25, lng: 34.58 },
  'Axum': { lat: 14.13, lng: 38.72 },
  'Lalibela': { lat: 12.03, lng: 39.04 },
  'Ambo': { lat: 8.98, lng: 37.85 },
  'Woldiya': { lat: 11.83, lng: 39.60 },
  'Bonga': { lat: 7.27, lng: 36.23 }
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function findClosestCity(lat: number, lng: number): string {
  let closestCity = "Addis Ababa";
  let minDistance = Infinity;
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    const dist = getDistance(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city;
    }
  }
  return closestCity;
}

export default function ContactDistributionSection() {
  const t = useTranslations("Distributor");

  const [formData, setFormData] = useState<DistributorFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          api.get('/settings'),
          api.get('/products')
        ]);
        
        if (settingsRes.data && Array.isArray(settingsRes.data) && settingsRes.data.length > 0) {
          setBusinessTypes(settingsRes.data[0].businessTypes || []);
        }

        if (productsRes.data && Array.isArray(productsRes.data)) {
          const categories = productsRes.data.map((p: any) => p.category).filter(Boolean);
          setProductCategories(Array.from(new Set(categories)));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initMap = () => {
      const L = (window as any).L;
      if (!L || mapRef.current) return;

      const mapContainer = document.getElementById('distributor-map');
      if (!mapContainer) return;

      const map = L.map('distributor-map').setView([9.145, 40.489], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.address) {
            const address = data.address;
            // Search for any of our listed cities inside the full address display name or any sub-field of the address object
            let matchedCity = "";
            const addressValues = Object.values(address).map(val => String(val).toLowerCase());
            const displayNameLower = (data.display_name || "").toLowerCase();

            for (const cityOption of ETHIOPIAN_CITIES) {
              const cityOptionLower = cityOption.toLowerCase();
              // Split by parentheses to match alternate names (e.g. "Adama" or "Nazret")
              const subNames = cityOptionLower.split(/[\(\)]+/).map(s => s.trim()).filter(Boolean);
              
              const matchFound = subNames.some(subName => 
                displayNameLower.includes(subName) || addressValues.some(val => val.includes(subName))
              );

              if (matchFound) {
                matchedCity = cityOption;
                break;
              }
            }

            const finalCity = matchedCity || findClosestCity(lat, lng);

            setFormData(prev => ({
              ...prev,
              warehouseAddress: data.display_name,
              fullAddress: data.display_name,
              city: finalCity,
            }));
            
            setFormErrors(prev => {
              const next = { ...prev };
              delete next.warehouseAddress;
              delete next.fullAddress;
              delete next.city;
              return next;
            });
          }
        } catch (err) {
          console.error("Error geocoding:", err);
        }
      });

      mapRef.current = map;
    };

    if ((window as any).L) {
      initMap();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap();
    document.body.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const L = (window as any).L;
        
        if (mapRef.current && L) {
          mapRef.current.setView([lat, lng], 14);
          
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
          }

          setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.address) {
              const address = data.address;
              let matchedCity = "";
              const addressValues = Object.values(address).map(val => String(val).toLowerCase());
              const displayNameLower = (data.display_name || "").toLowerCase();

              for (const cityOption of ETHIOPIAN_CITIES) {
                const cityOptionLower = cityOption.toLowerCase();
                const subNames = cityOptionLower.split(/[\(\)]+/).map(s => s.trim()).filter(Boolean);
                
                const matchFound = subNames.some(subName => 
                  displayNameLower.includes(subName) || addressValues.some(val => val.includes(subName))
                );

                if (matchFound) {
                  matchedCity = cityOption;
                  break;
                }
              }

              const finalCity = matchedCity || findClosestCity(lat, lng);

              setFormData(prev => ({
                ...prev,
                warehouseAddress: data.display_name,
                fullAddress: data.display_name,
                city: finalCity,
              }));
              
              setFormErrors(prev => {
                const next = { ...prev };
                delete next.warehouseAddress;
                delete next.fullAddress;
                delete next.city;
                return next;
              });
            }
          } catch (err) {
            console.error("Error geocoding current location:", err);
          }
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        alert("Unable to retrieve your location. Please drop a pin manually on the map.");
      }
    );
  };

  const handleChange = (field: keyof DistributorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => {
      const updated = prev.productInterests.includes(productId)
        ? prev.productInterests.filter((p) => p !== productId)
        : [...prev.productInterests, productId];
      return { ...prev, productInterests: updated };
    });
    if (formErrors.productInterests) {
      setFormErrors((prev) => ({ ...prev, productInterests: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) errors.businessName = "Business name is required";
    if (!formData.businessType) errors.businessType = "Business type is required";
    if (!formData.businessId.trim()) errors.businessId = "Business ID is required";
    if (!formData.contactPerson.trim()) errors.contactPerson = "Contact person is required";
    
    const phoneClean = formData.phoneNumber.replace(/\s+/g, '');
    if (!phoneClean) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^(\+251|0)(9\d{8}|11\d{7})$/.test(phoneClean)) {
      errors.phoneNumber = "Invalid Ethiopian phone number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.warehouseAddress.trim()) errors.warehouseAddress = "Warehouse address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.fullAddress.trim()) errors.fullAddress = "Full address is required";
    
    if (formData.productInterests.length === 0) {
      errors.productInterests = "Please select at least one product category";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (firstErrorField === 'productInterests') {
        const prodElement = document.getElementById('products-section');
        if (prodElement) prodElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("sending");
    try {
      await api.post("/distributor-applications", formData);
      setStatus("success");
      setFormData(INITIAL_FORM);
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "border border-[#D1D5DC] rounded-[10px] p-3 text-[16px] placeholder:text-[#8A8C8A] focus:outline-none focus:border-[#23B349] focus:ring-1 focus:ring-[#23B349]";
  const fontOutfit = { fontFamily: "var(--font-outfit), 'Outfit', sans-serif" };
  const fontFunnel = { fontFamily: "var(--font-funnel-display), 'Funnel Display', sans-serif" };

  return (
    <section className="w-full bg-white py-16 lg:py-24" id="contact-form">
      <div className="mx-auto flex flex-col lg:flex-row items-start lg:justify-between gap-12 lg:gap-16 max-w-[1920px] px-4 sm:px-6 lg:px-[128px]">
        {/* Left Side: Text */}
        <div className="flex flex-col gap-6 w-full lg:max-w-[545px]">
          <h2
            style={{
              fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: "0.9",
              letterSpacing: "-0.02em",
              color: "#23B349",
            }}
          >
            Apply for Distribution Partnership
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: "1.25",
              letterSpacing: "-0.004em",
              color: "#404040",
            }}
          >
            Submit your business profile to become an authorized distributor. Every application is carefully reviewed to ensure strong partnership alignment.
          </p>
        </div>

        {/* Right Side: Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-[896px] bg-white border border-[#E8E8E8] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] rounded-[10px] p-6 sm:p-8 flex flex-col gap-10"
        >
          
          {/* Section 1: Business Information */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#C8F7D5] rounded-[10px]">
                <ClipboardList size={18} color="#23B349" strokeWidth={2.5} />
              </div>
              <h3 
                className="font-medium text-[24px] text-[#333733] tracking-[-0.004em]"
                style={fontFunnel}
              >
                1. Business Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Business Name *</span>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.businessName && <p className="text-[13px] text-red-500 mt-1">{formErrors.businessName}</p>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Business Type *</span>
                <div className="relative">
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    className={`${inputCls} w-full appearance-none ${!formData.businessType ? 'text-[#8A8C8A]' : 'text-[#404040]'}`}
                    style={fontOutfit}
                  >
                    <option value="" disabled>Select business type</option>
                    {businessTypes.map(t => <option key={t} value={t} className="text-[#404040]">{t}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-[#8A8C8A]" />
                  </div>
                </div>
                {formErrors.businessType && <p className="text-[13px] text-red-500 mt-1">{formErrors.businessType}</p>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Business ID *</span>
                <input
                  type="text"
                  name="businessId"
                  placeholder="Enter business ID"
                  value={formData.businessId}
                  onChange={(e) => handleChange("businessId", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.businessId && <p className="text-[13px] text-red-500 mt-1">{formErrors.businessId}</p>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Business Contact Person *</span>
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.contactPerson && <p className="text-[13px] text-red-500 mt-1">{formErrors.contactPerson}</p>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Phone Number *</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+251 911 000 0000"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.phoneNumber && <p className="text-[13px] text-red-500 mt-1">{formErrors.phoneNumber}</p>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Email Address *</span>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.email && <p className="text-[13px] text-red-500 mt-1">{formErrors.email}</p>}
              </label>
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#D2FFD6] rounded-[10px]">
                <MapPin size={18} color="#23B349" strokeWidth={2.5} />
              </div>
              <h3 
                className="font-medium text-[24px] text-[#333733] tracking-[-0.004em]"
                style={fontFunnel}
              >
                2. Location Details
              </h3>
            </div>

            {/* Map Integration */}
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-[300px]">
                <div id="distributor-map" className="w-full h-full rounded-[10px] border border-[#D1D5DC] z-0"></div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="absolute bottom-4 right-4 bg-[#23B349] hover:bg-[#1f9f41] text-white font-medium text-[13px] px-4 py-2 rounded-full shadow-md z-[1000] flex items-center gap-1.5 transition-colors cursor-pointer"
                  style={fontOutfit}
                >
                  <MapPin size={14} />
                  Use Current Location
                </button>
              </div>
              <p className="text-[13px] text-[#8A8C8A]" style={fontOutfit}>Click on the map to pin your warehouse location</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Warehouse Address *</span>
                <input
                  type="text"
                  name="warehouseAddress"
                  placeholder="Enter warehouse address"
                  value={formData.warehouseAddress}
                  onChange={(e) => handleChange("warehouseAddress", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.warehouseAddress && <p className="text-[13px] text-red-500 mt-1">{formErrors.warehouseAddress}</p>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>City *</span>
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={`${inputCls} w-full appearance-none ${!formData.city ? 'text-[#8A8C8A]' : 'text-[#404040]'}`}
                    style={fontOutfit}
                  >
                    <option value="" disabled>Select city</option>
                    {ETHIOPIAN_CITIES.map(c => <option key={c} value={c} className="text-[#404040]">{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-[#8A8C8A]" />
                  </div>
                </div>
                {formErrors.city && <p className="text-[13px] text-red-500 mt-1">{formErrors.city}</p>}
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Full Address *</span>
                <input
                  type="text"
                  name="fullAddress"
                  placeholder="Enter full address"
                  value={formData.fullAddress}
                  onChange={(e) => handleChange("fullAddress", e.target.value)}
                  className={inputCls}
                  style={fontOutfit}
                />
                {formErrors.fullAddress && <p className="text-[13px] text-red-500 mt-1">{formErrors.fullAddress}</p>}
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-[16px] text-[#404040]" style={fontOutfit}>Additional Note</span>
                <textarea
                  name="additionalNote"
                  rows={3}
                  placeholder="Add any additional notes here (optional)"
                  value={formData.additionalNote}
                  onChange={(e) => handleChange("additionalNote", e.target.value)}
                  className={`${inputCls} resize-none`}
                  style={fontOutfit}
                />
              </label>
            </div>
          </div>

          {/* Section 3: Products Interest */}
          <div className="flex flex-col gap-6" id="products-section">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-[#D3FFDB] rounded-[10px]">
                  <Package size={18} color="#23B349" strokeWidth={2.5} />
                </div>
                <h3 
                  className="font-medium text-[24px] text-[#333733] tracking-[-0.004em]"
                  style={fontFunnel}
                >
                  3. Products Interest
                </h3>
              </div>
              <p className="font-normal text-[14px] text-[#333733]" style={fontOutfit}>
                Select the product categories you are interested in distributing
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[16px] text-[#404040]" style={fontOutfit}>Product Categories *</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productCategories.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-3 border rounded-[10px] p-3 cursor-pointer transition-colors ${
                      formData.productInterests.includes(cat)
                        ? "border-[#23B349] bg-[#23B349]/5"
                        : "border-[#E5E7EB] hover:border-[#23B349]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.productInterests.includes(cat)}
                      onChange={() => handleProductToggle(cat)}
                      className="w-4 h-4 rounded-[2px] border-[#8A8C8A] text-[#23B349] focus:ring-[#23B349]"
                    />
                    <span className="font-medium text-[14px] text-[#404040]" style={fontOutfit}>{cat}</span>
                  </label>
                ))}
              </div>
              {formErrors.productInterests && <p className="text-[13px] text-red-500 mt-1">{formErrors.productInterests}</p>}
            </div>
          </div>

          {/* Status feedback */}
          {status === "success" && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-[10px] px-4 py-3">
              <CheckCircle className="w-5 h-5 text-[#23B349] shrink-0" />
              <p className="text-[14px] text-green-800" style={fontOutfit}>
                Application submitted successfully! We&apos;ll review it and get back to you soon.
              </p>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-[14px] text-red-700" style={fontOutfit}>
                Something went wrong. Please try again.
              </p>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end pt-6 border-t border-[#E5E7EB] mt-2">
            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="bg-[#23B349] text-white font-medium text-[16px] px-8 py-3 rounded-full hover:bg-[#1f9f41] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              style={fontOutfit}
            >
              {status === "sending" ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
              ) : status === "success" ? (
                <><CheckCircle className="w-5 h-5" /> Submitted!</>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
