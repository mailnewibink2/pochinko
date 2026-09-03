export const products = [
  {
    id: "p1",
    name: "OVERSIZED WOOL COAT",
    price: 185.00,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800&h=1200",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&h=1200"
    ],
    preorderInfo: {
      batchNumber: 14,
      closesAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      joinedCount: 128,
      estArrival: "Nov 15 - Nov 20"
    },
    variants: {
      colors: [
        { name: "Charcoal", hex: "#333333" },
        { name: "Camel", hex: "#C19A6B" },
        { name: "Navy", hex: "#000080" }
      ],
      sizes: ["S", "M", "L"]
    },
    details: "100% Merino Wool. Oversized fit. Dropped shoulders, wide lapels, and a removable tie belt. An editorial essential."
  },
  {
    id: "p2",
    name: "SILK CREPE BLOUSE",
    price: 95.00,
    images: [
      "https://images.unsplash.com/photo-1550614000-4b95d415d8f3?auto=format&fit=crop&q=80&w=800&h=1200",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=800&h=1200"
    ],
    preorderInfo: {
      batchNumber: 15,
      closesAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      joinedCount: 84,
      estArrival: "Nov 10 - Nov 15"
    },
    variants: {
      colors: [
        { name: "Ivory", hex: "#FFFFF0" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["XS", "S", "M"]
    },
    details: "Pure silk crepe de chine. Fluid drape, subtle sheen. Minimalist perfection."
  },
  {
    id: "p3",
    name: "TAILORED LINEN TROUSER",
    price: 110.00,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800&h=1200",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800&h=1200"
    ],
    preorderInfo: {
      batchNumber: 14,
      closesAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      joinedCount: 201,
      estArrival: "Nov 15 - Nov 20"
    },
    variants: {
      colors: [
        { name: "Oat", hex: "#E3DAC9" },
        { name: "Olive", hex: "#556B2F" }
      ],
      sizes: ["S", "M", "L", "XL"]
    },
    details: "High-waisted, wide-leg trouser in breathable European linen. Sharp front pleats."
  },
  {
    id: "p4",
    name: "LEATHER TOTE BAG",
    price: 220.00,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800&h=1200",
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800&h=1200"
    ],
    preorderInfo: {
      batchNumber: 12,
      closesAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      joinedCount: 56,
      estArrival: "Nov 01 - Nov 05"
    },
    variants: {
      colors: [
        { name: "Tan", hex: "#D2B48C" },
        { name: "Black", hex: "#000000" }
      ],
      sizes: ["One Size"]
    },
    details: "Full-grain leather. Structured silhouette with minimal hardware. Fits a 13-inch laptop."
  }
];
