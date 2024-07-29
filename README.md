rename .env.example => .env

npm install

docker-compose up -d

navigate to minio server
login to minio using .env root username and password
create bucket with name "avatars"
generate access and private keys
replace mock keys in .env with generated ones

npx prisma migrate dev

npm run start:dev
