aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 911330909555.dkr.ecr.us-east-1.amazonaws.com
docker build -t popchat .
docker tag popchat:latest 911330909555.dkr.ecr.us-east-1.amazonaws.com/popchat:latest
docker push 911330909555.dkr.ecr.us-east-1.amazonaws.com/popchat:latest