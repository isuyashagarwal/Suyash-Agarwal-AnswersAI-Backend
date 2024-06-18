# AnswersAI Backend

This is a scaled-down version of AnswersAI Backend.

## Installation

- Clone this repository
- Navigate to the cloned repository
- Open **docker-compose.yml** and replace **YOUR OPENAI API KEY** with your own API Key.

Use [docker](https://www.docker.com/) to install this app.

```bash
docker compose up
```

## Usage

Running the above command will start the service on localhost. To use it visit:

```bash
http://localhost:3000
```

## Endpoints

- **POST /api/questions**
  - Accept user question, and return AI-generated answer.
- **GET /api/questions/:questionId**
  - Retrieve specific question and answer by question ID.
- **POST /api/users**
  - Create a new user account.
- **GET /api/users/:userId**
  - Retrieve a user profile with a given userId
- **GET /api/users/:userId/questions**

  - Retrieve all questions asked by user with a given userId

- **POST /api/auth/login:** User login endpoint.
- **POST /api/auth/logout:** User logout endpoint.
- **POST /api/auth/refresh:** Refresh access token endpoint.

## Note

I'm aware of the MongoDB cloud database URL being present in docker-compose.yml. I'm fully aware of the risks it presents but it's only there to make the testing of this service smooth. I'll change the password of the MongoDB account soon.
