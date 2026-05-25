# DigitalCloset - Virtual Wardrobe & Outfit Builder

DigitalCloset is a premium full-stack web application designed to help users manage their personal wardrobe digitally and orchestrate professional outfits using a high-fidelity layered persona system.

## Features

- **PNG-Layered Persona System**: Replaced abstract silhouettes with high-quality mannequin bases. Visualize garments in real-time with precise Z-index layering (Tops, Bottoms, Shoes, Outerwear, Accessories).
- **High-Density Virtual Closet**: Efficiently manage hundreds of garments with a compact, responsive grid. Features instant search, category filtering, and a personalized Favorites system.
- **Advanced Modular Outerwear**: Redesigned jacket system with AI-powered segmentation, allowing independent sleeve manipulation and realistic "open-jacket" layering.
- **Precision Footwear Engine**: Specialized shoe studio supporting symmetrical/asymmetrical pairs with independent left/right fitting.
- **Local Style Orchestration**: Create, save, duplicate, and edit outfit combinations. Uses a hybrid storage approach with local persistence for rapid style iteration.
- **Cloudinary Integration**: Secure, direct-to-cloud image uploads with real-time previews and automatic metadata synchronization.
- **Modern "Fashion-Tech" UI**: A dark luxury aesthetic built with Framer Motion for cinematic transitions, glass-morphic elements, and studio-grade lighting effects.

## Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.3.0**
- **Spring Security** & **JWT** for secure authentication
- **PostgreSQL** for core data persistence
- **RESTful API** architecture with feature-based modularity

### Frontend
- **React 19** with **TypeScript**
- **Vite** for optimized development and bundling
- **Zustand** for state management (Auth, Clothing, Outfits)
- **Framer Motion** for layered rendering and UI orchestration
- **Tailwind CSS** for professional-grade responsive styling
- **Lucide React** for consistent minimalist iconography

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Configure your PostgreSQL database in `src/main/resources/application.properties`.
3. Run `./mvnw spring-boot:run`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Set up `.env` with your Cloudinary credentials.
4. Run development server: `npm run dev`.

## Project Status

- **Phase 1: Backend Foundation**: Completed (Auth, User, Clothing APIs).
- **Phase 2: Core Frontend**: Completed (Dashboard, Integration with APIs).
- **Phase 3: Image Infrastructure**: Completed (Cloudinary integration, interactive uploads).
- **Phase 4: Persona Evolution**: Completed (PNG-based layering, 2D mannequin system).
- **Phase 5: Wardrobe Management**: Completed (High-density closet, Search, Favorites, Full Management Page).
- **Phase 6: Style Orchestration**: Completed (Local Outfit Store, Multi-page navigation flow).
- **Phase 7: Fabric Studio Evolution**: Completed (Fabric.js 2D Editor, Absolute Virtual Engine, High-Precision Cropping).
- **Phase 8: Multi-Item Architecture**: Completed (Layered Equipping, Array-based item slots, Independent Shoe Pairs).
- **Phase 9: Modular Fashion AI**: Completed (Transformers.js Segmentation, Mesh Warping/Puppet Warp, Dynamic Center Opening Masks).
