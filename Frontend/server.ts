import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Define a few initial products if not exist
const initialProducts = [
  {
    id: "dd1",
    name: "Pel Pride Inverter Refrigerator 3300 Pro",
    category: "double-door",
    price: 72000,
    originalPrice: 85000,
    discountPercentage: 15,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600"
    ],
    description: "The Pride Inverter series uses Pelican Premium compressor technology to provide Frost-Free cooling and instant ice making within 25 minutes. Features fully tempered glass shelves, anti-fungal door gasket, and low voltage operation down to 140V.",
    rating: 4.8,
    reviewsCount: 145,
    inStock: true,
    stock: 9,
    brand: "PEL",
    ordersCount: 310,
    sellerType: "official",
    isNew: true,
    isTrending: true,
    isFlashSale: true
  },
  {
    id: "dd2",
    name: "Dawlance Reflex Digital Inverter 9193-GD Slim",
    category: "double-door",
    price: 89500,
    originalPrice: 99000,
    discountPercentage: 10,
    image: "https://images.unsplash.com/photo-1571175487739-4ad331ee0cc1?auto=format&fit=crop&q=80&w=600",
    description: "Equipped with Vitamin Fresh Technology that maintains vitamin levels inside green groceries for up to 20 days. Active Odor Filter runs ozone-scrubbers silently to preserve fresh dairy textures.",
    rating: 4.9,
    reviewsCount: 220,
    inStock: true,
    stock: 12,
    brand: "Dawlance",
    ordersCount: 450,
    sellerType: "official",
    isTrending: true
  },
  {
    id: "sd1",
    name: "Haier Direct-Cool HR-135G Compact Refrigerator",
    category: "single-door",
    price: 38000,
    originalPrice: 42000,
    discountPercentage: 10,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600",
    description: "The optimal secondary refrigerating choice for master bedrooms, luxury lounge retreats, or dorm setups. Built with dynamic direct cool channels, an integrated mini-freezer zone, and premium glass door finish.",
    rating: 4.6,
    reviewsCount: 38,
    inStock: true,
    stock: 15,
    brand: "Haier",
    ordersCount: 88,
    sellerType: "official",
    isNew: true,
    isFlashSale: true
  },
  {
    id: "df1",
    name: "Waves Dual-Cabin Fast Chest Freezer DF-308",
    category: "deep-freezer",
    price: 64000,
    originalPrice: 72000,
    discountPercentage: 11,
    image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=600",
    description: "Featuring separate Dual Cabin temperature selectors. High performance copper condensers generate ice within 15 minutes. Excellent cooling retention for up to 30 hours during prolonged battery backup cycles.",
    rating: 4.7,
    reviewsCount: 89,
    inStock: true,
    stock: 14,
    brand: "Waves",
    ordersCount: 198,
    sellerType: "individual",
    isFlashSale: true
  },
  {
    id: "ac1",
    name: "Gree Pular 1.5-Ton Heat & Cool Inverter (GS-18PITH11W)",
    category: "air-conditioner",
    price: 138000,
    originalPrice: 154000,
    discountPercentage: 10,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600",
    description: "The award-winning G-10 Hybrid Inverter controls room temperatures down to 0.1C accuracy. Featuring whisper silent 3D airflow, extreme cold-plasma filters, and high-efficiency heat generation in freezing winters.",
    rating: 4.9,
    reviewsCount: 110,
    inStock: true,
    stock: 18,
    brand: "Gree",
    ordersCount: 304,
    sellerType: "official",
    isTrending: true,
    isFlashSale: true
  }
];

// Load / Seed products
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
}

// Load / Seed orders empty
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// Helper to load files
function readJSON(file: string) {
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Helper to write files
function writeJSON(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// API Routes
// 1. Get products (including persisted custom vendor additions)
app.get("/api/products", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  res.json(products);
});

// 2. Add custom product
app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  
  if (!newProduct.id || !newProduct.name || !newProduct.category) {
    return res.status(400).json({ error: "Missing required fields: id, name, category represent the baseline." });
  }

  const products = readJSON(PRODUCTS_FILE);
  products.unshift(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.status(201).json({ message: "Product created successfully", product: newProduct });
});

