#Install the latest node dependency
FROM node:12.16.3

# Set the working directory
WORKDIR /app

# Copy root directory into docker root directory
COPY ./ ./

# Command to run upon mounting image
RUN cd client && npm install
RUN cd server && npm install
#RUN git clone https://github.com/vishnubob/wait-for-it.git

# Command to access the bash of the image
CMD ["npm", "start"]
