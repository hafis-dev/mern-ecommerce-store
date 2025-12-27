

export const CATEGORY_GROUPS = [
  {
    label: "Fashion Accessories",
    icon: "👜",
    items: [
      { name: "Wallet", icon: "👛" },
      { name: "Watch", icon: "⌚" },
      { name: "Glass", icon: "🕶️" },
      { name: "Bag", icon: "👜" },
      { name: "Belt", icon: "🧢" },
      { name: "Cap", icon: "🧢" },
      { name: "Sunglasses", icon: "😎" },
      { name: "Perfume", icon: "🌸" },
    ],
  },

  {
    label: "Clothing",
    icon: "👕",
    items: [
      { name: "T-Shirt", icon: "👕" },
      { name: "Shirt", icon: "👔" },
      { name: "Jeans", icon: "👖" },
      { name: "Jacket", icon: "🧥" },
      { name: "Hoodie", icon: "🥼" },
      { name: "Sweatshirt", icon: "🎽" },
      { name: "Shorts", icon: "🩳" },
    ],
  },

  {
    label: "Footwear",
    icon: "👟",
    items: [
      { name: "Shoes", icon: "👟" },
      { name: "Sandals", icon: "🩴" },
      { name: "Slippers", icon: "🩴" },
      { name: "Boots", icon: "🥾" },
    ],
  },

  {
    label: "Electronics",
    icon: "🔌",
    items: [
      { name: "Earbuds", icon: "🎧" },
      { name: "Headphones", icon: "🎧" },
      { name: "Smartwatch", icon: "⌚" },
    ],
  },

  {
    label: "Jewelry",
    icon: "💍",
    items: [
      { name: "Bracelet", icon: "📿" },
      { name: "Necklace", icon: "📿" },
      { name: "Ring", icon: "💍" },
    ],
  },

  {
    label: "Home & Lifestyle",
    icon: "🏡",
    items: [
      { name: "Mug", icon: "☕" },
      { name: "Bottle", icon: "🥤" },
      { name: "Backpack", icon: "🎒" },
    ],
  },
];


export const CATEGORY_OPTIONS = CATEGORY_GROUPS.flatMap((group) =>
  group.items.map((item) => item.name)
);
