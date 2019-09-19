import {
  createPseudoStyles,
  fixOpacity,
  presetBackgroundStyles,
  setTransitionStyles,
  kebabifyBackgroundStyles,
  fixClassName,
  escapeClassNames,
  activateCacheForComponentClass,
  createNoScriptStyles,
} from '../StyleUtils'
import { fluidShapeMock } from './mocks/Various.mock'
import { hashString } from '../HelperUtils'

global.console.debug = jest.fn()

describe(`fixOpacity()`, () => {
  it(`should return fixedOpacityProps for style prop with text content`, () => {
    const styledPropsWithText = {
      style: {
        opacity: `inherit`,
      },
    }
    const fixedOpacityProps = fixOpacity(styledPropsWithText)
    expect(fixedOpacityProps.style.opacity).toEqual(0.99)
  })

  it(`should return fixedOpacityProps for style prop with opacity of 1`, () => {
    const styledPropsOpaqueOpacity = {
      style: {
        opacity: 1,
      },
    }
    const fixedOpacityProps = fixOpacity(styledPropsOpaqueOpacity)
    expect(fixedOpacityProps.style.opacity).toEqual(0.99)
  })

  it(`shouldn't change opacityProps for style prop with opacity < .99`, () => {
    const styledPropsSmallOpacity = {
      style: {
        opacity: 0.5,
      },
    }
    const opacityProps = fixOpacity(styledPropsSmallOpacity)
    expect(opacityProps.style.opacity).toEqual(0.5)
  })

  it(`should't change opacityProps for style prop without opacity`, () => {
    const styledPropsNoOpacity = {
      style: {},
    }
    const fixedOpacityProps = fixOpacity(styledPropsNoOpacity)
    expect(fixedOpacityProps.style.opacity).toBeUndefined()
  })
})

describe(`vendorPrefixBackgroundStyles()`, () => {
  it(`should return vendor prefixed backgroundStyles with defaults`, () => {
    expect(setTransitionStyles()).toMatchSnapshot()
  })

  it(`should return vendor prefixed backgroundStyles with parameters`, () => {
    expect(setTransitionStyles(`contain`, `0.5s`)).toMatchSnapshot()
  })
})

