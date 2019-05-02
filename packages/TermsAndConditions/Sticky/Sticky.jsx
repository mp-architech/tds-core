import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Box from '@tds/core-box'
import Text from '@tds/core-text'
import FlexGrid from '@tds/core-flex-grid'
import StandaloneIcon from '@tds/core-standalone-icon'
import HairlineDivider from '@tds/core-hairline-divider'
import { colorAthensGrey } from '@tds/core-colours'
import Responsive, { media } from '@tds/core-responsive'
import withFocusTrap from '@tds/shared-with-focus-trap'
import { Transition } from 'react-transition-group'
import List from './StickyList'

const copyShape = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  close: PropTypes.string.isRequired,
})

const copyDict = {
  en: {
    heading: 'Terms and conditions',
    close: 'close',
  },
  fr: {
    heading: 'Terms and conditionsFR',
    close: 'closeFR',
  },
}

const getCopy = copy => {
  if (typeof copy === 'string') {
    return copyDict[copy]
  }
  return copy
}

const StyledSticky = styled.div(
  {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: colorAthensGrey,
    display: 'inline-block',
    boxShadow: '0 0 16px 0 rgba(213, 213, 213, 0.5)',
    transition: 'transform 500ms',
    transform: 'translateY(100%)',
    overflow: 'hidden',
    zIndex: 1000,
    ...media.from('md').css({
      top: 'auto',
      bottom: 0,
      height: 'auto',
      maxHeight: '50vh',
    }),
  },
  ({ state }) => {
    if (state === 'entering' || state === 'entered') {
      return {
        transform: 'translateY(0)',
      }
    }
    return {}
  }
)

const StyledStickyHeader = styled.div({
  position: 'relative',
  width: '100%',
})

const StyledStickyBody = styled.div({
  overflow: 'auto',
  position: 'relative',
  maxHeight: 'calc(100vh - 57px)',
  backgroundColor: colorAthensGrey,
  height: 'auto',
  ...media.from('md').css({
    maxHeight: 'calc(50vh - 57px)',
  }),
})

const StyledListContainer = styled.div({
  paddingTop: '1.5rem',
  paddingBottom: '3rem',
  ...media.from('md').css({
    paddingTop: '0rem',
    paddingBottom: '3rem',
  }),
})

const FocusTrap = withFocusTrap('div')

const Sticky = ({ copy, number, content, returnRef, onClose, isOpen }) => {
  const closeRef = useRef(null)
  const stickyRef = useRef(null)
  const headerRef = useRef(null)

  const closeSticky = e => {
    returnRef.current.focus()
    onClose(e)
  }
  // listen for ESCAPE, close button clicks, and clicks outside of the Sticky. Returns focus to returnRef and call onCloseClick
  const handleClose = e => {
    if (e.type === 'keydown') {
      const key = e.key || e.keyCode
      if (key === 'Escape' || key === 27) {
        closeSticky(e)
      }
    } else if (e.type === 'click') {
      closeSticky(e)
    } else if (e.type === 'mousedown' && stickyRef && !stickyRef.current.contains(e.target)) {
      closeSticky(e)
    }
  }

  // focus the close button on mount
  useEffect(() => {
    if (isOpen && closeRef && closeRef.current !== null) {
      closeRef.current.focus()
    }
  }, [isOpen])

  // add listeners for mouse clicks outside of Sticky and for ESCAPE key presses
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('mousedown', handleClose)
      window.addEventListener('keydown', handleClose)
    }
    return () => {
      if (isOpen) {
        window.removeEventListener('mousedown', handleClose)
        window.removeEventListener('keydown', handleClose)
      }
    }
  }, [isOpen])

  return (
    <Transition in={isOpen} timeout={500}>
      {state => (
        <StyledSticky ref={stickyRef} state={state}>
          <FocusTrap>
            <StyledStickyHeader ref={headerRef}>
              <Responsive minWidth="md" render={() => <HairlineDivider />} />
              <Box vertical={4}>
                <FlexGrid>
                  <FlexGrid.Row>
                    <FlexGrid.Col xs={12}>
                      <Box between="space-between" inline>
                        <Text bold>{getCopy(copy).heading}</Text>
                        <StandaloneIcon
                          id="close"
                          symbol="times"
                          variant="secondary"
                          onClick={handleClose}
                          a11yText={getCopy(copy).close}
                          innerRef={closeRef}
                        />
                      </Box>
                    </FlexGrid.Col>
                  </FlexGrid.Row>
                </FlexGrid>
              </Box>
              <Responsive maxWidth="md" render={() => <HairlineDivider />} />
            </StyledStickyHeader>
            <StyledStickyBody>
              <StyledListContainer>
                <FlexGrid>
                  <FlexGrid.Row>
                    <FlexGrid.Col xs={12} md={11}>
                      <List start={number}>
                        <List.Item>
                          <Text>{content}</Text>
                        </List.Item>
                      </List>
                    </FlexGrid.Col>
                  </FlexGrid.Row>
                </FlexGrid>
              </StyledListContainer>
            </StyledStickyBody>
          </FocusTrap>
        </StyledSticky>
      )}
    </Transition>
  )
}

Sticky.propTypes = {
  returnRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  copy: PropTypes.oneOfType([PropTypes.oneOf(['en', 'fr']), copyShape]),
  number: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
}

Sticky.defaultProps = {
  copy: 'en',
  isOpen: false,
}

export default Sticky