from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as authRouter
from routes.tasks import router as tasksRouter

allowed_origins = [  # for CORS
    "http://localhost",
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authRouter)
app.include_router(tasksRouter)
