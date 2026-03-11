// src/components/pet-sitter/map/SitterMapControl.tsx
"use client";

import useUserLocate from "@/hooks/map/useUserLocate";
import ButtonLocate from "@/components/Map/ui/Button/ButtonLocate";
import ButtonZoomIn from "@/components/Map/ui/Button/ButtonZoomIn";
import ButtonZoomOut from "@/components/Map/ui/Button/ButtonZoomOut";
import ButtonFullscreen from "@/components/Map/ui/Button/ButtonFullscreen";
import MapPinHandler from "@/components/Map/ui/Marker/MapPinHandler";
import UserMarker from "@/components/Map/ui/PinIcon/UserMarker";
import { UseFormReturn } from "react-hook-form";
import { SitterProfileFormValues } from "@/lib/validations/sitterProfileValidation";
import {
  addressApi,
  Province,
  District,
  SubDistrict,
} from "@/services/api/addressApi";
import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";

interface MapControlsProps {
  sitterMethods?: UseFormReturn<SitterProfileFormValues>;
  provinces?: Province[];
  districts?: District[];
  subDistricts?: SubDistrict[];
  setExternalUpdate?: (isExternal: boolean) => void;
  setDistricts?: (districts: District[]) => void;
  setSubDistricts?: (subDistricts: SubDistrict[]) => void;
}

const FIELD_PRIORITY = {
  subdistrict: [
    "sub_district",
    "suburb",
    "suburban",
    "neighbourhood",
    "quarter",
  ],
  district: ["city_district", "district", "county", "borough"],
  state: ["state", "province", "region", "county"],
} as const;

function extract(
  address: Record<string, string> | null | undefined,
  field: keyof typeof FIELD_PRIORITY,
): string | null {
  if (!address) return null;
  for (const candidate of FIELD_PRIORITY[field]) {
    if (address[candidate]) return address[candidate];
  }
  return null;
}

/** Return ALL non-empty values from a Nominatim address object as candidates */
function allValues(
  address: Record<string, string> | null | undefined,
): string[] {
  if (!address) return [];
  return Object.values(address).filter((v) => v && typeof v === "string");
}

//Aggressive normalisation

const normalise = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[\u00a0\u1680\u2000-\u200b\u202f\u205f\u3000\ufeff]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* All the Thai+English admin suffixes we want to strip before matching */
const PROVINCE_SUFFIX = /\s*(province|จังหวัด|changwat)\s*/gi;
const DISTRICT_SUFFIX = /\s*(district|khet|amphoe|เขต|อำเภอ)\s*/gi;
const SUBDISTRICT_SUFFIX =
  /\s*(subdistrict|sub-district|khwaeng|tambon|แขวง|ตำบล)\s*/gi;

/* Try to match a candidate string against a lookup map.
 * Attempts (in order):
 *  1. Exact normalised match
 *  2. After stripping admin suffix
 *  3. Without any spaces (Thai concatenated names)
 *  4. Map key contains candidate OR candidate contains map key (substring)
 */
function matchName(
  candidates: string[],
  map: Map<string, any>,
  suffixPattern: RegExp,
): any | undefined {
  for (const raw of candidates) {
    if (!raw) continue;

    const exact = normalise(raw);
    if (map.has(exact)) return map.get(exact);

    // Strip suffix then try again
    const stripped = normalise(raw.replace(suffixPattern, ""));
    if (map.has(stripped)) return map.get(stripped);

    // No-space version (handles Thai compound names)
    const noSpace = stripped.replace(/\s/g, "");
    if (noSpace && map.has(noSpace)) return map.get(noSpace);

    // Substring match — candidate contains a map key, or map key contains candidate
    for (const [key, val] of map.entries()) {
      const cleanKey = key.replace(/\s/g, "");
      if (
        (stripped.length >= 3 && key.includes(stripped)) ||
        (stripped.length >= 3 && stripped.includes(key)) ||
        (noSpace.length >= 3 && cleanKey.includes(noSpace)) ||
        (noSpace.length >= 3 && noSpace.includes(cleanKey))
      ) {
        return val;
      }
    }
  }
  return undefined;
}

