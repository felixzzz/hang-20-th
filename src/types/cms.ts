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
  navbar: {
    brandTitleId: string;
    brandTitleZh: string;
    brandSubtitleId: string;
    brandSubtitleZh: string;
  };
  cover: {
    badgeId: string;
    badgeZh: string;
    titleZh: string;
    titleId: string;
    subtitleId: string;
    subtitleZh: string;
    guestPrefixId: string;
    guestPrefixZh: string;
    inviteTextId: string;
    inviteTextZh: string;
    bgImage: string;
    logoImage: string;
    buttonTextId: string;
    buttonTextZh: string;
    buttonSubtextId: string;
    buttonSubtextZh: string;
  };
  hero: {
    topBannerSealZh: string;
    topBannerId: string;
    topBannerZh: string;
    cityId: string;
    cityZh: string;
    eventDateBadge: string;
    sloganId: string;
    sloganZh: string;
    mainTitleZh: string;
    mainTitleId: string;
    themeZh: string;
    quoteId: string;
    quoteZh: string;
    storyParagraphId: string;
    storyParagraphZh: string;
    guestHonorTitleId: string;
    guestHonorTitleZh: string;
    guestHonorSealZh: string;
    guestHonorGreetingId: string;
    guestHonorGreetingZh: string;
    guestHonorMessageId: string;
    guestHonorMessageZh: string;
    photoCaptionTitleId: string;
    photoCaptionTitleZh: string;
    photoCaptionDate: string;
    photoCaptionDescId: string;
    photoCaptionDescZh: string;
    commemorativeRibbon: string;
    countdownHeadingId: string;
    countdownHeadingZh: string;
    countdownSubtextId: string;
    countdownSubtextZh: string;
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
