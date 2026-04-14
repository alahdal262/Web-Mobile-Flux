/**
 * Template widget configurations — organized by business type.
 * Each template produces a distinct widget layout in the builder canvas.
 */

type TemplateWidgetType =
  | "banner" | "imageSlider" | "productGrid" | "categoryList"
  | "searchBar" | "textBlock" | "videoPlayer" | "button"
  | "divider" | "htmlBlock" | "blogPosts" | "map";

export interface TemplateWidgetDef {
  type: TemplateWidgetType;
  config: Record<string, unknown>;
}

export interface TemplateConfig {
  templateId: number;
  homeWidgets: TemplateWidgetDef[];
}

// ════════════════════════════════════════════════════════════════
// NEWS & MAGAZINE — for news sites, media outlets, wire services
// ════════════════════════════════════════════════════════════════

const newsClassic: TemplateConfig = {
  templateId: 0,
  homeWidgets: [
    { type: "banner", config: { title: "Breaking News", subtitle: "Stay informed 24/7", backgroundColor: "#1e3a5f", imageUrl: "https://picsum.photos/seed/news-classic/800/400", height: 200 } },
    { type: "categoryList", config: { categories: ["Politics", "World", "Economy", "Sports", "Tech", "Health"], showIcon: true, showChevron: true } },
    { type: "blogPosts", config: { count: 8, showImage: true, showDate: true, showExcerpt: true } },
    { type: "divider", config: { thickness: 1, color: "#e2e8f0", margin: 12 } },
    { type: "textBlock", config: { content: "Your trusted news source", fontSize: 11, alignment: "center", color: "#94a3b8" } },
  ],
};

const newsDark: TemplateConfig = {
  templateId: 1,
  homeWidgets: [
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/dark1/800/400", "https://picsum.photos/seed/dark2/800/400", "https://picsum.photos/seed/dark3/800/400"], autoPlay: true, interval: 4000, height: 220 } },
    { type: "categoryList", config: { categories: ["Technology", "Science", "AI", "Startups", "Crypto"], showIcon: true, showChevron: false } },
    { type: "blogPosts", config: { count: 6, showImage: true, showDate: true, showExcerpt: true } },
    { type: "textBlock", config: { content: "Technology & Innovation Hub", fontSize: 10, alignment: "center", color: "#64748b" } },
  ],
};

const newsMagazine: TemplateConfig = {
  templateId: 2,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Search articles...", backgroundColor: "#f1f5f9", borderRadius: 24 } },
    { type: "banner", config: { title: "Cover Story", subtitle: "This week's top story", backgroundColor: "#7c2d12", imageUrl: "https://picsum.photos/seed/magazine/800/500", height: 240 } },
    { type: "textBlock", config: { content: "EDITOR'S PICKS", fontSize: 11, alignment: "left", color: "#dc2626" } },
    { type: "blogPosts", config: { count: 5, showImage: true, showDate: true, showExcerpt: true } },
    { type: "divider", config: { thickness: 2, color: "#991b1b", margin: 8 } },
    { type: "blogPosts", config: { count: 4, showImage: false, showDate: true, showExcerpt: false } },
  ],
};

const newsMinimal: TemplateConfig = {
  templateId: 5,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "What are you looking for?", backgroundColor: "#f8fafc", borderRadius: 12 } },
    { type: "blogPosts", config: { count: 10, showImage: true, showDate: true, showExcerpt: true } },
    { type: "textBlock", config: { content: "That's your daily brief.", fontSize: 12, alignment: "center", color: "#94a3b8" } },
  ],
};

// ════════════════════════════════════════════════════════════════
// BLOG — for personal blogs, content creators, writers
// ════════════════════════════════════════════════════════════════

const blogPersonal: TemplateConfig = {
  templateId: 6,
  homeWidgets: [
    { type: "banner", config: { title: "My Blog", subtitle: "Thoughts, stories, and ideas", backgroundColor: "#4338ca", imageUrl: "https://picsum.photos/seed/blog-personal/800/400", height: 180 } },
    { type: "blogPosts", config: { count: 5, showImage: true, showDate: true, showExcerpt: true } },
    { type: "divider", config: { thickness: 1, color: "#e5e7eb", margin: 16 } },
    { type: "textBlock", config: { content: "Thanks for reading! Subscribe for updates.", fontSize: 13, alignment: "center", color: "#6366f1" } },
    { type: "button", config: { label: "Subscribe", color: "#4338ca", textColor: "#ffffff", actionUrl: "/subscribe", fullWidth: true } },
  ],
};

