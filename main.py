from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://nkeembihacnppfbpndgadilgihkcpdmj"],  # Adjust the origin as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model for the expected data structure
class TestScriptData(BaseModel):
    script: str

@app.post("/submit-test-script")
async def receive_test_script(data: TestScriptData):
    try:
        # Extract the test script from the request
        test_script = data.script

        # Define the filename as test.spec.ts
        filename = "test.spec.ts"

        # Save the test script to a .ts file in the current working directory
        with open(filename, 'w') as f:
            f.write(test_script)

        return {"message": "Test spec file created and saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
