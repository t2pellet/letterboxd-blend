FROM python:3.10-bullseye

WORKDIR /letterboxd-blend

COPY requirements.txt .

RUN pip3 install -r requirements.txt
RUN pip install --force-reinstall git+https://github.com/nmcassa/letterboxdpy.git
COPY . .

EXPOSE 8080
CMD ["waitress-serve", "--port=8080", "app:app"]