const blogTravel: TemplateConfig = {
  templateId: 14,
  homeWidgets: [
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/travel-blog1/800/500", "https://picsum.photos/seed/travel-blog2/800/500", "https://picsum.photos/seed/travel-blog3/800/500"], autoPlay: true, interval: 5000, height: 240 } },
    { type: "textBlock", config: { content: "Adventures around the world", fontSize: 14, alignment: "center", color: "#166534" } },
    { type: "categoryList", config: { categories: ["Asia", "Europe", "Americas", "Africa", "Oceania"], showIcon: true, showChevron: true } },
    { type: "blogPosts", config: { count: 6, showImage: true, showDate: true, showExcerpt: true } },
    { type: "map", config: { latitude: 25.0, longitude: 55.0, zoom: 3, height: 160 } },
  ],
};

const blogLifestyle: TemplateConfig = {
  templateId: 4,
  homeWidgets: [
    { type: "banner", config: { title: "Live Well", subtitle: "Lifestyle, wellness & inspiration", backgroundColor: "#be185d", imageUrl: "https://picsum.photos/seed/lifestyle/800/400", height: 200 } },
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/life1/600/300", "https://picsum.photos/seed/life2/600/300", "https://picsum.photos/seed/life3/600/300"], autoPlay: true, interval: 3500, height: 160 } },
    { type: "blogPosts", config: { count: 6, showImage: true, showDate: true, showExcerpt: true } },
    { type: "button", config: { label: "Join the Community", color: "#be185d", textColor: "#ffffff", actionUrl: "/community", fullWidth: true } },
  ],
};

// ════════════════════════════════════════════════════════════════
// E-COMMERCE — for online stores, WooCommerce, product catalogs
// ════════════════════════════════════════════════════════════════

const shopGeneral: TemplateConfig = {
  templateId: 20,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Search products...", backgroundColor: "#f1f5f9", borderRadius: 12 } },
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/shop-hero1/800/350", "https://picsum.photos/seed/shop-hero2/800/350"], autoPlay: true, interval: 4000, height: 170 } },
    { type: "categoryList", config: { categories: ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Toys"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 6 } },
    { type: "button", config: { label: "View All Products", color: "#2563eb", textColor: "#ffffff", actionUrl: "/products", fullWidth: true } },
  ],
};

const shopFashion: TemplateConfig = {
  templateId: 21,
  homeWidgets: [
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/fashion1/800/500", "https://picsum.photos/seed/fashion2/800/500"], autoPlay: true, interval: 5000, height: 260 } },
    { type: "divider", config: { thickness: 1, color: "#e5e7eb", margin: 16 } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: false, itemCount: 4 } },
    { type: "textBlock", config: { content: "New Collection Available", fontSize: 14, alignment: "center", color: "#374151" } },
    { type: "productGrid", config: { columns: 3, showPrice: true, showRating: false, itemCount: 6 } },
  ],
};

const shopGrocery: TemplateConfig = {
  templateId: 22,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Search groceries...", backgroundColor: "#ecfdf5", borderRadius: 24 } },
    { type: "banner", config: { title: "Fresh Delivery", subtitle: "Free shipping over $50", backgroundColor: "#059669", imageUrl: "https://picsum.photos/seed/grocery/800/300", height: 140 } },
    { type: "categoryList", config: { categories: ["Fruits", "Vegetables", "Dairy", "Bakery", "Meat", "Beverages"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 8 } },
    { type: "button", config: { label: "View Cart", color: "#059669", textColor: "#ffffff", actionUrl: "/cart", fullWidth: true } },
  ],
};

const shopDigital: TemplateConfig = {
  templateId: 8,
  homeWidgets: [
    { type: "banner", config: { title: "Digital Store", subtitle: "Apps, themes, and resources", backgroundColor: "#7c3aed", imageUrl: "https://picsum.photos/seed/digital/800/300", height: 160 } },
    { type: "searchBar", config: { placeholder: "Search digital products...", backgroundColor: "#ede9fe", borderRadius: 12 } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 6 } },
    { type: "divider", config: { thickness: 1, color: "#ddd6fe", margin: 12 } },
    { type: "textBlock", config: { content: "Instant download after purchase", fontSize: 11, alignment: "center", color: "#7c3aed" } },
  ],
};

