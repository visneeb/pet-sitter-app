import { useState, useEffect } from "react";
import { getProfileApi } from "@/services/api/avatarApi";

type Profile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImgUrl: string;
  role: string;
};

export function useProfileImg() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfileApi();
      setProfile(response);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch profile image");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return { profile, loading, error, fetchProfile };
}