export default function MapControls({
  sitterMethods,
  provinces = [],
  districts = [],
  subDistricts = [],
  setExternalUpdate,
  setDistricts,
  setSubDistricts,
}: MapControlsProps) {
  const { userPosition, accuracy, loading, handleLocate } = useUserLocate();
  const map = useMap();

  // externalPinPosition — coordinates that come FROM the form and should be
  // displayed as a pin WITHOUT triggering a reverse-geocode back into the form.
  const [externalPinPosition, setExternalPinPosition] = useState<
    [number, number] | null
  >(null);

  // Watch for latitude/longitude already stored in the form (e.g. loaded from backend)
  const latitude = sitterMethods?.watch("latitude");
  const longitude = sitterMethods?.watch("longitude");

  // Guard against the form-watcher → geocode → setValue → watcher loop
  const isHandlingMapClick = useRef(false);

  // Tracks whether the lat/lng change came from forwardGeocode (form→map),
  // so the lat/lng watcher doesn't re-set externalPinPosition and re-block clicks.
  const isForwardGeocoding = useRef(false);

  // Form → Map: reflect backend / manual lat-lng in the pin
  useEffect(() => {
    if (!latitude || !longitude || latitude === 0 || longitude === 0) return;
    if (isHandlingMapClick.current) return; // map just set these, ignore
    if (isForwardGeocoding.current) return; // forwardGeocode already handled pin + flyTo

    const pos: [number, number] = [latitude, longitude];
    console.log(`📍 Form → Map: updating external pin`, pos);
    setExternalPinPosition(pos);
    map.flyTo(pos, 15, { animate: true, duration: 1 });
  }, [latitude, longitude]);

  // Form → Map: forward-geocode when select dropdowns change
  const lastGeocodeTime = useRef<number>(0);
  const MIN_GEOCODE_INTERVAL = 2_000;
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sitterMethods) return;

    const sub = sitterMethods.watch((value, { name }) => {
      if (
        name !== "provinceId" &&
        name !== "districtId" &&
        name !== "subDistrictId"
      )
        return;
      if (isHandlingMapClick.current) return;

      const { provinceId, districtId, subDistrictId } = value;

      // Build geocode query directly from selected dropdown names —
      // never reads the address text field so the user can type freely there.
      const selectedProvince = provinces.find(
        (p) => p.provinceId === Number(provinceId),
      );
      const selectedDistrict = districts.find(
        (d) => d.districtId === Number(districtId),
      );
      const selectedSubDistrict = subDistricts.find(
        (sd) => sd.subDistrictId === Number(subDistrictId),
      );

      const queryParts = [
        selectedSubDistrict?.name,
        selectedDistrict?.name,
        selectedProvince?.name,
      ].filter(Boolean);

      if (queryParts.length === 0) return;

      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      geocodeTimerRef.current = setTimeout(
        () => forwardGeocode(queryParts.join(", ")),
        500,
      );
    });

    return () => {
      sub.unsubscribe();
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    };
    // provinces/districts/subDistricts in deps so closure always has fresh lists
  }, [sitterMethods, provinces, districts, subDistricts]);

  const forwardGeocode = async (address: string) => {
    const now = Date.now();
    if (now - lastGeocodeTime.current < MIN_GEOCODE_INTERVAL) return;
    lastGeocodeTime.current = now;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5_000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            "User-Agent": "PetSitterApp/1.0",
            "Accept-Language": "en,th",
          },
          signal: controller.signal,
        },
      );
      clearTimeout(timer);
      if (!res.ok) return;

      const data = await res.json();
      if (!data?.length) return;

      const pos: [number, number] = [
        parseFloat(data[0].lat),
        parseFloat(data[0].lon),
      ];

      // Flag on so the lat/lng useEffect doesn't re-set externalPinPosition
      isForwardGeocoding.current = true;

      // Update form lat/lng WITHOUT triggering the map-click guard
      sitterMethods?.setValue("latitude", pos[0], { shouldDirty: true });
      sitterMethods?.setValue("longitude", pos[1], { shouldDirty: true });

      setExternalPinPosition(pos);
      map.flyTo(pos, 15, { animate: true, duration: 0.5 });

      // Clear externalPinPosition after the pin renders so that any subsequent
      // user click — even at the same coordinates — is NOT blocked by the guard
      // in MapPinHandler that skips onAddressSelect for external pins.
      setTimeout(() => {
        setExternalPinPosition(null);
        isForwardGeocoding.current = false;
      }, 100);
    } catch {
      // ignore abort / CORS errors
    }
  };

  // Map → Form: called by MapPinHandler after reverse-geocoding
  // Must be async: we fetch fresh districts/subDistricts for the matched
  // province/district so we are never relying on stale prop lists.
  const handleAddressSelect = async (
    address: string,
    addressDetails: Record<string, string> | null,
    coordinates: [number, number],
  ) => {
    if (!sitterMethods) return;

    // Mark that we are handling a map-click so watchers don't loop
    isHandlingMapClick.current = true;
    if (setExternalUpdate) setExternalUpdate(true);

    // Remove the form-driven pin; MapPinHandler will show its own click pin
    setExternalPinPosition(null);

    // lat / lng
    sitterMethods.setValue("latitude", coordinates[0], {
      shouldDirty: true,
      shouldValidate: true,
    });
    sitterMethods.setValue("longitude", coordinates[1], {
      shouldDirty: true,
      shouldValidate: true,
    });

    // postal code
    if (addressDetails?.postcode) {
      sitterMethods.setValue("postalCode", addressDetails.postcode, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    // province matching (from prop — provinces are always fully loaded)
    const provinceMap = new Map(provinces.map((p) => [normalise(p.name), p]));

    const provinceName = extract(addressDetails, "state");
    const districtName = extract(addressDetails, "district");
    const subDistrictName = extract(addressDetails, "subdistrict");

    console.log("🔍 Nominatim raw fields:", {
      provinceName,
      districtName,
      subDistrictName,
      addressDetails,
    });

    // Build province candidates — try extracted field first, then all values
    const provinceCandidates: string[] = [];
    if (provinceName) provinceCandidates.push(provinceName);
    const provinceMatch = address.match(/([^,]+) Province/);
    if (provinceMatch) provinceCandidates.unshift(provinceMatch[1].trim());

    let resolvedProvince: Province | undefined;
    let resolvedDistrict: District | undefined;
    let resolvedSubDistrict: SubDistrict | undefined;

    // Match province
    resolvedProvince = matchName(
      provinceCandidates,
      provinceMap,
      PROVINCE_SUFFIX,
    );

    if (!resolvedProvince) {
      resolvedProvince = matchName(
        allValues(addressDetails),
        provinceMap,
        PROVINCE_SUFFIX,
      );
    }

    if (!resolvedProvince) {
      sitterMethods.setValue("address", address, {
        shouldDirty: true,
        shouldValidate: true,
      });
      sitterMethods.trigger();
      setTimeout(() => {
        isHandlingMapClick.current = false;
        if (setExternalUpdate) setExternalUpdate(false);
      }, 300);
      return;
    }

    sitterMethods.setValue("provinceId", resolvedProvince.provinceId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    sitterMethods.setValue("districtId", 0, { shouldDirty: true });
    sitterMethods.setValue("subDistrictId", 0, { shouldDirty: true });

    // ── fetch fresh districts for this province ────────────────────────────
    let freshDistricts: District[] = [];
    try {
      freshDistricts = await addressApi.getDistrictsByProvince(
        resolvedProvince.provinceId,
      );
      // Update the dropdown options in the parent form immediately
      setDistricts?.(freshDistricts);
    } catch (e) {
      sitterMethods.setValue("address", address, {
        shouldDirty: true,
        shouldValidate: true,
      });
      sitterMethods.trigger();
      isHandlingMapClick.current = false;
      if (setExternalUpdate) setExternalUpdate(false);
      return;
    }

    const freshDistrictMap = new Map(
      freshDistricts.map((d) => [normalise(d.name), d]),
    );

    // Build district candidates
    const districtCandidates: string[] = [];
    if (districtName) districtCandidates.push(districtName);
    const dMatch = address.match(/([^,]+) District/);
    if (dMatch) districtCandidates.push(dMatch[1].trim());

    resolvedDistrict = matchName(
      districtCandidates,
      freshDistrictMap,
      DISTRICT_SUFFIX,
    );

    if (!resolvedDistrict) {
      resolvedDistrict = matchName(
        allValues(addressDetails),
        freshDistrictMap,
        DISTRICT_SUFFIX,
      );
    }

    if (resolvedDistrict) {
      sitterMethods.setValue("districtId", resolvedDistrict.districtId, {
        shouldDirty: true,
        shouldValidate: true,
      });
      sitterMethods.setValue("subDistrictId", 0, { shouldDirty: true });

      // fetch fresh sub-districts for this district
      let freshSubDistricts: SubDistrict[] = [];
      try {
        freshSubDistricts = await addressApi.getSubDistrictsByDistrict(
          resolvedDistrict.districtId,
        );
        // Update the dropdown options in the parent form immediately
        setSubDistricts?.(freshSubDistricts);
      } catch (e) {
        console.error("Failed to fetch sub-districts:", e);
      }

      if (freshSubDistricts.length > 0) {
        const freshSdMap = new Map(
          freshSubDistricts.map((sd) => [normalise(sd.name), sd]),
        );

        // Build sub-district candidates with strict priority order:
        // 1. Dedicated Nominatim field (sub_district, suburb, quarter etc.)
        // 2. Extract "X Subdistrict" pattern from formatted address string
        // 3. Individual raw fields from addressDetails (explicit, not allValues)
        const sdCandidates: string[] = [];

        // Priority 1: extracted field via FIELD_PRIORITY
        if (subDistrictName) sdCandidates.push(subDistrictName);

        // Priority 2: parse "X Subdistrict" / "แขวง X" / "ตำบล X" from the address string
        const sdFromAddress = address.match(
          /([^,]+?)\s+(?:Sub\s*district|Subdistrict|แขวง|ตำบล)/i,
        );
        if (sdFromAddress) sdCandidates.push(sdFromAddress[1].trim());

        // Priority 3: explicit raw Nominatim fields (avoids dragging in road/postcode)
        const rawFields = [
          "sub_district",
          "suburb",
          "suburban",
          "neighbourhood",
          "quarter",
        ] as const;
        for (const field of rawFields) {
          const val = (addressDetails as any)?.[field];
          if (val && !sdCandidates.includes(val)) sdCandidates.push(val);
        }

        // Deduplicate and remove any value that equals the already-matched district name
        // (prevents district name from accidentally matching as subdistrict)
        const districtNameNorm = resolvedDistrict
          ? normalise(resolvedDistrict.name)
          : "";
        const uniqueSdCandidates = [...new Set(sdCandidates)].filter(
          (c) => normalise(c) !== districtNameNorm,
        );

        resolvedSubDistrict = matchName(
          uniqueSdCandidates,
          freshSdMap,
          SUBDISTRICT_SUFFIX,
        );

        if (!resolvedSubDistrict) {
          // Filter allValues to exclude district/province names and short strings
          const provinceNameNorm = resolvedProvince
            ? normalise(resolvedProvince.name)
            : "";
          const filteredValues = allValues(addressDetails).filter((v) => {
            const n = normalise(v);
            return (
              n.length >= 3 &&
              n !== districtNameNorm &&
              n !== provinceNameNorm &&
              !/^\d+$/.test(n) // exclude postcodes
            );
          });
          resolvedSubDistrict = matchName(
            filteredValues,
            freshSdMap,
            SUBDISTRICT_SUFFIX,
          );
        }

        if (resolvedSubDistrict) {
          sitterMethods.setValue(
            "subDistrictId",
            resolvedSubDistrict.subDistrictId,
            { shouldDirty: true, shouldValidate: true },
          );

          // Use subdistrict postal code as the most accurate source
          if (resolvedSubDistrict.postCode) {
            sitterMethods.setValue(
              "postalCode",
              String(resolvedSubDistrict.postCode),
              { shouldDirty: true, shouldValidate: true },
            );
          }
        } else {
          console.warn("SubDistrict not matched");
        }
      }
    } else {
      console.warn("District not matched");
    }

    // address field is intentionally NOT updated by the map
    // The user owns the address text field and types their full detail there.
    // The map only updates: lat, lng, provinceId, districtId, subDistrictId, postalCode.

    sitterMethods.trigger();

    // Release guards synchronously — all setValue calls are done by this point
    isHandlingMapClick.current = false;
    if (setExternalUpdate) setExternalUpdate(false);
  };

  return (
    <>
      {userPosition && accuracy !== null && (
        <UserMarker position={userPosition} accuracy={accuracy} />
      )}

      <MapPinHandler
        onAddressSelect={handleAddressSelect}
        externalPinPosition={externalPinPosition}
        shouldClearPin={false}
      />

      <div className="absolute top-4 right-4 flex flex-row gap-2 z-1000">
        <ButtonLocate loading={loading} handleLocate={handleLocate} />
        <ButtonZoomIn />
        <ButtonZoomOut />
        <ButtonFullscreen />
      </div>
    </>
  );
}
