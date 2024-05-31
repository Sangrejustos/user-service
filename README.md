rename .env.example => .env

npm install
docker-compose up -d
npx prisma migrate dev
npm run start:dev