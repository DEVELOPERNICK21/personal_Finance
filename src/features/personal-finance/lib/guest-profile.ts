const PROFILE_KEY = "personal-finance-profile";

export interface GuestProfile {
  displayName: string;
  level: number;
  onboardingComplete: boolean;
  theme?: "light" | "dark" | "system";
}

const DEFAULT_PROFILE: GuestProfile = {
  displayName: "",
  level: 0,
  onboardingComplete: false,
};

export function loadGuestProfile(): GuestProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveGuestProfile(profile: Partial<GuestProfile>): GuestProfile {
  const next = { ...loadGuestProfile(), ...profile };
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }
  return next;
}

export function markOnboardingComplete(displayName?: string): GuestProfile {
  return saveGuestProfile({
    onboardingComplete: true,
    displayName: displayName ?? loadGuestProfile().displayName,
  });
}

export const GUEST_UID = "guest-local";
