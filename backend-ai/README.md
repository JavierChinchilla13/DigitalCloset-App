# Digital Closet AI Microservice

This is a lightweight Python microservice designed to provide high-accuracy background removal for clothing items using the `rembg` library (based on U2-Net).

## Requirements

- Python 3.9+
- pip

## Installation

1. Navigate to the `backend-ai` directory:
   ```bash
   cd backend-ai
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the FastAPI server using uvicorn:

```bash
python server/main.py
```

The server will start at `http://localhost:8000`.

## API Endpoints

### POST `/remove-bg`
- **Description**: Removes background from an uploaded image.
- **Input**: `multipart/form-data` with a `file` field.
- **Output**: Transparent `image/png`.

## Frontend Integration

The frontend is configured to use this service via environment variables in `frontend/.env`:

```env
# Mode: browser | api | hybrid
VITE_BG_REMOVER_MODE=hybrid
# URL for the Python microservice
VITE_BG_REMOVER_API_URL=http://localhost:8000/remove-bg
```

### Modes:
- **browser**: Only uses client-side `@imgly/background-removal`. Fast, no server needed, but uses more client RAM.
- **api**: Only uses this Python microservice. Highly accurate, offloads processing from the client.
- **hybrid**: (Default) Tries browser-based removal first, falls back to the API if the browser fails or is unsupported.

## Performance Notes

- **Accuracy**: `rembg` provides superior edge detection for complex clothing items (e.g., lace, semi-transparent fabrics) compared to most browser-based models.
- **Latency**: First request might be slow as the model (U2-Net) is downloaded and loaded into memory. Subsequent requests are fast.
- **Resources**: Uses ~500MB - 1GB of RAM depending on the image size.
