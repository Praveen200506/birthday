/**
 * Single source of truth for the birthday experience.
 * Update the copy, navigation, theme, timeline placeholders, and companion here.
 */
export const birthdayConfig = {
  site: {
    title: "Happy Birthday Sharmila",
    description: "A little world of photographs, stories, music, and memories made for Sharmila.",
    themeColor: "#FFF0E9",
    maxPhotoUploadMb: 15,
  },
  person: {
    name: "Sharmila",
    greeting: "Happy Birthday, Sharmila.",
    eyebrow: "A birthday page made just for you",
    intro: "Every photograph holds a little piece of a day we shared. I wanted to keep them all somewhere you can come back to.",
    signature: "The best moments deserve to be kept.",
  },
  navigation: [
    { label: "Home", href: "/", icon: "home" },
    { label: "Memories", href: "/memories", icon: "images" },
    { label: "Letter", href: "/letter", icon: "heart" },
    { label: "Surprise", href: "/surprise", icon: "gift" },
    { label: "Blog", href: "/blog", icon: "book-open" },
  ],
  hero: {
    photoLabel: "A favourite frame",
    sideNoteTitle: "A little collection",
    sideNote: "Not a perfect timeline. Just the moments worth keeping close.",
    galleryLabel: "The photographs",
    galleryDescription: "A few frames, a hundred little details, and stories still being written.",
    photoCta: "Explore the photographs",
    letterCta: "Read the letter",
    timelineCta: "Read the memories",
    photoModalLabel: "A moment worth keeping",
  },
  timeline: {
    heading: "The little things we remember",
    intro: "A place for the dates, stories, and photographs that mean something.",
    placeholders: [
      { id: "memory-3", date: "2025-10-01", title: "Memory 3", description: "A little moment worth keeping." },
      { id: "memory-1", date: "2026-01-01", title: "Memory 1", description: "A little moment worth keeping." },
      { id: "memory-2", date: "2026-05-01", title: "Memory 2", description: "A little moment worth keeping." },
    ],
  },
  letter: {
    salutation: "Dear Sharmila,",
    message: "Hey Happy Birthday!.. Be happy and stay strong.. I hope you get everything you want. Be you..!✨ Once again happy birthday - from your former friend",
    signOff: "from ur frnd ✨",
  },
  memories: {
    eyebrow: "Little things, forever memories",
    heading: "Our Little Universe",
    description: "A growing collection of moments worth keeping. Every new memory is saved and will be here the next time you visit.",
    emptyHeading: "A fresh page for new memories",
    emptyDescription: "No memories have been added yet. Once you upload the first photo, it will appear here and stay saved for future visits.",
  },
  mascot: {
    label: "Birthday buddy",
    ariaLabel: "Open the birthday companion",
    messages: [
      "Psst… there are more memories waiting to be explored.",
      "A little wish can make a big day even brighter.",
      "Have you read the birthday letter yet?",
      "Tap a photograph. Every frame has a story.",
    ],
    hint: "Need a hint? Tap me.",
    enabled: true,
  },
  motion: {
    ambient: true,
    floatingCompanion: true,
    photoReveal: true,
    confetti: true,
  },
  surprise: {
    eyebrow: "A little birthday ritual",
    heading: "Make a wish, Sharmila.",
    instructions: "Tap each candle to blow it out. Keep your wish close — there is a little surprise waiting at the end.",
    prompts: [
      "Make a wish for a year full of new adventures.",
      "Think of one little thing that always makes you smile.",
      "Save a wish for something you have not done yet.",
    ],
    completedTitle: "Your wish is on its way.",
    completedCopy: "The flames are out, but the celebration is just getting started.",
    modalTitle: "Happy Birthday!",
    modalWish: "May your day be as bright as your smile and as beautiful as your heart.",
    modalCopy: "May the year ahead bring you all the little things that make life wonderful.",
  },
} as const;
