export const CONTACT = {
  phones: ["9841321999", "8939934999"],
  whatsapp: "919841321999",
};

export const IMAGES = {
  building: "/images/building.jpeg",
  menu: "/images/food-menu.jpeg",
  two: "/images/room-2-sharing.jpeg",
  three: "/images/room-3-sharing.jpeg",
  four: "/images/room-4-sharing.jpeg",
  lockers: "/images/room-lockers.jpeg",
};

export const GALLERY = [
  { src: IMAGES.building, caption: "Our building" },
  { src: IMAGES.two, caption: "2 sharing room" },
  { src: IMAGES.three, caption: "3 sharing room" },
  { src: IMAGES.four, caption: "4 sharing room" },
  { src: IMAGES.lockers, caption: "Individual lockable lockers" },
];

export const PRICING = [
  { type: "double", label: "2 Sharing", nonAc: 7500, ac: 12500, image: IMAGES.two },
  { type: "triple", label: "3 Sharing", nonAc: 7000, ac: 9000, image: IMAGES.three },
  { type: "four", label: "4 Sharing", nonAc: 6500, ac: 8000, image: IMAGES.four },
];

export const AMENITIES = [
  { name: "2, 3 & 4 Sharing Rooms", icon: "BedDouble" },
  { name: "AC & Non-AC Options", icon: "Snowflake" },
  { name: "3 Meals Complimentary", icon: "UtensilsCrossed" },
  { name: "Self-Cooking Kitchen", icon: "ChefHat" },
  { name: "Washing Machines", icon: "WashingMachine" },
  { name: "High-Speed Wi-Fi", icon: "Wifi" },
  { name: "Individual Lockers", icon: "Lock" },
];

export const HOUSE_RULES = [
  "Inform 30 days in advance before vacating.",
  "Enter the hostel before 10:30 PM.",
  "Drinking and smoking are strictly prohibited.",
];

export const FOOD_MENU = {
  timings: {
    breakfast: "7:45 am - 9:45 am",
    sunday: "Sunday: 9 - 10 am & 1:00 pm - 2:00 pm",
    dinner: "7:30 pm - 9:00 pm",
  },
  days: [
    ["Monday", "Pongal, Sambar", "Tomato Rice, Egg/Poriyal", "Dosai, Sambar"],
    ["Tuesday", "Kichedi, Chutney", "White Rice, Sambar, Poriyal/Appalam", "Poori/Chappathi, Kurma"],
    ["Wednesday", "Idly, Sambar", "Tamarind Rice, Poriyal", "Veg Biryani, Raitha"],
    ["Thursday", "Semiya, Chutney", "White Rice, Veg Curry, Appalam", "Idly/Noodles, Sambar"],
    ["Friday", "Pongal, Sambar", "Lemon Rice, Poriyal", "Dosai, Chutney"],
    ["Saturday", "Upma, Chutney", "White Rice, Veg Curry, Poriyal/Appalam", "Noodles/Pasta (7pm to 8:30pm)"],
    ["Sunday", "Semiya Kichedi", "White Rice, Chicken Curry, Veg Curry & Rasam", "Rice, Sambar/Rasam, Appalam"],
  ],
  notes: [
    "Food is complimentary for all those staying with us.",
    "Everyone is requested to follow the timings.",
    "Menu will change sometimes.",
  ],
};

export const FAQS = [
  {
    question: "Which room types are available?",
    answer:
      "2, 3 and 4 sharing rooms, each available as AC or Non-AC. Rent starts at Rs. 6,500 per month for a 4 sharing Non-AC bed.",
  },
  {
    question: "Is food included in the rent?",
    answer:
      "Yes. Three times homestyle food is complimentary for everyone staying with us. A kitchen is also available if you prefer to cook yourself.",
  },
  {
    question: "What is the notice period before vacating?",
    answer: "You must inform us 30 days in advance before vacating.",
  },
  {
    question: "What is the entry time?",
    answer: "Residents must enter the hostel before 10:30 PM.",
  },
  {
    question: "Can I visit before booking?",
    answer:
      "Yes. Use 'Book a Visit' to choose a date and time slot, or call us on 9841321999 / 8939934999.",
  },
];
