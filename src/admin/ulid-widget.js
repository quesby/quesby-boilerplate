// ULID Widget for Decap CMS
// Generates automatic ULID codes for content entries

// ULID implementation
class ULID {
  static encodeTime(time, len = 10) {
    const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let str = '';
    while (len > 0) {
      str = alphabet[time % 32] + str;
      time = Math.floor(time / 32);
      len--;
    }
    return str;
  }

  static encodeRandom(len = 16) {
    const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let str = '';
    for (let i = 0; i < len; i++) {
      str += alphabet[Math.floor(Math.random() * 32)];
    }
    return str;
  }

  static generate() {
    const timestamp = Date.now();
    const timePart = this.encodeTime(timestamp);
    const randomPart = this.encodeRandom();
    return timePart + randomPart;
  }
}

// Decap CMS Widget Components
const UlidControl = createClass({
  componentDidMount: function() {
    // Generate ULID if no value exists
    if (!this.props.value) {
      const newValue = ULID.generate();
      this.props.onChange(newValue);
    }
  },

  handleGenerateNew: function() {
    const newValue = ULID.generate();
    this.props.onChange(newValue);
  },

  render: function() {
    const value = this.props.value || ULID.generate();
    
    return h('div', {
      className: 'ulid-widget',
      style: { marginBottom: '16px' }
    }, [
      h('input', {
        type: 'text',
        value: value,
        readOnly: true,
        className: 'ulid-input',
        style: {
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#f9fafb',
          fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
          fontSize: '14px',
          color: '#374151',
          cursor: 'not-allowed',
          boxSizing: 'border-box'
        }
      }),
      h('button', {
        type: 'button',
        onClick: this.handleGenerateNew,
        className: 'ulid-generate-btn',
        style: {
          marginTop: '8px',
          padding: '6px 12px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          transition: 'background-color 0.2s'
        }
      }, 'Generate New ULID'),
      h('div', {
        style: {
          marginTop: '4px',
          fontSize: '12px',
          color: '#6b7280',
          fontStyle: 'italic'
        }
      }, 'This ULID is automatically generated and cannot be edited manually.')
    ]);
  }
});

const UlidPreview = createClass({
  render: function() {
    const value = this.props.value;
    
    return h('div', {
      className: 'ulid-preview',
      style: {
        fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
        fontSize: '12px',
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        padding: '4px 8px',
        borderRadius: '3px',
        border: '1px solid #e5e7eb',
        display: 'inline-block'
      }
    }, value || 'No ULID generated');
  }
});

// Decap CMS Widget Registration
CMS.registerWidget('ulid', UlidControl, UlidPreview);

// ULID widget registered
