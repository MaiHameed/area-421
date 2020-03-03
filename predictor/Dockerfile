# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.7

ENV APP_HOME /app
WORKDIR $APP_HOME

# Install production dependencies.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r ./requirements.txt

# Copy local code to container image
COPY ./ ./

CMD ["python", "server.py"]