describe(`createPseudoStyles()`, () => {
  let pseudoStyles = {}
  beforeEach(() => {
    pseudoStyles = {
      classId: `gbi`,
      className: `test`,
      backgroundSize: `cover`,
      backgroundPosition: `center`,
      backgroundRepeat: `repeat-y`,
      transitionDelay: `0.25s`,
      bgImage: `test.webp`,
      nextImage: `test.webp`,
      lastImage: `some_base64_string`,
      afterOpacity: 1,
      bgColor: `#000`,
      fadeIn: true,
    }
  })
  it(`should create styles from given pseudoStyles Object`, () => {
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without classId`, () => {
    delete pseudoStyles.classId
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without className`, () => {
    delete pseudoStyles.className
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without classId or className`, () => {
    delete pseudoStyles.classId
    delete pseudoStyles.className
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object with opacity 0`, () => {
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without fadeIn`, () => {
    pseudoStyles.fadeIn = false
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty nextImage`, () => {
    delete pseudoStyles.nextImage
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage`, () => {
    delete pseudoStyles.bgImage
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty nextImage with opacity 0`, () => {
    delete pseudoStyles.nextImage
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage with opacity 0`, () => {
    delete pseudoStyles.bgImage
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty lastImage with opacity 0`, () => {
    pseudoStyles.lastImage = ``
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage & nextImage`, () => {
    delete pseudoStyles.bgImage
    delete pseudoStyles.nextImage
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage & nextImage with opacity 0`, () => {
    delete pseudoStyles.bgImage
    delete pseudoStyles.nextImage
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })
})

describe(`createNoScriptStyles()`, () => {
  it(`should return empty string for empty config object`, () => {
    expect(createNoScriptStyles({})).toEqual(``)
  })
})

describe(`presetBackgroundStyles()`, () => {
  it(`should return defaultBackgroundStyles with empty backgroundStyles`, () => {
    const defaultBackgroundStyles = {
      backgroundPosition: `center`,
      backgroundRepeat: `no-repeat`,
      backgroundSize: `cover`,
    }

    const backgroundStyles = presetBackgroundStyles({})
    expect(backgroundStyles).toEqual(defaultBackgroundStyles)
  })
})

jest.mock('uuid/v4')
describe(`fixClassName()`, () => {
  beforeAll(() => {
    // Freeze StyleUtils#fixClassName.
    const uuid = require('uuid/v4');
    uuid.mockImplementation(() => '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000')
  });

  it(`should return empty generated className props`, () => {
    const fixedClasses = fixClassName({})
    expect(fixedClasses).toMatchInlineSnapshot(`
                  Array [
                    "",
                    "",
                  ]
            `)
  })

  it(`should return generated className on class with uuid`, () => {
    activateCacheForComponentClass(`imageClass`)
    const [fixedClasses, addedClassName] = fixClassName({
      className: `imageClass`,
      fluid: fluidShapeMock,
    })
    expect(fixedClasses).toMatchInlineSnapshot(
      `"imageClass gbi-1393017994-11bf5b37e0b842e08dcfdc8c4aefc000"`
    )
    expect(addedClassName).toMatchInlineSnapshot(`" gbi-1393017994-11bf5b37e0b842e08dcfdc8c4aefc000"`)
  })

  it(`should return generated className on existing class`, () => {
    activateCacheForComponentClass(`imageClass`)
    const [fixedClasses, addedClassName] = fixClassName({
      className: `imageClass`,
      addedClassName: `imageClass`,
      fluid: fluidShapeMock,
    })
    expect(fixedClasses).toMatchInlineSnapshot(
      `"imageClass gbi-1393017994-imageClass"`
    )
    expect(addedClassName).toMatchInlineSnapshot(`" gbi-1393017994-imageClass"`)
  })
})

describe(`escapeClassNames()`, () => {
  it(`should return undefined for empty className`, () => {
    const escapedClasses = escapeClassNames()
    expect(escapedClasses).toMatchInlineSnapshot(`undefined`)
  })

  it(`should return escaped className for Tailwind Class`, () => {
    const escapedClasses = escapeClassNames(`md:w-1/2`)
    expect(escapedClasses).toMatchInlineSnapshot(`"md\\\\:w-1\\\\/2"`)
  })

  it(`should return default escaped className for Tailwind Class without __GBI_SPECIAL_CHARS__`, () => {
    const backupSpecialChars = __GBI_SPECIAL_CHARS__
    delete global.__GBI_SPECIAL_CHARS__
    const escapedClasses = escapeClassNames(`md:w-1/2`)
    expect(escapedClasses).toMatchInlineSnapshot(`"md\\\\:w-1\\\\/2"`)
    global.__GBI_SPECIAL_CHARS__ = backupSpecialChars
  })

  it(`should return escaped className for Tailwind Class with specialChars on window`, () => {
    window._gbiSpecialChars = __GBI_SPECIAL_CHARS__
    const escapedClasses = escapeClassNames(`md:w-1/2`)
    expect(escapedClasses).toMatchInlineSnapshot(`"md\\\\:w-1\\\\/2"`)
    delete window._gbiSpecialChars
  })
})

describe(`kebabifyBackgroundStyles()`, () => {
  it(`should return string for style props with text content`, () => {
    const someStyles = `background-position: 'center';`

    const backgroundStyles = kebabifyBackgroundStyles(someStyles)
    expect(backgroundStyles).toEqual(someStyles)
  })
  it(`should return empty string without style prop`, () => {
    const backgroundStyles = kebabifyBackgroundStyles()
    expect(backgroundStyles).toEqual(``)
  })
})
