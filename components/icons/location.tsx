import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M6.688 15.5a8.313 8.313 0 1 1 16.625 0 8.313 8.313 0 0 1-16.625 0ZM15 9.812a5.688 5.688 0 1 0 0 11.376 5.688 5.688 0 0 0 0-11.375Z"
      clipRule="evenodd"
    />
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M.167 13.5A14.508 14.508 0 0 1 14.622.187h.756A14.508 14.508 0 0 1 29.833 13.5a15.644 15.644 0 0 1-3.482 11.193l-8.388 10.256a3.827 3.827 0 0 1-5.925 0L3.65 24.694A15.645 15.645 0 0 1 .167 13.5ZM14.622 2.812A11.882 11.882 0 0 0 2.785 13.716a13.02 13.02 0 0 0 2.898 9.315l8.388 10.259a1.2 1.2 0 0 0 1.862 0l8.388-10.259a13.02 13.02 0 0 0 2.894-9.315A11.883 11.883 0 0 0 15.377 2.813h-.755Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default SvgComponent
