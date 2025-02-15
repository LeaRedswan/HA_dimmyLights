





# Dimmy Light Control

A Home Assistant integration for controlling PWM channels through a PCA9685 controller.

## Features
- Control 7 individual PWM channels (0-6)
- Slider control for precise values (0-255)
- Quick preset buttons (0%, 10%, 25%, 50%, 75%, 100%)
- Easy-to-use Home Assistant custom card

## Installation

### 1. Install the Addon
1. Copy the addon files to `/root/addons/dimmy/`:
   - `api.py` - Flask API endpoints
   - `dimmy.py` - PCA9685 controller interface
   - `Dockerfile` - Container configuration
   - `run.sh` - Startup script
   - `config.yaml` - Addon configuration

2. Install from Home Assistant:
   - Settings → Add-ons
   - Add-on Store → Local Add-ons
   - Find "Dimmy Light Control"
   - Click INSTALL and START

### 2. Install the Custom Card
1. Create directory:
```bash
mkdir -p /config/www/custom_cards
```

2. Copy the card file:
```bash
cp api-light-card.js /config/www/custom_cards/
```

3. Add to `configuration.yaml`:
```yaml
frontend:
  extra_module_url:
    - /local/custom_cards/api-light-card.js
```

4. Restart Home Assistant

## Usage

### Adding the Card
1. Edit dashboard
2. Click "+ Add Card"
3. Search for "Custom: API Light Card"
4. Configure:
```yaml
type: 'custom:api-light-card'
api_base_url: 'http://your-ip:5000'
```

## Hardware Requirements
- PCA9685 PWM controller (I used the one from VanPI)[https://pekaway.de/collections/alle-produkte/products/van-pi-dimmy-pcb]
- I2C connection to Home Assistant host

## Support
For issues and feature requests, please open an issue on GitHub.

## License
MIT License