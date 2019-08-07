import React from 'react'
import { shallow, render, mount } from 'enzyme'

import DecorativeIcon from '@tds/core-decorative-icon'
import StandaloneIcon from '@tds/core-standalone-icon'

import Notification from '../Notification'
import { warn } from '../../../shared/utils/warn'

jest.mock('../../../shared/utils/warn')

describe('<Notification />', () => {
  const defaultChildren = 'Some content'
  const doShallow = (props = {}, children = defaultChildren) =>
    shallow(<Notification {...props}>{children}</Notification>)
  const doRender = (props = {}, children = defaultChildren) =>
    render(<Notification {...props}>{children}</Notification>)
  const doMount = (props = {}, children = defaultChildren) =>
    mount(<Notification {...props}>{children}</Notification>)

  it('renders', () => {
    const notification = doRender()

    expect(notification).toMatchSnapshot()
  })

  it('can have a variant', () => {
    let notification = doMount({ variant: undefined })
    expect(notification).toMatchSnapshot()

    notification = doMount({ variant: 'success' })
    expect(notification).toMatchSnapshot()
  })

  it('does not have an icon by default', () => {
    let notification = doShallow()
    expect(notification.find(DecorativeIcon)).not.toExist()

    notification = doShallow({ variant: 'branded' })
    expect(notification.find(DecorativeIcon)).not.toExist()
  })

  it('does not have a dismiss icon by default', () => {
    const notification = doShallow()
    expect(notification.find(StandaloneIcon)).not.toExist()
  })

  describe('successful variant', () => {
    it('default text style is not bold', () => {
      const notification = doShallow({ variant: 'success' }, 'A success message')

      expect(notification.find('Paragraph').prop('bold')).toBeFalsy()
    })

    it('adds a checkmark icon', () => {
      const notification = doShallow({ variant: 'success' })

      expect(notification).toContainReact(
        <DecorativeIcon symbol="checkmark" variant="primary" size={20} />
      )
    })
  })

  describe('error variant', () => {
    it('default text style is not bold', () => {
      const notification = doShallow({ variant: 'error' }, 'An error message')

      expect(notification.find('Paragraph').prop('bold')).toBeFalsy()
    })

    it('adds an exclamation point icon', () => {
      const notification = doShallow({ variant: 'error' })

      expect(notification).toContainReact(
        <DecorativeIcon symbol="exclamationPointCircle" variant="error" size={20} />
      )
    })
  })

  it('passes additional HTML attributes to the containing element', () => {
    const notification = doShallow({ id: 'hello', title: 'my title' })

    expect(notification).toHaveProp('id', 'hello')
    expect(notification).toHaveProp('title', 'my title')
  })

  it('does not allow custom CSS', () => {
    const notification = doShallow({ className: 'my-custom-class', style: { color: 'hotpink' } })

    expect(notification).not.toHaveProp('className', 'my-custom-class')
    expect(notification).not.toHaveProp('style')
  })

  describe('dismissible', () => {
    it('adds a dismiss button', () => {
      const notification = doMount({ dismissible: true, dismissibleA11yLabel: 'Close' })
      expect(notification.find(StandaloneIcon)).toExist()
    })

    it('is accessible', () => {
      const notification = doMount({ dismissible: true, dismissibleA11yLabel: 'Close' })
      const icon = notification.find(StandaloneIcon)
      expect(icon.props().a11yText).toBe('Close')
    })

    it('should use a purple X on a default notification', () => {
      const notification = doMount({ dismissible: true, dismissibleA11yLabel: 'Close' })
      const icon = notification.find(StandaloneIcon)
      expect(icon.props().variant).toBe('secondary')
    })

    it('should use a grey X on a branded notification', () => {
      const notification = doMount({
        variant: 'branded',
        dismissible: true,
        dismissibleA11yLabel: 'Close',
      })
      const icon = notification.find(StandaloneIcon)
      expect(icon.props().variant).toBeUndefined()
    })

    it('should use a grey X on a success notification', () => {
      const notification = doMount({
        variant: 'success',
        dismissible: true,
        dismissibleA11yLabel: 'Close',
      })
      const icon = notification.find(StandaloneIcon)
      expect(icon.props().variant).toBeUndefined()
    })

    it('should use a grey X on an error notification', () => {
      const notification = doMount({
        variant: 'error',
        dismissible: true,
        dismissibleA11yLabel: 'Close',
      })
      const icon = notification.find(StandaloneIcon)
      expect(icon.props().variant).toBeUndefined()
    })
  })
  describe('onDismiss', () => {
    it('calls the provided callback when dismissible', () => {
      const onDismiss = jest.fn()
      const notification = doMount({
        variant: 'error',
        dismissible: true,
        dismissibleA11yLabel: 'Close',
        onDismiss,
      })
      notification.find(StandaloneIcon).simulate('click')
      expect(onDismiss).toHaveBeenCalled()
    })
    it('warns when the dismissible prop is false', () => {
      const onDismiss = jest.fn()
      doShallow({
        variant: 'error',
        dismissible: false,
        dismissibleA11yLabel: 'Close',
        onDismiss,
      })
      expect(warn).toHaveBeenCalled()
    })
  })
})