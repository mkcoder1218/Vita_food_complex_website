export type ProductCategory = "Biscuit" | "Flour";

export interface ColorVariation {
  colorCode: string;
  bgColor: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  media: {
    image: string;
    tagIcon?: string;
  };
  ui: {
    bgColor: string;
    textColor: string;
    nameColor: string;
  };
  colorVariations?: ColorVariation[];
  relatedProducts?: string[];
  content?: ProductContent;
}

export interface ProductContent {
  description?: string;
  netWeight?: string;
  nutrition?: Nutrition;
  ingredients?: Ingredients;
  certifications?: Certification[];
}

export interface Certification {
  name: string;
  image: string;
}

export interface Nutrition {
  servingSize: string;
  calories: number;
  items: NutritionItem[];
}

export interface NutritionItem {
  name: string;
  value: number;
  unit: "g" | "mg" | "kcal" | "%";
  dailyValue?: number; // %
}

export interface Ingredients {
  list: Ingredient[];
  contains?: string[];
  mayContain?: string[];
}

export interface Ingredient {
  name: string;
  type?: "main" | "additive" | "allergen";
}

const getDefaultContent = (): ProductContent => ({
  description:
    "Delicious chocolate biscuits filled with smooth, creamy goodness made for everyday enjoyment.",
  netWeight: "120g",
  nutrition: {
    servingSize: "Per 1 Piece (70 g)",
    calories: 120,
    items: [
      { name: "Fat", value: 3, unit: "g" },
      { name: "Carbohydrate", value: 3, unit: "g" },
      { name: "Protein", value: 3, unit: "g" },
      { name: "Cholesterol", value: 15, unit: "mg" },
      { name: "Sodium", value: 25, unit: "mg", dailyValue: 1 },
      { name: "Potassium", value: 125, unit: "mg", dailyValue: 3 },
      { name: "Calcium", value: 75, unit: "mg", dailyValue: 6 },
      { name: "Iron", value: 25, unit: "mg", dailyValue: 1 },
    ],
  },
  ingredients: {
    list: [
      { name: "Milk", type: "allergen" },
      { name: "Whole milk powder", type: "allergen" },
      { name: "Butter", type: "allergen" },
      { name: "Cream", type: "allergen" },
      { name: "Sugar", type: "main" },
      { name: "Canola oil", type: "main" },
      { name: "Pistachio", type: "allergen" },
      { name: "Potassium sorbate", type: "additive" },
      { name: "Citric acid", type: "additive" },
      { name: "Artificial flavours", type: "additive" },
      { name: "Spices", type: "additive" },
    ],
    contains: ["Milk", "Tree nuts (pistachio)"],
    mayContain: ["Cashew", "Almonds", "Soy", "Sesame", "Wheat"],
  },
  certifications: [
    { name: "EAS", image: "/assets/quality/figma/cert_eas.png" },
    { name: "EFDA", image: "/assets/quality/figma/cert_efda.png" },
    { name: "ISO", image: "/assets/quality/figma/cert_iso.png" },
    { name: "LRQA", image: "/assets/quality/figma/cert_lrqa.png" },
  ],
});

const getFlourContent = (
  description: string,
  servingSize: string = "Per 100g",
  calories: number = 364
): ProductContent => ({
  description,
  netWeight: "5kg",
  nutrition: {
    servingSize,
    calories,
    items: [
      { name: "Fat", value: 1, unit: "g", dailyValue: 1 },
      { name: "Carbohydrate", value: 76, unit: "g", dailyValue: 28 },
      { name: "Protein", value: 10, unit: "g", dailyValue: 20 },
      { name: "Cholesterol", value: 0, unit: "mg", dailyValue: 0 },
      { name: "Sodium", value: 2, unit: "mg", dailyValue: 0 },
      { name: "Iron", value: 4, unit: "mg", dailyValue: 22 },
      { name: "Folic Acid", value: 140, unit: "mg", dailyValue: 35 },
    ],
  },
  ingredients: {
    list: [
      { name: "Wheat", type: "main" },
      { name: "Iron", type: "additive" },
      { name: "Folic Acid", type: "additive" },
      { name: "Vitamin B12", type: "additive" },
    ],
    contains: ["Wheat"],
    mayContain: ["Soy", "Gluten"],
  },
  certifications: [
    { name: "EAS", image: "/assets/quality/figma/cert_eas.png" },
    { name: "EFDA", image: "/assets/quality/figma/cert_efda.png" },
    { name: "ISO", image: "/assets/quality/figma/cert_iso.png" },
    { name: "LRQA", image: "/assets/quality/figma/cert_lrqa.png" },
  ],
});


