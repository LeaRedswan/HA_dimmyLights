ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements for add-on
RUN \
  apk add --no-cache \
    python3 i2c-tools py3-pip py3-rpigpio

RUN pip3 install --break-system-packages smbus2 PCA9685_smbus2 flask requests jsonify flask-cors

# Python 3 HTTP Server serves the current working dir
# So let's set it to our add-on persistent data directory.
# WORKDIR /data

# Copy data for add-on
COPY run.sh /
COPY dimmy.py /
COPY api.py /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
