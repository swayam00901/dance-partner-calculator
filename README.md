# FILE: /dance-partner-calculator/dance-partner-calculator/README.md

# Dance Partner Calculator

This microservice calculates the average number of dance partners each participant will dance with based on specific inputs. It is built using Node.js and TypeScript, and it exposes a RESTful API for interaction.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/swayam00901/-eval_ballroom_advanced.git
   cd dance-partner-calculator
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Build the TypeScript files:**
   ```
   npm run build
   ```

4. **Run the application:**
   ```
   npm start
   ```

5. **Access the API:**
   The API will be available at `http://localhost:3000/calculate-partners`.

## Design Rationale

The microservice is designed to efficiently calculate dance partner matches based on the knowledge of dance styles among participants. The logic accounts for the total duration of the event and the average time spent per dance, ensuring realistic calculations.

## Example Usage

You can test the API using tools like Postman or curl. Here’s an example using curl:

```
curl -X POST http://localhost:3000/calculate-partners -H "Content-Type: application/json" -d '{
  "total_leaders": 10,
  "total_followers": 15,
  "dance_styles": ["Waltz", "Tango", "Foxtrot"],
  "leader_knowledge": {
    "1": ["Waltz", "Tango"],
    "2": ["Foxtrot"],
    "3": ["Waltz", "Foxtrot"]
  },
  "follower_knowledge": {
    "A": ["Waltz", "Tango", "Foxtrot"],
    "B": ["Tango"],
    "C": ["Waltz"]
  },
  "dance_duration_minutes": 120
}'
```

### Response

```json
{
  "average_dance_partners": 8
}
```
## New Endpoint: Dance Preferences

### GET /dance-preferences

This endpoint returns the most and least popular dance styles based on the number of dances performed during the session.

#### Example Response

```json
{
  "most_popular": "Waltz",
  "least_popular": "Foxtrot"
}
## Testing

Unit tests are included to verify the functionality of the API and the underlying logic. To run the tests, use the following command:

```
npm test
```

## Docker

To build and run the Docker container, use the following commands:

1. **Build the Docker image:**
   ```
   docker build -t dance-partner-calculator .
   ```

2. **Run the Docker container:**
   ```
   docker run -p 3000:3000 dance-partner-calculator
   ```
OR . **Build and run the Docker container:**
   ```sh
   docker-compose up --build

The API will be accessible at `http://localhost:3000/api-docs` within the Docker container.