export const products: Product[] = [
  {
    id: "zoo",
    name: "Zoo",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/zoo-1.png",
      tagIcon: "/assets/products/tag_icons/zoo.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #FFD1DF 0%, #FFF0F5 100%)",
      textColor: "#000000",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tafach-vanilla", "cream", "oreo", "high-energy"],
    content: getDefaultContent(),
  },
  {
    id: "cream",
    name: "Cream",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/galeta-1.png",
      tagIcon: "/assets/products/tag_icons/cream.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #C4794F 0%, #8A4826 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["marie", "glucose", "digestive", "tea"],
    content: getDefaultContent(),
  },
  {
    id: "oreo",
    name: "Oreo",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/oreo-3.png",
      tagIcon: "/assets/products/tag_icons/oreo.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #1652C0 0%, #0A2B70 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["zoo", "cream", "tafach-mango", "bora"],
    content: {
      description:
        "Delicious chocolate biscuits filled with smooth, creamy goodness made for everyday enjoyment.",
      netWeight: "48g",
      nutrition: {
        servingSize: "Per 1 Piece (70 g)",
        calories: 120,
        items: [
          { name: "Fat", value: 3, unit: "g" },
          { name: "Carbohydrate", value: 3, unit: "g" },
          { name: "Protein", value: 3, unit: "g" },
          { name: "Cholesterol", value: 15, unit: "mg" },
          { name: "Sodium", value: 25, unit: "mg", dailyValue: 1 },
        ],
      },
      ingredients: {
        list: [
          { name: "Milk", type: "allergen" },
          { name: "Sugar", type: "main" },
          { name: "Canola oil" },
          { name: "Citric acid", type: "additive" },
        ],
        contains: ["Milk", "Tree nuts"],
        mayContain: ["Soy", "Sesame", "Wheat"],
      },
      certifications: [
        { name: "ISO", image: "/assets/quality/figma/cert_iso.png" },
        { name: "LRQA", image: "/assets/quality/figma/cert_lrqa.png" },
      ],
    },
  },
  {
    id: "high-energy",
    name: "High Enegry",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/galeta-1-1.png",
      tagIcon: "/assets/products/tag_icons/color_icon_13 1.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #184D2B 0%, #0B2915 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tea", "glucose", "chewata", "digestive"],
    content: getDefaultContent(),
  },
  {
    id: "tea",
    name: "Tea",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/tea-cracker.png",
      tagIcon: "/assets/products/tag_icons/tea.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #4BB543 0%, #2A7A22 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["high-energy", "digestive", "marie", "sina"],
    content: getDefaultContent(),
  },
  {
    id: "glucose",
    name: "Glucose",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/glucose-1.png",
      tagIcon: "/assets/products/tag_icons/glucose.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F5A623 0%, #C47504 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["cream", "tea", "bora", "tafach-straw"],
    content: getDefaultContent(),
  },
  {
    id: "chewata",
    name: "Chewata",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/galeta-1.png",
      tagIcon: "/assets/products/tag_icons/chewata.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #E6F5E9 0%, #C0E3C8 100%)",
      textColor: "#000000",
      nameColor: "#000000",
    },
    relatedProducts: ["digestive", "marie", "sina", "bora"],
    content: getDefaultContent(),
  },
  {
    id: "digestive",
    name: "Digestive",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/digestive-1.png",
      tagIcon: "/assets/products/tag_icons/digestive.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #385E38 0%, #1A361A 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tea", "chewata", "high-energy", "marie"],
    content: getDefaultContent(),
  },
  {
    id: "marie",
    name: "Marie",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/marie-cream-1.png",
      tagIcon: "/assets/products/tag_icons/marie.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #C22026 0%, #7A1015 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["chewata", "digestive", "cream", "sina"],
    content: getDefaultContent(),
  },
  {
    id: "sina",
    name: "Sina",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/sina-cappuccino-1.png",
      tagIcon: "/assets/products/tag_icons/sina.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #B58447 0%, #7D572B 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["bora", "tafach-vanilla", "tafach-mango", "tafach-straw"],
    content: getDefaultContent(),
  },
  {
    id: "bora",
    name: "Bora",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/bora-1.png",
      tagIcon: "/assets/products/tag_icons/bora.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F2F2F2 0%, #D4D4D4 100%)",
      textColor: "#000000",
      nameColor: "#000000",
    },
    relatedProducts: ["sina", "zoo", "oreo", "tafach-vanilla"],
    content: getDefaultContent(),
  },
  {
    id: "tafach-vanilla",
    name: "Tafach",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/tafach-vanilla.png",
      tagIcon: "/assets/products/tag_icons/tafach.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #8BC34A 0%, #558B2F 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tafach-mango", "tafach-straw", "zoo", "oreo"],
    content: getDefaultContent(),
  },
  {
    id: "tafach-mango",
    name: "Tafach",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/tafach-mango.png",
      tagIcon: "/assets/products/tag_icons/tafach.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tafach-vanilla", "tafach-straw", "cream", "bora"],
    content: getDefaultContent(),
  },
  {
    id: "tafach-straw",
    name: "Tafach",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/tafach-straw.png",
      tagIcon: "/assets/products/tag_icons/tafach.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tafach-vanilla", "tafach-mango", "sina", "glucose"],
    content: getDefaultContent(),
  },
  {
    id: "burger-flour",
    name: "Burger",
    category: "Flour",
    media: {
      image: "/assets/products/items/burger-flour-1.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)",
      textColor: "#000000",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["burger-flour-10kg", "burger-flour-15kg", "burger-flour-25kg", "burger-flour-50kg"],
    content: getFlourContent("Premium flour for making the perfect burger buns."),
  },
  {
    id: "burger-flour-10kg",
    name: "Burger Flour 10kg",
    category: "Flour",
    media: {
      image: "/assets/products/items/burger-flour-10kg.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)",
      textColor: "#000000",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["burger-flour", "burger-flour-15kg", "burger-flour-25kg", "burger-flour-50kg"],
    content: getFlourContent("Premium flour for making the perfect burger buns.", "Per 100g", 364),
  },
  {
    id: "burger-flour-15kg",
    name: "Burger Flour 15kg",
    category: "Flour",
    media: {
      image: "/assets/products/items/burger-flour-15kg.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)",
      textColor: "#000000",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["burger-flour", "burger-flour-10kg", "burger-flour-25kg", "burger-flour-50kg"],
    content: getFlourContent("Premium flour for making the perfect burger buns.", "Per 100g", 364),
  },
  {
    id: "burger-flour-25kg",
    name: "Burger Flour 25kg",
    category: "Flour",
    media: {
      image: "/assets/products/items/burger-flour-25kg.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)",
      textColor: "#000000",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["burger-flour", "burger-flour-10kg", "burger-flour-15kg", "burger-flour-50kg"],
    content: getFlourContent("Premium flour for making the perfect burger buns.", "Per 100g", 364),
  },
  {
    id: "burger-flour-50kg",
    name: "Burger Flour 50kg",
    category: "Flour",
    media: {
      image: "/assets/products/items/burger-flour-50kg.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)",
      textColor: "#000000",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["burger-flour", "burger-flour-10kg", "burger-flour-15kg", "burger-flour-25kg"],
    content: getFlourContent("Premium flour for making the perfect burger buns.", "Per 100g", 364),
  },
  {
    id: "all-purpose",
    name: "All Purpose",
    category: "Flour",
    media: {
      image: "/assets/products/items/burger-flour-1.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
      textColor: "#000000",
      nameColor: "#000000",
    },
    relatedProducts: ["burger-flour", "cream", "high-energy", "tafach-mango"],
    content: getFlourContent("Versatile flour for all your baking and cooking needs."),
  },
  {
    id: "marie-cream",
    name: "Marie Cream",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/marie-cream-1.png",
      tagIcon: "/assets/products/tag_icons/marie.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["marie", "cream", "zoo", "oreo"],
    content: getDefaultContent(),
  },
  {
    id: "tea-biscuit",
    name: "Tea Biscuit",
    category: "Biscuit",
    media: {
      image: "/assets/products/items/tea-cracker.png",
      tagIcon: "/assets/products/tag_icons/tea.png",
    },
    ui: {
      bgColor: "linear-gradient(135deg, #D4A574 0%, #8B6914 100%)",
      textColor: "#FFFFFF",
      nameColor: "#FFFFFF",
    },
    relatedProducts: ["tea", "digestive", "marie", "sina"],
    content: getDefaultContent(),
  },
];
