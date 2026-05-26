import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import uvicorn

app = FastAPI(title="Digital Closet AI - Background Removal Service")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    try:
        # Read uploaded file
        input_image = await file.read()
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Convert to BytesIO for streaming response
        output_buffer = io.BytesIO(output_image)
        
        return StreamingResponse(
            output_buffer, 
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=processed_{file.filename}.png"}
        )
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
