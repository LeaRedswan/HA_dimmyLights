class LightControlCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div class="card-content">
            <h2>Light Control</h2>
            
            <div class="control-section">
              <h3>Individual Channels</h3>
              <div class="channels-grid">
                ${Array.from({length: 7}, (_, i) => `
                  <div class="channel-control">
                    <div class="channel-label">Channel ${i}</div>
                    <div class="slider-container">
                      <ha-slider
                        min="0"
                        max="255"
                        value="0"
                        id="channel-${i}-slider">
                      </ha-slider>
                      <span class="slider-value" id="channel-${i}-value">0</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="control-section">
              <h3>Presets</h3>
              <div class="presets-container">
                <ha-button raised id="preset-0">
                  Off (0%)
                </ha-button>
                <ha-button raised id="preset-25">
                  10%
                </ha-button>
                <ha-button raised id="preset-63">
                  25%
                </ha-button>
                <ha-button raised id="preset-127">
                  50%
                </ha-button>
                <ha-button raised id="preset-191">
                  75%
                </ha-button>
                <ha-button raised id="preset-255">
                  100%
                </ha-button>
              </div>
            </div>
          </div>
        </ha-card>
      `;
      
      this.content = this.querySelector('ha-card');
      this.setupEventListeners();
      
      const style = document.createElement('style');
      style.textContent = `
        .control-section {
          margin: 16px 0;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
        }
        .channels-grid {
          display: grid;
          gap: 16px;
        }
        .channel-control {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .channel-label {
          font-weight: 500;
        }
        .slider-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        ha-slider {
          flex: 1;
        }
        .slider-value {
          min-width: 40px;
          text-align: right;
        }
        .all-channels-control {
          display: flex;
          gap: 8px;
          align-items: center;
          margin: 8px 0;
        }
        .helper-text {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
        .presets-container {
          display: flex;
          gap: 8px;
          margin: 8px 0;
        }
      `;
      this.appendChild(style);
    }
  }

  setupEventListeners() {
    // Setup listeners for each channel slider
    for (let i = 0; i < 7; i++) {
      const slider = this.querySelector(`#channel-${i}-slider`);
      const sliderValue = this.querySelector(`#channel-${i}-value`);
      
      slider.addEventListener('input', (e) => {
        sliderValue.textContent = e.target.value;
      });

      slider.addEventListener('change', (e) => {
        this.setChannel(i, e.target.value);
      });
    }

    // Add preset button listeners
    const presets = [
      { id: 'preset-0', value: 0 },    // 0%
      { id: 'preset-25', value: 25 },  // 10%
      { id: 'preset-63', value: 63 },  // 25%
      { id: 'preset-127', value: 127 }, // 50%
      { id: 'preset-191', value: 191 }, // 75%
      { id: 'preset-255', value: 255 }  // 100%
    ];

    presets.forEach(preset => {
      this.querySelector(`#${preset.id}`).addEventListener('click', () => {
        this.setAllChannels(preset.value);
      });
    });
  }

  setConfig(config) {
    if (!config.api_base_url) {
      throw new Error('You need to define an api_base_url');
    }
    this.config = config;
  }

  validateInput(channel, value) {
    if (channel !== undefined && (channel < 0 || channel > 6)) {
      throw new Error('Channel must be between 0 and 6');
    }
    if (value < 0 || value > 255) {
      throw new Error('Value must be between 0 and 255');
    }
  }

  async setChannel(channel, value) {
    try {
      this.validateInput(channel, value);
      const response = await fetch(`${this.config.api_base_url}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel: parseInt(channel),
          value: parseInt(value)
        })
      });
      if (!response.ok) throw new Error('Failed to set channel');
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  updateSliderValues(value) {
    for (let i = 0; i < 7; i++) {
      const slider = this.querySelector(`#channel-${i}-slider`);
      const sliderValue = this.querySelector(`#channel-${i}-value`);
      slider.value = value;
      sliderValue.textContent = value;
    }
  }

  async setAllChannels(value) {
    try {
      this.validateInput(undefined, value);
      const response = await fetch(`${this.config.api_base_url}/set_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: parseInt(value)
        })
      });
      if (!response.ok) throw new Error('Failed to set all channels');
      this.updateSliderValues(value);
    } catch (error) {
      this.showError(`Error: ${error.message}`);
    }
  }

  showError(message) {
    const statesDisplay = this.querySelector('#states-display');
    statesDisplay.textContent = message;
    statesDisplay.style.color = 'red';
  }

  static getStubConfig() {
    return {
      api_base_url: "http://your-api-host:5000"
    };
  }
}

// Change the registration to include window check
if (!customElements.get('api-light-card')) {
    customElements.define('api-light-card', LightControlCard);
}

// Add card version and name
window.customCards = window.customCards || [];
window.customCards.push({
  type: "api-light-card",
  name: "API Light Card",
  description: "Custom card for controlling lights via API"
}); 