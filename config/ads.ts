// Video ad configuration
// Single source of truth for all ad settings

export const VIDEO_AD_CONFIG = {
  // Video URL (Streamable or any direct video link)
  videoUrl: "https://streamable.com/e/9ig05r",
  
  // Skip allowed after N seconds
  skipAfterSeconds: 5,
  
  // Show ad once every N hours
  showIntervalHours: 12,
  
  // localStorage key for timestamp
  storageKey: "mauribin_video_ad_last_shown",
  
  // Ad partner info
  adPartner: "Adsterra",
  publisherId: "5874939",
  campaignId: "29787519",
} as const;

export const VIP_POPUP_CONFIG = {
  // How often to show VIP popup (in milliseconds)
  // 0 = only once per session
  showIntervalMs: 0,
  storageKey: "mauribin_vip_popup_last_shown",
} as const;
