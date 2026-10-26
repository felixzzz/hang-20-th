export interface MilestoneItem {
  year: string;
  title: string;
  chineseTitle: string;
  location?: string;
  chineseLocation?: string;
  description: string;
  chineseDescription: string;
  highlight: string;
  chineseHighlight: string;
  image?: string;
}

export interface GalleryPhotoItem {
  id: number | string;
  src: string;
  title: string;
  chineseTitle: string;
  category: "sejarah" | "kegiatan" | "kebersamaan";
  aspect?: "landscape" | "portrait" | "wide";
}

export interface SiteCmsConfig {
  cover: {
    badgeId: string;
    badgeZh: string;
    titleZh: string;
    titleId: string;
    subtitleId: string;
    subtitleZh: string;
    bgImage: string;
    logoImage: string;
    buttonTextId: string;
    buttonTextZh: string;
  };
  hero: {
    topBannerId: string;
    topBannerZh: string;
    cityId: string;
    cityZh: string;
    eventDateBadge: string;
    mainTitleZh: string;
    mainTitleId: string;
    themeZh: string;
    quoteId: string;
    quoteZh: string;
    countdownDate: string; // ISO string e.g. "2026-11-14T19:00:00+07:00"
  };
  wisdom: {
    sealZh: string;
    headingId: string;
    headingZh: string;
    subheadingId: string;
    subheadingZh: string;
    quoteId: string;
    quoteZh: string;
    closingId: string;
    closingZh: string;
  };
  event: {
    headingId: string;
    headingZh: string;
    subheadingId: string;
    subheadingZh: string;
    descriptionId: string;
    descriptionZh: string;
    dateTextId: string;
    dateTextZh: string;
    timeTextId: string;
    timeTextZh: string;
    timeNotesId: string;
    timeNotesZh: string;
    venueNameId: string;
    venueNameZh: string;
    address: string;
    dresscodeId: string;
    dresscodeZh: string;
    dresscodeNotesId: string;
    dresscodeNotesZh: string;
    googleMapsUrl: string;
  };
  donation: {
    headingId: string;
    headingZh: string;
    subheadingId: string;
    subheadingZh: string;
    descriptionId: string;
    descriptionZh: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    isReady: boolean;
    notes: string;
    qrisImage?: string;
  };
  location: {
    headingId: string;
    headingZh: string;
    subheadingId: string;
    subheadingZh: string;
    descriptionId: string;
    descriptionZh: string;
    fullAddress: string;
    googleMapsUrl: string;
    embedMapUrl: string;
  };
  shareMessage: {
    template: string;
  };
  milestones: MilestoneItem[];
  gallery: GalleryPhotoItem[];
}
