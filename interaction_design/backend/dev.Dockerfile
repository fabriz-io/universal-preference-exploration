FROM python:3.8
WORKDIR /app

RUN apt-get update && apt-get -y install cmake libeigen3-dev
RUN pip install git+https://github.com/yuki-koyama/sequential-line-search

COPY requirements.txt /app/
RUN pip install -r ./requirements.txt

ENTRYPOINT [ "/bin/bash" , "-c"]
CMD [ "flask", "-app" "api", "run"]