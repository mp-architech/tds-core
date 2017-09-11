import React from 'react'
import { shallow, render } from 'enzyme'
import toJson from 'enzyme-to-json'

import Icon from '../../../old-components/Icon/Icon'
import ColoredTextProvider from '../../Typography/ColoredTextProvider/ColoredTextProvider'
import Paragraph from '../../Typography/Paragraph/Paragraph'
import Fade from '../Fade'
import Input from '../Input'

describe('Input', () => {
  const defaultProps = {
    label: 'The label'
  }
  const doShallow = (overrides = {}) => shallow(<Input {...defaultProps} {...overrides} />)
  const doRender = (overrides = {}) => render(<Input {...defaultProps} {...overrides} />)

  const findInputElement = input => input.find('input')
  const findWrapperElement = input => input.find('[data-testID="inputWrapper"]')

  it('renders', () => {
    const input = doRender()

    expect(toJson(input)).toMatchSnapshot()
  })

  it('renders with a feedback state and icon', () => {
    const input = doRender({ feedback: 'error' })

    expect(toJson(input)).toMatchSnapshot()
  })

  it('supports different input types', () => {
    let input = doShallow()
    expect(findInputElement(input)).toHaveProp('type', 'text')

    input = doShallow({ type: 'number' })
    expect(findInputElement(input)).toHaveProp('type', 'number')
  })

  it('must have a label', () => {
    const input = doShallow({ label: 'The label' })

    expect(input.find('label')).toHaveText('The label')
  })

  describe('connecting the label to the input', () => {
    it('connects the label to the input', () => {
      const input = doShallow()

      const label = input.find('label')
      const inputElement = findInputElement(input)

      expect(label.prop('htmlFor')).toEqual(inputElement.prop('id'))
    })

    it('uses the id when provided', () => {
      const input = doShallow({ id: 'the-id', name: 'the-name', label: 'The label' })

      expect(input.find('label')).toHaveProp('htmlFor', 'the-id')
      expect(findInputElement(input)).toHaveProp('id', 'the-id')
    })

    it('uses the name when no id is provided', () => {
      const input = doShallow({ name: 'the-name', label: 'The label' })

      expect(input.find('label')).toHaveProp('htmlFor', 'the-name')
      expect(findInputElement(input)).toHaveProp('id', 'the-name')
    })

    it('generates an id from the label when no id or name is provided', () => {
      const input = doShallow({ label: 'The label' })

      expect(input.find('label')).toHaveProp('htmlFor', 'the-label')
      expect(findInputElement(input)).toHaveProp('id', 'the-label')
    })
  })

  describe('editability', () => {
    it('supports string values or number values', () => {
      let input = doShallow()
      expect(findInputElement(input)).toHaveValue('')

      input = doShallow({ value: 'some value' })
      expect(findInputElement(input)).toHaveValue('some value')

      input = doShallow({ value: 55 })
      expect(findInputElement(input)).toHaveValue(55)
    })

    it('has a value that can be changed', () => {
      const inputField = doShallow({ value: 'initial value' })
      inputField.find('input').simulate('change', { target: { value: 'new value' } })

      expect(inputField.find('input')).toHaveValue('new value')
    })

    it('will notify when its value changes', () => {
      const onChangeMock = jest.fn()

      const inputField = doShallow({ onChange: onChangeMock })
      inputField.find('input').simulate('change', { target: { value: 'new value' } })

      expect(onChangeMock).toHaveBeenCalledWith({ target: { value: 'new value' } })
      expect(inputField.find('input')).toHaveValue('new value')
    })

    it('can receive a new value from a parent component', () => {
      const input = doShallow({ value: 'initial value' })
      expect(findInputElement(input)).toHaveValue('initial value')

      input.setProps({ value: 'new value' })

      expect(findInputElement(input)).toHaveValue('new value')
    })
  })

  describe('focusing', () => {
    it('can be focused', () => {
      const input = doShallow()

      expect(findWrapperElement(input)).toHaveClassName('default')

      findInputElement(input).simulate('focus')
      expect(findWrapperElement(input)).toHaveClassName('focused')

      findInputElement(input).simulate('blur')
      expect(findWrapperElement(input)).not.toHaveClassName('focused')
    })

    it('will notify when focus is gained', () => {
      const onFocusMock = jest.fn()

      const input = doShallow({ onFocus: onFocusMock })
      findInputElement(input).simulate('focus', { target: { value: 'the value' } })

      expect(onFocusMock).toHaveBeenCalledWith({ target: { value: 'the value' } })
    })

    it('will notify when focus is lost', () => {
      const onBlurMock = jest.fn()

      const input = doShallow({ onBlur: onBlurMock })
      findInputElement(input).simulate('blur', { target: { value: 'the value' } })

      expect(onBlurMock).toHaveBeenCalledWith({ target: { value: 'the value' } })
    })
  })

  describe('feedback states', () => {
    it('can have a success feedback state', () => {
      const input = doShallow({ feedback: 'success' })

      expect(findWrapperElement(input)).toHaveClassName('success')
      expect(input.find(Fade).dive().dive()).toContainReact(<Icon glyph="checkmark" aria-hidden="true" />)
    })

    it('can have an error feedback state', () => {
      const input = doShallow({ feedback: 'error' })

      expect(findWrapperElement(input)).toHaveClassName('error')
      expect(input.find(Fade).dive().dive()).toContainReact(<Icon glyph="exclamation-point-circle" aria-hidden="true" />)
    })

    it('hides the feedback state while focused', () => {
      const input = doShallow({ feedback: 'success' })

      findInputElement(input).simulate('focus')
      expect(findWrapperElement(input)).not.toHaveClassName('success')

      findInputElement(input).simulate('blur')
      expect(findWrapperElement(input)).toHaveClassName('success')
    })

    it('fades the feedback icon in on focus lost and out on focus gained', () => {
      const input = doShallow({ feedback: 'success' })

      expect(input.find(Fade)).toHaveProp('in', true)

      findInputElement(input).simulate('focus')
      expect(input.find(Fade)).toHaveProp('in', false)
    })
  })

  it('can be disabled', () => {
    let input = doShallow()
    expect(findWrapperElement(input)).not.toHaveClassName('disabled')
    expect(findInputElement(input)).not.toBeDisabled()

    input = doShallow({ disabled: true })
    expect(findWrapperElement(input)).toHaveClassName('disabled')
    expect(findInputElement(input)).toBeDisabled()
  })

  it('can have an error message', () => {
    const input = doShallow({ error: 'Oh no a terrible error!' })

    expect(input).toContainReact(
      <ColoredTextProvider colorClassName="errorText">
        <Paragraph>Oh no a terrible error!</Paragraph>
      </ColoredTextProvider>
    )
  })

  it('passes additional attributes to the input element', () => {
    const input = doShallow({ name: 'a name', placeholder: 'a placeholder' })

    expect(findInputElement(input)).toHaveProp('name', 'a name')
    expect(findInputElement(input)).toHaveProp('placeholder', 'a placeholder')
  })

  it('does not allow custom CSS', () => {
    const input = doShallow({ className: 'my-custom-class', style: { color: 'hotpink' } })

    expect(findInputElement(input)).not.toHaveProp('className', 'my-custom-class')
    expect(findInputElement(input)).not.toHaveProp('style')
  })

  describe('accessibility', () => {
    it('marks the input as invalid when in the error feedback state')
    it('connects the error message to the input field for screen readers')
  })
})