// 3. Remove product
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  let products = readJSON(PRODUCTS_FILE);
  const exists = products.some((p: any) => p.id === productId);
  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }
  products = products.filter((p: any) => p.id !== productId);
  writeJSON(PRODUCTS_FILE, products);
  res.json({ message: "Product removed successfully", id: productId });
});

// 4. Get checked out orders
app.get("/api/orders", (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

// 5. Submit an order
app.post("/api/orders", (req, res) => {
  const order = req.body;
  if (!order.id || !order.items || !order.total) {
    return res.status(400).json({ error: "Invalid order format. Missing total and items array." });
  }

  const orders = readJSON(ORDERS_FILE);
  orders.unshift(order);
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json({ message: "Order processed and persisted in background.", order });
});

// 6. Gemini AI Consultation Assistant: Lazy initialized client with graceful local fallback
let aiClient: any = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

app.post("/api/ai/consult", async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array." });
  }

  const userQuery = messages[messages.length - 1]?.text || "";
  const locationText = userProfile?.location || "Pakistan";
  const userRoomText = userProfile?.roomSize || "";
  const membersCount = userProfile?.familyMembers || "3-4 members";

  // Check if we can run genuine Gemini api
  try {
    const ai = getGeminiClient();
    if (ai) {
      // Craft specialized cooling consultation system parameters to respond as fridge.pk Expert Specialist
      const systemPrompt = `You are the Official AI Consultation Assistant of fridge.pk, Pakistan's leading specialized e-commerce store for smart refrigerators, deep freezers, inverter air conditioners, and kitchen coolers.
Respond to the user's inquiry with professional, friendly, and localized technical advice suited for Pakistan's environment (such as frequent load shedding, high summer temperatures exceeding 42 degrees, voltage fluctuations, solar inverter compatibility, or NEPRA electricity tariff rates).

User facts:
- Location: ${locationText}
- Selected family members load size: ${membersCount}
- Selected AC room dimensions size: ${userRoomText || "Not specified"}

Rules:
1. Provide highly localized advice in clear, beautiful Markdown paragraphs. Use bold highlighting. 
2. Recommend suitable brands such as Haier, Dawlance, PEL, waves, or Gree.
3. Keep the tone helpful, professional, and descriptive. Avoid self-praising or developer jargon.`;

      const contents = messages.map((m: any) => {
        return m.sender === "user" ? `${m.text}` : `Assistant: ${m.text}`;
      }).join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${contents}\n\nUser Question: ${userQuery}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (text) {
        return res.json({ text: text });
      }
    }
  } catch (err: any) {
    console.error("Gemini API Error, falling back to smart rule-expert system: ", err.message);
  }

  // Graceful rule-based expert system backup – extremely high utility, localized and informative!
  let reply = "";
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes("ac") || queryLower.includes("air cond") || queryLower.includes("ton") || queryLower.includes("room")) {
    reply = `### **fridge.pk AI Expert AC Recommendation** ❄️\n\nBased on your location (**${locationText}**) and specific home parameters, here are our specialized recommendations for **Inverter Air Conditioners**:\n\n1. **Room Size Determination**:\n   * *Under 120 sq ft*: A **1.0 Ton Inverter AC** (like the Gree Pular split series) is perfectly energy-efficient.\n   * *120 to 180 sq ft*: A **1.5 Ton Inverter AC** (like Gree GS-18PITH11W or Haier Pearl HSU-18HFP) is strictly recommended to achieve optimal thermal efficiency.\n   * *Over 180 sq ft*: A **2.0 Ton split system** handles large drawing rooms or open-concept kitchens.\n\n2. **Inverter Solar Compatibility**:\n   * Modern **T3 Rotary Compressors** and digital smart twin-rotary inverters run smoothly on solar batteries. On active sunny days, a 1.5Ton inverter AC can run as low as **250 to 450 Watts** (1.5 to 2.2 Amperes) once the set temperature is locked.\n\n3. **Recommended Brand Choices available on fridge.pk**:\n   * **Gree GS-18PITH11W (1.5 Ton)**: Absolute premium cooling performance with low-voltage startup support.\n   * **Haier HSU-18HFP Pearl (1.5 Ton)**: Smart self-clean mechanism reduces maintenance issues in dusty regions.\n\n*Would you like to proceed with adding one of these models to your compare sheet list?*`;
  } else if (queryLower.includes("fridge") || queryLower.includes("refrigerator") || queryLower.includes("double door") || queryLower.includes("single door")) {
    reply = `### **fridge.pk AI Expert Refrigerator Recommendation** ❄️\n\nFor family food preservation with modern low-voltage requirements in **${locationText}** for **${membersCount}**, we recommend the following energy-saving models:\n\n1. **Volumetric Sizing Advice**:\n   * **Small Families (1-2 persons)**: Haier HR-135G Single-door compact unit (perfect for master bedrooms or secondary rooms).\n   * **Medium Families (3-5 persons)**: **250 to 350 Liters** Double Door series (like the high-efficiency **Pel Pride Inverter 330Pro** or **Dawlance Reflex 9193-GD Slim**).\n   * **Large Families (6+ persons)**: Complete Luxury **Haier Digital Quad-Inverter Double Cabin** unit offering separate odor scrubbers and independent multi-vent cooling loops.\n\n2. **Energy Saving (UPS / Solar Friendly)**:\n   * Smart digital inverter compressors run on **140V to 260V auto-stabilization support**. This completely eliminates the need for expensive external voltage stabilizers and prevents damage from sudden grid power fluctuations.\n\n3. **Best Sellers**:\n   * **Pel Pride 3300 Inverter (Rs. 72,000)**: Rapid 25-minute fast-freezing with thick premium insulation panels.\n   * **Dawlance Vitamin Fresh Series (Rs. 89,500)**: Active fresh technology extends organic lifespan of fresh vegetables to 20 days.\n\n*Would you like me to guide you to the correct detail portal for these select refrigerators?*`;
  } else if (queryLower.includes("solar") || queryLower.includes("watt") || queryLower.includes("electric") || queryLower.includes("consumption") || queryLower.includes("bill") || queryLower.includes("unit")) {
    reply = `### **fridge.pk AI Energy & Solar Synergy Insights** 🌞\n\nPakistan is experiencing high-cost NEPRA tariff units. Upgrading to a specialised **smart digital inverter appliance** offers massive relief:\n\n1. **Refrigerator Consumption**:\n   * Traditional non-inverter refrigerators consume 350W - 550W continuously.\n   * Modern **Inverter Refrigerator Models** (PEL, Dawlance) run at **70W - 130W** once the internal temperature is locked, drawing less than **0.6 Amperes**. This is fully compatible with even basic **1.5 KVA solar/UPS setups**!\n\n2. **Inverter Air Conditioning Consumption**:\n   * Non-inverter ACs draw 1800W static load every time the compressor kicks on.\n   * Smart Heat & Cool inverters start softly (no sudden grid surges) and drop down to **300W - 600W** when running in ECO mode.\n\n3. **Pro-Tips for Lower Bills in Pakistan**:\n   * Switch your inverter AC to **ECO-mode / 1-Hour Sleep schedule**.\n   * Set refrigerator coolers to moderate 'Middle' level rather than 'Maximum' coldness.\n   * Do not open freezer cabins repeatedly during Peak Load Shedding stages (cool air stays sealed for up to 10 hours if untouched!).\n\n*Try out our interactive **Electricity Bill Calculator** page in the top menu to estimate your savings!*`;
  } else {
    reply = `### **Sabaq / Welcome to the fridge.pk AI Cooling Consultation Hub!** ❄️\n\nI am your specialized assistant. I can guide you on choosing the best **refrigerator**, **deep freezer**, or **inverter AC** suited to your Pakistan home requirements:\n\n*   **How do I choose the correct AC tonnage** for a bedroom vs a large drawing room in ${locationText}?\n*   **Which inverter refrigerator uses the least power** on basic UPS / Solar battery storage systems?\n*   **What is Vitamin Fresh technology** and raises grocery lifespans?\n\n*Simply tell me your room dimensions, the number of family members (**${membersCount}**), or solar goals and I will design a personalized cooling recommendation list!*`;
  }

  return res.json({ text: reply });
});

// Configure Vite integration for develop, or serve Compiled React app for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Full-Stack Dev Server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist folder...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer();
