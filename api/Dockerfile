FROM python:3.10-alpine

COPY . /api

WORKDIR /api

RUN pip install -Iv --no-cache-dir uvicorn asyncpg psycopg2-binary
RUN pip install --no-cache-dir -r ./requirements.txt

CMD ["uvicorn", "__init__:app", "--host", "0.0.0.0", "--port", "8000"]
