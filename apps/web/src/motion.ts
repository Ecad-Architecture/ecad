// Product policy: keep site animations enabled regardless of the OS preference.
export const REDUCE_SITE_MOTION = false;

export const SMOOTH_EASE = [0.45, 0, 0.55, 1] as const;

export const MOTION_DURATION = {
  header: 0.35,
  page: 0.5,
  project: 0.65,
  projectArrival: 0.45,
  projectFade: 0.25,
} as const;