// ════════════════════════════════════════════════════════════════
// RESTAURANT & FOOD — for restaurants, cafes, food delivery, recipes
// ════════════════════════════════════════════════════════════════

const restaurantMenu: TemplateConfig = {
  templateId: 9,
  homeWidgets: [
    { type: "banner", config: { title: "Our Menu", subtitle: "Fresh food, made with love", backgroundColor: "#9a3412", imageUrl: "https://picsum.photos/seed/restaurant/800/400", height: 200 } },
    { type: "categoryList", config: { categories: ["Starters", "Main Course", "Pasta", "Desserts", "Drinks", "Specials"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 6 } },
    { type: "divider", config: { thickness: 1, color: "#fed7aa", margin: 8 } },
    { type: "map", config: { latitude: 40.7128, longitude: -74.006, zoom: 15, height: 160 } },
    { type: "button", config: { label: "Reserve a Table", color: "#9a3412", textColor: "#ffffff", actionUrl: "/reserve", fullWidth: true } },
  ],
};

const foodDelivery: TemplateConfig = {
  templateId: 11,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "What are you craving?", backgroundColor: "#fef3c7", borderRadius: 24 } },
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/delivery1/800/350", "https://picsum.photos/seed/delivery2/800/350", "https://picsum.photos/seed/delivery3/800/350"], autoPlay: true, interval: 3000, height: 170 } },
    { type: "categoryList", config: { categories: ["Pizza", "Sushi", "Burgers", "Chinese", "Healthy", "Desserts"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 6 } },
    { type: "button", config: { label: "View Cart & Order", color: "#ea580c", textColor: "#ffffff", actionUrl: "/cart", fullWidth: true } },
  ],
};

const recipeApp: TemplateConfig = {
  templateId: 12,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Search recipes...", backgroundColor: "#fff7ed", borderRadius: 20 } },
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/recipe1/800/400", "https://picsum.photos/seed/recipe2/800/400", "https://picsum.photos/seed/recipe3/800/400"], autoPlay: true, interval: 4000, height: 200 } },
    { type: "categoryList", config: { categories: ["Quick Meals", "Vegetarian", "Baking", "Grilling", "Asian", "Italian"], showIcon: true, showChevron: true } },
    { type: "blogPosts", config: { count: 6, showImage: true, showDate: false, showExcerpt: true } },
    { type: "button", config: { label: "Submit Your Recipe", color: "#f97316", textColor: "#ffffff", actionUrl: "/submit", fullWidth: true } },
  ],
};

// ════════════════════════════════════════════════════════════════
// PORTFOLIO & CREATIVE — for freelancers, agencies, photographers
// ════════════════════════════════════════════════════════════════

const portfolioClean: TemplateConfig = {
  templateId: 30,
  homeWidgets: [
    { type: "banner", config: { title: "John Doe", subtitle: "Designer & Developer", backgroundColor: "#0f172a", imageUrl: "https://picsum.photos/seed/portfolio-clean/800/400", height: 200 } },
    { type: "textBlock", config: { content: "I craft digital experiences that make a difference. Let's build something great together.", fontSize: 14, alignment: "center", color: "#64748b" } },
    { type: "productGrid", config: { columns: 2, showPrice: false, showRating: false, itemCount: 6 } },
    { type: "divider", config: { thickness: 1, color: "#e2e8f0", margin: 16 } },
    { type: "button", config: { label: "Contact Me", color: "#0f172a", textColor: "#ffffff", actionUrl: "/contact", fullWidth: true } },
  ],
};

const portfolioPhotography: TemplateConfig = {
  templateId: 31,
  homeWidgets: [
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/photo1/800/600", "https://picsum.photos/seed/photo2/800/600", "https://picsum.photos/seed/photo3/800/600"], autoPlay: true, interval: 4000, height: 280 } },
    { type: "categoryList", config: { categories: ["Weddings", "Portraits", "Nature", "Events", "Commercial"], showIcon: false, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: false, showRating: false, itemCount: 4 } },
    { type: "textBlock", config: { content: "Available for bookings worldwide", fontSize: 12, alignment: "center", color: "#6b7280" } },
    { type: "button", config: { label: "Book a Session", color: "#1f2937", textColor: "#ffffff", actionUrl: "/book", fullWidth: true } },
  ],
};

