export const birthdayConfig = {
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
  },
  timeline: {
    heading: "The little things we remember",
    intro: "A place for the dates, stories, and photographs that mean something.",
    placeholders: [
      { id: "placeholder-1", date: "", title: "A moment worth keeping", description: "Replace this with the story behind a favourite memory.", image: "" },
      { id: "placeholder-2", date: "", title: "One of our favourite days", description: "Add what happened, why it mattered, and the little details you remember.", image: "" },
      { id: "placeholder-3", date: "", title: "A memory to come back to", description: "Write a personal note here and choose the photograph that belongs with it.", image: "" },
    ],
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
