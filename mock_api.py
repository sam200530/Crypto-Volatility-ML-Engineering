#!/usr/bin/env python3
"""
Simple mock API server for testing the frontend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from datetime import datetime

app = FastAPI(title="Crypto Volatility Watcher - Mock API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
MOCK_PREDICTIONS = {
    "prediction_date": "2025-10-25",
    "most_volatile_coin": "bitcoin",
    "predictions": [
        {"coin": "bitcoin", "volatility_probability": 0.85},
        {"coin": "ethereum", "volatility_probability": 0.72},
        {"coin": "binancecoin", "volatility_probability": 0.68},
        {"coin": "cardano", "volatility_probability": 0.65},
        {"coin": "solana", "volatility_probability": 0.62},
        {"coin": "polkadot", "volatility_probability": 0.58},
        {"coin": "dogecoin", "volatility_probability": 0.55},
        {"coin": "avalanche-2", "volatility_probability": 0.52},
        {"coin": "chainlink", "volatility_probability": 0.48},
        {"coin": "litecoin", "volatility_probability": 0.45},
    ],
    "confidence_stats": {
        "mean": 0.61,
        "min": 0.45,
        "max": 0.85,
        "std": 0.12
    },
    "model_type": "xgboost"
}

MOCK_COINS = [
    "bitcoin", "ethereum", "binancecoin", "cardano", "solana", 
    "polkadot", "dogecoin", "avalanche-2", "chainlink", "litecoin",
    "ripple", "tron", "stellar", "theta-token", "vechain",
    "cosmos", "algorand", "matic-network"
]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Crypto‑Volatility‑Watcher Mock API. See /predict for latest prediction."}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/predict")
def get_prediction():
    return MOCK_PREDICTIONS

@app.get("/coins")
def list_coins():
    return MOCK_COINS

@app.get("/plot/{coin}")
def get_plot(coin: str, period: str = "30d"):
    return JSONResponse(
        status_code=404,
        content={"detail": f"Mock API - Plot for {coin} ({period}) not available"}
    )

@app.get("/plot/feature_importance")
def get_feature_importance_plot():
    return JSONResponse(
        status_code=404,
        content={"detail": "Mock API - Feature importance plot not available"}
    )

if __name__ == "__main__":
    import uvicorn
    print("Starting Mock API server...")
    print("Frontend: http://localhost:3000")
    print("Mock API: http://localhost:8000")
    print("API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(app, host="127.0.0.1", port=8000)
