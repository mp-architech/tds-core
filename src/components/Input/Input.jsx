import React from 'react'
import PropTypes from 'prop-types'

import Icon from '../../old-components/Icon/Icon'
import ColoredTextProvider from '../Typography/ColoredTextProvider/ColoredTextProvider'
import Paragraph from '../Typography/Paragraph/Paragraph'
import Fade from './Fade'
import safeRest from '../../safeRest'

import styles from './Input.modules.scss'

const textToId = text => text.toLowerCase().replace(/ /g, '-')

const getWrapperClassName = (feedback, focused, disabled) => {
  if (disabled) {
    return styles.disabled
  }

  if (focused) {
    return styles.focused
  }

  if (feedback) {
    return styles[feedback]
  }

  return styles.default
}

const iconByFeedbackState = {
  success: 'checkmark',
  error: 'exclamation-point-circle'
}
const showFeedbackIcon = (feedback, focused) => (feedback === 'success' || feedback === 'error') && !focused

class Input extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value,
      focused: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  onChange = (event) => {
    const { onChange } = this.props

    this.setState({
      value: event.target.value
    })

    if (onChange) {
      onChange(event)
    }
  }

  onFocus = (event) => {
    const { onFocus } = this.props

    this.setState({ focused: true })

    if (onFocus) {
      onFocus(event)
    }
  }

  onBlur = (event) => {
    const { onBlur } = this.props

    this.setState({ focused: false })

    if (onBlur) {
      onBlur(event)
    }
  }

  render() {
    const { type, label, feedback, error, ...rest } = this.props

    const id = rest.id || rest.name || textToId(label)
    const wrapperClassName = getWrapperClassName(feedback, this.state.focused, rest.disabled)
    const showIcon = showFeedbackIcon(feedback, this.state.focused)

    return (
      <div>
        <label htmlFor={id} className={styles.label}>{label}</label>

        { error &&
          <div className={styles.errorMessage}>
            <ColoredTextProvider colorClassName={styles.errorText}>
              <Paragraph>{error}</Paragraph>
            </ColoredTextProvider>
          </div>
        }

        <div className={wrapperClassName} data-testID="inputWrapper">
          <input
            {...safeRest(rest)} id={id} type={type} className={styles.input}
            value={this.state.value}
            onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}
          />

          <Fade timeout={100} in={showIcon} mountOnEnter={true} unmountOnExit={true}>
            { () => (
              <span className={styles.icon}>
                <Icon glyph={iconByFeedbackState[feedback]} aria-hidden="true" />
              </span>
            )}
          </Fade>
        </div>
      </div>
    )
  }
}

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'number', 'password']), // TODO: finish this list
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  feedback: PropTypes.oneOf(['success', 'error']),
  error: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

Input.defaultProps = {
  type: 'text',
  value: '',
  feedback: undefined,
  error: undefined,
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined
}

export default Input