const portfolioAgency: TemplateConfig = {
  templateId: 32,
  homeWidgets: [
    { type: "banner", config: { title: "Creative Studio", subtitle: "We bring ideas to life", backgroundColor: "#4338ca", imageUrl: "https://picsum.photos/seed/agency/800/400", height: 200 } },
    { type: "textBlock", config: { content: "OUR SERVICES", fontSize: 11, alignment: "left", color: "#6366f1" } },
    { type: "productGrid", config: { columns: 3, showPrice: false, showRating: false, itemCount: 6 } },
    { type: "blogPosts", config: { count: 3, showImage: true, showDate: true, showExcerpt: true } },
    { type: "button", config: { label: "Get a Quote", color: "#4338ca", textColor: "#ffffff", actionUrl: "/quote", fullWidth: true } },
  ],
};

// ════════════════════════════════════════════════════════════════
// EDUCATION — for courses, schools, learning platforms
// ════════════════════════════════════════════════════════════════

const educationCourses: TemplateConfig = {
  templateId: 3,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Find a course...", backgroundColor: "#eff6ff", borderRadius: 12 } },
    { type: "banner", config: { title: "Learn Anything", subtitle: "1000+ courses available", backgroundColor: "#1d4ed8", imageUrl: "https://picsum.photos/seed/education/800/350", height: 170 } },
    { type: "categoryList", config: { categories: ["Programming", "Design", "Business", "Marketing", "Language", "Science"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 4 } },
    { type: "blogPosts", config: { count: 3, showImage: true, showDate: false, showExcerpt: true } },
    { type: "button", config: { label: "Browse All Courses", color: "#1d4ed8", textColor: "#ffffff", actionUrl: "/courses", fullWidth: true } },
  ],
};

const educationSchool: TemplateConfig = {
  templateId: 15,
  homeWidgets: [
    { type: "banner", config: { title: "Welcome to Our School", subtitle: "Building tomorrow's leaders", backgroundColor: "#0369a1", imageUrl: "https://picsum.photos/seed/school/800/400", height: 200 } },
    { type: "textBlock", config: { content: "ANNOUNCEMENTS", fontSize: 11, alignment: "left", color: "#0369a1" } },
    { type: "blogPosts", config: { count: 4, showImage: true, showDate: true, showExcerpt: true } },
    { type: "categoryList", config: { categories: ["Admissions", "Calendar", "Departments", "Athletics", "Library"], showIcon: true, showChevron: true } },
    { type: "map", config: { latitude: 33.749, longitude: -84.388, zoom: 15, height: 160 } },
    { type: "button", config: { label: "Apply Now", color: "#0369a1", textColor: "#ffffff", actionUrl: "/apply", fullWidth: true } },
  ],
};

// ════════════════════════════════════════════════════════════════
// SERVICE BUSINESS — for services, consulting, agencies, local businesses
// ════════════════════════════════════════════════════════════════

const serviceLocal: TemplateConfig = {
  templateId: 100,
  homeWidgets: [
    { type: "banner", config: { title: "Your Local Expert", subtitle: "Professional services you can trust", backgroundColor: "#1e40af", imageUrl: "https://picsum.photos/seed/service-local/800/350", height: 180 } },
    { type: "textBlock", config: { content: "OUR SERVICES", fontSize: 11, alignment: "left", color: "#1e40af" } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: true, itemCount: 4 } },
    { type: "blogPosts", config: { count: 3, showImage: true, showDate: true, showExcerpt: true } },
    { type: "map", config: { latitude: 34.0522, longitude: -118.2437, zoom: 14, height: 160 } },
    { type: "button", config: { label: "Book an Appointment", color: "#1e40af", textColor: "#ffffff", actionUrl: "/book", fullWidth: true } },
  ],
};

const serviceConsulting: TemplateConfig = {
  templateId: 41,
  homeWidgets: [
    { type: "banner", config: { title: "Strategic Consulting", subtitle: "Grow your business with expert guidance", backgroundColor: "#0f172a", imageUrl: "https://picsum.photos/seed/consulting/800/400", height: 200 } },
    { type: "categoryList", config: { categories: ["Strategy", "Operations", "Technology", "Finance", "Marketing"], showIcon: true, showChevron: true } },
    { type: "blogPosts", config: { count: 3, showImage: true, showDate: true, showExcerpt: true } },
    { type: "divider", config: { thickness: 1, color: "#e2e8f0", margin: 12 } },
    { type: "textBlock", config: { content: "Trusted by 500+ companies worldwide", fontSize: 12, alignment: "center", color: "#64748b" } },
    { type: "button", config: { label: "Schedule a Call", color: "#0f172a", textColor: "#ffffff", actionUrl: "/contact", fullWidth: true } },
  ],
};

