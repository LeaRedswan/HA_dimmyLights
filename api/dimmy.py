import logging
from PCA9685_smbus2 import PCA9685

# Configure logging
logging.basicConfig(level=logging.INFO)

class Dimmy:
    def __init__(self, i2c_interface=1, address=0x40, frequency=300):
        self.pwm = None
        self.channel_states = [0] * 7
        try:
            self.pwm = PCA9685.PCA9685(i2c_interface, address)
            self.pwm.set_pwm_freq(frequency)
            self.pwm.set_all(0)
            logging.info(f"Initialized PCA9685 with address {address} and frequency {frequency} on I2C interface {i2c_interface}")
        except Exception as e:
            logging.error(f"Failed to initialize PCA9685: {e}")

    def set(self, channel, value):
        if self.pwm is None:
            logging.error("PCA9685 is not initialized")
            return
        try:
            self.pwm.set_pwm(channel, 0, value)
            self.channel_states[channel] = value
            logging.info(f"Set channel {channel} to value {value}")
        except Exception as e:
            logging.error(f"Failed to set channel {channel} to value {value}: {e}")
    
    def set_all(self, value, channel_count=7):
        if self.pwm is None:
            logging.error("PCA9685 is not initialized")
            return
        try:
            for i in range(channel_count):
                self.set(i, value)
            logging.info(f"Set all channels to value {value}")
        except Exception as e:
            logging.error(f"Failed to set all channels to value {value}: {e}")
