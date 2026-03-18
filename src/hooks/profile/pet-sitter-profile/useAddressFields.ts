import { useState, useCallback, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  addressApi,
  Province,
  District,
  SubDistrict,
} from "@/services/api/addressApi";
import { SitterProfileFormValues } from "@/lib/validations/sitterProfileValidation";
import { PetSitterDetail } from "@/services/api/sitterApi";

export function useAddressFields(
  methods: UseFormReturn<SitterProfileFormValues>,
) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);

  const isPopulating = useRef(false);
  const isExternalUpdate = useRef(false);

  const setExternalUpdate = useCallback((isExternal: boolean) => {
    isExternalUpdate.current = isExternal;
  }, []);

  useEffect(() => {
    addressApi
      .getProvinces()
      .then(setProvinces)
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "provinceId") {
        if (isPopulating.current || isExternalUpdate.current) return;
        const provinceId = value.provinceId as number;
        if (provinceId > 0) {
          addressApi
            .getDistrictsByProvince(provinceId)
            .then(setDistricts)
            .catch(() => setDistricts([]));
        } else {
          setDistricts([]);
        }
        methods.setValue("districtId", 0);
        methods.setValue("subDistrictId", 0);
      }

      if (name === "districtId") {
        if (isPopulating.current || isExternalUpdate.current) return;
        const districtId = value.districtId as number;
        if (districtId > 0) {
          addressApi
            .getSubDistrictsByDistrict(districtId)
            .then(setSubDistricts)
            .catch(() => setSubDistricts([]));
        } else {
          setSubDistricts([]);
        }
        methods.setValue("subDistrictId", 0);
      }

      if (name === "subDistrictId") {
        if (isPopulating.current || isExternalUpdate.current) return;
        const subDistrictId = value.subDistrictId as number;
        if (subDistrictId > 0) {
          const selected = subDistricts.find(
            (sd) => sd.subDistrictId === subDistrictId,
          );
          methods.setValue(
            "postalCode",
            selected ? String(selected.postCode) : "",
            {
              shouldDirty: true,
              shouldValidate: true,
            },
          );
        } else {
          methods.setValue("postalCode", "", {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, subDistricts]);

  const populateAddressFields = useCallback(
    async (data: PetSitterDetail) => {
      if (provinces.length === 0) return;
      isPopulating.current = true;

      try {
        if (!data.province) return;
        const matchedProvince = provinces.find(
          (p) => p.name.toLowerCase() === data.province!.toLowerCase(),
        );
        if (!matchedProvince) return;
        methods.setValue("provinceId", matchedProvince.provinceId, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });

        const fetchedDistricts = await addressApi.getDistrictsByProvince(
          matchedProvince.provinceId,
        );
        setDistricts(fetchedDistricts);
        if (!data.district || !fetchedDistricts.length) return;

        const matchedDistrict = fetchedDistricts.find(
          (d) => d.name.toLowerCase() === data.district!.toLowerCase(),
        );
        if (!matchedDistrict) return;
        methods.setValue("districtId", matchedDistrict.districtId, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });

        const fetchedSubDistricts = await addressApi.getSubDistrictsByDistrict(
          matchedDistrict.districtId,
        );
        setSubDistricts(fetchedSubDistricts);
        if (!data.subDistrict || !fetchedSubDistricts.length) return;

        const matchedSubDistrict = fetchedSubDistricts.find(
          (sd) => sd.name.toLowerCase() === data.subDistrict!.toLowerCase(),
        );
        if (!matchedSubDistrict) return;
        methods.setValue("subDistrictId", matchedSubDistrict.subDistrictId, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        methods.setValue(
          "postalCode",
          String(data.postCode || matchedSubDistrict.postCode || ""),
          {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          },
        );
      } finally {
        setTimeout(() => {
          isPopulating.current = false;
        }, 0);
      }
    },
    [provinces, methods],
  );

  return {
    provinces,
    districts,
    subDistricts,
    setDistricts,
    setSubDistricts,
    setExternalUpdate,
    populateAddressFields,
  };
}