const serviceRealEstate: TemplateConfig = {
  templateId: 42,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Search properties...", backgroundColor: "#f0fdf4", borderRadius: 12 } },
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/realestate1/800/400", "https://picsum.photos/seed/realestate2/800/400", "https://picsum.photos/seed/realestate3/800/400"], autoPlay: true, interval: 4000, height: 200 } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: false, itemCount: 4 } },
    { type: "map", config: { latitude: 40.7128, longitude: -74.006, zoom: 12, height: 180 } },
    { type: "button", config: { label: "Contact an Agent", color: "#15803d", textColor: "#ffffff", actionUrl: "/agents", fullWidth: true } },
  ],
};

// ════════════════════════════════════════════════════════════════
// ENTERTAINMENT & MEDIA — for streaming, music, sports, events
// ════════════════════════════════════════════════════════════════

const mediaStreaming: TemplateConfig = {
  templateId: 10,
  homeWidgets: [
    { type: "banner", config: { title: "Now Streaming", subtitle: "Thousands of movies & shows", backgroundColor: "#1e1b4b", imageUrl: "https://picsum.photos/seed/streaming/800/400", height: 220 } },
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/movie1/600/340", "https://picsum.photos/seed/movie2/600/340", "https://picsum.photos/seed/movie3/600/340"], autoPlay: true, interval: 3500, height: 180 } },
    { type: "categoryList", config: { categories: ["Action", "Comedy", "Drama", "Documentary", "Anime", "Kids"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 3, showPrice: false, showRating: true, itemCount: 6 } },
  ],
};

const mediaPodcast: TemplateConfig = {
  templateId: 40,
  homeWidgets: [
    { type: "searchBar", config: { placeholder: "Search podcasts...", backgroundColor: "#faf5ff", borderRadius: 24 } },
    { type: "banner", config: { title: "Featured Episode", subtitle: "New episodes every week", backgroundColor: "#581c87", imageUrl: "https://picsum.photos/seed/podcast/800/400", height: 180 } },
    { type: "categoryList", config: { categories: ["Technology", "Business", "Comedy", "True Crime", "Health", "Education"], showIcon: true, showChevron: true } },
    { type: "blogPosts", config: { count: 6, showImage: true, showDate: true, showExcerpt: true } },
    { type: "button", config: { label: "Subscribe", color: "#7c3aed", textColor: "#ffffff", actionUrl: "/subscribe", fullWidth: true } },
  ],
};

const mediaEvents: TemplateConfig = {
  templateId: 7,
  homeWidgets: [
    { type: "imageSlider", config: { images: ["https://picsum.photos/seed/event1/800/400", "https://picsum.photos/seed/event2/800/400", "https://picsum.photos/seed/event3/800/400"], autoPlay: true, interval: 4000, height: 220 } },
    { type: "searchBar", config: { placeholder: "Find events near you...", backgroundColor: "#fef2f2", borderRadius: 16 } },
    { type: "categoryList", config: { categories: ["Concerts", "Sports", "Theater", "Festivals", "Workshops", "Meetups"], showIcon: true, showChevron: true } },
    { type: "productGrid", config: { columns: 2, showPrice: true, showRating: false, itemCount: 4 } },
    { type: "button", config: { label: "Get Tickets", color: "#dc2626", textColor: "#ffffff", actionUrl: "/tickets", fullWidth: true } },
  ],
};

// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  // News & Magazine
  newsClassic, newsDark, newsMagazine, newsMinimal,
  // Blog
  blogPersonal, blogTravel, blogLifestyle,
  // E-Commerce
  shopGeneral, shopFashion, shopGrocery, shopDigital,
  // Restaurant & Food
  restaurantMenu, foodDelivery, recipeApp,
  // Portfolio & Creative
  portfolioClean, portfolioPhotography, portfolioAgency,
  // Education
  educationCourses, educationSchool,
  // Service Business
  serviceLocal, serviceConsulting, serviceRealEstate,
  // Entertainment & Media
  mediaStreaming, mediaPodcast, mediaEvents,
];

export function getTemplateWidgets(templateId: number): TemplateWidgetDef[] | undefined {
  return TEMPLATE_CONFIGS.find(c => c.templateId === templateId)?.homeWidgets;
}
